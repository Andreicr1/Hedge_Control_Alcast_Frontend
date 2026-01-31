/** Exposições de Risco (visão institucional) */

import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useExposures } from '../../hooks';
import { Exposure, ExposureStatus, MarketObjectType } from '../../types';

import { formatDate, formatNumber } from '../../services/dashboard.service';

import { FioriBusyText, FioriErrorRetryBlock } from '../components/fiori';

import {
  Button,
  Card,
  AnalyticalTable,
  FlexBox,
  FlexBoxDirection,
  IllustratedMessage,
  List,
  ListItemStandard,
  MessageStrip,
  ObjectStatus,
  Text,
  Title,
  Toolbar,
  ToolbarSpacer,
} from '@ui5/webcomponents-react';
import ValueState from '@ui5/webcomponents-base/dist/types/ValueState.js';

import { AnalyticScopeTree } from '../analytics/AnalyticScopeTree';
import { useAnalyticScope } from '../analytics/ScopeProvider';
import { useAnalyticScopeUrlSync } from '../analytics/useAnalyticScopeUrlSync';
import { useAnalyticsEntityTreeContext } from '../analytics/EntityTreeProvider';
import { UX_COPY } from '../ux/copy';

function formatSourceTypeLabel(sourceType?: string | null): string {
  const s = String(sourceType || '').toLowerCase();
  if (s === 'so') return 'Pedido de Venda';
  if (s === 'po') return 'Pedido de Compra';
  if (!s) return '—';
  return String(sourceType);
}

