/**
 * RFQs Page - Versão Integrada com Backend
 * 
 * Esta página consome dados reais da API via hooks.
 * NENHUMA lógica de negócio - apenas orquestração e apresentação.
 * 
 * Fluxo Backend:
 * - RFQ → criada a partir de SalesOrder
 * - RFQ → recebe quotes de counterparties
 * - RFQ.award() → cria automaticamente Contract(s)
 */

import { useState, useMemo, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useRfqs, useRfqDetail, useAwardQuote, useSendRfq } from '../../hooks';
import { useCounterparties } from '../../hooks/useCounterparties';
import { useContracts } from '../../hooks/useContracts';
import { ApiError, KycGateErrorDetail, Rfq, RfqQuote, RfqStatus, RfqAwardRequest } from '../../types';
import { groupQuotesByTrade, rankTradesBySpread } from '../../services/rfqs.service';
import { getCounterpartyKycPreflight } from '../../services/counterparties.service';
import { FioriObjectStatus, mapStatusToType } from '../components/fiori/FioriObjectStatus';
import { FioriButton } from '../components/fiori/FioriButton';
import { FioriFlexibleColumnLayout } from '../components/fiori/FioriFlexibleColumnLayout';
import { FioriTile } from '../components/fiori/FioriTile';
import { FioriModal } from '../components/fiori/FioriModal';
import { FioriInput } from '../components/fiori/FioriInput';
import { LoadingState, ErrorState, EmptyState } from '../components/ui';
import { QuoteEntryForm } from '../components/rfq/QuoteEntryForm';
import { AwardedContractInfo } from '../components/rfq/AwardedContractInfo';
import { TimelinePanel } from '../components/timeline/TimelinePanel';
import { 
  Download, 
  Search, 
  FileText, 
  Users, 
  Calendar, 
  Plus,
  Trophy,
  Send,
  RefreshCw,
  PlusCircle,
} from 'lucide-react';
import { UX_COPY } from '../ux/copy';

// ============================================
// Status Helpers - Baseado nos enums do backend
// ============================================

function getStatusType(status: RfqStatus): 'success' | 'error' | 'neutral' | 'information' | 'warning' {
  switch (status) {
    case RfqStatus.AWARDED:
      return 'success';
    case RfqStatus.FAILED:
    case RfqStatus.EXPIRED:
      return 'error';
    case RfqStatus.QUOTED:
      return 'information';
    case RfqStatus.SENT:
    case RfqStatus.PENDING:
      return 'neutral';
    default:
      return 'neutral';
  }
}

