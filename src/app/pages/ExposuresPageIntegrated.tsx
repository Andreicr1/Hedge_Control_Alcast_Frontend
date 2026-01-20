/** Exposures Page */

import { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useExposures } from '../../hooks';
import { Exposure, ExposureStatus } from '../../types';
import { groupExposuresByMonth, groupExposuresByStatus } from '../../services/exposures.service';
import { FioriObjectStatus } from '../components/fiori/FioriObjectStatus';
import { FioriButton } from '../components/fiori/FioriButton';
import { FioriFlexibleColumnLayout } from '../components/fiori/FioriFlexibleColumnLayout';
import { LoadingState, ErrorState, EmptyState, DataContainer } from '../components/ui';
import { 
  Search, 
  Calendar,
  DollarSign,
  Package,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  ExternalLink,
  BarChart3,
  Layers,
} from 'lucide-react';
import { UX_COPY } from '../ux/copy';

function formatSourceTypeLabel(sourceType?: string | null): string {
  const s = String(sourceType || '').toLowerCase();
  if (s === 'so') return 'Pedido de Venda';
  if (s === 'po') return 'Pedido de Compra';
  if (!s) return '—';
  return String(sourceType);
}

// ============================================
// Status Helpers
// ============================================

function getStatusType(status?: ExposureStatus): 'success' | 'error' | 'warning' | 'information' | 'neutral' {
  switch (status) {
    case ExposureStatus.OPEN:
      return 'warning';
    case ExposureStatus.PARTIALLY_HEDGED:
      return 'information';
    case ExposureStatus.HEDGED:
      return 'success';
    case ExposureStatus.CLOSED:
      return 'neutral';
    default:
      return 'neutral';
  }
}

function getStatusLabel(status?: ExposureStatus): string {
  const labels: Record<ExposureStatus, string> = {
    [ExposureStatus.OPEN]: 'Aberta',
    [ExposureStatus.PARTIALLY_HEDGED]: 'Parcialmente Hedgeada',
    [ExposureStatus.HEDGED]: 'Totalmente Hedgeada',
    [ExposureStatus.CLOSED]: 'Fechada',
  };
  return status ? labels[status] || status : 'Desconhecido';
}

