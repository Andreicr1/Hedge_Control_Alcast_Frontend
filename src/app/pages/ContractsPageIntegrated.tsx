/** Contracts Page */

import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useContracts, useContractDetail } from '../../hooks';
import { Contract, ContractExposureLink } from '../../types';
import { extractTradeLegs, calculateNotional } from '../../services/contracts.service';
import { FioriObjectStatus } from '../components/fiori/FioriObjectStatus';
import { FioriButton } from '../components/fiori/FioriButton';
import { FioriFlexibleColumnLayout } from '../components/fiori/FioriFlexibleColumnLayout';
import { FioriTile } from '../components/fiori/FioriTile';
import { LoadingState, ErrorState, EmptyState } from '../components/ui';
import { UX_COPY } from '../ux/copy';
import { AnalyticTwoPaneLayout } from '../analytics/AnalyticTwoPaneLayout';
import { AnalyticScopeTree } from '../analytics/AnalyticScopeTree';
import { useAnalyticScope } from '../analytics/ScopeProvider';
import { useAnalyticScopeUrlSync } from '../analytics/useAnalyticScopeUrlSync';
import { 
  Search, 
  FileText, 
  Calendar,
  Building2,
  ArrowRightLeft,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';

// ============================================
// Status Helpers
// ============================================

function computeDisplayStatus(contract: Contract): {
  key: string;
  type: 'success' | 'error' | 'warning' | 'information' | 'neutral';
  label: string;
} {
  const explicit = (contract.post_maturity_status || '').toLowerCase();
  const base = (contract.status || '').toLowerCase();

  let key = explicit || base || 'unknown';

  // Local fallback for list endpoint: if active and past settlement_date, treat as vencido.
  if (!explicit && base === 'active' && contract.settlement_date) {
    const d = new Date(contract.settlement_date);
    const today = new Date();
    d.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    if (d.getTime() < today.getTime()) {
      key = 'vencido';
    }
  }

  const typeMap: Record<string, 'success' | 'error' | 'warning' | 'information' | 'neutral'> = {
    active: 'success',
    vencido: 'warning',
    settled: 'information',
    cancelled: 'error',
  };
  const labelMap: Record<string, string> = {
    active: 'Ativo',
    vencido: 'Vencido',
    settled: 'Liquidado',
    cancelled: 'Cancelado',
  };

  return {
    key,
    type: typeMap[key] || 'neutral',
    label: labelMap[key] || contract.status || 'Desconhecido',
  };
}

// ============================================
// Main Component
// ============================================

export function ContractsPageIntegrated() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useAnalyticScopeUrlSync({ acceptLegacyDealId: true });
  const { scope, setScope } = useAnalyticScope();

  const scopedDealId = scope.kind === 'all' ? undefined : scope.dealId;
  
  // API State via hooks
  const contractFilters = useMemo(() => ({ deal_id: scopedDealId }), [scopedDealId]);
  const { contracts, isLoading, isError, error, refetch } = useContracts(contractFilters);
  
  // Local UI state
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedContractId, setSelectedContractId] = useState<string | null>(null);

  const _didInitFromUrl = useRef(false);
  useEffect(() => {
    if (_didInitFromUrl.current) return;
    _didInitFromUrl.current = true;

    const q = searchParams.get('q');
    if (q) setSearchTerm(q);

    const idParam = searchParams.get('id');
    if (idParam) setSelectedContractId(idParam);
  }, [searchParams]);

  // If scope points to a contract, open it in the detail pane.
  useEffect(() => {
    if (scope.kind !== 'contract') return;
    const cid = (scope.contractId || '').trim();
    if (!cid) return;
    setSelectedContractId(cid);
  }, [scope]);
  
  // Selected contract detail
  const {
    contract: selectedContract,
    exposures: selectedContractExposures,
    isLoading: isLoadingDetail,
    refetch: refetchDetail,
  } = useContractDetail(selectedContractId);

  // ============================================
  // Filtered Data
  // ============================================
  
  const filteredContracts = useMemo(() => {
    if (!contracts) return [];
    
    return contracts.filter((contract) => {
      const matchesSearch =
        contract.contract_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contract.quote_group_id?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || contract.status?.toLowerCase() === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [contracts, searchTerm, statusFilter]);

  // ============================================
  // Handlers
  // ============================================

  const handleContractSelect = useCallback(
    (contract: Contract) => {
      setSelectedContractId(contract.contract_id);
      if (contract.deal_id) {
        setScope({ kind: 'contract', dealId: contract.deal_id, contractId: contract.contract_id });
      }
    },
    [setScope]
  );

  const handleNavigateToRfq = useCallback((rfqId: number) => {
    navigate(`/financeiro/rfqs?selected=${rfqId}`);
  }, [navigate]);

  const handleNavigateToDeal = useCallback((dealId: number) => {
    setScope({ kind: 'deal', dealId });
    const qs = new URLSearchParams({ scope: 'deal', deal_id: String(dealId) });
    navigate(`/financeiro/cashflow?${qs.toString()}`);
  }, [navigate, setScope]);

  const handleNavigateToSource = useCallback(
    (link: ContractExposureLink) => {
      const t = (link.source_type || '').toLowerCase();
      if (t === 'so') navigate(`/vendas/sales-orders/${encodeURIComponent(String(link.source_id))}`);
      if (t === 'po') navigate(`/compras/purchase-orders/${encodeURIComponent(String(link.source_id))}`);
    },
    [navigate],
  );

  // ============================================
  // Master Column - Contract List
  // ============================================

  const masterContent = (
    <>
      {/* Header */}
      <div className="border-b border-[var(--sapList_HeaderBorderColor)] p-4 bg-[var(--sapList_HeaderBackground)]">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-['72:Bold',sans-serif] text-base text-[var(--sapList_HeaderTextColor)]">
            Contratos ({filteredContracts.length})
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
              placeholder="Buscar por contrato ou cotação..."
              className="w-full h-8 px-3 pr-8 text-sm bg-[var(--sapField_Background)] border border-[var(--sapField_BorderColor)] rounded outline-none focus:border-[var(--sapField_Focus_BorderColor)]"
            />
            <Search className="w-4 h-4 absolute right-2 top-2 text-[var(--sapContent_IconColor)]" />
          </div>
          
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            aria-label="Filtro de status"
            title="Filtro de status"
            className="w-full h-8 px-2 text-sm bg-[var(--sapField_Background)] border border-[var(--sapField_BorderColor)] rounded outline-none"
          >
            <option value="all">Todos os status</option>
            <option value="active">Ativos</option>
            <option value="settled">Liquidados</option>
          </select>
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <LoadingState message="Carregando contratos..." />
        ) : isError ? (
          <ErrorState error={error} onRetry={refetch} />
        ) : filteredContracts.length === 0 ? (
          <EmptyState 
            title="Nenhum contrato encontrado"
            description="Não há contratos para os filtros selecionados."
          />
        ) : (
          filteredContracts.map((contract) => {
            const { buyLeg, sellLeg, spread } = extractTradeLegs(contract);
            const display = computeDisplayStatus(contract);
            
            return (
              <button
                key={contract.contract_id}
                onClick={() => handleContractSelect(contract)}
                className={`w-full p-4 border-b border-[var(--sapList_BorderColor)] text-left hover:bg-[var(--sapList_HoverBackground)] transition-colors ${
                  selectedContractId === contract.contract_id
                    ? 'bg-[var(--sapList_SelectionBackgroundColor)] border-l-2 border-l-[var(--sapList_SelectionBorderColor)]'
                    : ''
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="font-['72:Bold',sans-serif] text-sm text-[#0064d9] truncate max-w-[200px]">
                    {contract.contract_id.substring(0, 8)}...
                  </div>
                  <FioriObjectStatus status={display.type}>
                    {display.label}
                  </FioriObjectStatus>
                </div>
                
                <div className="text-xs text-[var(--sapContent_LabelColor)] mb-1">
                  Estrutura nº {contract.trade_index ?? 0}
                </div>
                
                {(buyLeg || sellLeg) && (
                  <div className="flex items-center gap-2 text-xs mb-2">
                    {buyLeg && (
                      <span className="text-[var(--sapPositiveColor)]">
                        Compra: {formatNumber(buyLeg.price)}
                      </span>
                    )}
                    {buyLeg && sellLeg && <span>|</span>}
                    {sellLeg && (
                      <span className="text-[var(--sapNegativeColor)]">
                        Venda: {formatNumber(sellLeg.price)}
                      </span>
                    )}
                    {spread != null && (
                      <span className="font-['72:Bold',sans-serif]">
                        Δ {formatNumber(spread)}
                      </span>
                    )}
                  </div>
                )}
                
                <div className="flex items-center justify-between text-xs text-[var(--sapContent_LabelColor)]">
                  <span>Operação nº {contract.deal_id}</span>
                  <span>
                    {contract.settlement_date 
                      ? new Date(contract.settlement_date).toLocaleDateString('pt-BR')
                      : '—'}
                  </span>
                </div>
              </button>
            );
          })
        )}
      </div>
    </>
  );

  // ============================================
  // Detail Column - Contract Detail
  // ============================================

  function formatPriceTypeLabel(pt?: string | null) {
    const k = (pt || '').toLowerCase();
    if (k === 'fix') return 'Preço Fixo';
    if (k === 'avg') return 'Média Mensal';
    if (k === 'avginter' || k === 'avg_inter' || k === 'avg inter') return 'Média de dias intermediários';
    if (k === 'c2r') return 'Preço Futuro';
    return pt || '—';
  }

  function formatAdjustment(v?: number | null) {
    if (v === null || v === undefined) return '—';
    return v.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  function formatNumber(v?: number | null, opts?: Intl.NumberFormatOptions) {
    if (v === null || v === undefined) return '—';
    if (Number.isNaN(v)) return '—';
    return v.toLocaleString('pt-BR', opts);
  }

  const formatSourceLabel = (t?: string) => {
    const k = (t || '').toLowerCase();
    if (k === 'so') return 'Sales Order (SO)';
    if (k === 'po') return 'Purchase Order (PO)';
    return t || '—';
  };

  const formatExposureTypeLabel = (t?: string) => {
    const k = (t || '').toLowerCase();
    if (k === 'active') return 'Ativa';
    if (k === 'passive') return 'Passiva';
    if (k === 'residual') return 'Residual';
    return t || '—';
  };

  const renderLegDetailCards = (contract: Contract) => {
    const legs = contract.legs || [];
    if (!legs.length) return null;

    return (
      <div className="bg-white rounded-lg shadow-sm p-4">
        <h3 className="font-['72:Bold',sans-serif] text-base text-[#131e29] mb-4">
          Detalhe das legs
        </h3>

        <div className="space-y-3">
          {legs.map((leg, idx) => {
            const side = (leg.side || '').toLowerCase();
            const sideLabel = side === 'buy' ? 'Compra' : side === 'sell' ? 'Venda' : leg.side || '—';
            const qty = leg.quantity_mt ?? 0;
            const price = leg.price;

            const timeHint =
              leg.price_type?.toLowerCase() === 'avg'
                ? (leg.month_name && leg.year ? `${leg.month_name} ${leg.year}` : null)
                : leg.price_type?.toLowerCase() === 'avginter'
                  ? (leg.start_date && leg.end_date ? `${new Date(leg.start_date).toLocaleDateString('pt-BR')} → ${new Date(leg.end_date).toLocaleDateString('pt-BR')}` : null)
                  : leg.price_type?.toLowerCase() === 'c2r'
                    ? (leg.fixing_date ? `Fixing: ${new Date(leg.fixing_date).toLocaleDateString('pt-BR')}` : null)
                    : null;

            return (
              <div
                key={`${leg.side}-${idx}`}
                className="p-3 rounded border border-[var(--sapGroup_ContentBorderColor)] bg-[var(--sapGroup_ContentBackground)]"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="font-['72:Bold',sans-serif] text-sm text-[#131e29]">
                      {sideLabel}
                    </div>
                    <div className="text-xs text-[var(--sapContent_LabelColor)]">
                      {formatPriceTypeLabel(leg.price_type || null)}
                      {timeHint ? ` • ${timeHint}` : ''}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-['72:Bold',sans-serif] text-sm text-[#131e29]">
                      {qty.toLocaleString('pt-BR')} t
                    </div>
                    <div className="text-xs text-[var(--sapContent_LabelColor)]">
                      {price !== null && price !== undefined
                        ? price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })
                        : '—'}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderExposureCoverage = (links: ContractExposureLink[]) => {
    if (!links.length) return null;

    const grouped = links.reduce(
      (acc, x) => {
        const key = (x.source_type || 'unknown') as string;
        acc[key] = acc[key] || [];
        acc[key].push(x);
        return acc;
      },
      {} as Record<string, ContractExposureLink[]>,
    );

    const total = links.reduce((s, x) => s + (x.quantity_mt || 0), 0);

    return (
      <div className="bg-white rounded-lg shadow-sm p-4">
        <h3 className="font-['72:Bold',sans-serif] text-base text-[#131e29] mb-1">
          Cobertura de exposição
        </h3>
        <div className="text-xs text-[var(--sapContent_LabelColor)] mb-4">
          Total alocado: {total.toLocaleString('pt-BR')} t
        </div>

        <div className="space-y-4">
          {Object.entries(grouped).map(([k, rows]) => {
            const subtotal = rows.reduce((s, x) => s + (x.quantity_mt || 0), 0);
            return (
              <div key={k} className="p-3 rounded border border-[var(--sapGroup_ContentBorderColor)]">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-['72:Bold',sans-serif] text-sm text-[#131e29]">
                    {formatSourceLabel(k)}
                  </div>
                  <div className="text-sm font-['72:Bold',sans-serif] text-[#131e29]">
                    {subtotal.toLocaleString('pt-BR')} t
                  </div>
                </div>

                <div className="space-y-2">
                  {rows
                    .slice()
                    .sort((a, b) => (a.source_id - b.source_id) || (a.exposure_id - b.exposure_id))
                    .map((row) => (
                      <button
                        key={`${row.exposure_id}`}
                        onClick={() => handleNavigateToSource(row)}
                        className="w-full text-left p-2 rounded bg-[var(--sapGroup_ContentBackground)] hover:bg-[var(--sapList_HoverBackground)] transition-colors"
                        title="Abrir documento de origem"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="text-xs text-[var(--sapContent_LabelColor)]">
                            {formatSourceLabel(String(row.source_type))} #{row.source_id} • Exposição #{row.exposure_id}
                          </div>
                          <div className="text-xs font-['72:Bold',sans-serif] text-[#131e29]">
                            {(row.quantity_mt || 0).toLocaleString('pt-BR')} t
                          </div>
                        </div>
                        <div className="text-xs text-[var(--sapContent_LabelColor)]">
                          Tipo: {formatExposureTypeLabel(String(row.exposure_type))} • Status: {String(row.status)}
                        </div>
                      </button>
                    ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderTradeSnapshot = (contract: Contract) => {
    const { buyLeg, sellLeg, spread } = extractTradeLegs(contract);
    const notional = calculateNotional(contract);

    const display = computeDisplayStatus(contract);
    const fixedPrice = contract.fixed_price ?? null;
    const variableLabel = contract.variable_reference_label ?? null;
    const obsStart = contract.observation_start
      ? new Date(contract.observation_start).toLocaleDateString('pt-BR')
      : null;
    const obsEnd = contract.observation_end
      ? new Date(contract.observation_end).toLocaleDateString('pt-BR')
      : null;
    const maturity = contract.maturity_date
      ? new Date(contract.maturity_date).toLocaleDateString('pt-BR')
      : null;

    const showAdjustment = display.key === 'vencido' || display.key === 'settled';
    const adj = contract.settlement_adjustment_usd;
    
    return (
      <div className="bg-white rounded-lg shadow-sm p-4">
        <h3 className="font-['72:Bold',sans-serif] text-base text-[#131e29] mb-4">
          Legs do swap
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="p-3 bg-[var(--sapGroup_ContentBackground)] rounded border border-[var(--sapGroup_ContentBorderColor)]">
            <div className="text-xs text-[var(--sapContent_LabelColor)] mb-1">Preço fixado</div>
            <div className="font-['72:Bold',sans-serif] text-lg text-[#131e29]">
              {fixedPrice !== null
                ? fixedPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })
                : '—'}
            </div>
            <div className="text-xs text-[var(--sapContent_LabelColor)]">
              Quantidade: {(contract.fixed_leg?.quantity_mt ?? buyLeg?.volume_mt ?? sellLeg?.volume_mt ?? 0).toLocaleString('pt-BR')} t
            </div>
          </div>

          <div className="p-3 bg-[var(--sapGroup_ContentBackground)] rounded border border-[var(--sapGroup_ContentBorderColor)]">
            <div className="text-xs text-[var(--sapContent_LabelColor)] mb-1">Preço variável</div>
            <div className="font-['72:Bold',sans-serif] text-lg text-[#131e29]">
              {variableLabel || formatPriceTypeLabel(contract.variable_leg?.price_type || undefined)}
            </div>
            <div className="text-xs text-[var(--sapContent_LabelColor)]">
              {obsStart && obsEnd ? `Janela: ${obsStart} → ${obsEnd}` : maturity ? `Vencimento: ${maturity}` : '—'}
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          {/* Buy Leg */}
          <div className="p-3 bg-[var(--sapSuccessBackground,#f1fdf6)] rounded border border-[var(--sapSuccessBorderColor,#107e3e)]">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-[var(--sapPositiveColor)]"></div>
              <span className="font-['72:Bold',sans-serif] text-sm text-[var(--sapPositiveColor)]">Compra</span>
            </div>
            {buyLeg ? (
              <>
                <div className="text-2xl font-['72:Bold',sans-serif] text-[#131e29]">
                  {formatNumber(buyLeg.price, { minimumFractionDigits: 2 })}
                </div>
                <div className="text-xs text-[var(--sapContent_LabelColor)]">
                  {buyLeg.volume_mt?.toLocaleString('pt-BR')} t
                </div>
                {buyLeg.price_type && (
                  <div className="text-xs text-[var(--sapContent_LabelColor)]">
                    {formatPriceTypeLabel(buyLeg.price_type)}
                  </div>
                )}
              </>
            ) : (
              <div className="text-sm text-[var(--sapContent_LabelColor)]">—</div>
            )}
          </div>
          
          {/* Sell Leg */}
          <div className="p-3 bg-[var(--sapErrorBackground,#ffebeb)] rounded border border-[var(--sapErrorBorderColor,#b00)]">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-[var(--sapNegativeColor)]"></div>
              <span className="font-['72:Bold',sans-serif] text-sm text-[var(--sapNegativeColor)]">Venda</span>
            </div>
            {sellLeg ? (
              <>
                <div className="text-2xl font-['72:Bold',sans-serif] text-[#131e29]">
                  {formatNumber(sellLeg.price, { minimumFractionDigits: 2 })}
                </div>
                <div className="text-xs text-[var(--sapContent_LabelColor)]">
                  {sellLeg.volume_mt?.toLocaleString('pt-BR')} t
                </div>
                {sellLeg.price_type && (
                  <div className="text-xs text-[var(--sapContent_LabelColor)]">
                    {formatPriceTypeLabel(sellLeg.price_type)}
                  </div>
                )}
              </>
            ) : (
              <div className="text-sm text-[var(--sapContent_LabelColor)]">—</div>
            )}
          </div>
        </div>
        
        {/* Spread & Notional */}
        <div className="grid grid-cols-2 gap-4 pt-3 border-t border-[var(--sapGroup_ContentBorderColor)]">
          <div>
            <div className="text-xs text-[var(--sapContent_LabelColor)] mb-1">Diferença</div>
            <div className={`font-['72:Bold',sans-serif] text-lg ${
              spread != null && spread < 0 ? 'text-[var(--sapPositiveColor)]' : 'text-[#131e29]'
            }`}>
              {spread != null ? formatNumber(spread, { minimumFractionDigits: 2 }) : '—'}
            </div>
          </div>
          <div>
            <div className="text-xs text-[var(--sapContent_LabelColor)] mb-1">Valor nocional</div>
            <div className="font-['72:Bold',sans-serif] text-lg text-[#131e29]">
              {formatNumber(notional, { minimumFractionDigits: 2 })}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-3 mt-3 border-t border-[var(--sapGroup_ContentBorderColor)]">
          <div>
            <div className="text-xs text-[var(--sapContent_LabelColor)] mb-1">Vencimento</div>
            <div className="font-['72:Bold',sans-serif] text-sm text-[#131e29]">
              {maturity || '—'}
            </div>
          </div>
          <div>
            <div className="text-xs text-[var(--sapContent_LabelColor)] mb-1">Settlement Date</div>
            <div className="font-['72:Bold',sans-serif] text-sm text-[#131e29]">
              {contract.settlement_date
                ? new Date(contract.settlement_date).toLocaleDateString('pt-BR')
                : '—'}
            </div>
          </div>
        </div>

        {showAdjustment && (
          <div className="pt-3 mt-3 border-t border-[var(--sapGroup_ContentBorderColor)]">
            <div className="text-xs text-[var(--sapContent_LabelColor)] mb-1">Ajuste (USD)</div>
            <div
              className={`font-['72:Black',sans-serif] text-lg ${
                (adj ?? 0) >= 0
                  ? 'text-[var(--sapPositiveColor)]'
                  : 'text-[var(--sapNegativeColor)]'
              }`}
            >
              {formatAdjustment(adj)}
            </div>
            {contract.settlement_adjustment_methodology && (
              <div className="text-xs text-[var(--sapContent_LabelColor)]">
                {contract.settlement_adjustment_methodology}
                {contract.settlement_adjustment_locked ? ' (locked)' : ''}
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  const detailContent = selectedContract ? (
    <div className="h-full overflow-y-auto">
      <div className="p-4 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <h1 className="font-['72:Black',sans-serif] text-xl text-[#0064d9] m-0">
              Contrato
            </h1>
            {(() => {
              const s = computeDisplayStatus(selectedContract);
              return (
                <FioriObjectStatus status={s.type}>
                  {s.label}
                </FioriObjectStatus>
              );
            })()}
          </div>
          <FioriButton variant="ghost" icon={<RefreshCw className="w-4 h-4" />} onClick={refetchDetail}>
            Atualizar
          </FioriButton>
        </div>

        {/* Contract ID */}
        <div className="bg-[var(--sapGroup_ContentBackground)] rounded p-3">
          <div className="text-xs text-[var(--sapContent_LabelColor)] mb-1">Identificador do contrato</div>
          <div className="font-['72:Regular',sans-serif] text-sm text-[#131e29] break-all">
            {selectedContract.contract_id}
          </div>
        </div>

        {/* KPI Tiles */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <FioriTile
            title="Estrutura"
            value={`#${selectedContract.trade_index ?? 0}`}
            icon={<ArrowRightLeft className="w-4 h-4" />}
          />
          <FioriTile
            title="Liquidação"
            value={selectedContract.settlement_date 
              ? new Date(selectedContract.settlement_date).toLocaleDateString('pt-BR')
              : '—'}
            icon={<Calendar className="w-4 h-4" />}
          />
          <FioriTile
            title="Operação"
            value={`#${selectedContract.deal_id}`}
            icon={<FileText className="w-4 h-4" />}
          />
          <FioriTile
            title="Cotação"
            value={`#${selectedContract.rfq_id}`}
            icon={<FileText className="w-4 h-4" />}
          />
        </div>

        {/* Counterparty */}
        <div className="bg-white rounded-lg shadow-sm p-4">
          <h3 className="font-['72:Bold',sans-serif] text-base text-[#131e29] mb-2">
            Contraparte
          </h3>
          <div className="flex items-center gap-2 text-sm text-[#131e29]">
            <Building2 className="w-4 h-4 text-[var(--sapContent_IconColor)]" />
            <span>
              {selectedContract.counterparty?.name ||
                selectedContract.counterparty_name ||
                (selectedContract.counterparty_id
                  ? `Contraparte #${selectedContract.counterparty_id}`
                  : '—')}
            </span>
          </div>
        </div>

        {/* Trade Snapshot */}
        {renderTradeSnapshot(selectedContract)}

        {/* Legs detail (institutional) */}
        {renderLegDetailCards(selectedContract)}

        {/* Exposure coverage */}
        {renderExposureCoverage(selectedContractExposures)}

        {/* Links */}
        <div className="bg-white rounded-lg shadow-sm p-4">
          <h3 className="font-['72:Bold',sans-serif] text-base text-[#131e29] mb-4">
            Links Relacionados
          </h3>
          <div className="space-y-2">
            <button
              onClick={() => handleNavigateToDeal(selectedContract.deal_id)}
              className="w-full flex items-center justify-between p-3 bg-[var(--sapGroup_ContentBackground)] rounded hover:bg-[var(--sapList_HoverBackground)] transition-colors"
            >
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-[var(--sapContent_IconColor)]" />
                <span className="text-sm">Abrir operação nº {selectedContract.deal_id}</span>
              </div>
              <ExternalLink className="w-4 h-4 text-[var(--sapContent_IconColor)]" />
            </button>
            <button
              onClick={() => handleNavigateToRfq(selectedContract.rfq_id)}
              className="w-full flex items-center justify-between p-3 bg-[var(--sapGroup_ContentBackground)] rounded hover:bg-[var(--sapList_HoverBackground)] transition-colors"
            >
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-[var(--sapContent_IconColor)]" />
                <span className="text-sm">Abrir cotação nº {selectedContract.rfq_id}</span>
              </div>
              <ExternalLink className="w-4 h-4 text-[var(--sapContent_IconColor)]" />
            </button>
            {selectedContract.counterparty_id && (
              <div className="flex items-center gap-2 p-3 bg-[var(--sapGroup_ContentBackground)] rounded">
                <Building2 className="w-4 h-4 text-[var(--sapContent_IconColor)]" />
                <span className="text-sm">
                  {selectedContract.counterparty?.name ||
                    selectedContract.counterparty_name ||
                    `Contraparte #${selectedContract.counterparty_id}`}
                </span>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  ) : isLoadingDetail ? (
    <LoadingState message="Carregando detalhes..." fullPage />
  ) : (
    <EmptyState
      title="Selecione um contrato"
      description="Escolha um contrato da lista para ver os detalhes"
      icon={<FileText className="w-8 h-8 text-[var(--sapContent_IconColor)]" />}
      fullPage
    />
  );

  return (
    <AnalyticTwoPaneLayout
      left={<AnalyticScopeTree />}
      right={
        <FioriFlexibleColumnLayout
          masterTitle={UX_COPY.pages.contracts.title}
          masterContent={masterContent}
          masterWidth={340}
          detailContent={detailContent}
        />
      }
    />
  );
}

export default ContractsPageIntegrated;
