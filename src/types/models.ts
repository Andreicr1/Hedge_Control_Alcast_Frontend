/**
 * Modelos/DTOs do Backend - FONTE DA VERDADE
 * 
 * Estas interfaces são derivadas diretamente dos schemas Pydantic em:
 * backend/app/schemas/
 * 
 * REGRA: O frontend NUNCA define modelos de negócio.
 * Sempre derivar do backend.
 */

import {
  OrderStatus,
  PricingType,
  CounterpartyType,
  RfqStatus,
  HedgeStatus,
  MarketObjectType,
  ExposureType,
  ExposureStatus,
  HedgeTaskStatus,
  DealStatus,
  DealLifecycleStatus,
  DealEntityType,
  DealDirection,
  DealAllocationType,
  SendStatus,
  RfqTradeType,
  RfqPriceType,
  RfqOrderType,
  RfqSide,
} from './enums';

// ============================================
// Supplier
// ============================================
export interface Supplier {
  id: number;
  name: string;
  code?: string | null;
  trade_name?: string | null;
  legal_name?: string | null;
  entity_type?: string | null;
  tax_id?: string | null;
  tax_id_type?: string | null;
  tax_id_country?: string | null;
  state_registration?: string | null;
  address_line?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  postal_code?: string | null;
  country_incorporation?: string | null;
  country_operation?: string | null;
  country_residence?: string | null;
  credit_limit?: number | null;
  credit_score?: number | null;
  kyc_status?: string | null;
  kyc_notes?: string | null;
  contact_email?: string | null;
  contact_phone?: string | null;
  base_currency?: string | null;
  payment_terms?: string | null;
  risk_rating?: string | null;
  sanctions_flag?: boolean | null;
  internal_notes?: string | null;
  active: boolean;
  created_at: string;
}

export interface SupplierCreate {
  name: string;
  code?: string | null;
  trade_name?: string | null;
  legal_name?: string | null;
  entity_type?: string | null;
  tax_id?: string | null;
  tax_id_type?: string | null;
  tax_id_country?: string | null;
  state_registration?: string | null;
  address_line?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  postal_code?: string | null;
  country_incorporation?: string | null;
  country_operation?: string | null;
  country_residence?: string | null;
  credit_limit?: number | null;
  credit_score?: number | null;
  kyc_status?: string | null;
  kyc_notes?: string | null;
  contact_email?: string | null;
  contact_phone?: string | null;
  base_currency?: string | null;
  payment_terms?: string | null;
  risk_rating?: string | null;
  sanctions_flag?: boolean | null;
  internal_notes?: string | null;
  active?: boolean;
}

export interface SupplierUpdate extends Partial<SupplierCreate> {}

// ============================================
// Customer
// ============================================
export interface Customer {
  id: number;
  name: string;
  code?: string | null;
  trade_name?: string | null;
  legal_name?: string | null;
  entity_type?: string | null;
  tax_id?: string | null;
  tax_id_type?: string | null;
  tax_id_country?: string | null;
  state_registration?: string | null;
  address_line?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  postal_code?: string | null;
  country_incorporation?: string | null;
  country_operation?: string | null;
  country_residence?: string | null;
  credit_limit?: number | null;
  credit_score?: number | null;
  kyc_status?: string | null;
  kyc_notes?: string | null;
  contact_email?: string | null;
  contact_phone?: string | null;
  base_currency?: string | null;
  payment_terms?: string | null;
  risk_rating?: string | null;
  sanctions_flag?: boolean | null;
  internal_notes?: string | null;
  active: boolean;
  created_at: string;
}

export interface CustomerCreate {
  name: string;
  code?: string | null;
  trade_name?: string | null;
  legal_name?: string | null;
  entity_type?: string | null;
  tax_id?: string | null;
  tax_id_type?: string | null;
  tax_id_country?: string | null;
  state_registration?: string | null;
  address_line?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  postal_code?: string | null;
  country_incorporation?: string | null;
  country_operation?: string | null;
  country_residence?: string | null;
  credit_limit?: number | null;
  credit_score?: number | null;
  kyc_status?: string | null;
  kyc_notes?: string | null;
  contact_email?: string | null;
  contact_phone?: string | null;
  base_currency?: string | null;
  payment_terms?: string | null;
  risk_rating?: string | null;
  sanctions_flag?: boolean | null;
  internal_notes?: string | null;
  active?: boolean;
}

export interface CustomerUpdate extends Partial<CustomerCreate> {}

