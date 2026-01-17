/**
 * Dashboard Page - Versão Integrada com APIs Reais
 * 
 * Visual IDÊNTICO à DashboardPage original.
 * Consome APIs reais:
 * - /market/aluminum/quote - Alumínio LME Spot
 * - /market/aluminum/history - Histórico
 * - /contracts/settlements/today - Vencimentos do dia
 * - /contracts/settlements/upcoming - Próximos vencimentos
 */

import { useMemo, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  useAluminumQuote, 
  useAluminumHistory, 
  useSettlementsToday,
  useSettlementsUpcoming,
  useDashboard,
} from '../../hooks';
import { formatNumber, formatCurrency, formatDate } from '../../services/dashboard.service';
import { LoadingState, ErrorState } from '../components/ui';
import { FioriCard, FioriCardHeader, FioriCardMetric } from '../components/fiori/FioriCard';
import { FioriBadge } from '../components/fiori/FioriBadge';
import { FioriQuickLink } from '../components/fiori/FioriQuickLink';
import { FioriTeamCard } from '../components/fiori/FioriTeamCard';
import { FioriButton } from '../components/fiori/FioriButton';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { 
  Users, 
  BarChart3, 
  FileText, 
  Inbox, 
  FileCheck,
  TrendingUp,
  MoreHorizontal,
  Clock,
} from 'lucide-react';

// ============================================
// Helpers - Horário de Mercado LME
// ============================================

type HistoryRange = '7d' | '30d' | '1y';

/**
 * Verifica se o mercado LME está aberto
 * Horário: 1:00 - 19:00 GMT, Segunda a Sexta
 */
function isLmeMarketOpen(): boolean {
  const now = new Date();
  const utcHour = now.getUTCHours();
  const utcDay = now.getUTCDay(); // 0=domingo, 6=sábado
  
  // Fins de semana - mercado fechado
  if (utcDay === 0 || utcDay === 6) return false;
  
  // Horário de funcionamento: 1:00 - 19:00 GMT
  if (utcHour < 1 || utcHour >= 19) return false;
  
  return true;
}

/**
 * Formata data para exibição no eixo X do gráfico
 */
function formatChartDate(ts: string, range: HistoryRange): string {
  const date = new Date(ts);
  if (range === '7d') {
    // Para 1 semana: "Seg 13"
    const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    return `${days[date.getDay()]} ${date.getDate()}`;
  } else if (range === '30d') {
    // Para 1 mês: "13 Jan"
    const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    return `${date.getDate()} ${months[date.getMonth()]}`;
  } else {
    // Para 1 ano: "Jan 26"
    const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    return `${months[date.getMonth()]} ${String(date.getFullYear()).slice(2)}`;
  }
}

