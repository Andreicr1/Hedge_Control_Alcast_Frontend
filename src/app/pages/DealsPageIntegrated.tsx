/**
 * DealsPageIntegrated.tsx
 * 
 * Versão integrada da página de Deals.
 * Mantém visual EXATAMENTE igual ao DealsPage original,
 * mas consome dados reais das APIs:
 * - GET /deals - Lista de deals
 * 
 * O backend é a fonte da verdade para todos os cálculos.
 */

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FioriObjectStatus, mapStatusToType } from '../components/fiori/FioriObjectStatus';
import { FioriGovernanceMetadata } from '../components/fiori/FioriGovernanceMetadata';
import { FioriFlexibleColumnLayout } from '../components/fiori/FioriFlexibleColumnLayout';
import { FioriButton } from '../components/fiori/FioriButton';
import { 
  Search, 
  Download, 
  Filter 
} from 'lucide-react';
import { listDeals, updateDeal } from '../../services/deals.service';
import { Deal, DealLifecycleStatus } from '../../types';
import { LoadingState } from '../components/ui/LoadingState';
import { ErrorState } from '../components/ui/ErrorState';

export function DealsPageIntegrated() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // State
  const [deals, setDeals] = useState<Deal[]>([]);
  const [selectedDealId, setSelectedDealId] = useState<number | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState('');

  const selectedDeal = useMemo(
    () => deals.find((d) => d.id === selectedDealId) || null,
    [deals, selectedDealId]
  );

  const [referenceNameDraft, setReferenceNameDraft] = useState('');
  const [isSavingReferenceName, setIsSavingReferenceName] = useState(false);
  const [referenceNameError, setReferenceNameError] = useState<string | null>(null);

  useEffect(() => {
    setReferenceNameDraft(selectedDeal?.reference_name || '');
    setReferenceNameError(null);
  }, [selectedDealId, selectedDeal?.reference_name]);

  const _didInitFromUrl = useRef(false);
  useEffect(() => {
    if (_didInitFromUrl.current) return;
    _didInitFromUrl.current = true;

    const q = searchParams.get('q');
    if (q) setSearchTerm(q);

    const idParam = searchParams.get('id');
    if (idParam) {
      const id = Number(idParam);
      if (Number.isFinite(id)) setSelectedDealId(id);
    }
  }, [searchParams]);
  
  // Loading states
  const [isLoadingDeals, setIsLoadingDeals] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch deals list
  const fetchDeals = useCallback(async () => {
    setIsLoadingDeals(true);
    setError(null);
    try {
      const data = await listDeals();
      setDeals(data);
      // Auto-select first deal
      if (data.length > 0 && !selectedDealId) {
        setSelectedDealId(data[0].id);
      }
    } catch (err) {
      console.error('Failed to fetch deals:', err);
      setError('Erro ao carregar operações');
    } finally {
      setIsLoadingDeals(false);
    }
  }, [selectedDealId]);

  useEffect(() => {
    fetchDeals();
  }, [fetchDeals]);

  // Filter deals
  const filteredDeals = deals.filter((deal) => {
    const matchesStatus = filterStatus === 'All' || deal.lifecycle_status === filterStatus;
    const matchesSearch = 
      deal.deal_uuid.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (deal.reference_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (deal.commodity || '').toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const saveReferenceName = useCallback(async () => {
    if (!selectedDealId) return;
    setIsSavingReferenceName(true);
    setReferenceNameError(null);
    try {
      const updated = await updateDeal(selectedDealId, { reference_name: referenceNameDraft });
      setDeals((prev) => prev.map((d) => (d.id === updated.id ? updated : d)));
    } catch (err) {
      console.error('Failed to update deal reference name:', err);
      setReferenceNameError('Erro ao salvar nome de referência');
    } finally {
      setIsSavingReferenceName(false);
    }
  }, [referenceNameDraft, selectedDealId]);

  const handleDealSelect = (dealId: number) => {
    setSelectedDealId(dealId);
  };

  const formatLifecycleStatusLabel = (status: DealLifecycleStatus | string | null | undefined) => {
    switch (status) {
      case 'draft':
        return 'Rascunho';
      case 'active':
        return 'Ativa';
      case 'closed':
        return 'Encerrada';
      default:
        return status ? String(status) : '—';
    }
  };

  // Prepare chart data for selected deal
  // (Institucional) Resultado/P&L foi absorvido pelo Fluxo de Caixa analítico.

  // Loading state
  if (isLoadingDeals && deals.length === 0) {
    return <LoadingState message="Carregando deals..." />;
  }

  // Error state
  if (error) {
    return <ErrorState error={{ detail: error }} onRetry={fetchDeals} />;
  }

  // selectedDeal is memoized above

  // Master Column Content
  const masterContent = (
    <>
      {/* Master Header */}
      <div className="border-b border-[var(--sapList_HeaderBorderColor)] p-4 bg-[var(--sapList_HeaderBackground)]">
        <h2 className="font-['72:Bold',sans-serif] text-base text-[var(--sapList_HeaderTextColor)] mb-3">
          Operações ({filteredDeals.length})
        </h2>
        <div className="space-y-2">
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por identificador..."
              className="w-full h-8 px-3 pr-8 text-sm bg-[var(--sapField_Background)] border border-[var(--sapField_BorderColor)] rounded outline-none focus:border-[var(--sapField_Focus_BorderColor)]"
            />
            <Search className="w-4 h-4 absolute right-2 top-2 text-[var(--sapContent_IconColor)]" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[var(--sapContent_LabelColor)] text-xs font-['72:Regular',sans-serif]">Status</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              title="Filtrar por status"
              className="h-8 px-2 text-sm bg-[var(--sapField_Background)] border border-[var(--sapField_BorderColor)] rounded outline-none"
            >
              <option value="All">Todos os status</option>
              <option value="draft">Rascunho</option>
              <option value="active">Ativa</option>
              <option value="closed">Encerrada</option>
            </select>
          </div>
        </div>
      </div>

      {/* Master List */}
      <div className="flex-1 overflow-y-auto">
        {filteredDeals.map((deal) => {
          const isSelected = selectedDealId === deal.id;
          
          return (
            <button
              key={deal.id}
              onClick={() => handleDealSelect(deal.id)}
              className={`w-full p-4 border-b border-[var(--sapList_BorderColor)] text-left hover:bg-[var(--sapList_HoverBackground)] transition-colors ${
                isSelected
                  ? 'bg-[var(--sapList_SelectionBackgroundColor)] border-l-2 border-l-[var(--sapList_SelectionBorderColor)]'
                  : ''
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="font-['72:Bold',sans-serif] text-sm text-[var(--sapContent_ForegroundColor)]">
                  {deal.reference_name || deal.deal_uuid}
                </div>
                <FioriObjectStatus status={mapStatusToType(deal.lifecycle_status)}>
                  {formatLifecycleStatusLabel(deal.lifecycle_status)}
                </FioriObjectStatus>
              </div>
              {deal.reference_name && (
                <div className="text-[11px] text-[var(--sapContent_LabelColor)] mb-1 font-['72:Regular',sans-serif]">
                  {deal.deal_uuid}
                </div>
              )}
              <div className="text-xs text-[var(--sapContent_LabelColor)] mb-2 font-['72:Regular',sans-serif]">
                {deal.commodity || 'Alumínio'}
              </div>
            </button>
          );
        })}
      </div>
    </>
  );

  // Detail Column Content
  const detailContent = selectedDeal ? (
    <div className="h-full overflow-y-auto">
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <h1 className="font-['72:Black',sans-serif] text-2xl text-[var(--sapLink_TextColor,#0a6ed1)] m-0">
              {selectedDeal.reference_name || selectedDeal.deal_uuid || `Operação #${selectedDeal.id}`}
            </h1>
            <FioriObjectStatus status={mapStatusToType(selectedDeal.lifecycle_status)}>
              {formatLifecycleStatusLabel(selectedDeal.lifecycle_status)}
            </FioriObjectStatus>
          </div>
          <div className="flex gap-2">
            <FioriButton variant="ghost" icon={<Filter className="w-4 h-4" />}>
              Ajustar filtros
            </FioriButton>
            <FioriButton variant="ghost" icon={<Download className="w-4 h-4" />}>
              Exportar
            </FioriButton>
          </div>
        </div>

        <FioriGovernanceMetadata
          lastUpdated={selectedDeal.created_at ? new Date(selectedDeal.created_at).toLocaleString('pt-BR') : '—'}
          calculatedAt={selectedDeal.created_at ? new Date(selectedDeal.created_at).toLocaleString('pt-BR') : '—'}
          source="Sistema"
          refreshable={true}
          onRefresh={fetchDeals}
        />

        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="text-xs text-[var(--sapContent_LabelColor)] mb-1 font-['72:Regular',sans-serif]">Ação principal</div>
          <div className="text-sm text-[var(--sapTextColor,#32363a)]">
            Use o Fluxo de Caixa para ver SO, PO e contratos por data de vencimento.
          </div>
          <div className="mt-3">
            <FioriButton variant="emphasized" onClick={() => navigate(`/financeiro/deals/${selectedDeal.id}`)}>
              Ver Fluxo de Caixa desta operação
            </FioriButton>
          </div>
        </div>

        {/* Human reference name */}
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <label className="block text-xs text-[var(--sapContent_LabelColor)] mb-1 font-['72:Regular',sans-serif]">
                Nome de referência (humanizado)
              </label>
              <input
                type="text"
                value={referenceNameDraft}
                onChange={(e) => setReferenceNameDraft(e.target.value)}
                placeholder="Ex.: Operação Fornecedor Mexicano"
                className="w-full h-9 px-3 text-sm bg-[var(--sapField_Background)] border border-[var(--sapField_BorderColor)] rounded outline-none focus:border-[var(--sapField_Focus_BorderColor)]"
              />
              <div className="mt-1 text-[11px] text-[var(--sapContent_LabelColor)] font-['72:Regular',sans-serif]">
                Esse nome é livre e serve para busca rápida e identificação do Deal.
              </div>
              {referenceNameError && (
                <div className="mt-2 text-[12px] text-[var(--sapNegativeTextColor)] font-['72:Regular',sans-serif]">
                  {referenceNameError}
                </div>
              )}
            </div>
            <div className="shrink-0">
              <FioriButton
                variant="emphasized"
                disabled={isSavingReferenceName || !selectedDealId}
                onClick={saveReferenceName}
              >
                {isSavingReferenceName ? 'Salvando…' : 'Salvar'}
              </FioriButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div className="flex items-center justify-center h-full text-[var(--sapContent_LabelColor)]">
      <div className="text-center">
        <p className="font-['72:Regular',sans-serif] text-base mb-2">Selecione uma operação</p>
        <p className="font-['72:Regular',sans-serif] text-sm text-[var(--sapContent_LabelColor)]">Escolha um item na lista à esquerda</p>
      </div>
    </div>
  );

  return (
    <FioriFlexibleColumnLayout
      masterTitle="Operações"
      masterContent={masterContent}
      masterWidth={320}
      detailContent={detailContent}
    />
  );
}
