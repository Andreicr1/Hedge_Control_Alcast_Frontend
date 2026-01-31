/**
 * Exposures Service
 * 
 * Exposures representam riscos de mercado derivados de SO/PO.
 * - SO → Exposure ACTIVE (risco de queda de preço)
 * - PO → Exposure PASSIVE (risco de alta de preço)
 * 
 * O backend calcula e gerencia o status das exposições.
 */

import { api, endpoints } from '../api';
import { Exposure, ExposureType, ExposureStatus } from '../types';
import { formatMonthYearLongLocal } from '../app/ux/format';

// ============================================
// List Exposures
// ============================================
export async function listExposures(): Promise<Exposure[]> {
  return api.get<Exposure[]>(endpoints.exposures.list);
}

// ============================================
// Helpers
// ============================================

/**
 * Agrupa exposures por tipo
 */
export function groupByType(exposures: Exposure[]): {
  active: Exposure[];
  passive: Exposure[];
} {
  return {
    active: exposures.filter(e => e.exposure_type === ExposureType.ACTIVE),
    passive: exposures.filter(e => e.exposure_type === ExposureType.PASSIVE),
  };
}

/**
 * Agrupa exposures por status
 */
export function groupByStatus(exposures: Exposure[]): Record<ExposureStatus, Exposure[]> {
  return {
    [ExposureStatus.OPEN]: exposures.filter(e => e.status === ExposureStatus.OPEN),
    [ExposureStatus.PARTIALLY_HEDGED]: exposures.filter(e => e.status === ExposureStatus.PARTIALLY_HEDGED),
    [ExposureStatus.HEDGED]: exposures.filter(e => e.status === ExposureStatus.HEDGED),
    [ExposureStatus.CLOSED]: exposures.filter(e => e.status === ExposureStatus.CLOSED),
  };
}

/**
 * Calcula total de exposição aberta por tipo
 */
export function calculateOpenExposure(exposures: Exposure[]): {
  active: number;
  passive: number;
  net: number;
} {
  const openExposures = exposures.filter(
    e => e.status === ExposureStatus.OPEN || e.status === ExposureStatus.PARTIALLY_HEDGED
  );
  
  let active = 0;
  let passive = 0;
  
  for (const exp of openExposures) {
    if (exp.exposure_type === ExposureType.ACTIVE) {
      active += exp.quantity_mt;
    } else {
      passive += exp.quantity_mt;
    }
  }
  
  return {
    active,
    passive,
    net: active - passive,
  };
}

/**
 * Retorna exposures que têm tarefas de hedge pendentes
 */
export function getExposuresWithPendingTasks(exposures: Exposure[]): Exposure[] {
  return exposures.filter(e => 
    e.tasks?.some(t => t.status === 'pending' || t.status === 'in_progress')
  );
}

/**
 * Agrupa exposures por mês de maturidade
 */
export function groupExposuresByMonth(exposures: Exposure[]): Record<string, Exposure[]> {
  const grouped: Record<string, Exposure[]> = {};
  
  for (const exp of exposures) {
    const date = exp.maturity_date ? new Date(exp.maturity_date) : null;
    const key = date 
      ? formatMonthYearLongLocal(date, 'pt-BR')
      : 'Sem data';
    
    if (!grouped[key]) {
      grouped[key] = [];
    }
    grouped[key].push(exp);
  }
  
  return grouped;
}

/**
 * Agrupa exposures por status (para visualização)
 */
export function groupExposuresByStatus(exposures: Exposure[]): Record<string, Exposure[]> {
  const grouped: Record<string, Exposure[]> = {};
  
  for (const exp of exposures) {
    const key = exp.status || 'unknown';
    if (!grouped[key]) {
      grouped[key] = [];
    }
    grouped[key].push(exp);
  }
  
  return grouped;
}

export default {
  list: listExposures,
};
