/**
 * PnlPageIntegrated
 *
 * Minimal Financeiro/Auditoria view over portfolio P&L read models.
 * Source of truth: backend /pnl endpoints.
 */

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FioriKPIPrimary } from '../components/fiori/FioriKPIPrimary';
import { FioriKPISecondary } from '../components/fiori/FioriKPISecondary';
import { SAPGridTable } from '../components/fiori/SAPGridTable';
import { FioriButton } from '../components/fiori/FioriButton';
import { ErrorState, LoadingState, EmptyState } from '../components/ui';
import { DollarSign, RefreshCw, Search, ExternalLink, Receipt } from 'lucide-react';
import { getPnlAggregated, formatUsd } from '../../services/pnl.service';
import { getDeal } from '../../services/deals.service';
import type { PnlAggregateResponse, PnlDealAggregateRow } from '../../types';
import { useAuthContext } from '../components/AuthProvider';
import { normalizeRoleName } from '../../utils/role';
import { UX_COPY } from '../ux/copy';

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

  const [searchParams] = useSearchParams();

  const dealIdParam = searchParams.get('deal_id') || '';

  const [asOfDate, setAsOfDate] = useState<string>(todayIso());
  const [dealId, setDealId] = useState<string>(() => dealIdParam);
  const [dealLabelById, setDealLabelById] = useState<Record<number, string>>({});

  const [data, setData] = useState<PnlAggregateResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const did = dealId.trim() ? Number(dealId.trim()) : undefined;
      if (dealId.trim() && Number.isNaN(did)) {
        setError('Deal ID inválido');
        setData(null);
        return;
      }

      const res = await getPnlAggregated({
        as_of_date: asOfDate,
        deal_id: did,
      });
      setData(res);
    } catch (e) {
      console.error('Failed to fetch P&L aggregate:', e);
      setError('Erro ao carregar P&L');
      setData(null);
    } finally {
      setIsLoading(false);
    }
  }, [asOfDate, dealId]);

  useEffect(() => {
    setDealId(dealIdParam);
  }, [dealIdParam]);

  useEffect(() => {
    const did = dealId.trim() ? Number(dealId.trim()) : undefined;
    if (!did || Number.isNaN(did)) return;
    if (dealLabelById[did]) return;

    let cancelled = false;
    (async () => {
      try {
        const deal = await getDeal(did);
        if (cancelled) return;
        const label = (deal.reference_name || '').trim();
        setDealLabelById((prev) => ({
          ...prev,
          [did]: label || UNNAMED_DEAL_LABEL,
        }));
      } catch {
        if (cancelled) return;
        setDealLabelById((prev) => ({ ...prev, [did]: UNNAMED_DEAL_LABEL }));
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [dealId, dealLabelById]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const rows = data?.rows ?? [];

  useEffect(() => {
    const uniqueDealIds = Array.from(
      new Set(rows.map((r: PnlDealAggregateRow) => r.deal_id).filter((v) => typeof v === 'number'))
    );
    const missing = uniqueDealIds.filter((id) => !dealLabelById[id]);
    if (missing.length === 0) return;

    let cancelled = false;
    (async () => {
      try {
        const results = await Promise.all(
          missing.slice(0, 50).map(async (id) => {
            try {
              const deal = await getDeal(id);
              const label = (deal.reference_name || '').trim();
              return [id, label || UNNAMED_DEAL_LABEL] as const;
            } catch {
              return [id, UNNAMED_DEAL_LABEL] as const;
            }
          })
        );
        if (cancelled) return;
        setDealLabelById((prev) => {
          const next = { ...prev };
          for (const [id, label] of results) next[id] = label;
          return next;
        });
      } catch {
        // ignore
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [rows, dealLabelById]);

  const tableRows = useMemo<Record<string, unknown>[]>(
    () => rows.map((r) => ({ ...r } as unknown as Record<string, unknown>)),
    [rows]
  );

  const columns = useMemo(() => {
    return [
      {
        header: 'Deal',
        accessor: 'deal_id',
        render: (_value: unknown, row: Record<string, unknown>) => {
          const did = row.deal_id as number;
          const label = typeof did === 'number' ? dealLabelById[did] : undefined;
          return (
            <button
              onClick={() => navigate(`/financeiro/pnl?deal_id=${encodeURIComponent(String(did))}`)}
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
  }, [dealLabelById, navigate]);

  if (isLoading && !data) {
    return <LoadingState message="Carregando resultado..." />;
  }

  if (error) {
    return <ErrorState error={{ detail: error }} onRetry={fetchData} />;
  }

  return (
    <div className="p-6">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="font-['72:Black',sans-serif] text-2xl text-[#131e29] mb-1 flex items-center gap-2">
            <Receipt className="w-6 h-6" />
            {UX_COPY.pages.pnl.title}
            {dealId.trim() && !Number.isNaN(Number(dealId.trim())) ? (
              <span className="text-base font-normal text-[var(--sapContent_LabelColor)]">
                — {dealLabelById[Number(dealId.trim())] || UNNAMED_DEAL_LABEL}
              </span>
            ) : null}
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
          value={formatUsd(data?.total_pnl_usd ?? 0)}
          valueColor={valueColorForPnl(data?.total_pnl_usd ?? 0)}
          icon={<DollarSign className="w-5 h-5" />}
          subtitle={data ? `Data-base: ${data.as_of_date}` : undefined}
        />
        <FioriKPISecondary
          title="A mercado"
          value={formatUsd(data?.unrealized_total_usd ?? 0)}
          valueColor={valueColorForPnl(data?.unrealized_total_usd ?? 0)}
        />
        <FioriKPISecondary
          title="Realizado"
          value={formatUsd(data?.realized_total_usd ?? 0)}
          valueColor={valueColorForPnl(data?.realized_total_usd ?? 0)}
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
            <div className="text-xs text-[var(--sapContent_LabelColor)] mb-1">Operação</div>
            {dealId.trim() && !Number.isNaN(Number(dealId.trim())) ? (
              <div className="flex items-center justify-between gap-2 px-3 py-2 border border-[var(--sapField_BorderColor)] rounded-md text-sm">
                <div className="truncate">{dealLabelById[Number(dealId.trim())] || UNNAMED_DEAL_LABEL}</div>
                <FioriButton
                  variant="ghost"
                  onClick={() => {
                    setDealId('');
                    navigate('/financeiro/pnl');
                  }}
                >
                  Limpar
                </FioriButton>
              </div>
            ) : (
              <div className="px-3 py-2 border border-[var(--sapField_BorderColor)] rounded-md text-sm text-[var(--sapContent_LabelColor)]">
                Use a busca global para abrir o PnL de uma operação.
              </div>
            )}
          </div>
          <div className="flex gap-2">
            <FioriButton variant="emphasized" icon={<Search className="w-4 h-4" />} onClick={fetchData}>
              Buscar
            </FioriButton>
          </div>
        </div>
      </div>

      {isLoading ? (
        <LoadingState message="Atualizando..." />
      ) : rows.length === 0 ? (
        <EmptyState
          title="Nenhum resultado disponível no momento."
          description="Tente ajustar a data-base ou os filtros."
        />
      ) : (
        <SAPGridTable
          title={`Resultado por operação (${rows.length})`}
          columns={columns}
          data={tableRows}
          idField="deal_id"
        />
      )}
    </div>
  );
}
