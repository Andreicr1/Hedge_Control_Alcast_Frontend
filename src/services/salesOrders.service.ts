/**
 * Sales Orders Service
 */

import { api, endpoints } from '../api';
import { SalesOrder, SalesOrderCreate, SalesOrderUpdate } from '../types';

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
// List Sales Orders
// ============================================
export async function listSalesOrders(): Promise<SalesOrder[]> {
  return api.get<SalesOrder[]>(endpoints.salesOrders.list);
}

export interface ListSalesOrdersQuery {
  deal_id?: number;
}

export async function listSalesOrdersQuery(query: ListSalesOrdersQuery = {}): Promise<SalesOrder[]> {
  const qs = toQueryString({ deal_id: query.deal_id });
  return api.get<SalesOrder[]>(`${endpoints.salesOrders.list}${qs}`);
}

// ============================================
// Get Sales Order by ID
// ============================================
export async function getSalesOrder(id: number): Promise<SalesOrder> {
  return api.get<SalesOrder>(endpoints.salesOrders.detail(id));
}

// ============================================
// Create Sales Order
// ============================================
export async function createSalesOrder(data: SalesOrderCreate): Promise<SalesOrder> {
  return api.post<SalesOrder>(endpoints.salesOrders.create, data);
}

// ============================================
// Update Sales Order
// ============================================
export async function updateSalesOrder(id: number, data: SalesOrderUpdate): Promise<SalesOrder> {
  return api.put<SalesOrder>(endpoints.salesOrders.update(id), data);
}

// ============================================
// Delete Sales Order
// ============================================
export async function deleteSalesOrder(id: number): Promise<void> {
  return api.delete(endpoints.salesOrders.delete(id));
}

export default {
  list: listSalesOrders,
  listQuery: listSalesOrdersQuery,
  get: getSalesOrder,
  create: createSalesOrder,
  update: updateSalesOrder,
  delete: deleteSalesOrder,
};
