/**
 * Enums do Backend - FONTE DA VERDADE
 * 
 * Estes enums devem ser idênticos aos definidos em:
 * backend/app/models/domain.py
 * 
 * NUNCA modifique estes valores sem verificar o backend primeiro.
 */

// ============================================
// Order Status (PO, SO)
// ============================================
export enum OrderStatus {
  DRAFT = 'draft',
  ACTIVE = 'active',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

// ============================================
// Pricing Type
// ============================================
export enum PricingType {
  FIXED = 'fixed',
  TBF = 'tbf',
  MONTHLY_AVERAGE = 'monthly_average',
  LME_PREMIUM = 'lme_premium',
}

// ============================================
// Counterparty Type
// ============================================
export enum CounterpartyType {
  BANK = 'bank',
  BROKER = 'broker',
}

// ============================================
// RFQ Status
// ============================================
export enum RfqStatus {
  DRAFT = 'draft',
  PENDING = 'pending',
  SENT = 'sent',
  QUOTED = 'quoted',
  AWARDED = 'awarded',
  EXPIRED = 'expired',
  FAILED = 'failed',
}

// ============================================
// Hedge Status
// ============================================
export enum HedgeStatus {
  ACTIVE = 'active',
  CLOSED = 'closed',
  CANCELLED = 'cancelled',
}

// ============================================
// Market Object Type (para Exposures, MTM)
// ============================================
export enum MarketObjectType {
  HEDGE = 'hedge',
  PO = 'po',
  SO = 'so',
  PORTFOLIO = 'portfolio',
  EXPOSURE = 'exposure',
  NET = 'net',
}

// ============================================
// Exposure Type
// ============================================
export enum ExposureType {
  ACTIVE = 'active',   // Risco de queda (derivado de SO)
  PASSIVE = 'passive', // Risco de alta (derivado de PO)
}

// ============================================
// Exposure Status
// ============================================
export enum ExposureStatus {
  OPEN = 'open',
  PARTIALLY_HEDGED = 'partially_hedged',
  HEDGED = 'hedged',
  CLOSED = 'closed',
}

// ============================================
// Hedge Task Status
// ============================================
export enum HedgeTaskStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  HEDGED = 'hedged',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

// ============================================
// Deal Status
// ============================================
export enum DealStatus {
  OPEN = 'open',
  PARTIALLY_FIXED = 'partially_fixed',
  FIXED = 'fixed',
  SETTLED = 'settled',
}

// ============================================
// Deal Lifecycle Status
// ============================================
export enum DealLifecycleStatus {
  OPEN = 'open',
  PARTIALLY_HEDGED = 'partially_hedged',
  HEDGED = 'hedged',
  CLOSED = 'closed',
}

// ============================================
// Deal Entity Type
// ============================================
export enum DealEntityType {
  SO = 'so',
  PO = 'po',
  HEDGE = 'hedge',
}

// ============================================
// Deal Direction
// ============================================
export enum DealDirection {
  BUY = 'buy',
  SELL = 'sell',
}

// ============================================
// Deal Allocation Type
// ============================================
export enum DealAllocationType {
  AUTO = 'auto',
  MANUAL = 'manual',
}

// ============================================
// WhatsApp Direction
// ============================================
export enum WhatsAppDirection {
  INBOUND = 'inbound',
  OUTBOUND = 'outbound',
}

// ============================================
// WhatsApp Status
// ============================================
export enum WhatsAppStatus {
  QUEUED = 'queued',
  SENT = 'sent',
  DELIVERED = 'delivered',
  FAILED = 'failed',
  RECEIVED = 'received',
}

// ============================================
// Send Status (RFQ Send Attempts)
// ============================================
export enum SendStatus {
  QUEUED = 'queued',
  SENT = 'sent',
  FAILED = 'failed',
}

// ============================================
// RFQ Trade Type (rfq_engine)
// ============================================
export enum RfqTradeType {
  SWAP = 'Swap',
  FORWARD = 'Forward',
}

// ============================================
// RFQ Price Type (rfq_engine)
// ============================================
export enum RfqPriceType {
  AVG = 'AVG',
  AVG_INTER = 'AVGInter',
  FIX = 'Fix',
  C2R = 'C2R',
}

// ============================================
// RFQ Order Type (rfq_engine)
// ============================================
export enum RfqOrderType {
  AT_MARKET = 'At Market',
  LIMIT = 'Limit',
  RANGE = 'Range',
  RESTING = 'Resting',
}

// ============================================
// RFQ Side (rfq_engine)
// ============================================
export enum RfqSide {
  BUY = 'buy',
  SELL = 'sell',
}

// ============================================
// Contract Status
// ============================================
export enum ContractStatus {
  ACTIVE = 'active',
  SETTLED = 'settled',
  CANCELLED = 'cancelled',
}

// ============================================
// RFQ Quote Status
// ============================================
export enum RfqQuoteStatus {
  QUOTED = 'quoted',
  WINNER = 'winner',
  LOST = 'lost',
}

// ============================================
// RFQ Invitation Status
// ============================================
export enum RfqInvitationStatus {
  SENT = 'sent',
  ANSWERED = 'answered',
  WINNER = 'winner',
  LOST = 'lost',
  EXPIRED = 'expired',
  REFUSED = 'refused',
}

// ============================================
// Role Names
// ============================================
export enum RoleName {
  ADMIN = 'admin',
  COMPRAS = 'compras',
  VENDAS = 'vendas',
  FINANCEIRO = 'financeiro',
  ESTOQUE = 'estoque',
  AUDITORIA = 'auditoria',
}
