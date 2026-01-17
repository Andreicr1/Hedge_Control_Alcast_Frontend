// Type definitions for Hedge Control System

export interface SalesOrder {
  so_id: string;
  so_number: string;
  customer_name: string;
  product: string;
  total_quantity_mt: number;
  unit_price: number;
  status: 'Draft' | 'Approved' | 'Active' | 'Completed' | 'Cancelled' | 'Closed';
  expected_delivery_date: string;
  deal_id?: string;
}

export interface PurchaseOrder {
  po_id: string;
  po_number: string;
  supplier_name: string;
  product: string;
  total_quantity_mt: number;
  unit_price: number;
  status: 'Draft' | 'Approved' | 'Active' | 'Completed' | 'Cancelled' | 'Closed';
  expected_delivery_date: string;
  po_date?: string;
  incoterm?: string;
  payment_terms?: string;
  deal_id?: string;
}

export interface Exposure {
  exposure_id: string;
  so_id?: string;
  po_id?: string;
  commodity: string;
  quantity_mt: number;
  hedged_quantity_mt?: number;
  hedge_task_id?: string;
  exposure_date: string;
  maturity_date?: string;
  status: 'Open' | 'Partial' | 'Partially Hedged' | 'Hedged' | 'Fully Hedged' | 'Closed';
}

export interface Hedge {
  hedge_id: string;
  reference_code: string;
  counterparty: string;
  commodity: string;
  quantity_mt: number;
  contract_price: number;
  current_market_price: number;
  mtm_value: number;
  status: 'Draft' | 'Active' | 'Settled';
  maturity_date: string;
  contract_id?: string;
  deal_id?: string;
}

export interface RFQ {
  rfq_id: string;
  rfq_number: string;
  so_id: string;
  commodity: string;
  quantity_mt: number;
  status: 'Draft' | 'Sent' | 'Quoted' | 'Awarded' | 'Rejected' | 'Failed';
  period: string;
  contract_id?: string;

  // Extra fields used by RFQs screens (mock/UI)
  instrument_type?: string;
  issue_date?: string;
  deadline_date?: string;
  desired_maturity_date?: string;
  counterparties_count?: number;
  responses_count?: number;
  best_quote_price?: number;
  best_quote_counterparty?: string;
  hedge_task_id?: string;
}

export interface Contract {
  contract_id: string;
  counterparty: string;
  settlement_date: string;
  settlement_value: number;
  trade_snapshot: Record<string, unknown>;
  status: 'Active' | 'Settled' | 'Draft' | 'Pending' | 'Executed' | 'Expired';
  deal_id?: string;
  // Additional fields for ContractsPage
  instrument_type?: string;
  quantity_mt?: number;
  execution_date?: string;
  signing_date?: string;
  contract_value?: number;
  strike_price?: number;
  commodity?: string;
  maturity_date?: string;
  settlement_type?: string;
  terms?: string;
  rfq_id?: string;
  hedge_id?: string;
}

export interface Deal {
  deal_id: string;
  commodity: string;
  currency: string;
  lifecycle_status: 'Draft' | 'Active' | 'Closed';
  physical_revenue: number;
  physical_cost: number;
  hedge_pnl_realized: number;
  hedge_pnl_mtm: number;
  net_pnl: number;
}

export interface DealPnL {
  deal_id: string;
  commodity: string;
  physical_revenue: number;
  physical_cost: number;
  hedge_pnl_realized: number;
  hedge_pnl_mtm: number;
  net_pnl: number;
  physical_legs: Array<{
    type: 'so' | 'po';
    id: string;
    quantity_mt: number;
    unit_price: number;
  }>;
  hedge_legs: Array<{
    hedge_id: string;
    quantity_mt: number;
    mtm_value: number;
  }>;
}

export interface Contact {
  contact_id: string;
  name: string;
  email: string;
  phone: string;
  role?: string;
  is_primary?: boolean;
}

export interface Counterparty {
  counterparty_id: string;
  name: string;
  type: 'Bank' | 'Broker' | 'Trader' | 'Supplier' | 'Client';
  status: 'Active' | 'Inactive' | 'Suspended';
  total_exposure: number;
  credit_limit: number;
  available_credit: number;
  active_contracts_count: number;
  settled_contracts_count: number;
  contacts: Contact[];
  address?: string;
  country?: string;
  tax_id?: string;
  created_date: string;
  last_trade_date?: string;
}

export interface RFQQuote {
  quote_id: string;
  rfq_id: string;
  counterparty: string;
  buy_price?: number;
  sell_price?: number;
  spread?: number;
  volume_mt: number;
  channel: 'Bank' | 'Broker' | 'WhatsApp' | 'API' | 'Email';
  quoted_at: string;
  rank: number;
  status: 'Pending' | 'Awarded' | 'Rejected' | 'Expired';
  rejection_reason?: string;
}

export interface RFQDetail {
  rfq_id: string;
  commodity: string;
  volume_mt: number;
  settlement_date: string;
  status: 'Draft' | 'Sent' | 'Quoted' | 'Awarded' | 'Failed';
  created_at: string;
  quotes_count: number;
  best_quote_id?: string;
  awarded_quote_id?: string;
}