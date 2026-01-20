/**
 * Cashflow Page - Analytical Center (Treasury view)
 *
 * Core requirement: CFO must answer in <60 seconds:
 * - Quanto entra, quanto sai, quando, porquê, e de onde?
 *
 * Layout: Two columns
 * - Left: Deal hierarchy (Deal → PO/SO → Contract → Hedge)
 * - Right: Consolidated analysis (period, currency, type)
 */

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCashflowAnalytic } from '../../hooks';
import type { CashFlowLine, CashflowAnalyticQueryParams, Deal } from '../../types';
import { listDeals } from '../../services/deals.service';
import { ErrorState, EmptyState, LoadingState } from '../components/ui';
import { FioriButton } from '../components/fiori/FioriButton';
import { TwoColumnAnalyticalLayout } from '../components/fiori/TwoColumnAnalyticalLayout';
import { ChevronDown, ChevronRight, RefreshCw, TrendingUp, TrendingDown, Eye, EyeOff } from 'lucide-react';
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

type ConsolidationPeriod = 'daily' | 'monthly' | 'quarterly' | 'annual';
type CashflowViewMode = 'consolidated' | 'raw';

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
  const [selectedDealId, setSelectedDealId] = useState<string | null>(null);
  
  // New state for consolidation and filters
  const [consolidationPeriod, setConsolidationPeriod] = useState<ConsolidationPeriod>('monthly');
  const [viewMode, setViewMode] = useState<CashflowViewMode>('consolidated');
  const [currencyFilter, setCurrencyFilter] = useState<string>('USD');
  const [typeFilter, setTypeFilter] = useState<'all' | 'physical' | 'financial' | 'hedge'>('all');

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

  // Consolidation helper: group dates by period
  const consolidateDatesByPeriod = useCallback((dates: string[], period: ConsolidationPeriod): Map<string, string[]> => {
    const groups = new Map<string, string[]>();
    
    for (const date of dates) {
      let key: string;
      const d = new Date(`${date}T00:00:00Z`);
      const year = d.getUTCFullYear();
      const month = d.getUTCMonth() + 1;
      const quarter = Math.ceil(month / 3);
      
      switch (period) {
        case 'daily':
          key = date;
          break;
        case 'monthly':
          key = `${year}-${String(month).padStart(2, '0')}`;
          break;
        case 'quarterly':
          key = `${year}-Q${quarter}`;
          break;
        case 'annual':
          key = String(year);
          break;
      }
      
      const existing = groups.get(key) || [];
      existing.push(date);
      groups.set(key, existing);
    }
    
    return groups;
  }, []);

  // Get consolidated columns and data
  const { consolidatedColumns, consolidatedRows } = useMemo(() => {
    if (viewMode === 'raw') {
      return { consolidatedColumns: dateColumns, consolidatedRows: rows };
    }

    const dateGroups = consolidateDatesByPeriod(dateColumns, consolidationPeriod);
    const periodKeys = Array.from(dateGroups.keys()).sort();

    const newRows = rows.map(row => {
      const newValuesByDate: Record<string, number> = {};
      
      for (const [periodKey, dates] of dateGroups.entries()) {
        let total = 0;
        for (const date of dates) {
          total += row.valuesByDate[date] || 0;
        }
        newValuesByDate[periodKey] = total;
      }
      
      return { ...row, valuesByDate: newValuesByDate };
    });

    return { consolidatedColumns: periodKeys, consolidatedRows: newRows };
  }, [dateColumns, rows, consolidationPeriod, viewMode, consolidateDatesByPeriod]);

  // Calculate summary metrics for CFO dashboard
  const summaryMetrics = useMemo(() => {
    let totalInflow = 0;
    let totalOutflow = 0;
    const inflowByMonth = new Map<string, number>();
    const outflowByMonth = new Map<string, number>();

    for (const line of normalizedLines) {
      const amount = signedAmountUsd(line);
      const d = new Date(`${line.date}T00:00:00Z`);
      const monthKey = `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}`;

      if (amount > 0) {
        totalInflow += amount;
        inflowByMonth.set(monthKey, (inflowByMonth.get(monthKey) || 0) + amount);
      } else {
        totalOutflow += Math.abs(amount);
        outflowByMonth.set(monthKey, (outflowByMonth.get(monthKey) || 0) + Math.abs(amount));
      }
    }

    return {
      totalInflow,
      totalOutflow,
      netPosition: totalInflow - totalOutflow,
      inflowByMonth,
      outflowByMonth,
    };
  }, [normalizedLines]);

  const appliedAsOf = useMemo(() => (query.as_of ? formatIsoDate(String(query.as_of)) : '—'), [query.as_of]);

  return (
    <div className="sap-fiori-page h-full">
      {/* Header */}
      <div className="bg-[var(--sapPageHeader_Background)] border-b border-[var(--sapPageHeader_BorderColor)] -mx-4 -mt-4 px-4 py-3 mb-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-[var(--sapPageHeader_TextColor)] text-xl font-normal m-0">{UX_COPY.pages.cashflow.title}</h1>
            <p className="text-[var(--sapContent_LabelColor)] text-sm mt-1">
              Posição em: <span className="font-['72:Bold',sans-serif]">{appliedAsOf}</span>
            </p>
          </div>
          <FioriButton variant="ghost" icon={<RefreshCw className="w-4 h-4" />} onClick={cashflow.refetch}>
            Atualizar
          </FioriButton>
        </div>
      </div>

      {/* Loading/Error States */}
      {cashflow.isLoading && <LoadingState message="Carregando fluxo de caixa..." />}
      {cashflow.isError && <ErrorState error={cashflow.error || null} onRetry={cashflow.refetch} />}

      {/* Two Column Layout */}
      {!cashflow.isLoading && !cashflow.isError && (
        <div className="h-[calc(100vh-200px)] -mx-4">
          <TwoColumnAnalyticalLayout
            leftTitle="Operações"
            leftColumn={
              <div className="p-3">
                {/* Filters */}
                <div className="mb-4 space-y-3">
                  <div>
                    <label className="text-xs text-[var(--sapContent_LabelColor)] block mb-1">
                      Período (de)
                    </label>
                    <input
                      className="w-full p-2 border border-[var(--sapField_BorderColor)] rounded bg-white text-sm"
                      type="date"
                      value={query.start_date || ''}
                      onChange={(e) => setQuery((prev) => ({ ...prev, start_date: e.target.value || undefined }))}
                    />
                  </div>

                  <div>
                    <label className="text-xs text-[var(--sapContent_LabelColor)] block mb-1">
                      Período (até)
                    </label>
                    <input
                      className="w-full p-2 border border-[var(--sapField_BorderColor)] rounded bg-white text-sm"
                      type="date"
                      value={query.end_date || ''}
                      onChange={(e) => setQuery((prev) => ({ ...prev, end_date: e.target.value || undefined }))}
                    />
                  </div>

                  <div>
                    <label className="text-xs text-[var(--sapContent_LabelColor)] block mb-1">
                      Filtrar Operação
                    </label>
                    <select
                      className="w-full p-2 border border-[var(--sapField_BorderColor)] rounded bg-white text-sm"
                      value={query.deal_id ?? ''}
                      onChange={(e) => {
                        const v = e.target.value;
                        setQuery((prev) => ({ ...prev, deal_id: v ? Number(v) : undefined }));
                        setSelectedDealId(v || null);
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
                  </div>
                </div>

                {dealsError && <div className="text-xs text-[var(--sapNegativeColor)] mb-3">{dealsError}</div>}

                {/* Deal Hierarchy */}
                <div className="border border-[var(--sapList_BorderColor)] rounded overflow-hidden">
                  <div className="bg-[var(--sapList_HeaderBackground)] px-3 py-2 border-b border-[var(--sapList_BorderColor)]">
                    <h3 className="text-xs font-['72:Bold',sans-serif] text-[var(--sapList_HeaderTextColor)] m-0">
                      Hierarquia
                    </h3>
                  </div>
                  <div className="bg-white">
                    {isLoadingDeals ? (
                      <div className="p-3 text-xs text-center text-[var(--sapContent_LabelColor)]">
                        Carregando...
                      </div>
                    ) : deals.length === 0 ? (
                      <div className="p-3 text-xs text-center text-[var(--sapContent_LabelColor)]">
                        Nenhuma operação encontrada
                      </div>
                    ) : (
                      <div className="divide-y divide-[var(--sapList_BorderColor)]">
                        {deals.map((deal) => {
                          const dealId = String(deal.id);
                          const isCollapsed = collapsedDeals[dealId];
                          const isSelected = selectedDealId === dealId;
                          const dealLines = normalizedLines.filter(l => l.parent_id === dealId);
                          const soCount = new Set(dealLines.filter(l => l.entity_type === 'so').map(l => l.entity_id)).size;
                          const poCount = new Set(dealLines.filter(l => l.entity_type === 'po').map(l => l.entity_id)).size;
                          const contractCount = new Set(dealLines.filter(l => l.entity_type === 'contract').map(l => l.entity_id)).size;

                          return (
                            <div key={deal.id}>
                              <div
                                className={`px-3 py-2 cursor-pointer hover:bg-[var(--sapList_HoverBackground)] flex items-center gap-2 ${
                                  isSelected ? 'bg-[var(--sapList_SelectionBackground)]' : ''
                                }`}
                                onClick={() => {
                                  setCollapsedDeals((prev) => ({ ...prev, [dealId]: !prev[dealId] }));
                                  setSelectedDealId(isSelected ? null : dealId);
                                }}
                              >
                                {isCollapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                                <span className="text-sm font-['72:Bold',sans-serif] flex-1">
                                  {(deal.reference_name || '').trim() || `Deal #${deal.id}`}
                                </span>
                              </div>
                              {!isCollapsed && (
                                <div className="bg-[var(--sapGroup_ContentBackground)] pl-6 text-xs">
                                  {soCount > 0 && (
                                    <div className="px-3 py-1.5 text-[var(--sapContent_LabelColor)]">
                                      📥 Vendas (SO): {soCount}
                                    </div>
                                  )}
                                  {poCount > 0 && (
                                    <div className="px-3 py-1.5 text-[var(--sapContent_LabelColor)]">
                                      📤 Compras (PO): {poCount}
                                    </div>
                                  )}
                                  {contractCount > 0 && (
                                    <div className="px-3 py-1.5 text-[var(--sapContent_LabelColor)]">
                                      📋 Contratos: {contractCount}
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            }
            rightTitle="Análise de Fluxo de Caixa"
            rightActions={
              <div className="flex items-center gap-2">
                <FioriButton
                  variant="ghost"
                  icon={viewMode === 'raw' ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  onClick={() => setViewMode(prev => prev === 'raw' ? 'consolidated' : 'raw')}
                >
                  {viewMode === 'raw' ? 'Consolidar' : 'Ver Linhas'}
                </FioriButton>
              </div>
            }
            rightColumn={
              <div>
                {/* CFO Summary - Answering: Quanto entra, quanto sai, quando, porquê, de onde */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="bg-white rounded-lg border border-[var(--sapList_BorderColor)] p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="w-5 h-5 text-[var(--sapPositiveColor)]" />
                      <span className="text-xs text-[var(--sapContent_LabelColor)]">Total a Receber</span>
                    </div>
                    <div className="text-2xl font-['72:Bold',sans-serif] text-[var(--sapPositiveTextColor)]">
                      {formatUsdSigned(summaryMetrics.totalInflow)}
                    </div>
                  </div>

                  <div className="bg-white rounded-lg border border-[var(--sapList_BorderColor)] p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingDown className="w-5 h-5 text-[var(--sapNegativeColor)]" />
                      <span className="text-xs text-[var(--sapContent_LabelColor)]">Total a Pagar</span>
                    </div>
                    <div className="text-2xl font-['72:Bold',sans-serif] text-[var(--sapNegativeTextColor)]">
                      {formatUsdSigned(-summaryMetrics.totalOutflow)}
                    </div>
                  </div>

                  <div className="bg-white rounded-lg border border-[var(--sapList_BorderColor)] p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs text-[var(--sapContent_LabelColor)]">Posição Líquida</span>
                    </div>
                    <div className={`text-2xl font-['72:Bold',sans-serif] ${
                      summaryMetrics.netPosition >= 0 
                        ? 'text-[var(--sapPositiveTextColor)]' 
                        : 'text-[var(--sapNegativeTextColor)]'
                    }`}>
                      {formatUsdSigned(summaryMetrics.netPosition)}
                    </div>
                  </div>
                </div>

                {/* Consolidation Controls */}
                <div className="bg-white rounded-lg border border-[var(--sapList_BorderColor)] p-4 mb-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="text-xs text-[var(--sapContent_LabelColor)] block mb-1">
                        Consolidação
                      </label>
                      <select
                        className="w-full p-2 border border-[var(--sapField_BorderColor)] rounded bg-white text-sm"
                        value={consolidationPeriod}
                        onChange={(e) => setConsolidationPeriod(e.target.value as ConsolidationPeriod)}
                        disabled={viewMode === 'raw'}
                      >
                        <option value="daily">Diária</option>
                        <option value="monthly">Mensal</option>
                        <option value="quarterly">Trimestral</option>
                        <option value="annual">Anual</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs text-[var(--sapContent_LabelColor)] block mb-1">
                        Moeda
                      </label>
                      <select
                        className="w-full p-2 border border-[var(--sapField_BorderColor)] rounded bg-white text-sm"
                        value={currencyFilter}
                        onChange={(e) => setCurrencyFilter(e.target.value)}
                      >
                        <option value="USD">USD (Dólar)</option>
                        <option value="BRL">BRL (Real)</option>
                        <option value="EUR">EUR (Euro)</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs text-[var(--sapContent_LabelColor)] block mb-1">
                        Tipo
                      </label>
                      <select
                        className="w-full p-2 border border-[var(--sapField_BorderColor)] rounded bg-white text-sm"
                        value={typeFilter}
                        onChange={(e) => setTypeFilter(e.target.value as typeof typeFilter)}
                      >
                        <option value="all">Todos</option>
                        <option value="physical">Físico</option>
                        <option value="financial">Financeiro</option>
                        <option value="hedge">Hedge</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Cash Flow Matrix */}
                {normalizedLines.length === 0 ? (
                  <EmptyState 
                    title="Nenhum movimento encontrado" 
                    description="Não há fluxo de caixa no período selecionado." 
                  />
                ) : (
                  <div className="border border-[var(--sapList_BorderColor)] rounded overflow-hidden bg-white">
                    <div className="overflow-auto max-h-[500px]">
                      <table className="min-w-full w-full">
                        <thead className="sticky top-0">
                          <tr className="border-b border-[var(--sapList_BorderColor)] bg-[var(--sapList_HeaderBackground)]">
                            <th className="text-left p-3 text-xs sticky left-0 bg-[var(--sapList_HeaderBackground)] z-10 font-['72:Bold',sans-serif]">
                              Item
                            </th>
                            {consolidatedColumns.map((col) => (
                              <th key={col} className="text-right p-3 text-xs whitespace-nowrap font-['72:Bold',sans-serif]">
                                {viewMode === 'raw' ? formatIsoDate(col) : col}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {consolidatedRows.map((r) => {
                            const isDeal = r.kind === 'deal';
                            const isGroup = r.kind === 'group';
                            const collapsed = !!collapsedDeals[r.dealId];

                            return (
                              <tr
                                key={r.key}
                                className={`border-b border-[var(--sapList_BorderColor)] ${
                                  isDeal ? 'bg-[var(--sapGroup_ContentBackground)] cursor-pointer hover:bg-[var(--sapList_HoverBackground)]' : 'bg-white hover:bg-[var(--sapList_HoverBackground)]'
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
                                {consolidatedColumns.map((col) => {
                                  const value = r.valuesByDate[col];
                                  const isNegative = typeof value === 'number' && value < 0;
                                  
                                  return (
                                    <td key={`${r.key}:${col}`} className="p-3 text-xs text-right whitespace-nowrap">
                                      <span className={isNegative ? 'text-[var(--sapNegativeTextColor)]' : ''}>
                                        {formatUsdSigned(value)}
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
                )}
              </div>
            }
          />
        </div>
      )}
    </div>
  );
}

