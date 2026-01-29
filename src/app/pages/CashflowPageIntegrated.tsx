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

import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { ChevronDown, ChevronRight, RefreshCw } from 'lucide-react';
import { flexRender, getCoreRowModel, type ColumnDef, useReactTable } from '@tanstack/react-table';

import type { ApiError, CashFlowLine, CashflowAnalyticQueryParams, Deal } from '../../types';
import { getCashflowAnalytic } from '../../services/cashflow.service';
import { listDeals } from '../../services/deals.service';

import { ErrorState, EmptyState, LoadingState } from '../components/ui';
import { FioriButton } from '../components/fiori/FioriButton';
import { FioriDateRangePicker } from '../components/fiori/FioriDateRangePicker';
import { FioriFlexibleColumnLayout } from '../components/fiori/FioriFlexibleColumnLayout';
import { TreeNode as TreeNodeView } from '../components/tree/TreeNode';
import { findNodeById, useCashflowScopeTreeStore, walkNodes, type TreeNode as ScopeTreeNode } from '../stores/cashflowScopeTree.store';

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

function entityNodeId(entity: string): string {
  return `entity:${entity}`;
}

function dealNodeId(dealId: number): string {
  return `deal:${dealId}`;
}

function flowNodeId(dealId: number, flow: 'physical' | 'financial'): string {
  return `flow:${dealId}:${flow}`;
}

function instrumentNodeId(dealId: number, instrumentType: 'SO' | 'PO' | 'Contract', instrumentId: string): string {
  return `instrument:${dealId}:${instrumentType}:${instrumentId}`;
}

function parseDealIdFromNodeId(id: string): number | null {
  const m = /^deal:(\d+)$/.exec(id);
  if (!m) return null;
  const v = Number(m[1]);
  return Number.isFinite(v) ? v : null;
}

function parseFlowFromNodeId(id: string): { dealId: number; flow: 'physical' | 'financial' } | null {
  const m = /^flow:(\d+):(physical|financial)$/.exec(id);
  if (!m) return null;
  return { dealId: Number(m[1]), flow: m[2] as 'physical' | 'financial' };
}

function parseInstrumentFromNodeId(
  id: string
): { dealId: number; instrumentType: 'SO' | 'PO' | 'Contract'; instrumentId: string } | null {
  const m = /^instrument:(\d+):(SO|PO|Contract):(.+)$/.exec(id);
  if (!m) return null;
  return { dealId: Number(m[1]), instrumentType: m[2] as 'SO' | 'PO' | 'Contract', instrumentId: String(m[3]) };
}

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

