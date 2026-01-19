import { useEffect, useMemo, useState } from 'react';
import { Save, X } from 'lucide-react';
import { FioriButton } from '../fiori/FioriButton';
import { FioriInput } from '../fiori/FioriInput';
import { FioriSelect } from '../fiori/FioriSelect';
import { OrderStatus, PriceType } from '../../../types';
import type { Deal, PurchaseOrderCreate, Supplier } from '../../../types';
import { listDeals } from '../../../services/deals.service';
import { listSuppliers } from '../../../services/suppliers.service';

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
      { value: '', label: loadingDeals ? 'Carregando...' : 'Sem deal (opcional)' },
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

    const payload: PurchaseOrderCreate = {
      supplier_id: Number(supplierId),
      deal_id: isNonEmpty(dealId) ? Number(dealId) : undefined,
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
      setError('Falha ao salvar Purchase Order.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--sapList_BorderColor)]">
          <h2 className="font-['72:Bold',sans-serif] text-xl text-[#131e29]">Nova Purchase Order</h2>
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
              label="Fornecedor"
              value={supplierId}
              onChange={(e) => setSupplierId(e.target.value)}
              options={supplierOptions}
              disabled={loadingSuppliers || saving}
              required
            />
            <FioriSelect
              label="Deal (opcional)"
              value={dealId}
              onChange={(e) => setDealId(e.target.value)}
              options={dealOptions}
              disabled={loadingDeals || saving}
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
