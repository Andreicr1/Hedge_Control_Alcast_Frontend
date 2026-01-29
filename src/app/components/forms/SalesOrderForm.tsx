import { useEffect, useMemo, useState } from 'react';
import { Save, X } from 'lucide-react';
import { FioriButton } from '../fiori/FioriButton';
import { FioriInput } from '../fiori/FioriInput';
import { FioriSelect } from '../fiori/FioriSelect';
import { DealCommercialStatus, OrderStatus, PriceType } from '../../../types';
import type { Customer, Deal, DealCreate, SalesOrderCreate } from '../../../types';
import { listCustomers } from '../../../services/customers.service';
import { createDeal, listDeals } from '../../../services/deals.service';

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
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--sapList_BorderColor)]">
          <h2 className="font-['72:Bold',sans-serif] text-xl text-[#131e29]">Nova Sales Order</h2>
          <button
            onClick={onClose}
            className="text-[var(--sapContent_IconColor)] hover:text-[#131e29] transition-colors"
            type="button"
            aria-label="Fechar"
            title="Fechar"
            disabled={saving}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {error && (
            <div className="p-3 rounded border border-[var(--sapField_InvalidColor,#bb0000)] text-[var(--sapField_InvalidColor,#bb0000)] text-sm">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FioriSelect
              label="Deal"
              value={dealId}
              onChange={(e) => setDealId(e.target.value)}
              options={dealOptions}
              disabled={loadingDeals || saving}
              required
            />

            {dealId === '__new__' && (
              <>
                <FioriInput
                  label="Deal (referência)"
                  value={newDealReferenceName}
                  onChange={(e) => setNewDealReferenceName(e.target.value)}
                  placeholder="Ex.: AB-ALU-Q1-2026"
                  disabled={saving}
                />

                <FioriInput
                  label="Empresa"
                  value={newDealCompany}
                  onChange={(e) => setNewDealCompany(e.target.value)}
                  placeholder="Ex.: Alcast Brasil"
                  disabled={saving}
                />

                <FioriInput
                  label="Período econômico"
                  value={newDealEconomicPeriod}
                  onChange={(e) => setNewDealEconomicPeriod(e.target.value)}
                  placeholder="Ex.: 2026-Q1"
                  disabled={saving}
                />
              </>
            )}

            <FioriSelect
              label="Cliente"
              value={customerId}
              onChange={(e) => setCustomerId(e.target.value)}
              options={customerOptions}
              disabled={loadingCustomers || saving}
              required
            />

            <FioriSelect
              label="Status"
              value={status}
              onChange={(e) => setStatus(e.target.value as OrderStatus)}
              options={[
                { value: OrderStatus.DRAFT, label: 'Rascunho' },
                { value: OrderStatus.ACTIVE, label: 'Ativo' },
                { value: OrderStatus.COMPLETED, label: 'Concluído' },
                { value: OrderStatus.CANCELLED, label: 'Cancelado' },
              ]}
              disabled={saving}
            />

            <FioriInput
              label="Produto"
              value={product}
              onChange={(e) => setProduct(e.target.value)}
              placeholder="Ex.: Aluminum"
              disabled={saving}
            />

            <FioriInput
              label="Quantidade (MT)"
              type="number"
              value={quantityMt}
              onChange={(e) => setQuantityMt(e.target.value)}
              placeholder="0"
              disabled={saving}
              required
            />

            <FioriInput
              label="Entrega prevista"
              type="date"
              value={expectedDeliveryDate}
              onChange={(e) => setExpectedDeliveryDate(e.target.value)}
              disabled={saving}
            />
          </div>

          <div className="border-t border-[var(--sapGroup_ContentBorderColor,#e5e5e5)] pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FioriSelect
                label="PriceType"
                value={pricingType}
                onChange={(e) => setPricingType(e.target.value as PriceTypeUi)}
                options={priceTypeOptions}
                disabled={saving}
                required
              />

              {pricingType === PriceType.FIX && (
                <FioriInput
                  label="Preço unitário (USD/t)"
                  type="number"
                  value={unitPrice}
                  onChange={(e) => setUnitPrice(e.target.value)}
                  disabled={saving}
                  required
                />
              )}

              {pricingType === PriceType.C2R && (
                <FioriInput
                  label="Fixing date (C2R)"
                  type="date"
                  value={fixingDeadline}
                  onChange={(e) => setFixingDeadline(e.target.value)}
                  disabled={saving}
                  required
                />
              )}

              {pricingType === PriceType.AVG && (
                <>
                  <FioriSelect
                    label="Mês"
                    value={avgMonth}
                    onChange={(e) => setAvgMonth(e.target.value)}
                    options={[{ value: '', label: 'Selecione...' }, ...MONTH_OPTIONS]}
                    disabled={saving}
                    required
                  />
                  <FioriSelect
                    label="Ano"
                    value={avgYear}
                    onChange={(e) => setAvgYear(e.target.value)}
                    options={yearOptions}
                    disabled={saving}
                    required
                  />
                </>
              )}

              {pricingType === PriceType.AVG_INTER && (
                <>
                  <FioriInput
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
              htmlFor="sales-order-notes"
              className="font-['72:Regular',sans-serif] text-[14px] text-[var(--sapContent_LabelColor,#556b82)] leading-[normal]"
            >
              Observações
            </label>
            <textarea
              id="sales-order-notes"
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
