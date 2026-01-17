/**
 * Contracts Service
 * 
 * Contratos são criados automaticamente pelo backend ao premiar RFQ.
 * 1 trade = 1 contrato.
 * 
 * O frontend apenas LEITURA e VISUALIZAÇÃO.
 */

import { api, endpoints } from '../api';
import { Contract, ContractExposureLink } from '../types';

// ============================================
// List Contracts
// ============================================
export async function listContracts(filters?: {
  rfq_id?: number;
  deal_id?: number;
}): Promise<Contract[]> {
  let url = endpoints.contracts.list;
  const params = new URLSearchParams();
  
  if (filters?.rfq_id) {
    params.append('rfq_id', filters.rfq_id.toString());
  }
  if (filters?.deal_id) {
    params.append('deal_id', filters.deal_id.toString());
  }
  
  if (params.toString()) {
    url += `?${params.toString()}`;
  }
  
  return api.get<Contract[]>(url);
}

// ============================================
// Get Contract by ID
// ============================================
export async function getContract(contractId: string): Promise<Contract> {
  return api.get<Contract>(endpoints.contracts.detail(contractId));
}

// ============================================
// Get Contract Exposure Allocations
// ============================================
export async function getContractExposures(contractId: string): Promise<ContractExposureLink[]> {
  return api.get<ContractExposureLink[]>(endpoints.contracts.exposures(contractId));
}

// ============================================
// Get Contracts by RFQ
// ============================================
export async function getContractsByRfq(rfqId: number): Promise<Contract[]> {
  return api.get<Contract[]>(endpoints.contracts.byRfq(rfqId));
}

// ============================================
// Get Contracts by Deal
// ============================================
export async function getContractsByDeal(dealId: number): Promise<Contract[]> {
  return api.get<Contract[]>(endpoints.contracts.byDeal(dealId));
}

// ============================================
// Helpers
// ============================================

/**
 * Extrai informações de legs do trade_snapshot
 */
export function extractTradeLegs(contract: Contract): {
  buyLeg: { price: number; volume_mt: number; price_type?: string } | null;
  sellLeg: { price: number; volume_mt: number; price_type?: string } | null;
  spread: number | null;
} {
  const snapshot = contract.trade_snapshot;
  const legs = (snapshot.legs as Array<{
    side: string;
    price: number;
    volume_mt: number;
    price_type?: string;
  }>) || [];
  
  const buyLeg = legs.find(l => l.side === 'buy');
  const sellLeg = legs.find(l => l.side === 'sell');
  
  let spread: number | null = null;
  if (buyLeg && sellLeg) {
    spread = buyLeg.price - sellLeg.price;
  }
  
  return {
    buyLeg: buyLeg
      ? { price: buyLeg.price, volume_mt: buyLeg.volume_mt, price_type: buyLeg.price_type }
      : null,
    sellLeg: sellLeg
      ? { price: sellLeg.price, volume_mt: sellLeg.volume_mt, price_type: sellLeg.price_type }
      : null,
    spread,
  };
}

/**
 * Calcula valor nocional do contrato
 */
export function calculateNotional(contract: Contract): number {
  const { buyLeg, sellLeg } = extractTradeLegs(contract);
  
  if (buyLeg && sellLeg) {
    // Para swaps, usar volume da leg de buy
    return buyLeg.price * buyLeg.volume_mt;
  }
  
  if (buyLeg) return buyLeg.price * buyLeg.volume_mt;
  if (sellLeg) return sellLeg.price * sellLeg.volume_mt;
  
  return 0;
}

export default {
  list: listContracts,
  get: getContract,
  exposures: getContractExposures,
  byRfq: getContractsByRfq,
  byDeal: getContractsByDeal,
};
