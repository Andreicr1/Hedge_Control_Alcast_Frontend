/**
 * Suppliers Service
 *
 * Fornecedores são usados no domínio de Compras.
 */

import { api, endpoints } from '../api';
import type { Supplier, SupplierCreate, SupplierUpdate } from '../types';

export async function listSuppliers(): Promise<Supplier[]> {
  return api.get<Supplier[]>(endpoints.suppliers.list);
}

export async function getSupplier(id: number): Promise<Supplier> {
  return api.get<Supplier>(endpoints.suppliers.detail(id));
}

export async function createSupplier(data: SupplierCreate): Promise<Supplier> {
  return api.post<Supplier>(endpoints.suppliers.create, data);
}

export async function updateSupplier(id: number, data: SupplierUpdate): Promise<Supplier> {
  return api.put<Supplier>(endpoints.suppliers.update(id), data);
}

export async function deleteSupplier(id: number): Promise<void> {
  return api.delete(endpoints.suppliers.delete(id));
}

export default {
  list: listSuppliers,
  get: getSupplier,
  create: createSupplier,
  update: updateSupplier,
  delete: deleteSupplier,
};
