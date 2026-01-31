import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { PurchaseOrderForm } from '../components/forms/PurchaseOrderForm';
import type { PurchaseOrder, PurchaseOrderCreate } from '../../types';
import { OrderStatus } from '../../types';
import { createPurchaseOrder, getPurchaseOrder, listPurchaseOrders } from '../../services/purchaseOrders.service';

import {
  BusyIndicator,
  Button,
  Card,
  FlexBox,
  FlexBoxAlignItems,
  FlexBoxDirection,
  FlexBoxJustifyContent,
  Form,
  FormItem,
  Input,
  Label,
  Link,
  List,
  MessageStrip,
  ObjectStatus,
  Option,
  Select,
  StandardListItem,
  Text,
  Title,
} from '@ui5/webcomponents-react';
import ValueState from '@ui5/webcomponents-base/dist/types/ValueState.js';

import { formatNumberAuto, formatNumberFixedNoGrouping } from '../ux/format';

export function PurchaseOrdersPage() {
  const navigate = useNavigate();
  const { poId } = useParams<{ poId?: string }>();
  const [searchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | OrderStatus>('All');
  const [selectedOrder, setSelectedOrder] = useState<PurchaseOrder | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [orders, setOrders] = useState<PurchaseOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const urlPoId = useMemo(() => {
    const fromPath = (poId || '').trim();
    const fromQuery = (searchParams.get('id') || '').trim();
    const raw = fromPath || fromQuery;
    const parsed = raw ? Number.parseInt(raw, 10) : NaN;
    return Number.isFinite(parsed) ? String(parsed) : null;
  }, [poId, searchParams]);

  const formatStatusLabel = (status: string) => {
    switch (status) {
      case OrderStatus.DRAFT:
        return 'Rascunho';
      case OrderStatus.ACTIVE:
        return 'Ativo';
      case OrderStatus.COMPLETED:
        return 'Concluído';
      case OrderStatus.CANCELLED:
        return 'Cancelado';
      default:
        return status;
    }
  };

  const statusValueState = (status: OrderStatus | string): ValueState => {
    switch (status) {
      case OrderStatus.ACTIVE:
        return ValueState.Positive;
      case OrderStatus.COMPLETED:
        return ValueState.Positive;
      case OrderStatus.CANCELLED:
        return ValueState.Negative;
      case OrderStatus.DRAFT:
        return ValueState.Information;
      default:
        return ValueState.None;
    }
  };

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const data = await listPurchaseOrders();
        if (cancelled) return;
        setOrders(data);
      } catch (e: any) {
        if (cancelled) return;
        setError(e?.message || 'Falha ao carregar pedidos de compra.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.po_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.supplier?.name || String(order.supplier_id)).toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleOrderSelect = (order: PurchaseOrder) => {
    setSelectedOrder(order);
    navigate(`/compras/purchase-orders/${order.id}`);
  };

  useEffect(() => {
    if (!urlPoId) return;
    const fromList = orders.find((o) => String(o.id) === urlPoId) || null;
    if (fromList) {
      if (selectedOrder?.id === fromList.id) return;
      setSelectedOrder(fromList);
      return;
    }
    let cancelled = false;
    async function loadOne() {
      try {
        const data = await getPurchaseOrder(Number(urlPoId));
        if (cancelled) return;
        setSelectedOrder(data);
      } catch {
        // ignore
      }
    }
    loadOne();
    return () => {
      cancelled = true;
    };
  }, [urlPoId, orders, selectedOrder?.id]);

  const handleSaveOrder = async (formData: PurchaseOrderCreate) => {
    const created = await createPurchaseOrder(formData);
    const refreshed = await listPurchaseOrders();
    setOrders(refreshed);
    setSelectedOrder(created);
    navigate(`/compras/purchase-orders/${created.id}`);
  };

  return (
    <>
      <div className="sap-fiori-page" style={{ height: '100%' }}>
        <FlexBox direction={FlexBoxDirection.Row} style={{ height: '100%' }}>
          {/* Master */}
          <FlexBox
            direction={FlexBoxDirection.Column}
            style={{ width: 360, height: '100%', borderRight: '1px solid var(--sapList_BorderColor)' }}
          >
            <Card style={{ borderRadius: 0 }}>
              <FlexBox
                direction={FlexBoxDirection.Column}
                style={{ padding: '1rem', borderBottom: '1px solid var(--sapList_BorderColor)' }}
              >
                <FlexBox
                  direction={FlexBoxDirection.Row}
                  justifyContent={FlexBoxJustifyContent.SpaceBetween}
                  alignItems={FlexBoxAlignItems.Center}
                  style={{ marginBottom: '0.75rem' }}
                >
                  <Title level="H3">Pedidos de Compra ({filteredOrders.length})</Title>
                  <Button design="Emphasized" onClick={() => setShowForm(true)}>
                    Novo pedido
                  </Button>
                </FlexBox>

                <FlexBox direction={FlexBoxDirection.Column} style={{ gap: '0.5rem' }}>
                  <FlexBox direction={FlexBoxDirection.Column} style={{ gap: '0.25rem' }}>
                    <Label>Busca</Label>
                    <Input
                      value={searchTerm}
                      onInput={(e) => setSearchTerm((e.target as HTMLInputElement).value)}
                      showClearIcon
                      placeholder=""
                    />
                  </FlexBox>

                  <FlexBox direction={FlexBoxDirection.Column} style={{ gap: '0.25rem' }}>
                    <Label>Status</Label>
                    <Select
                      value={String(statusFilter)}
                      onChange={(e) => setStatusFilter(((e.target as any).value || 'All') as 'All' | OrderStatus)}
                    >
                      <Option value="All">Todos os status</Option>
                      <Option value={OrderStatus.DRAFT}>Rascunho</Option>
                      <Option value={OrderStatus.ACTIVE}>Ativo</Option>
                      <Option value={OrderStatus.COMPLETED}>Concluído</Option>
                      <Option value={OrderStatus.CANCELLED}>Cancelado</Option>
                    </Select>
                  </FlexBox>
                </FlexBox>
              </FlexBox>
            </Card>

            {error ? (
              <MessageStrip design="Negative" hideCloseButton style={{ margin: '0.75rem' }}>
                {error}
              </MessageStrip>
            ) : null}

            <div style={{ flex: 1, overflow: 'auto' }}>
              {loading && orders.length === 0 ? (
                <FlexBox
                  direction={FlexBoxDirection.Row}
                  alignItems={FlexBoxAlignItems.Center}
                  justifyContent={FlexBoxJustifyContent.Center}
                  style={{ padding: '1rem' }}
                >
                  <BusyIndicator active size="M" />
                </FlexBox>
              ) : (
                <List noDataText="Nenhum pedido encontrado." selectionMode="SingleSelectMaster">
                  {filteredOrders.map((order) => {
                    const isSelected = selectedOrder?.id === order.id;
                    const supplierLabel = order.supplier?.name || `Fornecedor #${order.supplier_id}`;
                    const qtyLabel = `${formatNumberAuto(order.total_quantity_mt ?? 0)} t`;
                    const totalK = order.unit_price
                      ? `US$ ${formatNumberFixedNoGrouping(((order.unit_price || 0) * (order.total_quantity_mt || 0)) / 1000, 0, 'en-US')}K`
                      : '—';
                    return (
                      <StandardListItem
                        key={order.id}
                        selected={isSelected}
                        onClick={() => handleOrderSelect(order)}
                        description={`${supplierLabel} • ${order.product} • ${qtyLabel}`}
                        additionalText={totalK}
                        info={formatStatusLabel(order.status)}
                        infoState={statusValueState(order.status)}
                      >
                        {order.po_number}
                      </StandardListItem>
                    );
                  })}
                </List>
              )}
            </div>
          </FlexBox>

          {/* Detail */}
          <div style={{ flex: 1, overflow: 'auto' }}>
            {selectedOrder ? (
              <div style={{ padding: '1rem' }}>
                <FlexBox
                  direction={FlexBoxDirection.Row}
                  justifyContent={FlexBoxJustifyContent.SpaceBetween}
                  alignItems={FlexBoxAlignItems.Center}
                  style={{ marginBottom: '1rem' }}
                >
                  <FlexBox direction={FlexBoxDirection.Row} alignItems={FlexBoxAlignItems.Center} style={{ gap: '0.75rem' }}>
                    <Title level="H2">{selectedOrder.po_number}</Title>
                    <ObjectStatus state={statusValueState(selectedOrder.status)}>
                      {formatStatusLabel(selectedOrder.status)}
                    </ObjectStatus>
                  </FlexBox>
                  <FlexBox direction={FlexBoxDirection.Row} style={{ gap: '0.5rem' }}>
                    <Button design="Default" disabled>
                      Editar
                    </Button>
                    <Button design="Transparent" disabled>
                      Exportar
                    </Button>
                  </FlexBox>
                </FlexBox>

                <FlexBox direction={FlexBoxDirection.Row} style={{ gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                  <Card style={{ width: 240 }}>
                    <FlexBox direction={FlexBoxDirection.Column} style={{ padding: '0.75rem', gap: '0.25rem' }}>
                      <Label>Quantidade</Label>
                      <Text style={{ fontWeight: 700 }}>{formatNumberAuto(selectedOrder.total_quantity_mt ?? 0)} t</Text>
                    </FlexBox>
                  </Card>
                  <Card style={{ width: 240 }}>
                    <FlexBox direction={FlexBoxDirection.Column} style={{ padding: '0.75rem', gap: '0.25rem' }}>
                      <Label>Preço unitário</Label>
                      <Text style={{ fontWeight: 700 }}>
                        {selectedOrder.unit_price ? `US$ ${formatNumberAuto(selectedOrder.unit_price)}` : '—'}
                      </Text>
                    </FlexBox>
                  </Card>
                  <Card style={{ width: 240 }}>
                    <FlexBox direction={FlexBoxDirection.Column} style={{ padding: '0.75rem', gap: '0.25rem' }}>
                      <Label>Custo total</Label>
                      <Text style={{ fontWeight: 700 }}>
                        {selectedOrder.unit_price
                          ? `US$ ${formatNumberAuto((selectedOrder.unit_price || 0) * (selectedOrder.total_quantity_mt || 0))}`
                          : '—'}
                      </Text>
                    </FlexBox>
                  </Card>
                  <Card style={{ width: 240 }}>
                    <FlexBox direction={FlexBoxDirection.Column} style={{ padding: '0.75rem', gap: '0.25rem' }}>
                      <Label>Data de entrega</Label>
                      <Text style={{ fontWeight: 700 }}>{selectedOrder.expected_delivery_date ?? '—'}</Text>
                    </FlexBox>
                  </Card>
                </FlexBox>

                <Card style={{ marginBottom: '1rem' }}>
                  <FlexBox direction={FlexBoxDirection.Column} style={{ padding: '1rem', gap: '0.75rem' }}>
                    <Title level="H3">Informações gerais</Title>
                    <Form>
                      <FormItem labelContent={<Label>Fornecedor</Label>}>
                        <Text>{selectedOrder.supplier?.name || `Fornecedor #${selectedOrder.supplier_id}`}</Text>
                      </FormItem>
                      <FormItem labelContent={<Label>Produto</Label>}>
                        <Text>{selectedOrder.product || '—'}</Text>
                      </FormItem>
                      <FormItem labelContent={<Label>Data do pedido</Label>}>
                        <Text>{selectedOrder.created_at || '—'}</Text>
                      </FormItem>
                      <FormItem labelContent={<Label>Entrega prevista</Label>}>
                        <Text>{selectedOrder.expected_delivery_date || '—'}</Text>
                      </FormItem>
                    </Form>
                  </FlexBox>
                </Card>

                <Card style={{ marginBottom: '1rem' }}>
                  <FlexBox direction={FlexBoxDirection.Column} style={{ padding: '1rem', gap: '0.75rem' }}>
                    <Title level="H3">Detalhes de preço</Title>
                    <Form>
                      <FormItem labelContent={<Label>Preço unitário</Label>}>
                        <Text>{selectedOrder.unit_price ? `US$ ${formatNumberAuto(selectedOrder.unit_price)} / t` : '—'}</Text>
                      </FormItem>
                      <FormItem labelContent={<Label>Quantidade</Label>}>
                        <Text>{formatNumberAuto(selectedOrder.total_quantity_mt ?? 0)} t</Text>
                      </FormItem>
                      <FormItem labelContent={<Label>Total</Label>}>
                        <Text>
                          {selectedOrder.unit_price
                            ? `US$ ${formatNumberAuto((selectedOrder.unit_price || 0) * (selectedOrder.total_quantity_mt || 0))}`
                            : '—'}
                        </Text>
                      </FormItem>
                    </Form>
                  </FlexBox>
                </Card>

                {selectedOrder.deal_id ? (
                  <Card>
                    <FlexBox direction={FlexBoxDirection.Column} style={{ padding: '1rem', gap: '0.75rem' }}>
                      <Title level="H3">Operação relacionada</Title>
                      <Form>
                        <FormItem labelContent={<Label>Identificador</Label>}>
                          <Link
                            href={`/financeiro/deals/${selectedOrder.deal_id}`}
                            onClick={(e) => {
                              e.preventDefault();
                              navigate(`/financeiro/deals/${selectedOrder.deal_id}`);
                            }}
                          >
                            {String(selectedOrder.deal_id)}
                          </Link>
                        </FormItem>
                      </Form>
                    </FlexBox>
                  </Card>
                ) : null}
              </div>
            ) : (
              <FlexBox
                direction={FlexBoxDirection.Column}
                alignItems={FlexBoxAlignItems.Center}
                justifyContent={FlexBoxJustifyContent.Center}
                style={{ height: '100%', padding: '2rem', opacity: 0.8 }}
              >
                <Title level="H3">Selecione um pedido de compra</Title>
                <Text>Escolha um item na lista à esquerda.</Text>
              </FlexBox>
            )}
          </div>
        </FlexBox>
      </div>
      {showForm && (
        <PurchaseOrderForm
          onClose={() => setShowForm(false)}
          onSave={handleSaveOrder}
        />
      )}
    </>
  );
}