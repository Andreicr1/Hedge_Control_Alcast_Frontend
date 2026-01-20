/**
 * PnlPageIntegrated
 *
 * Minimal Financeiro/Auditoria view over portfolio P&L read models.
 * Source of truth: backend /pnl endpoints.
 */

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FioriKPIPrimary } from '../components/fiori/FioriKPIPrimary';
import { FioriKPISecondary } from '../components/fiori/FioriKPISecondary';
import { SAPGridTable } from '../components/fiori/SAPGridTable';
import { FioriButton } from '../components/fiori/FioriButton';
import { FioriFlexibleColumnLayout } from '../components/fiori/FioriFlexibleColumnLayout';
import { ErrorState, LoadingState, EmptyState } from '../components/ui';
import { DollarSign, RefreshCw, Search, ExternalLink, Receipt } from 'lucide-react';
import { getPnlAggregated, formatUsd } from '../../services/pnl.service';
import { listDeals } from '../../services/deals.service';
import type { Deal, PnlAggregateResponse, PnlDealAggregateRow } from '../../types';
import { useAuthContext } from '../components/AuthProvider';
import { normalizeRoleName } from '../../utils/role';
import { UX_COPY } from '../ux/copy';
import { Checkbox } from '../components/ui/checkbox';

function Badge({ children }: { children: string }) {
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs border bg-[var(--sapNeutralBackground,#f5f6f7)] border-[var(--sapUiBorderColor,#d9d9d9)] text-[var(--sapTextColor,#131e29)]">
      {children}
    </span>
  );
}

function todayIso(): string {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

function valueColorForPnl(v: number): 'positive' | 'critical' | 'neutral' {
  if (v > 0) return 'positive';
  if (v < 0) return 'critical';
  return 'neutral';
}

const UNNAMED_DEAL_LABEL = 'Sem referência';

export function PnlPageIntegrated() {
  const navigate = useNavigate();

  const { user } = useAuthContext();
  const role = normalizeRoleName(user?.role);

  const [asOfDate, setAsOfDate] = useState<string>(todayIso());

  const [deals, setDeals] = useState<Deal[]>([]);
  const [isLoadingDeals, setIsLoadingDeals] = useState<boolean>(true);
  const [dealsError, setDealsError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedDealIds, setSelectedDealIds] = useState<Set<number>>(() => new Set());
  const [activeDealId, setActiveDealId] = useState<number | null>(null);

  const [data, setData] = useState<PnlAggregateResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (selectedDealIds.size === 0) {
      setIsLoading(false);
      setError(null);
      setData(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await getPnlAggregated({ as_of_date: asOfDate });
      setData(res);
    } catch (e) {
      console.error('Failed to fetch P&L aggregate:', e);
      setError('Erro ao carregar P&L');
      setData(null);
    } finally {
      setIsLoading(false);
    }
  }, [asOfDate]);

  const fetchDeals = useCallback(async () => {
    setIsLoadingDeals(true);
    setDealsError(null);
    try {
      const res = await listDeals();
      setDeals(res);
      if (res.length > 0 && activeDealId === null) {
        setActiveDealId(res[0]!.id);
      }
      // Default: nothing selected; user chooses what to calculate.
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

  const rows = data?.rows ?? [];

  const dealById = useMemo(() => {
    const map = new Map<number, Deal>();
    for (const d of deals) map.set(d.id, d);
    return map;
  }, [deals]);

  const filteredDeals = useMemo(() => {
    const s = searchTerm.trim().toLowerCase();
    if (!s) return deals;
    return deals.filter((d) => {
      return (
        String(d.id).includes(s) ||
        (d.deal_uuid || '').toLowerCase().includes(s) ||
        (d.reference_name || '').toLowerCase().includes(s) ||
        (d.commodity || '').toLowerCase().includes(s)
      );
    });
  }, [deals, searchTerm]);

  const selectedRows = useMemo(() => {
    if (selectedDealIds.size === 0) return [] as PnlDealAggregateRow[];
    return rows.filter((r) => typeof r.deal_id === 'number' && selectedDealIds.has(r.deal_id as number));
  }, [rows, selectedDealIds]);

  const consolidatedTotals = useMemo(() => {
    const unrealized = selectedRows.reduce((sum, r) => sum + Number(r.unrealized_pnl_usd ?? 0), 0);
    const realized = selectedRows.reduce((sum, r) => sum + Number(r.realized_pnl_usd ?? 0), 0);
    const total = selectedRows.reduce((sum, r) => sum + Number(r.total_pnl_usd ?? 0), 0);
    return { unrealized, realized, total };
  }, [selectedRows]);

  const tableRows = useMemo<Record<string, unknown>[]>(
    () => selectedRows.map((r) => ({ ...r } as unknown as Record<string, unknown>)),
    [selectedRows]
  );

  const columns = useMemo(() => {
    return [
      {
        header: 'Deal',
        accessor: 'deal_id',
        render: (_value: unknown, row: Record<string, unknown>) => {
          const did = row.deal_id as number;
          const deal = typeof did === 'number' ? dealById.get(did) : null;
          const label = (deal?.reference_name || '').trim() || UNNAMED_DEAL_LABEL;
          return (
            <button
              onClick={() => {
                if (typeof did !== 'number') return;
                navigate(`/financeiro/deals/${did}`);
              }}
              className="text-[var(--sapLink_TextColor)] hover:underline font-normal flex items-center gap-1"
              type="button"
            >
              <span>{label || UNNAMED_DEAL_LABEL}</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          );
        },
      },
      {
        header: 'Unrealized (USD)',
        accessor: 'unrealized_pnl_usd',
        align: 'right' as const,
        render: (value: unknown) => {
          const v = Number(value ?? 0);
          return (
            <span className={v >= 0 ? 'text-[var(--sapPositiveTextColor)]' : 'text-[var(--sapNegativeTextColor)]'}>
              {formatUsd(v)}
            </span>
          );
        },
      },
      {
        header: 'Realized (USD)',
        accessor: 'realized_pnl_usd',
        align: 'right' as const,
        render: (value: unknown) => {
          const v = Number(value ?? 0);
          return (
            <span className={v >= 0 ? 'text-[var(--sapPositiveTextColor)]' : 'text-[var(--sapNegativeTextColor)]'}>
              {formatUsd(v)}
            </span>
          );
        },
      },
      {
        header: 'Total (USD)',
        accessor: 'total_pnl_usd',
        align: 'right' as const,
        render: (value: unknown) => {
          const v = Number(value ?? 0);
          return (
            <span className={`font-bold ${v >= 0 ? 'text-[var(--sapPositiveTextColor)]' : 'text-[var(--sapNegativeTextColor)]'}`}>
              {formatUsd(v)}
            </span>
          );
        },
      },
    ];
  }, [dealById, navigate]);

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
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
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
            const label = (deal.reference_name || '').trim() || UNNAMED_DEAL_LABEL;
            const isActive = activeDealId === deal.id;
            const isSelected = selectedDealIds.has(deal.id);
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

  const detailContent = (
    <div className="p-6">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="font-['72:Black',sans-serif] text-2xl text-[#131e29] mb-1 flex items-center gap-2">
            <Receipt className="w-6 h-6" />
            {UX_COPY.pages.pnl.title}
            <span className="text-base font-normal text-[var(--sapContent_LabelColor)]">
              — {selectedDealIds.size === 0 ? 'Nenhuma seleção' : `Consolidado (${selectedDealIds.size})`}
            </span>
          </h1>
          <div className="flex items-center gap-2">
            <p className="text-sm text-[var(--sapContent_LabelColor)] m-0">{UX_COPY.pages.pnl.subtitle}</p>
            {role === 'auditoria' && <Badge>Somente leitura</Badge>}
          </div>
        </div>
        <FioriButton variant="ghost" icon={<RefreshCw className="w-4 h-4" />} onClick={fetchData}>
          Atualizar
        </FioriButton>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <FioriKPIPrimary
          title="Total"
          value={formatUsd(consolidatedTotals.total)}
          valueColor={valueColorForPnl(consolidatedTotals.total)}
          icon={<DollarSign className="w-5 h-5" />}
          subtitle={data ? `Data-base: ${data.as_of_date}` : undefined}
        />
        <FioriKPISecondary
          title="A mercado"
          value={formatUsd(consolidatedTotals.unrealized)}
          valueColor={valueColorForPnl(consolidatedTotals.unrealized)}
        />
        <FioriKPISecondary
          title="Realizado"
          value={formatUsd(consolidatedTotals.realized)}
          valueColor={valueColorForPnl(consolidatedTotals.realized)}
        />
      </div>

      <div className="bg-white border border-[var(--sapList_BorderColor)] rounded-lg p-4 mb-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
          <div>
            <label htmlFor="pnl-asof-date" className="block text-xs text-[var(--sapContent_LabelColor)] mb-1">Data-base</label>
            <input
              id="pnl-asof-date"
              type="date"
              value={asOfDate}
              onChange={(e) => setAsOfDate(e.target.value)}
              className="w-full px-3 py-2 border border-[var(--sapField_BorderColor)] rounded-md text-sm"
            />
          </div>
          <div className="flex flex-col justify-end">
            <div className="text-xs text-[var(--sapContent_LabelColor)] mb-1">Seleção</div>
            <div className="px-3 py-2 border border-[var(--sapField_BorderColor)] rounded-md text-sm text-[var(--sapContent_LabelColor)]">
              {selectedDealIds.size === 0 ? 'Nenhuma operação selecionada.' : `${selectedDealIds.size} operação(ões) selecionada(s).`}
            </div>
          </div>
          <div className="flex gap-2">
            <FioriButton variant="emphasized" icon={<Search className="w-4 h-4" />} onClick={fetchData}>
              Buscar
            </FioriButton>
          </div>
        </div>
      </div>

      {error ? (
        <ErrorState error={{ detail: error }} onRetry={fetchData} />
      ) : isLoading && !data ? (
        <LoadingState message="Carregando resultado..." />
      ) : isLoading ? (
        <LoadingState message="Atualizando..." />
      ) : selectedDealIds.size === 0 ? (
        <EmptyState title="Sem seleção" description="Selecione operações na coluna da esquerda para consolidar o resultado." />
      ) : tableRows.length === 0 ? (
        <EmptyState title="Nenhum resultado disponível no momento." description="Tente ajustar a data-base ou os filtros." />
      ) : (
        <SAPGridTable title={`Resultado por operação (${tableRows.length})`} columns={columns} data={tableRows} idField="deal_id" />
      )}
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