// ============================================
// Counterparty (Banco/Broker)
// ============================================
export interface Counterparty {
  id: number;
  name: string;
  type: CounterpartyType;
  rfq_channel_type?: string | null;
  trade_name?: string | null;
  legal_name?: string | null;
  entity_type?: string | null;
  contact_name?: string | null;
  contact_email?: string | null;
  contact_phone?: string | null;
  address_line?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  postal_code?: string | null;
  country_incorporation?: string | null;
  country_operation?: string | null;
  tax_id?: string | null;
  tax_id_type?: string | null;
  tax_id_country?: string | null;
  base_currency?: string | null;
  payment_terms?: string | null;
  risk_rating?: string | null;
  sanctions_flag?: boolean | null;
  kyc_status?: string | null;
  kyc_notes?: string | null;
  internal_notes?: string | null;
  active: boolean;
  created_at: string;
}

export interface CounterpartyCreate {
  name: string;
  type: CounterpartyType;
  rfq_channel_type?: string | null;
  trade_name?: string | null;
  legal_name?: string | null;
  entity_type?: string | null;
  contact_name?: string | null;
  contact_email?: string | null;
  contact_phone?: string | null;
  address_line?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  postal_code?: string | null;
  country_incorporation?: string | null;
  country_operation?: string | null;
  tax_id?: string | null;
  tax_id_type?: string | null;
  tax_id_country?: string | null;
  base_currency?: string | null;
  payment_terms?: string | null;
  risk_rating?: string | null;
  sanctions_flag?: boolean | null;
  kyc_status?: string | null;
  kyc_notes?: string | null;
  internal_notes?: string | null;
  active?: boolean;
}

export interface CounterpartyUpdate extends Partial<CounterpartyCreate> {}

// ============================================
// Counterparty KYC (Read-only)
// ============================================

export interface KycGateErrorDetail {
  code: string;
  counterparty_id?: number | null;
  details?: unknown;
}

export interface KycPreflightResponse {
  allowed: boolean;
  reason_code: string;
  blocked_counterparty_id?: number | null;
  missing_items?: string[];
  expired_items?: string[];
  ttl_info?: unknown;
}

// ============================================
// Workflow Approvals (T3)
// ============================================

export type WorkflowDecisionValue = 'approved' | 'rejected';
export type WorkflowRequestStatus = 'pending' | 'approved' | 'rejected' | 'executed';

export interface WorkflowDecisionCreate {
  decision: WorkflowDecisionValue;
  justification: string;
}

export interface WorkflowDecisionRead {
  id: number;
  workflow_request_id: number;
  decision: WorkflowDecisionValue;
  justification: string;
  decided_by_user_id: number;
  decided_at: string;
  created_at: string;
}

export interface WorkflowRequestRead {
  id: number;
  request_key: string;
  inputs_hash: string;

  action: string;
  subject_type: string;
  subject_id: string;

  status: WorkflowRequestStatus;

  notional_usd?: number | null;
  threshold_usd?: number | null;
  required_role: string;

  context?: Record<string, unknown> | null;

  requested_by_user_id?: number | null;
  requested_at: string;
  sla_due_at?: string | null;

  decided_at?: string | null;
  executed_at?: string | null;
  executed_by_user_id?: number | null;

  correlation_id?: string | null;

  created_at: string;
  updated_at: string;

  decisions?: WorkflowDecisionRead[] | null;
}

// ============================================
// Purchase Order
// ============================================
export interface PurchaseOrder {
  id: number;
  po_number: string;
  deal_id?: number | null;
  supplier_id: number;
  supplier?: Supplier | null;
  product?: string | null;
  total_quantity_mt: number;
  unit?: string | null;
  unit_price?: number | null;
  pricing_type: PricingType;
  pricing_period?: string | null;
  lme_premium: number;
  premium?: number | null;
  reference_price?: string | null;
  fixing_deadline?: string | null;
  expected_delivery_date?: string | null;
  location?: string | null;
  avg_cost?: number | null;
  status: OrderStatus;
  notes?: string | null;
  created_at: string;
}

export interface PurchaseOrderCreate {
  po_number?: string | null;
  supplier_id: number;
  deal_id?: number | null;
  product?: string | null;
  total_quantity_mt: number;
  unit?: string | null;
  unit_price?: number | null;
  pricing_type: PricingType;
  pricing_period?: string | null;
  lme_premium: number;
  premium?: number | null;
  reference_price?: string | null;
  fixing_deadline?: string | null;
  expected_delivery_date?: string | null;
  location?: string | null;
  avg_cost?: number | null;
  status?: OrderStatus;
  notes?: string | null;
}

export interface PurchaseOrderUpdate extends Partial<PurchaseOrderCreate> {}

