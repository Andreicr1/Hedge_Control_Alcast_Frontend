/** RFQs Page */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAwardQuote, useContractsByRfq, useRfqDetail, useRfqs, useSendRfq, useTimelineSubject } from '../../hooks';
import { useCounterparties } from '../../hooks/useCounterparties';
import { ApiError, KycGateErrorDetail, Rfq, RfqQuote, RfqStatus, RfqAwardRequest } from '../../types';
import { groupQuotesByTrade, rankTradesBySpread } from '../../services/rfqs.service';
import { getCounterpartyKycPreflight } from '../../services/counterparties.service';
import { QuoteEntryForm } from '../components/rfq/QuoteEntryForm';
import { RfqDecisionRankingTable } from '../components/rfq/RfqDecisionRankingTable';
import { FioriPageHeader, FioriToolbarRow } from '../components/fiori';
import { UX_COPY } from '../ux/copy';
import {
  Bar,
  BusyIndicator,
  Button,
  Card,
  Dialog,
  FlexBox,
  FlexBoxDirection,
  IllustratedMessage,
  Input,
  Label,
  List,
  ListItemStandard,
  MessageStrip,
  ObjectStatus,
  Text,
  TextArea,
  Title,
} from '@ui5/webcomponents-react';
import ValueState from '@ui5/webcomponents-base/dist/types/ValueState.js';
import { formatDate, formatHumanDateTime, formatNumber } from '../../services/dashboard.service';
import { formatNumberFixed } from '../ux/format';

function buildWhatsAppUrl(text: string): string {
  return `https://wa.me/?text=${encodeURIComponent(text)}`;
}

function openWhatsApp(text: string) {
  const url = buildWhatsAppUrl(text);
  window.open(url, '_blank', 'noopener,noreferrer');
}

function legSideLabel(value: string | null | undefined): string {
  if (!value) return '—';
  const k = String(value).toLowerCase();
  if (k === 'buy') return 'Compra';
  if (k === 'sell') return 'Venda';
  return '—';
}

// ============================================
// Main Component
// ============================================

