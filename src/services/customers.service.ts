/**
 * Customers Service
 *
 * Clientes são usados no domínio de Vendas.
 */

import { api, endpoints } from '../api';
import type { Customer, CustomerCreate, CustomerUpdate } from '../types';

export async function listCustomers(): Promise<Customer[]> {
  return api.get<Customer[]>(endpoints.customers.list);
}

export async function getCustomer(id: number): Promise<Customer> {
  return api.get<Customer>(endpoints.customers.detail(id));
}

export async function createCustomer(data: CustomerCreate): Promise<Customer> {
  return api.post<Customer>(endpoints.customers.create, data);
}

export async function updateCustomer(id: number, data: CustomerUpdate): Promise<Customer> {
  return api.put<Customer>(endpoints.customers.update(id), data);
}

export async function deleteCustomer(id: number): Promise<void> {
  return api.delete(endpoints.customers.delete(id));
}

export default {
  list: listCustomers,
  get: getCustomer,
  create: createCustomer,
  update: updateCustomer,
  delete: deleteCustomer,
};
