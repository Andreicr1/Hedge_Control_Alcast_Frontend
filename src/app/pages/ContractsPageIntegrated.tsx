/** Contracts Page */

import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useContracts, useContractDetail, useTimelineSubject } from '../../hooks';
import { Contract, ContractExposureLink } from '../../types';
import { extractTradeLegs, calculateNotional } from '../../services/contracts.service';
import { ContractDocumentsPanel } from '../components/contracts/ContractDocumentsPanel';
import { FioriPageHeader, FioriToolbarRow } from '../components/fiori';
import { formatDate, formatDateTime, formatHumanDateTime, formatNumber } from '../../services/dashboard.service';
import { UX_COPY } from '../ux/copy';
import { useAnalyticScope } from '../analytics/ScopeProvider';
import { useAnalyticScopeUrlSync } from '../analytics/useAnalyticScopeUrlSync';

import {
  AnalyticalTable,
  BusyIndicator,
  Button,
  Card,
  FlexBox,
  FlexBoxDirection,
  IllustratedMessage,
  Input,
  Label,
  List,
  ListItemStandard,
  MessageStrip,
  ObjectStatus,
  Option,
  Select,
  Text,
  Title,
} from '@ui5/webcomponents-react';
import ValueState from '@ui5/webcomponents-base/dist/types/ValueState.js';

// ============================================
// Status Helpers
// ============================================

function computeDisplayStatus(contract: Contract): {
  key: string;
  state: ValueState;
  label: string;
} {
  const explicit = (contract.post_maturity_status || '').toLowerCase();
  const base = (contract.status || '').toLowerCase();

  let key = explicit || base || 'unknown';

  const stateMap: Record<string, ValueState> = {
    active: ValueState.Positive,
    vencido: ValueState.Critical,
    settled: ValueState.Information,
    cancelled: ValueState.Negative,
  };
  const labelMap: Record<string, string> = {
    active: 'Ativo',
    vencido: 'Vencido',
    settled: 'Liquidado',
    cancelled: 'Cancelado',
  };

  return {
    key,
    state: stateMap[key] || ValueState.None,
    label: labelMap[key] || contract.status || 'Desconhecido',
  };
}

// ============================================
// Main Component
// ============================================

