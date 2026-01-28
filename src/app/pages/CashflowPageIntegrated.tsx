/**
 * Cashflow Page - Institutional Matrix (Treasury view)
 *
 * Institutional requirement:
 * - Columns = settlement dates
 * - Rows = Deal → SO / PO / Contract hierarchy
 * - Cell = expected settlement value (USD, signed)
 *
 * Data source = GET /cashflow/analytic (SO/PO physical + Contract financial).
 */

import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCashflowAnalytic } from '../../hooks';
import type { CashFlowLine, CashflowAnalyticQueryParams } from '../../types';
import { ErrorState, EmptyState, LoadingState } from '../components/ui';
import { FioriButton } from '../components/fiori/FioriButton';
import { ChevronDown, ChevronRight, RefreshCw } from 'lucide-react';
import { UX_COPY } from '../ux/copy';
import { AnalyticTwoPaneLayout } from '../analytics/AnalyticTwoPaneLayout';
import { AnalyticScopeTree } from '../analytics/AnalyticScopeTree';
import { useAnalyticScope } from '../analytics/ScopeProvider';
import { useAnalyticScopeUrlSync } from '../analytics/useAnalyticScopeUrlSync';

function parseIsoDateUtc(dateIso: string): Date {
  return new Date(`${dateIso}T00:00:00Z`);
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
  // ISO week date weeks start on Monday, week 1 contains Jan 4th.
  const tmp = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
  const day = tmp.getUTCDay() || 7;
  tmp.setUTCDate(tmp.getUTCDate() + 4 - day);
  const weekYear = tmp.getUTCFullYear();
  const yearStart = new Date(Date.UTC(weekYear, 0, 1));
  const weekNo = Math.ceil((((tmp.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
  const ww = String(weekNo).padStart(2, '0');
  return { key: `${weekYear}-W${ww}`, label: `W${ww} ${weekYear}` };
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

function formatIsoDate(dateIso?: string | null): string {
  if (!dateIso) return '—';
  const d = new Date(`${dateIso}T00:00:00Z`);
  if (Number.isNaN(d.getTime())) return String(dateIso);
  return d.toLocaleDateString('pt-BR');
}

function formatUsdSigned(value?: number | null): string {
  if (typeof value !== 'number' || Number.isNaN(value) || Math.abs(value) < 1e-9) return '—';
  const abs = Math.abs(value);
  const text = abs.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
  return value < 0 ? `-${text}` : text;
}

function signedAmountUsd(line: CashFlowLine): number {
  const s = line.direction === 'outflow' ? -1 : 1;
  return s * Number(line.amount || 0);
}

type MatrixRowKind = 'deal' | 'group' | 'so' | 'po' | 'contract';
type MatrixRow = {
  key: string;
  kind: MatrixRowKind;
  level: number;
  dealId: string;
  label: string;
  entityId?: string;
  valuesByDate: Record<string, number>;
};

type TimeBucketLevel = 'quarter' | 'month' | 'week' | 'day';
type TimeColumn = {
  key: string;
  label: string;
  level: TimeBucketLevel;
  dates: string[];
  canExpand: boolean;
  expanded: boolean;
};

export function CashflowPageIntegrated() {
  const navigate = useNavigate();

  useAnalyticScopeUrlSync({ acceptLegacyDealId: true });
  const { scope } = useAnalyticScope();

  const today = useMemo(() => isoToday(), []);

  const [queryBase, setQueryBase] = useState<CashflowAnalyticQueryParams>(() => ({
    as_of: today,
    start_date: today,
    end_date: addDaysIso(today, 90),
  }));

  const matrixQuery: CashflowAnalyticQueryParams | null = useMemo(() => {
    if (scope.kind === 'none') return null;
    if (scope.kind === 'all') return { ...queryBase };
    return { ...queryBase, deal_id: scope.dealId };
  }, [queryBase, scope]);

  const cashflow = useCashflowAnalytic(matrixQuery);
  const [collapsedDeals, setCollapsedDeals] = useState<Record<string, boolean>>({});

  const [expandedQuarters, setExpandedQuarters] = useState<Record<string, boolean>>({});
  const [expandedMonths, setExpandedMonths] = useState<Record<string, boolean>>({});
  const [expandedWeeks, setExpandedWeeks] = useState<Record<string, boolean>>({});

  const lines: CashFlowLine[] = useMemo(() => cashflow.data || [], [cashflow.data]);

  const dealIdOfLine = (l: CashFlowLine): string | null => {
    if (l.entity_type === 'deal') return String(l.entity_id || '').trim() || null;
    const pid = String(l.parent_id || '').trim();
    return pid || null;
  };

  const allDates = useMemo(() => {
    const set = new Set<string>();
    for (const l of lines) set.add(String(l.date));
    return Array.from(set.values()).sort((a, b) => a.localeCompare(b));
  }, [lines]);

  const timeTree = useMemo(() => {
    type WeekNode = { label: string; dates: string[] };
    type MonthNode = { label: string; dates: string[]; weeks: Map<string, WeekNode> };
    type QuarterNode = { label: string; dates: string[]; months: Map<string, MonthNode> };

    const quarters = new Map<string, QuarterNode>();

    for (const dateIso of allDates) {
      const q = quarterKey(dateIso);
      const m = monthKey(dateIso);
      const w = isoWeekKey(dateIso);

      const qNode = quarters.get(q.key) || { label: q.label, dates: [], months: new Map<string, MonthNode>() };
      qNode.dates.push(dateIso);

      const mNode = qNode.months.get(m.key) || { label: m.label, dates: [], weeks: new Map<string, WeekNode>() };
      mNode.dates.push(dateIso);

      const wNode = mNode.weeks.get(w.key) || { label: w.label, dates: [] };
      wNode.dates.push(dateIso);

      mNode.weeks.set(w.key, wNode);
      qNode.months.set(m.key, mNode);
      quarters.set(q.key, qNode);
    }

    // Normalize ordering.
    for (const qNode of quarters.values()) {
      qNode.dates.sort((a, b) => a.localeCompare(b));
      for (const mNode of qNode.months.values()) {
        mNode.dates.sort((a, b) => a.localeCompare(b));
        for (const wNode of mNode.weeks.values()) {
          wNode.dates.sort((a, b) => a.localeCompare(b));
        }
      }
    }

    return quarters;
  }, [allDates]);

  const timeColumns: TimeColumn[] = useMemo(() => {
    const quarterKeys = Array.from(timeTree.keys()).sort((a, b) => {
      const [ay, aq] = a.split('-Q');
      const [by, bq] = b.split('-Q');
      const na = Number(ay) * 10 + Number(aq);
      const nb = Number(by) * 10 + Number(bq);
      return na - nb;
    });

    const cols: TimeColumn[] = [];

    for (const qKey of quarterKeys) {
      const qNode = timeTree.get(qKey);
      if (!qNode) continue;
      const hasMonths = qNode.months.size > 0;
      const qExpanded = !!expandedQuarters[qKey] && hasMonths;

      if (!qExpanded) {
        cols.push({
          key: qKey,
          label: qNode.label,
          level: 'quarter',
          dates: qNode.dates,
          canExpand: hasMonths,
          expanded: qExpanded,
        });
        continue;
      }

      const monthKeys = Array.from(qNode.months.keys()).sort((a, b) => a.localeCompare(b));
      for (const mKey of monthKeys) {
        const mNode = qNode.months.get(mKey);
        if (!mNode) continue;
        const hasWeeks = mNode.weeks.size > 0;
        const mExpanded = !!expandedMonths[mKey] && hasWeeks;

        if (!mExpanded) {
          cols.push({
            key: mKey,
            label: mNode.label,
            level: 'month',
            dates: mNode.dates,
            canExpand: hasWeeks,
            expanded: mExpanded,
          });
          continue;
        }

        const weekKeys = Array.from(mNode.weeks.keys()).sort((a, b) => a.localeCompare(b));
        for (const wKey of weekKeys) {
          const wNode = mNode.weeks.get(wKey);
          if (!wNode) continue;
          const hasDays = wNode.dates.length > 1;
          const wExpanded = !!expandedWeeks[wKey] && hasDays;

          if (!wExpanded) {
            cols.push({
              key: wKey,
              label: wNode.label,
              level: 'week',
              dates: wNode.dates,
              canExpand: hasDays,
              expanded: wExpanded,
            });
            continue;
          }

          for (const d of wNode.dates) {
            cols.push({
              key: d,
              label: formatIsoDate(d),
              level: 'day',
              dates: [d],
              canExpand: false,
              expanded: false,
            });
          }
        }
      }
    }

    return cols;
  }, [timeTree, expandedQuarters, expandedMonths, expandedWeeks]);

  const sumRowForDates = (r: MatrixRow, dates: string[]): number => {
    let acc = 0;
    for (const d of dates) acc += r.valuesByDate[d] || 0;
    return acc;
  };

  const rows: MatrixRow[] = useMemo(() => {
    const byDeal = new Map<string, CashFlowLine[]>();
    for (const l of lines) {
      const dealId = dealIdOfLine(l);
      if (!dealId) continue;
      const list = byDeal.get(dealId) || [];
      list.push(l);
      byDeal.set(dealId, list);
    }

    const dealIds = Array.from(byDeal.keys()).sort((a, b) => {
      const na = Number(a);
      const nb = Number(b);
      if (Number.isFinite(na) && Number.isFinite(nb)) return na - nb;
      return a.localeCompare(b);
    });

    const add = (obj: Record<string, number>, date: string, v: number) => {
      obj[date] = (obj[date] || 0) + v;
    };

    const out: MatrixRow[] = [];

    for (const dealId of dealIds) {
      const dealLines = byDeal.get(dealId) || [];
      const dealIdNum = Number(dealId);
      const dealLabel =
        Number.isFinite(dealIdNum) && dealIdNum > 0 ? `Deal #${dealIdNum}` : `Deal ${dealId}`;

      const dealRow: MatrixRow = {
        key: `deal:${dealId}`,
        kind: 'deal',
        level: 0,
        dealId,
        label: dealLabel,
        valuesByDate: {},
      };

      const groupTotals: Record<'so' | 'po' | 'contract', Record<string, number>> = {
        so: {},
        po: {},
        contract: {},
      };

      const riskTotals: Record<string, number> = {};

      const itemRowsByType: Record<'so' | 'po' | 'contract', Map<string, MatrixRow>> = {
        so: new Map(),
        po: new Map(),
        contract: new Map(),
      };

      for (const l of dealLines) {
        const v = signedAmountUsd(l);

        add(dealRow.valuesByDate, l.date, v);

        // Keep the hierarchy (SO/PO/Contrato) but also include risk in the consolidated view.
        if (l.cashflow_type === 'risk' || l.confidence === 'risk' || l.entity_type === 'exposure') {
          add(riskTotals, l.date, v);
          continue;
        }

        if (l.entity_type !== 'so' && l.entity_type !== 'po' && l.entity_type !== 'contract') continue;

        const type = l.entity_type;
        add(groupTotals[type], l.date, v);

        const key = `${type}:${l.entity_id}`;
        const map = itemRowsByType[type];
        const existing = map.get(key);

        const label =
          type === 'so'
            ? `SO ${l.source_reference || `#${l.entity_id}`}`
            : type === 'po'
              ? `PO ${l.source_reference || `#${l.entity_id}`}`
              : `Contrato ${l.entity_id}`;

        const row: MatrixRow =
          existing ||
          ({
            key,
            kind: type,
            level: 2,
            dealId,
            label,
            entityId: l.entity_id,
            valuesByDate: {},
          } as MatrixRow);

        add(row.valuesByDate, l.date, v);
        map.set(key, row);
      }

      out.push(dealRow);

      if (collapsedDeals[dealId]) continue;

      const pushGroup = (kind: 'so' | 'po' | 'contract', title: string) => {
        const items = Array.from(itemRowsByType[kind].values());
        if (!items.length) return;

        out.push({
          key: `group:${dealId}:${kind}`,
          kind: 'group',
          level: 1,
          dealId,
          label: title,
          valuesByDate: groupTotals[kind],
        });

        items.sort((a, b) => a.label.localeCompare(b.label));
        out.push(...items);
      };

      pushGroup('so', 'Pedidos de Venda (SO)');
      pushGroup('po', 'Pedidos de Compra (PO)');
      pushGroup('contract', 'Contratos');

      if (Object.keys(riskTotals).length > 0) {
        out.push({
          key: `group:${dealId}:risk`,
          kind: 'group',
          level: 1,
          dealId,
          label: 'Risco (estimado)',
          valuesByDate: riskTotals,
        });
      }
    }

    return out;
  }, [lines, collapsedDeals]);

  const selectedLines: CashFlowLine[] = useMemo(() => {
    if (scope.kind === 'none') return [];
    if (scope.kind === 'all') return lines;

    if (scope.kind === 'deal') {
      const did = String(scope.dealId);
      return lines.filter((l) => dealIdOfLine(l) === did);
    }

    if (scope.kind === 'so') {
      const id = String(scope.soId);
      return lines.filter((l) => l.entity_type === 'so' && String(l.entity_id) === id);
    }

    if (scope.kind === 'po') {
      const id = String(scope.poId);
      return lines.filter((l) => l.entity_type === 'po' && String(l.entity_id) === id);
    }

    // contract
    const id = String(scope.contractId);
    return lines.filter((l) => l.entity_type === 'contract' && String(l.entity_id) === id);
  }, [lines, scope]);

  const selectionTitle = useMemo(() => {
    if (scope.kind === 'none') return 'Nenhuma seleção';
    if (scope.kind === 'all') return 'Todos os deals';
    if (scope.kind === 'deal') return `Deal #${scope.dealId}`;
    if (scope.kind === 'so') return `SO #${scope.soId} · Deal #${scope.dealId}`;
    if (scope.kind === 'po') return `PO #${scope.poId} · Deal #${scope.dealId}`;
    return `Contrato ${scope.contractId} (Deal #${scope.dealId})`;
  }, [scope]);

  const totals = useMemo(() => {
    let inflow = 0;
    let outflow = 0;
    for (const l of selectedLines) {
      const v = signedAmountUsd(l);
      if (v >= 0) inflow += v;
      else outflow += -v;
    }
    return {
      inflow,
      outflow,
      net: inflow - outflow,
    };
  }, [selectedLines]);

  const confidenceTotals = useMemo(() => {
    let deterministic = 0;
    let estimated = 0;
    let risk = 0;

    for (const l of selectedLines) {
      const v = signedAmountUsd(l);
      if (l.confidence === 'deterministic') deterministic += v;
      else if (l.confidence === 'estimated') estimated += v;
      else risk += v;
    }

    return { deterministic, estimated, risk };
  }, [selectedLines]);

  const appliedAsOf = useMemo(() => (queryBase.as_of ? formatIsoDate(String(queryBase.as_of)) : '—'), [queryBase.as_of]);
  const showInitialLoading = cashflow.isLoading && !cashflow.data;

  return (
    <AnalyticTwoPaneLayout
      left={<AnalyticScopeTree />}
      right={
        <div className="sap-fiori-page">
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
                <FioriButton
                  variant="ghost"
                  icon={<RefreshCw className="w-4 h-4" />}
                  onClick={cashflow.refetch}
                  disabled={scope.kind === 'none'}
                >
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
                  value={queryBase.start_date || ''}
                  onChange={(e) => setQueryBase((prev) => ({ ...prev, start_date: e.target.value || undefined }))}
                />
              </label>

              <label className="text-xs text-[var(--sapContent_LabelColor)]">
                Período (até)
                <input
                  className="mt-1 w-full p-2 border border-[var(--sapField_BorderColor)] rounded bg-white text-sm"
                  type="date"
                  value={queryBase.end_date || ''}
                  onChange={(e) => setQueryBase((prev) => ({ ...prev, end_date: e.target.value || undefined }))}
                />
              </label>

              <label className="text-xs text-[var(--sapContent_LabelColor)]">
                Data de corte
                <input
                  className="mt-1 w-full p-2 border border-[var(--sapField_BorderColor)] rounded bg-white text-sm"
                  type="date"
                  value={queryBase.as_of || ''}
                  onChange={(e) => setQueryBase((prev) => ({ ...prev, as_of: e.target.value || undefined }))}
                />
              </label>
            </div>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="p-3 rounded border border-[var(--sapTile_BorderColor)] bg-white">
                <div className="text-[11px] text-[var(--sapContent_LabelColor)]">Saldo líquido (USD)</div>
                <div className="text-sm font-['72:Bold',sans-serif]">{formatUsdSigned(totals.net)}</div>
              </div>
              <div className="p-3 rounded border border-[var(--sapTile_BorderColor)] bg-white">
                <div className="text-[11px] text-[var(--sapContent_LabelColor)]">Determinístico (USD)</div>
                <div className="text-sm font-['72:Bold',sans-serif]">{formatUsdSigned(confidenceTotals.deterministic)}</div>
              </div>
              <div className="p-3 rounded border border-[var(--sapTile_BorderColor)] bg-white">
                <div className="text-[11px] text-[var(--sapContent_LabelColor)]">Estimado + Risco (USD)</div>
                <div className="text-sm font-['72:Bold',sans-serif]">
                  {formatUsdSigned(confidenceTotals.estimated + confidenceTotals.risk)}
                </div>
              </div>
            </div>
          </div>

          {scope.kind === 'none' ? (
            <div className="p-6">
              <EmptyState
                title="Sem seleção"
                description="Selecione um deal para visualizar." 
              />
            </div>
          ) : (
            <>
              {showInitialLoading ? <LoadingState message="Carregando cashflow..." /> : null}
              {cashflow.isError ? <ErrorState error={cashflow.error || null} onRetry={cashflow.refetch} /> : null}

              {!showInitialLoading && !cashflow.isError ? (
                <div className="sap-fiori-section">
                  <div className="sap-fiori-section-content">
                    {selectedLines.length === 0 ? (
                      <EmptyState title={UX_COPY.pages.cashflow.empty} description="Nenhuma linha encontrada no período." />
                    ) : (
                      <>
                        <div className="mb-2 flex items-center justify-between gap-3">
                          <div className="text-xs text-[var(--sapContent_LabelColor)]">
                            Preço variável (AVG/AVGInter/C2R) ⇒ exposição ⇒ hedge. Preço fixo ⇒ sem exposição.
                          </div>
                          <div className="flex items-center gap-2">
                            <FioriButton
                              variant="ghost"
                              onClick={() => {
                                setExpandedQuarters({});
                                setExpandedMonths({});
                                setExpandedWeeks({});
                              }}
                            >
                              Recolher colunas
                            </FioriButton>
                          </div>
                        </div>

                        <div className="border border-[var(--sapList_BorderColor)] rounded overflow-hidden bg-white">
                          <div className="overflow-auto">
                            <table className="min-w-[900px] w-full">
                              <thead>
                                <tr className="border-b border-[var(--sapList_BorderColor)] bg-white">
                                  <th className="text-left p-3 text-xs sticky left-0 z-20 bg-white">Entidade</th>
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
                                      <th key={c.key} className="text-right p-3 text-xs whitespace-nowrap">
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
                                </tr>
                              </thead>
                              <tbody>
                                {rows.map((r) => {
                                  const isDeal = r.kind === 'deal';
                                  const isGroup = r.kind === 'group';
                                  const collapsed = !!collapsedDeals[r.dealId];
                                  const isNegative = (v: number) => typeof v === 'number' && v < 0;

                                  // When scope is narrowed, avoid showing other deals.
                                  if (scope.kind !== 'all' && String(scope.dealId) !== r.dealId) return null;

                                  return (
                                    <tr
                                      key={r.key}
                                      className={`border-b border-[var(--sapList_BorderColor)] ${
                                        isDeal
                                          ? 'bg-[var(--sapGroup_ContentBackground)] cursor-pointer hover:bg-[var(--sapList_HoverBackground)]'
                                          : 'bg-white'
                                      }`}
                                      onClick={() => {
                                        if (r.kind === 'deal' && scope.kind === 'all') {
                                          setCollapsedDeals((prev) => ({ ...prev, [r.dealId]: !prev[r.dealId] }));
                                          return;
                                        }
                                        if (r.kind === 'contract' && r.entityId) {
                                          navigate(`/financeiro/contratos?id=${encodeURIComponent(String(r.entityId))}`);
                                        }
                                      }}
                                    >
                                      <td
                                        className={`p-3 text-sm sticky left-0 z-10 ${
                                          isDeal ? 'bg-[var(--sapGroup_ContentBackground)]' : 'bg-white'
                                        }`}
                                        style={{ paddingLeft: `${r.level * 16 + 12}px` }}
                                      >
                                        <div className="flex items-center gap-2">
                                          {isDeal && scope.kind === 'all' ? (
                                            collapsed ? (
                                              <ChevronRight className="w-4 h-4" />
                                            ) : (
                                              <ChevronDown className="w-4 h-4" />
                                            )
                                          ) : null}
                                          <span className={isDeal || isGroup ? "font-['72:Bold',sans-serif]" : ''}>{r.label}</span>
                                        </div>
                                      </td>

                                      {timeColumns.map((c) => {
                                        const v = sumRowForDates(r, c.dates);
                                        return (
                                          <td key={`${r.key}:${c.key}`} className="p-3 text-xs text-right whitespace-nowrap">
                                            <span className={isNegative(v) ? 'text-[var(--sapNegativeTextColor,#bb0000)]' : ''}>
                                              {formatUsdSigned(v)}
                                            </span>
                                          </td>
                                        );
                                      })}
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              ) : null}
            </>
          )}
        </div>
      }
    />
  );
}