function formatCurrency(value: number | null | undefined): string {
  if (value === null || value === undefined) return '—';
  return value.toLocaleString('pt-BR', { 
    style: 'currency', 
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}

// ============================================
// Main Component
// ============================================

export function ExposuresPageIntegrated() {
  const navigate = useNavigate();
  
  // API State via hooks
  const { exposures, isLoading, isError, error, refetch } = useExposures();
  
  // Local UI state
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'list' | 'byMonth' | 'byStatus'>('list');
  const [selectedId, setSelectedId] = useState<number | null>(null);
  
  // Selected exposure
  const selectedExposure = useMemo(() => {
    if (!selectedId || !exposures) return null;
    return exposures.find(e => e.id === selectedId) || null;
  }, [selectedId, exposures]);

  // ============================================
  // Filtered Data
  // ============================================
  
  const filteredExposures = useMemo(() => {
    if (!exposures) return [];

    return exposures.filter((exp) => {
      // Institutional requirement: fully hedged exposures should not appear in this (risk) menu.
      if (exp.status === ExposureStatus.HEDGED) return false;

      const matchesSearch =
        exp.product?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        exp.source_type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        exp.id.toString().includes(searchTerm);
      const matchesStatus = statusFilter === 'all' || exp.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [exposures, searchTerm, statusFilter]);

  // Grouped views
  const exposuresByMonth = useMemo(() => groupExposuresByMonth(filteredExposures), [filteredExposures]);
  const exposuresByStatus = useMemo(() => groupExposuresByStatus(filteredExposures), [filteredExposures]);

  // Summary stats
  const stats = useMemo(() => {
    if (!filteredExposures.length) return null;
    
    const totalVolume = filteredExposures.reduce((sum, e) => sum + (e.quantity_mt ?? 0), 0);
    const totalNotional = 0; // notional_usd not available in Exposure model
    const openCount = filteredExposures.filter(e => e.status === ExposureStatus.OPEN).length;
    const hedgedCount = filteredExposures.filter(e => e.status === ExposureStatus.HEDGED).length;
    
    return { totalVolume, totalNotional, openCount, hedgedCount };
  }, [filteredExposures]);

  // ============================================
  // Handlers
  // ============================================

  const handleSelect = useCallback((id: number) => {
    setSelectedId(id);
  }, []);

  const handleNavigateToDeal = useCallback((dealId: number) => {
    navigate(`/financeiro/deals/${dealId}`);
  }, [navigate]);

  // ============================================
  // Render Exposure Card
  // ============================================

  const renderExposureCard = (exp: Exposure) => (
    <button
      key={exp.id}
      onClick={() => handleSelect(exp.id)}
      className={`w-full p-4 border-b border-[var(--sapList_BorderColor)] text-left hover:bg-[var(--sapList_HoverBackground)] transition-colors ${
        selectedId === exp.id
          ? 'bg-[var(--sapList_SelectionBackgroundColor)] border-l-2 border-l-[var(--sapList_SelectionBorderColor)]'
          : ''
      }`}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="font-['72:Bold',sans-serif] text-sm text-[#0064d9]">
          Exposição nº {exp.id}
        </div>
        <FioriObjectStatus status={getStatusType(exp.status)}>
          {getStatusLabel(exp.status)}
        </FioriObjectStatus>
      </div>
      
      <div className="text-xs text-[var(--sapContent_LabelColor)] mb-2">
        {exp.product || 'Produto não especificado'} | {exp.exposure_type?.toUpperCase() || '—'}
      </div>
      
      <div className="flex items-center justify-between text-xs">
        <span className="flex items-center gap-1">
          <Package className="w-3 h-3" />
          {exp.quantity_mt?.toLocaleString('pt-BR')} MT
        </span>
        <span className="text-[var(--sapContent_LabelColor)]">
          Referência: {exp.pricing_reference || '—'}
        </span>
      </div>

      {exp.hedged_quantity_mt !== undefined && exp.unhedged_quantity_mt !== undefined ? (
        <div className="mt-2 text-xs text-[var(--sapContent_LabelColor)]">
          Coberto {(Number(exp.hedged_quantity_mt) || 0).toLocaleString('pt-BR')} / {exp.quantity_mt.toLocaleString('pt-BR')} MT
        </div>
      ) : null}
      
      <div className="flex items-center justify-between mt-2 text-xs text-[var(--sapContent_LabelColor)]">
        <span>Source #{exp.source_id}</span>
        <span>
          {exp.delivery_date 
            ? new Date(exp.delivery_date).toLocaleDateString('pt-BR')
            : '—'}
        </span>
      </div>
    </button>
  );

  // ============================================
  // Master Column - Exposure List
  // ============================================

  const masterContent = (
    <>
      {/* Header */}
      <div className="border-b border-[var(--sapList_HeaderBorderColor)] p-4 bg-[var(--sapList_HeaderBackground)]">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-['72:Bold',sans-serif] text-base text-[var(--sapList_HeaderTextColor)]">
            {UX_COPY.pages.riskExposure.title} ({filteredExposures.length})
          </h2>
          <FioriButton variant="ghost" icon={<RefreshCw className="w-4 h-4" />} onClick={refetch}>
            Atualizar
          </FioriButton>
        </div>
        
        {/* Search */}
        <div className="space-y-2">
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por produto, origem ou número..."
              className="w-full h-8 px-3 pr-8 text-sm bg-[var(--sapField_Background)] border border-[var(--sapField_BorderColor)] rounded outline-none focus:border-[var(--sapField_Focus_BorderColor)]"
            />
            <Search className="w-4 h-4 absolute right-2 top-2 text-[var(--sapContent_IconColor)]" />
          </div>
          
          <div className="flex gap-2">
            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              aria-label="Filtro de status"
              title="Filtro de status"
              className="flex-1 h-8 px-2 text-sm bg-[var(--sapField_Background)] border border-[var(--sapField_BorderColor)] rounded outline-none"
            >
              <option value="all">Todos os status</option>
              <option value={ExposureStatus.OPEN}>Abertas</option>
              <option value={ExposureStatus.PARTIALLY_HEDGED}>Parcialmente Hedgeadas</option>
            </select>
            
            {/* View Mode */}
            <select
              value={viewMode}
              onChange={(e) => setViewMode(e.target.value as 'list' | 'byMonth' | 'byStatus')}
              aria-label="Modo de visualização"
              title="Modo de visualização"
              className="w-28 h-8 px-2 text-sm bg-[var(--sapField_Background)] border border-[var(--sapField_BorderColor)] rounded outline-none"
            >
              <option value="list">Lista</option>
              <option value="byMonth">Por Mês</option>
              <option value="byStatus">Por Status</option>
            </select>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      {stats && (
        <div className="grid grid-cols-2 gap-2 p-3 bg-[var(--sapGroup_ContentBackground)] border-b border-[var(--sapList_BorderColor)]">
          <div className="text-center">
            <div className="text-lg font-['72:Bold',sans-serif] text-[#131e29]">
              {stats.totalVolume.toLocaleString('pt-BR')}
            </div>
            <div className="text-xs text-[var(--sapContent_LabelColor)]">Volume Total (MT)</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-['72:Bold',sans-serif] text-[#131e29]">
              {formatCurrency(stats.totalNotional)}
            </div>
            <div className="text-xs text-[var(--sapContent_LabelColor)]">Nocional Total</div>
          </div>
        </div>
      )}

      {/* List */}
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <LoadingState message="Carregando exposições..." />
        ) : isError ? (
          <ErrorState error={error} onRetry={refetch} />
        ) : filteredExposures.length === 0 ? (
          <EmptyState 
            title={UX_COPY.pages.riskExposure.emptyTitle}
            description={UX_COPY.pages.riskExposure.emptyDescription}
          />
        ) : viewMode === 'list' ? (
          // Flat list view
          filteredExposures.map(renderExposureCard)
        ) : viewMode === 'byMonth' ? (
          // Grouped by month
          Object.entries(exposuresByMonth).map(([month, exps]) => (
            <div key={month}>
              <div className="px-4 py-2 bg-[var(--sapList_GroupHeaderBackground)] font-['72:Bold',sans-serif] text-xs text-[var(--sapList_GroupHeaderTextColor)] uppercase tracking-wide sticky top-0">
                {month} ({exps.length})
              </div>
              {exps.map(renderExposureCard)}
            </div>
          ))
        ) : (
          // Grouped by status
          Object.entries(exposuresByStatus).map(([status, exps]) => (
            <div key={status}>
              <div className="px-4 py-2 bg-[var(--sapList_GroupHeaderBackground)] font-['72:Bold',sans-serif] text-xs text-[var(--sapList_GroupHeaderTextColor)] uppercase tracking-wide sticky top-0">
                {getStatusLabel(status as ExposureStatus)} ({exps.length})
              </div>
              {exps.map(renderExposureCard)}
            </div>
          ))
        )}
      </div>
    </>
  );

  // ============================================
  // Detail Column
  // ============================================

  const detailContent = selectedExposure ? (
    <div className="h-full overflow-y-auto">
      <div className="p-4 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Layers className="w-6 h-6 text-[#0064d9]" />
            <h1 className="font-['72:Black',sans-serif] text-xl text-[#131e29] m-0">
              Exposição nº {selectedExposure.id}
            </h1>
          </div>
          <FioriObjectStatus status={getStatusType(selectedExposure.status)}>
            {getStatusLabel(selectedExposure.status)}
          </FioriObjectStatus>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center gap-2 mb-2">
              <Package className="w-4 h-4 text-[var(--sapContent_IconColor)]" />
              <span className="text-xs text-[var(--sapContent_LabelColor)]">Volume</span>
            </div>
            <div className="font-['72:Bold',sans-serif] text-xl text-[#131e29]">
              {selectedExposure.quantity_mt?.toLocaleString('pt-BR')} <span className="text-sm font-normal">MT</span>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 className="w-4 h-4 text-[var(--sapContent_IconColor)]" />
              <span className="text-xs text-[var(--sapContent_LabelColor)]">Referência de preço</span>
            </div>
            <div className="font-['72:Bold',sans-serif] text-xl text-[#131e29]">
              {selectedExposure.pricing_reference || '—'}
            </div>
          </div>
        </div>

        {/* Details Card */}
        <div className="bg-white rounded-lg shadow-sm p-4">
          <h3 className="font-['72:Bold',sans-serif] text-base text-[#131e29] mb-4">
            Detalhes
          </h3>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b border-[var(--sapGroup_ContentBorderColor)]">
              <span className="text-sm text-[var(--sapContent_LabelColor)]">Produto</span>
              <span className="text-sm font-['72:Bold',sans-serif]">{selectedExposure.product || '—'}</span>
            </div>
            
            <div className="flex items-center justify-between py-2 border-b border-[var(--sapGroup_ContentBorderColor)]">
              <span className="text-sm text-[var(--sapContent_LabelColor)]">Tipo de Exposição</span>
              <span className={`text-sm font-['72:Bold',sans-serif] ${
                selectedExposure.exposure_type === 'active' ? 'text-[var(--sapPositiveColor)]' : 'text-[var(--sapNegativeColor)]'
              }`}>
                {selectedExposure.exposure_type?.toUpperCase() || '—'}
              </span>
            </div>
            
            <div className="flex items-center justify-between py-2 border-b border-[var(--sapGroup_ContentBorderColor)]">
              <span className="text-sm text-[var(--sapContent_LabelColor)]">Referência de preço</span>
              <span className="text-sm font-['72:Bold',sans-serif]">{selectedExposure.pricing_reference || '—'}</span>
            </div>

            <div className="flex items-center justify-between py-2 border-b border-[var(--sapGroup_ContentBorderColor)]">
              <span className="text-sm text-[var(--sapContent_LabelColor)]">Data de Entrega</span>
              <span className="text-sm font-['72:Bold',sans-serif]">
                {selectedExposure.delivery_date 
                  ? new Date(selectedExposure.delivery_date).toLocaleDateString('pt-BR')
                  : '—'}
              </span>
            </div>
            
            <div className="flex items-center justify-between py-2 border-b border-[var(--sapGroup_ContentBorderColor)]">
              <span className="text-sm text-[var(--sapContent_LabelColor)]">Origem</span>
              <span className="text-sm font-['72:Bold',sans-serif]">
                {formatSourceTypeLabel(selectedExposure.source_type)}
              </span>
            </div>
          </div>
        </div>

        {/* Hedge Progress */}
        <div className="bg-white rounded-lg shadow-sm p-4">
          <h3 className="font-['72:Bold',sans-serif] text-base text-[#131e29] mb-4">
            Informações de Hedge
          </h3>
          
          {/* Status Info */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-[var(--sapContent_LabelColor)]">Status</span>
              <span className="text-xs font-['72:Bold',sans-serif]">
                {getStatusLabel(selectedExposure.status)}
              </span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="text-xs text-[var(--sapContent_LabelColor)]">Exposto</div>
              <div className="font-['72:Bold',sans-serif] text-sm">
                {selectedExposure.quantity_mt?.toLocaleString('pt-BR') ?? 0} MT
              </div>
            </div>
            <div>
              <div className="text-xs text-[var(--sapContent_LabelColor)]">Coberto</div>
              <div className="font-['72:Bold',sans-serif] text-sm">
                {(selectedExposure.hedged_quantity_mt ?? '—') === '—'
                  ? '—'
                  : `${Number(selectedExposure.hedged_quantity_mt || 0).toLocaleString('pt-BR')} MT`}
              </div>
            </div>
          </div>

          {selectedExposure.unhedged_quantity_mt !== undefined ? (
            <div className="mt-3 text-xs text-[var(--sapContent_LabelColor)]">
              Descoberto: {Number(selectedExposure.unhedged_quantity_mt || 0).toLocaleString('pt-BR')} MT
            </div>
          ) : null}

          {Array.isArray(selectedExposure.hedges) && selectedExposure.hedges.length > 0 ? (
            <div className="mt-4">
              <div className="text-xs text-[var(--sapContent_LabelColor)] mb-2">Hedges relacionados</div>
              <div className="space-y-2">
                {selectedExposure.hedges.slice(0, 5).map((h) => (
                  <div
                    key={String(h.hedge_id)}
                    className="p-2 rounded border border-[var(--sapTile_BorderColor)] bg-[var(--sapGroup_ContentBackground)]"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="text-xs font-['72:Bold',sans-serif] text-[#131e29]">
                        Hedge #{h.hedge_id}
                      </div>
                      <div className="text-xs text-[var(--sapContent_LabelColor)]">
                        {(Number(h.quantity_mt || 0) || 0).toLocaleString('pt-BR')} MT
                      </div>
                    </div>
                    <div className="mt-1 text-[11px] text-[var(--sapContent_LabelColor)]">
                      {(h.counterparty_name || h.instrument || h.period) ? (
                        [h.counterparty_name, h.instrument, h.period].filter(Boolean).join(' • ')
                      ) : (
                        '—'
                      )}
                    </div>
                  </div>
                ))}
                {selectedExposure.hedges.length > 5 ? (
                  <div className="text-[11px] text-[var(--sapContent_LabelColor)]">
                    + {selectedExposure.hedges.length - 5} outro(s)
                  </div>
                ) : null}
              </div>
            </div>
          ) : null}
        </div>

        {/* Link to Source */}
        <div className="bg-white rounded-lg shadow-sm p-4">
          <h3 className="font-['72:Bold',sans-serif] text-base text-[#131e29] mb-4">
            Links Relacionados
          </h3>
          
          <button
            onClick={() => handleNavigateToDeal(selectedExposure.source_id)}
            className="w-full flex items-center justify-between p-3 bg-[var(--sapGroup_ContentBackground)] rounded hover:bg-[var(--sapList_HoverBackground)] transition-colors"
          >
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-[var(--sapContent_IconColor)]" />
              <span className="text-sm">Ver referência • {formatSourceTypeLabel(selectedExposure.source_type)} nº {selectedExposure.source_id}</span>
            </div>
            <ExternalLink className="w-4 h-4 text-[var(--sapContent_IconColor)]" />
          </button>
        </div>
      </div>
    </div>
  ) : (
    <EmptyState
      title="Selecione uma exposição"
      description="Escolha um item da lista para ver os detalhes."
      icon={<Layers className="w-8 h-8 text-[var(--sapContent_IconColor)]" />}
      fullPage
    />
  );

  return (
    <FioriFlexibleColumnLayout
      masterTitle={UX_COPY.pages.riskExposure.title}
      masterContent={masterContent}
      masterWidth={380}
      detailContent={detailContent}
    />
  );
}

export default ExposuresPageIntegrated;