// ============================================
// Sales Order
// ============================================
export interface SalesOrder {
  id: number;
  so_number: string;
  deal_id?: number | null;
  customer_id: number;
  customer?: Customer | null;
  product?: string | null;
  total_quantity_mt: number;
  unit?: string | null;
  unit_price?: number | null;
  pricing_type: PricingType;
  pricing_period?: string | null;
  lme_premium: number;
  premium?: number | null;
  reference_price?: string | null;
  fixing_deadline?: string | null;
  expected_delivery_date?: string | null;
  location?: string | null;
  status: OrderStatus;
  notes?: string | null;
  created_at: string;
}

export interface SalesOrderCreate {
  so_number?: string | null;
  customer_id: number;
  product?: string | null;
  total_quantity_mt: number;
  unit?: string | null;
  unit_price?: number | null;
  pricing_type: PricingType;
  pricing_period?: string | null;
  lme_premium: number;
  premium?: number | null;
  reference_price?: string | null;
  fixing_deadline?: string | null;
  expected_delivery_date?: string | null;
  location?: string | null;
  status?: OrderStatus;
  notes?: string | null;
}

export interface SalesOrderUpdate extends Partial<SalesOrderCreate> {}

// ============================================
// RFQ Quote
// ============================================
export interface RfqQuote {
  id: number;
  rfq_id?: number;
  counterparty_id?: number | null;
  counterparty_name: string;
  quote_price: number;
  price_type?: string | null;
  volume_mt?: number | null;
  valid_until?: string | null;
  notes?: string | null;
  channel?: string | null;
  status: string;
  quote_group_id?: string | null;
  leg_side?: string | null; // 'buy' | 'sell'
  quoted_at: string;
}

export interface RfqQuoteCreate {
  counterparty_id?: number | null;
  counterparty_name: string;
  quote_price: number;
  price_type?: string | null;
  volume_mt?: number | null;
  valid_until?: string | null;
  notes?: string | null;
  channel?: string | null;
  status?: string;
  quote_group_id?: string | null;
  leg_side?: string | null;
}

// ============================================
// RFQ Invitation
// ============================================
export interface RfqInvitation {
  id: number;
  counterparty_id: number;
  counterparty_name?: string | null;
  status: string;
  expires_at?: string | null;
  message_text?: string | null;
  sent_at: string;
  responded_at?: string | null;
}

export interface RfqInvitationCreate {
  counterparty_id: number;
  counterparty_name?: string | null;
  status?: string;
  expires_at?: string | null;
  message_text?: string | null;
}

// ============================================
// RFQ
// ============================================
export interface Rfq {
  id: number;
  rfq_number: string;
  deal_id?: number | null;
  so_id: number;
  quantity_mt: number;
  period: string;
  status: RfqStatus;
  message_text?: string | null;
  counterparty_quotes: RfqQuote[];
  invitations: RfqInvitation[];
  winner_quote_id?: number | null;
  decision_reason?: string | null;
  decided_by?: number | null;
  decided_at?: string | null;
  winner_rank?: number | null;
  hedge_id?: number | null;
  hedge_reference?: string | null;
  created_at: string;
}

export interface RfqCreate {
  rfq_number?: string | null;
  deal_id?: number | null;
  so_id: number;
  quantity_mt: number;
  period: string;
  status?: RfqStatus;
  message_text?: string | null;
  counterparty_quotes?: RfqQuoteCreate[] | null;
  invitations?: RfqInvitationCreate[] | null;
  trade_specs?: Record<string, unknown>[] | null;
}

export interface RfqUpdate {
  rfq_number?: string | null;
  deal_id?: number | null;
  so_id?: number | null;
  quantity_mt?: number | null;
  period?: string | null;
  status?: RfqStatus | null;
  message_text?: string | null;
  counterparty_quotes?: RfqQuoteCreate[] | null;
  invitations?: RfqInvitationCreate[] | null;
}

export interface RfqAwardRequest {
  quote_id: number;
  motivo: string;
  hedge_id?: number | null;
  hedge_reference?: string | null;
}