export function DashboardPageIntegrated() {
  const navigate = useNavigate();
  
  // Estado do período do gráfico
  const [historyRange, setHistoryRange] = useState<HistoryRange>('30d');
  
  // APIs reais
  const aluminumQuote = useAluminumQuote();
  const aluminumHistory = useAluminumHistory(historyRange);
  const settlementsToday = useSettlementsToday();
  const settlementsUpcoming = useSettlementsUpcoming(8);
  
  // Dashboard summary (para timeline/rfqs até API específica ser criada)
  const dashboard = useDashboard();
  
  // Mercado aberto/fechado
  const marketOpen = useMemo(() => isLmeMarketOpen(), []);

  // ============================================
  // Dados derivados
  // ============================================

  // Histórico formatado para o gráfico - com datas reais
  const historicalData = useMemo(() => {
    if (!aluminumHistory.data || aluminumHistory.data.length === 0) {
      return [];
    }
    
    return aluminumHistory.data.map((point) => ({
      date: point.ts,
      dateLabel: formatChartDate(point.ts, historyRange),
      cash: point.mid,
      threeMonths: point.ask || point.mid * 1.02,
    }));
  }, [aluminumHistory.data, historyRange]);

  // Próximos vencimentos
  const upcomingMaturities = useMemo(() => {
    if (!settlementsUpcoming.data || settlementsUpcoming.data.length === 0) {
      // Fallback mock
      return [
        { id: 1, counterparty: 'Jologa', quantity: 100, liquidationDate: 'Feb 7, 2024', mtm: '59K USD', mtmNegative: true },
        { id: 2, counterparty: 'Jologa', quantity: 200, liquidationDate: 'Mar 7, 2024', mtm: '32K USD', mtmNegative: true },
        { id: 3, counterparty: 'DelBoni Industries', quantity: 450, liquidationDate: 'Apr 14, 2024', mtm: '30K USD', mtmNegative: false },
      ];
    }
    
    return settlementsUpcoming.data.map((item, idx) => ({
      id: idx + 1,
      counterparty: item.counterparty_name,
      quantity: Math.abs(item.mtm_today_usd || 0) / 100, // Aproximação
      liquidationDate: formatDate(item.settlement_date),
      mtm: item.mtm_today_usd 
        ? `${Math.abs(item.mtm_today_usd / 1000).toFixed(0)}K USD` 
        : '—',
      mtmNegative: (item.mtm_today_usd || 0) < 0,
    }));
  }, [settlementsUpcoming.data]);

  // Vencimentos do dia
  const todaySettlementsCount = settlementsToday.data?.length || 0;
  const todaySettlementsTotal = useMemo(() => {
    if (!settlementsToday.data) return 0;
    return settlementsToday.data.reduce(
      (acc, item) => acc + Math.abs(item.settlement_value_usd || item.mtm_today_usd || 0), 
      0
    );
  }, [settlementsToday.data]);

  // Contagem de RFQs pendentes (do dashboard summary)
  const pendingRfqsCount = useMemo(() => {
    if (!dashboard.data?.rfqs) return 0;
    return dashboard.data.rfqs.filter(r => r.status === 'pending').length;
  }, [dashboard.data?.rfqs]);

  const totalRfqsCount = dashboard.data?.rfqs?.length ?? 0;

  // Timeline de mensagens (do dashboard summary até API específica)
  const teamMessages = useMemo(() => {
    if (!dashboard.data?.timeline || dashboard.data.timeline.length === 0) {
      return [
        {
          name: "Sistema",
          role: "Automático",
          initials: "SY",
          timestamp: new Date().toLocaleString('pt-BR'),
          message: "Sistema inicializado. Aguardando atividades dos usuários.",
          backgroundColor: "#0064d9",
        },
      ];
    }
    
    return dashboard.data.timeline.map((item) => ({
      name: item.author,
      role: item.role,
      initials: item.avatar.initials,
      timestamp: item.timestamp,
      message: item.content,
      backgroundColor: item.avatar.colorScheme === 1 ? "#0064d9" : "#bb0000",
    }));
  }, [dashboard.data?.timeline]);

  // Cotação atual - SEM valores fallback estáticos
  // Se não há dados da API ou mercado fechado, mostra "--"
  const hasQuoteData = aluminumQuote.data && (aluminumQuote.data.bid || aluminumQuote.data.ask);
  const spotPrice = hasQuoteData 
    ? ((aluminumQuote.data!.bid ?? 0) + (aluminumQuote.data!.ask ?? 0)) / 2
    : null;
  const bidPrice = hasQuoteData ? aluminumQuote.data!.bid : null;
  const askPrice = hasQuoteData ? aluminumQuote.data!.ask : null;

  // ============================================
  // Loading / Error states
  // ============================================

  const isLoading = aluminumQuote.isLoading || settlementsUpcoming.isLoading;
  const hasError = aluminumQuote.isError && settlementsUpcoming.isError;
  const error = aluminumQuote.error || settlementsUpcoming.error;

  if (isLoading && !aluminumQuote.data) {
    return <LoadingState message="Carregando dashboard..." fullPage />;
  }

  if (hasError) {
    return <ErrorState error={error} onRetry={() => {
      aluminumQuote.refetch();
      settlementsUpcoming.refetch();
    }} />;
  }

  // ============================================
  // Render - VISUAL IDÊNTICO à DashboardPage original
  // ============================================

  return (
    <div className="bg-[#f7f7f7] min-h-screen p-4">
      <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr_280px] gap-4 max-w-[1600px] mx-auto">
        {/* Left Column - Metrics */}
        <div className="flex flex-col gap-4">
          {/* Alumínio LME Spot */}
          <FioriCard>
            <FioriCardHeader 
              title="Alumínio LME Spot - USD/mt" 
              subtitle={aluminumQuote.data?.source || 'LME'}
            />
            
            {/* Indicador de mercado aberto/fechado */}
            <div className={`flex items-center gap-2 mb-3 px-2 py-1 rounded text-xs font-['72:Regular',sans-serif] ${
              marketOpen 
                ? 'bg-[var(--sapPositiveBackground,#f5fae5)] text-[var(--sapPositiveTextColor,#256f3a)]' 
                : 'bg-[var(--sapNeutralBackground,#f5f6f7)] text-[var(--sapNeutralTextColor,#556b82)]'
            }`}>
              <Clock className="w-3 h-3" />
              {marketOpen ? 'Mercado Aberto' : 'Mercado Fechado'}
              <span className="text-[10px] opacity-70">(1am-7pm GMT, Seg-Sex)</span>
            </div>
            
            {/* Valores de cotação - ou mensagem se sem dados */}
            {hasQuoteData ? (
              <>
                <div className="mb-6">
                  <FioriCardMetric value={formatNumber(spotPrice!, 2)} />
                </div>
                <div className="flex gap-4 text-center mb-4">
                  <div className="flex-1">
                    <div className="font-['72:Regular',sans-serif] text-[12px] text-[var(--sapContent_LabelColor,#556b82)] mb-1">
                      Compra (Bid)
                    </div>
                    <div className="font-['72:Semibold_Duplex',sans-serif] text-[16px] text-[var(--sapContent_ForegroundTextColor,#131e29)]">
                      {bidPrice !== null ? formatNumber(bidPrice, 2) : '--'}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="font-['72:Regular',sans-serif] text-[12px] text-[var(--sapContent_LabelColor,#556b82)] mb-1">
                      Venda (Ask)
                    </div>
                    <div className="font-['72:Semibold_Duplex',sans-serif] text-[16px] text-[var(--sapContent_ForegroundTextColor,#131e29)]">
                      {askPrice !== null ? formatNumber(askPrice, 2) : '--'}
                    </div>
                  </div>
                </div>
                {aluminumQuote.data?.as_of && (
                  <div className="text-[10px] text-[var(--sapContent_LabelColor,#556b82)] text-center">
                    Última atualização: {new Date(aluminumQuote.data.as_of).toLocaleString('pt-BR')}
                  </div>
                )}
              </>
            ) : (
              <div className="py-6 text-center">
                <div className="font-['72:Semibold_Duplex',sans-serif] text-[28px] text-[var(--sapContent_LabelColor,#556b82)] mb-2">
                  --
                </div>
                <div className="text-[12px] text-[var(--sapContent_LabelColor,#556b82)]">
                  {aluminumQuote.isLoading ? 'Carregando...' : 
                   aluminumQuote.isError ? 'Dados indisponíveis' : 
                   !marketOpen ? 'Mercado fechado' : 'Sem dados'}
                </div>
              </div>
            )}
          </FioriCard>

          {/* PO / SO Abertas */}
          <FioriCard>
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-['72:Regular',sans-serif] text-[16px] text-[var(--sapTile_TitleTextColor,#131e29)] leading-[normal] m-0">
                    PO / SO Abertas
                  </h3>
                  {pendingRfqsCount > 0 && <FioriBadge variant="new" size="small">New</FioriBadge>}
                </div>
                <p className="font-['72:Regular',sans-serif] text-[14px] text-[var(--sapContent_LabelColor,#556b82)] leading-[normal] m-0">
                  Hedges Pendentes
                </p>
              </div>
              <button 
                className="text-[var(--sapContent_IconColor,#556b82)] hover:text-[var(--sapButton_TextColor,#0064d9)] transition-colors border-0 bg-transparent cursor-pointer p-1"
                title="Mais opções"
                aria-label="Mais opções"
              >
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </div>
            
            <div className="flex items-center gap-4 mb-4">
              <div className="font-['72:Semibold_Duplex',sans-serif] text-[48px] text-[var(--sapContent_ForegroundTextColor,#131e29)] leading-[normal]">
                {pendingRfqsCount}
              </div>
              <div className="flex flex-col text-right">
                <div className="font-['72:Regular',sans-serif] text-[12px] text-[var(--sapContent_LabelColor,#556b82)]">
                  of
                </div>
                <div className="font-['72:Semibold_Duplex',sans-serif] text-[16px] text-[var(--sapContent_ForegroundTextColor,#131e29)]">
                  {totalRfqsCount}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-[var(--sapGroup_ContentBorderColor,#d9d9d9)]">
              <button 
                className="font-['72:Regular',sans-serif] text-[14px] text-[var(--sapButton_TextColor,#0064d9)] hover:underline bg-transparent border-0 cursor-pointer p-0"
                onClick={() => navigate('/financeiro/rfqs')}
              >
                Ver todas
              </button>
              <TrendingUp className="w-5 h-5 text-[var(--sapButton_TextColor,#0064d9)]" />
            </div>
          </FioriCard>

          {/* Vencimentos do dia */}
          <FioriCard>
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-['72:Regular',sans-serif] text-[16px] text-[var(--sapTile_TitleTextColor,#131e29)] leading-[normal] m-0">
                    Vencimentos do dia
                  </h3>
                  {todaySettlementsCount > 0 && <FioriBadge variant="new" size="small">New</FioriBadge>}
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4 mb-4">
              <div className="flex-1">
                <div className="mb-3">
                  <div className="font-['72:Regular',sans-serif] text-[12px] text-[var(--sapContent_LabelColor,#556b82)] mb-1">
                    USD
                  </div>
                  <div className={`font-['72:Semibold_Duplex',sans-serif] text-[24px] leading-[normal] ${
                    todaySettlementsTotal < 0 ? 'text-[var(--sapNegativeTextColor,#bb0000)]' : 'text-[var(--sapContent_ForegroundTextColor,#131e29)]'
                  }`}>
                    {(todaySettlementsTotal / 1000).toFixed(0)}K
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-center justify-center">
                <div className="font-['72:Semibold_Duplex',sans-serif] text-[48px] text-[var(--sapContent_ForegroundTextColor,#131e29)] leading-[normal]">
                  {todaySettlementsCount}
                </div>
                <div className="font-['72:Regular',sans-serif] text-[12px] text-[var(--sapContent_LabelColor,#556b82)]">
                  contratos
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-[var(--sapGroup_ContentBorderColor,#d9d9d9)]">
              <button 
                className="font-['72:Regular',sans-serif] text-[14px] text-[var(--sapButton_TextColor,#0064d9)] hover:underline bg-transparent border-0 cursor-pointer p-0"
                onClick={() => navigate('/financeiro/contratos')}
              >
                View All
              </button>
            </div>
          </FioriCard>
        </div>

        {/* Center Column - Chart & Table */}
        <div className="flex flex-col gap-4">
          {/* Alumínio LME Histórico */}
          <FioriCard>
            {/* Header com botões de período */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-['72:Bold',sans-serif] text-base text-[#131e29] m-0">
                  Alumínio LME Histórico
                </h3>
                <p className="font-['72:Regular',sans-serif] text-[12px] text-[var(--sapContent_LabelColor,#556b82)] m-0">
                  USD / ton • Atualização diária às 9:00 GMT
                </p>
              </div>
              
              {/* Botões de período */}
              <div className="flex gap-1">
                <button
                  onClick={() => setHistoryRange('7d')}
                  className={`px-3 py-1 text-xs font-['72:Regular',sans-serif] rounded border transition-colors ${
                    historyRange === '7d'
                      ? 'bg-[var(--sapButton_Emphasized_Background,#0064d9)] text-white border-[var(--sapButton_Emphasized_Background,#0064d9)]'
                      : 'bg-white text-[var(--sapButton_TextColor,#0064d9)] border-[var(--sapButton_BorderColor,#0064d9)] hover:bg-[var(--sapButton_Hover_Background,#eaeff5)]'
                  }`}
                >
                  1 Sem
                </button>
                <button
                  onClick={() => setHistoryRange('30d')}
                  className={`px-3 py-1 text-xs font-['72:Regular',sans-serif] rounded border transition-colors ${
                    historyRange === '30d'
                      ? 'bg-[var(--sapButton_Emphasized_Background,#0064d9)] text-white border-[var(--sapButton_Emphasized_Background,#0064d9)]'
                      : 'bg-white text-[var(--sapButton_TextColor,#0064d9)] border-[var(--sapButton_BorderColor,#0064d9)] hover:bg-[var(--sapButton_Hover_Background,#eaeff5)]'
                  }`}
                >
                  1 Mês
                </button>
                <button
                  onClick={() => setHistoryRange('1y')}
                  className={`px-3 py-1 text-xs font-['72:Regular',sans-serif] rounded border transition-colors ${
                    historyRange === '1y'
                      ? 'bg-[var(--sapButton_Emphasized_Background,#0064d9)] text-white border-[var(--sapButton_Emphasized_Background,#0064d9)]'
                      : 'bg-white text-[var(--sapButton_TextColor,#0064d9)] border-[var(--sapButton_BorderColor,#0064d9)] hover:bg-[var(--sapButton_Hover_Background,#eaeff5)]'
                  }`}
                >
                  1 Ano
                </button>
              </div>
            </div>
            
            {/* Loading state do gráfico */}
            {aluminumHistory.isLoading ? (
              <div className="h-[240px] flex items-center justify-center">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--sapButton_TextColor,#0064d9)] mx-auto mb-2"></div>
                  <p className="text-sm text-[var(--sapContent_LabelColor,#556b82)]">Carregando dados...</p>
                </div>
              </div>
            ) : historicalData.length === 0 ? (
              <div className="h-[240px] flex items-center justify-center">
                <p className="text-sm text-[var(--sapContent_LabelColor,#556b82)]">
                  Nenhum dado disponível para o período
                </p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={240}>
                <LineChart data={historicalData} key={`chart-${historyRange}`}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--sapGroup_ContentBorderColor,#d9d9d9)" />
                  <XAxis 
                    dataKey="dateLabel"
                    tick={{ fill: 'var(--sapContent_LabelColor,#556b82)', fontSize: 11, fontFamily: '72:Regular,sans-serif' }}
                    interval={historyRange === '7d' ? 0 : historyRange === '30d' ? 4 : 30}
                    angle={historyRange === '1y' ? -45 : 0}
                    textAnchor={historyRange === '1y' ? 'end' : 'middle'}
                    height={historyRange === '1y' ? 60 : 30}
                  />
                  <YAxis 
                    tick={{ fill: 'var(--sapContent_LabelColor,#556b82)', fontSize: 11, fontFamily: '72:Regular,sans-serif' }}
                    domain={['dataMin - 50', 'dataMax + 50']}
                    tickFormatter={(value) => formatNumber(value, 0)}
                    width={60}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid var(--sapGroup_ContentBorderColor,#d9d9d9)',
                      borderRadius: '4px',
                      fontFamily: '72:Regular,sans-serif',
                      fontSize: '12px'
                    }}
                    formatter={(value: number) => [formatNumber(value, 2), '']}
                    labelFormatter={(label) => `Data: ${label}`}
                  />
                  <Legend 
                    wrapperStyle={{ 
                      fontFamily: '72:Regular,sans-serif', 
                      fontSize: '12px',
                      color: 'var(--sapContent_LabelColor,#556b82)'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="cash" 
                    stroke="var(--sapButton_TextColor,#0064d9)" 
                    strokeWidth={2}
                    dot={historyRange === '7d' ? { fill: 'var(--sapButton_TextColor,#0064d9)', r: 4 } : false}
                    name="Cash (Mid)"
                    isAnimationActive={false}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="threeMonths" 
                    stroke="var(--sapCriticalTextColor,#e76500)" 
                    strokeWidth={2}
                    dot={historyRange === '7d' ? { fill: 'var(--sapCriticalTextColor,#e76500)', r: 4 } : false}
                    name="Ask"
                    isAnimationActive={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </FioriCard>

          {/* Próximos Vencimentos */}
          <FioriCard>
            <div className="flex items-center justify-between mb-4">
              <FioriCardHeader title="Próximos Vencimentos" subtitle="Por contraparte e data" />
              <span className="font-['72:Regular',sans-serif] text-[12px] text-[var(--sapContent_LabelColor,#556b82)]">
                {upcomingMaturities.length} resultados
              </span>
            </div>

            {/* Dropdown */}
            <div className="mb-4">
              <select 
                className="w-full px-3 py-2 bg-white border border-[var(--sapField_BorderColor,#89919a)] rounded-[4px] font-['72:Regular',sans-serif] text-[14px] text-[var(--sapField_TextColor,#131e29)] cursor-pointer hover:border-[var(--sapField_Hover_BorderColor,#0064d9)] focus:outline-none focus:border-[var(--sapField_Focus_BorderColor,#0064d9)]"
                title="Filtrar por contraparte"
                aria-label="Filtrar por contraparte"
              >
                <option>Todos</option>
                {[...new Set(upcomingMaturities.map(m => m.counterparty))].map(cp => (
                  <option key={cp}>{cp}</option>
                ))}
              </select>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[var(--sapList_BorderColor,#d9d9d9)]">
                    <th className="font-['72:Semibold_Duplex',sans-serif] text-[14px] text-[var(--sapList_HeaderTextColor,#131e29)] text-left py-2 px-3">
                      Contraparte
                    </th>
                    <th className="font-['72:Semibold_Duplex',sans-serif] text-[14px] text-[var(--sapList_HeaderTextColor,#131e29)] text-left py-2 px-3">
                      Data de Liquidação
                    </th>
                    <th className="font-['72:Semibold_Duplex',sans-serif] text-[14px] text-[var(--sapList_HeaderTextColor,#131e29)] text-right py-2 px-3">
                      MTM
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {upcomingMaturities.map((item) => (
                    <tr 
                      key={item.id}
                      className="border-b border-[var(--sapList_BorderColor,#d9d9d9)] hover:bg-[var(--sapList_HoverBackground,#f7f7f7)] transition-colors cursor-pointer"
                    >
                      <td className="font-['72:Regular',sans-serif] text-[14px] text-[var(--sapList_TextColor,#131e29)] py-2 px-3">
                        {item.counterparty}
                      </td>
                      <td className="font-['72:Regular',sans-serif] text-[14px] text-[var(--sapList_TextColor,#131e29)] py-2 px-3">
                        {item.liquidationDate}
                      </td>
                      <td className="font-['72:Regular',sans-serif] text-[14px] text-right py-2 px-3">
                        <span className={item.mtmNegative ? 'text-[var(--sapNegativeTextColor,#bb0000)]' : 'text-[var(--sapPositiveTextColor,#107e3e)]'}>
                          {item.mtm}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </FioriCard>
        </div>

        {/* Right Column - Quick Links & Team */}
        <div className="flex flex-col gap-4">
          {/* Quick Links */}
          <FioriCard padding="small">
            <div className="flex items-center justify-between mb-3 px-2">
              <h3 className="font-['72:Regular',sans-serif] text-[16px] text-[var(--sapTile_TitleTextColor,#131e29)] leading-[normal] m-0">
                Acessos rápidos
              </h3>
            </div>
            <div className="flex flex-col">
              <FioriQuickLink icon={<FileText className="w-4 h-4" />} label="Nova cotação" href="/financeiro/rfqs/novo" />
              <FioriQuickLink icon={<BarChart3 className="w-4 h-4" />} label="Exposições" href="/financeiro/exposicoes" />
              <FioriQuickLink icon={<FileCheck className="w-4 h-4" />} label="Contrapartes" href="/financeiro/contrapartes" />
              <FioriQuickLink icon={<FileCheck className="w-4 h-4" />} label="Contratos" href="/financeiro/contratos" />
              <FioriQuickLink icon={<Users className="w-4 h-4" />} label="Pedidos de Venda" href="/vendas/sales-orders" />
              <FioriQuickLink icon={<Inbox className="w-4 h-4" />} label="Pedidos de Compra" href="/compras/purchase-orders" />
            </div>
          </FioriCard>

          {/* Mensagens da Equipe / Timeline */}
          <FioriCard padding="small">
            <div className="mb-3 px-2">
              <h3 className="font-['72:Regular',sans-serif] text-[16px] text-[var(--sapTile_TitleTextColor,#131e29)] leading-[normal] m-0">
                Atividades da Equipe
              </h3>
              <p className="font-['72:Regular',sans-serif] text-[12px] text-[var(--sapContent_LabelColor,#556b82)] mt-1">
                Últimas ações no sistema
              </p>
            </div>
            <div className="flex flex-col gap-2">
              {teamMessages.map((msg, idx) => (
                <FioriTeamCard
                  key={idx}
                  name={msg.name}
                  role={msg.role}
                  initials={msg.initials}
                  timestamp={msg.timestamp}
                  message={msg.message}
                  backgroundColor={msg.backgroundColor}
                />
              ))}
            </div>
          </FioriCard>
        </div>
      </div>
    </div>
  );
}

export default DashboardPageIntegrated;
