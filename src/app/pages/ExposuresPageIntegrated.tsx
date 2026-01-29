/** Exposições de Risco (visão institucional) */

import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { RefreshCw, Layers } from 'lucide-react';

import { useExposures } from '../../hooks';
import { Exposure, ExposureStatus, MarketObjectType } from '../../types';

import { AnalyticScopeTree } from '../analytics/AnalyticScopeTree';
import { useAnalyticScope } from '../analytics/ScopeProvider';
import { useAnalyticScopeUrlSync } from '../analytics/useAnalyticScopeUrlSync';
import { useAnalyticsEntityTreeContext } from '../analytics/EntityTreeProvider';

import { EmptyState, ErrorState, LoadingState } from '../components/ui';
import { FioriButton } from '../components/fiori/FioriButton';
import { FioriFlexibleColumnLayout } from '../components/fiori/FioriFlexibleColumnLayout';
import { FioriObjectStatus } from '../components/fiori/FioriObjectStatus';
import { UX_COPY } from '../ux/copy';

function formatSourceTypeLabel(sourceType?: string | null): string {
  const s = String(sourceType || '').toLowerCase();
  if (s === 'so') return 'Pedido de Venda';
  if (s === 'po') return 'Pedido de Compra';
  if (!s) return '—';
  return String(sourceType);
}

function getStatusType(status?: ExposureStatus): 'success' | 'error' | 'warning' | 'information' | 'neutral' {
  switch (status) {
    case ExposureStatus.OPEN:
      return 'warning';
    case ExposureStatus.PARTIALLY_HEDGED:
      return 'information';
    case ExposureStatus.HEDGED:
      return 'success';
    case ExposureStatus.CLOSED:
      return 'neutral';
    default:
      return 'neutral';
  }
}

function getStatusLabel(status?: ExposureStatus): string {
  const labels: Record<ExposureStatus, string> = {
    [ExposureStatus.OPEN]: 'Aberta',
    [ExposureStatus.PARTIALLY_HEDGED]: 'Parcialmente Hedgeada',
    [ExposureStatus.HEDGED]: 'Totalmente Hedgeada',
    [ExposureStatus.CLOSED]: 'Fechada',
  };
  return status ? labels[status] || status : 'Desconhecido';
}

function formatMt(value: number | null | undefined): string {
  if (typeof value !== 'number' || Number.isNaN(value)) return '—';
  return value.toLocaleString('pt-BR');
}

