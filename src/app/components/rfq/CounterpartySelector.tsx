/**
 * CounterpartySelector Component
 * 
 * Componente para seleção de contrapartes (bancos/brokers) em RFQs.
 * Permite multi-select com filtros por tipo e busca por nome.
 * 
 * Regras de negócio (AI_CONTEXT):
 * - Broker LME = Inglês (default)
 * - Banco = Português
 */

import { useState, useMemo, useCallback } from 'react';
import { FioriInput } from '../fiori/FioriInput';
import { FioriCheckbox } from '../fiori/FioriCheckbox';
import { FioriButton } from '../fiori/FioriButton';
import { Search, Building2, Globe, Check, X } from 'lucide-react';
import { Counterparty, CounterpartyType } from '../../../types';

// ============================================
// Types
// ============================================
interface CounterpartySelectorProps {
  counterparties: Counterparty[];
  selectedIds: number[];
  onChange: (selectedIds: number[]) => void;
  isLoading?: boolean;
  className?: string;
}

// ============================================
// Helper: Determine language by counterparty type
// ============================================
export function getLanguageForCounterparty(counterparty: Counterparty): 'en' | 'pt' {
  // Broker LME = Inglês, Banco = Português
  if (counterparty.type === 'broker') {
    return 'en';
  }
  return 'pt';
}

// ============================================
// Helper: Get type label
// ============================================
function getTypeLabel(type: CounterpartyType): string {
  switch (type) {
    case 'bank':
      return 'Banco';
    case 'broker':
      return 'Broker LME';
    default:
      return type;
  }
}

// ============================================
// Helper: Get risk badge color
// ============================================
function getRiskBadgeColor(rating: string | null | undefined): string {
  if (!rating) return 'bg-gray-100 text-gray-600';
  const r = rating.toUpperCase();
  if (r.startsWith('A')) return 'bg-green-100 text-green-700';
  if (r.startsWith('B')) return 'bg-yellow-100 text-yellow-700';
  return 'bg-red-100 text-red-700';
}

