/**
 * useCounterparties Hook
 * 
 * CRUD completo de counterparties.
 */

import { useState, useEffect, useCallback } from 'react';
import {
  listCounterparties,
  getCounterparty,
  createCounterparty,
  updateCounterparty,
  deleteCounterparty,
} from '../services/counterparties.service';
import { Counterparty, CounterpartyCreate, CounterpartyUpdate, ApiError } from '../types';

interface UseCounterpartiesState {
  counterparties: Counterparty[];
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

// ============================================
// useCounterparties - Lista
// ============================================
export function useCounterparties() {
  const [state, setState] = useState<UseCounterpartiesState>({
    counterparties: [],
    isLoading: true,
    isError: false,
    error: null,
  });

  const fetchCounterparties = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, isError: false, error: null }));
    try {
      const data = await listCounterparties();
      setState({ counterparties: data, isLoading: false, isError: false, error: null });
    } catch (err) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        isError: true,
        error: err as ApiError,
      }));
    }
  }, []);

  useEffect(() => {
    fetchCounterparties();
  }, [fetchCounterparties]);

  return {
    ...state,
    refetch: fetchCounterparties,
  };
}

// ============================================
// useCreateCounterparty
// ============================================
export function useCreateCounterparty() {
  const [state, setState] = useState<UseMutationState>({
    isLoading: false,
    isError: false,
    error: null,
    isSuccess: false,
  });

  const mutate = useCallback(async (data: CounterpartyCreate): Promise<Counterparty | null> => {
    setState({ isLoading: true, isError: false, error: null, isSuccess: false });
    try {
      const result = await createCounterparty(data);
      setState({ isLoading: false, isError: false, error: null, isSuccess: true });
      return result;
    } catch (err) {
      setState({
        isLoading: false,
        isError: true,
        error: err as ApiError,
        isSuccess: false,
      });
      return null;
    }
  }, []);

  const reset = useCallback(() => {
    setState({ isLoading: false, isError: false, error: null, isSuccess: false });
  }, []);

  return { ...state, mutate, reset };
}

// ============================================
// useUpdateCounterparty
// ============================================
export function useUpdateCounterparty() {
  const [state, setState] = useState<UseMutationState>({
    isLoading: false,
    isError: false,
    error: null,
    isSuccess: false,
  });

  const mutate = useCallback(async (id: number, data: CounterpartyUpdate): Promise<Counterparty | null> => {
    setState({ isLoading: true, isError: false, error: null, isSuccess: false });
    try {
      const result = await updateCounterparty(id, data);
      setState({ isLoading: false, isError: false, error: null, isSuccess: true });
      return result;
    } catch (err) {
      setState({
        isLoading: false,
        isError: true,
        error: err as ApiError,
        isSuccess: false,
      });
      return null;
    }
  }, []);

  const reset = useCallback(() => {
    setState({ isLoading: false, isError: false, error: null, isSuccess: false });
  }, []);

  return { ...state, mutate, reset };
}

// ============================================
// useDeleteCounterparty
// ============================================
export function useDeleteCounterparty() {
  const [state, setState] = useState<UseMutationState>({
    isLoading: false,
    isError: false,
    error: null,
    isSuccess: false,
  });

  const mutate = useCallback(async (id: number): Promise<boolean> => {
    setState({ isLoading: true, isError: false, error: null, isSuccess: false });
    try {
      await deleteCounterparty(id);
      setState({ isLoading: false, isError: false, error: null, isSuccess: true });
      return true;
    } catch (err) {
      setState({
        isLoading: false,
        isError: true,
        error: err as ApiError,
        isSuccess: false,
      });
      return false;
    }
  }, []);

  const reset = useCallback(() => {
    setState({ isLoading: false, isError: false, error: null, isSuccess: false });
  }, []);

  return { ...state, mutate, reset };
}
