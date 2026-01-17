/**
 * Counterparties Service
 * 
 * Contrapartes são bancos e brokers que participam de RFQs.
 */

import { api, endpoints } from '../api';
import { Counterparty, CounterpartyCreate, CounterpartyUpdate, KycPreflightResponse } from '../types';

// ============================================
// List Counterparties
// ============================================
export async function listCounterparties(): Promise<Counterparty[]> {
  return api.get<Counterparty[]>(endpoints.counterparties.list);
}

// ============================================
// Get Counterparty by ID
// ============================================
export async function getCounterparty(id: number): Promise<Counterparty> {
  return api.get<Counterparty>(endpoints.counterparties.detail(id));
}

// ============================================
// Create Counterparty
// ============================================
export async function createCounterparty(data: CounterpartyCreate): Promise<Counterparty> {
  return api.post<Counterparty>(endpoints.counterparties.create, data);
}

// ============================================
// Update Counterparty
// ============================================
export async function updateCounterparty(id: number, data: CounterpartyUpdate): Promise<Counterparty> {
  return api.put<Counterparty>(endpoints.counterparties.update(id), data);
}

// ============================================
// Delete Counterparty
// ============================================
export async function deleteCounterparty(id: number): Promise<void> {
  return api.delete(endpoints.counterparties.delete(id));
}

// ============================================
// KYC Preflight (read-only)
// ============================================
export async function getCounterpartyKycPreflight(id: number): Promise<KycPreflightResponse> {
  return api.get<KycPreflightResponse>(endpoints.counterparties.kycPreflight(id));
}

// ============================================
// Helpers
// ============================================

/**
 * Filtra counterparties ativos
 */
export function filterActiveCounterparties(counterparties: Counterparty[]): Counterparty[] {
  return counterparties.filter(cp => cp.active);
}

/**
 * Agrupa counterparties por tipo
 */
export function groupByType(counterparties: Counterparty[]): {
  banks: Counterparty[];
  brokers: Counterparty[];
} {
  return {
    banks: counterparties.filter(cp => cp.type === 'bank'),
    brokers: counterparties.filter(cp => cp.type === 'broker'),
  };
}

export default {
  list: listCounterparties,
  get: getCounterparty,
  create: createCounterparty,
  update: updateCounterparty,
  delete: deleteCounterparty,
  kycPreflight: getCounterpartyKycPreflight,
};
