/**
 * DealsPageIntegrated.tsx
 * 
 * Versão integrada da página de Deals.
 * Mantém visual EXATAMENTE igual ao DealsPage original,
 * mas consome dados reais das APIs:
 * - GET /deals - Lista de deals
 * - GET /deals/:id/pnl - P&L calculado pelo backend
 * 
 * O backend é a fonte da verdade para todos os cálculos.
 */

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FioriObjectStatus, mapStatusToType } from '../components/fiori/FioriObjectStatus';
import { SAPGridTable } from '../components/fiori/SAPGridTable';
import { FioriKPIPrimary } from '../components/fiori/FioriKPIPrimary';
import { FioriKPISecondary } from '../components/fiori/FioriKPISecondary';
import { FioriGovernanceMetadata } from '../components/fiori/FioriGovernanceMetadata';
import { FioriFlexibleColumnLayout } from '../components/fiori/FioriFlexibleColumnLayout';
import { FioriButton } from '../components/fiori/FioriButton';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Search, 
  Package, 
  Building2, 
  Download, 
  Filter 
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  Cell 
} from 'recharts';
import { listDeals, getDealPnl, updateDeal } from '../../services/deals.service';
import { Deal, DealPnlResponse, DealLifecycleStatus } from '../../types';
import { LoadingState } from '../components/ui/LoadingState';
import { ErrorState } from '../components/ui/ErrorState';

