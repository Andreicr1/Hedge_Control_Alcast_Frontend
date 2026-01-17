/**
 * useCustomers Hook
 *
 * CRUD completo de clientes.
 */

import { useCallback, useEffect, useState } from 'react';
import type { ApiError, Customer, CustomerCreate, CustomerUpdate } from '../types';
import {
  createCustomer,
  deleteCustomer,
  listCustomers,
  updateCustomer,
} from '../services/customers.service';

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

export function useCustomers() {
  const [state, setState] = useState<UseListState<Customer>>({
    items: [],
    isLoading: true,
    isError: false,
    error: null,
  });

  const refetch = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true, isError: false, error: null }));
    try {
      const data = await listCustomers();
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

export function useCreateCustomer() {
  const [state, setState] = useState<UseMutationState>({
    isLoading: false,
    isError: false,
    error: null,
    isSuccess: false,
  });

  const mutate = useCallback(async (data: CustomerCreate): Promise<Customer | null> => {
    setState({ isLoading: true, isError: false, error: null, isSuccess: false });
    try {
      const result = await createCustomer(data);
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

export function useUpdateCustomer() {
  const [state, setState] = useState<UseMutationState>({
    isLoading: false,
    isError: false,
    error: null,
    isSuccess: false,
  });

  const mutate = useCallback(async (id: number, data: CustomerUpdate): Promise<Customer | null> => {
    setState({ isLoading: true, isError: false, error: null, isSuccess: false });
    try {
      const result = await updateCustomer(id, data);
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

export function useDeleteCustomer() {
  const [state, setState] = useState<UseMutationState>({
    isLoading: false,
    isError: false,
    error: null,
    isSuccess: false,
  });

  const mutate = useCallback(async (id: number): Promise<boolean> => {
    setState({ isLoading: true, isError: false, error: null, isSuccess: false });
    try {
      await deleteCustomer(id);
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
