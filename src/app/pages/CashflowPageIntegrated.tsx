/**
 * Cashflow Page - Integrated (Treasury view)
 *
 * Official cashflow surface = GET /cashflow:
 * - One row per Contract settlement_date
 * - projected_* (MTM snapshot as-of) vs final_* (authoritative on/after settlement)
 * - data_quality_flags are opaque and must be surfaced
 */

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { ApiError, CashflowItem, CashflowQueryParams, CashflowResponse, Deal } from '../../types';
import { LoadingState, ErrorState, EmptyState } from '../components/ui';
import { FioriButton } from '../components/fiori/FioriButton';
import { RefreshCw } from 'lucide-react';
import { UX_COPY } from '../ux/copy';
import { listDeals } from '../../services/deals.service';
import { getCashflow } from '../../services/cashflow.service';

function Badge({ children }: { children: string }) {
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs border bg-[var(--sapNeutralBackground,#f5f6f7)] border-[var(--sapUiBorderColor,#d9d9d9)] text-[var(--sapTextColor,#131e29)]">
      {children}
    </span>
  );
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

function formatMoneyUsd(value?: number | null): string {
  if (typeof value !== 'number' || Number.isNaN(value)) return '—';
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
}

function formatIsoDate(dateIso?: string | null): string {
  if (!dateIso) return '—';
  try {
    const d = new Date(`${dateIso}T00:00:00Z`);
    return d.toLocaleDateString('pt-BR');
  } catch {
    return String(dateIso);
  }
}

function FlagsCell({ flags }: { flags: string[] }) {
  if (!flags || flags.length === 0) return <span className="text-xs text-[var(--sapContent_LabelColor)]">—</span>;
  return (
    <div className="flex flex-wrap gap-1">
      {flags.map((f) => (
        <Badge key={f}>{f}</Badge>
      ))}
    </div>
  );
}

export function CashflowPageIntegrated() {
  const navigate = useNavigate();

  const [deals, setDeals] = useState<Deal[]>([]);
  const [isLoadingDeals, setIsLoadingDeals] = useState(false);
  const [dealsError, setDealsError] = useState<string | null>(null);

  const today = useMemo(() => isoToday(), []);

  const [query, setQuery] = useState<CashflowQueryParams>(() => ({
    as_of: today,
    start_date: today,
    end_date: addDaysIso(today, 90),
    limit: 200,
  }));

  const [data, setData] = useState<CashflowResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  const fetchDeals = useCallback(async () => {
    setIsLoadingDeals(true);
    setDealsError(null);
    try {
      setDeals(await listDeals());
    } catch {
      setDeals([]);
      setDealsError('Erro ao carregar operaAAæes');
    } finally {
      setIsLoadingDeals(false);
    }
  }, []);

  const fetchCashflow = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      setData(await getCashflow(query));
    } catch (e) {
      console.error('Failed to fetch cashflow:', e);
      setData(null);
      setError(e as ApiError);
    } finally {
      setIsLoading(false);
    }
  }, [query]);

  useEffect(() => {
    fetchDeals();
  }, [fetchDeals]);

  useEffect(() => {
    fetchCashflow();
  }, [fetchCashflow]);

  const items: CashflowItem[] = data?.items ?? [];

  const dealLabelById = useMemo(() => {
    const map = new Map<number, string>();
    for (const d of deals) {
      const label = (d.reference_name || '').trim() || `Deal #${d.id}`;
      map.set(d.id, label);
    }
    return map;
  }, [deals]);

  const totals = useMemo(() => {
    const projected = items.reduce((sum, it) => sum + Number(it.projected_value_usd ?? 0), 0);
    const final = items.reduce((sum, it) => sum + Number(it.final_value_usd ?? 0), 0);
    return { projected, final };
  }, [items]);

  const appliedAsOf = data?.as_of || query.as_of || '—';

  return (
    <div className="sap-fiori-page">
      <div className="bg-[var(--sapPageHeader_Background)] border-b border-[var(--sapPageHeader_BorderColor)] -mx-4 -mt-4 px-4 py-4 mb-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-[var(--sapPageHeader_TextColor)] text-xl font-normal m-0">{UX_COPY.pages.cashflow.title}</h1>
            <p className="text-[var(--sapContent_LabelColor)] text-sm mt-1 m-0">
              Data-base (as-of): <span className="font-['72:Bold',sans-serif]">{appliedAsOf}</span>
            </p>
          </div>
          <FioriButton variant="ghost" icon={<RefreshCw className="w-4 h-4" />} onClick={fetchCashflow}>
            Atualizar
          </FioriButton>
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-3">
          <label className="text-xs text-[var(--sapContent_LabelColor)]">
            PerA­odo (de)
            <input
              className="mt-1 w-full p-2 border border-[var(--sapField_BorderColor)] rounded bg-white text-sm"
              type="date"
              value={query.start_date || ''}
              onChange={(e) => setQuery((prev) => ({ ...prev, start_date: e.target.value || undefined }))}
            />
          </label>

          <label className="text-xs text-[var(--sapContent_LabelColor)]">
            PerA­odo (atAc)
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
            OperaAAæo (Deal)
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

          <label className="text-xs text-[var(--sapContent_LabelColor)] md:col-span-2">
            Contrato (ID)
            <input
              className="mt-1 w-full p-2 border border-[var(--sapField_BorderColor)] rounded bg-white text-sm"
              value={query.contract_id || ''}
              onChange={(e) => setQuery((prev) => ({ ...prev, contract_id: e.target.value || undefined }))}
              placeholder="Ex.: C-2026-0001"
            />
          </label>

          <label className="text-xs text-[var(--sapContent_LabelColor)]">
            Contraparte (ID)
            <input
              className="mt-1 w-full p-2 border border-[var(--sapField_BorderColor)] rounded bg-white text-sm"
              inputMode="numeric"
              value={query.counterparty_id ?? ''}
              onChange={(e) => {
                const raw = e.target.value.trim();
                setQuery((prev) => ({ ...prev, counterparty_id: raw ? Number(raw) : undefined }));
              }}
              placeholder="Ex.: 12"
            />
          </label>

          <label className="text-xs text-[var(--sapContent_LabelColor)]">
            Limite
            <input
              className="mt-1 w-full p-2 border border-[var(--sapField_BorderColor)] rounded bg-white text-sm"
              inputMode="numeric"
              value={query.limit ?? ''}
              onChange={(e) => {
                const raw = e.target.value.trim();
                setQuery((prev) => ({ ...prev, limit: raw ? Number(raw) : undefined }));
              }}
              placeholder="200"
            />
          </label>
        </div>

        {dealsError && <div className="text-xs text-[var(--sapNegativeColor)] mt-2">{dealsError}</div>}
      </div>

      <div className="sap-fiori-section mb-4">
        <div className="sap-fiori-section-content grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="p-3 border border-[var(--sapGroup_ContentBorderColor)] rounded bg-[var(--sapTile_Background)]">
            <div className="text-xs text-[var(--sapContent_LabelColor)]">Total projetado (USD)</div>
            <div className="text-lg">{formatMoneyUsd(totals.projected)}</div>
          </div>
          <div className="p-3 border border-[var(--sapGroup_ContentBorderColor)] rounded bg-[var(--sapTile_Background)]">
            <div className="text-xs text-[var(--sapContent_LabelColor)]">Total final (USD)</div>
            <div className="text-lg">{formatMoneyUsd(totals.final)}</div>
          </div>
        </div>
      </div>

      {isLoading && <LoadingState message="Carregando fluxo de caixa..." />}
      {error && <ErrorState error={error} onRetry={fetchCashflow} />}

      {!isLoading && !error && (
        <div className="sap-fiori-section">
          <div className="sap-fiori-section-content">
            {items.length === 0 ? (
              <EmptyState title="Sem itens no perA­odo selecionado" description="" />
            ) : (
              <div className="border border-[var(--sapList_BorderColor)] rounded overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-[var(--sapList_HeaderBackground)] border-b border-[var(--sapList_BorderColor)]">
                    <tr>
                      <th className="py-2 px-2 text-left whitespace-nowrap">LiquidaAAœo</th>
                      <th className="py-2 px-2 text-left whitespace-nowrap">Contraparte</th>
                      <th className="py-2 px-2 text-left whitespace-nowrap">Contrato</th>
                      <th className="py-2 px-2 text-left whitespace-nowrap">OperaAAœo</th>
                      <th className="py-2 px-2 text-right whitespace-nowrap">Projetado</th>
                      <th className="py-2 px-2 text-right whitespace-nowrap">Final</th>
                      <th className="py-2 px-2 text-left whitespace-nowrap">Flags</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((it) => {
                      const dealLabel = dealLabelById.get(it.deal_id) || `Deal #${it.deal_id}`;
                      return (
                        <tr key={`${it.contract_id}:${it.settlement_date || '—'}`} className="border-b border-[var(--sapList_BorderColor)]">
                          <td className="py-2 px-2 whitespace-nowrap">{formatIsoDate(it.settlement_date)}</td>
                          <td className="py-2 px-2 whitespace-nowrap">{it.counterparty_id ?? '—'}</td>
                          <td className="py-2 px-2 whitespace-nowrap">
                            <button
                              type="button"
                              className="text-[var(--sapLink_TextColor)] hover:underline"
                              onClick={() => navigate(`/financeiro/contratos?id=${encodeURIComponent(String(it.contract_id))}`)}
                            >
                              {it.contract_id}
                            </button>
                          </td>
                          <td className="py-2 px-2 whitespace-nowrap">
                            <button
                              type="button"
                              className="text-[var(--sapLink_TextColor)] hover:underline"
                              onClick={() => navigate(`/financeiro/deals/${encodeURIComponent(String(it.deal_id))}`)}
                              title={dealLabel}
                            >
                              {dealLabel}
                            </button>
                          </td>
                          <td className="py-2 px-2 text-right whitespace-nowrap">{formatMoneyUsd(it.projected_value_usd)}</td>
                          <td className="py-2 px-2 text-right whitespace-nowrap">{formatMoneyUsd(it.final_value_usd)}</td>
                          <td className="py-2 px-2">
                            <FlagsCell flags={it.data_quality_flags || []} />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