export function DealsPageIntegrated() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // State
  const [deals, setDeals] = useState<Deal[]>([]);
  const [selectedDealId, setSelectedDealId] = useState<number | null>(null);
  const [selectedPnl, setSelectedPnl] = useState<DealPnlResponse | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState('');

  const selectedDeal = useMemo(
    () => deals.find((d) => d.id === selectedDealId) || null,
    [deals, selectedDealId]
  );

  const [referenceNameDraft, setReferenceNameDraft] = useState('');
  const [isSavingReferenceName, setIsSavingReferenceName] = useState(false);
  const [referenceNameError, setReferenceNameError] = useState<string | null>(null);

  useEffect(() => {
    setReferenceNameDraft(selectedDeal?.reference_name || '');
    setReferenceNameError(null);
  }, [selectedDealId, selectedDeal?.reference_name]);

  const _didInitFromUrl = useRef(false);
  useEffect(() => {
    if (_didInitFromUrl.current) return;
    _didInitFromUrl.current = true;

    const q = searchParams.get('q');
    if (q) setSearchTerm(q);

    const idParam = searchParams.get('id');
    if (idParam) {
      const id = Number(idParam);
      if (Number.isFinite(id)) setSelectedDealId(id);
    }
  }, [searchParams]);
  
  // Loading states
  const [isLoadingDeals, setIsLoadingDeals] = useState(true);
  const [isLoadingPnl, setIsLoadingPnl] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch deals list
  const fetchDeals = useCallback(async () => {
    setIsLoadingDeals(true);
    setError(null);
    try {
      const data = await listDeals();
      setDeals(data);
      // Auto-select first deal
      if (data.length > 0 && !selectedDealId) {
        setSelectedDealId(data[0].id);
      }
    } catch (err) {
      console.error('Failed to fetch deals:', err);
      setError('Erro ao carregar operações');
    } finally {
      setIsLoadingDeals(false);
    }
  }, [selectedDealId]);

  // Fetch P&L for selected deal
  const fetchPnl = useCallback(async () => {
    if (!selectedDealId) {
      setSelectedPnl(null);
      return;
    }
    
    setIsLoadingPnl(true);
    try {
      const data = await getDealPnl(selectedDealId);
      setSelectedPnl(data);
    } catch (err) {
      console.error('Failed to fetch P&L:', err);
      // Don't set error - just show empty state
      setSelectedPnl(null);
    } finally {
      setIsLoadingPnl(false);
    }
  }, [selectedDealId]);

  useEffect(() => {
    fetchDeals();
  }, [fetchDeals]);

  useEffect(() => {
    fetchPnl();
  }, [fetchPnl]);

  // Filter deals
  const filteredDeals = deals.filter((deal) => {
    const matchesStatus = filterStatus === 'All' || deal.lifecycle_status === filterStatus;
    const matchesSearch = 
      deal.deal_uuid.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (deal.reference_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (deal.commodity || '').toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const saveReferenceName = useCallback(async () => {
    if (!selectedDealId) return;
    setIsSavingReferenceName(true);
    setReferenceNameError(null);
    try {
      const updated = await updateDeal(selectedDealId, { reference_name: referenceNameDraft });
      setDeals((prev) => prev.map((d) => (d.id === updated.id ? updated : d)));
    } catch (err) {
      console.error('Failed to update deal reference name:', err);
      setReferenceNameError('Erro ao salvar nome de referência');
    } finally {
      setIsSavingReferenceName(false);
    }
  }, [referenceNameDraft, selectedDealId]);

  const handleDealSelect = (dealId: number) => {
    setSelectedDealId(dealId);
  };

  const formatLifecycleStatusLabel = (status: DealLifecycleStatus | string | null | undefined) => {
    switch (status) {
      case 'draft':
        return 'Rascunho';
      case 'active':
        return 'Ativa';
      case 'closed':
        return 'Encerrada';
      default:
        return status ? String(status) : '—';
    }
  };

  // Prepare chart data for selected deal
  const pnlBreakdown = selectedPnl ? [
    { 
      name: 'Revenue', 
      value: selectedPnl.physical_revenue / 1000, 
      fill: '#107e3e' 
    },
    { 
      name: 'Cost', 
      value: selectedPnl.physical_cost / 1000, 
      fill: '#aa0808' 
    },
    { 
      name: 'Hedge MTM', 
      value: selectedPnl.hedge_pnl_mtm / 1000, 
      fill: selectedPnl.hedge_pnl_mtm >= 0 ? '#0070f2' : '#aa0808' 
    },
  ] : [];

  const physicalLegsData = selectedPnl?.physical_legs.map((leg, idx) => ({
    name: leg.source_id.toString(),
    value: (leg.quantity_mt * (leg.fixed_price || 0)) / 1000,
    type: leg.direction,
  })) || [];

  const physicalLegsColumns = [
    {
      header: 'Tipo',
      accessor: 'direction',
      render: (value: unknown) => (
        <FioriObjectStatus status="neutral">
          {(value as string) === 'sell' ? 'Venda' : 'Compra'}
        </FioriObjectStatus>
      ),
    },
    {
      header: 'ID',
      accessor: 'source_id',
      render: (value: unknown, row: Record<string, unknown>) => (
        <a
          href={`/${row.direction === 'sell' ? 'vendas/sales-orders' : 'compras/purchase-orders'}/${value}`}
          onClick={(e) => {
            e.preventDefault();
            navigate(`/${row.direction === 'sell' ? 'vendas/sales-orders' : 'compras/purchase-orders'}/${value}`);
          }}
          className="text-[var(--sapLink_TextColor)] hover:underline font-normal"
        >
          {value as string}
        </a>
      ),
    },
    {
      header: 'Quantidade (t)',
      accessor: 'quantity_mt',
      align: 'right' as const,
      render: (value: unknown) => (value as number).toLocaleString('pt-BR'),
    },
    {
      header: 'Preço unitário',
      accessor: 'fixed_price',
      align: 'right' as const,
      render: (value: unknown) => (value ? `US$ ${(value as number).toLocaleString('pt-BR')}` : '—'),
    },
  ];

  const hedgeLegsColumns = [
    {
      header: 'Contrato',
      accessor: 'hedge_id',
      render: (value: unknown) => (
        <a
          href={`/financeiro/contratos/${value}`}
          onClick={(e) => {
            e.preventDefault();
            navigate(`/financeiro/contratos/${value}`);
          }}
          className="text-[var(--sapLink_TextColor)] hover:underline font-normal"
        >
          {value as string}
        </a>
      ),
    },
    {
      header: 'Quantidade (t)',
      accessor: 'quantity_mt',
      align: 'right' as const,
      render: (value: unknown) => (value as number).toLocaleString('pt-BR'),
    },
    {
      header: 'Marcação a mercado (MTM)',
      accessor: 'mtm_value',
      align: 'right' as const,
      render: (value: unknown) => {
        const mtm = value as number;
        return (
          <span
            className="font-bold"
            style={{
              color: mtm >= 0 ? 'var(--sapPositiveTextColor)' : 'var(--sapNegativeTextColor)',
            }}
          >
            US$ {mtm.toLocaleString('pt-BR')}
          </span>
        );
      },
    },
  ];

  // Loading state
  if (isLoadingDeals && deals.length === 0) {
    return <LoadingState message="Carregando deals..." />;
  }

  // Error state
  if (error) {
    return <ErrorState error={{ detail: error }} onRetry={fetchDeals} />;
  }

  // selectedDeal is memoized above

  // Master Column Content
  const masterContent = (
    <>
      {/* Master Header */}
      <div className="border-b border-[var(--sapList_HeaderBorderColor)] p-4 bg-[var(--sapList_HeaderBackground)]">
        <h2 className="font-['72:Bold',sans-serif] text-base text-[var(--sapList_HeaderTextColor)] mb-3">
          Operações ({filteredDeals.length})
        </h2>
        <div className="space-y-2">
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por identificador..."
              className="w-full h-8 px-3 pr-8 text-sm bg-[var(--sapField_Background)] border border-[var(--sapField_BorderColor)] rounded outline-none focus:border-[var(--sapField_Focus_BorderColor)]"
            />
            <Search className="w-4 h-4 absolute right-2 top-2 text-[var(--sapContent_IconColor)]" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[var(--sapContent_LabelColor)] text-xs font-['72:Regular',sans-serif]">Status</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              title="Filtrar por status"
              className="h-8 px-2 text-sm bg-[var(--sapField_Background)] border border-[var(--sapField_BorderColor)] rounded outline-none"
            >
              <option value="All">Todos os status</option>
              <option value="draft">Rascunho</option>
              <option value="active">Ativa</option>
              <option value="closed">Encerrada</option>
            </select>
          </div>
        </div>
      </div>

      {/* Master List */}
      <div className="flex-1 overflow-y-auto">
        {filteredDeals.map((deal) => {
          const isSelected = selectedDealId === deal.id;
          // Use P&L data if available and matches, otherwise show basic info
          const pnlData = selectedPnl && selectedPnl.deal_id === deal.id ? selectedPnl : null;
          
          return (
            <button
              key={deal.id}
              onClick={() => handleDealSelect(deal.id)}
              className={`w-full p-4 border-b border-[var(--sapList_BorderColor)] text-left hover:bg-[var(--sapList_HoverBackground)] transition-colors ${
                isSelected
                  ? 'bg-[var(--sapList_SelectionBackgroundColor)] border-l-2 border-l-[var(--sapList_SelectionBorderColor)]'
                  : ''
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="font-['72:Bold',sans-serif] text-sm text-[var(--sapContent_ForegroundColor)]">
                  {deal.reference_name || deal.deal_uuid}
                </div>
                <FioriObjectStatus status={mapStatusToType(deal.lifecycle_status)}>
                  {formatLifecycleStatusLabel(deal.lifecycle_status)}
                </FioriObjectStatus>
              </div>
              {deal.reference_name && (
                <div className="text-[11px] text-[var(--sapContent_LabelColor)] mb-1 font-['72:Regular',sans-serif]">
                  {deal.deal_uuid}
                </div>
              )}
              <div className="text-xs text-[var(--sapContent_LabelColor)] mb-2 font-['72:Regular',sans-serif]">
                {deal.commodity || 'Alumínio'}
              </div>
              {pnlData && (
                <div className="flex items-center gap-2">
                  {pnlData.net_pnl >= 0 ? (
                    <TrendingUp className="w-4 h-4 text-[var(--sapPositiveTextColor)]" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-[var(--sapNegativeTextColor)]" />
                  )}
                  <span
                    className="text-sm font-['72:Bold',sans-serif]"
                    style={{
                      color:
                        pnlData.net_pnl >= 0
                          ? 'var(--sapPositiveTextColor)'
                          : 'var(--sapNegativeTextColor)',
                    }}
                  >
                    US$ {pnlData.net_pnl.toLocaleString('pt-BR')}
                  </span>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </>
  );

  // Detail Column Content
  const detailContent = selectedPnl ? (
    <div className="h-full overflow-y-auto">
      <div className="p-4 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <h1 className="font-['72:Black',sans-serif] text-2xl text-[var(--sapLink_TextColor,#0a6ed1)] m-0">
              {selectedDeal?.reference_name || selectedDeal?.deal_uuid || `Operação #${selectedPnl.deal_id}`}
            </h1>
            <FioriObjectStatus status={selectedPnl.net_pnl >= 0 ? 'success' : 'error'}>
              {selectedPnl.net_pnl >= 0 ? 'Resultado positivo' : 'Resultado negativo'}
            </FioriObjectStatus>
          </div>
          <div className="flex gap-2">
            <FioriButton variant="ghost" icon={<Filter className="w-4 h-4" />}>
              Ajustar filtros
            </FioriButton>
            <FioriButton variant="ghost" icon={<Download className="w-4 h-4" />}>
              Exportar
            </FioriButton>
          </div>
        </div>

        {/* Governance Metadata */}
        <FioriGovernanceMetadata
          lastUpdated={selectedPnl.snapshot_at ? new Date(selectedPnl.snapshot_at).toLocaleString('pt-BR') : '—'}
          calculatedAt={selectedPnl.snapshot_at ? new Date(selectedPnl.snapshot_at).toLocaleString('pt-BR') : '—'}
          source="Sistema"
          refreshable={true}
          onRefresh={fetchPnl}
        />

        {/* Human reference name */}
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <label className="block text-xs text-[var(--sapContent_LabelColor)] mb-1 font-['72:Regular',sans-serif]">
                Nome de referência (humanizado)
              </label>
              <input
                type="text"
                value={referenceNameDraft}
                onChange={(e) => setReferenceNameDraft(e.target.value)}
                placeholder="Ex.: Operação Fornecedor Mexicano"
                className="w-full h-9 px-3 text-sm bg-[var(--sapField_Background)] border border-[var(--sapField_BorderColor)] rounded outline-none focus:border-[var(--sapField_Focus_BorderColor)]"
              />
              <div className="mt-1 text-[11px] text-[var(--sapContent_LabelColor)] font-['72:Regular',sans-serif]">
                Esse nome é livre e serve para busca rápida e identificação do Deal.
              </div>
              {referenceNameError && (
                <div className="mt-2 text-[12px] text-[var(--sapNegativeTextColor)] font-['72:Regular',sans-serif]">
                  {referenceNameError}
                </div>
              )}
            </div>
            <div className="shrink-0">
              <FioriButton
                variant="emphasized"
                disabled={isSavingReferenceName || !selectedDealId}
                onClick={saveReferenceName}
              >
                {isSavingReferenceName ? 'Salvando…' : 'Salvar'}
              </FioriButton>
            </div>
          </div>
        </div>

        {/* PRIMARY KPI - Net PnL (Enterprise Grade) */}
        <FioriKPIPrimary
          title="Resultado líquido"
          value={`US$ ${(selectedPnl.net_pnl / 1000).toFixed(1)}K`}
          unit={selectedPnl.currency}
          valueColor={selectedPnl.net_pnl >= 0 ? 'positive' : 'critical'}
          trend={selectedPnl.net_pnl >= 0 ? 'up' : 'down'}
          trendValue={selectedPnl.physical_revenue > 0 
            ? `${selectedPnl.net_pnl >= 0 ? '+' : ''}${((selectedPnl.net_pnl / selectedPnl.physical_revenue) * 100).toFixed(1)}%`
            : '—'
          }
          subtitle="Em relação à receita física"
          icon={<DollarSign className="w-5 h-5" />}
        />

        {/* SECONDARY KPIs - Supporting metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <FioriKPISecondary
            title="Receita física"
            value={`US$ ${(selectedPnl.physical_revenue / 1000).toFixed(0)}K`}
            valueColor="positive"
            icon={<Package className="w-4 h-4" />}
          />
          <FioriKPISecondary
            title="Custo físico"
            value={`US$ ${(selectedPnl.physical_cost / 1000).toFixed(0)}K`}
            valueColor="critical"
            icon={<Building2 className="w-4 h-4" />}
          />
          <FioriKPISecondary
            title="Resultado de hedge (realizado)"
            value={`US$ ${(selectedPnl.hedge_pnl_realized / 1000).toFixed(0)}K`}
            valueColor={selectedPnl.hedge_pnl_realized >= 0 ? 'positive' : 'critical'}
            subtitle="Posições encerradas"
          />
          <FioriKPISecondary
            title="Resultado de hedge (marcação a mercado)"
            value={`US$ ${(selectedPnl.hedge_pnl_mtm / 1000).toFixed(0)}K`}
            valueColor={selectedPnl.hedge_pnl_mtm >= 0 ? 'positive' : 'critical'}
            subtitle="Posições em aberto"
          />
        </div>

        {/* Visual Analytics Charts - Following Figma Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* PnL Breakdown Chart */}
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center justify-between mb-3">
              <p className="font-['72:Bold',sans-serif] text-sm text-[var(--sapTextColor,#32363a)]">
                Composição do resultado | K {selectedPnl.currency}
              </p>
            </div>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={pnlBreakdown}>
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: 'var(--sapContent_LabelColor,#6a6d70)' }} />
                <YAxis tick={{ fontSize: 11, fill: 'var(--sapContent_LabelColor,#6a6d70)' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid var(--sapList_BorderColor,#d9d9d9)',
                    borderRadius: '4px',
                    fontSize: '12px',
                  }}
                  formatter={(value: number) => [`US$ ${value.toFixed(0)}K`, '']}
                />
                <Bar dataKey="value">
                  {pnlBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Physical Legs Distribution */}
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center justify-between mb-3">
              <p className="font-['72:Bold',sans-serif] text-sm text-[var(--sapTextColor,#32363a)]">
                Valor das posições físicas | K {selectedPnl.currency}
              </p>
            </div>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={physicalLegsData} layout="horizontal">
                <XAxis type="number" tick={{ fontSize: 11, fill: 'var(--sapContent_LabelColor,#6a6d70)' }} />
                <YAxis
                  type="category"
                  dataKey="name"
                  tick={{ fontSize: 11, fill: 'var(--sapTextColor,#32363a)' }}
                  width={60}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid var(--sapList_BorderColor,#d9d9d9)',
                    borderRadius: '4px',
                    fontSize: '12px',
                  }}
                  formatter={(value: number) => [`US$ ${value.toFixed(0)}K`, '']}
                />
                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                  {physicalLegsData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        entry.type === 'sell'
                          ? 'var(--sapPositiveColor,#107e3e)'
                          : 'var(--sapNegativeColor,#bb0000)'
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Physical Legs Table */}
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="mb-3">
            <h3 className="font-['72:Bold',sans-serif] text-base text-[var(--sapTextColor,#32363a)]">Posições físicas</h3>
            <p className="text-xs text-[var(--sapLink_TextColor,#0a6ed1)] mt-1 cursor-pointer hover:underline">
              Pedidos de Venda e Compra
            </p>
          </div>
          <SAPGridTable
            columns={physicalLegsColumns}
            data={selectedPnl.physical_legs as unknown as Record<string, unknown>[]}
            emptyMessage="Sem posições físicas"
          />
        </div>

        {/* Hedge Legs Table */}
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="mb-3">
            <h3 className="font-['72:Bold',sans-serif] text-base text-[var(--sapTextColor,#32363a)]">Hedges financeiros</h3>
            <p className="text-xs text-[var(--sapLink_TextColor,#0a6ed1)] mt-1 cursor-pointer hover:underline">
              Hedges financeiros vinculados
            </p>
          </div>
          <SAPGridTable
            columns={hedgeLegsColumns}
            data={selectedPnl.hedge_legs as unknown as Record<string, unknown>[]}
            emptyMessage="Sem hedges financeiros"
          />
        </div>
      </div>
    </div>
  ) : isLoadingPnl ? (
    <div className="flex items-center justify-center h-full">
      <LoadingState message="Carregando resultado..." />
    </div>
  ) : (
    <div className="flex items-center justify-center h-full text-[var(--sapContent_LabelColor)]">
      <div className="text-center">
        <p className="font-['72:Regular',sans-serif] text-base mb-2">Selecione uma operação para visualizar a análise de resultado</p>
        <p className="font-['72:Regular',sans-serif] text-sm text-[var(--sapContent_LabelColor)]">Escolha um item na lista à esquerda</p>
      </div>
    </div>
  );

  return (
    <FioriFlexibleColumnLayout
      masterTitle="Operações e Resultado"
      masterContent={masterContent}
      masterWidth={320}
      detailContent={detailContent}
    />
  );
}
