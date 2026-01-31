import { useEffect, useMemo, useState } from 'react';
import { DealCommercialStatus, OrderStatus, PriceType } from '../../../types';
import type { Customer, Deal, DealCreate, SalesOrderCreate } from '../../../types';
import { listCustomers } from '../../../services/customers.service';
import { createDeal, listDeals } from '../../../services/deals.service';

import {
  Bar,
  Button,
  DatePicker,
  Dialog,
  FlexBox,
  FlexBoxDirection,
  Form,
  FormItem,
  Input,
  Label,
  MessageStrip,
  Option,
  Select,
  Text,
  TextArea,
  Title,
} from '@ui5/webcomponents-react';
import InputType from '@ui5/webcomponents-base/dist/types/InputType.js';

interface SalesOrderFormProps {
  onClose: () => void;
  onSave: (formData: SalesOrderCreate) => void | Promise<void>;
}

type PriceTypeUi = PriceType | '';

const MONTH_OPTIONS: Array<{ value: string; label: string }> = [
  { value: '01', label: 'Jan' },
  { value: '02', label: 'Fev' },
  { value: '03', label: 'Mar' },
  { value: '04', label: 'Abr' },
  { value: '05', label: 'Mai' },
  { value: '06', label: 'Jun' },
  { value: '07', label: 'Jul' },
  { value: '08', label: 'Ago' },
  { value: '09', label: 'Set' },
  { value: '10', label: 'Out' },
  { value: '11', label: 'Nov' },
  { value: '12', label: 'Dez' },
];

function isNonEmpty(value: string): boolean {
  return value.trim().length > 0;
}

