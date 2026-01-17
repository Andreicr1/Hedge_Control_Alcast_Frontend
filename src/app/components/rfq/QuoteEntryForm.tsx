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

import { useState, useCallback } from 'react';
import { FioriButton } from '../fiori/FioriButton';
import { FioriInput } from '../fiori/FioriInput';
import { FioriSelect } from '../fiori/FioriSelect';
import { FioriTextarea } from '../fiori/FioriTextarea';
import { Plus, Loader2, CheckCircle } from 'lucide-react';
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
  const [counterpartyId, setCounterpartyId] = useState<number | ''>('');
  const [quotePrice, setQuotePrice] = useState('');
  const [legSide, setLegSide] = useState<'buy' | 'sell'>('buy');
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
    
    if (!counterpartyId || !quotePrice) {
      return;
    }
    
    const selectedCounterparty = counterparties.find(cp => cp.id === counterpartyId);
    
    const quoteData: RfqQuoteCreate = {
      counterparty_id: counterpartyId as number,
      counterparty_name: selectedCounterparty?.name || 'Unknown',
      quote_price: parseFloat(quotePrice),
      leg_side: legSide,
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
      setQuotePrice('');
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
    setLegSide('buy');
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
    <form onSubmit={handleSubmit} className={`bg-white rounded-lg shadow-sm p-4 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-['72:Bold',sans-serif] text-base text-[#131e29]">
          Adicionar Cotação
        </h3>
        {showSuccess && (
          <div className="flex items-center gap-1 text-[var(--sapPositiveColor,#0f7d0f)] text-sm">
            <CheckCircle className="w-4 h-4" />
            Cotação adicionada!
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        {/* Counterparty */}
        <FioriSelect
          label="Contraparte *"
          value={counterpartyId}
          onChange={(e) => setCounterpartyId(e.target.value ? parseInt(e.target.value) : '')}
          fullWidth
          required
        >
          <option value="">Selecione...</option>
          {counterparties
            .filter(cp => cp.active)
            .map(cp => (
              <option key={cp.id} value={cp.id}>{cp.name}</option>
            ))}
        </FioriSelect>

        {/* Price */}
        <FioriInput
          label="Preço *"
          type="number"
          step="0.01"
          value={quotePrice}
          onChange={(e) => setQuotePrice(e.target.value)}
          placeholder="Ex: 2450.50"
          fullWidth
          required
        />

        {/* Side */}
        <FioriSelect
          label="Lado *"
          value={legSide}
          onChange={(e) => setLegSide(e.target.value as 'buy' | 'sell')}
          fullWidth
        >
          <option value="buy">Compra (Buy)</option>
          <option value="sell">Venda (Sell)</option>
        </FioriSelect>

        {/* Group ID */}
        <div className="flex gap-2 items-end">
          <FioriInput
            label="Grupo (Trade)"
            value={quoteGroupId}
            onChange={(e) => setQuoteGroupId(e.target.value)}
            placeholder="Ex: GRP-001"
            fullWidth
          />
          <FioriButton
            type="button"
            variant="ghost"
            onClick={generateGroupId}
            className="mb-0.5 px-2"
            title="Gerar ID de grupo"
          >
            Auto
          </FioriButton>
        </div>
      </div>

      {/* Notes */}
      <div className="mb-4">
        <FioriTextarea
          label="Observações"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Observações sobre a cotação..."
          rows={2}
          fullWidth
        />
      </div>

      {/* Error */}
      {isError && (
        <div className="mb-4 p-3 bg-[var(--sapErrorBackground,#ffebeb)] text-[var(--sapNegativeColor,#bb0000)] rounded text-sm">
          {UX_COPY.errors.title}
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2">
        <FioriButton
          type="submit"
          variant="emphasized"
          icon={isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
          disabled={isLoading || !counterpartyId || !quotePrice}
        >
          {isLoading ? 'Adicionando...' : 'Adicionar'}
        </FioriButton>
        <FioriButton
          type="button"
          variant="ghost"
          onClick={handleReset}
        >
          Limpar
        </FioriButton>
      </div>

      {/* Help Text */}
      <p className="mt-3 text-xs text-[var(--sapContent_LabelColor,#6a6d70)]">
        Para estruturas com duas partes, utilize o mesmo identificador de grupo para ambas as partes.
      </p>
    </form>
  );
}

export default QuoteEntryForm;
