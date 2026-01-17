/**
 * Dashboard Service
 * 
 * Consome APIs REAIS do backend:
 * - /market/aluminum/quote - Cotação atual do alumínio
 * - /market/aluminum/history - Histórico de preços
 * - /contracts/settlements/today - Vencimentos do dia
 * - /contracts/settlements/upcoming - Próximos vencimentos
 * 
 * O frontend NUNCA calcula - apenas renderiza dados do backend.
 */

import { api, endpoints } from '../api';
import { 
  AluminumQuote, 
  AluminumHistoryPoint, 
  SettlementItem,
  DashboardSummary,
} from '../types';

// ============================================
// Aluminum Market Data
// ============================================

/**
 * Get current aluminum spot quote (bid/ask)
 */
export async function getAluminumQuote(): Promise<AluminumQuote> {
  return api.get<AluminumQuote>(endpoints.aluminum.quote);
}

/**
 * Get aluminum price history
 * @param range - '7d', '30d', or '1y'
 */
export async function getAluminumHistory(
  range: '7d' | '30d' | '1y' = '30d'
): Promise<AluminumHistoryPoint[]> {
  return api.get<AluminumHistoryPoint[]>(endpoints.aluminum.history(range));
}

// ============================================
// Settlements
// ============================================

/**
 * Get contracts settling today
 */
export async function getSettlementsToday(): Promise<SettlementItem[]> {
  return api.get<SettlementItem[]>(endpoints.settlements.today);
}

/**
 * Get upcoming settlements
 * @param limit - Number of results (default 10)
 */
export async function getSettlementsUpcoming(limit: number = 10): Promise<SettlementItem[]> {
  return api.get<SettlementItem[]>(endpoints.settlements.upcoming(limit));
}

// ============================================
// Dashboard Summary (composto)
// ============================================

/**
 * Get full dashboard summary from /dashboard/summary
 * This endpoint is DB-backed (no mocks)
 */
export async function getDashboardSummary(): Promise<DashboardSummary> {
  return api.get<DashboardSummary>(endpoints.dashboard.summary);
}

// ============================================
// Formatters
// ============================================

/**
 * Formata valor monetário com símbolo
 */
export function formatCurrency(value: number | null | undefined, currency: string = 'USD'): string {
  if (value === null || value === undefined) return '—';
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

/**
 * Formata número simples
 */
export function formatNumber(value: number | null | undefined, decimals: number = 2): string {
  if (value === null || value === undefined) return '—';
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

/**
 * Formata percentual com sinal
 */
export function formatPercent(value: number | null | undefined): string {
  if (value === null || value === undefined) return '—';
  const sign = value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(2)}%`;
}

/**
 * Formata data ISO para formato brasileiro
 */
export function formatDate(isoDate: string | null | undefined): string {
  if (!isoDate) return '—';
  try {
    return new Date(isoDate).toLocaleDateString('pt-BR');
  } catch {
    return isoDate;
  }
}

/**
 * Formata data/hora ISO para formato brasileiro
 */
export function formatDateTime(isoDate: string | null | undefined): string {
  if (!isoDate) return '—';
  try {
    return new Date(isoDate).toLocaleString('pt-BR');
  } catch {
    return isoDate;
  }
}

/**
 * Determina cor do status baseado no valor
 */
export function getStatusColor(value: number): 'positive' | 'negative' | 'neutral' {
  if (value > 0) return 'positive';
  if (value < 0) return 'negative';
  return 'neutral';
}

export default {
  // Aluminum
  getAluminumQuote,
  getAluminumHistory,
  // Settlements
  getSettlementsToday,
  getSettlementsUpcoming,
  // Dashboard
  getDashboardSummary,
  // Formatters
  formatCurrency,
  formatNumber,
  formatPercent,
  formatDate,
  formatDateTime,
  getStatusColor,
};