export function RFQsPageIntegrated() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Counterparty KYC is not enforced at this phase.
  // Kept behind a feature flag for future rollout.
  const ENABLE_COUNTERPARTY_KYC = import.meta.env.VITE_ENABLE_COUNTERPARTY_KYC === 'true';
  
  // API State via hooks
  const { rfqs, isLoading, isError, error, refetch } = useRfqs();
  const { counterparties } = useCounterparties();
  
  // Local UI state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRfqId, setSelectedRfqId] = useState<number | null>(null);
  const [showQuoteForm, setShowQuoteForm] = useState(false);

  const _didInitFromUrl = useRef(false);
  useEffect(() => {
    if (_didInitFromUrl.current) return;
    _didInitFromUrl.current = true;

    const raw = searchParams.get('selected') || searchParams.get('id');
    if (!raw) return;
    const id = Number(raw);
    if (Number.isFinite(id) && id > 0) setSelectedRfqId(id);
  }, [searchParams]);
  
  // Selected RFQ detail
  const { rfq: selectedRfq, isLoading: isLoadingDetail, refetch: refetchDetail } = useRfqDetail(selectedRfqId);

  const { contracts: rfqContracts, isLoading: isLoadingContracts } = useContractsByRfq(selectedRfqId);

  // Timeline is read-only and backend-authoritative.
  const {
    events: timelineEvents,
    isLoading: timelineLoading,
    isError: timelineIsError,
    refetch: refetchTimeline,
  } = useTimelineSubject(selectedRfq ? 'rfq' : null, selectedRfq ? selectedRfq.id : null, 50);
  
  // Mutations
  const awardMutation = useAwardQuote();
  const sendMutation = useSendRfq();
  
  // Modal states
  const [showAwardModal, setShowAwardModal] = useState(false);
  const [selectedQuoteForAward, setSelectedQuoteForAward] = useState<RfqQuote | null>(null);
  const [awardReason, setAwardReason] = useState('');
  const [awardKycMessage, setAwardKycMessage] = useState<string | null>(null);
  const [isAwardKycLoading, setIsAwardKycLoading] = useState(false);

  const formatCounterpartyKycBlockMessage = useCallback((reasonCode?: string | null) => {
    const code = String(reasonCode || '').toUpperCase();
    if (!code) return 'Contraparte indisponível para contratação (KYC pendente).';
    if (code === 'KYC_CHECK_MISSING') return 'Contraparte indisponível para contratação (KYC pendente).';
    if (code === 'KYC_CHECK_EXPIRED') return 'Contraparte indisponível para contratação (KYC vencido).';
    if (code === 'KYC_CHECK_FAILED') return 'Contraparte indisponível para contratação (KYC reprovado).';
    if (code === 'COUNTERPARTY_KYC_STATUS_NOT_APPROVED') return 'Contraparte indisponível para contratação (KYC pendente).';
    return 'Contraparte indisponível para contratação (KYC pendente).';
  }, []);

  const parseKycGateError = useCallback((err: ApiError | null | undefined): KycGateErrorDetail | null => {
    const obj = err?.detail_obj;
    if (obj && typeof obj === 'object' && typeof (obj as any).code === 'string') {
      return obj as KycGateErrorDetail;
    }

    const body = err?.response_body as any;
    const detail = body?.detail;
    if (detail && typeof detail === 'object' && typeof detail.code === 'string') {
      return detail as KycGateErrorDetail;
    }

    return null;
  }, []);

  type ApprovalRequiredDetail = {
    code: 'approval_required';
    workflow_request_id: number;
    request_key?: string;
    status?: string;
    action?: string;
    subject_type?: string;
    subject_id?: string;
    required_role?: string;
    threshold_usd?: number | null;
    notional_usd?: number | null;
  };

  const parseApprovalRequired = useCallback((err: ApiError | null | undefined): ApprovalRequiredDetail | null => {
    const obj = err?.detail_obj;
    if (obj && typeof obj === 'object' && (obj as any).code === 'approval_required') {
      return obj as ApprovalRequiredDetail;
    }

    const body = err?.response_body as any;
    const detail = body?.detail;
    if (detail && typeof detail === 'object' && detail.code === 'approval_required') {
      return detail as ApprovalRequiredDetail;
    }

    return null;
  }, []);

  // ============================================
  // Filtered & Sorted Data
  // ============================================
  
  const filteredRfqs = useMemo(() => {
    if (!rfqs) return [];
    
    return rfqs.filter((rfq) => {
      const matchesSearch =
        rfq.rfq_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rfq.period.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSearch;
    });
  }, [rfqs, searchTerm]);

  // Group quotes by trade and rank them
  const rankedTrades = useMemo(() => {
    if (!selectedRfq?.counterparty_quotes) return [];
    const grouped = groupQuotesByTrade(selectedRfq.counterparty_quotes);
    return rankTradesBySpread(grouped);
  }, [selectedRfq]);

  const decisionSummary = useMemo(() => {
    if (!selectedRfq) return null;

    const winnerQuoteId = selectedRfq.winner_quote_id;
    const bestTrade = rankedTrades.length ? rankedTrades[0] : null;

    const selectedTrade =
      typeof winnerQuoteId === 'number'
        ? rankedTrades.find((t) => t.quotes.some((q) => q.id === winnerQuoteId)) || null
        : null;

    const bestBuy = bestTrade?.quotes.find((q) => q.leg_side === 'buy');
    const bestSell = bestTrade?.quotes.find((q) => q.leg_side === 'sell');
    const bestCounterparty = bestBuy?.counterparty_name || bestSell?.counterparty_name || null;

    const selectedBuy = selectedTrade?.quotes.find((q) => q.leg_side === 'buy');
    const selectedSell = selectedTrade?.quotes.find((q) => q.leg_side === 'sell');
    const selectedCounterparty =
      selectedBuy?.counterparty_name || selectedSell?.counterparty_name || (selectedTrade ? '—' : null);

    const bestSpread = bestTrade?.spread ?? null;
    const selectedSpread = selectedTrade?.spread ?? null;

    const spreadDelta =
      typeof bestSpread === 'number' && typeof selectedSpread === 'number' ? selectedSpread - bestSpread : null;

    const qty = selectedRfq.quantity_mt;
    const impactVsBest = typeof spreadDelta === 'number' ? spreadDelta * qty : null;

    return {
      bestSpread,
      bestCounterparty,
      selectedSpread,
      selectedCounterparty,
      spreadDelta,
      impactVsBest,
    };
  }, [rankedTrades, selectedRfq]);

  // ============================================
  // Handlers
  // ============================================

  const handleRfqSelect = useCallback((rfqId: number) => {
    setSelectedRfqId(rfqId);
  }, []);

  const handleSendRfq = useCallback(async () => {
    if (!selectedRfqId) return;
    const result = await sendMutation.mutate(selectedRfqId);
    if (result) {
      refetchDetail();
      refetch();
    }
  }, [selectedRfqId, sendMutation, refetchDetail, refetch]);

  const handleShareWhatsApp = useCallback(() => {
    if (!selectedRfqId || !selectedRfq) return;

    const origin = window.location.origin;
    const link = `${origin}/financeiro/rfqs/${selectedRfqId}`;
    const qty = typeof selectedRfq.quantity_mt === 'number' ? `${formatNumberFixed(selectedRfq.quantity_mt, 0, 'pt-BR')} MT` : '—';
    const rfqNo = selectedRfq.rfq_number || `#${selectedRfqId}`;
    const period = selectedRfq.period || '—';

    const top = (rankedTrades || []).slice(0, 3).map((trade) => {
      const buyLeg = trade.quotes.find(q => q.leg_side === 'buy');
      const sellLeg = trade.quotes.find(q => q.leg_side === 'sell');
      const counterpartyName = buyLeg?.counterparty_name || sellLeg?.counterparty_name || '—';
      const spread = typeof trade.spread === 'number' ? formatNumberFixed(trade.spread, 2, 'pt-BR') : '—';
      return `${trade.rank}º ${counterpartyName} | Spread ${spread}`;
    });

    const lines = [
      `RFQ ${rfqNo}`,
      `Qtd: ${qty} | Período: ${period}`,
      top.length ? 'Top cotações:' : '',
      ...top.map(t => `- ${t}`),
      `Link: ${link}`,
    ].filter(Boolean);

    openWhatsApp(lines.join('\n'));
  }, [selectedRfqId, selectedRfq, rankedTrades]);

  const handleOpenAwardModal = useCallback((quote: RfqQuote) => {
    setSelectedQuoteForAward(quote);
    setAwardReason('');
    setAwardKycMessage(null);
    setShowAwardModal(true);
  }, []);

  const handleConfirmAward = useCallback(async () => {
    if (!selectedRfqId || !selectedQuoteForAward || !awardReason.trim()) return;

    setAwardKycMessage(null);

    // Counterparty KYC is not enforced at this phase.
    // If enabled in the future, we can re-enable the authoritative preflight check.
    if (ENABLE_COUNTERPARTY_KYC) {
      const cpId = selectedQuoteForAward.counterparty_id;
      if (typeof cpId === 'number') {
        setIsAwardKycLoading(true);
        try {
          const preflight = await getCounterpartyKycPreflight(cpId);
          if (!preflight.allowed) {
            setAwardKycMessage(formatCounterpartyKycBlockMessage(preflight.reason_code));
            return;
          }
        } catch {
          setAwardKycMessage('Não foi possível checar KYC da contraparte antes de premiar.');
          return;
        } finally {
          setIsAwardKycLoading(false);
        }
      }
    }
    
    const payload: RfqAwardRequest = {
      quote_id: selectedQuoteForAward.id,
      motivo: awardReason.trim(),
    };
    
    const result = await awardMutation.mutate(selectedRfqId, payload);
    if (result) {
      setShowAwardModal(false);
      setSelectedQuoteForAward(null);
      refetchDetail();
      refetch();
    }
  }, [selectedRfqId, selectedQuoteForAward, awardReason, awardMutation, refetchDetail, refetch, formatCounterpartyKycBlockMessage]);

  // ============================================
  // Check if actions are allowed based on backend status
  // ============================================

  const canSend = selectedRfq && [RfqStatus.DRAFT, RfqStatus.PENDING].includes(selectedRfq.status);
  const canAward = selectedRfq && [RfqStatus.QUOTED, RfqStatus.SENT].includes(selectedRfq.status);
  const isAwarded = selectedRfq?.status === RfqStatus.AWARDED;

  function statusToValueState(status: RfqStatus | string | null | undefined): ValueState {
    const s = String(status || '').toUpperCase();
    if (s === String(RfqStatus.AWARDED)) return ValueState.Success;
    if (s === String(RfqStatus.CANCELLED)) return ValueState.Error;
    if (s === String(RfqStatus.SENT) || s === String(RfqStatus.QUOTED)) return ValueState.Information;
    return ValueState.None;
  }

  // ============================================
  // Master Column - RFQ List
  // ============================================

  const masterContent = (
    <Card style={{ height: '100%' }}>
      <div style={{ padding: '0.75rem' }}>
        <FioriToolbarRow
          style={{ marginBottom: '0.75rem' }}
          leading={
            <>
              <Title level="H5">{UX_COPY.pages.rfqs.title}</Title>
              <Text style={{ opacity: 0.7 }}>({filteredRfqs.length})</Text>
            </>
          }
          trailing={
            <Button design="Emphasized" icon="add" onClick={() => navigate('/financeiro/rfqs/novo')}>
              Nova cotação
            </Button>
          }
        />

        <div style={{ marginBottom: '0.75rem' }}>
          <Label>Buscar</Label>
          <Input
            value={searchTerm}
            onInput={(e) => setSearchTerm(String((e.target as any).value || ''))}
          />
        </div>

        {isLoading ? (
          <div>
            <BusyIndicator active delay={0} />
            <Text style={{ marginTop: '0.5rem', opacity: 0.75 }}>Carregando cotações…</Text>
          </div>
        ) : isError ? (
          <div>
            <MessageStrip design="Negative">Falha ao carregar cotações.</MessageStrip>
            <div style={{ marginTop: '0.5rem' }}>
              <Button design="Transparent" onClick={refetch}>
                Tentar novamente
              </Button>
            </div>
          </div>
        ) : filteredRfqs.length === 0 ? (
          <div>
            <IllustratedMessage name="NoData" titleText="Nenhuma cotação" subtitleText="Registre uma nova cotação para começar." />
            <div style={{ marginTop: '0.75rem' }}>
              <Button design="Emphasized" icon="add" onClick={() => navigate('/financeiro/rfqs/novo')}>
                Nova cotação
              </Button>
            </div>
          </div>
        ) : (
          <List style={{ width: '100%' }}>
            {filteredRfqs.map((rfq) => {
              const desc = [
                rfq.period ? `Período: ${rfq.period}` : null,
                typeof rfq.quantity_mt === 'number' ? `${formatNumber(rfq.quantity_mt, 0)} MT` : null,
                `${rfq.counterparty_quotes?.length || 0} cotações`,
              ]
                .filter(Boolean)
                .join(' • ');

              return (
                <ListItemStandard
                  key={String(rfq.id)}
                  type="Active"
                  selected={selectedRfqId === rfq.id}
                  description={desc}
                  additionalText={formatDate(rfq.created_at)}
                  onClick={() => handleRfqSelect(rfq.id)}
                >
                  {rfq.rfq_number || `Cotação #${rfq.id}`}
                </ListItemStandard>
              );
            })}
          </List>
        )}
      </div>
    </Card>
  );

  // ============================================
  // Detail Column - RFQ Detail
  // ============================================

  const detailContent = selectedRfq ? (
    <div style={{ height: '100%', overflowY: 'auto' }}>
      <div style={{ padding: '1rem' }}>
        <FioriPageHeader
          style={{ marginBottom: '0.75rem' }}
          title={<Title level="H4">Cotação</Title>}
          status={<ObjectStatus state={statusToValueState(selectedRfq.status)}>{String(selectedRfq.status || '—')}</ObjectStatus>}
          actions={
            <>
              {canSend ? (
                <Button design="Emphasized" onClick={handleSendRfq} disabled={sendMutation.isLoading}>
                  {sendMutation.isLoading ? 'Enviando…' : 'Enviar'}
                </Button>
              ) : null}
              <Button design="Transparent" onClick={handleShareWhatsApp}>
                WhatsApp
              </Button>
              <Button design="Transparent" onClick={refetchDetail} disabled={isLoadingDetail}>
                Atualizar
              </Button>
            </>
          }
        />

        <FlexBox direction={FlexBoxDirection.Column} style={{ gap: '0.75rem' }}>
          <Card header={<Title level="H5">Identidade</Title>}>
            <div style={{ padding: '0.75rem' }}>
              <FlexBox direction={FlexBoxDirection.Row} style={{ gap: '0.75rem', flexWrap: 'wrap' }}>
                <Card style={{ minWidth: 220, flex: '1 1 220px' }}>
                  <div style={{ padding: '0.75rem' }}>
                    <Text style={{ opacity: 0.75, fontSize: '0.75rem' }}>Cotação</Text>
                    <Text style={{ fontWeight: 700 }}>#{selectedRfq.id}</Text>
                  </div>
                </Card>
                <Card style={{ minWidth: 220, flex: '1 1 220px' }}>
                  <div style={{ padding: '0.75rem' }}>
                    <Text style={{ opacity: 0.75, fontSize: '0.75rem' }}>Quantidade</Text>
                    <Text style={{ fontWeight: 700 }}>
                      {typeof selectedRfq.quantity_mt === 'number' ? `${formatNumber(selectedRfq.quantity_mt, 0)} MT` : '—'}
                    </Text>
                  </div>
                </Card>
                <Card style={{ minWidth: 220, flex: '1 1 220px' }}>
                  <div style={{ padding: '0.75rem' }}>
                    <Text style={{ opacity: 0.75, fontSize: '0.75rem' }}>Período</Text>
                    <Text style={{ fontWeight: 700 }}>{selectedRfq.period || '—'}</Text>
                  </div>
                </Card>
                <Card style={{ minWidth: 220, flex: '1 1 220px' }}>
                  <div style={{ padding: '0.75rem' }}>
                    <Text style={{ opacity: 0.75, fontSize: '0.75rem' }}>Operação (Deal)</Text>
                    <Text style={{ fontWeight: 700 }}>{selectedRfq.deal_id ? `#${selectedRfq.deal_id}` : '—'}</Text>
                  </div>
                </Card>
                <Card style={{ minWidth: 220, flex: '1 1 220px' }}>
                  <div style={{ padding: '0.75rem' }}>
                    <Text style={{ opacity: 0.75, fontSize: '0.75rem' }}>Propostas</Text>
                    <Text style={{ fontWeight: 700 }}>{String(selectedRfq.counterparty_quotes?.length || 0)}</Text>
                  </div>
                </Card>
              </FlexBox>
            </div>
          </Card>

          <Card header={<Title level="H5">Resumo (derivado das propostas carregadas)</Title>}>
            <div style={{ padding: '0.75rem' }}>
              <FlexBox direction={FlexBoxDirection.Row} style={{ gap: '0.75rem', flexWrap: 'wrap' }}>
                <Card style={{ minWidth: 240, flex: '1 1 240px' }}>
                  <div style={{ padding: '0.75rem' }}>
                    <Text style={{ opacity: 0.75, fontSize: '0.75rem' }}>Melhor proposta (rank 1)</Text>
                    <Title level="H5">{formatNumber(decisionSummary?.bestSpread, 2)}</Title>
                    <Text style={{ opacity: 0.75, fontSize: '0.8125rem' }}>Contraparte: {decisionSummary?.bestCounterparty || '—'}</Text>
                  </div>
                </Card>

                <Card style={{ minWidth: 240, flex: '1 1 240px' }}>
                  <div style={{ padding: '0.75rem' }}>
                    <Text style={{ opacity: 0.75, fontSize: '0.75rem' }}>Proposta selecionada</Text>
                    <Title level="H5">{formatNumber(decisionSummary?.selectedSpread, 2)}</Title>
                    <Text style={{ opacity: 0.75, fontSize: '0.8125rem' }}>
                      Contraparte: {decisionSummary?.selectedCounterparty || '—'}
                    </Text>
                  </div>
                </Card>

                <Card style={{ minWidth: 240, flex: '1 1 240px' }}>
                  <div style={{ padding: '0.75rem' }}>
                    <Text style={{ opacity: 0.75, fontSize: '0.75rem' }}>Diferença vs melhor</Text>
                    <Title level="H5">{formatNumber(decisionSummary?.spreadDelta, 2)}</Title>
                    <Text style={{ opacity: 0.75, fontSize: '0.8125rem' }}>Referência: melhor proposta (rank 1)</Text>
                  </div>
                </Card>

                <Card style={{ minWidth: 240, flex: '1 1 240px' }}>
                  <div style={{ padding: '0.75rem' }}>
                    <Text style={{ opacity: 0.75, fontSize: '0.75rem' }}>Impacto estimado vs melhor</Text>
                    <Title level="H5">{formatNumber(decisionSummary?.impactVsBest, 2)}</Title>
                    <Text style={{ opacity: 0.75, fontSize: '0.8125rem' }}>Base: diferença × quantidade (MT)</Text>
                  </div>
                </Card>
              </FlexBox>
            </div>
          </Card>

        {/* Referência a Contratos (discreta, quando aplicável) */}
          {selectedRfqId ? (
            <Card header={<Title level="H5">Referência a Contratos</Title>}>
              <div style={{ padding: '0.75rem' }}>
                <Text style={{ opacity: 0.75, fontSize: '0.8125rem' }}>
                  Informação para rastreabilidade. Detalhes e ciclo de vida são tratados na página de Contratos.
                </Text>
                <div style={{ marginTop: '0.75rem' }}>
                  {isLoadingContracts ? (
                    <div>
                      <BusyIndicator active delay={0} />
                      <Text style={{ marginTop: '0.5rem', opacity: 0.75 }}>Verificando vínculos…</Text>
                    </div>
                  ) : rfqContracts.length > 0 ? (
                    <FlexBox direction={FlexBoxDirection.Row} justifyContent="SpaceBetween" style={{ gap: '0.75rem', alignItems: 'center' }}>
                      <Text>Existe contrato associado a esta cotação.</Text>
                      <Link to={`/financeiro/contratos?rfq_id=${encodeURIComponent(String(selectedRfqId))}`}>Abrir Contratos</Link>
                    </FlexBox>
                  ) : (
                    <Text style={{ opacity: 0.75 }}>Nenhum contrato associado.</Text>
                  )}
                </div>
              </div>
            </Card>
          ) : null}

        {/* Quote Entry Form (collapsible) */}
          {!isAwarded ? (
            <div>
              <Button design="Transparent" icon="add" onClick={() => setShowQuoteForm((v) => !v)}>
                {showQuoteForm ? 'Ocultar formulário' : 'Adicionar cotação'}
              </Button>

              {showQuoteForm && selectedRfqId ? (
                <div style={{ marginTop: '0.75rem' }}>
                  <QuoteEntryForm
                    rfqId={selectedRfqId}
                    counterparties={counterparties}
                    onSuccess={() => {
                      refetchDetail();
                      refetch();
                    }}
                  />
                </div>
              ) : null}
            </div>
          ) : null}

        {/* Ranking de Cotações — núcleo decisório */}
          {selectedRfq.counterparty_quotes?.length ? (
            <RfqDecisionRankingTable
              trades={rankedTrades}
              winnerQuoteId={selectedRfq.winner_quote_id}
              canSelect={canAward}
              isSelectionDisabled={isAwarded}
              onSelect={(quote) => handleOpenAwardModal(quote)}
            />
          ) : (
            <Card header={<Title level="H5">Ranking de Cotações</Title>}>
              <div style={{ padding: '0.75rem' }}>
                <Text style={{ opacity: 0.75 }}>Nenhuma proposta recebida até o momento.</Text>
              </div>
            </Card>
          )}

          <Card
            header={
              <FlexBox direction={FlexBoxDirection.Row} justifyContent="SpaceBetween" style={{ width: '100%' }}>
                <Title level="H5">Histórico (Registro e Auditoria)</Title>
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
                  <Text style={{ marginTop: '0.5rem', opacity: 0.75 }}>Carregando histórico…</Text>
                </div>
              ) : timelineIsError ? (
                <MessageStrip design="Negative">Falha ao carregar histórico.</MessageStrip>
              ) : timelineEvents.length === 0 ? (
                <IllustratedMessage name="NoData" titleText="Sem eventos" subtitleText="Não há eventos para esta RFQ." />
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
      <IllustratedMessage name="NoData" titleText="Selecione uma cotação" subtitleText="Escolha uma cotação na lista para ver os detalhes." />
    </div>
  );

  // ============================================
  // Award Modal
  // ============================================

  return (
    <>
      <FlexBox direction={FlexBoxDirection.Row} style={{ height: '100%', gap: '0.75rem', padding: '0.75rem' }}>
        <div style={{ width: 360, flex: '0 0 360px', minWidth: 320 }}>{masterContent}</div>
        <div style={{ flex: '1 1 auto', minWidth: 0 }}>{detailContent}</div>
      </FlexBox>

      <Dialog
        open={showAwardModal && !!selectedQuoteForAward}
        headerText="Confirmar decisão"
        onClose={() => setShowAwardModal(false)}
        footer={
          <Bar
            endContent={
              <FlexBox direction={FlexBoxDirection.Row} style={{ gap: '0.5rem' }}>
                <Button design="Transparent" onClick={() => setShowAwardModal(false)}>
                  Cancelar
                </Button>
                <Button
                  design="Emphasized"
                  onClick={handleConfirmAward}
                  disabled={!awardReason.trim() || awardMutation.isLoading || isAwardKycLoading}
                >
                  {isAwardKycLoading
                    ? 'Validando contraparte…'
                    : awardMutation.isLoading
                      ? 'Processando…'
                      : 'Confirmar decisão'}
                </Button>
              </FlexBox>
            }
          />
        }
      >
        <div style={{ padding: '1rem' }}>
          {selectedQuoteForAward ? (
            <FlexBox direction={FlexBoxDirection.Column} style={{ gap: '0.75rem' }}>
              <Text>
                Você está prestes a selecionar a cotação de <Text style={{ fontWeight: 700 }}>{selectedQuoteForAward.counterparty_name}</Text>.
              </Text>
              <Text style={{ opacity: 0.75 }}>
                Preço: <Text style={{ fontWeight: 700 }}>{formatNumber(selectedQuoteForAward.quote_price ?? null, 2)}</Text>
              </Text>

              <div>
                <Label>Justificativa da decisão *</Label>
                <TextArea
                  value={awardReason}
                  onInput={(e) => setAwardReason(String((e.target as any).value || ''))}
                  rows={4}
                />
              </div>

              {awardKycMessage ? <MessageStrip design="Warning">{awardKycMessage}</MessageStrip> : null}

              {awardMutation.isError && !awardKycMessage ? (
                <div>
                  {(() => {
                    const approval = parseApprovalRequired(awardMutation.error);
                    if (approval) {
                      const requestId = approval.workflow_request_id;
                      const href = `/financeiro/aprovacoes?request_id=${encodeURIComponent(String(requestId))}`;
                      return (
                        <MessageStrip design="Information">
                          Esta decisão requer aprovação institucional. Solicitação nº{' '}
                          <Link to={href}>{String(requestId)}</Link>
                          <div style={{ marginTop: '0.5rem' }}>
                            <Button design="Transparent" onClick={() => navigate(href)}>
                              Abrir Aprovações
                            </Button>
                          </div>
                        </MessageStrip>
                      );
                    }

                    const gate = parseKycGateError(awardMutation.error);
                    if (gate) {
                      return <MessageStrip design="Warning">Não foi possível validar o cliente do SO (KYC pendente ou restrito).</MessageStrip>;
                    }

                    return <MessageStrip design="Negative">{UX_COPY.errors.title}</MessageStrip>;
                  })()}
                </div>
              ) : null}
            </FlexBox>
          ) : null}
        </div>
      </Dialog>
    </>
  );
}

export default RFQsPageIntegrated;
