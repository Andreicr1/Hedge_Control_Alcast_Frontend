/**
 * Counterparties Page - Versão Integrada com Backend
 * 
 * CRUD completo de contrapartes (Bancos/Tradings).
 * Contrapartes são usadas para RFQs e contratos.
 */

import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  useCounterparties, 
  useCreateCounterparty, 
  useUpdateCounterparty, 
  useDeleteCounterparty 
} from '../../hooks';
import { Counterparty, CounterpartyType } from '../../types';
import { FioriObjectStatus } from '../components/fiori/FioriObjectStatus';
import { FioriButton } from '../components/fiori/FioriButton';
import { FioriDialog } from '../components/fiori/FioriDialog';
import { TwoColumnAnalyticalLayout } from '../components/fiori/TwoColumnAnalyticalLayout';
import { FioriInput } from '../components/fiori/FioriInput';
import { FioriSelect } from '../components/fiori/FioriSelect';
import { LoadingState, ErrorState, EmptyState, DataContainer } from '../components/ui';
import { TimelinePanel } from '../components/timeline/TimelinePanel';
import { getInstitutionalErrorMessage } from '../../utils/errors';
import { 
  Search, 
  Plus,
  Building2,
  Phone,
  Mail,
  Globe,
  Edit,
  Trash2,
  RefreshCw,
  Check,
  X,
} from 'lucide-react';

// ============================================
// Type Helpers
// ============================================

function getTypeLabel(type?: CounterpartyType): string {
  const labels: Record<CounterpartyType, string> = {
    [CounterpartyType.BANK]: 'Banco',
    [CounterpartyType.BROKER]: 'Broker',
  };
  return type ? labels[type] || type : 'Desconhecido';
}

function getTypeStatus(type?: CounterpartyType): 'success' | 'information' {
  return type === CounterpartyType.BANK ? 'information' : 'success';
}

// ============================================
// Form Types
// ============================================

interface CounterpartyFormData {
  name: string;
  type: CounterpartyType;
  rfq_channel_type: string;
  trade_name: string;
  legal_name: string;
  entity_type: string;

  contact_name: string;
  contact_email: string;
  contact_phone: string;

  address_line: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  country_incorporation: string;
  country_operation: string;

  tax_id: string;
  tax_id_type: string;
  tax_id_country: string;

  base_currency: string;
  payment_terms: string;

  risk_rating: string;
  sanctions_flag: boolean;
  kyc_status: string;
  kyc_notes: string;
  internal_notes: string;

  active: boolean;
}

const emptyFormData: CounterpartyFormData = {
  name: '',
  type: CounterpartyType.BANK,
  rfq_channel_type: 'BROKER_LME',
  trade_name: '',
  legal_name: '',
  entity_type: '',

  contact_name: '',
  contact_email: '',
  contact_phone: '',

  address_line: '',
  city: '',
  state: '',
  postal_code: '',
  country: '',
  country_incorporation: '',
  country_operation: '',

  tax_id: '',
  tax_id_type: '',
  tax_id_country: '',

  base_currency: '',
  payment_terms: '',

  risk_rating: '',
  sanctions_flag: false,
  kyc_status: '',
  kyc_notes: '',
  internal_notes: '',

  active: true,
};

// ============================================
// Main Component
// ============================================