function getStatusValueState(status?: ExposureStatus): ValueState {
  switch (status) {
    case ExposureStatus.OPEN:
      return ValueState.Critical;
    case ExposureStatus.PARTIALLY_HEDGED:
      return ValueState.Information;
    case ExposureStatus.HEDGED:
      return ValueState.Positive;
    case ExposureStatus.CLOSED:
      return ValueState.None;
    default:
      return ValueState.None;
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
  return formatNumber(value, 0);
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

    // Backend is authoritative for eligibility/visibility semantics.
    // Frontend must not exclude economic entities based on derived governance meaning.
    const base = all;

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

  const tableData = useMemo(() => {
    return filteredExposures.slice().sort((a, b) => a.id - b.id);
  }, [filteredExposures]);

  const tableColumns = useMemo(
    () =>
      [
        {
          Header: 'Item',
          accessor: 'id',
          Cell: ({ cell }: any) => <Text>Exposição #{cell.value}</Text>,
        },
        {
          Header: 'Origem',
          id: 'source',
          accessor: (row: Exposure) => `${formatSourceTypeLabel(row.source_type)} #${row.source_id}`,
          Cell: ({ cell }: any) => <Text>{cell.value || '—'}</Text>,
        },
        {
          Header: 'Produto',
          accessor: 'product',
          Cell: ({ cell }: any) => <Text>{cell.value || '—'}</Text>,
        },
        {
          Header: 'Volume (MT)',
          id: 'qty',
          accessor: (row: Exposure) => row.quantity_mt ?? null,
          hAlign: 'End',
          Cell: ({ cell }: any) => <Text>{formatMt(cell.value)}</Text>,
        },
        {
          Header: 'Não coberto (MT)',
          id: 'unhedged',
          accessor: (row: Exposure) => row.unhedged_quantity_mt ?? null,
          hAlign: 'End',
          Cell: ({ cell }: any) => <Text>{formatMt(cell.value)}</Text>,
        },
        {
          Header: 'Data',
          id: 'date',
          accessor: (row: Exposure) => row.delivery_date || row.maturity_date || row.payment_date || null,
          Cell: ({ cell }: any) => <Text>{formatDate(cell.value)}</Text>,
        },
        {
          Header: 'Status',
          accessor: 'status',
          Cell: ({ cell }: any) => (
            <ObjectStatus state={getStatusValueState(cell.value)}>{getStatusLabel(cell.value)}</ObjectStatus>
          ),
        },
      ] as any,
    []
  );

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
    <FlexBox direction={FlexBoxDirection.Row} style={{ gap: '1rem', height: '100%' }}>
      <div style={{ width: 340, minWidth: 340, maxWidth: 340 }}>
        <Card header={<Title level="H5">Escopo</Title>} style={{ height: '100%' }}>
          <div style={{ height: '100%' }}>
            <AnalyticScopeTree />
          </div>
        </Card>
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <Card style={{ height: '100%' }}>
          <Toolbar>
            <Title level="H4">{UX_COPY.pages.riskExposure.title}</Title>
            <ToolbarSpacer />
            <Button design="Transparent" onClick={refetch}>
              Atualizar
            </Button>
          </Toolbar>

          <div style={{ padding: '0 1rem 0.5rem 1rem' }}>
            <Text style={{ opacity: 0.8 }}>
              Seleção: <strong>{selectionTitle}</strong>
              {isLoading && exposures ? <span style={{ marginLeft: '0.5rem', fontSize: '0.8125rem' }}>(atualizando…)</span> : null}
            </Text>
          </div>

          {scope.kind === 'none' ? (
            <div style={{ padding: '1rem' }}>
              <IllustratedMessage name="NoData" titleText="Sem seleção" subtitleText="Selecione um deal para visualizar." />
            </div>
          ) : isLoading && !exposures ? (
            <div style={{ padding: '1rem' }}>
              <FioriBusyText message="Carregando exposições..." />
            </div>
          ) : isError ? (
            <div style={{ padding: '1rem' }}>
              <FioriErrorRetryBlock message="Falha ao carregar exposições." onRetry={refetch} />
            </div>
          ) : filteredExposures.length === 0 ? (
            <div style={{ padding: '1rem' }}>
              <IllustratedMessage name="NoData" titleText="Sem exposições" subtitleText="Sem itens para a seleção atual." />
            </div>
          ) : (
            <div style={{ padding: '0 1rem 1rem 1rem' }}>
              {stats ? (
                <FlexBox direction={FlexBoxDirection.Row} style={{ gap: '0.75rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
                  <Card style={{ minWidth: 200, flex: '1 1 200px' }}>
                    <div style={{ padding: '0.75rem' }}>
                      <Text style={{ opacity: 0.75, fontSize: '0.75rem' }}>Exposições</Text>
                      <Title level="H5">{filteredExposures.length}</Title>
                    </div>
                  </Card>
                  <Card style={{ minWidth: 200, flex: '1 1 200px' }}>
                    <div style={{ padding: '0.75rem' }}>
                      <Text style={{ opacity: 0.75, fontSize: '0.75rem' }}>Volume (MT)</Text>
                      <Title level="H5">{formatMt(stats.totalVolume)}</Title>
                    </div>
                  </Card>
                  <Card style={{ minWidth: 200, flex: '1 1 200px' }}>
                    <div style={{ padding: '0.75rem' }}>
                      <Text style={{ opacity: 0.75, fontSize: '0.75rem' }}>Não coberto (MT)</Text>
                      <Title level="H5">{formatMt(stats.totalUnhedged)}</Title>
                    </div>
                  </Card>
                  <Card style={{ minWidth: 240, flex: '1 1 240px' }}>
                    <div style={{ padding: '0.75rem' }}>
                      <Text style={{ opacity: 0.75, fontSize: '0.75rem' }}>Status</Text>
                      <Text style={{ fontWeight: 700 }}>{stats.openCount} aberta(s) · {stats.partialCount} parcial</Text>
                    </div>
                  </Card>
                </FlexBox>
              ) : null}

              <AnalyticalTable
                columns={tableColumns}
                data={tableData as any}
                loading={isLoading && !exposures}
                alwaysShowBusyIndicator
                visibleRows={12}
                minRows={12}
                selectionMode="Single"
                selectionBehavior="RowOnly"
                selectedRowIds={selectedId ? { [String(selectedId)]: true } : {}}
                reactTableOptions={{ getRowId: (row: any) => String(row.id) }}
                onRowClick={(e) => {
                  const row = (e as any).detail?.row;
                  const original = row?.original as Exposure | undefined;
                  if (original?.id) setSelectedId(original.id);
                }}
              />

              {selectedExposure ? (
                <div style={{ marginTop: '0.75rem' }}>
                  <Card header={<Title level="H5">Exposição #{selectedExposure.id}</Title>}>
                    <div style={{ padding: '0.75rem' }}>
                      <FlexBox direction={FlexBoxDirection.Row} justifyContent="SpaceBetween" style={{ gap: '0.75rem', marginBottom: '0.75rem' }}>
                        <div>
                          <Text style={{ opacity: 0.75 }}>{selectedExposure.product || '—'}</Text>
                        </div>
                        <ObjectStatus state={getStatusValueState(selectedExposure.status)}>
                          {getStatusLabel(selectedExposure.status)}
                        </ObjectStatus>
                      </FlexBox>

                      <FlexBox direction={FlexBoxDirection.Row} style={{ gap: '1.25rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
                        <div>
                          <Text style={{ opacity: 0.75, fontSize: '0.75rem' }}>Volume (MT)</Text>
                          <Text style={{ fontWeight: 700 }}>{formatMt(selectedExposure.quantity_mt)}</Text>
                        </div>
                        <div>
                          <Text style={{ opacity: 0.75, fontSize: '0.75rem' }}>Não coberto (MT)</Text>
                          <Text style={{ fontWeight: 700 }}>{formatMt(selectedExposure.unhedged_quantity_mt ?? null)}</Text>
                        </div>
                        <div>
                          <Text style={{ opacity: 0.75, fontSize: '0.75rem' }}>Referência</Text>
                          <Text style={{ fontWeight: 700 }}>{selectedExposure.pricing_reference || '—'}</Text>
                        </div>
                      </FlexBox>

                      {Array.isArray(selectedExposure.hedges) && selectedExposure.hedges.length > 0 ? (
                        <>
                          <Title level="H6">Coberturas registradas</Title>
                          <List style={{ marginTop: '0.5rem' }}>
                            {selectedExposure.hedges.slice(0, 5).map((h) => (
                              <ListItemStandard
                                key={String(h.hedge_id)}
                                description={[h.counterparty_name, h.instrument, h.period].filter(Boolean).join(' • ') || '—'}
                                additionalText={`${formatMt(Number(h.quantity_mt || 0))} MT`}
                              >
                                Hedge #{h.hedge_id}
                              </ListItemStandard>
                            ))}
                          </List>
                        </>
                      ) : null}
                    </div>
                  </Card>
                </div>
              ) : null}
            </div>
          )}
        </Card>
      </div>
    </FlexBox>
  );
}

export default ExposuresPageIntegrated;