export function ExposuresPageIntegrated() {
  const navigate = useNavigate();

  useAnalyticScopeUrlSync({ acceptLegacyDealId: true });
  const { scope } = useAnalyticScope();
  const entityTree = useAnalyticsEntityTreeContext();

  const { exposures, isLoading, isError, error, refetch } = useExposures();
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const soToDealId = useMemo(() => {
    const map = new Map<number, number>();
    const root = entityTree.data?.root;
    for (const deal of root?.children || []) {
      const did = Number(deal.entity_id ?? deal.deal_id ?? deal.id);
      if (!Number.isFinite(did)) continue;
      for (const child of deal.children || []) {
        if (child.kind !== 'so') continue;
        const soId = Number(child.entity_id);
        if (!Number.isFinite(soId)) continue;
        map.set(soId, did);
      }
    }
    return map;
  }, [entityTree.data]);

  const poToDealId = useMemo(() => {
    const map = new Map<number, number>();
    const root = entityTree.data?.root;
    for (const deal of root?.children || []) {
      const did = Number(deal.entity_id ?? deal.deal_id ?? deal.id);
      if (!Number.isFinite(did)) continue;
      for (const child of deal.children || []) {
        if (child.kind !== 'po') continue;
        const poId = Number(child.entity_id);
        if (!Number.isFinite(poId)) continue;
        map.set(poId, did);
      }
    }
    return map;
  }, [entityTree.data]);

  const dealIdForExposure = (exp: Exposure): number | null => {
    if (exp.source_type === MarketObjectType.SO) return soToDealId.get(exp.source_id) ?? null;
    if (exp.source_type === MarketObjectType.PO) return poToDealId.get(exp.source_id) ?? null;
    return null;
  };

  const filteredExposures = useMemo(() => {
    const all = exposures || [];

    // Institutional requirement: fully hedged items should not appear in this (risk) menu.
    const base = all.filter((exp) => exp.status !== ExposureStatus.HEDGED);

    if (scope.kind === 'none') return [];
    if (scope.kind === 'all') return base;

    if (scope.kind === 'deal') {
      return base.filter((exp) => dealIdForExposure(exp) === scope.dealId);
    }

    if (scope.kind === 'so') {
      return base.filter((exp) => exp.source_type === MarketObjectType.SO && exp.source_id === scope.soId);
    }

    if (scope.kind === 'po') {
      return base.filter((exp) => exp.source_type === MarketObjectType.PO && exp.source_id === scope.poId);
    }

    // contract
    return [];
  }, [dealIdForExposure, exposures, scope]);

  const selectedExposure = useMemo(() => {
    if (!selectedId) return null;
    return filteredExposures.find((e) => e.id === selectedId) || null;
  }, [filteredExposures, selectedId]);

  const stats = useMemo(() => {
    if (!filteredExposures.length) return null;
    const totalVolume = filteredExposures.reduce((sum, e) => sum + (e.quantity_mt ?? 0), 0);
    const totalUnhedged = filteredExposures.reduce((sum, e) => sum + (e.unhedged_quantity_mt ?? 0), 0);
    const openCount = filteredExposures.filter((e) => e.status === ExposureStatus.OPEN).length;
    const partialCount = filteredExposures.filter((e) => e.status === ExposureStatus.PARTIALLY_HEDGED).length;
    return { totalVolume, totalUnhedged, openCount, partialCount };
  }, [filteredExposures]);

  const selectionTitle = useMemo(() => {
    if (scope.kind === 'none') return 'Sem seleção';
    if (scope.kind === 'all') return 'Todos os deals';
    if (scope.kind === 'deal') return `Deal #${scope.dealId}`;
    if (scope.kind === 'so') return `SO #${scope.soId} · Deal #${scope.dealId}`;
    if (scope.kind === 'po') return `PO #${scope.poId} · Deal #${scope.dealId}`;
    return `Contrato ${scope.contractId} · Deal #${scope.dealId}`;
  }, [scope]);

  const onOpenDeal = (dealId: number) => {
    const qs = new URLSearchParams({ scope: 'deal', deal_id: String(dealId) });
    navigate(`/financeiro/cashflow?${qs.toString()}`);
  };

  return (
    <FioriFlexibleColumnLayout
      masterTitle="Escopo"
      masterContent={<AnalyticScopeTree />}
      masterWidth={340}
      detailContent={
        <div className="sap-fiori-page h-full overflow-y-auto">
          <div className="bg-[var(--sapPageHeader_Background)] border-b border-[var(--sapPageHeader_BorderColor)] -mx-4 -mt-4 px-4 py-4 mb-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-[var(--sapPageHeader_TextColor)] text-xl font-normal m-0">{UX_COPY.pages.riskExposure.title}</h1>
                <p className="text-[var(--sapContent_LabelColor)] text-sm mt-1">
                  Seleção: <span className="font-['72:Bold',sans-serif]">{selectionTitle}</span>
                  {isLoading && exposures ? <span className="ml-2 text-xs">(atualizando…)</span> : null}
                </p>
              </div>
              <FioriButton variant="ghost" icon={<RefreshCw className="w-4 h-4" />} onClick={refetch}>
                Atualizar
              </FioriButton>
            </div>
          </div>

          {scope.kind === 'none' ? (
            <div className="p-6">
              <EmptyState
                title="Sem seleção"
                description="Selecione um deal para visualizar."
                icon={<Layers className="w-8 h-8 text-[var(--sapContent_IconColor)]" />}
              />
            </div>
          ) : isLoading ? (
            <LoadingState message="Carregando exposições..." />
          ) : isError ? (
            <ErrorState error={error} onRetry={refetch} />
          ) : filteredExposures.length === 0 ? (
            <div className="p-6">
              <EmptyState
                title="Sem exposições"
                description="Sem itens para a seleção atual."
                icon={<Layers className="w-8 h-8 text-[var(--sapContent_IconColor)]" />}
              />
            </div>
          ) : (
            <div className="sap-fiori-section">
              <div className="sap-fiori-section-content">
                {stats ? (
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">
                    <div className="p-3 rounded border border-[var(--sapTile_BorderColor)] bg-white">
                      <div className="text-[11px] text-[var(--sapContent_LabelColor)]">Exposições</div>
                      <div className="text-sm font-['72:Bold',sans-serif]">{filteredExposures.length}</div>
                    </div>
                    <div className="p-3 rounded border border-[var(--sapTile_BorderColor)] bg-white">
                      <div className="text-[11px] text-[var(--sapContent_LabelColor)]">Volume (MT)</div>
                      <div className="text-sm font-['72:Bold',sans-serif]">{formatMt(stats.totalVolume)}</div>
                    </div>
                    <div className="p-3 rounded border border-[var(--sapTile_BorderColor)] bg-white">
                      <div className="text-[11px] text-[var(--sapContent_LabelColor)]">Não coberto (MT)</div>
                      <div className="text-sm font-['72:Bold',sans-serif]">{formatMt(stats.totalUnhedged)}</div>
                    </div>
                    <div className="p-3 rounded border border-[var(--sapTile_BorderColor)] bg-white">
                      <div className="text-[11px] text-[var(--sapContent_LabelColor)]">Status</div>
                      <div className="text-sm font-['72:Bold',sans-serif]">
                        {stats.openCount} aberta(s) · {stats.partialCount} parcial
                      </div>
                    </div>
                  </div>
                ) : null}

                <div className="border border-[var(--sapList_BorderColor)] rounded overflow-hidden bg-white">
                  <div className="overflow-auto">
                    <table className="min-w-[980px] w-full">
                      <thead>
                        <tr className="border-b border-[var(--sapList_BorderColor)] bg-white">
                          <th className="text-left p-3 text-xs">Item</th>
                          <th className="text-left p-3 text-xs">Origem</th>
                          <th className="text-left p-3 text-xs">Produto</th>
                          <th className="text-right p-3 text-xs">Volume (MT)</th>
                          <th className="text-right p-3 text-xs">Não coberto (MT)</th>
                          <th className="text-left p-3 text-xs">Data</th>
                          <th className="text-left p-3 text-xs">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredExposures
                          .slice()
                          .sort((a, b) => a.id - b.id)
                          .map((exp) => {
                            const did = dealIdForExposure(exp);
                            const isSelected = selectedId === exp.id;
                            const date = exp.delivery_date || exp.maturity_date || exp.payment_date || null;

                            return (
                              <tr
                                key={String(exp.id)}
                                className={`border-b border-[var(--sapList_BorderColor)] hover:bg-[var(--sapList_HoverBackground)] cursor-pointer ${
                                  isSelected ? 'bg-[var(--sapList_SelectionBackgroundColor)]' : 'bg-white'
                                }`}
                                onClick={() => setSelectedId(exp.id)}
                              >
                                <td className="p-3 text-xs whitespace-nowrap">Exposição #{exp.id}</td>
                                <td className="p-3 text-xs whitespace-nowrap">
                                  {formatSourceTypeLabel(exp.source_type)} #{exp.source_id}
                                  {did ? (
                                    <button
                                      type="button"
                                      className="ml-2 text-[11px] text-[#0064d9] hover:underline"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        onOpenDeal(did);
                                      }}
                                    >
                                      Deal #{did}
                                    </button>
                                  ) : null}
                                </td>
                                <td className="p-3 text-xs">{exp.product || '—'}</td>
                                <td className="p-3 text-xs text-right whitespace-nowrap">{formatMt(exp.quantity_mt)}</td>
                                <td className="p-3 text-xs text-right whitespace-nowrap">{formatMt(exp.unhedged_quantity_mt ?? null)}</td>
                                <td className="p-3 text-xs whitespace-nowrap">
                                  {date ? new Date(date).toLocaleDateString('pt-BR') : '—'}
                                </td>
                                <td className="p-3 text-xs whitespace-nowrap">
                                  <FioriObjectStatus status={getStatusType(exp.status)}>
                                    {getStatusLabel(exp.status)}
                                  </FioriObjectStatus>
                                </td>
                              </tr>
                            );
                          })}
                      </tbody>
                    </table>
                  </div>
                </div>

                {selectedExposure ? (
                  <div className="mt-4 border border-[var(--sapList_BorderColor)] rounded overflow-hidden bg-white">
                    <div className="p-3 border-b border-[var(--sapList_BorderColor)] bg-[var(--sapList_HeaderBackground)]">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <div className="text-sm font-['72:Bold',sans-serif]">Exposição #{selectedExposure.id}</div>
                          <div className="text-xs text-[var(--sapContent_LabelColor)]">{selectedExposure.product || '—'}</div>
                        </div>
                        <FioriObjectStatus status={getStatusType(selectedExposure.status)}>
                          {getStatusLabel(selectedExposure.status)}
                        </FioriObjectStatus>
                      </div>
                    </div>

                    <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div>
                        <div className="text-[11px] text-[var(--sapContent_LabelColor)]">Volume (MT)</div>
                        <div className="text-sm font-['72:Bold',sans-serif]">{formatMt(selectedExposure.quantity_mt)}</div>
                      </div>
                      <div>
                        <div className="text-[11px] text-[var(--sapContent_LabelColor)]">Não coberto (MT)</div>
                        <div className="text-sm font-['72:Bold',sans-serif]">{formatMt(selectedExposure.unhedged_quantity_mt ?? null)}</div>
                      </div>
                      <div>
                        <div className="text-[11px] text-[var(--sapContent_LabelColor)]">Referência</div>
                        <div className="text-sm font-['72:Bold',sans-serif]">{selectedExposure.pricing_reference || '—'}</div>
                      </div>
                    </div>

                    {Array.isArray(selectedExposure.hedges) && selectedExposure.hedges.length > 0 ? (
                      <div className="px-4 pb-4">
                        <div className="text-xs text-[var(--sapContent_LabelColor)] mb-2">Coberturas registradas</div>
                        <div className="space-y-2">
                          {selectedExposure.hedges.slice(0, 5).map((h) => (
                            <div
                              key={String(h.hedge_id)}
                              className="p-2 rounded border border-[var(--sapTile_BorderColor)] bg-[var(--sapGroup_ContentBackground)]"
                            >
                              <div className="flex items-center justify-between gap-2">
                                <div className="text-xs font-['72:Bold',sans-serif] text-[#131e29]">Hedge #{h.hedge_id}</div>
                                <div className="text-xs text-[var(--sapContent_LabelColor)]">{formatMt(Number(h.quantity_mt || 0))} MT</div>
                              </div>
                              <div className="mt-1 text-[11px] text-[var(--sapContent_LabelColor)]">
                                {[h.counterparty_name, h.instrument, h.period].filter(Boolean).join(' • ') || '—'}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : null}
                  </div>
                ) : null}
              </div>
            </div>
          )}
        </div>
      }
    />
  );
}

export default ExposuresPageIntegrated;
