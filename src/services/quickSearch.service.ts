/**
 * Quick Search Service (Shell Bar)
 *
 * Performs lightweight, server-side search across multiple entities.
 * Each endpoint is queried independently so permission errors (403)
 * do not break the overall search experience.
 */

import { api, endpoints } from '../api';
import type { Contract, Counterparty, Customer, Deal, Supplier } from '../types';

export type QuickSearchEntity =
  | 'customers'
  | 'counterparties'
  | 'suppliers'
  | 'contracts'
  | 'deals';

export type QuickSearchResults = {
  customers: Customer[];
  counterparties: Counterparty[];
  suppliers: Supplier[];
  contracts: Contract[];
  deals: Deal[];
};

function buildUrl(path: string, params: Record<string, string | number | undefined | null>): string {
  const searchParams = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === '') continue;
    searchParams.set(key, String(value));
  }
  const qs = searchParams.toString();
  return qs ? `${path}?${qs}` : path;
}

async function safeList<T>(url: string): Promise<T[]> {
  try {
    return await api.get<T[]>(url);
  } catch {
    return [];
  }
}

export function isQuickSearchEligible(raw: string): boolean {
  const q = raw.trim();
  if (!q) return false;

  const onlyDigits = /^[0-9]+$/.test(q);
  if (onlyDigits) return q.length >= 4;

  // letters/mixed: require at least 3 non-space chars
  const compact = q.replace(/\s+/g, '');
  return compact.length >= 3;
}

export async function quickSearchAll(q: string, limit: number = 6): Promise<QuickSearchResults> {
  const customersUrl = buildUrl(endpoints.customers.list, { q, limit });
  const counterpartiesUrl = buildUrl(endpoints.counterparties.list, { q, limit });
  const suppliersUrl = buildUrl(endpoints.suppliers.list, { q, limit });
  const contractsUrl = buildUrl(endpoints.contracts.list, { q, limit });
  const dealsUrl = buildUrl(endpoints.deals.list, { q, limit });

  const [customers, counterparties, suppliers, contracts, deals] = await Promise.all([
    safeList<Customer>(customersUrl),
    safeList<Counterparty>(counterpartiesUrl),
    safeList<Supplier>(suppliersUrl),
    safeList<Contract>(contractsUrl),
    safeList<Deal>(dealsUrl),
  ]);

  return { customers, counterparties, suppliers, contracts, deals };
}