export function CounterpartiesPageIntegrated() {
  const [searchParams] = useSearchParams();
  // API State via hooks
  const { counterparties, isLoading, isError, error, refetch } = useCounterparties();
  const createMutation = useCreateCounterparty();
  const updateMutation = useUpdateCounterparty();
  const deleteMutation = useDeleteCounterparty();
  
  // Local UI state
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const _didInitFromUrl = useRef(false);
  useEffect(() => {
    if (_didInitFromUrl.current) return;
    _didInitFromUrl.current = true;

    const q = searchParams.get('q');
    if (q) setSearchTerm(q);

    const idParam = searchParams.get('id');
    if (idParam) {
      const id = Number(idParam);
      if (Number.isFinite(id)) setSelectedId(id);
    }
  }, [searchParams]);
  
  // Modal state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [formData, setFormData] = useState<CounterpartyFormData>(emptyFormData);
  
  // Selected counterparty
  const selectedCounterparty = useMemo(() => {
    if (!selectedId || !counterparties) return null;
    return counterparties.find(c => c.id === selectedId) || null;
  }, [selectedId, counterparties]);

  // ============================================
  // Filtered Data
  // ============================================
  
  const filteredCounterparties = useMemo(() => {
    if (!counterparties) return [];
    
    return counterparties.filter((cp) => {
      const matchesSearch =
        cp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cp.contact_email?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = typeFilter === 'all' || cp.type === typeFilter;
      return matchesSearch && matchesType;
    });
  }, [counterparties, searchTerm, typeFilter]);

  // ============================================
  // Handlers
  // ============================================

  const handleSelect = useCallback((id: number) => {
    setSelectedId(id);
  }, []);

  const handleOpenCreateModal = useCallback(() => {
    setFormData(emptyFormData);
    setIsCreateModalOpen(true);
  }, []);

  const handleOpenEditModal = useCallback(() => {
    if (!selectedCounterparty) return;
    setFormData({
      name: selectedCounterparty.name,
      type: selectedCounterparty.type,
      rfq_channel_type: selectedCounterparty.rfq_channel_type || 'BROKER_LME',
      trade_name: selectedCounterparty.trade_name || '',
      legal_name: selectedCounterparty.legal_name || '',
      entity_type: selectedCounterparty.entity_type || '',

      contact_name: selectedCounterparty.contact_name || '',
      contact_email: selectedCounterparty.contact_email || '',
      contact_phone: selectedCounterparty.contact_phone || '',

      address_line: selectedCounterparty.address_line || '',
      city: selectedCounterparty.city || '',
      state: selectedCounterparty.state || '',
      postal_code: selectedCounterparty.postal_code || '',
      country: selectedCounterparty.country || '',
      country_incorporation: selectedCounterparty.country_incorporation || '',
      country_operation: selectedCounterparty.country_operation || '',

      tax_id: selectedCounterparty.tax_id || '',
      tax_id_type: selectedCounterparty.tax_id_type || '',
      tax_id_country: selectedCounterparty.tax_id_country || '',

      base_currency: selectedCounterparty.base_currency || '',
      payment_terms: selectedCounterparty.payment_terms || '',

      risk_rating: selectedCounterparty.risk_rating || '',
      sanctions_flag: selectedCounterparty.sanctions_flag ?? false,
      kyc_status: selectedCounterparty.kyc_status || '',
      kyc_notes: selectedCounterparty.kyc_notes || '',
      internal_notes: selectedCounterparty.internal_notes || '',

      active: selectedCounterparty.active ?? true,
    });
    setIsEditModalOpen(true);
  }, [selectedCounterparty]);

  const handleOpenDeleteModal = useCallback(() => {
    setIsDeleteModalOpen(true);
  }, []);

  const handleCreate = useCallback(async () => {
    const opt = (value: string): string | null => {
      const trimmed = String(value || '').trim();
      return trimmed ? trimmed : null;
    };
    try {
      await createMutation.mutate({
        name: String(formData.name || '').trim(),
        type: formData.type,
        rfq_channel_type: opt(formData.rfq_channel_type) || undefined,
        trade_name: opt(formData.trade_name) || undefined,
        legal_name: opt(formData.legal_name) || undefined,
        entity_type: opt(formData.entity_type) || undefined,

        contact_name: opt(formData.contact_name) || undefined,
        contact_email: opt(formData.contact_email) || undefined,
        contact_phone: opt(formData.contact_phone) || undefined,

        address_line: opt(formData.address_line) || undefined,
        city: opt(formData.city) || undefined,
        state: opt(formData.state) || undefined,
        postal_code: opt(formData.postal_code) || undefined,
        country: opt(formData.country) || undefined,
        country_incorporation: opt(formData.country_incorporation) || undefined,
        country_operation: opt(formData.country_operation) || undefined,

        tax_id: opt(formData.tax_id) || undefined,
        tax_id_type: opt(formData.tax_id_type) || undefined,
        tax_id_country: opt(formData.tax_id_country) || undefined,

        base_currency: opt(formData.base_currency) || undefined,
        payment_terms: opt(formData.payment_terms) || undefined,

        risk_rating: opt(formData.risk_rating) || undefined,
        sanctions_flag: formData.sanctions_flag,
        kyc_status: opt(formData.kyc_status) || undefined,
        kyc_notes: opt(formData.kyc_notes) || undefined,
        internal_notes: opt(formData.internal_notes) || undefined,

        active: formData.active,
      });
      setIsCreateModalOpen(false);
      setFormData(emptyFormData);
      refetch();
    } catch (err) {
      // Error is handled by the hook
    }
  }, [formData, createMutation, refetch]);

  const handleUpdate = useCallback(async () => {
    if (!selectedId) return;
    const opt = (value: string): string | null => {
      const trimmed = String(value || '').trim();
      return trimmed ? trimmed : null;
    };
    try {
      await updateMutation.mutate(selectedId, {
        name: String(formData.name || '').trim(),
        type: formData.type,
        rfq_channel_type: opt(formData.rfq_channel_type) || undefined,
        trade_name: opt(formData.trade_name) || undefined,
        legal_name: opt(formData.legal_name) || undefined,
        entity_type: opt(formData.entity_type) || undefined,

        contact_name: opt(formData.contact_name) || undefined,
        contact_email: opt(formData.contact_email) || undefined,
        contact_phone: opt(formData.contact_phone) || undefined,

        address_line: opt(formData.address_line) || undefined,
        city: opt(formData.city) || undefined,
        state: opt(formData.state) || undefined,
        postal_code: opt(formData.postal_code) || undefined,
        country: opt(formData.country) || undefined,
        country_incorporation: opt(formData.country_incorporation) || undefined,
        country_operation: opt(formData.country_operation) || undefined,

        tax_id: opt(formData.tax_id) || undefined,
        tax_id_type: opt(formData.tax_id_type) || undefined,
        tax_id_country: opt(formData.tax_id_country) || undefined,

        base_currency: opt(formData.base_currency) || undefined,
        payment_terms: opt(formData.payment_terms) || undefined,

        risk_rating: opt(formData.risk_rating) || undefined,
        sanctions_flag: formData.sanctions_flag,
        kyc_status: opt(formData.kyc_status) || undefined,
        kyc_notes: opt(formData.kyc_notes) || undefined,
        internal_notes: opt(formData.internal_notes) || undefined,

        active: formData.active,
      });
      setIsEditModalOpen(false);
      refetch();
    } catch (err) {
      // Error is handled by the hook
    }
  }, [selectedId, formData, updateMutation, refetch]);

  const handleDelete = useCallback(async () => {
    if (!selectedId) return;
    try {
      await deleteMutation.mutate(selectedId);
      setIsDeleteModalOpen(false);
      setSelectedId(null);
      refetch();
    } catch (err) {
      // Error is handled by the hook
    }
  }, [selectedId, deleteMutation, refetch]);

  // ============================================
  // Master Column - Counterparty List
  // ============================================

  const masterContent = (
    <>
      {/* Header */}
      <div className="border-b border-[var(--sapList_HeaderBorderColor)] p-4 bg-[var(--sapList_HeaderBackground)]">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-['72:Bold',sans-serif] text-base text-[var(--sapList_HeaderTextColor)]">
            Contrapartes ({filteredCounterparties.length})
          </h2>
          <div className="flex items-center gap-2">
            <FioriButton variant="ghost" icon={<RefreshCw className="w-4 h-4" />} onClick={refetch} />
            <FioriButton variant="emphasized" icon={<Plus className="w-4 h-4" />} onClick={handleOpenCreateModal}>
              Nova
            </FioriButton>
          </div>
        </div>
        
        {/* Search */}
        <div className="space-y-2">
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar contraparte..."
              className="w-full h-8 px-3 pr-8 text-sm bg-[var(--sapField_Background)] border border-[var(--sapField_BorderColor)] rounded outline-none focus:border-[var(--sapField_Focus_BorderColor)]"
            />
            <Search className="w-4 h-4 absolute right-2 top-2 text-[var(--sapContent_IconColor)]" />
          </div>
          
          {/* Type Filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            title="Filtrar por tipo"
            className="w-full h-8 px-2 text-sm bg-[var(--sapField_Background)] border border-[var(--sapField_BorderColor)] rounded outline-none"
          >
            <option value="all">Todos os tipos</option>
            <option value={CounterpartyType.BANK}>Bancos</option>
            <option value={CounterpartyType.BROKER}>Brokers</option>
          </select>
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <LoadingState message="Carregando contrapartes..." />
        ) : isError ? (
          <ErrorState error={error} onRetry={refetch} />
        ) : filteredCounterparties.length === 0 ? (
          <EmptyState 
            title="Nenhuma contraparte encontrada"
            description="Crie contrapartes para usar em RFQs"
            actionLabel="Nova Contraparte"
            onAction={handleOpenCreateModal}
          />
        ) : (
          filteredCounterparties.map((cp) => (
            <button
              key={cp.id}
              onClick={() => handleSelect(cp.id)}
              className={`w-full p-4 border-b border-[var(--sapList_BorderColor)] text-left hover:bg-[var(--sapList_HoverBackground)] transition-colors ${
                selectedId === cp.id
                  ? 'bg-[var(--sapList_SelectionBackgroundColor)] border-l-2 border-l-[var(--sapList_SelectionBorderColor)]'
                  : ''
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="font-['72:Bold',sans-serif] text-sm text-[#0064d9] truncate max-w-[200px]">
                  {cp.name}
                </div>
                <FioriObjectStatus status={getTypeStatus(cp.type)}>
                  {getTypeLabel(cp.type)}
                </FioriObjectStatus>
              </div>
              
              <div className="flex items-center gap-2 text-xs text-[var(--sapContent_LabelColor)]">
                {cp.contact_email && (
                  <span className="flex items-center gap-1">
                    <Mail className="w-3 h-3" />
                    {cp.contact_email}
                  </span>
                )}
              </div>
              
              <div className="flex items-center justify-between mt-2 text-xs">
                <span className={cp.active ? 'text-[var(--sapPositiveColor)]' : 'text-[var(--sapNegativeColor)]'}>
                  {cp.active ? 'Ativo' : 'Inativo'}
                </span>
              </div>
            </button>
          ))
        )}
      </div>
    </>
  );

  // ============================================
  // Detail Column
  // ============================================

  const detailContent = selectedCounterparty ? (
    <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Building2 className="w-6 h-6 text-[#0064d9]" />
            <h1 className="font-['72:Black',sans-serif] text-xl text-[#131e29] m-0">
              {selectedCounterparty.name}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <FioriButton variant="default" icon={<Edit className="w-4 h-4" />} onClick={handleOpenEditModal}>
              Editar
            </FioriButton>
            <FioriButton variant="negative" icon={<Trash2 className="w-4 h-4" />} onClick={handleOpenDeleteModal}>
              Excluir
            </FioriButton>
          </div>
        </div>

        {/* Status Badge */}
        <div className="flex items-center gap-3">
          <FioriObjectStatus status={getTypeStatus(selectedCounterparty.type)}>
            {getTypeLabel(selectedCounterparty.type)}
          </FioriObjectStatus>
          <FioriObjectStatus status={selectedCounterparty.active ? 'success' : 'error'}>
            {selectedCounterparty.active ? 'Ativo' : 'Inativo'}
          </FioriObjectStatus>
        </div>

        {/* Details Card */}
        <div className="bg-white rounded-lg shadow-sm p-4">
          <h3 className="font-['72:Bold',sans-serif] text-base text-[#131e29] mb-4">
            Informações de Contato
          </h3>
          
          <div className="space-y-3">
            {selectedCounterparty.contact_email && (
              <div className="flex items-center gap-3 p-3 bg-[var(--sapGroup_ContentBackground)] rounded">
                <Mail className="w-4 h-4 text-[var(--sapContent_IconColor)]" />
                <div>
                  <div className="text-xs text-[var(--sapContent_LabelColor)]">Email</div>
                  <div className="text-sm">{selectedCounterparty.contact_email}</div>
                </div>
              </div>
            )}
            
            {selectedCounterparty.contact_phone && (
              <div className="flex items-center gap-3 p-3 bg-[var(--sapGroup_ContentBackground)] rounded">
                <Phone className="w-4 h-4 text-[var(--sapContent_IconColor)]" />
                <div>
                  <div className="text-xs text-[var(--sapContent_LabelColor)]">Telefone</div>
                  <div className="text-sm">{selectedCounterparty.contact_phone}</div>
                </div>
              </div>
            )}
            
            {!selectedCounterparty.contact_email && !selectedCounterparty.contact_phone && (
              <div className="text-sm text-[var(--sapContent_LabelColor)] text-center py-4">
                Nenhum contato cadastrado
              </div>
            )}
          </div>
        </div>

        {/* Metadata */}
        <div className="bg-white rounded-lg shadow-sm p-4">
          <h3 className="font-['72:Bold',sans-serif] text-base text-[#131e29] mb-4">
            Metadados
          </h3>
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="text-xs text-[var(--sapContent_LabelColor)]">ID</div>
              <div className="text-sm font-['72:Bold',sans-serif]">#{selectedCounterparty.id}</div>
            </div>
            <div>
              <div className="text-xs text-[var(--sapContent_LabelColor)]">Tipo</div>
              <div className="text-sm">{getTypeLabel(selectedCounterparty.type)}</div>
            </div>
          </div>
        </div>

        <TimelinePanel
          title="Histórico (Contraparte)"
          subjectType="counterparty"
          subjectId={selectedCounterparty.id}
        />
    </div>
  ) : (
    <EmptyState
      title="Selecione uma contraparte"
      description="Escolha uma contraparte da lista para ver os detalhes"
      icon={<Building2 className="w-8 h-8 text-[var(--sapContent_IconColor)]" />}
    />
  );

  // ============================================
  // Form Component (reused for create/edit)
  // ============================================

  const renderForm = () => (
    <div className="space-y-6">
      <div className="space-y-3">
        <h3 className="font-['72:Bold',sans-serif] text-sm text-[var(--sapTextColor,#131e29)]">
          Identificação
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <FioriInput
            label="Nome *"
            value={formData.name}
            onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
            placeholder="Ex.: Banco Exemplo S.A."
            fullWidth
          />
          <FioriSelect
            label="Tipo *"
            value={formData.type}
            onChange={(e) => setFormData((prev) => ({ ...prev, type: e.target.value as CounterpartyType }))}
            options={[
              { value: CounterpartyType.BANK, label: 'Banco' },
              { value: CounterpartyType.BROKER, label: 'Broker' },
            ]}
            fullWidth
          />

          <FioriSelect
            label="Canal de comunicação"
            value={formData.rfq_channel_type}
            onChange={(e) => setFormData((prev) => ({ ...prev, rfq_channel_type: e.target.value }))}
            options={[
              { value: 'BROKER_LME', label: 'Broker (LME)' },
              { value: 'BROKER_EMAIL', label: 'Broker (E-mail)' },
              { value: 'BROKER_WHATSAPP', label: 'Broker (WhatsApp)' },
              { value: 'BANK_EMAIL', label: 'Banco (E-mail)' },
              { value: 'BANK_WHATSAPP', label: 'Banco (WhatsApp)' },
            ]}
            fullWidth
          />
          <FioriInput
            label="Tipo de entidade"
            value={formData.entity_type}
            onChange={(e) => setFormData((prev) => ({ ...prev, entity_type: e.target.value }))}
            placeholder="Ex.: Pessoa Jurídica"
            fullWidth
          />

          <FioriInput
            label="Nome fantasia"
            value={formData.trade_name}
            onChange={(e) => setFormData((prev) => ({ ...prev, trade_name: e.target.value }))}
            placeholder="Ex.: Banco Exemplo"
            fullWidth
          />
          <FioriInput
            label="Razão social"
            value={formData.legal_name}
            onChange={(e) => setFormData((prev) => ({ ...prev, legal_name: e.target.value }))}
            placeholder="Ex.: Banco Exemplo S.A."
            fullWidth
          />

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="active"
              checked={formData.active}
              onChange={(e) => setFormData((prev) => ({ ...prev, active: e.target.checked }))}
              className="w-4 h-4"
            />
            <label htmlFor="active" className="text-sm text-[var(--sapField_TextColor)]">
              Contraparte ativa
            </label>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="font-['72:Bold',sans-serif] text-sm text-[var(--sapTextColor,#131e29)]">
          Contato
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <FioriInput
            label="Pessoa de contato"
            value={formData.contact_name}
            onChange={(e) => setFormData((prev) => ({ ...prev, contact_name: e.target.value }))}
            placeholder="Nome e sobrenome"
            fullWidth
          />
          <FioriInput
            label="E-mail"
            type="email"
            value={formData.contact_email}
            onChange={(e) => setFormData((prev) => ({ ...prev, contact_email: e.target.value }))}
            placeholder="email@empresa.com"
            fullWidth
          />
          <FioriInput
            label="Telefone"
            value={formData.contact_phone}
            onChange={(e) => setFormData((prev) => ({ ...prev, contact_phone: e.target.value }))}
            placeholder="+55 11 99999-9999"
            fullWidth
          />
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="font-['72:Bold',sans-serif] text-sm text-[var(--sapTextColor,#131e29)]">
          Endereço
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <FioriInput
            label="Endereço"
            value={formData.address_line}
            onChange={(e) => setFormData((prev) => ({ ...prev, address_line: e.target.value }))}
            placeholder="Rua, número, complemento"
            fullWidth
          />
          <FioriInput
            label="Cidade"
            value={formData.city}
            onChange={(e) => setFormData((prev) => ({ ...prev, city: e.target.value }))}
            fullWidth
          />
          <FioriInput
            label="Estado"
            value={formData.state}
            onChange={(e) => setFormData((prev) => ({ ...prev, state: e.target.value }))}
            placeholder="Ex.: SP"
            fullWidth
          />
          <FioriInput
            label="CEP"
            value={formData.postal_code}
            onChange={(e) => setFormData((prev) => ({ ...prev, postal_code: e.target.value }))}
            placeholder="00000-000"
            fullWidth
          />
          <FioriInput
            label="País"
            value={formData.country}
            onChange={(e) => setFormData((prev) => ({ ...prev, country: e.target.value }))}
            placeholder="Ex.: Brasil"
            fullWidth
          />
          <FioriInput
            label="País de incorporação"
            value={formData.country_incorporation}
            onChange={(e) => setFormData((prev) => ({ ...prev, country_incorporation: e.target.value }))}
            fullWidth
          />
          <FioriInput
            label="País de operação"
            value={formData.country_operation}
            onChange={(e) => setFormData((prev) => ({ ...prev, country_operation: e.target.value }))}
            fullWidth
          />
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="font-['72:Bold',sans-serif] text-sm text-[var(--sapTextColor,#131e29)]">
          Informações fiscais e financeiras
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <FioriInput
            label="Documento fiscal"
            value={formData.tax_id}
            onChange={(e) => setFormData((prev) => ({ ...prev, tax_id: e.target.value }))}
            placeholder="CNPJ/CPF/VAT"
            fullWidth
          />
          <FioriInput
            label="Tipo do documento"
            value={formData.tax_id_type}
            onChange={(e) => setFormData((prev) => ({ ...prev, tax_id_type: e.target.value }))}
            placeholder="Ex.: CNPJ"
            fullWidth
          />
          <FioriInput
            label="País do documento"
            value={formData.tax_id_country}
            onChange={(e) => setFormData((prev) => ({ ...prev, tax_id_country: e.target.value }))}
            placeholder="Ex.: BR"
            fullWidth
          />
          <FioriInput
            label="Moeda base"
            value={formData.base_currency}
            onChange={(e) => setFormData((prev) => ({ ...prev, base_currency: e.target.value }))}
            placeholder="Ex.: BRL"
            fullWidth
          />
          <FioriInput
            label="Condição de pagamento"
            value={formData.payment_terms}
            onChange={(e) => setFormData((prev) => ({ ...prev, payment_terms: e.target.value }))}
            placeholder="Ex.: 30 dias"
            fullWidth
          />
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="font-['72:Bold',sans-serif] text-sm text-[var(--sapTextColor,#131e29)]">
          Risco e compliance
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <FioriInput
            label="Classificação de risco"
            value={formData.risk_rating}
            onChange={(e) => setFormData((prev) => ({ ...prev, risk_rating: e.target.value }))}
            placeholder="Ex.: Baixo / Médio / Alto"
            fullWidth
          />
          <FioriInput
            label="Status de KYC"
            value={formData.kyc_status}
            onChange={(e) => setFormData((prev) => ({ ...prev, kyc_status: e.target.value }))}
            placeholder="Ex.: Em análise"
            fullWidth
          />
          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="sanctions_flag"
              checked={formData.sanctions_flag}
              onChange={(e) => setFormData((prev) => ({ ...prev, sanctions_flag: e.target.checked }))}
              className="w-4 h-4"
            />
            <label htmlFor="sanctions_flag" className="text-sm text-[var(--sapField_TextColor)]">
              Sinalização de sanções
            </label>
          </div>

          <div className="md:col-span-2">
            <label className="font-['72:Regular',sans-serif] text-[14px] text-[var(--sapContent_LabelColor,#556b82)] leading-[normal]">
              Observações de KYC
            </label>
            <textarea
              value={formData.kyc_notes}
              onChange={(e) => setFormData((prev) => ({ ...prev, kyc_notes: e.target.value }))}
              rows={3}
              className="w-full mt-1 px-3 py-2 bg-[var(--sapField_Background,#ffffff)] border border-[var(--sapField_BorderColor,#89919a)] rounded-[4px] font-['72:Regular',sans-serif] text-[14px] text-[var(--sapField_TextColor,#131e29)] placeholder:text-[var(--sapField_PlaceholderTextColor,#556b82)] focus:outline-none focus:border-[var(--sapField_Focus_BorderColor,#0064d9)]"
              placeholder="Informações relevantes para análise e auditoria."
            />
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="font-['72:Bold',sans-serif] text-sm text-[var(--sapTextColor,#131e29)]">
          Observações internas
        </h3>
        <div>
          <textarea
            value={formData.internal_notes}
            onChange={(e) => setFormData((prev) => ({ ...prev, internal_notes: e.target.value }))}
            rows={3}
            className="w-full px-3 py-2 bg-[var(--sapField_Background,#ffffff)] border border-[var(--sapField_BorderColor,#89919a)] rounded-[4px] font-['72:Regular',sans-serif] text-[14px] text-[var(--sapField_TextColor,#131e29)] placeholder:text-[var(--sapField_PlaceholderTextColor,#556b82)] focus:outline-none focus:border-[var(--sapField_Focus_BorderColor,#0064d9)]"
            placeholder="Notas internas (não são exibidas para contrapartes)."
          />
        </div>
      </div>
    </div>
  );

  return (
    <>
      <TwoColumnAnalyticalLayout
        leftColumn={masterContent}
        rightColumn={detailContent}
        leftWidth={340}
      />

      {/* Create Modal */}
      <FioriDialog
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        title="Nova Contraparte"
        footer={
          <div className="flex items-center justify-end gap-2">
            <FioriButton variant="default" onClick={() => setIsCreateModalOpen(false)}>
              Cancelar
            </FioriButton>
            <FioriButton 
              variant="emphasized" 
              onClick={handleCreate}
              disabled={!formData.name || createMutation.isLoading}
            >
              {createMutation.isLoading ? 'Criando...' : 'Criar'}
            </FioriButton>
          </div>
        }
      >
        {renderForm()}
        {createMutation.error && (
          <div className="mt-4 p-3 bg-[var(--sapErrorBackground)] text-[var(--sapNegativeColor)] rounded text-sm">
            {getInstitutionalErrorMessage(createMutation.error)}
          </div>
        )}
      </FioriDialog>

      {/* Edit Modal */}
      <FioriDialog
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        title="Editar Contraparte"
        footer={
          <div className="flex items-center justify-end gap-2">
            <FioriButton variant="default" onClick={() => setIsEditModalOpen(false)}>
              Cancelar
            </FioriButton>
            <FioriButton 
              variant="emphasized" 
              onClick={handleUpdate}
              disabled={!formData.name || updateMutation.isLoading}
            >
              {updateMutation.isLoading ? 'Salvando...' : 'Salvar'}
            </FioriButton>
          </div>
        }
      >
        {renderForm()}
        {updateMutation.error && (
          <div className="mt-4 p-3 bg-[var(--sapErrorBackground)] text-[var(--sapNegativeColor)] rounded text-sm">
            {getInstitutionalErrorMessage(updateMutation.error)}
          </div>
        )}
      </FioriDialog>

      {/* Delete Confirmation Modal */}
      <FioriDialog
        open={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        title="Confirmar Exclusão"
        footer={
          <div className="flex items-center justify-end gap-2">
            <FioriButton variant="default" onClick={() => setIsDeleteModalOpen(false)}>
              Cancelar
            </FioriButton>
            <FioriButton 
              variant="negative" 
              onClick={handleDelete}
              disabled={deleteMutation.isLoading}
            >
              {deleteMutation.isLoading ? 'Excluindo...' : 'Excluir'}
            </FioriButton>
          </div>
        }
      >
        <p className="text-sm text-[var(--sapTextColor)]">
          Tem certeza que deseja excluir a contraparte <strong>{selectedCounterparty?.name}</strong>?
        </p>
        <p className="text-sm text-[var(--sapNegativeColor)] mt-2">
          Esta ação não pode ser desfeita.
        </p>
        {deleteMutation.error && (
          <div className="mt-4 p-3 bg-[var(--sapErrorBackground)] text-[var(--sapNegativeColor)] rounded text-sm">
            {getInstitutionalErrorMessage(deleteMutation.error)}
          </div>
        )}
      </FioriDialog>
    </>
  );
}

export default CounterpartiesPageIntegrated;
