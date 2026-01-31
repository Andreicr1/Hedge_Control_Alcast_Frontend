/**
 * QuoteEntryForm Component
 * 
 * Formulário para entrada de cotações recebidas de contrapartes.
 * 
 * Regras de negócio (AI_CONTEXT):
 * - Quote = proposta de preço de uma contraparte
 * - Pode ter legs (buy/sell) agrupados por quote_group_id
 * - Backend calcula ranking automaticamente
 */

import { useCallback, useState } from 'react';
import {
  BusyIndicator,
  Button,
  Card,
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
import { UX_COPY } from '../../ux/copy';
import { RfqQuoteCreate, Counterparty } from '../../../types';
import { useAddQuote } from '../../../hooks/useRfqs';

// ============================================
// Types
// ============================================
interface QuoteEntryFormProps {
  rfqId: number;
  counterparties: Counterparty[];
  onSuccess?: () => void;
  className?: string;
}

// ============================================
// QuoteEntryForm Component
// ============================================
export function QuoteEntryForm({
  rfqId,
  counterparties,
  onSuccess,
  className = '',
}: QuoteEntryFormProps) {
  // ============================================
  // Form State
  // ============================================
  const [counterpartyId, setCounterpartyId] = useState<string>('');
  const [quotePrice, setQuotePrice] = useState('');
  const [legSide, setLegSide] = useState<string>('');
  const [quoteGroupId, setQuoteGroupId] = useState('');
  const [notes, setNotes] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  
  // Mutation hook
  const { mutate: addQuote, isLoading, isError, error, reset: resetMutation } = useAddQuote();

  // ============================================
  // Handlers
  // ============================================
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!counterpartyId || !quotePrice || !legSide) {
      return;
    }
    
    const parsedCounterpartyId = Number.parseInt(counterpartyId, 10);
    const selectedCounterparty = counterparties.find(cp => cp.id === parsedCounterpartyId);
    
    const quoteData: RfqQuoteCreate = {
      counterparty_id: parsedCounterpartyId,
      counterparty_name: selectedCounterparty?.name || 'Unknown',
      quote_price: parseFloat(quotePrice),
      leg_side: legSide as 'buy' | 'sell',
      quote_group_id: quoteGroupId || undefined,
      notes: notes || undefined,
      status: 'received',
    };
    
    const result = await addQuote(rfqId, quoteData);
    
    if (result) {
      // Show success briefly
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
      
      // Reset form
      setCounterpartyId('');
      setQuotePrice('');
      setLegSide('');
      setNotes('');
      setQuoteGroupId('');
      resetMutation();
      
      // Callback
      onSuccess?.();
    }
  }, [rfqId, counterpartyId, quotePrice, legSide, quoteGroupId, notes, counterparties, addQuote, resetMutation, onSuccess]);

  const handleReset = useCallback(() => {
    setCounterpartyId('');
    setQuotePrice('');
    setLegSide('');
    setQuoteGroupId('');
    setNotes('');
    resetMutation();
  }, [resetMutation]);

  // Generate random group ID for paired quotes
  const generateGroupId = useCallback(() => {
    const id = `GRP-${Date.now().toString(36).toUpperCase()}`;
    setQuoteGroupId(id);
  }, []);

  // ============================================
  // Render
  // ============================================
  return (
    <Card className={className}>
      <div style={{ padding: '0.75rem' }}>
        <FlexBox direction={FlexBoxDirection.Row} justifyContent="SpaceBetween" style={{ gap: '0.75rem', alignItems: 'center' }}>
          <Title level="H5">Adicionar Cotação</Title>
          {showSuccess ? <MessageStrip design="Positive">Cotação adicionada.</MessageStrip> : null}
        </FlexBox>

        <form onSubmit={handleSubmit} style={{ marginTop: '0.75rem' }}>
          <Form columnsL={4} columnsM={2} columnsS={1} columnsXL={4}>
            <FormItem labelContent={<Label>Contraparte *</Label>}>
              <Select value={counterpartyId} onChange={(e) => setCounterpartyId(String((e.target as any).value || ''))}>
                <Option value="">—</Option>
                {counterparties
                  .filter((cp) => cp.active)
                  .map((cp) => (
                    <Option key={cp.id} value={String(cp.id)}>
                      {cp.name}
                    </Option>
                  ))}
              </Select>
            </FormItem>

            <FormItem labelContent={<Label>Preço *</Label>}>
              <Input
                type="Number"
                value={quotePrice}
                onInput={(e) => setQuotePrice(String((e.target as any).value || ''))}
              />
            </FormItem>

            <FormItem labelContent={<Label>Lado *</Label>}>
              <Select value={legSide} onChange={(e) => setLegSide(String((e.target as any).value || ''))}>
                <Option value="">—</Option>
                <Option value="buy">Compra</Option>
                <Option value="sell">Venda</Option>
              </Select>
            </FormItem>

            <FormItem labelContent={<Label>Grupo (Trade)</Label>}>
              <FlexBox direction={FlexBoxDirection.Row} style={{ gap: '0.5rem', alignItems: 'center' }}>
                <Input value={quoteGroupId} onInput={(e) => setQuoteGroupId(String((e.target as any).value || ''))} />
                <Button design="Transparent" onClick={generateGroupId} type="Button" title="Gerar ID de grupo">
                  Auto
                </Button>
              </FlexBox>
            </FormItem>
          </Form>

          <div style={{ marginTop: '0.75rem' }}>
            <Label>Observações</Label>
            <TextArea
              value={notes}
              rows={2}
              onInput={(e) => setNotes(String((e.target as any).value || ''))}
            />
          </div>

          {isError ? (
            <div style={{ marginTop: '0.75rem' }}>
              <MessageStrip design="Negative">{UX_COPY.errors.title}</MessageStrip>
            </div>
          ) : null}

          <FlexBox direction={FlexBoxDirection.Row} style={{ gap: '0.5rem', marginTop: '0.75rem', alignItems: 'center' }}>
            <Button
              design="Emphasized"
              type="Submit"
              disabled={isLoading || !counterpartyId || !quotePrice || !legSide}
            >
              {isLoading ? 'Adicionando…' : 'Adicionar'}
            </Button>
            <Button design="Transparent" type="Button" onClick={handleReset} disabled={isLoading}>
              Limpar
            </Button>
            {isLoading ? <BusyIndicator active delay={0} size="Small" /> : null}
          </FlexBox>

          <Text style={{ marginTop: '0.75rem', opacity: 0.75, fontSize: '0.8125rem' }}>
            Para estruturas com duas partes, utilize o mesmo identificador de grupo para ambas as partes.
          </Text>
        </form>
      </div>
    </Card>
  );
}

export default QuoteEntryForm;
