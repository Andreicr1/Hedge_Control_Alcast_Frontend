/**
 * RFQLegConfigurator Component
 * 
 * Configurador de leg individual para RFQ.
 * Permite configurar: side, price_type, datas, quantidade
 */

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { RfqSide, RfqPriceType } from '../../../types/enums';
import type { RfqLegInput } from '../../../types/models';
import { Trash2 } from 'lucide-react';

interface RFQLegConfiguratorProps {
  leg: RfqLegInput;
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
      <CardHeader className="pb-4">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">
            Leg {legIndex + 1}
            {leg.side && (
              <span className="ml-2 text-sm font-normal text-muted-foreground">
                - {SIDE_LABELS[leg.side]}
              </span>
            )}
          </CardTitle>
          {showRemoveButton && onRemove && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onRemove(legIndex)}
              disabled={disabled}
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Linha 1: Side + Price Type */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor={`side-${legIndex}`}>Lado da Operação *</Label>
            <Select
              value={leg.side}
              onValueChange={(value) => onChange(legIndex, { side: value as RfqSide })}
              disabled={disabled}
            >
              <SelectTrigger id={`side-${legIndex}`}>
                <SelectValue placeholder="Selecione..." />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(SIDE_LABELS).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor={`price-type-${legIndex}`}>Tipo de Preço *</Label>
            <Select
              value={leg.price_type}
              onValueChange={(value) => onChange(legIndex, { price_type: value as RfqPriceType })}
              disabled={disabled}
            >
              <SelectTrigger id={`price-type-${legIndex}`}>
                <SelectValue placeholder="Selecione..." />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(PRICE_TYPE_LABELS).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Linha 2: Quantidade + Datas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor={`quantity-${legIndex}`}>Quantidade (MT) *</Label>
            <Input
              id={`quantity-${legIndex}`}
              type="number"
              value={leg.quantity_mt || ''}
              onChange={(e) => {
                const qty = parseFloat(e.target.value);
                if (!isNaN(qty) && qty >= 0) {
                  onChange(legIndex, { quantity_mt: qty });
                }
              }}
              disabled={disabled}
              placeholder="Ex: 100"
              min={0}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor={`start-date-${legIndex}`}>Data Início *</Label>
            <Input
              id={`start-date-${legIndex}`}
              type="date"
              value={leg.start_date || ''}
              onChange={(e) => onChange(legIndex, { start_date: e.target.value })}
              disabled={disabled}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor={`end-date-${legIndex}`}>Data Fim *</Label>
            <Input
              id={`end-date-${legIndex}`}
              type="date"
              value={leg.end_date || ''}
              onChange={(e) => onChange(legIndex, { end_date: e.target.value })}
              disabled={disabled}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RFQLegConfigurator;
