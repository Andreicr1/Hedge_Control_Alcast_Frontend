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

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCashflowAnalytic } from '../../hooks';
import type { CashFlowLine, CashflowAnalyticQueryParams, Deal } from '../../types';
import { listDeals } from '../../services/deals.service';
import { ErrorState, EmptyState, LoadingState } from '../components/ui';
import { FioriButton } from '../components/fiori/FioriButton';
import { ChevronDown, ChevronRight, RefreshCw } from 'lucide-react';
import { UX_COPY } from '../ux/copy';

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

export function CashflowPageIntegrated() {
  const navigate = useNavigate();

  const [deals, setDeals] = useState<Deal[]>([]);
  const [isLoadingDeals, setIsLoadingDeals] = useState(false);
  const [dealsError, setDealsError] = useState<string | null>(null);

  const today = useMemo(() => isoToday(), []);

  const [query, setQuery] = useState<CashflowAnalyticQueryParams>(() => ({
    as_of: today,
    start_date: today,
    end_date: addDaysIso(today, 90),
  }));

  const cashflow = useCashflowAnalytic(query);
  const [collapsedDeals, setCollapsedDeals] = useState<Record<string, boolean>>({});

  const fetchDeals = useCallback(async () => {
    setIsLoadingDeals(true);
    setDealsError(null);
    try {
      setDeals(await listDeals());
    } catch {
      setDeals([]);
      setDealsError('Erro ao carregar operações');
    } finally {
      setIsLoadingDeals(false);
    }
  }, []);

  useEffect(() => {
    fetchDeals();
  }, [fetchDeals]);

  const dealLabelById = useMemo(() => {
    const map = new Map<number, string>();
    for (const d of deals) {
      const label = (d.reference_name || '').trim() || `Deal #${d.id}`;
      map.set(d.id, label);
    }
    return map;
  }, [deals]);

  const normalizedLines: CashFlowLine[] = useMemo(() => {
    const raw = cashflow.data || [];
    return raw.filter((l) => l.entity_type !== 'exposure' && l.cashflow_type !== 'risk');
  }, [cashflow.data]);

  const dateColumns = useMemo(() => {
    const set = new Set<string>();
    for (const l of normalizedLines) set.add(String(l.date));
    return Array.from(set.values()).sort((a, b) => a.localeCompare(b));
  }, [normalizedLines]);

  const rows: MatrixRow[] = useMemo(() => {
    const byDeal = new Map<string, CashFlowLine[]>();
    for (const l of normalizedLines) {
      if (l.entity_type !== 'so' && l.entity_type !== 'po' && l.entity_type !== 'contract') continue;
      const dealId = (l.parent_id || '').trim() || '—';
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
        Number.isFinite(dealIdNum) && dealIdNum > 0 ? dealLabelById.get(dealIdNum) || `Deal #${dealIdNum}` : `Deal ${dealId}`;

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

      const itemRowsByType: Record<'so' | 'po' | 'contract', Map<string, MatrixRow>> = {
        so: new Map(),
        po: new Map(),
        contract: new Map(),
      };

      for (const l of dealLines) {
        if (l.entity_type !== 'so' && l.entity_type !== 'po' && l.entity_type !== 'contract') continue;
        const type = l.entity_type;
        const v = signedAmountUsd(l);

        add(dealRow.valuesByDate, l.date, v);
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

      pushGroup('so', 'Sales Orders (SO)');
      pushGroup('po', 'Purchase Orders (PO)');
      pushGroup('contract', 'Contratos');
    }

    return out;
  }, [normalizedLines, dealLabelById, collapsedDeals]);

  const appliedAsOf = useMemo(() => (query.as_of ? formatIsoDate(String(query.as_of)) : '—'), [query.as_of]);

  return (
    <div className="sap-fiori-page">
      <div className="bg-[var(--sapPageHeader_Background)] border-b border-[var(--sapPageHeader_BorderColor)] -mx-4 -mt-4 px-4 py-4 mb-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-[var(--sapPageHeader_TextColor)] text-xl font-normal m-0">{UX_COPY.pages.cashflow.title}</h1>
            <p className="text-[var(--sapContent_LabelColor)] text-sm mt-1">
              Matriz por data (as-of): <span className="font-['72:Bold',sans-serif]">{appliedAsOf}</span>
            </p>
          </div>
          <FioriButton variant="ghost" icon={<RefreshCw className="w-4 h-4" />} onClick={cashflow.refetch}>
            Atualizar
          </FioriButton>
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-3">
          <label className="text-xs text-[var(--sapContent_LabelColor)]">
            Período (de)
            <input
              className="mt-1 w-full p-2 border border-[var(--sapField_BorderColor)] rounded bg-white text-sm"
              type="date"
              value={query.start_date || ''}
              onChange={(e) => setQuery((prev) => ({ ...prev, start_date: e.target.value || undefined }))}
            />
          </label>

          <label className="text-xs text-[var(--sapContent_LabelColor)]">
            Período (até)
            <input
              className="mt-1 w-full p-2 border border-[var(--sapField_BorderColor)] rounded bg-white text-sm"
              type="date"
              value={query.end_date || ''}
              onChange={(e) => setQuery((prev) => ({ ...prev, end_date: e.target.value || undefined }))}
            />
          </label>

          <label className="text-xs text-[var(--sapContent_LabelColor)]">
            As-of (corte)
            <input
              className="mt-1 w-full p-2 border border-[var(--sapField_BorderColor)] rounded bg-white text-sm"
              type="date"
              value={query.as_of || ''}
              onChange={(e) => setQuery((prev) => ({ ...prev, as_of: e.target.value || undefined }))}
            />
          </label>

          <label className="text-xs text-[var(--sapContent_LabelColor)]">
            Operação (Deal)
            <select
              className="mt-1 w-full p-2 border border-[var(--sapField_BorderColor)] rounded bg-white text-sm"
              value={query.deal_id ?? ''}
              onChange={(e) => {
                const v = e.target.value;
                setQuery((prev) => ({ ...prev, deal_id: v ? Number(v) : undefined }));
              }}
              disabled={isLoadingDeals}
            >
              <option value="">(todas)</option>
              {deals.map((d) => (
                <option key={d.id} value={d.id}>
                  {(d.reference_name || '').trim() || `Deal #${d.id}`}
                </option>
              ))}
            </select>
          </label>
        </div>

        {dealsError && <div className="text-xs text-[var(--sapNegativeColor)] mt-2">{dealsError}</div>}
      </div>

      {cashflow.isLoading && <LoadingState message="Carregando cashflow..." />}
      {cashflow.isError && <ErrorState error={cashflow.error || null} onRetry={cashflow.refetch} />}

      {!cashflow.isLoading && !cashflow.isError && (
        <div className="sap-fiori-section">
          <div className="sap-fiori-section-content">
            {normalizedLines.length === 0 ? (
              <EmptyState title={UX_COPY.pages.cashflow.empty} description="Nenhuma linha encontrada no período." />
            ) : (
              <div className="border border-[var(--sapList_BorderColor)] rounded overflow-hidden">
                <div className="overflow-auto">
                  <table className="min-w-[900px] w-full">
                    <thead>
                      <tr className="border-b border-[var(--sapList_BorderColor)] bg-[var(--sapList_HeaderBackground)]">
                        <th className="text-left p-3 text-sm sticky left-0 bg-[var(--sapList_HeaderBackground)] z-10">Item</th>
                        {dateColumns.map((d) => (
                          <th key={d} className="text-right p-3 text-xs whitespace-nowrap">
                            {formatIsoDate(d)}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {rows.map((r) => {
                        const isDeal = r.kind === 'deal';
                        const isGroup = r.kind === 'group';
                        const collapsed = !!collapsedDeals[r.dealId];
                        const isNegativeRow = (d: string) => {
                          const v = r.valuesByDate[d];
                          return typeof v === 'number' && v < 0;
                        };

                        return (
                          <tr
                            key={r.key}
                            className={`border-b border-[var(--sapList_BorderColor)] ${
                              isDeal ? 'bg-[var(--sapGroup_ContentBackground)] cursor-pointer hover:bg-[var(--sapList_HoverBackground)]' : 'bg-white'
                            }`}
                            onClick={() => {
                              if (r.kind === 'deal') {
                                setCollapsedDeals((prev) => ({ ...prev, [r.dealId]: !prev[r.dealId] }));
                                return;
                              }
                              if (r.kind === 'contract' && r.entityId) {
                                navigate(`/financeiro/contratos?id=${encodeURIComponent(String(r.entityId))}`);
                              }
                            }}
                          >
                            <td
                              className={`p-3 text-sm sticky left-0 z-10 ${isDeal ? 'bg-[var(--sapGroup_ContentBackground)]' : 'bg-white'}`}
                              style={{ paddingLeft: `${r.level * 16 + 12}px` }}
                            >
                              <div className="flex items-center gap-2">
                                {isDeal && (collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />)}
                                <span className={isDeal || isGroup ? "font-['72:Bold',sans-serif]" : ''}>{r.label}</span>
                              </div>
                            </td>
                            {dateColumns.map((d) => (
                              <td key={`${r.key}:${d}`} className="p-3 text-xs text-right whitespace-nowrap">
                                <span className={isNegativeRow(d) ? 'text-[var(--sapNegativeTextColor,#bb0000)]' : ''}>
                                  {formatUsdSigned(r.valuesByDate[d])}
                                </span>
                              </td>
                            ))}
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
  );
}

