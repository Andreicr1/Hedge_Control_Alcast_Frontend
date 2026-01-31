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
import {
  Button,
  Card,
  CheckBox,
  CustomListItem,
  FlexBox,
  FlexBoxDirection,
  Input,
  Label,
  List,
  Option,
  Select,
  Text,
  Title,
  Toolbar,
  ToolbarSpacer,
} from '@ui5/webcomponents-react';
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
        return (
          <CustomListItem key={cp.id} type="Active" onClick={() => handleToggle(cp.id)}>
            <FlexBox direction={FlexBoxDirection.Row} alignItems="Center" justifyContent="SpaceBetween" style={{ width: '100%' }}>
              <FlexBox direction={FlexBoxDirection.Row} alignItems="Center" style={{ gap: '0.75rem' }}>
                <CheckBox checked={isSelected} onChange={() => handleToggle(cp.id)} />
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 520 }}>
                    {cp.name}
                  </div>
                  <Text>
                    {getTypeLabel(cp.type)}
                    {cp.rfq_channel_type ? ` • ${cp.rfq_channel_type}` : ''}
                  </Text>
                </div>
              </FlexBox>

              <FlexBox direction={FlexBoxDirection.Row} alignItems="Center" style={{ gap: '0.75rem' }}>
                <Text>{language === 'en' ? 'EN' : 'PT'}</Text>
                {cp.risk_rating ? <Text>{cp.risk_rating}</Text> : null}
              </FlexBox>
            </FlexBox>
          </CustomListItem>
        );
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
              <Card className={className}>
                <div style={{ padding: '0.75rem' }}>
                  <Toolbar>
                    <Title level="H5">Contrapartes</Title>
                    <ToolbarSpacer />
                    <Button design="Transparent" onClick={handleSelectAll} disabled={filteredCounterparties.length === 0}>
                      Selecionar todas
                    </Button>
                    <Button design="Transparent" onClick={handleDeselectAll} disabled={selectedIds.length === 0}>
                      Limpar
                    </Button>
                  </Toolbar>

                  <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <Label>Buscar</Label>
                      <Input value={searchTerm} onInput={(e) => setSearchTerm(String((e.target as any).value || ''))} />
                    </div>
                    <div>
                      <Label>Tipo</Label>
                      <Select value={filterType} onChange={(e) => setFilterType(String((e.target as any).value || 'all') as any)}>
                        <Option value="all">Todos</Option>
                        <Option value="bank">Bancos</Option>
                        <Option value="broker">Brokers</Option>
                      </Select>
                    </div>
                  </div>

                  <div className="mt-3">
                    <Text>
                      {selectedIds.length} selecionado(s) de {filteredCounterparties.length} disponíveis
                    </Text>
                  </div>

                  {isLoading ? (
                    <div className="mt-4">
                      <Text>Carregando contrapartes…</Text>
                    </div>
                  ) : filteredCounterparties.length === 0 ? (
                    <div className="mt-4">
                      <Text>Nenhuma contraparte encontrada.</Text>
                    </div>
                  ) : (
                    <div className="mt-4 max-h-[400px] overflow-y-auto">
                      {groupedCounterparties.banks.length > 0 ? (
                        <div className="mb-4">
                          <Text>Bancos ({groupedCounterparties.banks.length})</Text>
                          <List className="mt-2">{groupedCounterparties.banks.map(renderCounterpartyRow)}</List>
                        </div>
                      ) : null}

                      {groupedCounterparties.brokers.length > 0 ? (
                        <div>
                          <Text>Brokers LME ({groupedCounterparties.brokers.length})</Text>
                          <List className="mt-2">{groupedCounterparties.brokers.map(renderCounterpartyRow)}</List>
                        </div>
                      ) : null}
                    </div>
                  )}
                </div>
              </Card>
            disabled={filteredCounterparties.length === 0}
