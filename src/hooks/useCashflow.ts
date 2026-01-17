/**
 * useCashflow Hook (read-only v0)
 *
 * Mirrors backend GET /cashflow without semantic drift.
 */

import { useCallback, useEffect, useMemo, useState } from 'react';
import type { ApiError, CashflowQueryParams, CashflowResponse } from '../types';
import { getCashflow } from '../services/cashflow.service';

interface UseCashflowState {
  data: CashflowResponse | null;
  isLoading: boolean;
  isError: boolean;
  error: ApiError | null;
}

export function useCashflow(params: CashflowQueryParams) {
  const [state, setState] = useState<UseCashflowState>({
    data: null,
    isLoading: true,
    isError: false,
    error: null,
  });

  const queryKey = useMemo(() => JSON.stringify(params ?? {}), [params]);

  const fetchCashflow = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true, isError: false, error: null }));
    try {
      const data = await getCashflow(params);
      setState({ data, isLoading: false, isError: false, error: null });
    } catch (err) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        isError: true,
        error: err as ApiError,
      }));
    }
  }, [queryKey]);

  useEffect(() => {
    fetchCashflow();
  }, [fetchCashflow]);

  return {
    ...state,
    refetch: fetchCashflow,
  };
}

export default useCashflow;
