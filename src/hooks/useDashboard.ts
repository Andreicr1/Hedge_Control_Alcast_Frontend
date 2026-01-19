/**
 * useDashboard Hooks
 * 
 * Hooks para consumir APIs reais do backend:
 * - useAluminumQuote - Cotação atual
 * - useAluminumHistory - Histórico de preços
 * - useSettlementsToday - Vencimentos do dia
 * - useSettlementsUpcoming - Próximos vencimentos
 * - useDashboard - Composto (para compatibilidade)
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { 
  getAluminumQuote, 
  getAluminumHistory, 
  getSettlementsToday,
  getSettlementsUpcoming,
  getDashboardSummary,
} from '../services/dashboard.service';
import { 
  AluminumQuote, 
  AluminumHistoryPoint, 
  SettlementItem,
  DashboardSummary,
  ApiError,
} from '../types';

// ============================================
// useAluminumQuote - Cotação atual do alumínio
// ============================================

interface UseAluminumQuoteState {
  data: AluminumQuote | null;
  isLoading: boolean;
  isError: boolean;
  error: ApiError | null;
}

export function useAluminumQuote() {
  const [state, setState] = useState<UseAluminumQuoteState>({
    data: null,
    isLoading: true,
    isError: false,
    error: null,
  });

  const suspendAutoRefreshRef = useRef(false);

  const fetchQuoteInternal = useCallback(async (showLoading: boolean) => {
    if (showLoading) {
      setState(prev => ({ ...prev, isLoading: true, isError: false, error: null }));
    } else {
      setState(prev => ({ ...prev, isError: false, error: null }));
    }

    try {
      const data = await getAluminumQuote();

      const isUnavailable =
        (data?.cash?.price ?? null) === null && (data?.three_month?.price ?? null) === null;
      suspendAutoRefreshRef.current = isUnavailable;

      setState({ data, isLoading: false, isError: false, error: null });
    } catch (err) {
      const apiErr = err as ApiError;
      // Backend may return 404 when market data isn't available yet.
      // Treat as empty state (institutional UX) and avoid hammering the endpoint.
      if (apiErr?.status_code === 404) {
        suspendAutoRefreshRef.current = true;
        setState({ data: null, isLoading: false, isError: false, error: null });
        return;
      }
      setState(prev => ({
        ...prev,
        isLoading: false,
        isError: true,
        error: err as ApiError,
      }));
    }
  }, []);

  const fetchQuote = useCallback(async () => {
    await fetchQuoteInternal(true);
  }, [fetchQuoteInternal]);

  useEffect(() => {
    fetchQuote();
  }, [fetchQuote]);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (suspendAutoRefreshRef.current) return;
      void fetchQuoteInternal(false);
    }, 30 * 1000);
    return () => clearInterval(interval);
  }, [fetchQuoteInternal]);

  return { ...state, refetch: fetchQuote };
}

// ============================================
// useAluminumHistory - Histórico de preços
// ============================================

interface UseAluminumHistoryState {
  data: AluminumHistoryPoint[];
  isLoading: boolean;
  isError: boolean;
  error: ApiError | null;
}

export function useAluminumHistory(range: '7d' | '30d' | '1y' = '30d') {
  const [state, setState] = useState<UseAluminumHistoryState>({
    data: [],
    isLoading: true,
    isError: false,
    error: null,
  });

  const fetchHistory = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, isError: false, error: null }));
    try {
      const data = await getAluminumHistory(range);
      setState({ data, isLoading: false, isError: false, error: null });
    } catch (err) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        isError: true,
        error: err as ApiError,
      }));
    }
  }, [range]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  return { ...state, refetch: fetchHistory };
}

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
