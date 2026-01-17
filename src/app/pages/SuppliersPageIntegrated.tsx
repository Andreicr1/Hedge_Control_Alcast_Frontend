/**
 * Suppliers Page - Versão Integrada com Backend
 *
 * CRUD de fornecedores (Compras).
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  useCreateSupplier,
  useDeleteSupplier,
  useSuppliers,
  useUpdateSupplier,
} from '../../hooks';
import type { SupplierCreate, SupplierUpdate } from '../../types';
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
  Building2,
  Edit,
  Trash2,
  Mail,
  Phone,
  MapPin,
} from 'lucide-react';

interface SupplierFormData {
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

const emptyFormData: SupplierFormData = {
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

export function SuppliersPageIntegrated() {
  const [searchParams] = useSearchParams();
  const { items: suppliers, isLoading, isError, error, refetch } = useSuppliers();
  const createMutation = useCreateSupplier();
  const updateMutation = useUpdateSupplier();
  const deleteMutation = useDeleteSupplier();

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
  const [formData, setFormData] = useState<SupplierFormData>(emptyFormData);

  const selectedSupplier = useMemo(() => {
    if (!selectedId) return null;
    return suppliers.find((s) => s.id === selectedId) || null;
  }, [suppliers, selectedId]);

  const filteredSuppliers = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return suppliers;
    return suppliers.filter((s) => {
      const hay = [s.name, s.trade_name, s.legal_name, s.tax_id, s.contact_email]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return hay.includes(q);
    });
  }, [suppliers, searchTerm]);

  const buildUpdatePayload = useCallback((): SupplierUpdate => {
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

  const buildCreatePayload = useCallback((): SupplierCreate => {
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
    if (!selectedSupplier) return;
    setFormData({
      name: selectedSupplier.name || '',
      code: selectedSupplier.code || '',
      trade_name: selectedSupplier.trade_name || '',
      legal_name: selectedSupplier.legal_name || '',
      entity_type: selectedSupplier.entity_type || '',

      tax_id: selectedSupplier.tax_id || '',
      tax_id_type: selectedSupplier.tax_id_type || '',
      tax_id_country: selectedSupplier.tax_id_country || '',
      state_registration: selectedSupplier.state_registration || '',

      address_line: selectedSupplier.address_line || '',
      city: selectedSupplier.city || '',
      state: selectedSupplier.state || '',
      country: selectedSupplier.country || '',
      postal_code: selectedSupplier.postal_code || '',

      country_incorporation: selectedSupplier.country_incorporation || '',
      country_operation: selectedSupplier.country_operation || '',
      country_residence: selectedSupplier.country_residence || '',

      credit_limit: selectedSupplier.credit_limit != null ? String(selectedSupplier.credit_limit) : '',
      credit_score: selectedSupplier.credit_score != null ? String(selectedSupplier.credit_score) : '',

      kyc_status: selectedSupplier.kyc_status || '',
      kyc_notes: selectedSupplier.kyc_notes || '',
      sanctions_flag: selectedSupplier.sanctions_flag ?? false,
      risk_rating: selectedSupplier.risk_rating || '',

      contact_email: selectedSupplier.contact_email || '',
      contact_phone: selectedSupplier.contact_phone || '',

      base_currency: selectedSupplier.base_currency || '',
      payment_terms: selectedSupplier.payment_terms || '',

      internal_notes: selectedSupplier.internal_notes || '',
      active: selectedSupplier.active ?? true,
    });
    setIsEditModalOpen(true);
  }, [selectedSupplier]);

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
            Fornecedores ({filteredSuppliers.length})
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
            placeholder="Buscar fornecedor..."
            className="w-full h-8 px-3 pr-8 text-sm bg-[var(--sapField_Background)] border border-[var(--sapField_BorderColor)] rounded outline-none focus:border-[var(--sapField_Focus_BorderColor)]"
          />
          <Search className="w-4 h-4 absolute right-2 top-2 text-[var(--sapContent_IconColor)]" />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {filteredSuppliers.map((s) => {
          const isSelected = selectedSupplier?.id === s.id;
          return (
            <button
              key={s.id}
              onClick={() => setSelectedId(s.id)}
              className={`w-full p-4 border-b border-[var(--sapList_BorderColor)] text-left hover:bg-[var(--sapList_HoverBackground)] transition-colors ${
                isSelected
                  ? 'bg-[var(--sapList_SelectionBackgroundColor)] border-l-2 border-l-[var(--sapList_SelectionBorderColor)]'
                  : ''
              }`}
            >
              <div className="font-['72:Bold',sans-serif] text-sm text-[var(--sapLink_TextColor,#0a6ed1)]">
                {s.name}
              </div>
              <div className="text-xs text-[var(--sapContent_LabelColor)] mt-1">
                {s.tax_id ? `Documento: ${s.tax_id}` : 'Documento: —'}
              </div>
              <div className="text-xs text-[var(--sapContent_LabelColor)]">
                {s.active ? 'Ativo' : 'Inativo'}
              </div>
            </button>
          );
        })}
      </div>
    </>
  );

  const detailContent = selectedSupplier ? (
    <div className="h-full overflow-y-auto">
      <div className="p-4 space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="font-['72:Black',sans-serif] text-2xl text-[var(--sapTextColor,#131e29)] m-0">
              {selectedSupplier.name}
            </h1>
            <div className="text-sm text-[var(--sapContent_LabelColor)] mt-1">
              {selectedSupplier.active ? 'Fornecedor ativo' : 'Fornecedor inativo'}
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
              <span>{selectedSupplier.contact_email || 'E-mail não informado'}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-[var(--sapTextColor)]">
              <Phone className="w-4 h-4 text-[var(--sapContent_IconColor)]" />
              <span>{selectedSupplier.contact_phone || 'Telefone não informado'}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-[var(--sapTextColor)] md:col-span-2">
              <MapPin className="w-4 h-4 text-[var(--sapContent_IconColor)]" />
              <span>
                {[selectedSupplier.address_line, selectedSupplier.city, selectedSupplier.state, selectedSupplier.country]
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
      title="Selecione um fornecedor"
      description="Escolha um fornecedor da lista para ver os detalhes"
      icon={<Building2 className="w-8 h-8 text-[var(--sapContent_IconColor)]" />}
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
            <span className="text-sm text-[var(--sapField_TextColor)]">Fornecedor ativo</span>
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
    return <LoadingState message="Carregando fornecedores..." fullPage />;
  }

  if (isError) {
    return (
      <ErrorState
        title="Não foi possível carregar fornecedores"
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
        masterTitle="Fornecedores"
        masterContent={masterContent}
        masterWidth={340}
        detailContent={
          suppliers.length === 0 ? (
            <EmptyState
              title="Nenhum fornecedor cadastrado"
              description="Cadastre fornecedores para uso em pedidos de compra."
              icon={<Building2 className="w-8 h-8 text-[var(--sapContent_IconColor)]" />}
              actionLabel="Novo fornecedor"
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
        title="Novo fornecedor"
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
        title="Editar fornecedor"
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
          Tem certeza que deseja excluir o fornecedor <strong>{selectedSupplier?.name}</strong>?
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

export default SuppliersPageIntegrated;
