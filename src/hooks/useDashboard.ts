/**
 * useDashboard Hooks
 *
 * Hooks para consumir APIs canônicas do backend.
 *
 * Observação de governança: superfícies legacy como /api/market/*, /api/prices/*, /api/live
 * não devem existir no frontend.
 */

import { useState, useEffect, useCallback } from 'react';
import {
  getSettlementsToday,
  getSettlementsUpcoming,
  getDashboardSummary,
} from '../services/dashboard.service';
import { 
  SettlementItem,
  DashboardSummary,
  ApiError,
} from '../types';
// ============================================
// useSettlementsToday - Vencimentos do dia
// ============================================

interface UseSettlementsState {
  data: SettlementItem[];
  isLoading: boolean;
  isError: boolean;
  error: ApiError | null;
}

export function useSettlementsToday() {
  const [state, setState] = useState<UseSettlementsState>({
    data: [],
    isLoading: true,
    isError: false,
    error: null,
  });

  const fetchSettlements = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, isError: false, error: null }));
    try {
      const data = await getSettlementsToday();
      setState({ data, isLoading: false, isError: false, error: null });
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
    fetchSettlements();
  }, [fetchSettlements]);

  return { ...state, refetch: fetchSettlements };
}

// ============================================
// useSettlementsUpcoming - Próximos vencimentos
// ============================================

export function useSettlementsUpcoming(limit: number = 10) {
  const [state, setState] = useState<UseSettlementsState>({
    data: [],
    isLoading: true,
    isError: false,
    error: null,
  });

  const fetchSettlements = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, isError: false, error: null }));
    try {
      const data = await getSettlementsUpcoming(limit);
      setState({ data, isLoading: false, isError: false, error: null });
    } catch (err) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        isError: true,
        error: err as ApiError,
      }));
    }
  }, [limit]);

  useEffect(() => {
    fetchSettlements();
  }, [fetchSettlements]);

  return { ...state, refetch: fetchSettlements };
}

// ============================================
// useDashboard - Hook composto (compatibilidade)
// ============================================

interface UseDashboardState {
  data: DashboardSummary | null;
  isLoading: boolean;
  isError: boolean;
  error: ApiError | null;
}

export function useDashboard() {
  const [state, setState] = useState<UseDashboardState>({
    data: null,
    isLoading: true,
    isError: false,
    error: null,
  });

  const fetchDashboard = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, isError: false, error: null }));
    try {
      const data = await getDashboardSummary();
      setState({ data, isLoading: false, isError: false, error: null });
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
    fetchDashboard();
  }, [fetchDashboard]);

  // Auto-refresh every 5 minutes
  useEffect(() => {
    const interval = setInterval(fetchDashboard, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchDashboard]);

  return { ...state, refetch: fetchDashboard };
}