// ============================================
// RFQ Send Attempt
// ============================================
export interface RfqSendAttempt {
  id: number;
  rfq_id: number;
  channel: string; // 'email' | 'api' | 'whatsapp'
  status: SendStatus;
  provider_message_id?: string | null;
  error?: string | null;
  idempotency_key?: string | null;
  retry_of_attempt_id?: number | null;
  metadata?: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

export interface RfqSendAttemptCreate {
  channel: string;
  status?: SendStatus;
  provider_message_id?: string | null;
  error?: string | null;
  metadata?: Record<string, unknown> | null;
  idempotency_key?: string | null;
  retry_of_attempt_id?: number | null;
  max_retries?: number;
  retry?: boolean;
}

// ============================================
// RFQ Preview (rfq_engine)
// ============================================
export interface RfqOrderInstruction {
  order_type: RfqOrderType;
  validity?: string | null;
  limit_price?: string | null;
}

export interface RfqLegInput {
  side: RfqSide;
  price_type: RfqPriceType;
  quantity_mt: number;
  month_name?: string | null;  // Required for AVG
  year?: number | null;        // Required for AVG
  start_date?: string | null;  // Required for AVGInter (YYYY-MM-DD)
  end_date?: string | null;    // Required for AVGInter
  fixing_date?: string | null; // Required for C2R; optional for Fix
  ppt?: string | null;         // Override PPT if provided
  order?: RfqOrderInstruction | null;
}

export interface RfqPreviewRequest {
  trade_type: RfqTradeType;
  leg1: RfqLegInput;
  leg2?: RfqLegInput | null;
  sync_ppt?: boolean;
  holidays?: string[] | null;  // ISO YYYY-MM-DD
  company_header?: string | null;
  company_label_for_payoff?: string;
}

export interface RfqPreviewResponse {
  text: string;
  trade_type?: string;
  leg_count?: number;
  total_quantity_mt?: number;
}

// ============================================
// Contract
// ============================================
export interface Contract {
  contract_id: string;
  contract_number?: string | null;
  deal_id: number;
  rfq_id: number;
  counterparty_id?: number | null;
  counterparty_name?: string | null;
  counterparty?: { id: number; name: string } | null;
  status: string;
  trade_index?: number | null;
  quote_group_id?: string | null;
  trade_snapshot: Record<string, unknown>;

  // Parsed legs (when available via detail endpoint)
  legs?: Array<{
    side: string;
    quantity_mt: number;
    price_type?: string | null;
    price?: number | null;
    valid_until?: string | null;
    notes?: string | null;
    month_name?: string | null;
    year?: number | null;
    start_date?: string | null;
    end_date?: string | null;
    fixing_date?: string | null;
  }>;
  fixed_leg?: Contract['legs'][number] | null;
  variable_leg?: Contract['legs'][number] | null;
  fixed_price?: number | null;
  variable_reference_type?: string | null;
  variable_reference_label?: string | null;
  observation_start?: string | null;
  observation_end?: string | null;
  maturity_date?: string | null;

  post_maturity_status?: 'active' | 'vencido' | 'settled' | 'cancelled' | string;
  settlement_adjustment_usd?: number | null;
  settlement_adjustment_methodology?: string | null;
  settlement_adjustment_locked?: boolean;

