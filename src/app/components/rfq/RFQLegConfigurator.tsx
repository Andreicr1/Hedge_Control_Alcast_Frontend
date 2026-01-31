/**
 * RFQLegConfigurator Component
 * 
 * Configurador de leg individual para RFQ.
 * Permite configurar: side, price_type, datas, quantidade
 */

import React from 'react';
import {
  Button,
  Card,
  DatePicker,
  Input,
  Label,
  Option,
  Select,
  Title,
} from '@ui5/webcomponents-react';
import { RfqSide, RfqPriceType } from '../../../types/enums';
import type { RfqLegInput } from '../../../types/models';

interface RFQLegConfiguratorProps {
  leg: Partial<RfqLegInput>;
  legIndex: number;
  onChange: (legIndex: number, updates: Partial<RfqLegInput>) => void;
  onRemove?: (legIndex: number) => void;
  showRemoveButton?: boolean;
  disabled?: boolean;
}

const PRICE_TYPE_LABELS: Record<RfqPriceType, string> = {
  [RfqPriceType.AVG]: 'Média Mensal (AVG)',
  [RfqPriceType.AVG_INTER]: 'Média Inter-Mês (AVGInter)',
  [RfqPriceType.FIX]: 'Preço Fixo (Fix)',
  [RfqPriceType.C2R]: 'Close to Ref (C2R)',
};

const SIDE_LABELS: Record<RfqSide, string> = {
  [RfqSide.BUY]: 'Compra (Buy)',
  [RfqSide.SELL]: 'Venda (Sell)',
};

export const RFQLegConfigurator: React.FC<RFQLegConfiguratorProps> = ({
  leg,
  legIndex,
  onChange,
  onRemove,
  showRemoveButton = false,
  disabled = false,
}) => {
  return (
    <Card className="mb-4">
      <div style={{ padding: '0.75rem' }}>
        <div className="flex justify-between items-center">
          <Title level="H5">
            Leg {legIndex + 1}
            {leg.side ? (
              <span className="ml-2 text-sm font-normal" style={{ opacity: 0.75 }}>
                - {SIDE_LABELS[leg.side]}
              </span>
            ) : null}
          </Title>

          {showRemoveButton && onRemove ? (
            <Button
              design="Transparent"
              icon="delete"
              onClick={() => onRemove(legIndex)}
              disabled={disabled}
            >
              Remover
            </Button>
          ) : null}
        </div>

        <div className="mt-4 space-y-4">
        {/* Linha 1: Side + Price Type */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Lado da Operação *</Label>
            <Select
              value={String(leg.side ?? '')}
              onChange={(e) => onChange(legIndex, { side: (String((e.target as any).value || '') as RfqSide) || undefined })}
              disabled={disabled}
            >
              <Option value="">—</Option>
              {Object.entries(SIDE_LABELS).map(([value, label]) => (
                <Option key={value} value={value}>
                  {label}
                </Option>
              ))}
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Tipo de Preço *</Label>
            <Select
              value={String(leg.price_type ?? '')}
              onChange={(e) =>
                onChange(legIndex, {
                  price_type: (String((e.target as any).value || '') as RfqPriceType) || undefined,
                })
              }
              disabled={disabled}
            >
              <Option value="">—</Option>
              {Object.entries(PRICE_TYPE_LABELS).map(([value, label]) => (
                <Option key={value} value={value}>
                  {label}
                </Option>
              ))}
            </Select>
          </div>
        </div>

        {/* Linha 2: Quantidade + Datas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>Quantidade (MT) *</Label>
            <Input
              type="Number"
              value={leg.quantity_mt === 0 || typeof leg.quantity_mt === 'number' ? String(leg.quantity_mt) : ''}
              onInput={(e) => {
                const raw = String((e.target as any).value || '').trim();
                if (raw === '') {
                  onChange(legIndex, { quantity_mt: undefined });
                  return;
                }
                const qty = Number.parseFloat(raw);
                if (Number.isFinite(qty) && qty >= 0) {
                  onChange(legIndex, { quantity_mt: qty });
                }
              }}
              disabled={disabled}
            />
          </div>

          <div className="space-y-2">
            <Label>Data Início *</Label>
            <DatePicker
              value={String(leg.start_date ?? '')}
              onChange={(e) => onChange(legIndex, { start_date: String((e.target as any).value || '') || undefined })}
              disabled={disabled}
            />
          </div>

          <div className="space-y-2">
            <Label>Data Fim *</Label>
            <DatePicker
              value={String(leg.end_date ?? '')}
              onChange={(e) => onChange(legIndex, { end_date: String((e.target as any).value || '') || undefined })}
              disabled={disabled}
            />
          </div>
        </div>
        </div>
      </div>
    </Card>
  );
};

export default RFQLegConfigurator;
