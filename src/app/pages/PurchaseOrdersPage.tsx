import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { mockPurchaseOrders } from '../../data/mockData';
import { PurchaseOrder } from '../../data/types';
import { FioriObjectStatus, mapStatusToType } from '../components/fiori/FioriObjectStatus';
import { FioriButton } from '../components/fiori/FioriButton';
import { FioriFlexibleColumnLayout } from '../components/fiori/FioriFlexibleColumnLayout';
import { FioriTile } from '../components/fiori/FioriTile';
import { PurchaseOrderForm, PurchaseOrderFormData } from '../components/forms/PurchaseOrderForm';
import { Download, Search, Package, DollarSign, Calendar, Building2, Plus } from 'lucide-react';

export function PurchaseOrdersPage() {
  const navigate = useNavigate();
  const { poId } = useParams<{ poId?: string }>();
  const [searchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedOrder, setSelectedOrder] = useState<PurchaseOrder | null>(null);
  const [showForm, setShowForm] = useState(false);

  const urlPoId = useMemo(() => {
    const fromPath = (poId || '').trim();
    const fromQuery = (searchParams.get('id') || '').trim();
    const raw = fromPath || fromQuery;
    const parsed = raw ? Number.parseInt(raw, 10) : NaN;
    return Number.isFinite(parsed) ? String(parsed) : null;
  }, [poId, searchParams]);

  const formatStatusLabel = (status: string) => {
    switch (status) {
      case 'Open':
        return 'Aberto';
      case 'In Progress':
        return 'Em andamento';
      case 'Completed':
        return 'Concluído';
      case 'Cancelled':
        return 'Cancelado';
      default:
        return status;
    }
  };

  const filteredOrders = mockPurchaseOrders.filter((order) => {
    const matchesSearch =
      order.po_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.supplier_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleOrderSelect = (order: PurchaseOrder) => {
    setSelectedOrder(order);
    navigate(`/compras/purchase-orders/${order.po_id}`);
  };

  useEffect(() => {
    if (!urlPoId) return;
    const order = mockPurchaseOrders.find((o) => String(o.po_id) === urlPoId) || null;
    if (!order) return;
    if (selectedOrder?.po_id === order.po_id) return;
    setSelectedOrder(order);
  }, [urlPoId, selectedOrder?.po_id]);

  const handleSaveOrder = (formData: PurchaseOrderFormData) => {
    console.log('Salvando pedido de compra:', formData);
    // Aqui você implementaria a lógica de salvar no backend
  };

  // Master Column Content
  const masterContent = (
    <>
      {/* Master Header */}
      <div className="border-b border-[var(--sapList_HeaderBorderColor)] p-4 bg-[var(--sapList_HeaderBackground)]">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-['72:Bold',sans-serif] text-base text-[var(--sapList_HeaderTextColor)]">
            Pedidos de Compra ({filteredOrders.length})
          </h2>
          <FioriButton
            variant="emphasized"
            icon={<Plus className="w-4 h-4" />}
            onClick={() => setShowForm(true)}
          >
            Novo pedido
          </FioriButton>
        </div>
        <div className="space-y-2">
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por número ou fornecedor..."
              className="w-full h-8 px-3 pr-8 text-sm bg-[var(--sapField_Background)] border border-[var(--sapField_BorderColor)] rounded outline-none focus:border-[var(--sapField_Focus_BorderColor)]"
            />
            <Search className="w-4 h-4 absolute right-2 top-2 text-[var(--sapContent_IconColor)]" />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="po-status-filter" className="text-[var(--sapContent_LabelColor)] text-xs font-['72:Regular',sans-serif]">Status</label>
            <select
              id="po-status-filter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-8 px-2 text-sm bg-[var(--sapField_Background)] border border-[var(--sapField_BorderColor)] rounded outline-none"
            >
              <option value="All">Todos os status</option>
              <option value="Open">Aberto</option>
              <option value="In Progress">Em andamento</option>
              <option value="Completed">Concluído</option>
              <option value="Cancelled">Cancelado</option>
            </select>
          </div>
        </div>
      </div>

      {/* Master List */}
      <div className="flex-1 overflow-y-auto">
        {filteredOrders.map((order) => {
          const isSelected = selectedOrder?.po_number === order.po_number;
          return (
            <button
              key={order.po_id}
              onClick={() => handleOrderSelect(order)}
              className={`w-full p-4 border-b border-[var(--sapList_BorderColor)] text-left hover:bg-[var(--sapList_HoverBackground)] transition-colors ${
                isSelected
                  ? 'bg-[var(--sapList_SelectionBackgroundColor)] border-l-2 border-l-[var(--sapList_SelectionBorderColor)]'
                  : ''
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="font-['72:Bold',sans-serif] text-sm text-[var(--sapLink_TextColor,#0a6ed1)]">
                  {order.po_number}
                </div>
                <FioriObjectStatus status={mapStatusToType(order.status)}>
                  {formatStatusLabel(order.status)}
                </FioriObjectStatus>
              </div>
              <div className="text-xs text-[var(--sapContent_LabelColor)] mb-1 font-['72:Regular',sans-serif]">
                {order.supplier_name}
              </div>
              <div className="text-xs text-[var(--sapContent_LabelColor)] font-['72:Regular',sans-serif]">
                {order.product} • {order.total_quantity_mt?.toLocaleString()} t
              </div>
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs text-[var(--sapContent_LabelColor)]">
                  {order.expected_delivery_date}
                </span>
                <span className="text-sm font-['72:Bold',sans-serif] text-[var(--sapNegativeColor,#bb0000)]">
                  US$ {((order.unit_price || 0) * (order.total_quantity_mt || 0) / 1000).toFixed(0)}K
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </>
  );

  // Detail Column Content
  const detailContent = selectedOrder ? (
    <div className="h-full overflow-y-auto">
      <div className="p-4 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <h1 className="font-['72:Black',sans-serif] text-2xl text-[var(--sapLink_TextColor,#0a6ed1)] m-0">
              {selectedOrder.po_number}
            </h1>
            <FioriObjectStatus status={mapStatusToType(selectedOrder.status)}>
              {formatStatusLabel(selectedOrder.status)}
            </FioriObjectStatus>
          </div>
          <div className="flex gap-2">
            <FioriButton variant="default">Editar</FioriButton>
            <FioriButton variant="ghost" icon={<Download className="w-4 h-4" />}>
              Exportar
            </FioriButton>
          </div>
        </div>

        {/* KPI Tiles */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <FioriTile
            title="Quantidade"
            value={`${selectedOrder.total_quantity_mt?.toLocaleString() || 0} t`}
            icon={<Package className="w-4 h-4" />}
          />
          <FioriTile
            title="Preço unitário"
            value={`US$ ${selectedOrder.unit_price?.toLocaleString() || 0}`}
            icon={<DollarSign className="w-4 h-4" />}
          />
          <FioriTile
            title="Custo total"
            value={`US$ ${((selectedOrder.unit_price || 0) * (selectedOrder.total_quantity_mt || 0) / 1000).toFixed(0)}K`}
            valueColor="negative"
            icon={<DollarSign className="w-4 h-4" />}
          />
          <FioriTile
            title="Data de entrega"
            value={selectedOrder.expected_delivery_date}
            icon={<Calendar className="w-4 h-4" />}
          />
        </div>

        {/* General Information */}
        <div className="bg-white rounded-lg shadow-sm p-4">
          <h3 className="font-['72:Bold',sans-serif] text-base text-[var(--sapTextColor,#32363a)] mb-4">Informações gerais</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-[var(--sapContent_LabelColor)] font-['72:Regular',sans-serif]">Fornecedor</label>
              <p className="font-['72:Regular',sans-serif] text-sm text-[var(--sapTextColor,#32363a)] mt-1">{selectedOrder.supplier_name}</p>
            </div>
            <div>
              <label className="text-xs text-[var(--sapContent_LabelColor)] font-['72:Regular',sans-serif]">Produto</label>
              <p className="font-['72:Regular',sans-serif] text-sm text-[var(--sapTextColor,#32363a)] mt-1">{selectedOrder.product}</p>
            </div>
            <div>
              <label className="text-xs text-[var(--sapContent_LabelColor)] font-['72:Regular',sans-serif]">Data do pedido</label>
              <p className="font-['72:Regular',sans-serif] text-sm text-[var(--sapTextColor,#32363a)] mt-1">{selectedOrder.po_date || '—'}</p>
            </div>
            <div>
              <label className="text-xs text-[var(--sapContent_LabelColor)] font-['72:Regular',sans-serif]">Entrega prevista</label>
              <p className="font-['72:Regular',sans-serif] text-sm text-[var(--sapTextColor,#32363a)] mt-1">{selectedOrder.expected_delivery_date}</p>
            </div>
            <div>
              <label className="text-xs text-[var(--sapContent_LabelColor)] font-['72:Regular',sans-serif]">Incoterm</label>
              <p className="font-['72:Regular',sans-serif] text-sm text-[var(--sapTextColor,#32363a)] mt-1">{selectedOrder.incoterm || '—'}</p>
            </div>
            <div>
              <label className="text-xs text-[var(--sapContent_LabelColor)] font-['72:Regular',sans-serif]">Condição de pagamento</label>
              <p className="font-['72:Regular',sans-serif] text-sm text-[var(--sapTextColor,#32363a)] mt-1">{selectedOrder.payment_terms || '—'}</p>
            </div>
          </div>
        </div>

        {/* Pricing Details */}
        <div className="bg-white rounded-lg shadow-sm p-4">
          <h3 className="font-['72:Bold',sans-serif] text-base text-[var(--sapTextColor,#32363a)] mb-4">Detalhes de preço</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center pb-2 border-b border-[var(--sapGroup_ContentBorderColor,#e5e5e5)]">
              <span className="text-sm text-[var(--sapContent_LabelColor)] font-['72:Regular',sans-serif]">Custo unitário</span>
              <span className="text-sm font-['72:Bold',sans-serif] text-[var(--sapTextColor,#32363a)]">
                US$ {selectedOrder.unit_price?.toLocaleString() || 0} / t
              </span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-[var(--sapGroup_ContentBorderColor,#e5e5e5)]">
              <span className="text-sm text-[var(--sapContent_LabelColor)] font-['72:Regular',sans-serif]">Quantidade</span>
              <span className="text-sm font-['72:Bold',sans-serif] text-[var(--sapTextColor,#32363a)]">
                {selectedOrder.total_quantity_mt?.toLocaleString() || 0} t
              </span>
            </div>
            <div className="flex justify-between items-center pt-2">
              <span className="text-base font-['72:Bold',sans-serif] text-[var(--sapTextColor,#32363a)]">Custo total</span>
              <span className="text-lg font-['72:Bold',sans-serif] text-[var(--sapNegativeColor,#bb0000)]">
                US$ {((selectedOrder.unit_price || 0) * (selectedOrder.total_quantity_mt || 0)).toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Related Deal */}
        {selectedOrder.deal_id && (
          <div className="bg-white rounded-lg shadow-sm p-4">
            <h3 className="font-['72:Bold',sans-serif] text-base text-[var(--sapTextColor,#32363a)] mb-3">Operação relacionada</h3>
            <div className="flex items-center justify-between">
              <span className="text-sm text-[var(--sapContent_LabelColor)] font-['72:Regular',sans-serif]">Identificador</span>
              <a
                href={`/financeiro/deals/${selectedOrder.deal_id}`}
                onClick={(e) => {
                  e.preventDefault();
                  navigate(`/financeiro/deals/${selectedOrder.deal_id}`);
                }}
                className="text-[var(--sapLink_TextColor,#0a6ed1)] hover:underline font-['72:Regular',sans-serif] text-sm"
              >
                {selectedOrder.deal_id}
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  ) : (
    <div className="flex items-center justify-center h-full text-[var(--sapContent_LabelColor)]">
      <div className="text-center">
        <Building2 className="w-12 h-12 mx-auto mb-3 text-[var(--sapContent_IconColor)]" />
        <p className="font-['72:Regular',sans-serif] text-base mb-2">Selecione um pedido de compra para visualizar os detalhes</p>
        <p className="font-['72:Regular',sans-serif] text-sm text-[var(--sapContent_LabelColor)]">Escolha um item na lista à esquerda</p>
      </div>
    </div>
  );

  return (
    <>
      <FioriFlexibleColumnLayout
        masterTitle="Pedidos de Compra"
        masterContent={masterContent}
        masterWidth={360}
        detailContent={detailContent}
      />
      {showForm && (
        <PurchaseOrderForm
          onClose={() => setShowForm(false)}
          onSave={handleSaveOrder}
        />
      )}
    </>
  );
}