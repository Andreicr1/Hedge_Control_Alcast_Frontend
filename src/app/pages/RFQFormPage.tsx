import { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  BusyIndicator,
  Button,
  Card,
  DatePicker,
  FlexBox,
  FlexBoxDirection,
  Input,
  Label,
  MessageStrip,
  ObjectStatus,
  Option,
  Select,
  Text,
  TextArea,
  Title,
  Toolbar,
  ToolbarSpacer,
} from '@ui5/webcomponents-react';
import ValueState from '@ui5/webcomponents-base/dist/types/ValueState.js';
import {
  ApiError,
  KycGateErrorDetail,
  KycPreflightResponse,
  Deal,
  SalesOrder,
  PurchaseOrder,
  RfqPriceType,
  RfqTradeType,
  RfqSide,
  RfqStatus,
  SendStatus,
  RfqCreate,
  RfqInvitationCreate,
} from '../../types';
import { useRfqPreview, useCreateRfq, useSendRfqWithTracking } from '../../hooks/useRfqs';
import { useCounterparties } from '../../hooks/useCounterparties';
import { getCounterpartyKycPreflight } from '../../services/counterparties.service';
import { listDeals } from '../../services/deals.service';
import { getSalesOrder, listSalesOrdersQuery } from '../../services/salesOrders.service';
import { listPurchaseOrdersQuery } from '../../services/purchaseOrders.service';
import { getLanguageForCounterparty } from '../components/rfq/CounterpartySelector';
import { UX_COPY } from '../ux/copy';

// ============================================
// Types
// ============================================
interface TradeState {
  id: string;
  template: TradeTemplate | null;
  leg1Operation: 'Compra' | 'Venda';
  leg1PriceType: RfqPriceType | '';
  leg1Month: string;
  leg1Year: string;
  leg1StartDate: string;
  leg1EndDate: string;
  leg2Operation: 'Compra' | 'Venda';
  leg2PriceType: RfqPriceType | '';
  leg2FixingDate: string;
}

type TradeTemplate = 'comprar_media' | 'vender_media' | 'venda_fixo' | 'compra_fixo' | 'media_intermediaria';

// ============================================
// Constants
// ============================================
const TRADE_TEMPLATES: { value: TradeTemplate; label: string; description: string }[] = [
  { value: 'comprar_media', label: 'Estrutura: comprar a média', description: 'Compra a média e vende a preço fixo.' },
  { value: 'vender_media', label: 'Estrutura: vender a média', description: 'Vende a média e compra a preço fixo.' },
  { value: 'venda_fixo', label: 'Estrutura: venda a preço fixo', description: 'Venda a preço fixo com ajuste por referência.' },
  { value: 'compra_fixo', label: 'Estrutura: compra a preço fixo', description: 'Compra a preço fixo com ajuste por referência.' },
  { value: 'media_intermediaria', label: 'Estrutura: média entre datas', description: 'Média no período com compra a preço fixo.' },
];

const PRICE_TYPE_OPTIONS = [
  { value: 'AVG', label: 'Média mensal' },
  { value: 'AVGInter', label: 'Média entre datas' },
  { value: 'Fix', label: 'Preço fixo' },
  { value: 'C2R', label: 'Fechamento até referência' },
];

const COMPANY_HEADER_OPTIONS = [
  { value: 'Alcast Brasil', label: 'Alcast Brasil' },
  { value: 'Alcast Trading', label: 'Alcast Trading' },
];

const MONTH_OPTIONS = [
  { value: 'January', label: 'Janeiro' },
  { value: 'February', label: 'Fevereiro' },
  { value: 'March', label: 'Março' },
  { value: 'April', label: 'Abril' },
  { value: 'May', label: 'Maio' },
  { value: 'June', label: 'Junho' },
  { value: 'July', label: 'Julho' },
  { value: 'August', label: 'Agosto' },
  { value: 'September', label: 'Setembro' },
  { value: 'October', label: 'Outubro' },
  { value: 'November', label: 'Novembro' },
  { value: 'December', label: 'Dezembro' },
];

function counterpartyTypeLabel(value: string | null | undefined): string {
  if (!value) return '—';
  const k = String(value).toLowerCase();
  if (k === 'bank') return 'Instituição';
  if (k === 'broker') return 'Corretora';
  return 'Contraparte';
}

function channelLabel(value: string | null | undefined): string {
  if (!value) return '—';
  const k = String(value).toLowerCase();
  if (k === 'email') return 'E-mail';
  if (k === 'whatsapp') return 'WhatsApp';
  return '—';
}

function buildWhatsAppUrl(text: string): string {
  return `https://wa.me/?text=${encodeURIComponent(text)}`;
}

function openWhatsApp(text: string) {
  const url = buildWhatsAppUrl(text);
  window.open(url, '_blank', 'noopener,noreferrer');
}

const MONTH_TO_NUMBER: Record<string, number> = {
  January: 1, February: 2, March: 3, April: 4, May: 5, June: 6,
  July: 7, August: 8, September: 9, October: 10, November: 11, December: 12,
};

// Generate year options (current year + 2 years)
const currentYear = new Date().getFullYear();
const YEAR_OPTIONS = Array.from({ length: 3 }, (_, i) => ({
  value: String(currentYear + i),
  label: String(currentYear + i),
}));

// ============================================
// Utility Functions
// ============================================

/**
 * Calculate the last business day of a given month/year
 * This is used to sync the Fix leg's fixing date with the AVG leg
 */
function getLastBusinessDayOfMonth(year: number, month: number): string {
  // month is 1-indexed (January = 1)
  // Create a date for the last day of the month
  const lastDay = new Date(year, month, 0); // Day 0 of next month = last day of current month
  
  // Move back to Friday if it falls on weekend
  const dayOfWeek = lastDay.getDay();
  if (dayOfWeek === 0) { // Sunday
    lastDay.setDate(lastDay.getDate() - 2);
  } else if (dayOfWeek === 6) { // Saturday
    lastDay.setDate(lastDay.getDate() - 1);
  }
  
  return lastDay.toISOString().split('T')[0];
}

/**
 * Calculate the last business day of an AVGInter period
 */
function getLastBusinessDayFromEndDate(endDate: string): string {
  const date = new Date(endDate);
  const dayOfWeek = date.getDay();
  if (dayOfWeek === 0) { // Sunday
    date.setDate(date.getDate() - 2);
  } else if (dayOfWeek === 6) { // Saturday
    date.setDate(date.getDate() - 1);
  }
  return date.toISOString().split('T')[0];
}

/**
 * Apply template configuration to a trade
 */
function applyTemplate(template: TradeTemplate): Partial<TradeState> {
  switch (template) {
    case 'comprar_media':
      // Comprar Média: Leg1=Sell AVG, Leg2=Buy Fix
      return {
        template,
        leg1Operation: 'Venda',
        leg1PriceType: RfqPriceType.AVG,
        leg2Operation: 'Compra',
        leg2PriceType: RfqPriceType.FIX,
      };
    case 'vender_media':
      // Vender Média: Leg1=Buy AVG, Leg2=Sell Fix
      return {
        template,
        leg1Operation: 'Compra',
        leg1PriceType: RfqPriceType.AVG,
        leg2Operation: 'Venda',
        leg2PriceType: RfqPriceType.FIX,
      };
    case 'venda_fixo':
      // Venda Fixo: Leg1=Buy C2R, Leg2=Sell Fix
      return {
        template,
        leg1Operation: 'Compra',
        leg1PriceType: RfqPriceType.C2R,
        leg2Operation: 'Venda',
        leg2PriceType: RfqPriceType.FIX,
      };
    case 'compra_fixo':
      // Compra Fixo: Leg1=Sell C2R, Leg2=Buy Fix
      return {
        template,
        leg1Operation: 'Venda',
        leg1PriceType: RfqPriceType.C2R,
        leg2Operation: 'Compra',
        leg2PriceType: RfqPriceType.FIX,
      };
    case 'media_intermediaria':
      // Média Intermediária: Leg1=Sell AVGInter, Leg2=Buy Fix
      return {
        template,
        leg1Operation: 'Venda',
        leg1PriceType: RfqPriceType.AVG_INTER,
        leg2Operation: 'Compra',
        leg2PriceType: RfqPriceType.FIX,
      };
    default:
      return {};
  }
}