function getStatusLabel(status: RfqStatus): string {
  const labels: Record<RfqStatus, string> = {
    [RfqStatus.DRAFT]: 'Rascunho',
    [RfqStatus.PENDING]: 'Pendente',
    [RfqStatus.SENT]: 'Enviada',
    [RfqStatus.QUOTED]: 'Cotada',
    [RfqStatus.AWARDED]: 'Premiada',
    [RfqStatus.EXPIRED]: 'Expirada',
    [RfqStatus.FAILED]: 'Falhou',
  };
  return labels[status] || status;
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
  
  // API State via hooks
  const { rfqs, isLoading, isError, error, refetch } = useRfqs();
  const { counterparties } = useCounterparties();
  const { contracts } = useContracts();
  
  // Local UI state
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<RfqStatus | 'all'>('all');
  const [selectedRfqId, setSelectedRfqId] = useState<number | null>(null);
  const [showQuoteForm, setShowQuoteForm] = useState(false);
  
  // Selected RFQ detail
  const { rfq: selectedRfq, isLoading: isLoadingDetail, refetch: refetchDetail } = useRfqDetail(selectedRfqId);
  
  // Mutations
  const awardMutation = useAwardQuote();
  const sendMutation = useSendRfq();
  
  // Modal states
  const [showAwardModal, setShowAwardModal] = useState(false);
  const [selectedQuoteForAward, setSelectedQuoteForAward] = useState<RfqQuote | null>(null);
  const [awardReason, setAwardReason] = useState('');
  const [awardKycMessage, setAwardKycMessage] = useState<string | null>(null);
  const [isAwardKycLoading, setIsAwardKycLoading] = useState(false);

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
      const matchesStatus = statusFilter === 'all' || rfq.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [rfqs, searchTerm, statusFilter]);

  // Group quotes by trade and rank them
  const rankedTrades = useMemo(() => {
    if (!selectedRfq?.counterparty_quotes) return [];
    const grouped = groupQuotesByTrade(selectedRfq.counterparty_quotes);
    return rankTradesBySpread(grouped);
  }, [selectedRfq]);

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

  const handleOpenAwardModal = useCallback((quote: RfqQuote) => {
    setSelectedQuoteForAward(quote);
    setAwardReason('');
    setAwardKycMessage(null);
    setShowAwardModal(true);
  }, []);

  const handleConfirmAward = useCallback(async () => {
    if (!selectedRfqId || !selectedQuoteForAward || !awardReason.trim()) return;

    setAwardKycMessage(null);

    // Read-only KYC preflight (authoritative backend)
    const cpId = selectedQuoteForAward.counterparty_id;
    if (typeof cpId === 'number') {
      setIsAwardKycLoading(true);
      try {
        const preflight = await getCounterpartyKycPreflight(cpId);
        if (!preflight.allowed) {
          setAwardKycMessage(`KYC bloqueado: ${preflight.reason_code}`);
          return;
        }
      } catch {
        setAwardKycMessage('Não foi possível checar KYC da contraparte antes de premiar.');
        return;
      } finally {
        setIsAwardKycLoading(false);
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
  }, [selectedRfqId, selectedQuoteForAward, awardReason, awardMutation, refetchDetail, refetch]);

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
          
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as RfqStatus | 'all')}
            className="w-full h-8 px-2 text-sm bg-[var(--sapField_Background)] border border-[var(--sapField_BorderColor)] rounded outline-none"
          >
            <option value="all">Todos os status</option>
            {Object.values(RfqStatus).map((status) => (
              <option key={status} value={status}>
                {getStatusLabel(status)}
              </option>
            ))}
          </select>
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
                <div className="font-['72:Bold',sans-serif] text-sm text-[#0064d9]">
                  Cotação nº {rfq.id}
                </div>
                <FioriObjectStatus status={getStatusType(rfq.status)}>
                  {getStatusLabel(rfq.status)}
                </FioriObjectStatus>
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
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <h1 className="font-['72:Black',sans-serif] text-2xl text-[#0064d9] m-0">
              Cotação nº {selectedRfq.id}
            </h1>
            <FioriObjectStatus status={getStatusType(selectedRfq.status)}>
              {getStatusLabel(selectedRfq.status)}
            </FioriObjectStatus>
          </div>
          <div className="flex gap-2">
            {canSend && (
              <FioriButton 
                variant="emphasized"
                onClick={handleSendRfq}
                disabled={sendMutation.isLoading}
              >
                <Send className="w-4 h-4 mr-1" />
                {sendMutation.isLoading ? 'Enviando...' : 'Enviar'}
              </FioriButton>
            )}
            <FioriButton variant="ghost" icon={<RefreshCw className="w-4 h-4" />} onClick={refetchDetail}>
              Atualizar
            </FioriButton>
          </div>
        </div>

        {/* KPI Tiles */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <FioriTile
            title="Quantidade"
            value={`${selectedRfq.quantity_mt.toLocaleString('pt-BR')} MT`}
            icon={<FileText className="w-4 h-4" />}
          />
          <FioriTile
            title="Período"
            value={selectedRfq.period}
            icon={<Calendar className="w-4 h-4" />}
          />
          <FioriTile
            title="Cotações"
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

        {/* Winner Info (if awarded) */}
        {isAwarded && selectedRfq.winner_quote_id && (
          <div className="bg-[var(--sapSuccessBackground,#f1fdf6)] border border-[var(--sapSuccessBorderColor,#107e3e)] rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Trophy className="w-5 h-5 text-[var(--sapPositiveColor,#107e3e)]" />
              <h3 className="font-['72:Bold',sans-serif] text-base text-[var(--sapPositiveTextColor,#107e3e)]">
                Cotação selecionada
              </h3>
            </div>
            <p className="text-sm text-[var(--sapContent_LabelColor)]">
              Cotação vencedora: #{selectedRfq.winner_quote_id}
              {selectedRfq.winner_rank && ` (Classificação: ${selectedRfq.winner_rank}º)`}
            </p>
            {selectedRfq.decision_reason && (
              <p className="text-sm text-[var(--sapContent_LabelColor)] mt-1">
                Motivo: {selectedRfq.decision_reason}
              </p>
            )}
          </div>
        )}

        {/* Contracts Created (after award) */}
        {isAwarded && selectedRfqId && contracts.length > 0 && (
          <AwardedContractInfo
            contracts={contracts}
            rfqId={selectedRfqId}
          />
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

        {/* Ranking de Cotações */}
        {rankedTrades.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm p-4">
            <h3 className="font-['72:Bold',sans-serif] text-base text-[#131e29] mb-4">
              Ranking de Cotações
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[var(--sapList_HeaderBorderColor)]">
                    <th className="text-left p-2 font-['72:Bold',sans-serif] text-[var(--sapList_HeaderTextColor)]">Rank</th>
                    <th className="text-left p-2 font-['72:Bold',sans-serif] text-[var(--sapList_HeaderTextColor)]">Contraparte</th>
                    <th className="text-right p-2 font-['72:Bold',sans-serif] text-[var(--sapList_HeaderTextColor)]">Compra</th>
                    <th className="text-right p-2 font-['72:Bold',sans-serif] text-[var(--sapList_HeaderTextColor)]">Venda</th>
                    <th className="text-right p-2 font-['72:Bold',sans-serif] text-[var(--sapList_HeaderTextColor)]">Diferença</th>
                    {canAward && <th className="text-center p-2">Ação</th>}
                  </tr>
                </thead>
                <tbody>
                  {rankedTrades.map((trade) => {
                    const buyLeg = trade.quotes.find(q => q.leg_side === 'buy');
                    const sellLeg = trade.quotes.find(q => q.leg_side === 'sell');
                    const counterpartyName = buyLeg?.counterparty_name || sellLeg?.counterparty_name || '—';
                    const isWinner = selectedRfq.winner_quote_id && trade.quotes.some(q => q.id === selectedRfq.winner_quote_id);
                    
                    return (
                      <tr 
                        key={trade.groupId} 
                        className={`border-b border-[var(--sapList_BorderColor)] hover:bg-[var(--sapList_HoverBackground)] ${
                          isWinner ? 'bg-[var(--sapSuccessBackground,#f1fdf6)]' : ''
                        }`}
                      >
                        <td className="p-2">
                          <span className={`font-['72:Bold',sans-serif] ${trade.rank === 1 ? 'text-[var(--sapPositiveColor)]' : ''}`}>
                            {trade.rank}º
                          </span>
                          {isWinner && <Trophy className="w-4 h-4 inline ml-1 text-[var(--sapPositiveColor)]" />}
                        </td>
                        <td className="p-2">{counterpartyName}</td>
                        <td className="p-2 text-right font-['72:Regular',sans-serif]">
                          {buyLeg?.quote_price?.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) || '—'}
                        </td>
                        <td className="p-2 text-right font-['72:Regular',sans-serif]">
                          {sellLeg?.quote_price?.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) || '—'}
                        </td>
                        <td className={`p-2 text-right font-['72:Bold',sans-serif] ${
                          trade.spread !== null && trade.spread < 0 ? 'text-[var(--sapPositiveColor)]' : ''
                        }`}>
                          {trade.spread?.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) || '—'}
                        </td>
                        {canAward && (
                          <td className="p-2 text-center">
                            <FioriButton
                              variant="default"
                              onClick={() => buyLeg && handleOpenAwardModal(buyLeg)}
                              disabled={isAwarded}
                            >
                              Selecionar
                            </FioriButton>
                          </td>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Individual Quotes (if no trades grouped) */}
        {rankedTrades.length === 0 && selectedRfq.counterparty_quotes?.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm p-4">
            <h3 className="font-['72:Bold',sans-serif] text-base text-[#131e29] mb-4">
              Cotações Individuais
            </h3>
            <div className="space-y-2">
              {selectedRfq.counterparty_quotes.map((quote) => (
                <div 
                  key={quote.id} 
                  className="flex items-center justify-between p-3 bg-[var(--sapGroup_ContentBackground)] rounded"
                >
                  <div>
                    <span className="font-['72:Bold',sans-serif]">{quote.counterparty_name}</span>
                    <span className="text-sm text-[var(--sapContent_LabelColor)] ml-2">
                      {legSideLabel(quote.leg_side)}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-['72:Bold',sans-serif]">
                      {quote.quote_price?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                    {canAward && (
                      <FioriButton
                        variant="default"
                        onClick={() => handleOpenAwardModal(quote)}
                      >
                        Selecionar
                      </FioriButton>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <TimelinePanel
          title="Histórico"
          subjectType="rfq"
          subjectId={selectedRfq.id}
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
                        Não foi possível validar a contraparte selecionada para esta decisão.
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
            <p className="text-xs text-[var(--sapContent_LabelColor)]">
              Ao confirmar, o sistema registrará os contratos associados a esta decisão.
            </p>
          </div>
        </FioriModal>
      )}
    </>
  );
}

export default RFQsPageIntegrated;
