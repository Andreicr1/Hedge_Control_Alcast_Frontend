/**
 * Cashflow Page - Integrated (Analytic Tree View)
 *
 * Consumes GET /cashflow/analytic and renders a hierarchical tree:
 * Consolidated → Deal → (SO/PO/Contract/Exposure).
 *
 * Frontend ONLY aggregates/sums amounts; it does not infer valuation.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { CashFlowConfidence, CashFlowLine, CashFlowType, CashflowAnalyticQueryParams, Deal } from '../../types';
import { ErrorState, LoadingState, EmptyState } from '../components/ui';
import { FioriButton } from '../components/fiori/FioriButton';
import { FioriFlexibleColumnLayout } from '../components/fiori/FioriFlexibleColumnLayout';
import { FioriInput } from '../components/fiori/FioriInput';
import { Checkbox } from '../components/ui/checkbox';
import { formatCurrency, formatDate } from '../../services/dashboard.service';
import { ChevronDown, ChevronRight, RefreshCw, Search } from 'lucide-react';
import { useAuthContext } from '../components/AuthProvider';
import { normalizeRoleName } from '../../utils/role';
import { UX_COPY } from '../ux/copy';
import { listDeals } from '../../services/deals.service';
import { getCashflowAnalytic } from '../../services/cashflow.service';

function Badge({ children }: { children: string }) {
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs border bg-[var(--sapNeutralBackground,#f5f6f7)] border-[var(--sapUiBorderColor,#d9d9d9)] text-[var(--sapTextColor,#131e29)]">
      {children}
    </span>
  );
}

function toIsoDateOnly(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function addDays(date: Date, days: number): Date {
  const out = new Date(date);
  out.setDate(out.getDate() + days);
  return out;
}

type Granularity = 'day' | 'week' | 'month' | 'quarter';

function parseDateOnly(dateStr: string): Date {
  // Interpret YYYY-MM-DD as UTC midnight to avoid TZ shifting.
  return new Date(`${dateStr}T00:00:00Z`);
}

function formatIsoDateOnly(d: Date): string {
  const year = d.getUTCFullYear();
  const month = String(d.getUTCMonth() + 1).padStart(2, '0');
  const day = String(d.getUTCDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function startOfWeekMonday(d: Date): Date {
  const out = new Date(d);
  const day = out.getUTCDay();
  const delta = (day + 6) % 7; // Mon=0 ... Sun=6
  out.setUTCDate(out.getUTCDate() - delta);
  return out;
}

function bucketKey(dateStr: string, granularity: Granularity): string {
  const d = parseDateOnly(dateStr);
  if (granularity === 'day') return dateStr;
  if (granularity === 'week') return formatIsoDateOnly(startOfWeekMonday(d));
  if (granularity === 'month') {
    d.setUTCDate(1);
    return formatIsoDateOnly(d);
  }
  // quarter
  const m = d.getUTCMonth();
  const qStartMonth = Math.floor(m / 3) * 3;
  d.setUTCMonth(qStartMonth, 1);
  return formatIsoDateOnly(d);
}

type SignedTotals = {
  inflow: number;
  outflow: number;
  net: number;
};

function accumulateTotals(lines: CashFlowLine[]): SignedTotals {
  let inflow = 0;
  let outflow = 0;
  for (const l of lines) {
    if (l.direction === 'inflow') inflow += l.amount;
    else outflow += l.amount;
  }
  return { inflow, outflow, net: inflow - outflow };
}

function entityLabel(line: CashFlowLine): string {
  const ref = (line.source_reference || '').trim();
  const base = `${line.entity_type.toUpperCase()} #${line.entity_id}`;
  if (!ref) return base;
  if (ref === line.entity_id) return base;
  return `${base} (${ref})`;
}

type TreeEntityNode = {
  kind: 'entity';
  id: string;
  dealId: string;
  entity_type: CashFlowLine['entity_type'];
  entity_id: string;
  label: string;
  lines: CashFlowLine[];
  totals: SignedTotals;
};

type TreeDealNode = {
  kind: 'deal';
  id: string;
  dealId: string;
  label: string;
  children: TreeEntityNode[];
  totals: SignedTotals;
};

type TreeRootNode = {
  kind: 'root';
  id: 'root';
  label: string;
  children: TreeDealNode[];
  totals: SignedTotals;
};

function buildTree(lines: CashFlowLine[]): TreeRootNode {
  const byDeal = new Map<string, CashFlowLine[]>();
  for (const l of lines) {
    const dealId = (l.parent_id || '—').trim() || '—';
    const arr = byDeal.get(dealId) || [];
    arr.push(l);
    byDeal.set(dealId, arr);
  }

  const dealNodes: TreeDealNode[] = Array.from(byDeal.entries())
    .sort(([a], [b]) => {
      const na = Number(a);
      const nb = Number(b);
      const aIsNum = Number.isFinite(na) && String(na) === a;
      const bIsNum = Number.isFinite(nb) && String(nb) === b;
      if (aIsNum && bIsNum) return na - nb;
      if (aIsNum) return -1;
      if (bIsNum) return 1;
      return a.localeCompare(b);
    })
    .map(([dealId, dealLines]) => {
      const byEntity = new Map<string, CashFlowLine[]>();
      for (const l of dealLines) {
        const key = `${l.entity_type}:${l.entity_id}`;
        const arr = byEntity.get(key) || [];
        arr.push(l);
        byEntity.set(key, arr);
      }

      const entityOrder: Record<string, number> = {
        so: 1,
        po: 2,
        contract: 3,
        exposure: 4,
        deal: 5,
      };

      const children: TreeEntityNode[] = Array.from(byEntity.entries())
        .map(([id, entityLines]) => {
          const first = entityLines[0]!;
          return {
            kind: 'entity' as const,
            id,
            dealId,
            entity_type: first.entity_type,
            entity_id: first.entity_id,
            label: entityLabel(first),
            lines: entityLines,
            totals: accumulateTotals(entityLines),
          };
        })
        .sort((a, b) => {
          const oa = entityOrder[a.entity_type] ?? 999;
          const ob = entityOrder[b.entity_type] ?? 999;
          if (oa !== ob) return oa - ob;
          const na = Number(a.entity_id);
          const nb = Number(b.entity_id);
          const aIsNum = Number.isFinite(na);
          const bIsNum = Number.isFinite(nb);
          if (aIsNum && bIsNum) return na - nb;
          return a.entity_id.localeCompare(b.entity_id);
        });

      return {
        kind: 'deal' as const,
        id: `deal:${dealId}`,
        dealId,
        label: dealId === '—' ? 'Deal —' : `Deal #${dealId}`,
        children,
        totals: accumulateTotals(dealLines),
      };
    });

  return {
    kind: 'root' as const,
    id: 'root',
    label: 'Consolidado',
    children: dealNodes,
    totals: accumulateTotals(lines),
  };
}

function formatTotals(t: SignedTotals): string {
  // Net shown with sign; inflow/outflow always positive.
  return `${formatCurrency(t.net, 'USD')}  (in: ${formatCurrency(t.inflow, 'USD')} | out: ${formatCurrency(t.outflow, 'USD')})`;
}

export function CashflowPageIntegrated() {
  const { user } = useAuthContext();
  const role = normalizeRoleName(user?.role);

  const [deals, setDeals] = useState<Deal[]>([]);
  const [isLoadingDeals, setIsLoadingDeals] = useState<boolean>(true);
  const [dealsError, setDealsError] = useState<string | null>(null);
  const [dealSearch, setDealSearch] = useState<string>('');
  const [selectedDealIds, setSelectedDealIds] = useState<Set<number>>(() => new Set());
  const [activeDealId, setActiveDealId] = useState<number | null>(null);

  const fetchDeals = useCallback(async () => {
    setIsLoadingDeals(true);
    setDealsError(null);
    try {
      const res = await listDeals();
      setDeals(res);
      if (res.length > 0 && activeDealId === null) setActiveDealId(res[0]!.id);
      // Default: no selection; user chooses what to calculate.
      setSelectedDealIds(new Set());
    } catch (e) {
      console.error('Failed to fetch deals:', e);
      setDealsError('Erro ao carregar operações');
      setDeals([]);
      setSelectedDealIds(new Set());
    } finally {
      setIsLoadingDeals(false);
    }
  }, [activeDealId]);

  useEffect(() => {
    fetchDeals();
  }, [fetchDeals]);

  // Defaults: today → today+90d, as_of=today
  const today = useMemo(() => new Date(), []);
  const [startDate, setStartDate] = useState<string>(() => toIsoDateOnly(today));
  const [endDate, setEndDate] = useState<string>(() => toIsoDateOnly(addDays(today, 90)));
  const [asOf, setAsOf] = useState<string>(() => toIsoDateOnly(today));
  const [granularity, setGranularity] = useState<Granularity>('month');
  const [showRawLines, setShowRawLines] = useState<boolean>(false);
  const [rawLimit, setRawLimit] = useState<number>(200);
  const [typeFilter, setTypeFilter] = useState<Record<CashFlowType, boolean>>({
    physical: true,
    financial: true,
    risk: true,
  });
  const [confidenceFilter, setConfidenceFilter] = useState<Record<CashFlowConfidence, boolean>>({
    deterministic: true,
    estimated: true,
    risk: true,
  });

  // Apply pattern: editable inputs + applied params (stable)
  const [applied, setApplied] = useState<CashflowAnalyticQueryParams>(() => ({
    start_date: toIsoDateOnly(today),
    end_date: toIsoDateOnly(addDays(today, 90)),
    as_of: toIsoDateOnly(today),
    deal_id: undefined,
  }));

  const [appliedDealIds, setAppliedDealIds] = useState<number[]>([]);
  const [isAppliedOnce, setIsAppliedOnce] = useState<boolean>(false);

  const [cashflowData, setCashflowData] = useState<CashFlowLine[] | null>(null);
  const [cashflowIsLoading, setCashflowIsLoading] = useState<boolean>(false);
  const [cashflowError, setCashflowError] = useState<{ detail: string } | null>(null);
  const lastRequestId = useRef<number>(0);

  // Tree selection (inside detail area): allows summing subsets.
  const [openDeals, setOpenDeals] = useState<Record<string, boolean>>({});
  const [selectedNodeKeys, setSelectedNodeKeys] = useState<Set<string>>(() => new Set());

  const fetchCashflowAnalytic = useCallback(async (query: CashflowAnalyticQueryParams, dealIds: number[]) => {
    if (dealIds.length === 0) {
      setCashflowData([]);
      setCashflowError(null);
      setCashflowIsLoading(false);
      return;
    }

    const requestId = ++lastRequestId.current;
    setCashflowIsLoading(true);
    setCashflowError(null);

    try {
      const base: CashflowAnalyticQueryParams = {
        start_date: query.start_date,
        end_date: query.end_date,
        as_of: query.as_of,
        deal_id: undefined,
      };

      if (dealIds.length === 1) {
        const data = await getCashflowAnalytic({ ...base, deal_id: dealIds[0] });
        if (lastRequestId.current !== requestId) return;
        setCashflowData(data);
        setCashflowIsLoading(false);
        return;
      }

      // Multi-deal: batch per deal (avoids fetching ALL deals).
      const concurrency = 3;
      const pending = [...dealIds];
      const chunks: CashFlowLine[][] = [];

      async function worker() {
        while (pending.length > 0) {
          const did = pending.shift();
          if (did === undefined) return;
          const data = await getCashflowAnalytic({ ...base, deal_id: did });
          chunks.push(data);
        }
      }

      await Promise.all(Array.from({ length: Math.min(concurrency, dealIds.length) }, () => worker()));
      if (lastRequestId.current !== requestId) return;

      setCashflowData(chunks.flat());
      setCashflowIsLoading(false);
    } catch (e) {
      console.error('Failed to fetch cashflow analytic:', e);
      if (lastRequestId.current !== requestId) return;
      setCashflowData(null);
      setCashflowIsLoading(false);
      setCashflowError({ detail: 'Erro ao carregar fluxo de caixa' });
    }
  }, []);

  const handleRefetch = useCallback(() => {
    if (!isAppliedOnce) return;
    fetchCashflowAnalytic(applied, appliedDealIds);
  }, [applied, appliedDealIds, fetchCashflowAnalytic, isAppliedOnce]);

  const filteredDeals = useMemo(() => {
    const s = dealSearch.trim().toLowerCase();
    if (!s) return deals;
    return deals.filter((d) => {
      return (
        String(d.id).includes(s) ||
        (d.deal_uuid || '').toLowerCase().includes(s) ||
        (d.reference_name || '').toLowerCase().includes(s) ||
        (d.commodity || '').toLowerCase().includes(s)
      );
    });
  }, [dealSearch, deals]);

  const masterContent = (
    <>
      <div className="border-b border-[var(--sapList_HeaderBorderColor)] p-4 bg-[var(--sapList_HeaderBackground)]">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-['72:Bold',sans-serif] text-base text-[var(--sapList_HeaderTextColor)]">
            Operações ({filteredDeals.length})
          </h2>
          <FioriButton variant="ghost" icon={<RefreshCw className="w-4 h-4" />} onClick={fetchDeals}>
            Atualizar
          </FioriButton>
        </div>

        <div className="space-y-2">
          <div className="relative">
            <input
              type="text"
              value={dealSearch}
              onChange={(e) => setDealSearch(e.target.value)}
              placeholder="Buscar por ID, UUID, referência..."
              className="w-full h-8 px-3 pr-8 text-sm bg-[var(--sapField_Background)] border border-[var(--sapField_BorderColor)] rounded outline-none focus:border-[var(--sapField_Focus_BorderColor)]"
            />
            <Search className="w-4 h-4 absolute right-2 top-2 text-[var(--sapContent_IconColor)]" />
          </div>

          <div className="flex items-center justify-between gap-2">
            <button
              type="button"
              className="text-xs text-[var(--sapLink_TextColor)] hover:underline"
              onClick={() => setSelectedDealIds(new Set(filteredDeals.map((d) => d.id)))}
            >
              Consolidar todos
            </button>
            <button
              type="button"
              className="text-xs text-[var(--sapLink_TextColor)] hover:underline"
              onClick={() => setSelectedDealIds(new Set())}
            >
              Limpar
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        {isLoadingDeals ? (
          <div className="p-4">
            <LoadingState message="Carregando operações..." />
          </div>
        ) : dealsError ? (
          <div className="p-4">
            <ErrorState error={{ detail: dealsError }} onRetry={fetchDeals} />
          </div>
        ) : filteredDeals.length === 0 ? (
          <div className="p-4">
            <EmptyState title="Sem operações" description="Ajuste a busca ou verifique seus filtros." />
          </div>
        ) : (
          filteredDeals.map((deal) => {
            const label = (deal.reference_name || '').trim() || `Deal #${deal.id}`;
            const isSelected = selectedDealIds.has(deal.id);
            const isActive = activeDealId === deal.id;
            return (
              <div
                key={deal.id}
                className={`w-full p-3 border-b border-[var(--sapList_BorderColor)] hover:bg-[var(--sapList_HoverBackground)] transition-colors ${
                  isActive ? 'bg-[var(--sapList_SelectionBackgroundColor)] border-l-2 border-l-[var(--sapList_SelectionBorderColor)]' : ''
                }`}
              >
                <div className="flex items-start gap-2">
                  <div className="pt-1">
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={(v) => {
                        const checked = Boolean(v);
                        setSelectedDealIds((prev) => {
                          const next = new Set(prev);
                          if (checked) next.add(deal.id);
                          else next.delete(deal.id);
                          return next;
                        });
                      }}
                    />
                  </div>
                  <button
                    type="button"
                    className="flex-1 text-left min-w-0"
                    onClick={() => setActiveDealId(deal.id)}
                  >
                    <div className="font-['72:Bold',sans-serif] text-sm text-[#0064d9] truncate">{label}</div>
                    <div className="text-xs text-[var(--sapContent_LabelColor)] truncate">Deal #{deal.id}</div>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </>
  );

  const filteredLines = useMemo(() => {
    const lines = cashflowData ?? [];
    return lines.filter((l) => typeFilter[l.cashflow_type] && confidenceFilter[l.confidence]);
  }, [cashflowData, typeFilter, confidenceFilter]);

  const dealFilteredLines = useMemo(() => {
    if (selectedDealIds.size === 0) return [] as CashFlowLine[];
    // If API is already filtered to a single deal, keep as-is.
    if (applied.deal_id) return filteredLines;
    return filteredLines.filter((l) => {
      const raw = String(l.parent_id || '').trim();
      const did = Number(raw);
      if (!Number.isFinite(did)) return false;
      return selectedDealIds.has(did);
    });
  }, [applied.deal_id, filteredLines, selectedDealIds]);

  const tree = useMemo(() => buildTree(dealFilteredLines), [dealFilteredLines]);

  const allNodeKeys = useMemo(() => {
    const keys: string[] = [];
    for (const deal of tree.children) {
      keys.push(`deal:${deal.dealId}`);
      for (const ent of deal.children) keys.push(ent.id);
    }
    return keys;
  }, [tree]);

  const dealToChildKeys = useMemo(() => {
    const map: Record<string, string[]> = {};
    for (const deal of tree.children) {
      map[`deal:${deal.dealId}`] = deal.children.map((c) => c.id);
    }
    return map;
  }, [tree]);

  const selectedLines = useMemo(() => {
    if (selectedNodeKeys.size === 0) return dealFilteredLines;

    return dealFilteredLines.filter((l) => {
      const dealId = (String(l.parent_id || '—').trim() || '—');
      const dealKey = `deal:${dealId}`;
      const entityKey = `${l.entity_type}:${l.entity_id}`;
      return selectedNodeKeys.has(dealKey) || selectedNodeKeys.has(entityKey);
    });
  }, [dealFilteredLines, selectedNodeKeys]);

  const rawLines = useMemo(() => {
    const sorted = [...selectedLines].sort((a, b) => {
      const dc = a.date.localeCompare(b.date);
      if (dc !== 0) return dc;
      const tc = a.cashflow_type.localeCompare(b.cashflow_type);
      if (tc !== 0) return tc;
      const ec = a.entity_type.localeCompare(b.entity_type);
      if (ec !== 0) return ec;
      return a.entity_id.localeCompare(b.entity_id);
    });
    return sorted.slice(0, Math.max(1, rawLimit));
  }, [selectedLines, rawLimit]);

  const bucketRows = useMemo(() => {
    const map = new Map<string, { bucket: string; inflow: number; outflow: number }>();
    for (const l of selectedLines) {
      const bucket = bucketKey(l.date, granularity);
      const row = map.get(bucket) || { bucket, inflow: 0, outflow: 0 };
      if (l.direction === 'inflow') row.inflow += l.amount;
      else row.outflow += l.amount;
      map.set(bucket, row);
    }
    return Array.from(map.values())
      .sort((a, b) => a.bucket.localeCompare(b.bucket))
      .map((r) => ({
        ...r,
        net: r.inflow - r.outflow,
      }));
  }, [selectedLines, granularity]);

  const handleApply = () => {
    const next: CashflowAnalyticQueryParams = {
      start_date: startDate || undefined,
      end_date: endDate || undefined,
      as_of: asOf || undefined,
      deal_id: undefined,
    };

    const nextDealIds = Array.from(selectedDealIds.values());
    setApplied(next);
    setAppliedDealIds(nextDealIds);
    setIsAppliedOnce(true);
    fetchCashflowAnalytic(next, nextDealIds);
  };

  const selectionChangedSinceApply = useMemo(() => {
    if (!isAppliedOnce) return true;
    const current = Array.from(selectedDealIds.values()).sort((a, b) => a - b);
    const appliedSorted = [...appliedDealIds].sort((a, b) => a - b);
    if (current.length !== appliedSorted.length) return true;
    for (let i = 0; i < current.length; i++) {
      if (current[i] !== appliedSorted[i]) return true;
    }
    return false;
  }, [appliedDealIds, isAppliedOnce, selectedDealIds]);

  const detailContent = (
    <div className="sap-fiori-page p-4">
      {/* Header */}
      <div className="bg-[var(--sapPageHeader_Background)] border-b border-[var(--sapPageHeader_BorderColor)] -mx-4 -mt-4 px-4 py-4 mb-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-['72:Bold',sans-serif] text-xl text-[var(--sapTextColor,#131e29)]">
              {UX_COPY.pages.cashflow.title}
            </h1>
            <p className="text-sm text-[var(--sapContent_LabelColor,#556b82)] mt-1">
              {UX_COPY.pages.cashflow.subtitle}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge>Somente leitura</Badge>
            {role === 'auditoria' && <Badge>Auditoria</Badge>}
          </div>
          <FioriButton
            variant="ghost"
            icon={<RefreshCw className="w-4 h-4" />}
            onClick={handleRefetch}
            disabled={!isAppliedOnce}
          >
            Atualizar
          </FioriButton>
        </div>
      </div>

      {/* Grouping (Deal → SO/PO/Contrato/Exposure) - display only */}
      {dealFilteredLines.length > 0 && (
        <div className="bg-[var(--sapGroup_ContentBackground)] border border-[var(--sapGroup_ContentBorderColor)] rounded p-4 mb-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="font-['72:Bold',sans-serif] text-sm text-[var(--sapTextColor,#131e29)]">Itens por operação</div>
              <div className="text-xs text-[var(--sapContent_LabelColor,#556b82)]">
                Expanda um deal e selecione itens para somar.
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="text-xs text-[var(--sapLink_TextColor)] hover:underline"
                onClick={() => setSelectedNodeKeys(new Set())}
              >
                Consolidar todos
              </button>
            </div>
          </div>

          {tree.children.map((deal) => {
            const isOpen = openDeals[deal.dealId] ?? true;
            const dealKey = `deal:${deal.dealId}`;
            const isAllMode = selectedNodeKeys.size === 0;
            const dealChecked = isAllMode ? true : selectedNodeKeys.has(dealKey);

            return (
              <div key={deal.id} className="border-t border-[var(--sapList_BorderColor,#e5e5e5)] pt-2 mt-2">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <button
                      type="button"
                      className="w-8 h-8 flex items-center justify-center rounded hover:bg-[var(--sapList_Hover_Background,#f5f6f7)]"
                      onClick={() => setOpenDeals((p) => ({ ...p, [deal.dealId]: !isOpen }))}
                      aria-label={isOpen ? 'Recolher' : 'Expandir'}
                    >
                      {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                    </button>

                    <Checkbox
                      checked={dealChecked}
                      onCheckedChange={(v) => {
                        const checked = Boolean(v);
                        setSelectedNodeKeys((prev) => {
                          const prevIsAll = prev.size === 0;
                          const next = prevIsAll ? new Set(allNodeKeys) : new Set(prev);
                          const keysToChange = [dealKey, ...(dealToChildKeys[dealKey] ?? [])];
                          for (const k of keysToChange) {
                            if (checked) next.add(k);
                            else next.delete(k);
                          }
                          if (next.size === allNodeKeys.length) return new Set();
                          return next;
                        });
                      }}
                    />

                    <div className="min-w-0">
                      <div className="font-['72:Bold',sans-serif] text-sm text-[var(--sapTextColor,#131e29)] truncate">
                        {deal.label}
                      </div>
                      <div className="text-xs text-[var(--sapContent_LabelColor,#556b82)]">{formatTotals(deal.totals)}</div>
                    </div>
                  </div>
                </div>

                {isOpen && (
                  <div className="mt-2 pl-10">
                    {deal.children.map((ent) => {
                      const checked = isAllMode ? true : selectedNodeKeys.has(ent.id);
                      return (
                        <div
                          key={ent.id}
                          className="flex items-center justify-between gap-2 px-2 py-2 rounded hover:bg-[var(--sapList_Hover_Background,#f5f6f7)]"
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <Checkbox
                              checked={checked}
                              onCheckedChange={(v) => {
                                const isChecked = Boolean(v);
                                setSelectedNodeKeys((prev) => {
                                  const prevIsAll = prev.size === 0;
                                  const next = prevIsAll ? new Set(allNodeKeys) : new Set(prev);
                                  if (isChecked) next.add(ent.id);
                                  else next.delete(ent.id);
                                  if (next.size === allNodeKeys.length) return new Set();
                                  return next;
                                });
                              }}
                            />
                            <div className="min-w-0">
                              <div className="text-sm text-[var(--sapTextColor,#131e29)] truncate">{ent.label}</div>
                              <div className="text-xs text-[var(--sapContent_LabelColor,#556b82)]">{formatTotals(ent.totals)}</div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Filters */}
      <div className="bg-[var(--sapGroup_ContentBackground)] border border-[var(--sapGroup_ContentBorderColor)] rounded p-4 mb-4">
        <div className="flex items-center gap-2 mb-3">
          <Search className="w-4 h-4 text-[var(--sapContent_LabelColor,#556b82)]" />
          <div className="font-['72:Bold',sans-serif] text-sm text-[var(--sapTextColor,#131e29)]">Filtros</div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3">
          <FioriInput label="Início" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} fullWidth />
          <FioriInput label="Fim" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} fullWidth />
          <FioriInput label="Data-base" type="date" value={asOf} onChange={(e) => setAsOf(e.target.value)} fullWidth />

          <div className="flex flex-col">
            <label
              htmlFor="cashflow-analytic-granularity"
              className="text-xs text-[var(--sapContent_LabelColor,#556b82)] mb-1"
            >
              Granularidade
            </label>
            <select
              id="cashflow-analytic-granularity"
              className="h-[2.5rem] rounded border border-[var(--sapUiFieldBorderColor,#89919a)] bg-white px-2"
              value={granularity}
              onChange={(e) => setGranularity(e.target.value as Granularity)}
              aria-label="Granularidade"
            >
              <option value="day">Diário</option>
              <option value="week">Semanal</option>
              <option value="month">Mensal</option>
              <option value="quarter">Trimestral</option>
            </select>
          </div>

          <div className="flex items-end">
            <FioriButton variant="emphasized" onClick={handleApply}>
              Aplicar
            </FioriButton>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="text-xs text-[var(--sapContent_LabelColor,#556b82)] mb-2">Tipos</div>
            <div className="flex flex-wrap gap-4">
              {(['physical', 'financial', 'risk'] as CashFlowType[]).map((t) => (
                <label key={t} className="flex items-center gap-2 text-sm">
                  <Checkbox
                    checked={typeFilter[t]}
                    onCheckedChange={(v) => setTypeFilter((p) => ({ ...p, [t]: Boolean(v) }))}
                  />
                  <span>{t}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <div className="text-xs text-[var(--sapContent_LabelColor,#556b82)] mb-2">Confiança</div>
            <div className="flex flex-wrap gap-4">
              {(['deterministic', 'estimated', 'risk'] as CashFlowConfidence[]).map((c) => (
                <label key={c} className="flex items-center gap-2 text-sm">
                  <Checkbox
                    checked={confidenceFilter[c]}
                    onCheckedChange={(v) => setConfidenceFilter((p) => ({ ...p, [c]: Boolean(v) }))}
                  />
                  <span>{c}</span>
                </label>
              ))}
            </div>
          </div>
        </div>


      </div>

      {/* Details */}
      {cashflowError ? (
        <ErrorState error={cashflowError} onRetry={handleRefetch} fullPage />
      ) : cashflowIsLoading && !cashflowData ? (
        <LoadingState message="Carregando fluxo de caixa..." fullPage />
      ) : selectedDealIds.size === 0 ? (
        <EmptyState
          title="Sem seleção"
          description="Selecione uma ou mais operações para calcular o fluxo de caixa."
          fullPage
        />
      ) : selectionChangedSinceApply ? (
        <EmptyState
          title="Pronto para calcular"
          description="Clique em Aplicar para calcular o fluxo de caixa para a seleção atual."
          fullPage
        />
      ) : dealFilteredLines.length === 0 ? (
        <EmptyState
          title="Sem itens"
          description="Sem itens no período/filtros selecionados. Ajuste e tente novamente."
          fullPage
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <div className="lg:col-span-12 bg-[var(--sapGroup_ContentBackground)] border border-[var(--sapGroup_ContentBorderColor)] rounded p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="font-['72:Bold',sans-serif] text-sm text-[var(--sapTextColor,#131e29)]">Resumo</div>
                <div className="text-xs text-[var(--sapContent_LabelColor,#556b82)]">Agregado por {granularity}</div>
              </div>
              <div className="text-xs text-[var(--sapContent_LabelColor,#556b82)]">
                {formatTotals(accumulateTotals(selectedLines))}
              </div>
            </div>

            {bucketRows.length === 0 ? (
              <div className="text-sm text-[var(--sapContent_LabelColor,#556b82)]">Selecione um nó para ver detalhes.</div>
            ) : (
              <div className="overflow-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-xs text-[var(--sapContent_LabelColor,#556b82)] border-b border-[var(--sapList_BorderColor,#e5e5e5)]">
                      <th className="py-2 pr-2">Período</th>
                      <th className="py-2 px-2 text-right">Inflow (USD)</th>
                      <th className="py-2 px-2 text-right">Outflow (USD)</th>
                      <th className="py-2 pl-2 text-right">Net (USD)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bucketRows.map((r) => (
                      <tr key={r.bucket} className="border-b border-[var(--sapList_BorderColor,#f0f0f0)]">
                        <td className="py-2 pr-2 whitespace-nowrap">{formatDate(r.bucket)}</td>
                        <td className="py-2 px-2 text-right whitespace-nowrap">{formatCurrency(r.inflow, 'USD')}</td>
                        <td className="py-2 px-2 text-right whitespace-nowrap">{formatCurrency(r.outflow, 'USD')}</td>
                        <td className="py-2 pl-2 text-right whitespace-nowrap">{formatCurrency(r.net, 'USD')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div className="mt-5 border-t border-[var(--sapList_BorderColor,#e5e5e5)] pt-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="font-['72:Bold',sans-serif] text-sm text-[var(--sapTextColor,#131e29)]">Linhas (raw)</div>
                  <div className="text-xs text-[var(--sapContent_LabelColor,#556b82)]">
                    Exibe as linhas diárias do backend para o nó selecionado.
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-2">
                    <label htmlFor="cashflow-raw-limit" className="text-xs text-[var(--sapContent_LabelColor,#556b82)]">
                      Limite
                    </label>
                    <input
                      id="cashflow-raw-limit"
                      type="number"
                      min={1}
                      max={2000}
                      value={rawLimit}
                      onChange={(e) => setRawLimit(Number(e.target.value || 200))}
                      className="h-9 w-24 rounded border border-[var(--sapUiFieldBorderColor,#89919a)] bg-white px-2 text-sm"
                    />
                  </div>
                  <FioriButton variant="ghost" onClick={() => setShowRawLines((v) => !v)}>
                    {showRawLines ? 'Ocultar' : 'Mostrar'}
                  </FioriButton>
                </div>
              </div>

              {showRawLines && (
                <>
                  {selectedLines.length > rawLimit && (
                    <div className="mt-2 text-xs text-[var(--sapContent_LabelColor,#556b82)]">
                      Mostrando {rawLines.length} de {selectedLines.length} linhas (aumente o limite para ver mais).
                    </div>
                  )}
                  <div className="mt-3 overflow-auto max-h-[360px]">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-left text-xs text-[var(--sapContent_LabelColor,#556b82)] border-b border-[var(--sapList_BorderColor,#e5e5e5)]">
                          <th className="py-2 pr-2">Data</th>
                          <th className="py-2 px-2">Tipo</th>
                          <th className="py-2 px-2">Dir</th>
                          <th className="py-2 px-2 text-right">Amount</th>
                          <th className="py-2 px-2">Entidade</th>
                          <th className="py-2 px-2">PriceType</th>
                          <th className="py-2 px-2">Valuation</th>
                          <th className="py-2 px-2">Ref</th>
                          <th className="py-2 px-2">Conf</th>
                          <th className="py-2 px-2 text-right">Qty</th>
                          <th className="py-2 px-2 text-right">Px</th>
                          <th className="py-2 pl-2">Explicação</th>
                        </tr>
                      </thead>
                      <tbody>
                        {rawLines.map((l) => (
                          <tr
                            key={`${l.entity_type}:${l.entity_id}:${l.cashflow_type}:${l.date}:${l.direction}:${l.confidence}`}
                            className="border-b border-[var(--sapList_BorderColor,#f0f0f0)]"
                          >
                            <td className="py-2 pr-2 whitespace-nowrap">{formatDate(l.date)}</td>
                            <td className="py-2 px-2 whitespace-nowrap">{l.cashflow_type}</td>
                            <td className="py-2 px-2 whitespace-nowrap">{l.direction}</td>
                            <td className="py-2 px-2 text-right whitespace-nowrap">{formatCurrency(l.amount, 'USD')}</td>
                            <td className="py-2 px-2 whitespace-nowrap">{l.entity_type}#{l.entity_id}</td>
                            <td className="py-2 px-2 whitespace-nowrap">{l.price_type || '—'}</td>
                            <td className="py-2 px-2 whitespace-nowrap">{l.valuation_method}</td>
                            <td className="py-2 px-2 whitespace-nowrap">{l.valuation_reference_date || '—'}</td>
                            <td className="py-2 px-2 whitespace-nowrap">{l.confidence}</td>
                            <td className="py-2 px-2 text-right whitespace-nowrap">
                              {l.quantity_mt == null ? '—' : String(l.quantity_mt)}
                            </td>
                            <td className="py-2 px-2 text-right whitespace-nowrap">
                              {l.unit_price_used == null ? '—' : String(l.unit_price_used)}
                            </td>
                            <td className="py-2 pl-2">
                              <span
                                className="block max-w-[28rem] truncate text-[var(--sapContent_LabelColor,#556b82)]"
                                title={l.explanation || ''}
                              >
                                {l.explanation || '—'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="mt-3 text-xs text-[var(--sapContent_LabelColor,#556b82)]">
        Data-base considerada: <span className="font-['72:Bold',sans-serif]">{applied.as_of || '—'}</span>
      </div>
    </div>
  );

  return (
    <FioriFlexibleColumnLayout
      masterTitle="Operações"
      masterContent={masterContent}
      masterWidth={360}
      detailContent={detailContent}
    />
  );
}

export default CashflowPageIntegrated;