type DealScopeSelection = {
  dealAll: boolean;
  physicalAll: boolean;
  financialAll: boolean;
  soIds: Set<string>;
  poIds: Set<string>;
  contractIds: Set<string>;
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

function buildDealChildren(dealId: number, dealLines: CashFlowLine[]): ScopeTreeNode[] {
  const soIds = uniqSortedStrings(dealLines.filter((l) => String(l.entity_type || '').toLowerCase() === 'so').map((l) => String(l.entity_id)));
  const poIds = uniqSortedStrings(dealLines.filter((l) => String(l.entity_type || '').toLowerCase() === 'po').map((l) => String(l.entity_id)));
  const contractIds = uniqSortedStrings(dealLines.filter((l) => String(l.entity_type || '').toLowerCase() === 'contract').map((l) => String(l.entity_id)));

  const physicalChildren: ScopeTreeNode[] = [];
  for (const id of soIds) {
    const any = dealLines.find((l) => String(l.entity_type || '').toLowerCase() === 'so' && String(l.entity_id) === id);
    const ref = String(any?.source_reference || '').trim();
    physicalChildren.push({
      id: instrumentNodeId(dealId, 'SO', id),
      type: 'instrument',
      label: `SO ${ref || stripTechnicalPrefix(id)}`,
      selectable: true,
      dealId: String(dealId),
      instrumentType: 'SO',
    });
  }
  for (const id of poIds) {
    const any = dealLines.find((l) => String(l.entity_type || '').toLowerCase() === 'po' && String(l.entity_id) === id);
    const ref = String(any?.source_reference || '').trim();
    physicalChildren.push({
      id: instrumentNodeId(dealId, 'PO', id),
      type: 'instrument',
      label: `PO ${ref || stripTechnicalPrefix(id)}`,
      selectable: true,
      dealId: String(dealId),
      instrumentType: 'PO',
    });
  }
  physicalChildren.sort((a, b) => a.label.localeCompare(b.label));

  const financialChildren: ScopeTreeNode[] = [];
  for (const cid of contractIds) {
    const contractLines = dealLines.filter((l) => String(l.entity_type || '').toLowerCase() === 'contract' && String(l.entity_id) === cid);
    const ref = String(contractLines.find((l) => String(l.source_reference || '').trim())?.source_reference || '').trim();
    financialChildren.push({
      id: instrumentNodeId(dealId, 'Contract', cid),
      type: 'instrument',
      label: `Contrato Hedge ${ref || shortenId(cid)}`,
      selectable: true,
      dealId: String(dealId),
      instrumentType: 'Contract',
    });
  }
  financialChildren.sort((a, b) => a.label.localeCompare(b.label));

  const children: ScopeTreeNode[] = [];
  if (physicalChildren.length) {
    children.push({
      id: flowNodeId(dealId, 'physical'),
      type: 'flow',
      label: 'Físico',
      selectable: true,
      dealId: String(dealId),
      children: physicalChildren,
    });
  }
  if (financialChildren.length) {
    children.push({
      id: flowNodeId(dealId, 'financial'),
      type: 'flow',
      label: 'Financeiro',
      selectable: true,
      dealId: String(dealId),
      children: financialChildren,
    });
  }
  return children;
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

function buildScopeRootsFromDeals(deals: Deal[]): ScopeTreeNode[] {
  const groups = groupDealsByCompany(deals);
  return groups.map((g) => {
    const entityLabel = g.company;
    return {
      id: entityNodeId(entityLabel),
      type: 'entity',
      label: entityLabel,
      selectable: true,
      expanded: true,
      children: g.deals.map((d) => ({
        id: dealNodeId(d.id),
        type: 'deal',
        label: dealLabel(d),
        selectable: true,
        dealId: String(d.id),
        children: undefined,
      })),
    } satisfies ScopeTreeNode;
  });
}

function hasAnySelection(node: ScopeTreeNode): boolean {
  if (node.checked || node.indeterminate) return true;
  if (!node.children) return false;
  return node.children.some((c) => hasAnySelection(c));
}

function computeScopeFromTree(roots: ScopeTreeNode[]): {
  dealIds: number[];
  byDeal: Map<number, DealScopeSelection>;
} {
  const byDeal = new Map<number, DealScopeSelection>();

  const ensure = (dealId: number) => {
    const existing = byDeal.get(dealId);
    if (existing) return existing;
    const created: DealScopeSelection = {
      dealAll: false,
      physicalAll: false,
      financialAll: false,
      soIds: new Set<string>(),
      poIds: new Set<string>(),
      contractIds: new Set<string>(),
    };
    byDeal.set(dealId, created);
    return created;
  };

  walkNodes(roots, (n) => {
    const dealId = n.type === 'deal' ? parseDealIdFromNodeId(n.id) : n.type === 'flow' ? parseFlowFromNodeId(n.id)?.dealId ?? null : n.type === 'instrument' ? parseInstrumentFromNodeId(n.id)?.dealId ?? null : null;
    if (!dealId) return;

    if (!hasAnySelection(n)) return;

    const entry = ensure(dealId);

    if (n.type === 'deal') {
      if (n.checked) entry.dealAll = true;
      return;
    }

    if (n.type === 'flow') {
      const parsed = parseFlowFromNodeId(n.id);
      if (!parsed) return;
      if (n.checked) {
        if (parsed.flow === 'physical') entry.physicalAll = true;
        if (parsed.flow === 'financial') entry.financialAll = true;
      }
      return;
    }

    if (n.type === 'instrument') {
      const parsed = parseInstrumentFromNodeId(n.id);
      if (!parsed) return;
      if (!n.checked) return;
      if (parsed.instrumentType === 'SO') entry.soIds.add(parsed.instrumentId);
      if (parsed.instrumentType === 'PO') entry.poIds.add(parsed.instrumentId);
      if (parsed.instrumentType === 'Contract') entry.contractIds.add(parsed.instrumentId);
    }
  });

  // Prune deals without any effective selection
  for (const [did, sel] of Array.from(byDeal.entries())) {
    const any = sel.dealAll || sel.physicalAll || sel.financialAll || sel.soIds.size + sel.poIds.size + sel.contractIds.size > 0;
    if (!any) byDeal.delete(did);
  }

  return { dealIds: Array.from(byDeal.keys()).sort((a, b) => a - b), byDeal };
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

  const { roots, setRoots, toggleExpanded, toggleChecked, hydrateChildren } = useCashflowScopeTreeStore();
  const groupedDeals = useMemo(() => groupDealsByCompany(deals), [deals]);
  const rootBuildKey = useMemo(() => JSON.stringify(groupedDeals.map((g) => ({ company: g.company, ids: g.deals.map((d) => d.id) }))), [groupedDeals]);

  useEffect(() => {
    // Build the base tree (Entity -> Deal). Deal children are hydrated lazily.
    setRoots(buildScopeRootsFromDeals(deals));
  }, [rootBuildKey]);

  const [queryBase, setQueryBase] = useState<CashflowAnalyticQueryParams>(() => ({
    as_of: today,
    start_date: today,
    end_date: addDaysIso(today, 90),
  }));

  const scope = useMemo(() => computeScopeFromTree(roots), [roots]);
  const cashflow = useCashflowAnalyticMulti(queryBase, scope.dealIds);
  const [expandedQuarters, setExpandedQuarters] = useState<Record<string, boolean>>({});
  const [expandedMonths, setExpandedMonths] = useState<Record<string, boolean>>({});
  const [expandedWeeks, setExpandedWeeks] = useState<Record<string, boolean>>({});

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

  useEffect(() => {
    // Hydrate deal children from already-fetched lines so the tree+grid reflect Deal → Flow → Instrument
    // even when selection happened at entity/deal level (without manual expand).
    for (const did of scope.dealIds) {
      const node = findNodeById(roots, dealNodeId(did));
      const hasChildren = !!node?.children && node.children.length > 0;
      if (hasChildren) continue;
      const dealLines = linesByDeal.get(did) || [];
      if (dealLines.length === 0) continue;
      hydrateChildren(dealNodeId(did), buildDealChildren(did, dealLines));
    }
  }, [hydrateChildren, linesByDeal, roots, scope.dealIds.join(',')]);

  const hydrationInFlightRef = useRef<Set<number>>(new Set());
  const hydrationKeyRef = useRef<string>('');
  const hydrationKey = useMemo(() => JSON.stringify({ ...queryBase }), [queryBase.as_of, queryBase.end_date, queryBase.start_date]);

  useEffect(() => {
    // Invalidate lazy hydration on query changes.
    if (hydrationKeyRef.current !== hydrationKey) {
      hydrationKeyRef.current = hydrationKey;
      hydrationInFlightRef.current = new Set();
    }
  }, [hydrationKey]);

  const ensureDealHydrated = useCallback(
    async (dealId: number) => {
      if (hydrationInFlightRef.current.has(dealId)) return;
      hydrationInFlightRef.current.add(dealId);
      try {
        const lines = await getCashflowAnalytic({ ...queryBase, deal_id: dealId });
        const children = buildDealChildren(dealId, lines);
        hydrateChildren(dealNodeId(dealId), children);
      } finally {
        hydrationInFlightRef.current.delete(dealId);
      }
    },
    [queryBase.as_of, queryBase.end_date, queryBase.start_date]
  );

  const onToggleExpandedNode = useCallback(
    (id: string) => {
      const node = findNodeById(roots, id);
      const willExpand = node ? !node.expanded : true;
      toggleExpanded(id);

      const did = parseDealIdFromNodeId(id);
      if (did && willExpand) {
        const current = node;
        const hasChildren = !!current?.children && current.children.length > 0;
        if (!hasChildren) void ensureDealHydrated(did);
      }
    },
    [ensureDealHydrated, roots, toggleExpanded]
  );

  const onToggleCheckedNode = useCallback(
    (id: string, checked: boolean) => {
      toggleChecked(id, checked);
      const did = parseDealIdFromNodeId(id);
      if (did && checked) {
        const node = findNodeById(roots, id);
        const hasChildren = !!node?.children && node.children.length > 0;
        if (!hasChildren) void ensureDealHydrated(did);
      }
    },
    [ensureDealHydrated, roots, toggleChecked]
  );

  const filteredLines: CashFlowLine[] = useMemo(() => {
    if (scope.dealIds.length === 0) return [];

    const out: CashFlowLine[] = [];
    for (const l of lines) {
      const did = dealIdOfLine(l);
      if (!did) continue;
      if (!scope.byDeal.has(did)) continue;

      const sel = scope.byDeal.get(did);
      if (!sel) continue;

      const entityType = String(l.entity_type || '').toLowerCase();
      const entityId = String(l.entity_id);

      if (sel.dealAll) {
        out.push(l);
        continue;
      }

      const hasPhysicalSelection = sel.physicalAll || sel.soIds.size + sel.poIds.size > 0;
      const hasFinancialSelection = sel.financialAll || sel.contractIds.size > 0;

      if (entityType === 'so') {
        if (sel.physicalAll || sel.soIds.has(entityId)) out.push(l);
        continue;
      }
      if (entityType === 'po') {
        if (sel.physicalAll || sel.poIds.has(entityId)) out.push(l);
        continue;
      }
      if (entityType === 'contract') {
        // Hedge contracts: include both legs when the contract is selected.
        if (sel.financialAll || sel.contractIds.has(entityId)) out.push(l);
        continue;
      }

      // Risk/exposure lines are part of the financial view.
      const isRiskish = classifyConfidence(l) === 'risk';
      if (isRiskish && hasFinancialSelection) {
        out.push(l);
        continue;
      }

      // If physical is selected, include only physical entities (already handled above).
      if (hasPhysicalSelection) continue;

      // Do not include deal-summary lines to avoid double counting in detailed view.
    }
    return out;
  }, [lines, scope.byDeal, scope.dealIds.join(',')]);

  const selectedStructureByDeal = useMemo(() => {
    const map = new Map<number, { soIds: Set<string>; poIds: Set<string>; contractIds: Set<string> }>();
    for (const [did, sel] of scope.byDeal.entries()) {
      const entry = { soIds: new Set(sel.physicalAll ? [] : Array.from(sel.soIds)), poIds: new Set(sel.physicalAll ? [] : Array.from(sel.poIds)), contractIds: new Set(sel.financialAll ? [] : Array.from(sel.contractIds)) };

      // If selecting all under a flow, include all IDs discovered in the fetched lines.
      const dealLines = linesByDeal.get(did) || [];
      if (sel.dealAll || sel.physicalAll) {
        for (const l of dealLines) {
          const et = String(l.entity_type || '').toLowerCase();
          const eid = String(l.entity_id);
          if (et === 'so') entry.soIds.add(eid);
          if (et === 'po') entry.poIds.add(eid);
        }
      }
      if (sel.dealAll || sel.financialAll) {
        for (const l of dealLines) {
          const et = String(l.entity_type || '').toLowerCase();
          const eid = String(l.entity_id);
          if (et === 'contract') entry.contractIds.add(eid);
        }
      }

      map.set(did, entry);
    }
    return map;
  }, [linesByDeal, scope.byDeal]);

  const gridRows: GridRow[] = useMemo(() => {
    const rows: GridRow[] = [];

    // Drive row hierarchy from the tree (single source of truth for scope)
    for (const entity of roots) {
      if (!entity.children) continue;
      for (const dealNode of entity.children) {
        const did = parseDealIdFromNodeId(dealNode.id);
        if (!did) continue;
        if (!hasAnySelection(dealNode)) continue;

        rows.push({ key: `deal:${did}:row`, dealId: did, kind: 'deal', label: dealNode.label, level: 0 });

        const dealChildren = dealNode.children || [];
        for (const flowNode of dealChildren) {
          if (flowNode.type !== 'flow') continue;
          if (!hasAnySelection(flowNode)) continue;
          const parsedFlow = parseFlowFromNodeId(flowNode.id);
          if (!parsedFlow) continue;
          const groupKind: GridRowKind = parsedFlow.flow === 'physical' ? 'group-physical' : 'group-financial';
          rows.push({ key: `${flowNode.id}:row`, dealId: did, kind: groupKind, label: flowNode.label, level: 1 });

          for (const inst of flowNode.children || []) {
            if (inst.type !== 'instrument') continue;
            if (!inst.checked) continue;
            const parsedInst = parseInstrumentFromNodeId(inst.id);
            if (!parsedInst) continue;

            if (parsedInst.instrumentType === 'SO') rows.push({ key: inst.id, dealId: did, kind: 'so', label: inst.label, level: 2, soId: parsedInst.instrumentId });
            if (parsedInst.instrumentType === 'PO') rows.push({ key: inst.id, dealId: did, kind: 'po', label: inst.label, level: 2, poId: parsedInst.instrumentId });
            if (parsedInst.instrumentType === 'Contract') rows.push({ key: inst.id, dealId: did, kind: 'contract', label: inst.label, level: 2, contractId: parsedInst.instrumentId });
          }
        }
      }
    }

    // Total geral (selected scope)
    if (rows.length) rows.push({ key: 'total:row', kind: 'total', label: 'Total geral', level: 0 });
    return rows;
  }, [roots, selectedStructureByDeal]);

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
    if (scope.dealIds.length === 0) return 'Nenhuma seleção';
    if (scope.dealIds.length === 1) {
      const only = deals.find((d) => d.id === scope.dealIds[0]);
      return only ? dealLabel(only) : 'Selecionar Deal';
    }
    return `${scope.dealIds.length} deals`;
  }, [deals, scope.dealIds.join(',')]);

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

  const showNoDealSelected = scope.dealIds.length === 0;

  return (
    <FioriFlexibleColumnLayout
      masterTitle="Escopo"
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
              <div className="text-xs text-[var(--sapContent_LabelColor)] mt-1">Seleção e consolidação por hierarquia</div>
            </div>
            <div className="p-3">
              {roots.length === 0 ? (
                <EmptyState title="Sem dados" description="Nenhuma entidade/deal disponível." />
              ) : (
                <div className="text-sm">
                  {(roots || []).map((n) => (
                    <TreeNodeView key={n.id} node={n} level={0} onToggleExpanded={onToggleExpandedNode} onToggleChecked={onToggleCheckedNode} />
                  ))}
                </div>
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
                <FioriButton variant="ghost" icon={<RefreshCw className="w-4 h-4" />} onClick={cashflow.refetch} disabled={scope.dealIds.length === 0}>
                  Atualizar
                </FioriButton>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-end gap-3">
              <div className="w-full md:w-[340px]">
                <FioriDateRangePicker
                  label="Período"
                  startDateIso={String(queryBase.start_date || '') || undefined}
                  endDateIso={String(queryBase.end_date || '') || undefined}
                  placeholder="De · Até"
                  onChange={({ startDateIso, endDateIso }) =>
                    setQueryBase((prev) => ({ ...prev, start_date: startDateIso, end_date: endDateIso }))
                  }
                />
              </div>
              <div className="w-full md:w-[220px]">
                <label className="flex flex-col gap-1">
                  <span className="text-[11px] text-[var(--sapContent_LabelColor)]">Data de corte</span>
                  <input
                    className="h-8 w-full rounded-[4px] border border-[var(--sapField_BorderColor)] bg-[var(--sapField_Background)] px-2 text-[13px] font-['72:Regular',sans-serif] text-[var(--sapField_TextColor)]"
                    type="date"
                    value={String(queryBase.as_of || '')}
                    onChange={(e) => setQueryBase((prev) => ({ ...prev, as_of: e.target.value || undefined }))}
                  />
                </label>
              </div>
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
                  <CashflowTanStackTable
                    rows={gridRows}
                    timeColumns={timeColumns}
                    allDates={allDates}
                    onToggleColumnExpand={(c) => {
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
                    }}
                    renderSums={(row, dates) => renderSumsCell(rowSumsForDates(row, dates))}
                    renderTotal={(row) => renderSumsCell(rowSumsForDates(row, allDates))}
                  />
                )}
              </div>
            </div>
          )}
        </div>
      }
    />
  );
}

