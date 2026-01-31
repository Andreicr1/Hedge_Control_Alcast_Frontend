import { useEffect, useMemo, useState } from 'react';
import { DealCommercialStatus, OrderStatus, PriceType } from '../../../types';
import type { Deal, DealCreate, PurchaseOrderCreate, Supplier } from '../../../types';
import { createDeal, listDeals } from '../../../services/deals.service';
import { listSuppliers } from '../../../services/suppliers.service';

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

interface PurchaseOrderFormProps {
  onClose: () => void;
  onSave: (formData: PurchaseOrderCreate) => void | Promise<void>;
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

export function PurchaseOrderForm({ onClose, onSave }: PurchaseOrderFormProps) {
  const [saving, setSaving] = useState(false);
  const [loadingSuppliers, setLoadingSuppliers] = useState(false);
  const [loadingDeals, setLoadingDeals] = useState(false);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [supplierId, setSupplierId] = useState('');
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

  const supplierOptions = useMemo(() => {
    return [
      { value: '', label: loadingSuppliers ? 'Carregando...' : 'Selecione...' },
      ...suppliers.map((s) => ({ value: String(s.id), label: s.trade_name || s.name })),
    ];
  }, [loadingSuppliers, suppliers]);

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
      setError(null);

      setLoadingSuppliers(true);
      try {
        const result = await listSuppliers();
        setSuppliers(result);
      } catch {
        setError('Falha ao carregar fornecedores.');
      } finally {
        setLoadingSuppliers(false);
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

    if (!isNonEmpty(supplierId)) {
      setError('Selecione um fornecedor.');
      return;
    }

    if (!isNonEmpty(dealId)) {
      setError('Selecione um Deal (ou crie um novo).');
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
          <Dialog
            open
            headerText="Nova Purchase Order"
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
                <FormItem labelContent={<Label>Fornecedor</Label>}>
                  <Select
                    value={supplierId}
                    onChange={(e) => setSupplierId(String((e.target as any).value || ''))}
                    disabled={loadingSuppliers || saving}
                  >
                    {supplierOptions.map((o) => (
                      <Option key={o.value} value={o.value}>
                        {o.label}
                      </Option>
                    ))}
                  </Select>
                </FormItem>

                <FormItem labelContent={<Label>Deal</Label>}>
                  <Select
                    value={dealId}
                    onChange={(e) => setDealId(String((e.target as any).value || ''))}
                    disabled={loadingDeals || saving}
                  >
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

                <FormItem labelContent={<Label>Status</Label>}>
                  <Select
                    value={status}
                    onChange={(e) => setStatus(String((e.target as any).value || OrderStatus.DRAFT) as OrderStatus)}
                    disabled={saving}
                  >
                    <Option value={OrderStatus.DRAFT}>Rascunho</Option>
                    <Option value={OrderStatus.ACTIVE}>Ativo</Option>
                    <Option value={OrderStatus.COMPLETED}>Concluído</Option>
                    <Option value={OrderStatus.CANCELLED}>Cancelado</Option>
                  </Select>
                </FormItem>

                <FormItem labelContent={<Label>PriceType</Label>}>
                  <Select
                    value={pricingType}
                    onChange={(e) => setPricingType(String((e.target as any).value || '') as PriceTypeUi)}
                    disabled={saving}
                  >
                    {priceTypeOptions.map((o) => (
                      <Option key={o.value} value={o.value}>
                        {o.label}
                      </Option>
                    ))}
                  </Select>
                </FormItem>

                {pricingType === PriceType.FIX ? (
                  <FormItem labelContent={<Label>Preço unitário</Label>}>
                    <Input
                      value={unitPrice}
                      type={InputType.Number}
                      onInput={(e) => setUnitPrice((e.target as HTMLInputElement).value)}
                      disabled={saving}
                      placeholder=""
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
                    <FormItem labelContent={<Label>AVGInter (data inicial)</Label>}>
                      <DatePicker
                        value={avgInterStart}
                        onChange={(e) => setAvgInterStart(String((e.target as any).value || ''))}
                        disabled={saving}
                      />
                    </FormItem>
                    <FormItem labelContent={<Label>AVGInter (data final)</Label>}>
                      <DatePicker
                        value={avgInterEnd}
                        onChange={(e) => setAvgInterEnd(String((e.target as any).value || ''))}
                        disabled={saving}
                      />
                    </FormItem>
                  </>
                ) : null}

                {pricingType === PriceType.C2R ? (
                  <FormItem labelContent={<Label>C2R (fixing date)</Label>}>
                    <DatePicker
                      value={fixingDeadline}
                      onChange={(e) => setFixingDeadline(String((e.target as any).value || ''))}
                      disabled={saving}
                    />
                  </FormItem>
                ) : null}

                <FormItem labelContent={<Label>Notas</Label>}>
                  <TextArea
                    value={notes}
                    onInput={(e) => setNotes((e.target as any).value)}
                    disabled={saving}
                    growing
                    rows={3}
                  />
                </FormItem>
              </Form>

              <div style={{ marginTop: '0.75rem', opacity: 0.75 }}>
                <Title level="H6">Validação</Title>
                <Text>{pricingType ? `pricing_period: ${pricingPeriod || '—'}` : 'Selecione um PriceType para calcular o período.'}</Text>
              </div>
            </div>
          </Dialog>
                    label="Start date"
                    type="date"
                    value={avgInterStart}
                    onChange={(e) => setAvgInterStart(e.target.value)}
                    disabled={saving}
                    required
                  />
                  <FioriInput
                    label="End date"
                    type="date"
                    value={avgInterEnd}
                    onChange={(e) => setAvgInterEnd(e.target.value)}
                    disabled={saving}
                    required
                  />
                </>
              )}
            </div>
          </div>

          <div>
            <label
              htmlFor="purchase-order-notes"
              className="font-['72:Regular',sans-serif] text-[14px] text-[var(--sapContent_LabelColor,#556b82)] leading-[normal]"
            >
              Observações
            </label>
            <textarea
              id="purchase-order-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full mt-1 px-3 py-2 bg-[var(--sapField_Background,#ffffff)] border border-[var(--sapField_BorderColor,#89919a)] rounded-[4px] font-['72:Regular',sans-serif] text-[14px] text-[var(--sapField_TextColor,#131e29)]"
              rows={3}
              disabled={saving}
            />
          </div>
        </div>

        <div className="px-6 py-4 border-t border-[var(--sapList_BorderColor)] flex justify-end gap-2">
          <FioriButton variant="ghost" onClick={onClose} type="button" disabled={saving}>
            Cancelar
          </FioriButton>
          <FioriButton
            variant="emphasized"
            icon={<Save className="w-4 h-4" />}
            onClick={() => {
              void handleSubmit();
            }}
            type="button"
            disabled={saving}
          >
            Salvar
          </FioriButton>
        </div>
      </div>
    </div>
  );
}