/**
 * Create a new empty trade state
 */
function createEmptyTrade(): TradeState {
  return {
    id: crypto.randomUUID(),
    template: null,
    leg1Operation: 'Venda',
    leg1PriceType: '',
    leg1Month: '',
    leg1Year: String(currentYear),
    leg1StartDate: '',
    leg1EndDate: '',
    leg2Operation: 'Compra',
    leg2PriceType: '',
    leg2FixingDate: '',
  };
}

// ============================================
// Main Component
// ============================================
export function RFQFormPage() {
  const navigate = useNavigate();

  // Counterparty KYC is not enforced at this phase.
  // Kept behind a feature flag for future rollout.
  const ENABLE_COUNTERPARTY_KYC = import.meta.env.VITE_ENABLE_COUNTERPARTY_KYC === 'true';
  const [searchParams] = useSearchParams();
  const soIdParam = searchParams.get('so_id');
  const dealIdParam = searchParams.get('deal_id');
  const quantityMtParam = searchParams.get('quantity_mt');
  const sourceExposureIdParam = searchParams.get('source_exposure_id');

  const initialSoId = soIdParam ? Number.parseInt(soIdParam, 10) : null;
  const initialDealId = dealIdParam ? Number.parseInt(dealIdParam, 10) : null;
  
  // ============================================
  // Form State
  // ============================================
  const [companyHeader, setCompanyHeader] = useState<'Alcast Brasil' | 'Alcast Trading'>('Alcast Brasil');
  const [quantity, setQuantity] = useState('');
  const [handoffSourceExposureId, setHandoffSourceExposureId] = useState<string | null>(null);

  // Deal + SO selection (Deal-first)
  const [selectedDealId, setSelectedDealId] = useState<number | null>(Number.isFinite(initialDealId as any) ? initialDealId : null);
  const [selectedSoId, setSelectedSoId] = useState<number | null>(Number.isFinite(initialSoId as any) ? initialSoId : null);
  const [formValidationMessage, setFormValidationMessage] = useState<string | null>(null);

  // Lookup data for selection
  const [deals, setDeals] = useState<Deal[]>([]);
  const [salesOrders, setSalesOrders] = useState<SalesOrder[]>([]);
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);
  const [isLookupLoading, setIsLookupLoading] = useState(false);
  const [lookupError, setLookupError] = useState<string | null>(null);
  
  // Multi-trade state
  const [trades, setTrades] = useState<TradeState[]>([createEmptyTrade()]);
  
  // Counterparty Selection
  const [selectedCounterpartyIds, setSelectedCounterpartyIds] = useState<number[]>([]);
  const [counterpartyFilter, setCounterpartyFilter] = useState<'all' | 'banks' | 'brokers'>('all');
  const [counterpartySearch, setCounterpartySearch] = useState('');
  
  // Preview Texts
  const [brokerPreviewText, setBrokerPreviewText] = useState('');
  const [bankPreviewText, setBankPreviewText] = useState('');
  const [previewFormError, setPreviewFormError] = useState<string | null>(null);

  // KYC Preflight (read-only)
  const [kycPreflightByCounterpartyId, setKycPreflightByCounterpartyId] = useState<Record<number, KycPreflightResponse>>({});
  const [isKycPreflightLoading, setIsKycPreflightLoading] = useState(false);
  const [kycPreflightMessage, setKycPreflightMessage] = useState<string | null>(null);
  
  // RFQ Creation State
  const [sendingStatus, setSendingStatus] = useState<'idle' | 'creating' | 'sending' | 'done' | 'error'>('idle');
  const [sendProgress, setSendProgress] = useState<{ sent: number; total: number; errors: string[] }>({
    sent: 0,
    total: 0,
    errors: [],
  });
  
  // Hooks
  const { isLoading: isPreviewLoading, error: previewError, generatePreview } = useRfqPreview();
  const { counterparties, isLoading: isCounterpartiesLoading } = useCounterparties();
  const { mutate: createRfq, error: createRfqError } = useCreateRfq();
  const { mutate: sendWithTracking } = useSendRfqWithTracking();

  // ============================================
  // Lookup data (Deals + Orders)
  // ============================================

  useEffect(() => {
    let isActive = true;
    setLookupError(null);
    setIsLookupLoading(true);

    listDeals()
      .then((rows) => {
        if (!isActive) return;
        setDeals(rows);
      })
      .catch(() => {
        if (!isActive) return;
        setLookupError('Não foi possível carregar Deals.');
      })
      .finally(() => {
        if (isActive) setIsLookupLoading(false);
      });

    return () => {
      isActive = false;
    };
  }, []);

  // Load SO/PO lists for the chosen deal (authoritative backend filter)
  useEffect(() => {
    let isActive = true;

    if (!selectedDealId) {
      setSalesOrders([]);
      setPurchaseOrders([]);
      return;
    }

    setLookupError(null);
    setIsLookupLoading(true);

    Promise.allSettled([
      listSalesOrdersQuery({ deal_id: selectedDealId }),
      listPurchaseOrdersQuery({ deal_id: selectedDealId }),
    ])
      .then((results) => {
        if (!isActive) return;
        const [soRes, poRes] = results;
        if (soRes.status === 'fulfilled') setSalesOrders(soRes.value);
        if (poRes.status === 'fulfilled') setPurchaseOrders(poRes.value);

        if (soRes.status === 'rejected' || poRes.status === 'rejected') {
          setLookupError('Não foi possível carregar SO/PO do Deal selecionado.');
        }
      })
      .finally(() => {
        if (isActive) setIsLookupLoading(false);
      });

    return () => {
      isActive = false;
    };
  }, [selectedDealId]);

  // If user came from a SO context, infer deal_id when possible
  useEffect(() => {
    if (!selectedSoId) return;

    let isActive = true;
    (async () => {
      try {
        const so = await getSalesOrder(selectedSoId);
        if (!isActive) return;
        if (typeof so.deal_id === 'number') {
          setSelectedDealId(so.deal_id);
        }
      } catch {
        // Ignore - selection UI will still allow manual deal selection
      }
    })();

    return () => {
      isActive = false;
    };
  }, [selectedSoId]);

  const selectedDeal = useMemo(() => {
    if (!selectedDealId) return null;
    return deals.find((d) => d.id === selectedDealId) || null;
  }, [deals, selectedDealId]);

  const salesOrdersForSelectedDeal = useMemo(() => {
    return salesOrders.slice().sort((a, b) => (a.so_number || '').localeCompare(b.so_number || ''));
  }, [salesOrders]);

  const purchaseOrdersInSelectedDeal = useMemo(() => {
    return purchaseOrders.slice().sort((a, b) => (a.po_number || '').localeCompare(b.po_number || ''));
  }, [purchaseOrders]);

  // Keep SO selection consistent when deal changes; auto-select when only one SO exists
  useEffect(() => {
    if (!selectedDealId) return;

    if (selectedSoId && !salesOrdersForSelectedDeal.some((so) => so.id === selectedSoId)) {
      setSelectedSoId(null);
    }

    if (!selectedSoId && salesOrdersForSelectedDeal.length === 1) {
      setSelectedSoId(salesOrdersForSelectedDeal[0].id);
    }
  }, [selectedDealId, selectedSoId, salesOrdersForSelectedDeal]);

  // ============================================
  // KYC helpers
  // ============================================

  const getCounterpartyNameById = useCallback((id: number): string => {
    const cp = counterparties.find(c => c.id === id);
    return cp?.name || `ID ${id}`;
  }, [counterparties]);

  const parseKycGateError = useCallback((err: ApiError | null): KycGateErrorDetail | null => {
    const obj = err?.detail_obj;
    if (obj && typeof obj === 'object' && typeof (obj as any).code === 'string') {
      return obj as KycGateErrorDetail;
    }

    const body = err?.response_body as any;
    const detail = body?.detail;
    if (detail && typeof detail === 'object' && typeof detail.code === 'string') {
      return detail as KycGateErrorDetail;
    }

    return null;
  }, []);

  const formatPreflightReason = useCallback((preflight: KycPreflightResponse): string => {
    const missingCount = preflight.missing_items?.length || 0;
    const expiredCount = preflight.expired_items?.length || 0;
    if (missingCount || expiredCount) {
      const parts: string[] = [];
      if (missingCount) parts.push(`missing=${missingCount}`);
      if (expiredCount) parts.push(`expired=${expiredCount}`);
      return `${preflight.reason_code} (${parts.join(', ')})`;
    }
    return preflight.reason_code;
  }, []);

  // ============================================
  // Handoff prefill (Inbox -> RFQ)
  // ============================================
  useEffect(() => {
    if (handoffSourceExposureId === null && sourceExposureIdParam) {
      setHandoffSourceExposureId(sourceExposureIdParam);
    }
    if (!quantity && quantityMtParam) {
      const parsed = Number(quantityMtParam);
      if (!Number.isNaN(parsed) && parsed > 0) {
        setQuantity(String(parsed));
      }
    }
  }, [handoffSourceExposureId, sourceExposureIdParam, quantity, quantityMtParam]);

  // ============================================
  // KYC preflight fetch (selected counterparties)
  // ============================================

  useEffect(() => {
    let isActive = true;
    setKycPreflightMessage(null);

    if (!ENABLE_COUNTERPARTY_KYC) {
      if (isActive) {
        setKycPreflightByCounterpartyId({});
        setIsKycPreflightLoading(false);
      }
      return () => {
        isActive = false;
      };
    }

    if (selectedCounterpartyIds.length === 0) {
      setKycPreflightByCounterpartyId({});
      return;
    }

    const timeoutId = setTimeout(async () => {
      setIsKycPreflightLoading(true);
      try {
        const results = await Promise.allSettled(
          selectedCounterpartyIds.map(async (id) => ({
            id,
            preflight: await getCounterpartyKycPreflight(id),
          }))
        );

        if (!isActive) return;

        const nextMap: Record<number, KycPreflightResponse> = {};
        let hadErrors = false;

        for (const r of results) {
          if (r.status === 'fulfilled') {
            nextMap[r.value.id] = r.value.preflight;
          } else {
            hadErrors = true;
          }
        }

        setKycPreflightByCounterpartyId(nextMap);

        if (hadErrors) {
          setKycPreflightMessage('Não foi possível checar KYC de todas as contrapartes selecionadas.');
        }
      } finally {
        if (isActive) setIsKycPreflightLoading(false);
      }
    }, 250);

    return () => {
      isActive = false;
      clearTimeout(timeoutId);
    };
  }, [selectedCounterpartyIds]);

  // ============================================
  // Auto-sync Leg 2 fixing date based on Leg 1 period
  // ============================================
  const syncLeg2FixingDate = useCallback((tradeIndex: number) => {
    setTrades(prev => {
      const trade = prev[tradeIndex];
      if (!trade) return prev;
      
      let newFixingDate = trade.leg2FixingDate;
      
      if (trade.leg1PriceType === RfqPriceType.AVG && trade.leg1Month && trade.leg1Year) {
        // AVG: Last business day of the reference month
        const monthNum = MONTH_TO_NUMBER[trade.leg1Month];
        if (monthNum) {
          newFixingDate = getLastBusinessDayOfMonth(parseInt(trade.leg1Year), monthNum);
        }
      } else if (trade.leg1PriceType === RfqPriceType.AVG_INTER && trade.leg1EndDate) {
        // AVGInter: Last business day based on end date
        newFixingDate = getLastBusinessDayFromEndDate(trade.leg1EndDate);
      } else if (trade.leg1PriceType === RfqPriceType.C2R && trade.leg1EndDate) {
        // C2R: Use the same end date concept
        newFixingDate = getLastBusinessDayFromEndDate(trade.leg1EndDate);
      }
      
      if (newFixingDate !== trade.leg2FixingDate) {
        const updated = [...prev];
        updated[tradeIndex] = { ...trade, leg2FixingDate: newFixingDate };
        return updated;
      }
      return prev;
    });
  }, []);

  // Auto-sync when leg1 period changes
  useEffect(() => {
    trades.forEach((trade, index) => {
      if (trade.leg2PriceType === RfqPriceType.FIX) {
        syncLeg2FixingDate(index);
      }
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trades.map(t => `${t.leg1Month}-${t.leg1Year}-${t.leg1EndDate}-${t.leg1PriceType}`).join(','), syncLeg2FixingDate]);
  
  // ============================================
  // Computed Values
  // ============================================
  const filteredCounterparties = useMemo(() => {
    let result = counterparties.filter(cp => cp.active !== false);
    
    // Apply type filter
    if (counterpartyFilter === 'banks') {
      result = result.filter(cp => 
        cp.type?.toLowerCase().includes('banco') ||
        cp.name?.toLowerCase().includes('banco')
      );
    } else if (counterpartyFilter === 'brokers') {
      result = result.filter(cp => 
        cp.type?.toLowerCase().includes('broker') ||
        cp.name?.toLowerCase().includes('lme')
      );
    }
    
    // Apply search filter
    if (counterpartySearch) {
      const search = counterpartySearch.toLowerCase();
      result = result.filter(cp => 
        cp.name?.toLowerCase().includes(search) ||
        cp.type?.toLowerCase().includes(search)
      );
    }
    
    return result;
  }, [counterparties, counterpartyFilter, counterpartySearch]);

  const selectedCounterparties = useMemo(() => {
    return counterparties
      .filter(cp => selectedCounterpartyIds.includes(cp.id))
      .map(cp => ({
        ...cp,
        language: getLanguageForCounterparty(cp),
      }));
  }, [counterparties, selectedCounterpartyIds]);

  const blockedKycCounterpartyIds = useMemo(() => {
    if (!ENABLE_COUNTERPARTY_KYC) return [];
    return selectedCounterpartyIds.filter((id) => {
      const preflight = kycPreflightByCounterpartyId[id];
      return preflight ? !preflight.allowed : false;
    });
  }, [ENABLE_COUNTERPARTY_KYC, selectedCounterpartyIds, kycPreflightByCounterpartyId]);

  const isKycBlocked = ENABLE_COUNTERPARTY_KYC && blockedKycCounterpartyIds.length > 0;

  const hasBrokers = selectedCounterparties.some(cp => cp.language === 'en');
  const hasBanks = selectedCounterparties.some(cp => cp.language === 'pt');

  // ============================================
  // Trade Management
  // ============================================
  const updateTrade = (index: number, updates: Partial<TradeState>) => {
    setTrades(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], ...updates };
      return updated;
    });
  };

  const handleTemplateChange = (index: number, template: TradeTemplate) => {
    const templateConfig = applyTemplate(template);
    updateTrade(index, templateConfig);
  };

  const addTrade = () => {
    setTrades(prev => [...prev, createEmptyTrade()]);
  };

  const removeTrade = (index: number) => {
    if (trades.length > 1) {
      setTrades(prev => prev.filter((_, i) => i !== index));
    }
  };

  // ============================================
  // Counterparty Selection
  // ============================================
  const toggleCounterparty = (id: number) => {
    setSelectedCounterpartyIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const selectAllFiltered = () => {
    const filteredIds = filteredCounterparties.map(cp => cp.id);
    setSelectedCounterpartyIds(prev => {
      const newIds = new Set([...prev, ...filteredIds]);
      return Array.from(newIds);
    });
  };

  const clearSelection = () => {
    setSelectedCounterpartyIds([]);
  };

  // ============================================
  // Build Preview Request
  // ============================================
  const buildPreviewRequest = (language: 'en' | 'pt') => {
    const qty = parseFloat(quantity) || 0;
    const trade = trades[0]; // For now, build from first trade
    
    const leg1Side = trade.leg1Operation === 'Compra' ? RfqSide.BUY : RfqSide.SELL;
    const leg2Side = trade.leg2Operation === 'Compra' ? RfqSide.BUY : RfqSide.SELL;
    
    return {
      trade_type: RfqTradeType.SWAP,
      leg1: {
        side: leg1Side,
        price_type: trade.leg1PriceType as RfqPriceType,
        quantity_mt: qty,
        month_name: trade.leg1PriceType === RfqPriceType.AVG ? trade.leg1Month : undefined,
        year: trade.leg1PriceType === RfqPriceType.AVG ? parseInt(trade.leg1Year) : undefined,
        start_date: trade.leg1PriceType === RfqPriceType.AVG_INTER ? trade.leg1StartDate : undefined,
        end_date: trade.leg1PriceType === RfqPriceType.AVG_INTER ? trade.leg1EndDate : undefined,
        fixing_date: undefined,
      },
      leg2: {
        side: leg2Side,
        price_type: trade.leg2PriceType as RfqPriceType,
        quantity_mt: qty,
        fixing_date: trade.leg2FixingDate || undefined,
      },
      sync_ppt: true,
      company_header: companyHeader,
      company_label_for_payoff: 'Alcast',
      language,
    };
  };

  const getPreviewValidationError = useCallback((trade: TradeState, qty: number): string | null => {
    if (!trade.leg1PriceType || !trade.leg2PriceType) return 'Selecione os tipos de preço.';
    if (!qty || qty <= 0) return 'Informe uma quantidade maior que zero.';

    if (trade.leg1PriceType === RfqPriceType.AVG) {
      const year = parseInt(trade.leg1Year);
      if (!trade.leg1Month || !trade.leg1Year || Number.isNaN(year)) {
        return 'Para “Média mensal”, selecione Mês e Ano.';
      }
    }

    if (trade.leg1PriceType === RfqPriceType.AVG_INTER) {
      if (!trade.leg1StartDate || !trade.leg1EndDate) {
        return 'Para “Média entre datas”, informe Data inicial e Data final.';
      }
    }

    // Backend requires fixing_date for C2R.
    if (trade.leg2PriceType === RfqPriceType.C2R && !trade.leg2FixingDate) {
      return 'Para “Fechamento até referência”, informe a Data de referência.';
    }

    return null;
  }, []);

  const canGeneratePreview = useMemo(() => {
    const trade = trades[0];
    if (!trade) return false;
    const qty = parseFloat(quantity) || 0;
    return getPreviewValidationError(trade, qty) === null;
  }, [getPreviewValidationError, quantity, trades]);
  
  // ============================================
  // Handle Generate Preview
  // ============================================
  const handleGeneratePreview = async () => {
    const firstTrade = trades[0];
    const qty = parseFloat(quantity) || 0;
    const formErr = getPreviewValidationError(firstTrade, qty);
    if (formErr) {
      setPreviewFormError(formErr);
      return;
    }
    setPreviewFormError(null);
    
    try {
      // Always generate BOTH previews (EN for Brokers, PT for Banks)
      const [brokerResult, bankResult] = await Promise.all([
        generatePreview(buildPreviewRequest('en')),
        generatePreview(buildPreviewRequest('pt')),
      ]);
      
      if (brokerResult) {
        setBrokerPreviewText(brokerResult.text);
      }
      if (bankResult) {
        setBankPreviewText(bankResult.text);
      }
    } catch (err) {
      console.error('Preview error:', err);
    }
  };
  
  // ============================================
  // Compute Period String
  // ============================================
  const computePeriodString = (): string => {
    const trade = trades[0];
    if (trade.leg1PriceType === RfqPriceType.AVG && trade.leg1Month && trade.leg1Year) {
      return `${trade.leg1Month} ${trade.leg1Year}`;
    }
    if (trade.leg1PriceType === RfqPriceType.AVG_INTER && trade.leg1StartDate && trade.leg1EndDate) {
      return `${trade.leg1StartDate} - ${trade.leg1EndDate}`;
    }
    return `${new Date().toISOString().slice(0, 7)}`;
  };

  const handleShareWhatsApp = useCallback(() => {
    if (!selectedDealId || !selectedSoId) return;

    const origin = window.location.origin;
    const params = new URLSearchParams();
    params.set('deal_id', String(selectedDealId));
    params.set('so_id', String(selectedSoId));
    if (quantity) params.set('quantity_mt', String(quantity));
    const deepLink = `${origin}/financeiro/rfqs/novo?${params.toString()}`;

    const period = computePeriodString();
    const qtyText = quantity ? `${quantity} MT` : '—';
    const header = companyHeader ? `Empresa: ${companyHeader}` : '';

    const text = [
      'RFQ (resumo)',
      header,
      `Deal #${selectedDealId} | SO #${selectedSoId}`,
      `Qtd: ${qtyText} | Período: ${period}`,
      `Link: ${deepLink}`,
    ]
      .filter(Boolean)
      .join('\n');

    openWhatsApp(text);
  }, [selectedDealId, selectedSoId, quantity, companyHeader]);
  
  // ============================================
  // Handle Create and Send RFQ
  // ============================================
  const handleCreateAndSendRfq = async () => {
    setFormValidationMessage(null);

    if (!selectedDealId) {
      setFormValidationMessage('Selecione o Deal para registrar a RFQ.');
      return;
    }

    if (!selectedSoId) {
      setFormValidationMessage('Selecione o Pedido de Venda (SO) para registrar a RFQ.');
      return;
    }

    if ((!brokerPreviewText && !bankPreviewText) || selectedCounterpartyIds.length === 0) {
      return;
    }

    setKycPreflightMessage(null);

    // Counterparty KYC is not enforced at this phase.
    if (ENABLE_COUNTERPARTY_KYC) {
      // Deterministic, read-only preflight (authoritative backend)
      try {
        setIsKycPreflightLoading(true);
        const results = await Promise.allSettled(
          selectedCounterpartyIds.map(async (id) => ({
            id,
            preflight: await getCounterpartyKycPreflight(id),
          }))
        );

        const nextMap: Record<number, KycPreflightResponse> = { ...kycPreflightByCounterpartyId };
        const blocked: Array<{ id: number; preflight: KycPreflightResponse }> = [];
        let hadErrors = false;

        for (const r of results) {
          if (r.status === 'fulfilled') {
            nextMap[r.value.id] = r.value.preflight;
            if (!r.value.preflight.allowed) {
              blocked.push({ id: r.value.id, preflight: r.value.preflight });
            }
          } else {
            hadErrors = true;
          }
        }

        setKycPreflightByCounterpartyId(nextMap);

        if (blocked.length > 0) {
          const first = blocked[0];
          setKycPreflightMessage(
            `KYC bloqueado: ${getCounterpartyNameById(first.id)} — ${formatPreflightReason(first.preflight)}`
          );
          return;
        }

        if (hadErrors) {
          setKycPreflightMessage('Não foi possível checar KYC de todas as contrapartes selecionadas.');
          return;
        }
      } finally {
        setIsKycPreflightLoading(false);
      }
    }
    
    setSendingStatus('creating');
    setSendProgress({ sent: 0, total: selectedCounterpartyIds.length, errors: [] });
    
    try {
      // Build invitations from selected counterparties
      const invitations: RfqInvitationCreate[] = selectedCounterparties.map(cp => ({
        counterparty_id: cp.id,
        counterparty_name: cp.name,
        message_text: cp.language === 'en' ? brokerPreviewText : bankPreviewText,
        status: 'pending',
      }));
      
      // Build trade specs for storage
      const tradeSpecs = trades.map(trade => ({
        trade_type: 'Swap',
        leg1: {
          side: trade.leg1Operation === 'Compra' ? 'buy' : 'sell',
          price_type: trade.leg1PriceType,
          quantity_mt: parseFloat(quantity) || 0,
          month_name: trade.leg1Month || undefined,
          year: trade.leg1Year ? parseInt(trade.leg1Year) : undefined,
          start_date: trade.leg1StartDate || undefined,
          end_date: trade.leg1EndDate || undefined,
        },
        leg2: {
          side: trade.leg2Operation === 'Compra' ? 'buy' : 'sell',
          price_type: trade.leg2PriceType,
          quantity_mt: parseFloat(quantity) || 0,
          fixing_date: trade.leg2FixingDate || undefined,
        },
        company_header: companyHeader,
        sync_ppt: true,
      }));
      
      // Create RFQ data
      const rfqData: RfqCreate = {
        // rfq_number intentionally omitted: backend generates monthly number
        deal_id: selectedDealId,
        so_id: selectedSoId,
        quantity_mt: parseFloat(quantity) || 0,
        period: computePeriodString(),
        status: RfqStatus.DRAFT,
        message_text: brokerPreviewText || bankPreviewText,
        invitations,
        trade_specs: tradeSpecs,
      };
      
      // Create RFQ
      const createdRfq = await createRfq(rfqData);
      
      if (!createdRfq) {
        const gate = parseKycGateError(createRfqError);
        if (gate) {
          setKycPreflightMessage('Não foi possível validar o cliente do SO (KYC pendente ou restrito).');
          return;
        }
        throw new Error(UX_COPY.errors.title);
      }
      
      setSendingStatus('sending');
      
      // Send to each counterparty with tracking
      const errors: string[] = [];
      let sentCount = 0;
      
      for (const cp of selectedCounterparties) {
        try {
          await sendWithTracking(createdRfq.id, {
            channel: cp.rfq_channel_type || 'email',
            status: SendStatus.QUEUED,
            metadata: {
              counterparty_id: cp.id,
              counterparty_name: cp.name,
              language: cp.language,
            },
          });
          sentCount++;
          setSendProgress(prev => ({ ...prev, sent: sentCount }));
        } catch (err) {
          errors.push(UX_COPY.errors.title);
          console.error('Erro ao enviar mensagem para contraparte', err);
        }
      }
      
      setSendProgress(prev => ({ ...prev, errors }));
      setSendingStatus('done');
      
      // Navigate to RFQ detail after short delay
      setTimeout(() => {
        navigate(`/financeiro/rfqs/${createdRfq.id}`);
      }, 2000);
      
    } catch (err) {
      console.error('Error creating/sending RFQ:', err);
      setSendingStatus('error');
      setSendProgress(prev => ({
        ...prev,
        errors: [...prev.errors, UX_COPY.errors.title],
      }));
    }
  };

  // ============================================
  // Render Leg 1 Conditional Fields
  // ============================================
  const renderLeg1Fields = (trade: TradeState, index: number) => {
    switch (trade.leg1PriceType) {
      case RfqPriceType.AVG:
        return (
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Mês</Label>
              <Select value={trade.leg1Month} onChange={(e) => updateTrade(index, { leg1Month: String((e.target as any).value || '') })}>
                <Option value="">—</Option>
                {MONTH_OPTIONS.map((opt) => (
                  <Option key={opt.value} value={opt.value}>
                    {opt.label}
                  </Option>
                ))}
              </Select>
            </div>
            <div>
              <Label>Ano</Label>
              <Select value={trade.leg1Year} onChange={(e) => updateTrade(index, { leg1Year: String((e.target as any).value || '') })}>
                {YEAR_OPTIONS.map((opt) => (
                  <Option key={opt.value} value={opt.value}>
                    {opt.label}
                  </Option>
                ))}
              </Select>
            </div>
          </div>
        );
      case RfqPriceType.AVG_INTER:
        return (
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Data Início</Label>
              <DatePicker value={trade.leg1StartDate} onChange={(e) => updateTrade(index, { leg1StartDate: String((e.target as any).value || '') })} />
            </div>
            <div>
              <Label>Data Fim</Label>
              <DatePicker value={trade.leg1EndDate} onChange={(e) => updateTrade(index, { leg1EndDate: String((e.target as any).value || '') })} />
            </div>
          </div>
        );
      case RfqPriceType.C2R:
        return (
          <div>
            <Label>Data de Referência</Label>
            <DatePicker value={trade.leg1EndDate} onChange={(e) => updateTrade(index, { leg1EndDate: String((e.target as any).value || '') })} />
          </div>
        );
      default:
        return null;
    }
  };

  // ============================================
  // Render Trade Card
  // ============================================
  const renderTradeCard = (trade: TradeState, index: number) => {
    return (
      <Card key={trade.id} className="mb-4">
        <div style={{ padding: '0.75rem' }}>
        {/* Trade Header with Templates */}
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-[var(--sapTile_BorderColor,#e5e5e5)]">
          <h3 className="font-['72:Semibold_Duplex',sans-serif] text-[16px] text-[var(--sapTile_TitleTextColor,#131e29)] m-0">
            Estrutura {index + 1}
          </h3>
          {trades.length > 1 && (
            <Button design="Transparent" onClick={() => removeTrade(index)}>
              Remover
            </Button>
          )}
        </div>

        {/* Template Buttons */}
        <div className="flex flex-wrap gap-2 mb-4">
          {TRADE_TEMPLATES.map(tmpl => (
            <button
              key={tmpl.value}
              type="button"
              onClick={() => handleTemplateChange(index, tmpl.value)}
              className={`px-3 py-1.5 rounded text-[12px] font-medium transition-colors border ${
                trade.template === tmpl.value
                  ? 'bg-[var(--sapSelectedColor,#0a6ed1)] text-white border-[var(--sapSelectedColor,#0a6ed1)]'
                  : 'bg-[var(--sapButton_Background,#fff)] text-[var(--sapButton_TextColor,#0854a0)] border-[var(--sapButton_BorderColor,#0854a0)] hover:bg-[var(--sapButton_Hover_Background,#ebf5fe)]'
              }`}
              title={tmpl.description}
            >
              {tmpl.label}
            </button>
          ))}
        </div>

        {/* Legs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Leg 1 - Floating */}
          <div className="p-4 bg-[var(--sapList_Background,#fff)] border border-[var(--sapTile_BorderColor,#e5e5e5)] rounded">
            <h4 className="font-['72:Semibold_Duplex',sans-serif] text-[14px] text-[var(--sapTile_TitleTextColor,#131e29)] mb-3">
              Parte 1 <span className="font-normal text-[var(--sapContent_LabelColor)]">(Flutuante)</span>
            </h4>
            <div className="space-y-3">
              <div>
                <Label>Operação</Label>
                <Select value={trade.leg1Operation} onChange={(e) => updateTrade(index, { leg1Operation: String((e.target as any).value || '') as any })}>
                  <Option value="Compra">Compra</Option>
                  <Option value="Venda">Venda</Option>
                </Select>
              </div>
              <div>
                <Label>Tipo de Preço</Label>
                <Select
                  value={trade.leg1PriceType}
                  onChange={(e) => updateTrade(index, { leg1PriceType: String((e.target as any).value || '') as RfqPriceType })}
                >
                  <Option value="">—</Option>
                  {PRICE_TYPE_OPTIONS.filter((opt) => opt.value !== 'Fix').map((opt) => (
                    <Option key={opt.value} value={opt.value}>
                      {opt.label}
                    </Option>
                  ))}
                </Select>
              </div>
              {renderLeg1Fields(trade, index)}
            </div>
          </div>

          {/* Leg 2 - Fix */}
          <div className="p-4 bg-[var(--sapList_Background,#fff)] border border-[var(--sapTile_BorderColor,#e5e5e5)] rounded">
            <h4 className="font-['72:Semibold_Duplex',sans-serif] text-[14px] text-[var(--sapTile_TitleTextColor,#131e29)] mb-3">
              Parte 2 <span className="font-normal text-[var(--sapContent_LabelColor)]">(Fixo)</span>
            </h4>
            <div className="space-y-3">
              <div>
                <Label>Operação</Label>
                <Select value={trade.leg2Operation} onChange={(e) => updateTrade(index, { leg2Operation: String((e.target as any).value || '') as any })}>
                  <Option value="Compra">Compra</Option>
                  <Option value="Venda">Venda</Option>
                </Select>
              </div>
              <div>
                <Label>Tipo de Preço</Label>
                <Select value={trade.leg2PriceType} disabled onChange={(e) => updateTrade(index, { leg2PriceType: String((e.target as any).value || '') as RfqPriceType })}>
                  <Option value="">—</Option>
                  <Option value="Fix">Preço fixo</Option>
                </Select>
              </div>
              <div>
                <Label>Data de referência (sincronizada)</Label>
                <DatePicker
                  value={trade.leg2FixingDate}
                  disabled
                  onChange={(e) => updateTrade(index, { leg2FixingDate: String((e.target as any).value || '') })}
                />
              </div>
              {trade.leg2FixingDate && (
                <div className="text-[11px] text-[var(--sapContent_LabelColor,#6a6d70)] italic">
                  Data sincronizada: {new Date(trade.leg2FixingDate).toLocaleDateString('pt-BR')}
                </div>
              )}
            </div>
          </div>
        </div>
        </div>
      </Card>
    );
  };

  // ============================================
  // Render
  // ============================================
  return (
    <div className="bg-[var(--sapBackgroundColor,#f7f7f7)] min-h-screen p-4">
      <div className="max-w-[1200px] mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-4">
          <Button design="Transparent" onClick={() => navigate('/financeiro/rfqs')}>
            Voltar
          </Button>
          <h1 className="font-['72:Regular',sans-serif] text-[24px] text-[var(--sapPageHeader_TextColor,#131e29)] leading-[normal] m-0 flex-1">
            Nova cotação
          </h1>
          
          {/* Company Header Selector */}
          <Select value={companyHeader} onChange={(e) => setCompanyHeader(String((e.target as any).value || '') as any)}>
            {COMPANY_HEADER_OPTIONS.map((opt) => (
              <Option key={opt.value} value={opt.value}>
                {opt.label}
              </Option>
            ))}
          </Select>
        </div>

        {/* Contexto de origem (quando aplicável) */}
        {handoffSourceExposureId && (
          <div className="mb-4 p-3 rounded border border-[var(--sapGroup_ContentBorderColor)] bg-[var(--sapTile_Background)]">
            <div className="text-sm font-['72:Bold',sans-serif]">Origem: Pendências</div>
            <div className="text-xs text-[var(--sapContent_LabelColor)]">
              Exposição nº {handoffSourceExposureId}
              {soIdParam ? ` (Pedido de Venda nº ${soIdParam})` : ''}
            </div>
          </div>
        )}

        {/* Deal + SO selection */}
        <Card className="mb-4">
          <div style={{ padding: '0.75rem' }}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <div className="text-[12px] text-[var(--sapContent_LabelColor,#6a6d70)] mb-1">
                Deal (obrigatório)
              </div>
              <Select
                value={String(selectedDealId ?? '')}
                onChange={(e) => {
                  const raw = String((e.target as any).value || '');
                  const next = raw ? Number.parseInt(raw, 10) : null;
                  setSelectedDealId(Number.isFinite(next as any) ? next : null);
                }}
                disabled={isLookupLoading}
              >
                <Option value="">{isLookupLoading ? 'Carregando…' : '—'}</Option>
                {deals
                  .slice()
                  .sort((a, b) => (a.reference_name || '').localeCompare(b.reference_name || ''))
                  .map((d) => (
                    <Option key={d.id} value={String(d.id)}>
                      {d.reference_name ? d.reference_name : `Deal #${d.id}`}
                    </Option>
                  ))}
              </Select>
            </div>

            <div>
              <div className="text-[12px] text-[var(--sapContent_LabelColor,#6a6d70)] mb-1">
                Pedido de Venda (SO) (obrigatório)
              </div>
              <Select
                value={String(selectedSoId ?? '')}
                onChange={(e) => {
                  const raw = String((e.target as any).value || '');
                  const next = raw ? Number.parseInt(raw, 10) : null;
                  setSelectedSoId(Number.isFinite(next as any) ? next : null);
                }}
                disabled={!selectedDealId || isLookupLoading}
              >
                <Option value="">{!selectedDealId ? 'Selecione o Deal primeiro' : isLookupLoading ? 'Carregando…' : '—'}</Option>
                {salesOrdersForSelectedDeal.map((so) => {
                  return (
                    <Option key={so.id} value={String(so.id)}>
                      {so.so_number}
                    </Option>
                  );
                })}
              </Select>
            </div>
          </div>

          {lookupError && (
            <div className="mt-2 text-[12px] text-[var(--sapNegativeColor,#bb0000)]">
              {lookupError}
            </div>
          )}

          {formValidationMessage && (
            <div className="mt-2 text-[12px] text-[var(--sapNegativeColor,#bb0000)]">
              {formValidationMessage}
            </div>
          )}

          {selectedDealId && (
            <div className="mt-2 text-[12px] text-[var(--sapContent_LabelColor,#6a6d70)]">
              <span className="mr-3">Deal: {selectedDeal?.reference_name ? selectedDeal.reference_name : `#${selectedDealId}`}</span>
              <span className="mr-3">SOs: {salesOrdersForSelectedDeal.length}</span>
              <span>POs: {purchaseOrdersInSelectedDeal.length}</span>
            </div>
          )}

          {selectedDealId && (
            <div className="mt-3">
              <div className="text-[12px] font-['72:Bold',sans-serif] text-[var(--sapTile_TitleTextColor,#131e29)] mb-1">
                POs vinculadas ao Deal
              </div>
              {purchaseOrdersInSelectedDeal.length === 0 ? (
                <div className="text-[12px] text-[var(--sapContent_LabelColor,#6a6d70)]">
                  Nenhuma PO encontrada para este Deal.
                </div>
              ) : (
                <div className="max-h-[140px] overflow-auto border border-[var(--sapTile_BorderColor,#e5e5e5)] rounded bg-[var(--sapList_Background,#fff)]">
                  {purchaseOrdersInSelectedDeal.slice(0, 25).map((po) => (
                    <div
                      key={po.id}
                      className="px-3 py-2 flex items-center justify-between border-b last:border-b-0 border-[var(--sapTile_BorderColor,#e5e5e5)]"
                    >
                      <div className="text-[12px] text-[var(--sapTile_TitleTextColor,#131e29)]">
                        <span className="font-['72:Semibold_Duplex',sans-serif]">{po.po_number}</span>
                        {po.supplier?.name ? (
                          <span className="ml-2 text-[var(--sapContent_LabelColor,#6a6d70)]">{po.supplier.name}</span>
                        ) : null}
                      </div>
                      <div className="text-[12px] text-[var(--sapContent_LabelColor,#6a6d70)]">
                        {po.total_quantity_mt} {po.unit || 'MT'}
                      </div>
                    </div>
                  ))}
                  {purchaseOrdersInSelectedDeal.length > 25 ? (
                    <div className="px-3 py-2 text-[12px] text-[var(--sapContent_LabelColor,#6a6d70)]">
                      Mostrando 25 de {purchaseOrdersInSelectedDeal.length} POs.
                    </div>
                  ) : null}
                </div>
              )}
            </div>
          )}
          </div>
        </Card>

        {/* Quantity */}
        <Card className="mb-4">
          <div style={{ padding: '0.75rem' }}>
            <div className="w-full md:w-[30%]">
              <Label>Quantidade (t)</Label>
              <Input type="Number" value={quantity} onInput={(e) => setQuantity(String((e.target as any).value || ''))} />
            </div>
          </div>
        </Card>

        {/* Trade Cards */}
        {trades.map((trade, index) => renderTradeCard(trade, index))}

        {/* Add Trade Button */}
        <div className="mb-4">
          <Button design="Default" icon="add" onClick={addTrade}>
            Adicionar estrutura
          </Button>
        </div>

        {/* Texto para envio */}
        <Card className="mb-4">
          <div style={{ padding: '0.75rem' }}>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-['72:Semibold_Duplex',sans-serif] text-[16px] text-[var(--sapTile_TitleTextColor,#131e29)] leading-[normal] m-0">
              Texto para envio
            </h3>
            <div className="flex gap-2">
              <Button design="Default" onClick={handleGeneratePreview} disabled={isPreviewLoading || !canGeneratePreview}>
                {isPreviewLoading ? 'Gerando…' : 'Gerar texto'}
              </Button>
              {isPreviewLoading ? <BusyIndicator active delay={0} size="Small" /> : null}
            </div>
          </div>
          
          {(previewFormError || previewError) && (
            <MessageStrip design="Negative">{previewFormError || previewError?.detail || UX_COPY.errors.title}</MessageStrip>
          )}
          
          {/* Dual Preview - Side by Side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Brokers Preview (English) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-['72:Semibold_Duplex',sans-serif] text-[14px] text-[var(--sapTile_TitleTextColor,#131e29)]">
                    Texto em inglês (quando aplicável)
                </h4>
                <Button
                  design="Transparent"
                  icon="copy"
                  onClick={() => brokerPreviewText && navigator.clipboard.writeText(brokerPreviewText)}
                  disabled={!brokerPreviewText}
                >
                  Copiar
                </Button>
              </div>
              <TextArea
                value={brokerPreviewText || ''}
                rows={12}
                readonly
                className="font-['Courier_New',monospace] text-[11px]"
              />
              {!brokerPreviewText ? <Text style={{ opacity: 0.75, fontSize: '0.8125rem' }}>Gere o texto para visualizar.</Text> : null}
            </div>

            {/* Banks Preview (Portuguese) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-['72:Semibold_Duplex',sans-serif] text-[14px] text-[var(--sapTile_TitleTextColor,#131e29)]">
                  Texto em português
                </h4>
                <Button
                  design="Transparent"
                  icon="copy"
                  onClick={() => bankPreviewText && navigator.clipboard.writeText(bankPreviewText)}
                  disabled={!bankPreviewText}
                >
                  Copiar
                </Button>
              </div>
              <TextArea
                value={bankPreviewText || ''}
                rows={12}
                readonly
                className="font-['Courier_New',monospace] text-[11px]"
              />
              {!bankPreviewText ? <Text style={{ opacity: 0.75, fontSize: '0.8125rem' }}>Gere o texto para visualizar.</Text> : null}
            </div>
          </div>
          </div>
        </Card>

        {/* Counterparty Selection Section */}
        <Card>
          <div style={{ padding: '0.75rem' }}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <h3 className="font-['72:Semibold_Duplex',sans-serif] text-[16px] text-[var(--sapTile_TitleTextColor,#131e29)] leading-[normal] m-0">
                Contrapartes
              </h3>
            </div>
            <div className="text-[12px] text-[var(--sapContent_LabelColor,#6a6d70)]">
              {selectedCounterpartyIds.length} selecionado(s) de {filteredCounterparties.length} disponíveis
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-wrap gap-3 mb-4">
            <div className="flex-1 min-w-[200px]">
              <Label>Buscar contraparte</Label>
              <Input value={counterpartySearch} onInput={(e) => setCounterpartySearch(String((e.target as any).value || ''))} />
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setCounterpartyFilter('all')}
                className={`px-3 py-1.5 rounded text-[12px] font-medium border transition-colors ${
                  counterpartyFilter === 'all'
                    ? 'bg-[var(--sapSelectedColor,#0a6ed1)] text-white border-[var(--sapSelectedColor,#0a6ed1)]'
                    : 'bg-white border-[var(--sapButton_BorderColor,#0854a0)] text-[var(--sapButton_TextColor,#0854a0)]'
                }`}
              >
                Todos
              </button>
              <button
                type="button"
                onClick={() => setCounterpartyFilter('banks')}
                className={`px-3 py-1.5 rounded text-[12px] font-medium border transition-colors ${
                  counterpartyFilter === 'banks'
                    ? 'bg-[var(--sapSelectedColor,#0a6ed1)] text-white border-[var(--sapSelectedColor,#0a6ed1)]'
                    : 'bg-white border-[var(--sapButton_BorderColor,#0854a0)] text-[var(--sapButton_TextColor,#0854a0)]'
                }`}
              >
                Instituições
              </button>
              <button
                type="button"
                onClick={() => setCounterpartyFilter('brokers')}
                className={`px-3 py-1.5 rounded text-[12px] font-medium border transition-colors ${
                  counterpartyFilter === 'brokers'
                    ? 'bg-[var(--sapSelectedColor,#0a6ed1)] text-white border-[var(--sapSelectedColor,#0a6ed1)]'
                    : 'bg-white border-[var(--sapButton_BorderColor,#0854a0)] text-[var(--sapButton_TextColor,#0854a0)]'
                }`}
              >
                Corretoras
              </button>
              <button
                type="button"
                onClick={selectAllFiltered}
                className="px-3 py-1.5 rounded text-[12px] font-medium text-[var(--sapLink_Color,#0854a0)] hover:underline"
              >
                ✓ Todos
              </button>
              <button
                type="button"
                onClick={clearSelection}
                className="px-3 py-1.5 rounded text-[12px] font-medium text-[var(--sapNegativeColor,#bb0000)] hover:underline"
              >
                × Limpar
              </button>
            </div>
          </div>

          {/* Counterparty List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[300px] overflow-y-auto pr-2">
            {isCounterpartiesLoading ? (
              <div className="col-span-2 flex items-center justify-center p-8 text-[var(--sapContent_LabelColor,#6a6d70)]">
                <BusyIndicator active delay={0} />
                <span className="ml-2">Carregando contrapartes…</span>
              </div>
            ) : filteredCounterparties.length === 0 ? (
              <div className="col-span-2 text-center p-8 text-[var(--sapContent_LabelColor,#6a6d70)]">
                Nenhuma contraparte encontrada.
              </div>
            ) : (
              filteredCounterparties.map(cp => {
                const isSelected = selectedCounterpartyIds.includes(cp.id);
                const lang = getLanguageForCounterparty(cp);
                const preflight = (ENABLE_COUNTERPARTY_KYC && isSelected) ? kycPreflightByCounterpartyId[cp.id] : undefined;
                return (
                  <div
                    key={cp.id}
                    onClick={() => toggleCounterparty(cp.id)}
                    className={`flex items-center gap-3 p-3 rounded border cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-[var(--sapSelectedColor,#0a6ed1)] bg-opacity-10 border-[var(--sapSelectedColor,#0a6ed1)]'
                        : 'bg-white border-[var(--sapTile_BorderColor,#e5e5e5)] hover:border-[var(--sapContent_ForegroundColor,#6a6d70)]'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => {}}
                      aria-label={`Selecionar contraparte ${cp.name}`}
                      title={`Selecionar contraparte ${cp.name}`}
                      className="w-4 h-4 accent-[var(--sapSelectedColor,#0a6ed1)]"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-[14px] text-[var(--sapTextColor,#32363a)] truncate">
                        {cp.name}
                      </div>
                      <div className="text-[11px] text-[var(--sapContent_LabelColor,#6a6d70)] truncate">
                        {counterpartyTypeLabel(cp.type)} • {channelLabel(cp.rfq_channel_type)}
                      </div>
                    </div>
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${
                      lang === 'en' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                    }`}>
                      {lang === 'en' ? 'EN' : 'PT'}
                    </span>
                    {isSelected && ENABLE_COUNTERPARTY_KYC && (
                      preflight ? (
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${
                          preflight.allowed ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {preflight.allowed ? 'Validada' : 'Restrita'}
                        </span>
                      ) : isKycPreflightLoading ? (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-gray-100 text-gray-700">
                          Validando...
                        </span>
                      ) : null
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* KYC Preflight Summary */}
          {ENABLE_COUNTERPARTY_KYC && selectedCounterpartyIds.length > 0 && (
            <div className="mt-3 rounded border border-[var(--sapTile_BorderColor,#e5e5e5)] bg-[var(--sapGroup_ContentBackground,#ffffff)] p-3">
              <div className="flex items-center justify-between gap-3">
                <div className="text-[12px] text-[var(--sapTextColor,#32363a)] font-medium">
                  KYC Preflight
                </div>
                <div className="text-[12px] text-[var(--sapContent_LabelColor,#6a6d70)]">
                  {isKycPreflightLoading ? (
                    <span className="inline-flex items-center">
                          <BusyIndicator active delay={0} size="Small" />
                          <span className="ml-1">checando…</span>
                    </span>
                  ) : isKycBlocked ? (
                    <span className="text-[var(--sapNegativeColor,#bb0000)]">
                      {blockedKycCounterpartyIds.length} bloqueada(s)
                    </span>
                  ) : (
                    <span className="text-[var(--sapPositiveColor,#0f7d0f)]">OK</span>
                  )}
                </div>
              </div>

              {isKycBlocked && (
                <div className="mt-2 text-[12px] text-[var(--sapNegativeColor,#bb0000)]">
                  {blockedKycCounterpartyIds.slice(0, 3).map((id) => {
                    const preflight = kycPreflightByCounterpartyId[id];
                    return (
                      <div key={id}>
                        - {getCounterpartyNameById(id)}: {preflight ? formatPreflightReason(preflight) : 'bloqueado'}
                      </div>
                    );
                  })}
                  {blockedKycCounterpartyIds.length > 3 && (
                    <div>+ {blockedKycCounterpartyIds.length - 3} outra(s)</div>
                  )}
                </div>
              )}

              {kycPreflightMessage && (
                <div className="mt-2 text-[12px] text-[var(--sapNegativeColor,#bb0000)]">
                  {kycPreflightMessage}
                </div>
              )}
            </div>
          )}

          {/* Send + WhatsApp Share */}
          <div className="mt-4 pt-4 border-t border-[var(--sapTile_BorderColor,#e5e5e5)] flex items-center justify-end gap-2">
            <Button
              design="Transparent"
              onClick={handleShareWhatsApp}
              disabled={!selectedDealId || !selectedSoId}
            >
              WhatsApp
            </Button>
            <Button
              design="Emphasized"
              disabled={!selectedDealId || !selectedSoId || (!brokerPreviewText && !bankPreviewText) || selectedCounterpartyIds.length === 0 || sendingStatus !== 'idle' || (ENABLE_COUNTERPARTY_KYC && (isKycPreflightLoading || isKycBlocked))}
              onClick={handleCreateAndSendRfq}
              className="min-w-[180px]"
            >
              {sendingStatus === 'creating' ? 'Registrando cotação...' :
               sendingStatus === 'sending' ? `Enviando (${sendProgress.sent}/${sendProgress.total})...` :
               sendingStatus === 'done' ? 'Cotação enviada!' :
               sendingStatus === 'error' ? UX_COPY.errors.title :
               `Enviar cotação (${selectedCounterpartyIds.length})`}
            </Button>
            {sendingStatus === 'creating' || sendingStatus === 'sending' ? <BusyIndicator active delay={0} size="Small" /> : null}
          </div>
          </div>
        </Card>

        {/* Send Progress Feedback */}
        {sendingStatus !== 'idle' && (
          <Card className="mt-4">
            <div style={{ padding: '0.75rem' }}>
            <div className="flex items-center gap-3 mb-3">
              <ObjectStatus
                state={
                  sendingStatus === 'done'
                    ? ValueState.Success
                    : sendingStatus === 'error'
                      ? ValueState.Error
                      : ValueState.Information
                }
              >
                {sendingStatus === 'creating' ? 'Registrando…' : sendingStatus === 'sending' ? 'Enviando…' : sendingStatus === 'done' ? 'Concluído' : 'Erro'}
              </ObjectStatus>
              <h3 className="font-['72:Semibold_Duplex',sans-serif] text-[16px] text-[var(--sapTile_TitleTextColor,#131e29)] leading-[normal] m-0">
                {sendingStatus === 'creating' ? 'Registrando cotação...' :
                 sendingStatus === 'sending' ? 'Enviando para Contrapartes...' :
                 sendingStatus === 'done' ? 'Cotação registrada e enviada!' :
                 UX_COPY.errors.title}
              </h3>
            </div>

            {/* Progress Bar */}
            {(sendingStatus === 'sending' || sendingStatus === 'done') && (
              <div className="mb-3">
                <div className="flex justify-between text-[12px] text-[var(--sapContent_LabelColor,#6a6d70)] mb-1">
                  <span>Progresso</span>
                  <span>{sendProgress.sent}/{sendProgress.total}</span>
                </div>
                <div className="w-full h-2 bg-[var(--sapField_BorderColor,#89919a)] bg-opacity-20 rounded overflow-hidden">
                  <progress
                    className="w-full h-2 [&::-webkit-progress-bar]:bg-transparent [&::-webkit-progress-value]:bg-[var(--sapPositiveColor,#0f7d0f)] [&::-moz-progress-bar]:bg-[var(--sapPositiveColor,#0f7d0f)]"
                    value={sendProgress.total > 0 ? sendProgress.sent : 0}
                    max={sendProgress.total > 0 ? sendProgress.total : 1}
                  />
                </div>
              </div>
            )}

            {/* Error Messages */}
            {sendProgress.errors.length > 0 && (
              <MessageStrip design="Negative">{UX_COPY.errors.message}</MessageStrip>
            )}

            {/* Success Message */}
            {sendingStatus === 'done' && sendProgress.errors.length === 0 && (
              <MessageStrip design="Positive">Cotação registrada com sucesso. Abrindo detalhes…</MessageStrip>
            )}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
