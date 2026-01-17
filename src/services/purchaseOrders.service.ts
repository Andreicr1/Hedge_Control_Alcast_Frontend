/**
 * Purchase Orders Service
 */

import { api, endpoints } from '../api';
import { PurchaseOrder, PurchaseOrderCreate, PurchaseOrderUpdate } from '../types';

function toQueryString(query: Record<string, string | number | undefined>): string {
  const params = new URLSearchParams();
  Object.entries(query).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return;
    params.set(key, String(value));
  });
  const qs = params.toString();
  return qs ? `?${qs}` : '';
}

// ============================================
// List Purchase Orders
// ============================================
export async function listPurchaseOrders(): Promise<PurchaseOrder[]> {
  return api.get<PurchaseOrder[]>(endpoints.purchaseOrders.list);
}

export interface ListPurchaseOrdersQuery {
  deal_id?: number;
}

export async function listPurchaseOrdersQuery(
  query: ListPurchaseOrdersQuery = {}
): Promise<PurchaseOrder[]> {
  const qs = toQueryString({ deal_id: query.deal_id });
  return api.get<PurchaseOrder[]>(`${endpoints.purchaseOrders.list}${qs}`);
}

// ============================================
// Get Purchase Order by ID
// ============================================
export async function getPurchaseOrder(id: number): Promise<PurchaseOrder> {
  return api.get<PurchaseOrder>(endpoints.purchaseOrders.detail(id));
}

// ============================================
// Create Purchase Order
// ============================================
export async function createPurchaseOrder(data: PurchaseOrderCreate): Promise<PurchaseOrder> {
  return api.post<PurchaseOrder>(endpoints.purchaseOrders.create, data);
}

// ============================================
// Update Purchase Order
// ============================================
export async function updatePurchaseOrder(id: number, data: PurchaseOrderUpdate): Promise<PurchaseOrder> {
  return api.put<PurchaseOrder>(endpoints.purchaseOrders.update(id), data);
}

// ============================================
// Delete Purchase Order
// ============================================
export async function deletePurchaseOrder(id: number): Promise<void> {
  return api.delete(endpoints.purchaseOrders.delete(id));
}

export default {
  list: listPurchaseOrders,
  listQuery: listPurchaseOrdersQuery,
  get: getPurchaseOrder,
  create: createPurchaseOrder,
  update: updatePurchaseOrder,
  delete: deletePurchaseOrder,
};
