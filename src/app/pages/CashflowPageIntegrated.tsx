/**
 * Cashflow Page (Institutional)
 *
 * Layout requirement:
 * - Left column: companies → deals (checkbox per deal)
 * - Center: composition tree for selected deals (independent selection)
 * - Right: analytic time grid (Quarter → Month → Week → Day), with columns for deterministic / estimated / risk
 *
 * Data source:
 * - GET /cashflow/analytic (lines)
 * - GET /deals (scope list)
 */

import { useCallback, useEffect, useMemo, useState } from 'react';
import { ChevronDown, ChevronRight, RefreshCw } from 'lucide-react';

import type { ApiError, CashFlowLine, CashflowAnalyticQueryParams, Deal } from '../../types';
import { getCashflowAnalytic } from '../../services/cashflow.service';
import { listDeals } from '../../services/deals.service';

import { ErrorState, EmptyState, LoadingState } from '../components/ui';
import { FioriButton } from '../components/fiori/FioriButton';
import { FioriFlexibleColumnLayout } from '../components/fiori/FioriFlexibleColumnLayout';

import { UX_COPY } from '../ux/copy';

function parseIsoDateUtc(dateIso: string): Date {
  return new Date(`${dateIso}T00:00:00Z`);
}

function isoToday(): string {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

function addDaysIso(dateIso: string, days: number): string {
  const base = new Date(`${dateIso}T00:00:00Z`);
  base.setUTCDate(base.getUTCDate() + days);
  const yyyy = base.getUTCFullYear();
  const mm = String(base.getUTCMonth() + 1).padStart(2, '0');
  const dd = String(base.getUTCDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

function quarterKey(dateIso: string): { key: string; label: string } {
  const d = parseIsoDateUtc(dateIso);
  const year = d.getUTCFullYear();
  const month = d.getUTCMonth() + 1;
  const q = Math.floor((month - 1) / 3) + 1;
  return { key: `${year}-Q${q}`, label: `Q${q} ${year}` };
}

function monthKey(dateIso: string): { key: string; label: string } {
  const d = parseIsoDateUtc(dateIso);
  const yyyy = d.getUTCFullYear();
  const mm = String(d.getUTCMonth() + 1).padStart(2, '0');
  const label = d.toLocaleString('pt-BR', { month: 'short', year: 'numeric', timeZone: 'UTC' });
  return { key: `${yyyy}-${mm}`, label };
}

function isoWeekKey(dateIso: string): { key: string; label: string } {
  const d = parseIsoDateUtc(dateIso);

  // ISO week: weeks start Monday; week 1 contains Jan 4.
  const tmp = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
  const day = tmp.getUTCDay() || 7;
  tmp.setUTCDate(tmp.getUTCDate() + 4 - day);
  const weekYear = tmp.getUTCFullYear();
  const yearStart = new Date(Date.UTC(weekYear, 0, 1));
  const weekNo = Math.ceil(((tmp.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  const ww = String(weekNo).padStart(2, '0');
  return { key: `${weekYear}-W${ww}`, label: `W${ww} ${weekYear}` };
}

function formatIsoDate(dateIso?: string | null): string {
  if (!dateIso) return '—';
  const d = new Date(`${dateIso}T00:00:00Z`);
  if (Number.isNaN(d.getTime())) return String(dateIso);
  return d.toLocaleDateString('pt-BR', { timeZone: 'UTC' });
}

function formatUsdSigned(value?: number | null): string {
  if (typeof value !== 'number' || Number.isNaN(value) || Math.abs(value) < 1e-9) return '—';
  const abs = Math.abs(value);
  const text = abs.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
  return value < 0 ? `-${text}` : text;
}

function stripTechnicalPrefix(raw: string): string {
  return String(raw)
    .replace(/^contract:/i, '')
    .replace(/^so:/i, '')
    .replace(/^po:/i, '')
    .trim();
}

function shortenId(raw: string): string {
  const v = stripTechnicalPrefix(raw);
  if (v.length <= 18) return v;
  return `${v.slice(0, 8)}…${v.slice(-4)}`;
}

function signedAmountUsd(line: CashFlowLine): number {
  return (line.direction === 'outflow' ? -1 : 1) * Number(line.amount || 0);
}

type SelectionLeafKey = string;

type TimeBucketLevel = 'quarter' | 'month' | 'week' | 'day';

type TimeColumn = {
  key: string;
  label: string;
  level: TimeBucketLevel;
  dates: string[];
  canExpand: boolean;
  expanded: boolean;
};

type TimeTree = {
  quarters: Array<{
    key: string;
    label: string;
    dates: string[];
    months: Array<{
      key: string;
      label: string;
      dates: string[];
      weeks: Array<{ key: string; label: string; dates: string[] }>;
    }>;
  }>;
};

type CashflowConfidenceBucket = 'deterministic' | 'estimated' | 'risk';

type DealCompositionNode = {
  key: string;
  label: string;
  children?: DealCompositionNode[];
  dealId: number;
};

type GridRowKind = 'deal' | 'group-physical' | 'so' | 'po' | 'group-financial' | 'contract' | 'total';

type GridRow = {
  key: string;
  dealId?: number;
  kind: GridRowKind;
  label: string;
  level: number;
  soId?: string;
  poId?: string;
  contractId?: string;
};

function isNegative(value: number): boolean {
  return typeof value === 'number' && value < 0;
}

function dealLeafPrefix(dealId: number): string {
  return `deal:${dealId}`;
}

function soLeafKey(dealId: number, soId: string): SelectionLeafKey {
  return `${dealLeafPrefix(dealId)}:so:${soId}`;
}

function poLeafKey(dealId: number, poId: string): SelectionLeafKey {
  return `${dealLeafPrefix(dealId)}:po:${poId}`;
}

function contractLeafKey(dealId: number, contractId: string): SelectionLeafKey {
  return `${dealLeafPrefix(dealId)}:contract:${contractId}`;
}

function normalizeCompanyLabel(company?: string | null): string {
  const v = String(company || '').trim();
  return v || 'Sem empresa';
}

function dealLabel(deal: Deal): string {
  const ref = String(deal.reference_name || '').trim();
  if (ref) return ref;
  return `Deal #${deal.id}`;
}

function classifyConfidence(line: CashFlowLine): CashflowConfidenceBucket {
  const cashflowType = String(line.cashflow_type || '').toLowerCase();
  const confidence = String(line.confidence || '').toLowerCase();
  const entityType = String(line.entity_type || '').toLowerCase();
  if (cashflowType === 'risk' || confidence === 'risk' || entityType === 'exposure') return 'risk';
  if (confidence === 'estimated') return 'estimated';
  return 'deterministic';
}

function dealIdOfLine(line: CashFlowLine): number | null {
  if (line.entity_type === 'deal') {
    const id = Number(String(line.entity_id || '').trim());
    return Number.isFinite(id) ? id : null;
  }
  const pid = Number(String(line.parent_id || '').trim());
  return Number.isFinite(pid) ? pid : null;
}

function uniqSortedStrings(values: string[]): string[] {
  return Array.from(new Set(values)).sort((a, b) => a.localeCompare(b));
}

function collectLeafKeys(node: DealCompositionNode): SelectionLeafKey[] {
  if (!node.children || node.children.length === 0) return [node.key];
  return node.children.flatMap((c) => collectLeafKeys(c));
}

function computeCheckState(node: DealCompositionNode, selected: Set<SelectionLeafKey>): { checked: boolean; indeterminate: boolean } {
  const leaves = collectLeafKeys(node);
  const selectedCount = leaves.reduce((acc, k) => acc + (selected.has(k) ? 1 : 0), 0);
  if (selectedCount === 0) return { checked: false, indeterminate: false };
  if (selectedCount === leaves.length) return { checked: true, indeterminate: false };
  return { checked: false, indeterminate: true };
}

function toggleNodeLeaves(node: DealCompositionNode, selected: Set<SelectionLeafKey>, nextChecked: boolean): Set<SelectionLeafKey> {
  const next = new Set(selected);
  const leaves = collectLeafKeys(node);
  if (nextChecked) {
    for (const k of leaves) next.add(k);
  } else {
    for (const k of leaves) next.delete(k);
  }
  return next;
}

function buildCompositionTree(deal: Deal, dealLines: CashFlowLine[]): DealCompositionNode {
  const did = deal.id;
  const soIds = uniqSortedStrings(dealLines.filter((l) => l.entity_type === 'so').map((l) => String(l.entity_id)));
  const poIds = uniqSortedStrings(dealLines.filter((l) => l.entity_type === 'po').map((l) => String(l.entity_id)));
  const contractIds = uniqSortedStrings(dealLines.filter((l) => l.entity_type === 'contract').map((l) => String(l.entity_id)));

  const physicalChildren: DealCompositionNode[] = [];
  for (const id of soIds) {
    const any = dealLines.find((l) => l.entity_type === 'so' && String(l.entity_id) === id);
    const ref = String(any?.source_reference || '').trim();
    physicalChildren.push({ key: soLeafKey(did, id), label: `SO ${ref || `#${id}`}`, dealId: did });
  }
  for (const id of poIds) {
    const any = dealLines.find((l) => l.entity_type === 'po' && String(l.entity_id) === id);
    const ref = String(any?.source_reference || '').trim();
    physicalChildren.push({ key: poLeafKey(did, id), label: `PO ${ref || `#${id}`}`, dealId: did });
  }
  physicalChildren.sort((a, b) => a.label.localeCompare(b.label));

  const financialChildren: DealCompositionNode[] = [];
  for (const cid of contractIds) {
    const contractLines = dealLines.filter((l) => l.entity_type === 'contract' && String(l.entity_id) === cid);
    const ref = String(contractLines.find((l) => String(l.source_reference || '').trim())?.source_reference || '').trim();
    financialChildren.push({ key: contractLeafKey(did, cid), label: `Contrato Hedge ${ref || shortenId(cid)}`, dealId: did });
  }
  financialChildren.sort((a, b) => a.label.localeCompare(b.label));

  const rootChildren: DealCompositionNode[] = [];
  if (physicalChildren.length) {
    rootChildren.push({ key: `${dealLeafPrefix(did)}:group:physical`, label: 'Físico', dealId: did, children: physicalChildren });
  }
  if (financialChildren.length) {
    rootChildren.push({ key: `${dealLeafPrefix(did)}:group:financial`, label: 'Financeiro', dealId: did, children: financialChildren });
  }

  return { key: `${dealLeafPrefix(did)}:root`, label: dealLabel(deal), dealId: did, children: rootChildren };
}

function sumByConfidenceForDates(lines: CashFlowLine[], dates: string[]): Record<CashflowConfidenceBucket, number> {
  const dateSet = new Set(dates);
  const out: Record<CashflowConfidenceBucket, number> = { deterministic: 0, estimated: 0, risk: 0 };
  for (const l of lines) {
    const d = String(l.date);
    if (!dateSet.has(d)) continue;
    const k = classifyConfidence(l);
    out[k] += signedAmountUsd(l);
  }
  return out;
}

function sumContractSettlementByConfidenceForDates(dealLines: CashFlowLine[], contractId: string, dates: string[]): Record<CashflowConfidenceBucket, number> {
  const dateSet = new Set(dates);
  const out: Record<CashflowConfidenceBucket, number> = { deterministic: 0, estimated: 0, risk: 0 };
  for (const l of dealLines) {
    if (String(l.entity_type || '').toLowerCase() !== 'contract') continue;
    if (String(l.entity_id) !== contractId) continue;
    const d = String(l.date);
    if (!dateSet.has(d)) continue;
    const k = classifyConfidence(l);
    // Net settlement adjustment: Leg Vendida − Leg Comprada.
    out[k] += signedAmountUsd(l);
  }
  return out;
}

function parseSelectedLeafKey(key: SelectionLeafKey): { dealId: number; kind: 'so' | 'po' | 'contract'; id: string } | null {
  const m = /^deal:(\d+):(so|po|contract):(.+)$/.exec(key);
  if (!m) return null;
  return { dealId: Number(m[1]), kind: m[2] as 'so' | 'po' | 'contract', id: String(m[3]) };
}

function groupDealsByCompany(deals: Deal[]): Array<{ company: string; deals: Deal[] }> {
  const map = new Map<string, Deal[]>();
  for (const d of deals) {
    const company = normalizeCompanyLabel(d.company);
    map.set(company, [...(map.get(company) || []), d]);
  }
  const groups = Array.from(map.entries())
    .map(([company, ds]) => ({ company, deals: ds.slice().sort((a, b) => dealLabel(a).localeCompare(dealLabel(b))) }))
    .sort((a, b) => a.company.localeCompare(b.company));
  return groups;
}

function useCashflowAnalyticMulti(paramsBase: CashflowAnalyticQueryParams, dealIds: number[]) {
  const [state, setState] = useState<{ data: CashFlowLine[] | null; isLoading: boolean; isError: boolean; error: ApiError | null }>({
    data: null,
    isLoading: false,
    isError: false,
    error: null,
  });

  const queryKey = useMemo(() => {
    const ids = dealIds.slice().sort((a, b) => a - b);
    return JSON.stringify({ ...paramsBase, dealIds: ids });
  }, [paramsBase.as_of, paramsBase.end_date, paramsBase.start_date, dealIds.join(',')]);

  const fetchLines = useCallback(async () => {
    if (dealIds.length === 0) {
      setState({ data: null, isLoading: false, isError: false, error: null });
      return;
    }

    setState((prev) => ({ ...prev, isLoading: true, isError: false, error: null }));
    try {
      const ids = dealIds.slice().sort((a, b) => a - b);
      const results = await Promise.all(ids.map((deal_id) => getCashflowAnalytic({ ...paramsBase, deal_id })));
      setState({ data: results.flat(), isLoading: false, isError: false, error: null });
    } catch (err) {
      setState((prev) => ({ ...prev, isLoading: false, isError: true, error: err as ApiError }));
    }
  }, [queryKey]);

  useEffect(() => {
    fetchLines();
  }, [fetchLines]);

  return { ...state, refetch: fetchLines };
}

function CashflowScopePanel({
  groups,
  selectedDealIds,
  onToggleDeal,
  onToggleAll,
}: {
  groups: Array<{ company: string; deals: Deal[] }>;
  selectedDealIds: Set<number>;
  onToggleDeal: (dealId: number) => void;
  onToggleAll: () => void;
}) {
  const totalDeals = useMemo(() => groups.reduce((acc, g) => acc + g.deals.length, 0), [groups]);
  const checkedAll = totalDeals > 0 && selectedDealIds.size === totalDeals;
  const indeterminateAll = selectedDealIds.size > 0 && selectedDealIds.size < totalDeals;

  return (
    <div>
      <label className="flex items-center gap-2 text-sm py-2">
        <input
          type="checkbox"
          checked={checkedAll}
          ref={(el) => {
            if (el) el.indeterminate = indeterminateAll;
          }}
          onChange={onToggleAll}
        />
        <span className="font-['72:Bold',sans-serif]">Selecionar Todos</span>
      </label>

      <div className="mt-2 space-y-3">
        {groups.map((g) => (
          <div key={g.company}>
            <div className="text-xs text-[var(--sapContent_LabelColor)] font-['72:Bold',sans-serif] uppercase tracking-wide mb-1">{g.company}</div>
            <div className="space-y-1">
              {g.deals.map((d) => (
                <label key={d.id} className="flex items-center gap-2 text-sm py-1">
                  <input type="checkbox" checked={selectedDealIds.has(d.id)} onChange={() => onToggleDeal(d.id)} />
                  <span>{dealLabel(d)}</span>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CompositionTree({
  nodes,
  selected,
  expanded,
  onToggleExpanded,
  onToggleSelected,
}: {
  nodes: DealCompositionNode[];
  selected: Set<SelectionLeafKey>;
  expanded: Set<string>;
  onToggleExpanded: (key: string) => void;
  onToggleSelected: (node: DealCompositionNode, nextChecked: boolean) => void;
}) {
  const renderNode = (n: DealCompositionNode, level: number) => {
    const hasChildren = !!n.children && n.children.length > 0;
    const isExpanded = expanded.has(n.key);
    const { checked, indeterminate } = computeCheckState(n, selected);

    return (
      <div key={n.key}>
        <div className="flex items-center gap-2 py-1" style={{ paddingLeft: `${level * 14}px` }}>
          {hasChildren ? (
            <button
              type="button"
              className="w-5 h-5 inline-flex items-center justify-center text-[var(--sapContent_IconColor)]"
              onClick={() => onToggleExpanded(n.key)}
              title={isExpanded ? 'Recolher' : 'Expandir'}
            >
              {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>
          ) : (
            <span className="w-5" />
          )}

          <input
            type="checkbox"
            checked={checked}
            ref={(el) => {
              if (el) el.indeterminate = indeterminate;
            }}
            onChange={(e) => onToggleSelected(n, e.target.checked)}
          />
          <span className={level === 0 || (hasChildren && level === 1) ? "font-['72:Bold',sans-serif]" : ''}>{n.label}</span>
        </div>

        {hasChildren && isExpanded ? <div>{n.children!.map((c) => renderNode(c, level + 1))}</div> : null}
      </div>
    );
  };

  return <div className="text-sm">{nodes.map((n) => renderNode(n, 0))}</div>;
}

export function CashflowPageIntegrated() {
  const today = useMemo(() => isoToday(), []);

  const [deals, setDeals] = useState<Deal[]>([]);
  const [isLoadingDeals, setIsLoadingDeals] = useState(true);
  const [dealsError, setDealsError] = useState<ApiError | null>(null);

  const fetchDeals = useCallback(async () => {
    setIsLoadingDeals(true);
    setDealsError(null);
    try {
      const data = await listDeals();
      setDeals(data);
    } catch (err) {
      setDealsError(err as ApiError);
    } finally {
      setIsLoadingDeals(false);
    }
  }, []);

  useEffect(() => {
    fetchDeals();
  }, [fetchDeals]);

  const groupedDeals = useMemo(() => groupDealsByCompany(deals), [deals]);
  const allDealIds = useMemo(() => deals.map((d) => d.id).sort((a, b) => a - b), [deals]);

  const [selectedDealIds, setSelectedDealIds] = useState<Set<number>>(new Set());

  const toggleAllDeals = useCallback(() => {
    setSelectedDealIds((prev) => {
      const total = allDealIds.length;
      if (total > 0 && prev.size === total) return new Set();
      return new Set(allDealIds);
    });
  }, [allDealIds.join(',')]);

  const toggleDeal = useCallback((dealId: number) => {
    setSelectedDealIds((prev) => {
      const next = new Set(prev);
      if (next.has(dealId)) next.delete(dealId);
      else next.add(dealId);
      return next;
    });
  }, []);

  const [queryBase, setQueryBase] = useState<CashflowAnalyticQueryParams>(() => ({
    as_of: today,
    start_date: today,
    end_date: addDaysIso(today, 90),
  }));

  const selectedDealIdsList = useMemo(() => Array.from(selectedDealIds.values()).sort((a, b) => a - b), [selectedDealIds]);
  const cashflow = useCashflowAnalyticMulti(queryBase, selectedDealIdsList);
  const [expandedQuarters, setExpandedQuarters] = useState<Record<string, boolean>>({});
  const [expandedMonths, setExpandedMonths] = useState<Record<string, boolean>>({});
  const [expandedWeeks, setExpandedWeeks] = useState<Record<string, boolean>>({});

  const [expandedCompositionKeys, setExpandedCompositionKeys] = useState<Set<string>>(new Set());
  const [selectedLeafKeys, setSelectedLeafKeys] = useState<Set<SelectionLeafKey>>(new Set());

  const [metricVisibility, setMetricVisibility] = useState<{ mtm: boolean; estimated: boolean; risk: boolean }>(() => ({ mtm: true, estimated: false, risk: false }));

  const toggleMetric = useCallback((key: 'mtm' | 'estimated' | 'risk') => {
    setMetricVisibility((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      const any = next.mtm || next.estimated || next.risk;
      if (!any) return { ...prev, [key]: true };
      return next;
    });
  }, []);

  const visibleMetricKeys = useMemo(() => {
    const keys: Array<'mtm' | 'estimated' | 'risk'> = [];
    if (metricVisibility.mtm) keys.push('mtm');
    if (metricVisibility.estimated) keys.push('estimated');
    if (metricVisibility.risk) keys.push('risk');
    return keys;
  }, [metricVisibility.estimated, metricVisibility.mtm, metricVisibility.risk]);

  const renderSumsCell = useCallback(
    (sums: Record<CashflowConfidenceBucket, number>) => {
      const showLabels = visibleMetricKeys.length > 1;

      const entries: Array<{ key: 'mtm' | 'estimated' | 'risk'; label: string; value: number }> = visibleMetricKeys.map((k) => {
        if (k === 'mtm') return { key: k, label: 'MTM', value: sums.deterministic };
        if (k === 'estimated') return { key: k, label: 'Est.', value: sums.estimated };
        return { key: k, label: 'Risco', value: sums.risk };
      });

      return (
        <div className="flex flex-col items-end gap-0.5 leading-tight">
          {entries.map((e) => (
            <div key={e.key} className="flex items-baseline gap-2">
              {showLabels ? <span className="text-[10px] text-[var(--sapContent_LabelColor)]">{e.label}</span> : null}
              <span className={isNegative(e.value) ? 'text-[var(--sapNegativeTextColor,#bb0000)]' : ''}>{formatUsdSigned(e.value)}</span>
            </div>
          ))}
        </div>
      );
    },
    [visibleMetricKeys]
  );

  const lines: CashFlowLine[] = useMemo(() => cashflow.data || [], [cashflow.data]);

  const linesByDeal = useMemo(() => {
    const map = new Map<number, CashFlowLine[]>();
    for (const l of lines) {
      const did = dealIdOfLine(l);
      if (!did) continue;
      map.set(did, [...(map.get(did) || []), l]);
    }
    return map;
  }, [lines]);

  const selectedDeals = useMemo(() => deals.filter((d) => selectedDealIds.has(d.id)), [deals, selectedDealIds]);

  const compositionTrees = useMemo(() => {
    return selectedDeals
      .map((d) => {
        const dealLines = linesByDeal.get(d.id) || [];
        return buildCompositionTree(d, dealLines);
      })
      .filter((n) => (n.children || []).length > 0);
  }, [selectedDeals, linesByDeal]);

  useEffect(() => {
    // On selection changes, default-expand the deal roots only (children remain collapsed).
    setExpandedCompositionKeys((prev) => {
      const next = new Set(prev);
      for (const n of compositionTrees) next.add(n.key);
      return next;
    });
  }, [compositionTrees.length]);

  useEffect(() => {
    // When selecting a Deal in scope, auto-select all its components (granular selection remains editable).
    setSelectedLeafKeys((prev) => {
      const next = new Set(prev);

      // 1) Remove leaf keys for deals that are no longer selected.
      for (const k of Array.from(next)) {
        const m = /^deal:(\d+):/.exec(k);
        if (!m) continue;
        const did = Number(m[1]);
        if (!selectedDealIds.has(did)) next.delete(k);
      }

      // 2) For each selected deal, if it has zero selection, default to all leaves.
      const leafKeysByDeal = new Map<number, SelectionLeafKey[]>();
      for (const tree of compositionTrees) {
        leafKeysByDeal.set(tree.dealId, collectLeafKeys(tree));
      }

      for (const did of selectedDealIds) {
        const dealLeaves = leafKeysByDeal.get(did) || [];
        if (dealLeaves.length === 0) continue;
        const hasAnyForDeal = dealLeaves.some((k) => next.has(k));
        if (hasAnyForDeal) continue;
        for (const k of dealLeaves) next.add(k);
      }

      return next;
    });
  }, [compositionTrees, selectedDealIds]);

  const toggleExpandedComposition = useCallback((key: string) => {
    setExpandedCompositionKeys((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }, []);

  const onToggleSelectedNode = useCallback((node: DealCompositionNode, nextChecked: boolean) => {
    setSelectedLeafKeys((prev) => toggleNodeLeaves(node, prev, nextChecked));
  }, []);

  const filteredLines: CashFlowLine[] = useMemo(() => {
    if (selectedDealIds.size === 0) return [];
    if (selectedLeafKeys.size === 0) return [];

    const hasPhysicalSelectionByDeal = new Map<number, boolean>();
    const hasFinancialSelectionByDeal = new Map<number, boolean>();
    for (const k of selectedLeafKeys) {
      const m = /^deal:(\d+):(so|po|contract):/.exec(k);
      if (!m) continue;
      const did = Number(m[1]);
      const kind = m[2];
      if (kind === 'so' || kind === 'po') hasPhysicalSelectionByDeal.set(did, true);
      if (kind === 'contract') hasFinancialSelectionByDeal.set(did, true);
    }

    const out: CashFlowLine[] = [];
    for (const l of lines) {
      const did = dealIdOfLine(l);
      if (!did) continue;
      if (!selectedDealIds.has(did)) continue;

      const entityType = String(l.entity_type || '').toLowerCase();
      const entityId = String(l.entity_id);

      if (entityType === 'so') {
        if (selectedLeafKeys.has(soLeafKey(did, entityId))) out.push(l);
        continue;
      }
      if (entityType === 'po') {
        if (selectedLeafKeys.has(poLeafKey(did, entityId))) out.push(l);
        continue;
      }
      if (entityType === 'contract') {
        // Hedge contracts: include both legs when the contract is selected.
        if (selectedLeafKeys.has(contractLeafKey(did, entityId))) out.push(l);
        continue;
      }

      // Risk/exposure lines are part of the financial view.
      const isRiskish = classifyConfidence(l) === 'risk';
      if (isRiskish && hasFinancialSelectionByDeal.get(did)) {
        out.push(l);
        continue;
      }

      // Do not include deal-summary lines to avoid double counting in detailed view.
    }
    return out;
  }, [lines, selectedDealIds, selectedLeafKeys]);

  const selectedStructureByDeal = useMemo(() => {
    const map = new Map<
      number,
      {
        soIds: Set<string>;
        poIds: Set<string>;
        contractIds: Set<string>;
      }
    >();

    for (const k of selectedLeafKeys) {
      const parsed = parseSelectedLeafKey(k);
      if (!parsed) continue;
      if (!selectedDealIds.has(parsed.dealId)) continue;
      const entry = map.get(parsed.dealId) || { soIds: new Set<string>(), poIds: new Set<string>(), contractIds: new Set<string>() };
      if (parsed.kind === 'so') entry.soIds.add(parsed.id);
      if (parsed.kind === 'po') entry.poIds.add(parsed.id);
      if (parsed.kind === 'contract') entry.contractIds.add(parsed.id);
      map.set(parsed.dealId, entry);
    }

    return map;
  }, [selectedDealIds, selectedLeafKeys]);

  const gridRows: GridRow[] = useMemo(() => {
    const rows: GridRow[] = [];

    for (const d of selectedDeals) {
      const did = d.id;
      const sel = selectedStructureByDeal.get(did);
      if (!sel) continue;

      const dealLines = linesByDeal.get(did) || [];
      const soLabelOf = (soId: string) => {
        const any = dealLines.find((l) => String(l.entity_type || '').toLowerCase() === 'so' && String(l.entity_id) === soId);
        const ref = String(any?.source_reference || '').trim();
        return ref || stripTechnicalPrefix(soId);
      };
      const poLabelOf = (poId: string) => {
        const any = dealLines.find((l) => String(l.entity_type || '').toLowerCase() === 'po' && String(l.entity_id) === poId);
        const ref = String(any?.source_reference || '').trim();
        return ref || stripTechnicalPrefix(poId);
      };
      const contractLabelOf = (cid: string) => {
        const any = dealLines.find((l) => String(l.entity_type || '').toLowerCase() === 'contract' && String(l.entity_id) === cid);
        const ref = String(any?.source_reference || '').trim();
        return ref || shortenId(cid);
      };

      const soIds = Array.from(sel.soIds.values()).sort((a, b) => a.localeCompare(b));
      const poIds = Array.from(sel.poIds.values()).sort((a, b) => a.localeCompare(b));
      const contractIds = Array.from(sel.contractIds.values()).sort((a, b) => a.localeCompare(b));

      const hasPhysical = soIds.length + poIds.length > 0;
      const hasFinancial = contractIds.length > 0;
      const hasAny = hasPhysical || hasFinancial;
      if (!hasAny) continue;

      rows.push({ key: `deal:${did}:row`, dealId: did, kind: 'deal', label: dealLabel(d), level: 0 });

      if (hasPhysical) {
        rows.push({ key: `deal:${did}:row:physical`, dealId: did, kind: 'group-physical', label: 'Físico', level: 1 });
        for (const soId of soIds) rows.push({ key: soLeafKey(did, soId), dealId: did, kind: 'so', label: soLabelOf(soId), level: 2, soId });
        for (const poId of poIds) rows.push({ key: poLeafKey(did, poId), dealId: did, kind: 'po', label: poLabelOf(poId), level: 2, poId });
      }

      if (hasFinancial) {
        rows.push({ key: `deal:${did}:row:financial`, dealId: did, kind: 'group-financial', label: 'Financeiro', level: 1 });
        for (const cid of contractIds) rows.push({ key: contractLeafKey(did, cid), dealId: did, kind: 'contract', label: contractLabelOf(cid), level: 2, contractId: cid });
      }
    }

    // Total geral (selected scope)
    if (rows.length) rows.push({ key: 'total:row', kind: 'total', label: 'Total geral', level: 0 });
    return rows;
  }, [selectedDeals, selectedStructureByDeal]);

  const rowSumsForDates = useCallback(
    (row: GridRow, dates: string[]) => {
      if (row.kind === 'total') return sumByConfidenceForDates(filteredLines, dates);
      if (!row.dealId) return { deterministic: 0, estimated: 0, risk: 0 };

      const dealLines = linesByDeal.get(row.dealId) || [];
      const sel = selectedStructureByDeal.get(row.dealId);
      if (!sel) return { deterministic: 0, estimated: 0, risk: 0 };

      if (row.kind === 'deal') {
        // Deal totals over the selected components only.
        const subset: CashFlowLine[] = [];
        for (const l of dealLines) {
          const et = String(l.entity_type || '').toLowerCase();
          const eid = String(l.entity_id);
          if (et === 'so' && sel.soIds.has(eid)) subset.push(l);
          else if (et === 'po' && sel.poIds.has(eid)) subset.push(l);
          else if (et === 'contract' && sel.contractIds.has(eid)) subset.push(l);
          else {
            const isRiskish = classifyConfidence(l) === 'risk';
            if (isRiskish && sel.contractIds.size > 0) subset.push(l);
          }
        }
        return sumByConfidenceForDates(subset, dates);
      }

      if (row.kind === 'group-physical') {
        const subset = dealLines.filter((l) => {
          const et = String(l.entity_type || '').toLowerCase();
          const eid = String(l.entity_id);
          return (et === 'so' && sel.soIds.has(eid)) || (et === 'po' && sel.poIds.has(eid));
        });
        return sumByConfidenceForDates(subset, dates);
      }

      if (row.kind === 'so' && row.soId) {
        const subset = dealLines.filter((l) => String(l.entity_type || '').toLowerCase() === 'so' && String(l.entity_id) === row.soId);
        return sumByConfidenceForDates(subset, dates);
      }

      if (row.kind === 'po' && row.poId) {
        const subset = dealLines.filter((l) => String(l.entity_type || '').toLowerCase() === 'po' && String(l.entity_id) === row.poId);
        return sumByConfidenceForDates(subset, dates);
      }

      if (row.kind === 'group-financial') {
        const subset: CashFlowLine[] = [];
        for (const l of dealLines) {
          const et = String(l.entity_type || '').toLowerCase();
          const eid = String(l.entity_id);
          if (et === 'contract' && sel.contractIds.has(eid)) subset.push(l);
          else {
            const isRiskish = classifyConfidence(l) === 'risk';
            if (isRiskish && sel.contractIds.size > 0) subset.push(l);
          }
        }
        return sumByConfidenceForDates(subset, dates);
      }

      if (row.kind === 'contract' && row.contractId) {
        // One row per contract with net settlement adjustment (vendida − comprada).
        return sumContractSettlementByConfidenceForDates(dealLines, row.contractId, dates);
      }

      return { deterministic: 0, estimated: 0, risk: 0 };
    },
    [filteredLines, linesByDeal, selectedStructureByDeal]
  );

  const allDates = useMemo(() => {
    const set = new Set<string>();
    for (const l of filteredLines) set.add(String(l.date));
    return Array.from(set.values()).sort((a, b) => a.localeCompare(b));
  }, [filteredLines]);

  const timeTree: TimeTree = useMemo(() => {
    const quarterMap = new Map<
      string,
      {
        key: string;
        label: string;
        dates: string[];
        monthMap: Map<
          string,
          {
            key: string;
            label: string;
            dates: string[];
            weekMap: Map<string, { key: string; label: string; dates: string[] }>;
          }
        >;
      }
    >();

    for (const d of allDates) {
      const q = quarterKey(d);
      const m = monthKey(d);
      const w = isoWeekKey(d);

      let qNode = quarterMap.get(q.key);
      if (!qNode) {
        qNode = { key: q.key, label: q.label, dates: [], monthMap: new Map() };
        quarterMap.set(q.key, qNode);
      }
      qNode.dates.push(d);

      let mNode = qNode.monthMap.get(m.key);
      if (!mNode) {
        mNode = { key: m.key, label: m.label, dates: [], weekMap: new Map() };
        qNode.monthMap.set(m.key, mNode);
      }
      mNode.dates.push(d);

      let wNode = mNode.weekMap.get(w.key);
      if (!wNode) {
        wNode = { key: w.key, label: w.label, dates: [] };
        mNode.weekMap.set(w.key, wNode);
      }
      wNode.dates.push(d);
    }

    const quarters = Array.from(quarterMap.values()).sort((a, b) => a.key.localeCompare(b.key));

    return {
      quarters: quarters.map((q) => {
        const months = Array.from(q.monthMap.values()).sort((a, b) => a.key.localeCompare(b.key));
        return {
          key: q.key,
          label: q.label,
          dates: q.dates.slice().sort((a, b) => a.localeCompare(b)),
          months: months.map((m) => {
            const weeks = Array.from(m.weekMap.values()).sort((a, b) => a.key.localeCompare(b.key));
            return {
              key: m.key,
              label: m.label,
              dates: m.dates.slice().sort((a, b) => a.localeCompare(b)),
              weeks: weeks.map((w) => ({
                key: w.key,
                label: w.label,
                dates: w.dates.slice().sort((a, b) => a.localeCompare(b)),
              })),
            };
          }),
        };
      }),
    };
  }, [allDates]);

  const timeColumns: TimeColumn[] = useMemo(() => {
    const cols: TimeColumn[] = [];

    for (const q of timeTree.quarters) {
      const qExpanded = !!expandedQuarters[q.key];
      const qCanExpand = q.months.length > 0;

      if (!qCanExpand || !qExpanded) {
        cols.push({ key: q.key, label: q.label, level: 'quarter', dates: q.dates, canExpand: qCanExpand, expanded: qExpanded });
        continue;
      }

      for (const m of q.months) {
        const mExpanded = !!expandedMonths[m.key];
        const mCanExpand = m.weeks.length > 0;

        if (!mCanExpand || !mExpanded) {
          cols.push({ key: m.key, label: m.label, level: 'month', dates: m.dates, canExpand: mCanExpand, expanded: mExpanded });
          continue;
        }

        for (const w of m.weeks) {
          const wExpanded = !!expandedWeeks[w.key];
          const wCanExpand = w.dates.length > 1;

          if (!wCanExpand || !wExpanded) {
            cols.push({ key: w.key, label: w.label, level: 'week', dates: w.dates, canExpand: wCanExpand, expanded: wExpanded });
            continue;
          }

          for (const d of w.dates) {
            cols.push({ key: d, label: formatIsoDate(d), level: 'day', dates: [d], canExpand: false, expanded: false });
          }
        }
      }
    }

    return cols;
  }, [expandedMonths, expandedQuarters, expandedWeeks, timeTree.quarters]);

  const allQuarterKeys = useMemo(() => timeTree.quarters.map((q) => q.key), [timeTree.quarters]);
  const allMonthKeys = useMemo(() => timeTree.quarters.flatMap((q) => q.months.map((m) => m.key)), [timeTree.quarters]);
  const allWeekKeys = useMemo(() => timeTree.quarters.flatMap((q) => q.months.flatMap((m) => m.weeks.map((w) => w.key))), [timeTree.quarters]);

  const selectionTitle = useMemo(() => {
    if (selectedDealIds.size === 0) return 'Nenhuma seleção';
    if (selectedDealIds.size === 1) {
      const only = selectedDeals[0];
      return only ? dealLabel(only) : 'Selecionar Deal';
    }
    return `${selectedDealIds.size} deals`;
  }, [selectedDealIds.size, selectedDeals]);

  const totals = useMemo(() => {
    let inflow = 0;
    let outflow = 0;
    for (const l of filteredLines) {
      const v = signedAmountUsd(l);
      if (v >= 0) inflow += v;
      else outflow += -v;
    }
    return { inflow, outflow, net: inflow - outflow };
  }, [filteredLines]);

  const confidenceTotals = useMemo(() => {
    let deterministic = 0;
    let estimated = 0;
    let risk = 0;

    for (const l of filteredLines) {
      const v = signedAmountUsd(l);
      const c = classifyConfidence(l);
      if (c === 'deterministic') deterministic += v;
      else if (c === 'estimated') estimated += v;
      else risk += v;
    }

    return { deterministic, estimated, risk };
  }, [filteredLines]);

  const appliedAsOf = useMemo(() => (queryBase.as_of ? formatIsoDate(String(queryBase.as_of)) : '—'), [queryBase.as_of]);
  const showInitialLoading = cashflow.isLoading && !cashflow.data;

  const showNoDealSelected = selectedDealIds.size === 0;

  return (
    <FioriFlexibleColumnLayout
      masterTitle="Seleção"
      masterContent={
        isLoadingDeals ? (
          <div className="p-4">
            <LoadingState message="Carregando deals..." />
          </div>
        ) : dealsError ? (
          <div className="p-4">
            <ErrorState error={dealsError} onRetry={fetchDeals} />
          </div>
        ) : (
          <div className="h-full overflow-y-auto">
            <div className="border-b border-[var(--sapList_HeaderBorderColor)] p-4 bg-[var(--sapList_HeaderBackground)]">
              <div className="text-sm font-['72:Bold',sans-serif] text-[var(--sapList_HeaderTextColor)]">Escopo</div>
              <div className="text-xs text-[var(--sapContent_LabelColor)] mt-1">Selecione para consolidar</div>
            </div>
            <div className="p-3">
              <CashflowScopePanel groups={groupedDeals} selectedDealIds={selectedDealIds} onToggleDeal={toggleDeal} onToggleAll={toggleAllDeals} />
            </div>

            <div className="border-t border-[var(--sapList_BorderColor)]" />
            <div className="border-b border-[var(--sapList_HeaderBorderColor)] p-4 bg-[var(--sapList_HeaderBackground)]">
              <div className="text-sm font-['72:Bold',sans-serif] text-[var(--sapList_HeaderTextColor)]">Composição</div>
              <div className="text-xs text-[var(--sapContent_LabelColor)] mt-1">Seleção automática ao marcar Deals; ajuste se necessário</div>
            </div>
            <div className="p-3">
              {showNoDealSelected ? (
                <EmptyState title="Nenhuma seleção" description="Selecione um ou mais Deals para ver a composição." />
              ) : compositionTrees.length === 0 ? (
                <EmptyState title="Sem dados" description="Não há itens para o período." />
              ) : (
                <CompositionTree
                  nodes={compositionTrees}
                  selected={selectedLeafKeys}
                  expanded={expandedCompositionKeys}
                  onToggleExpanded={toggleExpandedComposition}
                  onToggleSelected={onToggleSelectedNode}
                />
              )}
            </div>
          </div>
        )
      }
      masterWidth={340}
      detailContent={
        <div className="sap-fiori-page h-full overflow-y-auto">
          <div className="bg-[var(--sapPageHeader_Background)] border-b border-[var(--sapPageHeader_BorderColor)] -mx-4 -mt-4 px-4 py-4 mb-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-[var(--sapPageHeader_TextColor)] text-xl font-normal m-0">{UX_COPY.pages.cashflow.title}</h1>
                <p className="text-[var(--sapContent_LabelColor)] text-sm mt-1">
                  Seleção: <span className="font-['72:Bold',sans-serif]">{selectionTitle}</span> · Data de corte:{' '}
                  <span className="font-['72:Bold',sans-serif]">{appliedAsOf}</span>
                  {cashflow.isLoading && cashflow.data ? <span className="ml-2 text-xs">(atualizando…)</span> : null}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <FioriButton variant="ghost" icon={<RefreshCw className="w-4 h-4" />} onClick={cashflow.refetch} disabled={selectedDealIds.size === 0}>
                  Atualizar
                </FioriButton>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
              <label className="text-xs text-[var(--sapContent_LabelColor)]">
                Período (de)
                <input
                  className="mt-1 w-full p-2 border border-[var(--sapField_BorderColor)] rounded bg-white text-sm"
                  type="date"
                  value={String(queryBase.start_date || '')}
                  onChange={(e) => setQueryBase((prev) => ({ ...prev, start_date: e.target.value || undefined }))}
                />
              </label>
              <label className="text-xs text-[var(--sapContent_LabelColor)]">
                Período (até)
                <input
                  className="mt-1 w-full p-2 border border-[var(--sapField_BorderColor)] rounded bg-white text-sm"
                  type="date"
                  value={String(queryBase.end_date || '')}
                  onChange={(e) => setQueryBase((prev) => ({ ...prev, end_date: e.target.value || undefined }))}
                />
              </label>
              <label className="text-xs text-[var(--sapContent_LabelColor)]">
                Data de corte
                <input
                  className="mt-1 w-full p-2 border border-[var(--sapField_BorderColor)] rounded bg-white text-sm"
                  type="date"
                  value={String(queryBase.as_of || '')}
                  onChange={(e) => setQueryBase((prev) => ({ ...prev, as_of: e.target.value || undefined }))}
                />
              </label>
            </div>

            <div className="mt-4 border border-[var(--sapList_BorderColor)] rounded bg-white overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[var(--sapList_BorderColor)]">
                <div className="p-3">
                  <div className="text-[11px] text-[var(--sapContent_LabelColor)]">Saldo líquido (USD)</div>
                  <div className="text-sm font-['72:Bold',sans-serif]">{formatUsdSigned(totals.net)}</div>
                </div>
                <div className="p-3">
                  <div className="text-[11px] text-[var(--sapContent_LabelColor)]">MTM (USD)</div>
                  <div className="text-sm font-['72:Bold',sans-serif]">{formatUsdSigned(confidenceTotals.deterministic)}</div>
                </div>
                <div className="p-3">
                  <div className="text-[11px] text-[var(--sapContent_LabelColor)]">Estimado + Risco (USD)</div>
                  <div className="text-sm font-['72:Bold',sans-serif]">{formatUsdSigned(confidenceTotals.estimated + confidenceTotals.risk)}</div>
                </div>
              </div>
            </div>
          </div>

          {showNoDealSelected ? (
            <div className="p-6">
              <EmptyState title="Nenhuma seleção" description="Selecione um ou mais Deals para ver o fluxo de caixa." />
            </div>
          ) : (
            <div className="border border-[var(--sapList_BorderColor)] rounded bg-white overflow-hidden">
              <div className="border-b border-[var(--sapList_BorderColor)] p-3 bg-[var(--sapGroup_ContentBackground)] flex items-center justify-between">
                <div>
                  <div className="text-sm font-['72:Bold',sans-serif]">Fluxo de Caixa</div>
                  <div className="text-xs text-[var(--sapContent_LabelColor)] mt-1">Trimestre → mês → semana</div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-2 text-xs text-[var(--sapContent_LabelColor)]">
                      <input type="checkbox" checked={metricVisibility.mtm} onChange={() => toggleMetric('mtm')} />
                      <span>MTM</span>
                    </label>
                    <label className="flex items-center gap-2 text-xs text-[var(--sapContent_LabelColor)]">
                      <input type="checkbox" checked={metricVisibility.estimated} onChange={() => toggleMetric('estimated')} />
                      <span>Estimado</span>
                    </label>
                    <label className="flex items-center gap-2 text-xs text-[var(--sapContent_LabelColor)]">
                      <input type="checkbox" checked={metricVisibility.risk} onChange={() => toggleMetric('risk')} />
                      <span>Risco</span>
                    </label>
                  </div>
                  <FioriButton
                    variant="ghost"
                    onClick={() => {
                      const q: Record<string, boolean> = {};
                      const m: Record<string, boolean> = {};
                      const w: Record<string, boolean> = {};
                      for (const k of allQuarterKeys) q[k] = true;
                      for (const k of allMonthKeys) m[k] = true;
                      for (const k of allWeekKeys) w[k] = true;
                      setExpandedQuarters(q);
                      setExpandedMonths(m);
                      setExpandedWeeks(w);
                    }}
                    disabled={timeColumns.length === 0}
                  >
                    Expandir tudo
                  </FioriButton>
                  <FioriButton
                    variant="ghost"
                    onClick={() => {
                      setExpandedQuarters({});
                      setExpandedMonths({});
                      setExpandedWeeks({});
                    }}
                    disabled={timeColumns.length === 0}
                  >
                    Recolher
                  </FioriButton>
                </div>
              </div>

              <div className="p-3">
                {showInitialLoading ? (
                  <LoadingState message="Carregando fluxo de caixa..." />
                ) : cashflow.isError ? (
                  <ErrorState error={cashflow.error} onRetry={cashflow.refetch} />
                ) : gridRows.length === 0 ? (
                  <EmptyState title="Sem dados" description="Sem itens selecionados para o período." />
                ) : timeColumns.length === 0 ? (
                  <EmptyState title="Sem dados" description="Sem dados para o período." />
                ) : (
                  <div className="border border-[var(--sapList_BorderColor)] rounded overflow-hidden bg-white">
                    <div className="overflow-auto">
                      <table className="min-w-[760px] w-full">
                        <thead>
                          <tr className="border-b border-[var(--sapList_BorderColor)] bg-white">
                            <th className="text-left p-3 text-xs sticky left-0 z-20 bg-white">Resumo</th>
                            {timeColumns.map((c) => {
                              const canExpand = c.canExpand;
                              const icon = canExpand ? (c.expanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />) : null;

                              const toggle = () => {
                                if (!c.canExpand) return;
                                if (c.level === 'quarter') {
                                  setExpandedQuarters((prev) => ({ ...prev, [c.key]: !prev[c.key] }));
                                  if (c.expanded) {
                                    setExpandedMonths({});
                                    setExpandedWeeks({});
                                  }
                                  return;
                                }
                                if (c.level === 'month') {
                                  setExpandedMonths((prev) => ({ ...prev, [c.key]: !prev[c.key] }));
                                  if (c.expanded) setExpandedWeeks({});
                                  return;
                                }
                                if (c.level === 'week') {
                                  setExpandedWeeks((prev) => ({ ...prev, [c.key]: !prev[c.key] }));
                                }
                              };

                              return (
                                <th key={c.key} className="text-center p-2 text-xs whitespace-nowrap" colSpan={1}>
                                  {canExpand ? (
                                    <button
                                      type="button"
                                      className="inline-flex items-center gap-1 text-[var(--sapLink_TextColor)] hover:underline"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        toggle();
                                      }}
                                      title="Expandir/recolher"
                                    >
                                      <span>{c.label}</span>
                                      {icon}
                                    </button>
                                  ) : (
                                    <span>{c.label}</span>
                                  )}
                                </th>
                              );
                            })}

                            <th className="text-center p-2 text-xs whitespace-nowrap" colSpan={1}>
                              Total acumulado
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {gridRows.map((row) => {
                            const isTotal = row.kind === 'total';
                            const isDeal = row.kind === 'deal';
                            const isGroup = row.kind === 'group-physical' || row.kind === 'group-financial';

                            const leftCellClass = isTotal || isDeal || isGroup ? "font-['72:Bold',sans-serif]" : '';
                            const leftBg = isTotal ? 'bg-[var(--sapList_HeaderBackground)]' : 'bg-white';

                            return (
                              <tr key={row.key} className="border-b border-[var(--sapList_BorderColor)] bg-white">
                                <td className={`p-3 text-sm sticky left-0 z-10 ${leftBg} ${leftCellClass}`}>
                                  <div style={{ paddingLeft: `${row.level * 14}px` }}>{row.label}</div>
                                </td>

                                {timeColumns.map((c) => {
                                  const sums = rowSumsForDates(row, c.dates);
                                  return (
                                    <td key={`${row.key}:${c.key}`} className="p-2 text-xs text-right whitespace-nowrap align-top">
                                      {renderSumsCell(sums)}
                                    </td>
                                  );
                                })}

                                {(() => {
                                  const totalSums = rowSumsForDates(row, allDates);
                                  return (
                                    <td key={`${row.key}:total`} className={`p-2 text-xs text-right whitespace-nowrap align-top bg-[var(--sapList_HeaderBackground)]`}>
                                      {renderSumsCell(totalSums)}
                                    </td>
                                  );
                                })()}
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      }
    />
  );
}

export default CashflowPageIntegrated;
