/**
 * Deals Service
 * 
 * Deal é o container principal que agrupa:
 * - SalesOrders (venda)
 * - PurchaseOrders (compra)
 * - Hedges (posições de hedge)
 * 
 * O cálculo de P&L é feito EXCLUSIVAMENTE pelo backend.
 */

import { api, endpoints } from '../api';
import { Deal, DealCreate, DealPnlResponse } from '../types';

// ============================================
// List Deals
// ============================================
export async function listDeals(): Promise<Deal[]> {
  return api.get<Deal[]>(endpoints.deals.list);
}

// ============================================
// Create Deal
// ============================================
export async function createDeal(payload: DealCreate): Promise<Deal> {
  return api.post<Deal>(endpoints.deals.create, payload);
}

// ============================================
// Get Deal by ID
// ============================================
export async function getDeal(dealId: number): Promise<Deal> {
  return api.get<Deal>(endpoints.deals.detail(dealId));
}

// ============================================
// Update Deal (reference_name)
// ============================================
export async function updateDeal(
  dealId: number,
  payload: { reference_name?: string | null }
): Promise<Deal> {
  return api.patch<Deal>(endpoints.deals.update(dealId), payload);
}

// ============================================
// Get Deal P&L
// BACKEND CALCULA - Frontend apenas exibe
// ============================================
export async function getDealPnl(dealId: number): Promise<DealPnlResponse> {
  return api.get<DealPnlResponse>(endpoints.deals.pnl(dealId));
}

// ============================================
// Helpers
// ============================================

/**
 * Formata P&L com sinal e cores
 */
export function formatPnl(value: number, currency: string = 'USD'): {
  formatted: string;
  isPositive: boolean;
  isNegative: boolean;
} {
  const isPositive = value > 0;
  const isNegative = value < 0;
  
  const formatter = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency,
    signDisplay: 'always',
  });
  
  return {
    formatted: formatter.format(value),
    isPositive,
    isNegative,
  };
}

/**
 * Calcula margem do deal (receita - custo) / receita
 */
export function calculateDealMargin(pnl: DealPnlResponse): number | null {
  if (pnl.physical_revenue === 0) return null;
  const margin = ((pnl.physical_revenue - pnl.physical_cost) / pnl.physical_revenue) * 100;
  return Math.round(margin * 100) / 100;
}

/**
 * Agrupa legs por tipo
 */
export function groupLegsByType(pnl: DealPnlResponse): {
  salesOrders: typeof pnl.physical_legs;
  purchaseOrders: typeof pnl.physical_legs;
  hedges: typeof pnl.hedge_legs;
} {
  return {
    salesOrders: pnl.physical_legs.filter(l => l.source === 'SO'),
    purchaseOrders: pnl.physical_legs.filter(l => l.source === 'PO'),
    hedges: pnl.hedge_legs,
  };
}

export default {
  list: listDeals,
  create: createDeal,
  get: getDeal,
  update: updateDeal,
  getPnl: getDealPnl,
};
