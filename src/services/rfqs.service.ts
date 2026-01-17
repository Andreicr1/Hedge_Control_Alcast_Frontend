/**
 * RFQs Service
 * 
 * Todas as operações relacionadas a RFQs.
 * O backend é a FONTE DA VERDADE para:
 * - Status e transições
 * - Ranking de cotações
 * - Criação de contratos ao premiar
 */

import { api, endpoints } from '../api';
import {
  Rfq,
  RfqCreate,
  RfqUpdate,
  RfqAwardRequest,
  RfqQuote,
  RfqQuoteCreate,
  RfqPreviewRequest,
  RfqPreviewResponse,
  RfqSendAttempt,
  RfqSendAttemptCreate,
} from '../types';

// ============================================
// List RFQs
// ============================================
export async function listRfqs(): Promise<Rfq[]> {
  return api.get<Rfq[]>(endpoints.rfqs.list);
}

// ============================================
// Get RFQ by ID
// ============================================
export async function getRfq(rfqId: number): Promise<Rfq> {
  return api.get<Rfq>(endpoints.rfqs.detail(rfqId));
}

// ============================================
// Create RFQ
// ============================================
export async function createRfq(data: RfqCreate): Promise<Rfq> {
  return api.post<Rfq>(endpoints.rfqs.create, data);
}

// ============================================
// Update RFQ
// ============================================
export async function updateRfq(rfqId: number, data: RfqUpdate): Promise<Rfq> {
  return api.put<Rfq>(endpoints.rfqs.update(rfqId), data);
}

// ============================================
// Send RFQ
// ============================================
export async function sendRfq(rfqId: number): Promise<Rfq> {
  return api.post<Rfq>(endpoints.rfqs.send(rfqId));
}

// ============================================
// Award Quote
// O backend cria automaticamente os Contracts ao premiar
// ============================================
export async function awardQuote(rfqId: number, data: RfqAwardRequest): Promise<Rfq> {
  return api.post<Rfq>(endpoints.rfqs.award(rfqId), data);
}

// ============================================
// Cancel RFQ
// ============================================
export async function cancelRfq(rfqId: number, motivo: string): Promise<Rfq> {
  return api.post<Rfq>(`${endpoints.rfqs.cancel(rfqId)}?motivo=${encodeURIComponent(motivo)}`);
}

// ============================================
// Add Quote to RFQ
// ============================================
export async function addQuoteToRfq(rfqId: number, data: RfqQuoteCreate): Promise<RfqQuote> {
  return api.post<RfqQuote>(endpoints.rfqs.addQuote(rfqId), data);
}

// ============================================
// Export Quotes as CSV
// ============================================
export async function exportQuotesCsv(rfqId: number): Promise<Blob> {
  const response = await fetch(endpoints.rfqs.exportQuotes(rfqId), {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('auth_token') || ''}`,
    },
  });
  if (!response.ok) {
    throw new Error('Erro ao exportar cotações');
  }
  return response.blob();
}

// ============================================
// Helpers
// ============================================

/**
 * Agrupa quotes por quote_group_id para visualização de trades
 */
export function groupQuotesByTrade(quotes: RfqQuote[]): Map<string, RfqQuote[]> {
  const groups = new Map<string, RfqQuote[]>();
  
  for (const quote of quotes) {
    const groupId = quote.quote_group_id || `single-${quote.id}`;
    const existing = groups.get(groupId) || [];
    existing.push(quote);
    groups.set(groupId, existing);
  }
  
  return groups;
}

/**
 * Calcula spread de um trade (buy - sell)
 */
export function calculateTradeSpread(quotes: RfqQuote[]): number | null {
  const buyLeg = quotes.find(q => q.leg_side === 'buy');
  const sellLeg = quotes.find(q => q.leg_side === 'sell');
  
  if (!buyLeg || !sellLeg) {
    return null;
  }
  
  return buyLeg.quote_price - sellLeg.quote_price;
}

/**
 * Ordena trades por spread (menor spread = melhor)
 */
export function rankTradesBySpread(
  groupedQuotes: Map<string, RfqQuote[]>
): Array<{ groupId: string; quotes: RfqQuote[]; spread: number | null; rank: number }> {
  const trades = Array.from(groupedQuotes.entries()).map(([groupId, quotes]) => ({
    groupId,
    quotes,
    spread: calculateTradeSpread(quotes),
    rank: 0,
  }));
  
  // Sort by spread (nulls at end)
  trades.sort((a, b) => {
    if (a.spread === null && b.spread === null) return 0;
    if (a.spread === null) return 1;
    if (b.spread === null) return -1;
    return a.spread - b.spread;
  });
  
  // Assign ranks
  trades.forEach((trade, index) => {
    trade.rank = index + 1;
  });
  
  return trades;
}

// ============================================
// Preview RFQ Message (via rfq_engine)
// ============================================
export async function previewRfq(data: RfqPreviewRequest): Promise<RfqPreviewResponse> {
  return api.post<RfqPreviewResponse>(endpoints.rfqs.preview, data);
}

// ============================================
// List Send Attempts for an RFQ
// ============================================
export async function listSendAttempts(rfqId: number): Promise<RfqSendAttempt[]> {
  return api.get<RfqSendAttempt[]>(endpoints.rfqs.sendAttempts(rfqId));
}

// ============================================
// Send RFQ with tracking (creates RfqSendAttempt)
// ============================================
export async function sendRfqWithTracking(
  rfqId: number, 
  data: RfqSendAttemptCreate
): Promise<RfqSendAttempt> {
  return api.post<RfqSendAttempt>(endpoints.rfqs.send(rfqId), data);
}

export default {
  list: listRfqs,
  get: getRfq,
  create: createRfq,
  update: updateRfq,
  send: sendRfq,
  award: awardQuote,
  cancel: cancelRfq,
  addQuote: addQuoteToRfq,
  exportCsv: exportQuotesCsv,
  preview: previewRfq,
  listSendAttempts,
  sendWithTracking: sendRfqWithTracking,
};
