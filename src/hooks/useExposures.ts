/**
 * useExposures Hook
 * 
 * Exposures são SOMENTE LEITURA no frontend.
 * Gerenciadas automaticamente pelo backend.
 */

import { useState, useEffect, useCallback } from 'react';
import { listExposures } from '../services/exposures.service';
import { Exposure, ApiError } from '../types';

interface UseExposuresState {
  exposures: Exposure[];
  isLoading: boolean;
  isError: boolean;
  error: ApiError | null;
}

// ============================================
// useExposures - Lista de Exposições
// ============================================
export function useExposures() {
  const [state, setState] = useState<UseExposuresState>({
    exposures: [],
    isLoading: true,
    isError: false,
    error: null,
  });

  const fetchExposures = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, isError: false, error: null }));
    try {
      const data = await listExposures();
      setState({ exposures: data, isLoading: false, isError: false, error: null });
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
    fetchExposures();
  }, [fetchExposures]);

  return {
    ...state,
    refetch: fetchExposures,
  };
}