function CashflowTanStackTable({
  rows,
  timeColumns,
  allDates,
  onToggleColumnExpand,
  renderSums,
  renderTotal,
}: {
  rows: GridRow[];
  timeColumns: TimeColumn[];
  allDates: string[];
  onToggleColumnExpand: (col: TimeColumn) => void;
  renderSums: (row: GridRow, dates: string[]) => ReactNode;
  renderTotal: (row: GridRow) => ReactNode;
}) {
  const itemColWidth = 360;
  const periodColWidth = 140;
  const totalColWidth = 190;

  const columns: ColumnDef<GridRow>[] = useMemo(() => {
    const cols: ColumnDef<GridRow>[] = [];

    cols.push({
      id: 'item',
      header: () => (
        <div className="p-2 text-xs font-['72:Bold',sans-serif] text-[var(--sapList_HeaderTextColor)] bg-[var(--sapList_HeaderBackground)]">
          Item
        </div>
      ),
      cell: ({ row }) => {
        const r = row.original;
        const isTotal = r.kind === 'total';
        const isDeal = r.kind === 'deal';
        const isGroup = r.kind === 'group-physical' || r.kind === 'group-financial';
        const leftCellClass = isTotal || isDeal || isGroup ? "font-['72:Bold',sans-serif]" : '';
        const leftBg = isTotal ? 'bg-[var(--sapList_HeaderBackground)]' : 'bg-white';
        return (
          <div
            className={`p-2 text-[13px] ${leftBg} ${leftCellClass} truncate`}
            style={{ paddingLeft: `${r.level * 14 + 12}px` }}
            title={r.label}
          >
            {r.label}
          </div>
        );
      },
    });

    for (const c of timeColumns) {
      cols.push({
        id: c.key,
        header: () => {
          const icon = c.canExpand ? (c.expanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />) : null;
          return (
            <div className="text-center p-2 text-xs whitespace-nowrap text-[var(--sapList_HeaderTextColor)] bg-[var(--sapList_HeaderBackground)]">
              {c.canExpand ? (
                <button
                  type="button"
                  className="inline-flex items-center gap-1 rounded px-1 py-0.5 hover:bg-black/5"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleColumnExpand(c);
                  }}
                  title="Expandir/recolher"
                >
                  <span>{c.label}</span>
                  {icon}
                </button>
              ) : (
                <span>{c.label}</span>
              )}
            </div>
          );
        },
        cell: ({ row }) => (
          <div className="p-2 text-[13px] text-right whitespace-nowrap align-top tabular-nums">{renderSums(row.original, c.dates)}</div>
        ),
      });
    }

    cols.push({
      id: 'total',
      header: () => (
        <div className="text-center p-2 text-xs whitespace-nowrap text-[var(--sapList_HeaderTextColor)] bg-[var(--sapList_HeaderBackground)]">
          Total acumulado
        </div>
      ),
      cell: ({ row }) => (
        <div className="p-2 text-[13px] text-right whitespace-nowrap align-top tabular-nums bg-[var(--sapList_HeaderBackground)]">
          {renderTotal(row.original)}
        </div>
      ),
    });

    return cols;
  }, [allDates.join(','), onToggleColumnExpand, renderSums, renderTotal, timeColumns]);

  const table = useReactTable({
    data: rows,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const lastColId = 'total';

  const colStyleFor = (colId: string): CSSProperties => {
    if (colId === 'item') return { width: itemColWidth, minWidth: itemColWidth, maxWidth: itemColWidth };
    if (colId === lastColId) return { width: totalColWidth, minWidth: totalColWidth, maxWidth: totalColWidth };
    return { width: periodColWidth, minWidth: periodColWidth, maxWidth: periodColWidth };
  };

  return (
    <div className="border border-[var(--sapList_BorderColor)] rounded overflow-hidden bg-white">
      <div className="overflow-auto max-h-[70vh]">
        <table className="w-max min-w-full border-separate border-spacing-0">
          <thead>
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id} className="border-b border-[var(--sapList_BorderColor)] bg-[var(--sapList_HeaderBackground)]">
                {hg.headers.map((h) => {
                  const isFirst = h.column.id === 'item';
                  const isLast = h.column.id === lastColId;
                  const sticky = isFirst
                    ? 'sticky left-0 z-20 bg-[var(--sapList_HeaderBackground)] border-r border-[var(--sapList_BorderColor)]'
                    : isLast
                      ? 'sticky right-0 z-20 bg-[var(--sapList_HeaderBackground)] border-l border-[var(--sapList_BorderColor)]'
                      : '';
                  return (
                    <th key={h.id} className={`${sticky} align-top`} style={colStyleFor(h.column.id)}>
                      {h.isPlaceholder ? null : flexRender(h.column.columnDef.header, h.getContext())}
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((r) => (
              <tr key={r.id} className="border-b border-[var(--sapList_BorderColor)] bg-white">
                {r.getVisibleCells().map((cell) => {
                  const isFirst = cell.column.id === 'item';
                  const isLast = cell.column.id === lastColId;
                  const sticky = isFirst
                    ? 'sticky left-0 z-10 bg-white border-r border-[var(--sapList_BorderColor)]'
                    : isLast
                      ? 'sticky right-0 z-10 bg-[var(--sapList_HeaderBackground)] border-l border-[var(--sapList_BorderColor)]'
                      : '';
                  return (
                    <td key={cell.id} className={`${sticky} align-top`} style={colStyleFor(cell.column.id)}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default CashflowPageIntegrated;
