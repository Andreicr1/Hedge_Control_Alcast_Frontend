/**
 * Dashboard Service
 *
 * Consome APIs canônicas do backend (sem superfícies legacy como /market/*, /prices/*, /live).
 *
 * O frontend NUNCA calcula - apenas renderiza dados do backend.
 */

import { api, endpoints } from '../api';
import {
  SettlementItem,
  DashboardSummary,
} from '../types';

import {
  formatCurrency0 as canonicalFormatCurrency0,
  formatNumberFixed as canonicalFormatNumberFixed,
  formatPercentSigned as canonicalFormatPercentSigned,
  formatDate as canonicalFormatDate,
  formatDateTime as canonicalFormatDateTime,
  formatHumanDateTime as canonicalFormatHumanDateTime,
} from '../app/ux/format';

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
  return canonicalFormatCurrency0(value, currency);
}

/**
 * Formata número simples
 */
export function formatNumber(value: number | null | undefined, decimals: number = 2): string {
  return canonicalFormatNumberFixed(value, decimals);
}

/**
 * Formata percentual com sinal
 */
export function formatPercent(value: number | null | undefined): string {
  return canonicalFormatPercentSigned(value, 2);
}

/**
 * Formata data ISO para formato brasileiro
 */
export function formatDate(isoDate: string | null | undefined): string {
  return canonicalFormatDate(isoDate);
}

/**
 * Formata data/hora ISO para formato brasileiro
 */
export function formatDateTime(isoDate: string | null | undefined): string {
  return canonicalFormatDateTime(isoDate);
}

/**
 * Formata data/hora em padrão institucional (local): "18 jan 2026, 11:03"
 */
export function formatHumanDateTime(isoDate: string | null | undefined): string {
  return canonicalFormatHumanDateTime(isoDate);
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