// ============================================
// CounterpartySelector Component
// ============================================
export function CounterpartySelector({
  counterparties,
  selectedIds,
  onChange,
  isLoading = false,
  className = '',
}: CounterpartySelectorProps) {
  // ============================================
  // Local State
  // ============================================
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'bank' | 'broker'>('all');

  // ============================================
  // Filtered Counterparties
  // ============================================
  const filteredCounterparties = useMemo(() => {
    let result = counterparties.filter(cp => cp.active);

    // Filter by type
    if (filterType !== 'all') {
      result = result.filter(cp => cp.type === filterType);
    }

    // Filter by search term
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        cp =>
          cp.name.toLowerCase().includes(term) ||
          cp.contact_name?.toLowerCase().includes(term) ||
          cp.trade_name?.toLowerCase().includes(term)
      );
    }

    // Sort by type (banks first), then by name
    return result.sort((a, b) => {
      if (a.type !== b.type) {
        return a.type === 'bank' ? -1 : 1;
      }
      return a.name.localeCompare(b.name);
    });
  }, [counterparties, filterType, searchTerm]);

  // ============================================
  // Group by type
  // ============================================
  const groupedCounterparties = useMemo(() => {
    const banks = filteredCounterparties.filter(cp => cp.type === 'bank');
    const brokers = filteredCounterparties.filter(cp => cp.type === 'broker');
    return { banks, brokers };
  }, [filteredCounterparties]);

  // ============================================
  // Handlers
  // ============================================
  const handleToggle = useCallback(
    (id: number) => {
      if (selectedIds.includes(id)) {
        onChange(selectedIds.filter(sid => sid !== id));
      } else {
        onChange([...selectedIds, id]);
      }
    },
    [selectedIds, onChange]
  );

  const handleSelectAll = useCallback(() => {
    const allIds = filteredCounterparties.map(cp => cp.id);
    onChange(allIds);
  }, [filteredCounterparties, onChange]);

  const handleDeselectAll = useCallback(() => {
    onChange([]);
  }, [onChange]);

  // ============================================
  // Render Counterparty Row
  // ============================================
  const renderCounterpartyRow = (cp: Counterparty) => {
    const isSelected = selectedIds.includes(cp.id);
    const language = getLanguageForCounterparty(cp);

    return (
      <div
        key={cp.id}
        className={`
          flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors
          ${isSelected 
            ? 'bg-[var(--sapSelectedColor,#0a6ed1)] bg-opacity-10 border border-[var(--sapSelectedColor,#0a6ed1)]' 
            : 'bg-white border border-[var(--sapTile_BorderColor,#e5e5e5)] hover:bg-[var(--sapList_Hover_Background,#f5f5f5)]'
          }
        `}
        onClick={() => handleToggle(cp.id)}
      >
        <FioriCheckbox
          checked={isSelected}
          onChange={() => handleToggle(cp.id)}
        />

        <div className="flex-1 min-w-0">
          <div className="font-['72:Regular',sans-serif] text-[14px] text-[var(--sapTextColor,#131e29)] truncate">
            {cp.name}
          </div>
          <div className="text-[12px] text-[var(--sapContent_LabelColor,#6a6d70)] flex items-center gap-2 mt-0.5">
            <span className="flex items-center gap-1">
              <Building2 className="w-3 h-3" />
              {getTypeLabel(cp.type)}
            </span>
            {cp.rfq_channel_type && (
              <span className="text-[var(--sapNeutralColor,#6a6d70)]">
                • {cp.rfq_channel_type}
              </span>
            )}
          </div>
        </div>

        {/* Language Badge */}
        <div
          className={`
            flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium
            ${language === 'en' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}
          `}
          title={language === 'en' ? 'Inglês' : 'Português'}
        >
          <Globe className="w-3 h-3" />
          {language === 'en' ? 'EN' : 'PT'}
        </div>

        {/* Risk Rating Badge */}
        {cp.risk_rating && (
          <div
            className={`
              px-2 py-0.5 rounded text-[11px] font-medium
              ${getRiskBadgeColor(cp.risk_rating)}
            `}
            title="Risk Rating"
          >
            {cp.risk_rating}
          </div>
        )}
      </div>
    );
  };

  // ============================================
  // Render
  // ============================================
  return (
    <div className={`${className}`}>
      {/* Header with Search and Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-3">
        <div className="flex-1 min-w-[200px] relative">
          <Search className="w-4 h-4 text-[var(--sapContent_IconColor,#0854a0)] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <FioriInput
            placeholder="Buscar contraparte..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            fullWidth
            className="pl-9"
          />
        </div>

        {/* Type Filter Buttons */}
        <div className="flex gap-1">
          <FioriButton
            variant={filterType === 'all' ? 'emphasized' : 'ghost'}
            onClick={() => setFilterType('all')}
            className="px-2 py-1 text-[12px]"
          >
            Todos
          </FioriButton>
          <FioriButton
            variant={filterType === 'bank' ? 'emphasized' : 'ghost'}
            onClick={() => setFilterType('bank')}
            className="px-2 py-1 text-[12px]"
          >
            Bancos
          </FioriButton>
          <FioriButton
            variant={filterType === 'broker' ? 'emphasized' : 'ghost'}
            onClick={() => setFilterType('broker')}
            className="px-2 py-1 text-[12px]"
          >
            Brokers
          </FioriButton>
        </div>

        {/* Bulk Actions */}
        <div className="flex gap-1 ml-auto">
          <FioriButton
            variant="ghost"
            icon={<Check className="w-3 h-3" />}
            onClick={handleSelectAll}
            disabled={filteredCounterparties.length === 0}
            className="px-2 py-1 text-[12px]"
          >
            Todos
          </FioriButton>
          <FioriButton
            variant="ghost"
            icon={<X className="w-3 h-3" />}
            onClick={handleDeselectAll}
            disabled={selectedIds.length === 0}
            className="px-2 py-1 text-[12px]"
          >
            Limpar
          </FioriButton>
        </div>
      </div>

      {/* Selected Count */}
      <div className="text-[12px] text-[var(--sapContent_LabelColor,#6a6d70)] mb-2">
        {selectedIds.length} selecionado(s) de {filteredCounterparties.length} disponíveis
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-8 text-[var(--sapContent_LabelColor,#6a6d70)]">
          Carregando contrapartes...
        </div>
      )}

      {/* Empty State */}
      {!isLoading && filteredCounterparties.length === 0 && (
        <div className="text-center py-8 text-[var(--sapContent_LabelColor,#6a6d70)]">
          Nenhuma contraparte encontrada.
        </div>
      )}

      {/* Counterparty List - Grouped by Type */}
      {!isLoading && filteredCounterparties.length > 0 && (
        <div className="max-h-[400px] overflow-y-auto space-y-4">
          {/* Banks Section */}
          {groupedCounterparties.banks.length > 0 && (
            <div>
              <div className="text-[12px] font-semibold text-[var(--sapContent_LabelColor,#6a6d70)] uppercase tracking-wide mb-2">
                Bancos ({groupedCounterparties.banks.length})
              </div>
              <div className="space-y-2">
                {groupedCounterparties.banks.map(renderCounterpartyRow)}
              </div>
            </div>
          )}

          {/* Brokers Section */}
          {groupedCounterparties.brokers.length > 0 && (
            <div>
              <div className="text-[12px] font-semibold text-[var(--sapContent_LabelColor,#6a6d70)] uppercase tracking-wide mb-2">
                Brokers LME ({groupedCounterparties.brokers.length})
              </div>
              <div className="space-y-2">
                {groupedCounterparties.brokers.map(renderCounterpartyRow)}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default CounterpartySelector;
