/** Dashboard Page */

import { useMemo, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  useAluminumQuote, 
  useAluminumHistory, 
  useSettlementsToday,
  useSettlementsUpcoming,
  useDashboard,
} from '../../hooks';
import { formatNumber, formatCurrency, formatDate, formatHumanDateTime } from '../../services/dashboard.service';
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

function SkeletonBlock({ className }: { className: string }) {
  return <div className={`animate-pulse rounded bg-[rgba(0,0,0,0.06)] ${className}`} />;
}

function EmptyText() {
  return (
    <div className="h-[240px] flex items-center justify-center">
      <p className="text-sm text-[var(--sapContent_LabelColor,#556b82)]">Sem dados para o período.</p>
    </div>
  );
}

function ErrorText() {
  return (
    <div className="h-[240px] flex items-center justify-center">
      <p className="text-sm text-[var(--sapContent_LabelColor,#556b82)]">Falha ao carregar.</p>
    </div>
  );
}

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
      date: `${point.date}T00:00:00Z`,
      dateLabel: formatChartDate(`${point.date}T00:00:00Z`, historyRange),
      cash: point.cash ?? undefined,
      threeMonths: point.three_month ?? undefined,
    }));
  }, [aluminumHistory.data, historyRange]);

  // Próximos vencimentos
  const upcomingMaturities = useMemo(() => {
    if (!settlementsUpcoming.data || settlementsUpcoming.data.length === 0) return [];

    return settlementsUpcoming.data.map((item) => ({
      id: item.contract_id,
      ...(() => {
        const raw = String(item.counterparty_name || '').trim();
        const parts = raw.split('—').map((p) => p.trim()).filter(Boolean);
        if (parts.length >= 2) {
          return { company: parts[0], counterparty: parts.slice(1).join(' — ') };
        }
        return { company: 'Outros', counterparty: raw || '—' };
      })(),
      liquidationDate: formatDate(item.settlement_date),
      mtm: item.mtm_today_usd 
        ? `${Math.abs(item.mtm_today_usd / 1000).toFixed(0)}K USD` 
        : '—',
      mtmNegative: (item.mtm_today_usd || 0) < 0,
    }));
  }, [settlementsUpcoming.data]);

  const upcomingMaturitiesByCompany = useMemo(() => {
    const map = new Map<string, typeof upcomingMaturities>();
    for (const row of upcomingMaturities) {
      const company = (row as any).company || 'Outros';
      const list = map.get(company) || [];
      list.push(row);
      map.set(company, list);
    }
    return Array.from(map.entries())
      .map(([company, rows]) => ({ company, rows }))
      .sort((a, b) => a.company.localeCompare(b.company));
  }, [upcomingMaturities]);

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

  const formatActor = useCallback((rawRole: string | null | undefined) => {
    const key = String(rawRole || '').toLowerCase();
    if (key === 'admin') return 'Administrador';
    if (key === 'financeiro') return 'Financeiro';
    if (key === 'auditoria') return 'Auditoria';
    if (key === 'compras') return 'Compras';
    if (key === 'vendas') return 'Vendas';
    return rawRole ? String(rawRole) : '—';
  }, []);

  const actorInitials = useCallback((actor: string) => {
    const parts = String(actor || '').trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) return '—';
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return `${parts[0][0] || ''}${parts[1][0] || ''}`.toUpperCase();
  }, []);

  const priceTypeLabel = useCallback((raw: string | null | undefined) => {
    const key = String(raw || '').trim().toLowerCase();
    if (!key) return null;
    if (key === 'cash' || key === 'spot' || key === 'lme_cash') return 'Cash';
    if (key === '3m' || key === 'three_month' || key === 'three-month' || key === 'lme_3m') return '3M';
    if (key === 'fixed' || key === 'fixo') return 'Fixo';
    if (key === 'floating' || key === 'flutuante') return 'Flutuante';
    return raw;
  }, []);

  const formatBasics = useCallback(
    (qty: string | number | null | undefined, maturity: string | null | undefined, priceType: string | null | undefined) => {
      const parts: string[] = [];
      if (qty !== null && qty !== undefined && String(qty).trim() !== '') {
        const n = typeof qty === 'number' ? qty : Number(String(qty).replace(',', '.'));
        const text = Number.isFinite(n) ? String(n).replace(/\.0+$/, '') : String(qty);
        parts.push(`Qtd ${text} t`);
      }
      if (maturity) parts.push(`Venc ${formatDate(maturity)}`);
      const pt = priceTypeLabel(priceType);
      if (pt) parts.push(`Preço ${pt}`);
      return parts.length ? parts.join(' • ') : undefined;
    },
    [priceTypeLabel]
  );

  const translateEvent = useCallback(
    (content: string) => {
      const raw = String(content || '').trim();
      if (!raw) return null;

      // Prefer JSON-safe extraction (keeps us from showing payloads).
      if (raw.startsWith('{') && raw.endsWith('}')) {
        try {
          const obj = JSON.parse(raw) as Record<string, unknown>;
          const type = String(obj.event_type || obj.type || obj.name || obj.kind || '').toUpperCase();

          const soId =
            obj.so_id ?? obj.sales_order_id ?? obj.source_id ?? (obj.entity_type === 'so' ? obj.entity_id : undefined);
          const poId =
            obj.po_id ?? obj.purchase_order_id ?? obj.source_id ?? (obj.entity_type === 'po' ? obj.entity_id : undefined);
          const cpId = obj.counterparty_id ?? (obj.entity_type === 'counterparty' ? obj.entity_id : undefined);

          const qty = obj.quantity ?? obj.quantity_mt ?? obj.total_quantity_mt ?? obj.notional;
          const maturity =
            (obj.maturity as string | undefined) ||
            (obj.expected_delivery_date as string | undefined) ||
            (obj.delivery_date as string | undefined) ||
            (obj.settlement_date as string | undefined);
          const priceType =
            (obj.price_type as string | undefined) ||
            (obj.pricing_type as string | undefined) ||
            (obj.unit_price_type as string | undefined);

          const name =
            (obj.counterparty_name as string | undefined) ||
            (obj.name as string | undefined) ||
            (obj.trade_name as string | undefined);

          const soDetected = type.includes('SO') || type.includes('SALES_ORDER') || obj.entity_type === 'so';
          const poDetected = type.includes('PO') || type.includes('PURCHASE_ORDER') || obj.entity_type === 'po';
          const cpDetected = type.includes('COUNTERPARTY') || obj.entity_type === 'counterparty';

          if (soDetected) {
            const id = Number(soId);
            const href = Number.isFinite(id) ? `/vendas/sales-orders/${id}` : '/vendas/sales-orders';
            return { description: 'Novo SO criado', object: formatBasics(qty as any, maturity || null, priceType || null), href };
          }

          if (poDetected) {
            const id = Number(poId);
            const href = Number.isFinite(id) ? `/compras/purchase-orders/${id}` : '/compras/purchase-orders';
            return { description: 'Novo PO criado', object: formatBasics(qty as any, maturity || null, priceType || null), href };
          }

          if (cpDetected) {
            const id = Number(cpId);
            const href = Number.isFinite(id) ? `/financeiro/contrapartes?id=${id}` : '/financeiro/contrapartes';
            const safeName = name && name.length <= 60 ? name : undefined;
            return { description: 'Nova contraparte criada', object: safeName, href };
          }
        } catch {
          return null;
        }
      }

      // Text events: keep them business-only.
      if (/\b(payload|trace|debug|integration|sync)\b/i.test(raw)) return null;

      const key = raw.toUpperCase();

      // IDs for linking (not shown).
      const soIdMatch = raw.match(/(?:so[_\s-]?id|sales[_\s-]?order[_\s-]?id)\s*[:=]\s*(\d+)/i);
      const poIdMatch = raw.match(/(?:po[_\s-]?id|purchase[_\s-]?order[_\s-]?id)\s*[:=]\s*(\d+)/i);
      const cpIdMatch = raw.match(/(?:counterparty[_\s-]?id|cp[_\s-]?id)\s*[:=]\s*(\d+)/i);

      const soHashMatch = raw.match(/\bso\b\s*#\s*(\d+)/i);
      const poHashMatch = raw.match(/\bpo\b\s*#\s*(\d+)/i);
      const cpHashMatch = raw.match(/\bcounterparty\b\s*#\s*(\d+)/i);

      const qtyMatch = raw.match(/(?:quantity|qty|quantidade)\s*[:=]\s*([0-9]+(?:[\.,][0-9]+)?)/i);
      const maturityMatch = raw.match(
        /(?:maturity|venc(?:imento)?|delivery|expected[_\s-]?delivery[_\s-]?date|settlement[_\s-]?date)\s*[:=]\s*([0-9]{4}-[0-9]{2}-[0-9]{2})/i
      );
      const priceTypeMatch = raw.match(/(?:price[_\s-]?type|tipo[_\s-]?de[_\s-]?preço|pricing)\s*[:=]\s*([A-Za-z0-9_-]+)/i);
      const nameMatch = raw.match(/(?:counterparty|contraparte|name)\s*[:=]\s*([^\|\n\r]+)/i);

      const trailingObject = (() => {
        const parts = raw.split(/\s*[·\-–—]\s*/).map((p) => p.trim()).filter(Boolean);
        if (parts.length < 2) return null;
        const candidate = parts.slice(1).join(' - ').trim();
        if (!candidate) return null;
        if (candidate.length > 80) return null;
        return candidate;
      })();

      const basics = formatBasics(
        qtyMatch?.[1] || null,
        maturityMatch?.[1] || null,
        priceTypeMatch?.[1] || null
      );

      const mappings: Array<{ match: RegExp; build: () => { description: string; object?: string; href?: string } }>= [
        {
          match: /\bSO\b.*\bCREATED\b|SALES[_\s-]?ORDER[_\s-]?CREATED/,
          build: () => {
            const idRaw = soIdMatch?.[1] || soHashMatch?.[1];
            const id = idRaw ? Number(idRaw) : NaN;
            const href = Number.isFinite(id) ? `/vendas/sales-orders/${id}` : '/vendas/sales-orders';
            return { description: 'Novo SO criado', object: basics, href };
          },
        },
        {
          match: /\bPO\b.*\bCREATED\b|PURCHASE[_\s-]?ORDER[_\s-]?CREATED/,
          build: () => {
            const idRaw = poIdMatch?.[1] || poHashMatch?.[1];
            const id = idRaw ? Number(idRaw) : NaN;
            const href = Number.isFinite(id) ? `/compras/purchase-orders/${id}` : '/compras/purchase-orders';
            return { description: 'Novo PO criado', object: basics, href };
          },
        },
        {
          match: /COUNTERPARTY[_\s-]?CREATED/,
          build: () => {
            const idRaw = cpIdMatch?.[1] || cpHashMatch?.[1];
            const id = idRaw ? Number(idRaw) : NaN;
            const href = Number.isFinite(id) ? `/financeiro/contrapartes?id=${id}` : '/financeiro/contrapartes';
            const name = nameMatch?.[1]?.trim() || trailingObject || (Number.isFinite(id) ? `Contraparte #${id}` : undefined);
            const safeName = name && name.length <= 60 ? name : undefined;
            return { description: 'Nova contraparte criada', object: safeName, href };
          },
        },
        {
          match: /TREASURY[_\s-]?DECISION[_\s-]?CREATED|TREASURY[_\s-]?DECISION\./,
          build: () => ({ description: 'Decisão registrada' }),
        },
        { match: /HEDGE[_\s-]?EXECUTED|HEDGE\./, build: () => ({ description: 'Hedge executado' }) },
        { match: /KYC[_\s-]?OVERRIDE|TREASURY[_\s-]?KYC[_\s-]?OVERRIDE/, build: () => ({ description: 'Exceção registrada (KYC)' }) },
        { match: /CONTRACT[_\s-]?CONFIRMED|CONTRACT[_\s-]?CREATED|CONTRACT\./, build: () => ({ description: 'Contrato confirmado' }) },
        { match: /RFQ[_\s-]?EXPIRED|QUOTE[_\s-]?EXPIRED/, build: () => ({ description: 'Cotação expirada' }) },
      ];

      const hit = mappings.find((m) => m.match.test(key));
      if (!hit) return null;
      return hit.build();
    },
    [formatBasics, priceTypeLabel]
  );

  const teamEvents = useMemo(() => {
    const items = dashboard.data?.timeline || [];
    return items
      .map((item) => {
        const translated = translateEvent(item.content);
        if (!translated) return null;

        const actor = formatActor(item.role);
        return {
          actor,
          initials: actorInitials(actor),
          timestamp: formatHumanDateTime(item.timestamp),
          description: translated.description,
          object: translated.object,
          href: translated.href,
          backgroundColor: item.avatar.colorScheme === 1 ? '#0064d9' : '#bb0000',
        };
      })
      .filter(Boolean) as Array<{
        actor: string;
        initials: string;
        timestamp: string;
        description: string;
        object?: string;
        href?: string;
        backgroundColor: string;
      }>;
  }, [dashboard.data?.timeline, translateEvent, formatActor, actorInitials]);

  // Cotação atual (Cash + 3M) - SEM valores fallback estáticos
  // Se não há dados da API ou mercado fechado, mostra "--"
  const cashPrice = aluminumQuote.data?.cash?.price ?? null;
  const threeMonthPrice = aluminumQuote.data?.three_month?.price ?? null;
  const hasQuoteData = cashPrice !== null || threeMonthPrice !== null;

  const lastQuoteTs = useMemo(() => {
    const cashTs = aluminumQuote.data?.cash?.ts ? new Date(aluminumQuote.data.cash.ts) : null;
    const threeTs = aluminumQuote.data?.three_month?.ts
      ? new Date(aluminumQuote.data.three_month.ts)
      : null;
    const t = Math.max(cashTs?.getTime() || 0, threeTs?.getTime() || 0);
    return t > 0 ? new Date(t).toISOString() : null;
  }, [aluminumQuote.data]);

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
              subtitle={'LME'}
            />
            
            {/* Indicador de mercado aberto/fechado */}
            <div className={`flex items-center gap-2 mb-3 px-2 py-1 rounded text-xs font-['72:Regular',sans-serif] ${
              marketOpen 
                ? 'bg-[var(--sapPositiveBackground,#f5fae5)] text-[var(--sapPositiveTextColor,#256f3a)]' 
                : 'bg-[var(--sapNeutralBackground,#f5f6f7)] text-[var(--sapNeutralTextColor,#556b82)]'
            }`}>
              <Clock className="w-3 h-3" />
              {marketOpen ? 'Mercado aberto' : 'Mercado fechado'}
            </div>
            
            {aluminumQuote.isLoading ? (
              <div className="py-4">
                <SkeletonBlock className="h-[44px] w-[60%] mb-4" />
                <div className="flex gap-4">
                  <SkeletonBlock className="h-[34px] w-[45%]" />
                  <SkeletonBlock className="h-[34px] w-[45%]" />
                </div>
              </div>
            ) : aluminumQuote.isError ? (
              <div className="py-6 text-center">
                <p className="text-sm text-[var(--sapContent_LabelColor,#556b82)]">Falha ao carregar.</p>
              </div>
            ) : hasQuoteData ? (
              <>
                <div className="mb-6">
                  <FioriCardMetric value={cashPrice !== null ? formatNumber(cashPrice, 2) : '--'} />
                </div>
                <div className="flex gap-4 text-center mb-4">
                  <div className="flex-1">
                    <div className="font-['72:Regular',sans-serif] text-[12px] text-[var(--sapContent_LabelColor,#556b82)] mb-1">
                      Cash (P3Y00)
                    </div>
                    <div className="font-['72:Semibold_Duplex',sans-serif] text-[16px] text-[var(--sapContent_ForegroundTextColor,#131e29)]">
                      {cashPrice !== null ? formatNumber(cashPrice, 2) : '--'}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="font-['72:Regular',sans-serif] text-[12px] text-[var(--sapContent_LabelColor,#556b82)] mb-1">
                      3M (P4Y00)
                    </div>
                    <div className="font-['72:Semibold_Duplex',sans-serif] text-[16px] text-[var(--sapContent_ForegroundTextColor,#131e29)]">
                      {threeMonthPrice !== null ? formatNumber(threeMonthPrice, 2) : '--'}
                    </div>
                  </div>
                </div>
                {lastQuoteTs && (
                  <div className="text-[10px] text-[var(--sapContent_LabelColor,#556b82)] text-center">
                    Atualizado em {formatHumanDateTime(lastQuoteTs)}
                  </div>
                )}
              </>
            ) : (
              <div className="py-6 text-center">
                <p className="text-sm text-[var(--sapContent_LabelColor,#556b82)]">Sem dados para o período.</p>
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
            
            {dashboard.isLoading ? (
              <div className="mb-4">
                <SkeletonBlock className="h-[48px] w-[40%] mb-2" />
                <SkeletonBlock className="h-[16px] w-[30%]" />
              </div>
            ) : dashboard.isError ? (
              <div className="py-6 text-center">
                <p className="text-sm text-[var(--sapContent_LabelColor,#556b82)]">Falha ao carregar.</p>
              </div>
            ) : totalRfqsCount === 0 ? (
              <div className="py-6 text-center">
                <p className="text-sm text-[var(--sapContent_LabelColor,#556b82)]">Sem dados para o período.</p>
              </div>
            ) : (
              <div className="flex items-center gap-4 mb-4">
                <div className="font-['72:Semibold_Duplex',sans-serif] text-[48px] text-[var(--sapContent_ForegroundTextColor,#131e29)] leading-[normal]">
                  {pendingRfqsCount}
                </div>
                <div className="flex flex-col text-right">
                  <div className="font-['72:Regular',sans-serif] text-[12px] text-[var(--sapContent_LabelColor,#556b82)]">
                    de
                  </div>
                  <div className="font-['72:Semibold_Duplex',sans-serif] text-[16px] text-[var(--sapContent_ForegroundTextColor,#131e29)]">
                    {totalRfqsCount}
                  </div>
                </div>
              </div>
            )}

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
            
            {settlementsToday.isLoading ? (
              <div className="mb-4">
                <SkeletonBlock className="h-[24px] w-[40%] mb-2" />
                <SkeletonBlock className="h-[48px] w-[30%]" />
              </div>
            ) : settlementsToday.isError ? (
              <div className="py-6 text-center">
                <p className="text-sm text-[var(--sapContent_LabelColor,#556b82)]">Falha ao carregar.</p>
              </div>
            ) : todaySettlementsCount === 0 ? (
              <div className="py-6 text-center">
                <p className="text-sm text-[var(--sapContent_LabelColor,#556b82)]">Sem dados para o período.</p>
              </div>
            ) : (
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
            )}

            <div className="pt-3 border-t border-[var(--sapGroup_ContentBorderColor,#d9d9d9)]">
              <button 
                className="font-['72:Regular',sans-serif] text-[14px] text-[var(--sapButton_TextColor,#0064d9)] hover:underline bg-transparent border-0 cursor-pointer p-0"
                onClick={() => navigate('/financeiro/contratos')}
              >
                Ver todos
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
                  USD / ton
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
            
            {aluminumHistory.isLoading ? (
              <div className="h-[240px] flex items-center justify-center">
                <SkeletonBlock className="h-[200px] w-[92%]" />
              </div>
            ) : aluminumHistory.isError ? (
              <ErrorText />
            ) : historicalData.length === 0 ? (
              <EmptyText />
            ) : (
              <ResponsiveContainer width="100%" height={240}>
                <LineChart data={historicalData}>
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
                    formatter={(value: unknown) => {
                      if (typeof value === 'number' && Number.isFinite(value)) {
                        return [formatNumber(value, 2), ''];
                      }
                      return ['—', ''];
                    }}
                    labelFormatter={(label) => `${label}`}
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
                    name="Cash"
                    isAnimationActive={false}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="threeMonths" 
                    stroke="var(--sapCriticalTextColor,#e76500)" 
                    strokeWidth={2}
                    dot={historyRange === '7d' ? { fill: 'var(--sapCriticalTextColor,#e76500)', r: 4 } : false}
                    name="3M"
                    isAnimationActive={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </FioriCard>

          {/* Próximos Vencimentos */}
          <FioriCard>
            <div className="flex items-center justify-between mb-4">
              <FioriCardHeader title="Próximos Vencimentos" subtitle="Por empresa, contraparte e data" />
              <span className="font-['72:Regular',sans-serif] text-[12px] text-[var(--sapContent_LabelColor,#556b82)]">
                {settlementsUpcoming.isLoading ? '—' : `${upcomingMaturities.length} resultados`}
              </span>
            </div>

            {/* Table */}
            {settlementsUpcoming.isLoading ? (
              <div className="h-[240px] px-2">
                <SkeletonBlock className="h-[18px] w-[100%] mb-2" />
                <SkeletonBlock className="h-[18px] w-[100%] mb-2" />
                <SkeletonBlock className="h-[18px] w-[100%] mb-2" />
                <SkeletonBlock className="h-[18px] w-[100%] mb-2" />
                <SkeletonBlock className="h-[18px] w-[100%]" />
              </div>
            ) : settlementsUpcoming.isError ? (
              <ErrorText />
            ) : upcomingMaturities.length === 0 ? (
              <EmptyText />
            ) : (
              <div className="space-y-3">
                {upcomingMaturitiesByCompany.map(({ company, rows }) => (
                  <div key={company} className="border border-[var(--sapList_BorderColor,#d9d9d9)] rounded overflow-hidden">
                    <div className="px-3 py-2 bg-[var(--sapList_HeaderBackground,#f5f6f7)] font-['72:Semibold_Duplex',sans-serif] text-[14px] text-[var(--sapList_HeaderTextColor,#131e29)]">
                      {company}
                    </div>
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
                          {rows.map((item: any) => (
                            <tr
                              key={item.id}
                              onClick={() => navigate(`/financeiro/contratos?id=${encodeURIComponent(String(item.id))}`)}
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
                  </div>
                ))}
              </div>
            )}
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
            </div>
            <div className="flex flex-col gap-2">
              {dashboard.isLoading ? (
                <div className="px-2">
                  <SkeletonBlock className="h-[44px] w-[100%] mb-2" />
                  <SkeletonBlock className="h-[44px] w-[100%] mb-2" />
                  <SkeletonBlock className="h-[44px] w-[100%]" />
                </div>
              ) : dashboard.isError ? (
                <div className="px-2 py-6 text-center">
                  <p className="text-sm text-[var(--sapContent_LabelColor,#556b82)]">Falha ao carregar.</p>
                </div>
              ) : teamEvents.length === 0 ? (
                <div className="px-2 py-6 text-center">
                  <p className="text-sm text-[var(--sapContent_LabelColor,#556b82)]">Sem dados para o período.</p>
                </div>
              ) : (
                teamEvents.map((ev, idx) => (
                  <FioriTeamCard
                    key={idx}
                    actor={ev.actor}
                    initials={ev.initials}
                    timestamp={ev.timestamp}
                    description={ev.description}
                    object={ev.object}
                    href={ev.href}
                    backgroundColor={ev.backgroundColor}
                  />
                ))
              )}
            </div>
          </FioriCard>
        </div>
      </div>
    </div>
  );
}

export default DashboardPageIntegrated;
