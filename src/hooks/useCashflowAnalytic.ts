/**
 * useCashflowAnalytic Hook
 *
 * Mirrors backend GET /cashflow/analytic.
 * Frontend must only aggregate/sum amounts, never infer valuation.
 */

import { useCallback, useEffect, useMemo, useState } from 'react';
import type { ApiError, CashFlowLine, CashflowAnalyticQueryParams } from '../types';
import { getCashflowAnalytic } from '../services/cashflow.service';

interface UseCashflowAnalyticState {
  data: CashFlowLine[] | null;
  isLoading: boolean;
  isError: boolean;
  error: ApiError | null;
}

export function useCashflowAnalytic(params: CashflowAnalyticQueryParams | null) {
  const normalizedParams = params ?? null;

  const [state, setState] = useState<UseCashflowAnalyticState>({
    data: null,
    isLoading: true,
    isError: false,
    error: null,
  });

  const queryKey = useMemo(() => JSON.stringify(normalizedParams ?? {}), [normalizedParams]);

  const fetchLines = useCallback(async () => {
    if (!normalizedParams) {
      setState({ data: null, isLoading: false, isError: false, error: null });
      return;
    }
    setState((prev) => ({ ...prev, isLoading: true, isError: false, error: null }));
    try {
      const data = await getCashflowAnalytic(normalizedParams);
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
    fetchLines();
  }, [fetchLines]);

  return {
    ...state,
    refetch: fetchLines,
  };
}

export default useCashflowAnalytic;
