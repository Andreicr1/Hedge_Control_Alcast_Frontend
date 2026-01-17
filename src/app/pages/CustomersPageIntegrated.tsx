/**
 * Customers Page - Versão Integrada com Backend
 *
 * CRUD de clientes (Vendas).
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  useCreateCustomer,
  useCustomers,
  useDeleteCustomer,
  useUpdateCustomer,
} from '../../hooks';
import type { Customer, CustomerCreate, CustomerUpdate } from '../../types';
import { FioriButton } from '../components/fiori/FioriButton';
import { FioriDialog } from '../components/fiori/FioriDialog';
import { FioriFlexibleColumnLayout } from '../components/fiori/FioriFlexibleColumnLayout';
import { FioriInput } from '../components/fiori/FioriInput';
import { LoadingState, ErrorState, EmptyState } from '../components/ui';
import { getInstitutionalErrorMessage } from '../../utils/errors';
import {
  Search,
  Plus,
  RefreshCw,
  Users,
  Edit,
  Trash2,
  Mail,
  Phone,
  MapPin,
} from 'lucide-react';

interface CustomerFormData {
  name: string;
  code: string;
  trade_name: string;
  legal_name: string;
  entity_type: string;

  tax_id: string;
  tax_id_type: string;
  tax_id_country: string;
  state_registration: string;

  address_line: string;
  city: string;
  state: string;
  country: string;
  postal_code: string;

  country_incorporation: string;
  country_operation: string;
  country_residence: string;

  credit_limit: string;
  credit_score: string;

  kyc_status: string;
  kyc_notes: string;
  sanctions_flag: boolean;
  risk_rating: string;

  contact_email: string;
  contact_phone: string;

  base_currency: string;
  payment_terms: string;

  internal_notes: string;
  active: boolean;
}

const emptyFormData: CustomerFormData = {
  name: '',
  code: '',
  trade_name: '',
  legal_name: '',
  entity_type: '',

  tax_id: '',
  tax_id_type: '',
  tax_id_country: '',
  state_registration: '',

  address_line: '',
  city: '',
  state: '',
  country: '',
  postal_code: '',

  country_incorporation: '',
  country_operation: '',
  country_residence: '',

  credit_limit: '',
  credit_score: '',

  kyc_status: '',
  kyc_notes: '',
  sanctions_flag: false,
  risk_rating: '',

  contact_email: '',
  contact_phone: '',

  base_currency: '',
  payment_terms: '',

  internal_notes: '',
  active: true,
};

function toOptionalString(value: string): string | undefined {
  const trimmed = String(value || '').trim();
  return trimmed ? trimmed : undefined;
}

function toOptionalNumber(value: string): number | undefined {
  const trimmed = String(value || '').trim();
  if (!trimmed) return undefined;
  const num = Number(trimmed);
  return Number.isFinite(num) ? num : undefined;
}

export function CustomersPageIntegrated() {
  const [searchParams] = useSearchParams();
  const { items: customers, isLoading, isError, error, refetch } = useCustomers();
  const createMutation = useCreateCustomer();
  const updateMutation = useUpdateCustomer();
  const deleteMutation = useDeleteCustomer();

  const [searchTerm, setSearchTerm] = useState('');
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

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [formData, setFormData] = useState<CustomerFormData>(emptyFormData);

  const selectedCustomer = useMemo(() => {
    if (!selectedId) return null;
    return customers.find((c) => c.id === selectedId) || null;
  }, [customers, selectedId]);

  const filteredCustomers = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return customers;
    return customers.filter((c) => {
      const hay = [c.name, c.trade_name, c.legal_name, c.tax_id, c.contact_email]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return hay.includes(q);
    });
  }, [customers, searchTerm]);

  const buildUpdatePayload = useCallback((): CustomerUpdate => {
    return {
      name: String(formData.name || '').trim(),
      code: toOptionalString(formData.code),
      trade_name: toOptionalString(formData.trade_name),
      legal_name: toOptionalString(formData.legal_name),
      entity_type: toOptionalString(formData.entity_type),

      tax_id: toOptionalString(formData.tax_id),
      tax_id_type: toOptionalString(formData.tax_id_type),
      tax_id_country: toOptionalString(formData.tax_id_country),
      state_registration: toOptionalString(formData.state_registration),

      address_line: toOptionalString(formData.address_line),
      city: toOptionalString(formData.city),
      state: toOptionalString(formData.state),
      country: toOptionalString(formData.country),
      postal_code: toOptionalString(formData.postal_code),

      country_incorporation: toOptionalString(formData.country_incorporation),
      country_operation: toOptionalString(formData.country_operation),
      country_residence: toOptionalString(formData.country_residence),

      credit_limit: toOptionalNumber(formData.credit_limit),
      credit_score: toOptionalNumber(formData.credit_score),

      kyc_status: toOptionalString(formData.kyc_status),
      kyc_notes: toOptionalString(formData.kyc_notes),
      sanctions_flag: formData.sanctions_flag,
      risk_rating: toOptionalString(formData.risk_rating),

      contact_email: toOptionalString(formData.contact_email),
      contact_phone: toOptionalString(formData.contact_phone),

      base_currency: toOptionalString(formData.base_currency),
      payment_terms: toOptionalString(formData.payment_terms),

      internal_notes: toOptionalString(formData.internal_notes),
      active: formData.active,
    };
  }, [formData]);

  const buildCreatePayload = useCallback((): CustomerCreate => {
    const payload = buildUpdatePayload();
    return {
      ...payload,
      name: String(formData.name || '').trim(),
    };
  }, [buildUpdatePayload, formData.name]);

  const openCreate = useCallback(() => {
    setFormData(emptyFormData);
    setIsCreateModalOpen(true);
  }, []);

  const openEdit = useCallback(() => {
    if (!selectedCustomer) return;
    setFormData({
      name: selectedCustomer.name || '',
      code: selectedCustomer.code || '',
      trade_name: selectedCustomer.trade_name || '',
      legal_name: selectedCustomer.legal_name || '',
      entity_type: selectedCustomer.entity_type || '',

      tax_id: selectedCustomer.tax_id || '',
      tax_id_type: selectedCustomer.tax_id_type || '',
      tax_id_country: selectedCustomer.tax_id_country || '',
      state_registration: selectedCustomer.state_registration || '',

      address_line: selectedCustomer.address_line || '',
      city: selectedCustomer.city || '',
      state: selectedCustomer.state || '',
      country: selectedCustomer.country || '',
      postal_code: selectedCustomer.postal_code || '',

      country_incorporation: selectedCustomer.country_incorporation || '',
      country_operation: selectedCustomer.country_operation || '',
      country_residence: selectedCustomer.country_residence || '',

      credit_limit: selectedCustomer.credit_limit != null ? String(selectedCustomer.credit_limit) : '',
      credit_score: selectedCustomer.credit_score != null ? String(selectedCustomer.credit_score) : '',

      kyc_status: selectedCustomer.kyc_status || '',
      kyc_notes: selectedCustomer.kyc_notes || '',
      sanctions_flag: selectedCustomer.sanctions_flag ?? false,
      risk_rating: selectedCustomer.risk_rating || '',

      contact_email: selectedCustomer.contact_email || '',
      contact_phone: selectedCustomer.contact_phone || '',

      base_currency: selectedCustomer.base_currency || '',
      payment_terms: selectedCustomer.payment_terms || '',

      internal_notes: selectedCustomer.internal_notes || '',
      active: selectedCustomer.active ?? true,
    });
    setIsEditModalOpen(true);
  }, [selectedCustomer]);

  const handleCreate = useCallback(async () => {
    const result = await createMutation.mutate(buildCreatePayload());
    if (result) {
      setIsCreateModalOpen(false);
      setFormData(emptyFormData);
      refetch();
    }
  }, [buildCreatePayload, createMutation, refetch]);

  const handleUpdate = useCallback(async () => {
    if (!selectedId) return;
    const result = await updateMutation.mutate(selectedId, buildUpdatePayload());
    if (result) {
      setIsEditModalOpen(false);
      refetch();
    }
  }, [buildUpdatePayload, refetch, selectedId, updateMutation]);

  const handleDelete = useCallback(async () => {
    if (!selectedId) return;
    const ok = await deleteMutation.mutate(selectedId);
    if (ok) {
      setIsDeleteModalOpen(false);
      setSelectedId(null);
      refetch();
    }
  }, [deleteMutation, refetch, selectedId]);

  const masterContent = (
    <>
      <div className="border-b border-[var(--sapList_HeaderBorderColor)] p-4 bg-[var(--sapList_HeaderBackground)]">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-['72:Bold',sans-serif] text-base text-[var(--sapList_HeaderTextColor)]">
            Clientes ({filteredCustomers.length})
          </h2>
          <div className="flex items-center gap-2">
            <FioriButton variant="ghost" icon={<RefreshCw className="w-4 h-4" />} onClick={refetch} />
            <FioriButton variant="emphasized" icon={<Plus className="w-4 h-4" />} onClick={openCreate}>
              Novo
            </FioriButton>
          </div>
        </div>

        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar cliente..."
            className="w-full h-8 px-3 pr-8 text-sm bg-[var(--sapField_Background)] border border-[var(--sapField_BorderColor)] rounded outline-none focus:border-[var(--sapField_Focus_BorderColor)]"
          />
          <Search className="w-4 h-4 absolute right-2 top-2 text-[var(--sapContent_IconColor)]" />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {filteredCustomers.map((c) => {
          const isSelected = selectedCustomer?.id === c.id;
          return (
            <button
              key={c.id}
              onClick={() => setSelectedId(c.id)}
              className={`w-full p-4 border-b border-[var(--sapList_BorderColor)] text-left hover:bg-[var(--sapList_HoverBackground)] transition-colors ${
                isSelected
                  ? 'bg-[var(--sapList_SelectionBackgroundColor)] border-l-2 border-l-[var(--sapList_SelectionBorderColor)]'
                  : ''
              }`}
            >
              <div className="font-['72:Bold',sans-serif] text-sm text-[var(--sapLink_TextColor,#0a6ed1)]">
                {c.name}
              </div>
              <div className="text-xs text-[var(--sapContent_LabelColor)] mt-1">
                {c.tax_id ? `Documento: ${c.tax_id}` : 'Documento: —'}
              </div>
              <div className="text-xs text-[var(--sapContent_LabelColor)]">
                {c.active ? 'Ativo' : 'Inativo'}
              </div>
            </button>
          );
        })}
      </div>
    </>
  );

  const detailContent = selectedCustomer ? (
    <div className="h-full overflow-y-auto">
      <div className="p-4 space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="font-['72:Black',sans-serif] text-2xl text-[var(--sapTextColor,#131e29)] m-0">
              {selectedCustomer.name}
            </h1>
            <div className="text-sm text-[var(--sapContent_LabelColor)] mt-1">
              {selectedCustomer.active ? 'Cliente ativo' : 'Cliente inativo'}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <FioriButton variant="default" icon={<Edit className="w-4 h-4" />} onClick={openEdit}>
              Editar
            </FioriButton>
            <FioriButton variant="negative" icon={<Trash2 className="w-4 h-4" />} onClick={() => setIsDeleteModalOpen(true)}>
              Excluir
            </FioriButton>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4">
          <h3 className="font-['72:Bold',sans-serif] text-base text-[var(--sapTextColor,#131e29)] mb-3">
            Cadastro
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="flex items-center gap-2 text-sm text-[var(--sapTextColor)]">
              <Mail className="w-4 h-4 text-[var(--sapContent_IconColor)]" />
              <span>{selectedCustomer.contact_email || 'E-mail não informado'}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-[var(--sapTextColor)]">
              <Phone className="w-4 h-4 text-[var(--sapContent_IconColor)]" />
              <span>{selectedCustomer.contact_phone || 'Telefone não informado'}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-[var(--sapTextColor)] md:col-span-2">
              <MapPin className="w-4 h-4 text-[var(--sapContent_IconColor)]" />
              <span>
                {[selectedCustomer.address_line, selectedCustomer.city, selectedCustomer.state, selectedCustomer.country]
                  .filter(Boolean)
                  .join(' • ') || 'Endereço não informado'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <EmptyState
      title="Selecione um cliente"
      description="Escolha um cliente da lista para ver os detalhes"
      icon={<Users className="w-8 h-8 text-[var(--sapContent_IconColor)]" />}
      fullPage
    />
  );

  const renderForm = () => (
    <div className="space-y-6">
      <div className="space-y-3">
        <h3 className="font-['72:Bold',sans-serif] text-sm text-[var(--sapTextColor,#131e29)]">Identificação</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <FioriInput label="Nome *" value={formData.name} onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))} fullWidth />
          <FioriInput label="Código interno" value={formData.code} onChange={(e) => setFormData((p) => ({ ...p, code: e.target.value }))} fullWidth />
          <FioriInput label="Nome fantasia" value={formData.trade_name} onChange={(e) => setFormData((p) => ({ ...p, trade_name: e.target.value }))} fullWidth />
          <FioriInput label="Razão social" value={formData.legal_name} onChange={(e) => setFormData((p) => ({ ...p, legal_name: e.target.value }))} fullWidth />
          <FioriInput label="Tipo de entidade" value={formData.entity_type} onChange={(e) => setFormData((p) => ({ ...p, entity_type: e.target.value }))} fullWidth />
          <div className="flex items-center gap-2 pt-2">
            <input type="checkbox" checked={formData.active} onChange={(e) => setFormData((p) => ({ ...p, active: e.target.checked }))} className="w-4 h-4" />
            <span className="text-sm text-[var(--sapField_TextColor)]">Cliente ativo</span>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="font-['72:Bold',sans-serif] text-sm text-[var(--sapTextColor,#131e29)]">Contato</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <FioriInput label="E-mail" type="email" value={formData.contact_email} onChange={(e) => setFormData((p) => ({ ...p, contact_email: e.target.value }))} fullWidth />
          <FioriInput label="Telefone" value={formData.contact_phone} onChange={(e) => setFormData((p) => ({ ...p, contact_phone: e.target.value }))} fullWidth />
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="font-['72:Bold',sans-serif] text-sm text-[var(--sapTextColor,#131e29)]">Fiscal e endereço</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <FioriInput label="Documento fiscal" value={formData.tax_id} onChange={(e) => setFormData((p) => ({ ...p, tax_id: e.target.value }))} fullWidth />
          <FioriInput label="Tipo do documento" value={formData.tax_id_type} onChange={(e) => setFormData((p) => ({ ...p, tax_id_type: e.target.value }))} fullWidth />
          <FioriInput label="País do documento" value={formData.tax_id_country} onChange={(e) => setFormData((p) => ({ ...p, tax_id_country: e.target.value }))} fullWidth />
          <FioriInput label="Inscrição estadual" value={formData.state_registration} onChange={(e) => setFormData((p) => ({ ...p, state_registration: e.target.value }))} fullWidth />

          <FioriInput label="Endereço" value={formData.address_line} onChange={(e) => setFormData((p) => ({ ...p, address_line: e.target.value }))} fullWidth />
          <FioriInput label="Cidade" value={formData.city} onChange={(e) => setFormData((p) => ({ ...p, city: e.target.value }))} fullWidth />
          <FioriInput label="Estado" value={formData.state} onChange={(e) => setFormData((p) => ({ ...p, state: e.target.value }))} fullWidth />
          <FioriInput label="País" value={formData.country} onChange={(e) => setFormData((p) => ({ ...p, country: e.target.value }))} fullWidth />
          <FioriInput label="CEP" value={formData.postal_code} onChange={(e) => setFormData((p) => ({ ...p, postal_code: e.target.value }))} fullWidth />
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="font-['72:Bold',sans-serif] text-sm text-[var(--sapTextColor,#131e29)]">Risco e compliance</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <FioriInput label="Classificação de risco" value={formData.risk_rating} onChange={(e) => setFormData((p) => ({ ...p, risk_rating: e.target.value }))} fullWidth />
          <FioriInput label="Status de KYC" value={formData.kyc_status} onChange={(e) => setFormData((p) => ({ ...p, kyc_status: e.target.value }))} fullWidth />
          <FioriInput label="Limite de crédito" value={formData.credit_limit} onChange={(e) => setFormData((p) => ({ ...p, credit_limit: e.target.value }))} fullWidth />
          <FioriInput label="Score de crédito" value={formData.credit_score} onChange={(e) => setFormData((p) => ({ ...p, credit_score: e.target.value }))} fullWidth />
          <div className="flex items-center gap-2 pt-2">
            <input type="checkbox" checked={formData.sanctions_flag} onChange={(e) => setFormData((p) => ({ ...p, sanctions_flag: e.target.checked }))} className="w-4 h-4" />
            <span className="text-sm text-[var(--sapField_TextColor)]">Sinalização de sanções</span>
          </div>
          <div className="md:col-span-2">
            <label className="font-['72:Regular',sans-serif] text-[14px] text-[var(--sapContent_LabelColor,#556b82)] leading-[normal]">Observações de KYC</label>
            <textarea
              value={formData.kyc_notes}
              onChange={(e) => setFormData((p) => ({ ...p, kyc_notes: e.target.value }))}
              rows={3}
              className="w-full mt-1 px-3 py-2 bg-[var(--sapField_Background,#ffffff)] border border-[var(--sapField_BorderColor,#89919a)] rounded-[4px] font-['72:Regular',sans-serif] text-[14px] text-[var(--sapField_TextColor,#131e29)] focus:outline-none focus:border-[var(--sapField_Focus_BorderColor,#0064d9)]"
            />
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="font-['72:Bold',sans-serif] text-sm text-[var(--sapTextColor,#131e29)]">Financeiro e observações</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <FioriInput label="Moeda base" value={formData.base_currency} onChange={(e) => setFormData((p) => ({ ...p, base_currency: e.target.value }))} fullWidth />
          <FioriInput label="Condição de pagamento" value={formData.payment_terms} onChange={(e) => setFormData((p) => ({ ...p, payment_terms: e.target.value }))} fullWidth />
          <div className="md:col-span-2">
            <label className="font-['72:Regular',sans-serif] text-[14px] text-[var(--sapContent_LabelColor,#556b82)] leading-[normal]">Observações internas</label>
            <textarea
              value={formData.internal_notes}
              onChange={(e) => setFormData((p) => ({ ...p, internal_notes: e.target.value }))}
              rows={3}
              className="w-full mt-1 px-3 py-2 bg-[var(--sapField_Background,#ffffff)] border border-[var(--sapField_BorderColor,#89919a)] rounded-[4px] font-['72:Regular',sans-serif] text-[14px] text-[var(--sapField_TextColor,#131e29)] focus:outline-none focus:border-[var(--sapField_Focus_BorderColor,#0064d9)]"
            />
          </div>
        </div>
      </div>
    </div>
  );

  if (isLoading) {
    return <LoadingState message="Carregando clientes..." fullPage />;
  }

  if (isError) {
    return (
      <ErrorState
        title="Não foi possível carregar clientes"
        error={error}
        onRetry={() => {
          void refetch();
        }}
        fullPage
      />
    );
  }

  return (
    <>
      <FioriFlexibleColumnLayout
        masterTitle="Clientes"
        masterContent={masterContent}
        masterWidth={340}
        detailContent={
          customers.length === 0 ? (
            <EmptyState
              title="Nenhum cliente cadastrado"
              description="Cadastre clientes para uso em pedidos de venda."
              icon={<Users className="w-8 h-8 text-[var(--sapContent_IconColor)]" />}
              actionLabel="Novo cliente"
              onAction={openCreate}
            />
          ) : (
            detailContent
          )
        }
      />

      <FioriDialog
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        title="Novo cliente"
        size="large"
        footer={
          <div className="flex items-center justify-end gap-2">
            <FioriButton variant="default" onClick={() => setIsCreateModalOpen(false)}>
              Cancelar
            </FioriButton>
            <FioriButton variant="emphasized" onClick={handleCreate} disabled={!formData.name.trim() || createMutation.isLoading}>
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

      <FioriDialog
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        title="Editar cliente"
        size="large"
        footer={
          <div className="flex items-center justify-end gap-2">
            <FioriButton variant="default" onClick={() => setIsEditModalOpen(false)}>
              Cancelar
            </FioriButton>
            <FioriButton variant="emphasized" onClick={handleUpdate} disabled={!formData.name.trim() || updateMutation.isLoading}>
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

      <FioriDialog
        open={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        title="Confirmar exclusão"
        footer={
          <div className="flex items-center justify-end gap-2">
            <FioriButton variant="default" onClick={() => setIsDeleteModalOpen(false)}>
              Cancelar
            </FioriButton>
            <FioriButton variant="negative" onClick={handleDelete} disabled={deleteMutation.isLoading}>
              {deleteMutation.isLoading ? 'Excluindo...' : 'Excluir'}
            </FioriButton>
          </div>
        }
      >
        <p className="text-sm text-[var(--sapTextColor)]">
          Tem certeza que deseja excluir o cliente <strong>{selectedCustomer?.name}</strong>?
        </p>
        <p className="text-sm text-[var(--sapNegativeColor)] mt-2">Esta ação não pode ser desfeita.</p>
        {deleteMutation.error && (
          <div className="mt-4 p-3 bg-[var(--sapErrorBackground)] text-[var(--sapNegativeColor)] rounded text-sm">
            {getInstitutionalErrorMessage(deleteMutation.error)}
          </div>
        )}
      </FioriDialog>
    </>
  );
}

export default CustomersPageIntegrated;