  settlement_date?: string | null;
  settlement_meta?: Record<string, unknown> | null;
  created_at: string;
}

export interface ContractExposureLink {
  exposure_id: number;
  quantity_mt: number;
  source_type: MarketObjectType;
  source_id: number;
  exposure_type: ExposureType;
  status: ExposureStatus;
}

// ============================================
// Hedge
// ============================================
export interface Hedge {
  id: number;
  so_id?: number | null;
  counterparty_id: number;
  counterparty?: Counterparty | null;
  quantity_mt: number;
  contract_price: number;
  current_market_price?: number | null;
  mtm_value?: number | null;
  period: string;
  instrument?: string | null;
  maturity_date?: string | null;
  reference_code?: string | null;
  status: HedgeStatus;
  created_at: string;
}

// ============================================
// Hedge Task
// ============================================
export interface HedgeTask {
  id: number;
  exposure_id: number;
  status: HedgeTaskStatus;
  created_at: string;
}

// ============================================
// Exposure
// ============================================
export interface Exposure {
  id: number;
  source_type: MarketObjectType;
  source_id: number;
  exposure_type: ExposureType;
  quantity_mt: number;
  product?: string | null;
  maturity_date?: string | null;
  payment_date?: string | null;
  delivery_date?: string | null;
  sale_date?: string | null;
  status: ExposureStatus;
  created_at: string;
  tasks: HedgeTask[];
}

// ============================================
// Deal
// ============================================
export interface Deal {
  id: number;
  deal_uuid: string;
  reference_name?: string | null;
  commodity?: string | null;
  currency: string;
  status: DealStatus;
  lifecycle_status: DealLifecycleStatus;
  created_by?: number | null;
  created_at: string;
}

// ============================================
// Deal Link
// ============================================
export interface DealLink {
  id: number;
  deal_id: number;
  entity_type: DealEntityType;
  entity_id: number;
  direction: DealDirection;
  quantity_mt?: number | null;
  allocation_type: DealAllocationType;
  created_at: string;
}

// ============================================
// Timeline (v1 - read-only)
// ============================================

export type TimelineVisibility = 'all' | 'finance';

export const TIMELINE_V1_EVENT_TYPES = [
  'SO_CREATED',
  'PO_CREATED',
  'CONTRACT_CREATED',
  'EXPOSURE_UPDATED',
  'MTM_REQUIRED',
] as const;

export type TimelineV1EventType = (typeof TIMELINE_V1_EVENT_TYPES)[number];

export interface TimelineEvent {
  id: number;
  event_type: TimelineV1EventType | string;
  occurred_at: string;
  created_at: string;
  subject_type: string;
  subject_id: number;
  correlation_id: string;
  supersedes_event_id?: number | null;
  actor_user_id?: number | null;
  audit_log_id?: number | null;
  visibility: TimelineVisibility;
  payload?: Record<string, unknown> | null;
  meta?: Record<string, unknown> | null;
}

// ============================================
// Deal PnL Response
// ============================================
export interface PhysicalLeg {
  source: string;
  source_id: number;
  direction: string;
  quantity_mt: number;
  pricing_type?: string | null;
  pricing_reference?: string | null;
  fixed_price?: number | null;
  status?: string | null;
}

export interface HedgeLeg {
  hedge_id: number;
  direction: string;
  quantity_mt: number;
  contract_period?: string | null;
  entry_price: number;
  mtm_price: number;
  mtm_value: number;
  status: string;
}

export interface DealPnlResponse {
  deal_id: number;
  status: DealStatus;
  commodity?: string | null;
  currency: string;
  physical_revenue: number;
  physical_cost: number;
  hedge_pnl_realized: number;
  hedge_pnl_mtm: number;
  net_pnl: number;
  snapshot_at: string;
  physical_legs: PhysicalLeg[];
  hedge_legs: HedgeLeg[];
}

// ============================================
// P&L (Portfolio snapshots/read models)
// ============================================

export interface PnlDealAggregateRow {
  deal_id: number;
  currency: string;
  unrealized_pnl_usd: number;
  realized_pnl_usd: number;
  total_pnl_usd: number;
}

export interface PnlAggregateResponse {
  as_of_date: string;
  currency: string;
  rows: PnlDealAggregateRow[];
  unrealized_total_usd: number;
  realized_total_usd: number;
  total_pnl_usd: number;
}

// ============================================
// Inbox / Financeiro Workbench
// ============================================

export interface InboxCounts {
  purchase_orders_pending: number;
  sales_orders_pending: number;
  rfqs_draft: number;
  rfqs_sent: number;
  exposures_active: number;
  exposures_passive: number;
  exposures_residual: number;
}

export interface InboxNetExposureRow {
  product: string;
  period: string;
  gross_active: number;
  gross_passive: number;
  hedged: number;
  net: number;
}

export interface InboxWorkbenchResponse {
  counts: InboxCounts;
  net_exposure: InboxNetExposureRow[];
  active: Exposure[];
  passive: Exposure[];
  residual: Exposure[];
}

export type InboxDecisionType = 'no_hedge';

export interface InboxDecisionCreate {
  decision: InboxDecisionType;
  justification: string;
}

export interface InboxDecisionRead {
  id: number;
  decision: InboxDecisionType;
  justification: string;
  created_at: string;
  created_by_user_id?: number | null;
}

// ============================================
// MTM Computation
// ============================================
export interface MtmComputation {
  mtm_value: number;
  fx_rate?: number | null;
  scenario_mtm_value?: number | null;
  price_used?: number | null;
}

// ============================================
// Market Price
// ============================================
export interface MarketPrice {
  id: number;
  source: string;
  symbol: string;
  contract_month?: string | null;
  price: number;
  currency: string;
  as_of: string;
  created_at: string;
  fx: boolean;
}

// ============================================
// Exports (jobs + manifest)
// ============================================

export interface ExportManifest {
  schema_version: number;
  export_id: string;
  inputs_hash: string;
  export_type: string;
  as_of?: string | null;
  gerado_em?: string | null;
  filters: Record<string, unknown>;
  counts: Record<string, number>;
  versoes?: Record<string, unknown>;
}

export interface ExportJobCreate {
  export_type: string;
  as_of?: string | null;
  subject_type?: string | null;
  subject_id?: number | null;
}

export interface ExportJobRead {
  id: number;
  export_id: string;
  inputs_hash: string;

  export_type: string;
  as_of?: string | null;
  filters?: Record<string, unknown> | null;

  status: string;
  requested_by_user_id?: number | null;
  artifacts?: Array<Record<string, unknown>> | null;

  created_at: string;
  updated_at: string;
}
