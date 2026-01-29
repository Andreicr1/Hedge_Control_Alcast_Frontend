/** RFQs Page */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useRfqs, useRfqDetail, useAwardQuote, useSendRfq, useContractsByRfq } from '../../hooks';
import { useCounterparties } from '../../hooks/useCounterparties';
import { ApiError, KycGateErrorDetail, Rfq, RfqQuote, RfqStatus, RfqAwardRequest } from '../../types';
import { groupQuotesByTrade, rankTradesBySpread } from '../../services/rfqs.service';
import { getCounterpartyKycPreflight } from '../../services/counterparties.service';
import { FioriButton } from '../components/fiori/FioriButton';
import { FioriFlexibleColumnLayout } from '../components/fiori/FioriFlexibleColumnLayout';
import { FioriTile } from '../components/fiori/FioriTile';
import { FioriModal } from '../components/fiori/FioriModal';
import { LoadingState, ErrorState, EmptyState } from '../components/ui';
import { QuoteEntryForm } from '../components/rfq/QuoteEntryForm';
import { TimelinePanel } from '../components/timeline/TimelinePanel';
import { RfqDecisionRankingTable } from '../components/rfq/RfqDecisionRankingTable';
import { 
  Search, 
  FileText, 
  Users, 
  Calendar, 
  Plus,
  MessageCircle,
  Send,
  RefreshCw,
  PlusCircle,
} from 'lucide-react';
import { UX_COPY } from '../ux/copy';

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

function formatNumber(value: number | null | undefined, opts?: Intl.NumberFormatOptions): string {
  if (typeof value !== 'number' || !Number.isFinite(value)) return '—';
  return value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2, ...opts });
}