export function SalesOrderForm({ onClose, onSave }: SalesOrderFormProps) {
  const [saving, setSaving] = useState(false);
  const [loadingCustomers, setLoadingCustomers] = useState(false);
  const [loadingDeals, setLoadingDeals] = useState(false);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [customerId, setCustomerId] = useState('');
  const [dealId, setDealId] = useState('');
  const [newDealReferenceName, setNewDealReferenceName] = useState('');
  const [newDealCompany, setNewDealCompany] = useState('');
  const [newDealEconomicPeriod, setNewDealEconomicPeriod] = useState('');
  const [product, setProduct] = useState('');
  const [quantityMt, setQuantityMt] = useState('');
  const [expectedDeliveryDate, setExpectedDeliveryDate] = useState('');
  const [status, setStatus] = useState<OrderStatus>(OrderStatus.DRAFT);
  const [notes, setNotes] = useState('');

  const [pricingType, setPricingType] = useState<PriceTypeUi>('');
  const [unitPrice, setUnitPrice] = useState('');
  const [avgMonth, setAvgMonth] = useState('');
  const [avgYear, setAvgYear] = useState(String(new Date().getFullYear()));
  const [avgInterStart, setAvgInterStart] = useState('');
  const [avgInterEnd, setAvgInterEnd] = useState('');
  const [fixingDeadline, setFixingDeadline] = useState('');

  const yearOptions = useMemo(() => {
    const y = new Date().getFullYear();
    const years = [y - 1, y, y + 1, y + 2];
    return years.map((year) => ({ value: String(year), label: String(year) }));
  }, []);

  const priceTypeOptions = useMemo(
    () =>
      [
        { value: '', label: 'Selecione...' },
        { value: PriceType.AVG, label: 'Média mensal (AVG)' },
        { value: PriceType.AVG_INTER, label: 'Média entre datas (AVGInter)' },
        { value: PriceType.FIX, label: 'Preço fixo (Fix)' },
        { value: PriceType.C2R, label: 'Fechamento até referência (C2R)' },
      ] as Array<{ value: string; label: string }>,
    []
  );

  const customerOptions = useMemo(() => {
    return [
      { value: '', label: loadingCustomers ? 'Carregando...' : 'Selecione...' },
      ...customers.map((c) => ({ value: String(c.id), label: c.trade_name || c.name })),
    ];
  }, [customers, loadingCustomers]);

  const dealOptions = useMemo(() => {
    return [
      { value: '', label: loadingDeals ? 'Carregando...' : 'Selecione...' },
      { value: '__new__', label: 'Criar novo Deal...' },
      ...deals.map((d) => ({ value: String(d.id), label: d.reference_name || d.deal_uuid })),
    ];
  }, [deals, loadingDeals]);

  const pricingPeriod = useMemo(() => {
    if (pricingType === PriceType.AVG) {
      if (!isNonEmpty(avgYear) || !isNonEmpty(avgMonth)) return '';
      return `${avgYear}-${avgMonth}`;
    }
    if (pricingType === PriceType.AVG_INTER) {
      if (!isNonEmpty(avgInterStart) || !isNonEmpty(avgInterEnd)) return '';
      return `${avgInterStart}..${avgInterEnd}`;
    }
    return '';
  }, [avgInterEnd, avgInterStart, avgMonth, avgYear, pricingType]);

  useEffect(() => {
    void (async () => {
      setLoadingCustomers(true);
      setError(null);
      try {
        const result = await listCustomers();
        setCustomers(result);
      } catch {
        setError('Falha ao carregar clientes.');
      } finally {
        setLoadingCustomers(false);
      }

      setLoadingDeals(true);
      try {
        const result = await listDeals();
        setDeals(result);
      } catch {
        setError((prev) => prev || 'Falha ao carregar deals.');
      } finally {
        setLoadingDeals(false);
      }
    })();
  }, []);

  async function handleSubmit(): Promise<void> {
    setError(null);

    if (!isNonEmpty(dealId)) {
      setError('Selecione um Deal (ou crie um novo).');
      return;
    }

    if (!isNonEmpty(customerId)) {
      setError('Selecione um cliente.');
      return;
    }

    const quantity = Number(quantityMt);
    if (!Number.isFinite(quantity) || quantity <= 0) {
      setError('Quantidade (MT) inválida.');
      return;
    }

    if (!pricingType) {
      setError('Selecione um PriceType.');
      return;
    }

    if (pricingType === PriceType.FIX) {
      const price = Number(unitPrice);
      if (!Number.isFinite(price) || price <= 0) {
        setError('Fix exige preço unitário válido.');
        return;
      }
    }

    if (pricingType === PriceType.AVG && !isNonEmpty(pricingPeriod)) {
      setError('AVG exige mês/ano.');
      return;
    }

    if (pricingType === PriceType.AVG_INTER) {
      if (!isNonEmpty(pricingPeriod)) {
        setError('AVGInter exige start/end date.');
        return;
      }
      if (avgInterStart > avgInterEnd) {
        setError('AVGInter: start date deve ser <= end date.');
        return;
      }
    }

    if (pricingType === PriceType.C2R && !isNonEmpty(fixingDeadline)) {
      setError('C2R exige fixing date.');
      return;
    }

    let resolvedDealId: number | null = null;
    if (dealId === '__new__') {
      const dealPayload: DealCreate = {
        reference_name: isNonEmpty(newDealReferenceName) ? newDealReferenceName : null,
        commodity: isNonEmpty(product) ? product : null,
        company: isNonEmpty(newDealCompany) ? newDealCompany : null,
        economic_period: isNonEmpty(newDealEconomicPeriod) ? newDealEconomicPeriod : null,
        commercial_status: DealCommercialStatus.ACTIVE,
        currency: 'USD',
      };
      try {
        const created = await createDeal(dealPayload);
        resolvedDealId = created.id;
      } catch {
        setError('Falha ao criar Deal.');
        return;
      }
    } else {
      const parsed = Number(dealId);
      if (!Number.isFinite(parsed) || parsed <= 0) {
        setError('Deal inválido.');
        return;
      }
      resolvedDealId = parsed;
    }

    const payload: SalesOrderCreate = {
      deal_id: resolvedDealId,
      customer_id: Number(customerId),
      product: isNonEmpty(product) ? product : undefined,
      total_quantity_mt: quantity,
      unit: 'MT',
      pricing_type: pricingType as PriceType,
      pricing_period: isNonEmpty(pricingPeriod) ? pricingPeriod : undefined,
      unit_price: pricingType === PriceType.FIX ? Number(unitPrice) : undefined,
      fixing_deadline: pricingType === PriceType.C2R ? fixingDeadline : undefined,
      expected_delivery_date: isNonEmpty(expectedDeliveryDate) ? expectedDeliveryDate : undefined,
      status,
      notes: isNonEmpty(notes) ? notes : undefined,
    };

    setSaving(true);
    try {
      await onSave(payload);
      onClose();
    } catch {
      setError('Falha ao salvar Sales Order.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog
      open
      headerText="Nova Sales Order"
      showCloseButton
      onAfterClose={onClose}
      footer={
        <Bar
          endContent={
            <FlexBox direction={FlexBoxDirection.Row} style={{ gap: '0.5rem' }}>
              <Button design="Transparent" onClick={onClose} disabled={saving}>
                Cancelar
              </Button>
              <Button design="Emphasized" onClick={() => void handleSubmit()} disabled={saving}>
                {saving ? 'Salvando...' : 'Salvar'}
              </Button>
            </FlexBox>
          }
        />
      }
    >
      <div style={{ padding: '1rem' }}>
        {error ? (
          <MessageStrip design="Negative" hideCloseButton style={{ marginBottom: '1rem' }}>
            {error}
          </MessageStrip>
        ) : null}

        <Form>
          <FormItem labelContent={<Label>Deal</Label>}>
            <Select value={dealId} onChange={(e) => setDealId(String((e.target as any).value || ''))} disabled={loadingDeals || saving}>
              {dealOptions.map((o) => (
                <Option key={o.value} value={o.value}>
                  {o.label}
                </Option>
              ))}
            </Select>
          </FormItem>

          {dealId === '__new__' ? (
            <>
              <FormItem labelContent={<Label>Deal (referência)</Label>}>
                <FlexBox direction={FlexBoxDirection.Column} style={{ gap: '0.25rem', width: '100%' }}>
                  <Input
                    value={newDealReferenceName}
                    onInput={(e) => setNewDealReferenceName((e.target as HTMLInputElement).value)}
                    disabled={saving}
                    placeholder=""
                  />
                  <Text style={{ opacity: 0.75, fontSize: '0.8125rem' }}>Ex.: AB-ALU-Q1-2026</Text>
                </FlexBox>
              </FormItem>

              <FormItem labelContent={<Label>Empresa</Label>}>
                <Input
                  value={newDealCompany}
                  onInput={(e) => setNewDealCompany((e.target as HTMLInputElement).value)}
                  disabled={saving}
                  placeholder=""
                />
              </FormItem>

              <FormItem labelContent={<Label>Período econômico</Label>}>
                <Input
                  value={newDealEconomicPeriod}
                  onInput={(e) => setNewDealEconomicPeriod((e.target as HTMLInputElement).value)}
                  disabled={saving}
                  placeholder=""
                />
              </FormItem>
            </>
          ) : null}

          <FormItem labelContent={<Label>Cliente</Label>}>
            <Select
              value={customerId}
              onChange={(e) => setCustomerId(String((e.target as any).value || ''))}
              disabled={loadingCustomers || saving}
            >
              {customerOptions.map((o) => (
                <Option key={o.value} value={o.value}>
                  {o.label}
                </Option>
              ))}
            </Select>
          </FormItem>

          <FormItem labelContent={<Label>Status</Label>}>
            <Select value={status} onChange={(e) => setStatus(String((e.target as any).value || OrderStatus.DRAFT) as OrderStatus)} disabled={saving}>
              <Option value={OrderStatus.DRAFT}>Rascunho</Option>
              <Option value={OrderStatus.ACTIVE}>Ativo</Option>
              <Option value={OrderStatus.COMPLETED}>Concluído</Option>
              <Option value={OrderStatus.CANCELLED}>Cancelado</Option>
            </Select>
          </FormItem>

          <FormItem labelContent={<Label>Produto</Label>}>
            <Input value={product} onInput={(e) => setProduct((e.target as HTMLInputElement).value)} disabled={saving} placeholder="" />
          </FormItem>

          <FormItem labelContent={<Label>Quantidade (MT)</Label>}>
            <Input
              value={quantityMt}
              type={InputType.Number}
              onInput={(e) => setQuantityMt((e.target as HTMLInputElement).value)}
              disabled={saving}
              placeholder=""
            />
          </FormItem>

          <FormItem labelContent={<Label>Entrega prevista</Label>}>
            <DatePicker
              value={expectedDeliveryDate}
              onChange={(e) => setExpectedDeliveryDate(String((e.target as any).value || ''))}
              disabled={saving}
            />
          </FormItem>

          <FormItem labelContent={<Label>PriceType</Label>}>
            <Select value={pricingType} onChange={(e) => setPricingType(String((e.target as any).value || '') as PriceTypeUi)} disabled={saving}>
              {priceTypeOptions.map((o) => (
                <Option key={o.value} value={o.value}>
                  {o.label}
                </Option>
              ))}
            </Select>
          </FormItem>

          {pricingType === PriceType.FIX ? (
            <FormItem labelContent={<Label>Preço unitário (USD/t)</Label>}>
              <Input
                value={unitPrice}
                type={InputType.Number}
                onInput={(e) => setUnitPrice((e.target as HTMLInputElement).value)}
                disabled={saving}
                placeholder=""
              />
            </FormItem>
          ) : null}

          {pricingType === PriceType.C2R ? (
            <FormItem labelContent={<Label>Fixing date (C2R)</Label>}>
              <DatePicker
                value={fixingDeadline}
                onChange={(e) => setFixingDeadline(String((e.target as any).value || ''))}
                disabled={saving}
              />
            </FormItem>
          ) : null}

          {pricingType === PriceType.AVG ? (
            <>
              <FormItem labelContent={<Label>Mês</Label>}>
                <Select value={avgMonth} onChange={(e) => setAvgMonth(String((e.target as any).value || ''))} disabled={saving}>
                  <Option value="">Selecione...</Option>
                  {MONTH_OPTIONS.map((m) => (
                    <Option key={m.value} value={m.value}>
                      {m.label}
                    </Option>
                  ))}
                </Select>
              </FormItem>
              <FormItem labelContent={<Label>Ano</Label>}>
                <Select value={avgYear} onChange={(e) => setAvgYear(String((e.target as any).value || ''))} disabled={saving}>
                  {yearOptions.map((y) => (
                    <Option key={y.value} value={y.value}>
                      {y.label}
                    </Option>
                  ))}
                </Select>
              </FormItem>
            </>
          ) : null}

          {pricingType === PriceType.AVG_INTER ? (
            <>
              <FormItem labelContent={<Label>Start date</Label>}>
                <DatePicker
                  value={avgInterStart}
                  onChange={(e) => setAvgInterStart(String((e.target as any).value || ''))}
                  disabled={saving}
                />
              </FormItem>
              <FormItem labelContent={<Label>End date</Label>}>
                <DatePicker
                  value={avgInterEnd}
                  onChange={(e) => setAvgInterEnd(String((e.target as any).value || ''))}
                  disabled={saving}
                />
              </FormItem>
            </>
          ) : null}

          <FormItem labelContent={<Label>Observações</Label>}>
            <TextArea value={notes} onInput={(e) => setNotes((e.target as any).value)} disabled={saving} growing rows={3} />
          </FormItem>
        </Form>

        <div style={{ marginTop: '0.75rem', opacity: 0.75 }}>
          <Title level="H6">Validação</Title>
          <Text>{pricingType ? `pricing_period: ${pricingPeriod || '—'}` : 'Selecione um PriceType para calcular o período.'}</Text>
        </div>
      </div>
    </Dialog>
  );
}
