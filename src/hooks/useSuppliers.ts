/**
 * useSuppliers Hook
 *
 * CRUD completo de fornecedores.
 */

import { useCallback, useEffect, useState } from 'react';
import type { ApiError, Supplier, SupplierCreate, SupplierUpdate } from '../types';
import {
  createSupplier,
  deleteSupplier,
  listSuppliers,
  updateSupplier,
} from '../services/suppliers.service';

interface UseListState<T> {
  items: T[];
  isLoading: boolean;
  isError: boolean;
  error: ApiError | null;
}

interface UseMutationState {
  isLoading: boolean;
  isError: boolean;
  error: ApiError | null;
  isSuccess: boolean;
}

export function useSuppliers() {
  const [state, setState] = useState<UseListState<Supplier>>({
    items: [],
    isLoading: true,
    isError: false,
    error: null,
  });

  const refetch = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true, isError: false, error: null }));
    try {
      const data = await listSuppliers();
      setState({ items: data, isLoading: false, isError: false, error: null });
    } catch (err) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        isError: true,
        error: err as ApiError,
      }));
    }
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { ...state, refetch };
}

export function useCreateSupplier() {
  const [state, setState] = useState<UseMutationState>({
    isLoading: false,
    isError: false,
    error: null,
    isSuccess: false,
  });

  const mutate = useCallback(async (data: SupplierCreate): Promise<Supplier | null> => {
    setState({ isLoading: true, isError: false, error: null, isSuccess: false });
    try {
      const result = await createSupplier(data);
      setState({ isLoading: false, isError: false, error: null, isSuccess: true });
      return result;
    } catch (err) {
      setState({ isLoading: false, isError: true, error: err as ApiError, isSuccess: false });
      return null;
    }
  }, []);

  const reset = useCallback(() => {
    setState({ isLoading: false, isError: false, error: null, isSuccess: false });
  }, []);

  return { ...state, mutate, reset };
}

export function useUpdateSupplier() {
  const [state, setState] = useState<UseMutationState>({
    isLoading: false,
    isError: false,
    error: null,
    isSuccess: false,
  });

  const mutate = useCallback(async (id: number, data: SupplierUpdate): Promise<Supplier | null> => {
    setState({ isLoading: true, isError: false, error: null, isSuccess: false });
    try {
      const result = await updateSupplier(id, data);
      setState({ isLoading: false, isError: false, error: null, isSuccess: true });
      return result;
    } catch (err) {
      setState({ isLoading: false, isError: true, error: err as ApiError, isSuccess: false });
      return null;
    }
  }, []);

  const reset = useCallback(() => {
    setState({ isLoading: false, isError: false, error: null, isSuccess: false });
  }, []);

  return { ...state, mutate, reset };
}

export function useDeleteSupplier() {
  const [state, setState] = useState<UseMutationState>({
    isLoading: false,
    isError: false,
    error: null,
    isSuccess: false,
  });

  const mutate = useCallback(async (id: number): Promise<boolean> => {
    setState({ isLoading: true, isError: false, error: null, isSuccess: false });
    try {
      await deleteSupplier(id);
      setState({ isLoading: false, isError: false, error: null, isSuccess: true });
      return true;
    } catch (err) {
      setState({ isLoading: false, isError: true, error: err as ApiError, isSuccess: false });
      return false;
    }
  }, []);

  const reset = useCallback(() => {
    setState({ isLoading: false, isError: false, error: null, isSuccess: false });
  }, []);

  return { ...state, mutate, reset };
}