function formatImpact(value: number | null | undefined): string {
  if (typeof value !== 'number' || !Number.isFinite(value)) return '—';
  const sign = value > 0 ? '+' : value < 0 ? '−' : '';
  const abs = Math.abs(value);
  return `${sign}${abs.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
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
    const qty = typeof selectedRfq.quantity_mt === 'number' ? `${selectedRfq.quantity_mt.toLocaleString('pt-BR')} MT` : '—';
    const rfqNo = selectedRfq.rfq_number || `#${selectedRfqId}`;
    const period = selectedRfq.period || '—';

    const top = (rankedTrades || []).slice(0, 3).map((trade) => {
      const buyLeg = trade.quotes.find(q => q.leg_side === 'buy');
      const sellLeg = trade.quotes.find(q => q.leg_side === 'sell');
      const counterpartyName = buyLeg?.counterparty_name || sellLeg?.counterparty_name || '—';
      const spread = trade.spread?.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '—';
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

  // ============================================
  // Master Column - RFQ List
  // ============================================

  const masterContent = (
    <>
      {/* Header */}
      <div className="border-b border-[var(--sapList_HeaderBorderColor)] p-4 bg-[var(--sapList_HeaderBackground)]">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-['72:Bold',sans-serif] text-base text-[var(--sapList_HeaderTextColor)]">
            {UX_COPY.pages.rfqs.title} ({filteredRfqs.length})
          </h2>
          <FioriButton 
            variant="emphasized" 
            icon={<Plus className="w-4 h-4" />}
            onClick={() => navigate('/financeiro/rfqs/novo')}
          >
            Nova cotação
          </FioriButton>
        </div>
        
        {/* Search */}
        <div className="space-y-2">
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por período ou número..."
              className="w-full h-8 px-3 pr-8 text-sm bg-[var(--sapField_Background)] border border-[var(--sapField_BorderColor)] rounded outline-none focus:border-[var(--sapField_Focus_BorderColor)]"
            />
            <Search className="w-4 h-4 absolute right-2 top-2 text-[var(--sapContent_IconColor)]" />
          </div>
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <LoadingState message="Carregando cotações..." />
        ) : isError ? (
          <ErrorState error={error} onRetry={refetch} />
        ) : filteredRfqs.length === 0 ? (
          <EmptyState 
            title="Nenhuma cotação encontrada"
            description="Inicie uma nova cotação para começar."
            onAction={() => navigate('/financeiro/rfqs/novo')}
            actionLabel="Nova cotação"
          />
        ) : (
          filteredRfqs.map((rfq) => (
            <button
              key={rfq.id}
              onClick={() => handleRfqSelect(rfq.id)}
              className={`w-full p-4 border-b border-[var(--sapList_BorderColor)] text-left hover:bg-[var(--sapList_HoverBackground)] transition-colors ${
                selectedRfqId === rfq.id
                  ? 'bg-[var(--sapList_SelectionBackgroundColor)] border-l-2 border-l-[var(--sapList_SelectionBorderColor)]'
                  : ''
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="font-['72:Bold',sans-serif] text-sm text-[#0064d9]">Cotação nº {rfq.id}</div>
              </div>
              <div className="text-xs text-[var(--sapContent_LabelColor)] mb-1">
                Período: {rfq.period}
              </div>
              <div className="text-xs text-[var(--sapContent_LabelColor)] mb-2">
                {rfq.quantity_mt.toLocaleString('pt-BR')} MT
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-[var(--sapContent_LabelColor)]">
                  {rfq.counterparty_quotes?.length || 0} cotações
                </span>
                <span className="text-xs text-[var(--sapContent_LabelColor)]">
                  {new Date(rfq.created_at).toLocaleDateString('pt-BR')}
                </span>
              </div>
            </button>
          ))
        )}
      </div>
    </>
  );

  // ============================================
  // Detail Column - RFQ Detail
  // ============================================

  const detailContent = selectedRfq ? (
    <div className="h-full overflow-y-auto">
      <div className="p-4 space-y-4">
        {/* Header — Identidade + Resumo Econômico */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          {/* Bloco A — Identidade */}
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h1 className="font-['72:Black',sans-serif] text-2xl text-[#0064d9] m-0">
                  Cotação nº {selectedRfq.id}
                </h1>
                <div className="text-xs text-[var(--sapContent_LabelColor)] mt-1">
                  Identificadores operacionais para decisão de hedge.
                </div>
              </div>
              <div className="flex gap-2">
                {canSend && (
                  <FioriButton variant="emphasized" onClick={handleSendRfq} disabled={sendMutation.isLoading}>
                    <Send className="w-4 h-4 mr-1" />
                    {sendMutation.isLoading ? 'Enviando...' : 'Enviar'}
                  </FioriButton>
                )}
                <FioriButton variant="ghost" icon={<MessageCircle className="w-4 h-4" />} onClick={handleShareWhatsApp}>
                  WhatsApp
                </FioriButton>
                <FioriButton variant="ghost" icon={<RefreshCw className="w-4 h-4" />} onClick={refetchDetail}>
                  Atualizar
                </FioriButton>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
              <FioriTile
                title="Quantidade"
                value={`${selectedRfq.quantity_mt.toLocaleString('pt-BR')} MT`}
                icon={<FileText className="w-4 h-4" />}
              />
              <FioriTile title="Período" value={selectedRfq.period} icon={<Calendar className="w-4 h-4" />} />
              <FioriTile
                title="Propostas"
                value={`${selectedRfq.counterparty_quotes?.length || 0}`}
                valueColor={selectedRfq.counterparty_quotes?.length ? 'positive' : 'neutral'}
                icon={<Users className="w-4 h-4" />}
              />
              <FioriTile
                title="Operação"
                value={selectedRfq.deal_id?.toString() || '—'}
                icon={<FileText className="w-4 h-4" />}
              />
            </div>
          </div>

          {/* Bloco B — Resumo Econômico */}
          <div className="bg-white rounded-lg shadow-sm p-4">
            <h2 className="font-['72:Bold',sans-serif] text-base text-[#131e29] m-0">
              Resumo Econômico
            </h2>
            <div className="text-xs text-[var(--sapContent_LabelColor)] mt-1">
              Destaques para leitura executiva e decisão.
            </div>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="p-3 rounded border border-[var(--sapGroup_ContentBorderColor)] bg-[var(--sapGroup_ContentBackground)]">
                <div className="text-xs text-[var(--sapContent_LabelColor)]">Melhor proposta (rank 1)</div>
                <div className="mt-1 font-['72:Bold',sans-serif] text-sm text-[#131e29]">
                  Diferença: {formatNumber(decisionSummary?.bestSpread)}
                </div>
                <div className="text-xs text-[var(--sapContent_LabelColor)] mt-1">
                  Contraparte: {decisionSummary?.bestCounterparty || '—'}
                </div>
              </div>

              <div className="p-3 rounded border border-[var(--sapGroup_ContentBorderColor)] bg-[var(--sapGroup_ContentBackground)]">
                <div className="text-xs text-[var(--sapContent_LabelColor)]">Proposta selecionada</div>
                <div className="mt-1 font-['72:Bold',sans-serif] text-sm text-[#131e29]">
                  Diferença: {formatNumber(decisionSummary?.selectedSpread)}
                </div>
                <div className="text-xs text-[var(--sapContent_LabelColor)] mt-1">
                  Contraparte: {decisionSummary?.selectedCounterparty || '—'}
                </div>
              </div>

              <div className="p-3 rounded border border-[var(--sapGroup_ContentBorderColor)] bg-white">
                <div className="text-xs text-[var(--sapContent_LabelColor)]">Diferença vs melhor proposta</div>
                <div className="mt-1 font-['72:Bold',sans-serif] text-sm text-[#131e29] tabular-nums">
                  {formatImpact(decisionSummary?.spreadDelta)}
                </div>
                <div className="text-xs text-[var(--sapContent_LabelColor)] mt-1">
                  Referência: melhor proposta (rank 1)
                </div>
              </div>

              <div className="p-3 rounded border border-[var(--sapGroup_ContentBorderColor)] bg-white">
                <div className="text-xs text-[var(--sapContent_LabelColor)]">Impacto estimado vs melhor</div>
                <div className="mt-1 font-['72:Bold',sans-serif] text-sm text-[#131e29] tabular-nums">
                  {formatImpact(decisionSummary?.impactVsBest)}
                </div>
                <div className="text-xs text-[var(--sapContent_LabelColor)] mt-1">
                  Base: diferença × quantidade (MT)
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Referência a Contratos (discreta, quando aplicável) */}
        {selectedRfqId && (
          <div className="bg-white rounded-lg shadow-sm p-4">
            <h3 className="font-['72:Bold',sans-serif] text-base text-[#131e29] m-0">
              Referência a Contratos
            </h3>
            <div className="text-xs text-[var(--sapContent_LabelColor)] mt-1">
              Informação para rastreabilidade. Detalhes e ciclo de vida são tratados na página de Contratos.
            </div>

            <div className="mt-3">
              {isLoadingContracts ? (
                <div className="text-sm text-[var(--sapContent_LabelColor)]">Verificando vínculos...</div>
              ) : rfqContracts.length > 0 ? (
                <div className="flex items-center justify-between gap-3">
                  <div className="text-sm text-[#131e29]">
                    Existe contrato associado a esta cotação.
                  </div>
                  <Link
                    to={`/financeiro/contratos?rfq_id=${encodeURIComponent(String(selectedRfqId))}`}
                    className="text-sm text-[#0064d9] no-underline hover:underline"
                  >
                    Abrir Contratos
                  </Link>
                </div>
              ) : (
                <div className="text-sm text-[var(--sapContent_LabelColor)]">Nenhum contrato associado.</div>
              )}
            </div>
          </div>
        )}

        {/* Quote Entry Form (collapsible) */}
        {!isAwarded && (
          <div>
            <FioriButton
              variant="ghost"
              icon={<PlusCircle className="w-4 h-4" />}
              onClick={() => setShowQuoteForm(!showQuoteForm)}
              className="mb-2"
            >
              {showQuoteForm ? 'Ocultar Formulário' : 'Adicionar Cotação'}
            </FioriButton>
            
            {showQuoteForm && selectedRfqId && (
              <QuoteEntryForm
                rfqId={selectedRfqId}
                counterparties={counterparties}
                onSuccess={() => {
                  refetchDetail();
                  refetch();
                }}
              />
            )}
          </div>
        )}

        {/* Ranking de Cotações — núcleo decisório */}
        {selectedRfq.counterparty_quotes?.length > 0 ? (
          <RfqDecisionRankingTable
            trades={rankedTrades}
            winnerQuoteId={selectedRfq.winner_quote_id}
            canSelect={canAward}
            isSelectionDisabled={isAwarded}
            onSelect={(quote) => handleOpenAwardModal(quote)}
          />
        ) : (
          <div className="bg-white rounded-lg shadow-sm p-4">
            <h3 className="font-['72:Bold',sans-serif] text-base text-[#131e29] m-0">Ranking de Cotações</h3>
            <div className="text-sm text-[var(--sapContent_LabelColor)] mt-2">
              Nenhuma proposta recebida até o momento.
            </div>
          </div>
        )}

        <TimelinePanel
          title="Histórico (Registro e Auditoria)"
          subjectType="rfq"
          subjectId={selectedRfq.id}
          variant="audit"
        />
      </div>
    </div>
  ) : isLoadingDetail ? (
    <LoadingState message="Carregando detalhes..." fullPage />
  ) : (
    <EmptyState
      title="Selecione uma cotação"
      description="Escolha uma cotação da lista para ver os detalhes."
      icon={<FileText className="w-8 h-8 text-[var(--sapContent_IconColor)]" />}
      fullPage
    />
  );

  // ============================================
  // Award Modal
  // ============================================

  return (
    <>
      <FioriFlexibleColumnLayout
        masterTitle={UX_COPY.pages.rfqs.title}
        masterContent={masterContent}
        masterWidth={340}
        detailContent={detailContent}
      />

      {/* Award Confirmation Modal */}
      {showAwardModal && selectedQuoteForAward && (
        <FioriModal
          open={showAwardModal}
          title="Confirmar decisão"
          onClose={() => setShowAwardModal(false)}
          footer={
            <div className="flex gap-2 justify-end">
              <FioriButton variant="default" onClick={() => setShowAwardModal(false)}>
                Cancelar
              </FioriButton>
              <FioriButton 
                variant="emphasized" 
                onClick={handleConfirmAward}
                disabled={!awardReason.trim() || awardMutation.isLoading || isAwardKycLoading}
              >
                {isAwardKycLoading
                  ? 'Validando contraparte...'
                  : awardMutation.isLoading
                    ? 'Processando...'
                    : 'Confirmar decisão'}
              </FioriButton>
            </div>
          }
        >
          <div className="space-y-4">
            <p className="text-sm">
              Você está prestes a selecionar a cotação de <strong>{selectedQuoteForAward.counterparty_name}</strong>.
            </p>
            <p className="text-sm text-[var(--sapContent_LabelColor)]">
              Preço: <strong>{selectedQuoteForAward.quote_price?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</strong>
            </p>
            <div>
              <label className="block text-sm font-['72:Bold',sans-serif] mb-1">
                Justificativa da decisão *
              </label>
              <textarea
                value={awardReason}
                onChange={(e) => setAwardReason(e.target.value)}
                placeholder="Descreva a justificativa (obrigatório)"
                className="w-full h-24 px-3 py-2 text-sm bg-[var(--sapField_Background)] border border-[var(--sapField_BorderColor)] rounded outline-none focus:border-[var(--sapField_Focus_BorderColor)]"
              />
            </div>
            {awardKycMessage && (
              <p className="text-sm text-[var(--sapNegativeColor)]">
                {awardKycMessage}
              </p>
            )}
            {awardMutation.isError && !awardKycMessage && (
              <div className="space-y-2">
                {(() => {
                  const approval = parseApprovalRequired(awardMutation.error);
                  if (approval) {
                    const requestId = approval.workflow_request_id;
                    const href = `/financeiro/aprovacoes?request_id=${encodeURIComponent(String(requestId))}`;

                    return (
                      <div className="p-3 rounded border border-[var(--sapNegativeBorderColor,var(--sapField_BorderColor))] bg-[var(--sapNegativeBackgroundColor,#fff3f3)]">
                        <div className="text-sm text-[var(--sapNegativeColor)] font-['72:Bold',sans-serif]">
                          Esta decisão requer aprovação institucional.
                        </div>
                        <div className="text-xs text-[var(--sapContent_LabelColor)] mt-1">
                          Solicitação nº <Link to={href} className="text-[#0064d9] no-underline">{requestId}</Link>
                        </div>
                        <div className="mt-2 flex items-center gap-2">
                          <FioriButton
                            variant="default"
                            onClick={() => navigate(href)}
                          >
                            Abrir Aprovações
                          </FioriButton>
                        </div>
                      </div>
                    );
                  }

                  const gate = parseKycGateError(awardMutation.error);
                  if (gate) {
                    return (
                      <p className="text-sm text-[var(--sapNegativeColor)]">
                        Não foi possível validar o cliente do SO (KYC pendente ou restrito).
                      </p>
                    );
                  }

                  return (
                    <p className="text-sm text-[var(--sapNegativeColor)]">
                      {UX_COPY.errors.title}
                    </p>
                  );
                })()}
              </div>
            )}
          </div>
        </FioriModal>
      )}
    </>
  );
}

export default RFQsPageIntegrated;
