/**
 * API Response Types
 * 
 * Wrappers para respostas da API, tratamento de erros e paginação
 */

// ============================================
// API Error
// ============================================
export interface ApiError {
  detail: string;
  status_code?: number;
  validation_errors?: ValidationError[];
  detail_obj?: unknown;
  response_body?: unknown;
}

export interface ValidationError {
  loc: (string | number)[];
  msg: string;
  type: string;
}

// ============================================
// Paginated Response (se implementado)
// ============================================
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  page_size: number;
  has_more: boolean;
}

// ============================================
// API State wrapper para hooks
// ============================================
export interface ApiState<T> {
  data: T | null;
  isLoading: boolean;
  isError: boolean;
  error: ApiError | null;
  isSuccess: boolean;
}

// ============================================
// Mutation State wrapper
// ============================================
export interface MutationState<T> {
  data: T | null;
  isLoading: boolean;
  isError: boolean;
  error: ApiError | null;
  isSuccess: boolean;
  reset: () => void;
}

// ============================================
// Dashboard Summary Response
// ============================================
export interface DashboardMtm {
  value: number;
  currency: string;
  change: number;
  changePercent: number;
  status: 'positive' | 'negative' | 'neutral';
  indicators: {
    dailyPnL: number;
    weeklyPnL: number;
    monthlyPnL: number;
  };
  period: string;
}

export interface DashboardSettlement {
  total: number;
  currency: string;
  count: number;
  breakdown: Array<{
    label: string;
    value: number;
  }>;
  status: string;
  period: string;
}

export interface DashboardRfq {
  id: string;
  client: string;
  product: string;
  amount: number;
  currency: string;
  maturity: string;
  status: string;
  priority: string;
  timestamp: string;
}

export interface DashboardContract {
  id: string;
  contractNumber: string;
  client: string;
  product: string;
  notional: number;
  currency: string;
  rate: number;
  maturity: string;
  status: string;
  mtm: number;
}

export interface DashboardTimelineItem {
  id: string;
  author: string;
  role: string;
  timestamp: string;
  content: string;
  avatar: {
    initials: string;
    colorScheme: number;
  };
  highlight?: boolean;
}

export interface DashboardSummary {
  mtm: DashboardMtm;
  settlements: DashboardSettlement;
  rfqs: DashboardRfq[];
  contracts: DashboardContract[];
  timeline: DashboardTimelineItem[];
  lastUpdated: string;
}

// ============================================
// Aluminum Market Data (Backend: /market/lme/aluminum/*)
// ============================================

export interface LmeLiveLeg {
  symbol: 'P3Y00' | 'P4Y00' | 'Q7Y00';
  price: number;
  ts: string; // ISO datetime (UTC)
}

// Kept name for compatibility with existing hooks/pages.
export interface AluminumQuote {
  cash: LmeLiveLeg;
  three_month: LmeLiveLeg;
}

// Merged daily history used by the dashboard chart.
// Backend returns per-series arrays; the frontend merges by date.
export interface AluminumHistoryPoint {
  date: string; // YYYY-MM-DD
  cash?: number | null;
  three_month?: number | null;
}

// ============================================
// Settlements (Backend: /contracts/settlements)
// ============================================
export interface SettlementItem {
  contract_id: string;
  hedge_id?: number | null;
  counterparty_id?: number | null;
  counterparty_name: string;
  settlement_date: string;
  mtm_today_usd?: number | null;
  settlement_value_usd?: number | null;
}

// ============================================
// Cashflow (Backend: /cashflow)
// ============================================

export interface CashflowItem {
  contract_id: string;
  deal_id: number;
  rfq_id: number;
  counterparty_id?: number | null;
  settlement_date?: string | null;

  projected_value_usd?: number | null;
  projected_methodology?: string | null;
  projected_as_of?: string | null;

  final_value_usd?: number | null;
  final_methodology?: string | null;

  observation_start?: string | null;
  observation_end_used?: string | null;
  last_published_cash_date?: string | null;

  data_quality_flags: string[];
}

export interface CashflowResponse {
  as_of: string;
  items: CashflowItem[];
}

export interface CashflowQueryParams {
  start_date?: string;
  end_date?: string;
  as_of?: string;
  contract_id?: string;
  counterparty_id?: number;
  deal_id?: number;
  limit?: number;
}

// ============================================
// Cashflow Analytic (Backend: /cashflow/analytic)
// ============================================

export type CashFlowEntityType = 'deal' | 'so' | 'po' | 'contract' | 'exposure';
export type CashFlowType = 'physical' | 'financial' | 'risk';
export type CashFlowValuationMethod = 'fixed' | 'mtm';
export type CashFlowConfidence = 'deterministic' | 'estimated' | 'risk';
export type CashFlowDirection = 'inflow' | 'outflow';

export interface CashFlowLine {
  entity_type: CashFlowEntityType;
  entity_id: string;
  parent_id?: string | null;

  cashflow_type: CashFlowType;
  date: string; // YYYY-MM-DD
  amount: number; // non-negative magnitude

  price_type?: string | null;
  valuation_method: CashFlowValuationMethod;
  valuation_reference_date?: string | null;
  confidence: CashFlowConfidence;
  direction: CashFlowDirection;

  quantity_mt?: number | null;
  unit_price_used?: number | null;

  source_reference?: string | null;
  explanation?: string | null;
  as_of: string; // ISO datetime
}

export interface CashflowAnalyticQueryParams {
  start_date?: string;
  end_date?: string;
  as_of?: string;
  deal_id?: number;
}