export function ContractsPageIntegrated() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useAnalyticScopeUrlSync({ acceptLegacyDealId: true });
  const { scope, setScope } = useAnalyticScope();

  const scopedDealId =
    scope.kind === 'deal' || scope.kind === 'so' || scope.kind === 'po' || scope.kind === 'contract'
      ? scope.dealId
      : undefined;
  
  // API State via hooks
  const contractFilters = useMemo(() => ({ deal_id: scopedDealId }), [scopedDealId]);
  const { contracts, isLoading, isError, error, refetch } = useContracts(contractFilters);
  
  // Local UI state
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedContractId, setSelectedContractId] = useState<string | null>(null);

  const _didInitFromUrl = useRef(false);
  useEffect(() => {
    if (_didInitFromUrl.current) return;
    _didInitFromUrl.current = true;

    const q = searchParams.get('q');
    if (q) setSearchTerm(q);

    const idParam = searchParams.get('id');
    if (idParam) setSelectedContractId(idParam);
  }, [searchParams]);

  // If scope points to a contract, open it in the detail pane.
  useEffect(() => {
    if (scope.kind !== 'contract') return;
    const cid = (scope.contractId || '').trim();
    if (!cid) return;
    setSelectedContractId(cid);
  }, [scope]);
  
  // Selected contract detail
  const {
    contract: selectedContract,
    exposures: selectedContractExposures,
    isLoading: isLoadingDetail,
    refetch: refetchDetail,
  } = useContractDetail(selectedContractId);

  // Timeline is read-only and backend-authoritative.
  // We bind to the deal subject to avoid guessing numeric IDs for contracts.
  const {
    events: timelineEvents,
    isLoading: timelineLoading,
    isError: timelineIsError,
    refetch: refetchTimeline,
  } = useTimelineSubject(selectedContract ? 'deal' : null, selectedContract ? selectedContract.deal_id : null, 50);

  // ============================================
  // Filtered Data
  // ============================================
  
  const filteredContracts = useMemo(() => {
    if (!contracts) return [];
    
    return contracts.filter((contract) => {
      const matchesSearch =
        contract.contract_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contract.quote_group_id?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || contract.status?.toLowerCase() === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [contracts, searchTerm, statusFilter]);

  // ============================================
  // Handlers
  // ============================================

  const handleContractSelect = useCallback(
    (contract: Contract) => {
      setSelectedContractId(contract.contract_id);
      if (contract.deal_id) {
        setScope({ kind: 'contract', dealId: contract.deal_id, contractId: contract.contract_id });
      }
    },
    [setScope]
  );

  const handleNavigateToRfq = useCallback((rfqId: number) => {
    navigate(`/financeiro/rfqs?selected=${rfqId}`);
  }, [navigate]);

  const handleNavigateToDeal = useCallback((dealId: number) => {
    setScope({ kind: 'deal', dealId });
    const qs = new URLSearchParams({ scope: 'deal', deal_id: String(dealId) });
    navigate(`/financeiro/cashflow?${qs.toString()}`);
  }, [navigate, setScope]);

  const handleNavigateToSource = useCallback(
    (link: ContractExposureLink, dealId: number) => {
      const t = (link.source_type || '').toLowerCase();
      const qs = new URLSearchParams({ scope: t, deal_id: String(dealId) });
      if (t === 'so') qs.set('so_id', String(link.source_id));
      if (t === 'po') qs.set('po_id', String(link.source_id));
      navigate(`/financeiro/exposicoes?${qs.toString()}`);
    },
    [navigate],
  );

  // ============================================
  // Master Column - Contract List
  // ============================================

  const masterContent = (
    <Card style={{ height: '100%' }}>
      <div style={{ padding: '0.75rem' }}>
        <FioriToolbarRow
          style={{ marginBottom: '0.75rem' }}
          leading={
            <>
              <Title level="H5">Contratos</Title>
              <Text style={{ opacity: 0.7 }}>({filteredContracts.length})</Text>
            </>
          }
          trailing={
            <Button design="Transparent" onClick={refetch} disabled={isLoading}>
              Atualizar
            </Button>
          }
        />

        <FlexBox direction={FlexBoxDirection.Column} style={{ gap: '0.5rem', marginBottom: '0.75rem' }}>
          <FlexBox direction={FlexBoxDirection.Column} style={{ gap: '0.25rem' }}>
            <Label>Busca</Label>
            <Input
              value={searchTerm}
              onInput={(e) => setSearchTerm((e.target as HTMLInputElement).value)}
              placeholder=""
            />
          </FlexBox>

          <FlexBox direction={FlexBoxDirection.Column} style={{ gap: '0.25rem' }}>
            <Label>Status</Label>
            <Select value={statusFilter} onChange={(e) => setStatusFilter(String((e.target as any).value || 'all'))}>
              <Option value="all">Todos</Option>
              <Option value="active">Ativos</Option>
              <Option value="settled">Liquidados</Option>
            </Select>
          </FlexBox>
        </FlexBox>

        {isLoading ? (
          <div style={{ padding: '0.5rem 0' }}>
            <BusyIndicator active delay={0} />
            <Text style={{ marginTop: '0.5rem', opacity: 0.75 }}>Carregando contratos…</Text>
          </div>
        ) : isError ? (
          <div style={{ padding: '0.5rem 0' }}>
            <MessageStrip design="Negative" style={{ marginBottom: '0.75rem' }}>
              Falha ao carregar contratos.
            </MessageStrip>
            <Button design="Emphasized" onClick={refetch}>
              Tentar novamente
            </Button>
          </div>
        ) : filteredContracts.length === 0 ? (
          <IllustratedMessage name="NoData" titleText="Nenhum contrato" subtitleText="Sem itens para os filtros atuais." />
        ) : (
          <List style={{ width: '100%' }}>
            {filteredContracts.map((contract) => {
              const { buyLeg, sellLeg, spread } = extractTradeLegs(contract);
              const display = computeDisplayStatus(contract);

              const tradeBits = [
                buyLeg ? `Compra: ${formatNumber(buyLeg.price, 2)}` : null,
                sellLeg ? `Venda: ${formatNumber(sellLeg.price, 2)}` : null,
                spread != null ? `Δ ${formatNumber(spread, 2)}` : null,
              ]
                .filter(Boolean)
                .join(' • ');

              const desc = [`Estrutura nº ${contract.trade_index ?? 0}`, `Operação nº ${contract.deal_id}`, tradeBits || null]
                .filter(Boolean)
                .join(' • ');

              return (
                <ListItemStandard
                  key={contract.contract_id}
                  type="Active"
                  selected={selectedContractId === contract.contract_id}
                  description={desc}
                  additionalText={formatDate(contract.settlement_date)}
                  additionalTextState={display.state}
                  onClick={() => handleContractSelect(contract)}
                >
                  {contract.contract_id}
                </ListItemStandard>
              );
            })}
          </List>
        )}
      </div>
    </Card>
  );

  // ============================================
  // Detail Column - Contract Detail
  // ============================================

  function formatPriceTypeLabel(pt?: string | null) {
    const k = (pt || '').toLowerCase();
    if (k === 'fix') return 'Preço Fixo';
    if (k === 'avg') return 'Média Mensal';
    if (k === 'avginter' || k === 'avg_inter' || k === 'avg inter') return 'Média de dias intermediários';
    if (k === 'c2r') return 'Preço Futuro';
    return pt || '—';
  }

  const formatSourceLabel = (t?: string) => {
    const k = (t || '').toLowerCase();
    if (k === 'so') return 'Sales Order (SO)';
    if (k === 'po') return 'Purchase Order (PO)';
    return t || '—';
  };

  const formatExposureTypeLabel = (t?: string) => {
    const k = (t || '').toLowerCase();
    if (k === 'active') return 'Ativa';
    if (k === 'passive') return 'Passiva';
    if (k === 'residual') return 'Residual';
    return t || '—';
  };

  const renderExposureCoverage = (links: ContractExposureLink[], dealId: number) => {
    if (!links.length) return null;

    const grouped = links.reduce(
      (acc, x) => {
        const key = (x.source_type || 'unknown') as string;
        acc[key] = acc[key] || [];
        acc[key].push(x);
        return acc;
      },
      {} as Record<string, ContractExposureLink[]>,
    );

    const total = links.reduce((s, x) => s + (x.quantity_mt || 0), 0);

    return (
      <Card header={<Title level="H5">Cobertura de exposição</Title>}>
        <div style={{ padding: '0.75rem' }}>
          <Text style={{ opacity: 0.75, fontSize: '0.8125rem', marginBottom: '0.75rem' }}>
            Total alocado: {formatNumber(total, 0)} t
          </Text>

          <FlexBox direction={FlexBoxDirection.Column} style={{ gap: '0.75rem' }}>
            {Object.entries(grouped).map(([k, rows]) => {
              const subtotal = rows.reduce((s, x) => s + (x.quantity_mt || 0), 0);
              return (
                <Card
                  key={k}
                  header={
                    <FlexBox direction={FlexBoxDirection.Row} justifyContent="SpaceBetween" style={{ width: '100%' }}>
                      <Text style={{ fontWeight: 700 }}>{formatSourceLabel(k)}</Text>
                      <Text style={{ fontWeight: 700 }}>{formatNumber(subtotal, 0)} t</Text>
                    </FlexBox>
                  }
                >
                  <div style={{ padding: '0.5rem' }}>
                    <List>
                      {rows
                        .slice()
                        .sort((a, b) => (a.source_id - b.source_id) || (a.exposure_id - b.exposure_id))
                        .map((row) => (
                          <ListItemStandard
                            key={`${row.exposure_id}`}
                            type="Active"
                            onClick={() => handleNavigateToSource(row, dealId)}
                            description={`Tipo: ${formatExposureTypeLabel(String(row.exposure_type))} • Status: ${String(row.status)}`}
                            additionalText={`${formatNumber(row.quantity_mt || 0, 0)} t`}
                          >
                            {formatSourceLabel(String(row.source_type))} #{row.source_id} • Exposição #{row.exposure_id}
                          </ListItemStandard>
                        ))}
                    </List>
                  </div>
                </Card>
              );
            })}
          </FlexBox>
        </div>
      </Card>
    );
  };

  const renderEconomicStructure = (contract: Contract) => {
    const { buyLeg, sellLeg, spread } = extractTradeLegs(contract);
    const notional = calculateNotional(contract);

    const display = computeDisplayStatus(contract);
    const fixedPrice = contract.fixed_price ?? null;
    const variableLabel = contract.variable_reference_label ?? null;
    const obsStart = contract.observation_start ? formatDate(contract.observation_start) : null;
    const obsEnd = contract.observation_end ? formatDate(contract.observation_end) : null;
    const maturity = contract.maturity_date ? formatDate(contract.maturity_date) : null;
    
    const legs = contract.legs || [];

    const renderLegTimeHint = (leg: (typeof legs)[number]) => {
      const k = (leg.price_type || '').toLowerCase();
      if (k === 'avg' && leg.month_name && leg.year) return `${leg.month_name} ${leg.year}`;
      if (k === 'avginter' && leg.start_date && leg.end_date) {
        return `${formatDate(leg.start_date)} → ${formatDate(leg.end_date)}`;
      }
      if (k === 'c2r' && leg.fixing_date) return `Fixing: ${formatDate(leg.fixing_date)}`;
      return null;
    };

    return (
      <Card header={<Title level="H5">Estrutura Econômica</Title>}>
        <div style={{ padding: '0.75rem' }}>
          <FlexBox direction={FlexBoxDirection.Row} style={{ gap: '0.75rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
            <Card style={{ minWidth: 220, flex: '1 1 220px' }}>
              <div style={{ padding: '0.75rem' }}>
                <Text style={{ opacity: 0.75, fontSize: '0.75rem' }}>Preço fixado</Text>
                <Title level="H5">{fixedPrice !== null ? formatNumber(fixedPrice, 2) : '—'}</Title>
                <Text style={{ opacity: 0.75, fontSize: '0.8125rem' }}>
                  Quantidade: {formatNumber((contract.fixed_leg?.quantity_mt ?? buyLeg?.volume_mt ?? sellLeg?.volume_mt ?? 0) as number, 0)} t
                </Text>
              </div>
            </Card>

            <Card style={{ minWidth: 220, flex: '1 1 220px' }}>
              <div style={{ padding: '0.75rem' }}>
                <Text style={{ opacity: 0.75, fontSize: '0.75rem' }}>Referência</Text>
                <Title level="H5">{variableLabel || formatPriceTypeLabel(contract.variable_leg?.price_type || undefined)}</Title>
                <Text style={{ opacity: 0.75, fontSize: '0.8125rem' }}>
                  {obsStart && obsEnd ? `Janela: ${obsStart} → ${obsEnd}` : maturity ? `Vencimento: ${maturity}` : '—'}
                </Text>
              </div>
            </Card>
          </FlexBox>

          <AnalyticalTable
            columns={[
              { Header: 'Leg', accessor: 'leg' },
              { Header: 'Preço', accessor: 'price', hAlign: 'End' },
              { Header: 'Qtd (t)', accessor: 'qty', hAlign: 'End' },
              { Header: 'Tipo', accessor: 'type' },
            ]}
            data={[
              {
                leg: 'Compra',
                price: buyLeg ? formatNumber(buyLeg.price, 2) : '—',
                qty: buyLeg ? formatNumber(buyLeg.volume_mt, 0) : '—',
                type: buyLeg?.price_type ? formatPriceTypeLabel(buyLeg.price_type) : '—',
              },
              {
                leg: 'Venda',
                price: sellLeg ? formatNumber(sellLeg.price, 2) : '—',
                qty: sellLeg ? formatNumber(sellLeg.volume_mt, 0) : '—',
                type: sellLeg?.price_type ? formatPriceTypeLabel(sellLeg.price_type) : '—',
              },
            ]}
            visibleRows={2}
            minRows={2}
            alternateRowColor
            style={{ marginTop: '0.75rem' }}
          />

          <FlexBox direction={FlexBoxDirection.Row} style={{ gap: '0.75rem', flexWrap: 'wrap', marginTop: '0.75rem' }}>
            <Card style={{ minWidth: 220, flex: '1 1 220px' }}>
              <div style={{ padding: '0.75rem' }}>
                <Text style={{ opacity: 0.75, fontSize: '0.75rem' }}>Diferença</Text>
                <Title level="H5">{spread != null ? formatNumber(spread, 2) : '—'}</Title>
              </div>
            </Card>
            <Card style={{ minWidth: 220, flex: '1 1 220px' }}>
              <div style={{ padding: '0.75rem' }}>
                <Text style={{ opacity: 0.75, fontSize: '0.75rem' }}>Valor nocional</Text>
                <Title level="H5">{formatNumber(notional, 2)}</Title>
              </div>
            </Card>
            <Card style={{ minWidth: 220, flex: '1 1 220px' }}>
              <div style={{ padding: '0.75rem' }}>
                <Text style={{ opacity: 0.75, fontSize: '0.75rem' }}>Status</Text>
                <ObjectStatus state={display.state}>{display.label}</ObjectStatus>
                <Text style={{ opacity: 0.75, fontSize: '0.8125rem' }}>Vencimento: {maturity || '—'}</Text>
              </div>
            </Card>
          </FlexBox>

          {legs.length > 0 ? (
            <div style={{ marginTop: '0.75rem' }}>
              <Title level="H6">Detalhe das legs</Title>
              <AnalyticalTable
                columns={[
                  { Header: 'Side', accessor: 'side' },
                  { Header: 'Qtd (t)', accessor: 'qty', hAlign: 'End' },
                  { Header: 'Preço', accessor: 'price', hAlign: 'End' },
                  { Header: 'Tipo', accessor: 'type' },
                  { Header: 'Período', accessor: 'period' },
                ]}
                data={legs.map((leg, idx) => {
                  const side = (leg.side || '').toLowerCase();
                  const sideLabel = side === 'buy' ? 'Compra' : side === 'sell' ? 'Venda' : leg.side || '—';
                  return {
                    id: `${leg.side}-${idx}`,
                    side: sideLabel,
                    qty: formatNumber(leg.quantity_mt, 0),
                    price: leg.price != null ? formatNumber(leg.price, 2) : '—',
                    type: formatPriceTypeLabel(leg.price_type || null),
                    period: renderLegTimeHint(leg) || '—',
                  };
                })}
                alternateRowColor
                visibleRows={Math.min(legs.length, 8)}
                minRows={Math.min(legs.length, 8)}
                style={{ marginTop: '0.5rem' }}
              />
            </div>
          ) : null}
        </div>
      </Card>
    );
  };

  const renderSettlementSummary = (contract: Contract) => {
    const settlementDate = contract.settlement_date ? formatDate(contract.settlement_date) : null;
    const adj = contract.settlement_adjustment_usd;
    const showAdjustment = adj !== null && adj !== undefined;

    return (
      <Card header={<Title level="H5">Liquidação</Title>}>
        <div style={{ padding: '0.75rem' }}>
          <FlexBox direction={FlexBoxDirection.Row} style={{ gap: '0.75rem', flexWrap: 'wrap' }}>
            <Card style={{ minWidth: 260, flex: '1 1 260px' }}>
              <div style={{ padding: '0.75rem' }}>
                <Text style={{ opacity: 0.75, fontSize: '0.75rem' }}>Data de liquidação</Text>
                <Title level="H5">{settlementDate || '—'}</Title>
              </div>
            </Card>

            <Card style={{ minWidth: 260, flex: '1 1 260px' }}>
              <div style={{ padding: '0.75rem' }}>
                <Text style={{ opacity: 0.75, fontSize: '0.75rem' }}>Ajuste final (USD)</Text>
                <Title level="H5">{showAdjustment ? formatNumber(adj, 2) : '—'}</Title>
                {contract.settlement_adjustment_methodology ? (
                  <Text style={{ opacity: 0.75, fontSize: '0.8125rem' }}>
                    Metodologia: {contract.settlement_adjustment_methodology}
                    {contract.settlement_adjustment_locked ? ' • bloqueado' : ''}
                  </Text>
                ) : null}
              </div>
            </Card>
          </FlexBox>

          {contract.settlement_meta ? (
            <div style={{ marginTop: '0.75rem' }}>
              <Text style={{ opacity: 0.75, fontSize: '0.8125rem', marginBottom: '0.25rem' }}>Detalhes (meta)</Text>
              <pre
                style={{
                  margin: 0,
                  padding: '0.75rem',
                  border: '1px solid var(--sapGroup_ContentBorderColor)',
                  background: 'var(--sapGroup_ContentBackground)',
                  borderRadius: 8,
                  overflow: 'auto',
                  fontSize: '0.75rem',
                }}
              >
                {JSON.stringify(contract.settlement_meta, null, 2)}
              </pre>
            </div>
          ) : null}
        </div>
      </Card>
    );
  };

  const timelinePanel = selectedContract ? (
    <Card
      header={
        <FlexBox direction={FlexBoxDirection.Row} justifyContent="SpaceBetween" style={{ width: '100%' }}>
          <Title level="H5">Timeline (Deal)</Title>
          <Button design="Transparent" onClick={refetchTimeline} disabled={timelineLoading}>
            Atualizar
          </Button>
        </FlexBox>
      }
    >
      <div style={{ padding: '0.75rem' }}>
        {timelineLoading ? (
          <div>
            <BusyIndicator active delay={0} />
            <Text style={{ marginTop: '0.5rem', opacity: 0.75 }}>Carregando timeline…</Text>
          </div>
        ) : timelineIsError ? (
          <MessageStrip design="Negative">Falha ao carregar timeline.</MessageStrip>
        ) : timelineEvents.length === 0 ? (
          <IllustratedMessage name="NoData" titleText="Sem eventos" subtitleText="Não há eventos de timeline para este deal." />
        ) : (
          <List>
            {timelineEvents.slice(0, 50).map((ev) => (
              <ListItemStandard
                key={String(ev.id)}
                description={String(ev.event_type || '—')}
                additionalText={formatHumanDateTime(String(ev.occurred_at || ev.created_at || ''))}
              >
                #{ev.id}
              </ListItemStandard>
            ))}
          </List>
        )}
      </div>
    </Card>
  ) : null;

  const detailContent = selectedContract ? (
    <div style={{ height: '100%', overflowY: 'auto' }}>
      <div style={{ padding: '1rem' }}>
        <FioriPageHeader
          style={{ marginBottom: '0.75rem' }}
          title={<Title level="H4">Contrato</Title>}
          status={(() => {
            const s = computeDisplayStatus(selectedContract);
            return <ObjectStatus state={s.state}>{s.label}</ObjectStatus>;
          })()}
          actions={
            <Button design="Transparent" onClick={refetchDetail} disabled={isLoadingDetail}>
              Atualizar
            </Button>
          }
        />

        <FlexBox direction={FlexBoxDirection.Column} style={{ gap: '0.75rem' }}>
          <Card header={<Title level="H5">Identidade do Contrato</Title>}>
            <div style={{ padding: '0.75rem' }}>
              <FlexBox direction={FlexBoxDirection.Row} style={{ gap: '0.75rem', flexWrap: 'wrap' }}>
                <Card style={{ minWidth: 240, flex: '1 1 240px' }}>
                  <div style={{ padding: '0.75rem' }}>
                    <Text style={{ opacity: 0.75, fontSize: '0.75rem' }}>Contrato (ID)</Text>
                    <Text style={{ fontWeight: 700 }}>{selectedContract.contract_id}</Text>
                  </div>
                </Card>
                <Card style={{ minWidth: 240, flex: '1 1 240px' }}>
                  <div style={{ padding: '0.75rem' }}>
                    <Text style={{ opacity: 0.75, fontSize: '0.75rem' }}>Contraparte</Text>
                    <Text style={{ fontWeight: 700 }}>
                      {selectedContract.counterparty?.name ||
                        selectedContract.counterparty_name ||
                        (selectedContract.counterparty_id ? `Contraparte #${selectedContract.counterparty_id}` : '—')}
                    </Text>
                    <Text style={{ opacity: 0.75, fontSize: '0.8125rem' }}>
                      {selectedContract.counterparty_id ? `ID: ${selectedContract.counterparty_id}` : '—'}
                    </Text>
                  </div>
                </Card>
                <Card style={{ minWidth: 240, flex: '1 1 240px' }}>
                  <div style={{ padding: '0.75rem' }}>
                    <Text style={{ opacity: 0.75, fontSize: '0.75rem' }}>Operação (Deal)</Text>
                    <Text style={{ fontWeight: 700 }}>#{selectedContract.deal_id}</Text>
                  </div>
                </Card>
                <Card style={{ minWidth: 240, flex: '1 1 240px' }}>
                  <div style={{ padding: '0.75rem' }}>
                    <Text style={{ opacity: 0.75, fontSize: '0.75rem' }}>RFQ</Text>
                    <Text style={{ fontWeight: 700 }}>#{selectedContract.rfq_id}</Text>
                  </div>
                </Card>
                <Card style={{ minWidth: 240, flex: '1 1 240px' }}>
                  <div style={{ padding: '0.75rem' }}>
                    <Text style={{ opacity: 0.75, fontSize: '0.75rem' }}>Estrutura</Text>
                    <Text style={{ fontWeight: 700 }}>#{selectedContract.trade_index ?? 0}</Text>
                  </div>
                </Card>
                <Card style={{ minWidth: 240, flex: '1 1 240px' }}>
                  <div style={{ padding: '0.75rem' }}>
                    <Text style={{ opacity: 0.75, fontSize: '0.75rem' }}>Grupo de cotação</Text>
                    <Text style={{ fontWeight: 700 }}>{selectedContract.quote_group_id || '—'}</Text>
                  </div>
                </Card>
                <Card style={{ minWidth: 240, flex: '1 1 240px' }}>
                  <div style={{ padding: '0.75rem' }}>
                    <Text style={{ opacity: 0.75, fontSize: '0.75rem' }}>Data de liquidação</Text>
                    <Text style={{ fontWeight: 700 }}>{formatDate(selectedContract.settlement_date)}</Text>
                  </div>
                </Card>
                <Card style={{ minWidth: 240, flex: '1 1 240px' }}>
                  <div style={{ padding: '0.75rem' }}>
                    <Text style={{ opacity: 0.75, fontSize: '0.75rem' }}>Criado em</Text>
                    <Text style={{ fontWeight: 700 }}>{formatDateTime(selectedContract.created_at)}</Text>
                  </div>
                </Card>
              </FlexBox>
            </div>
          </Card>

          {renderEconomicStructure(selectedContract)}
          {renderSettlementSummary(selectedContract)}
          {renderExposureCoverage(selectedContractExposures, selectedContract.deal_id)}
          {timelinePanel}

          <ContractDocumentsPanel contract={selectedContract} />

          <Card header={<Title level="H5">Links Relacionados</Title>}>
            <div style={{ padding: '0.75rem' }}>
              <FlexBox direction={FlexBoxDirection.Column} style={{ gap: '0.5rem' }}>
                <Button design="Transparent" onClick={() => handleNavigateToDeal(selectedContract.deal_id)}>
                  Abrir operação nº {selectedContract.deal_id}
                </Button>
                <Button design="Transparent" onClick={() => handleNavigateToRfq(selectedContract.rfq_id)}>
                  Abrir cotação nº {selectedContract.rfq_id}
                </Button>
                {selectedContract.counterparty_id ? (
                  <Text style={{ opacity: 0.75 }}>
                    Contraparte: {selectedContract.counterparty?.name || selectedContract.counterparty_name || `#${selectedContract.counterparty_id}`}
                  </Text>
                ) : null}
              </FlexBox>
            </div>
          </Card>
        </FlexBox>
      </div>
    </div>
  ) : isLoadingDetail ? (
    <div style={{ padding: '1rem' }}>
      <BusyIndicator active delay={0} />
      <Text style={{ marginTop: '0.5rem', opacity: 0.75 }}>Carregando detalhes…</Text>
    </div>
  ) : (
    <div style={{ padding: '1rem' }}>
      <IllustratedMessage name="NoData" titleText="Selecione um contrato" subtitleText="Escolha um contrato da lista para ver os detalhes." />
    </div>
  );

  return (
    <FlexBox direction={FlexBoxDirection.Row} style={{ gap: '1rem', padding: '1rem', flexWrap: 'wrap' }}>
      <div style={{ width: 360, flex: '0 0 360px', minHeight: 600 }}>{masterContent}</div>
      <div style={{ flex: '1 1 720px', minWidth: 320, minHeight: 600 }}>
        <Card style={{ height: '100%' }} header={<Title level="H5">{UX_COPY.pages.contracts.title}</Title>}>
          {detailContent}
        </Card>
      </div>
    </FlexBox>
  );
}

export default ContractsPageIntegrated;
