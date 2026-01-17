/**
 * useDeals Hook
 * 
 * Deals e seus cálculos de P&L.
 * TODA lógica de cálculo está no backend.
 */

import { useState, useEffect, useCallback } from 'react';
import { getDeal, getDealPnl } from '../services/deals.service';
import { Deal, DealPnlResponse, ApiError } from '../types';

interface UseDealDetailState {
  deal: Deal | null;
  isLoading: boolean;
  isError: boolean;
  error: ApiError | null;
}

interface UseDealPnlState {
  pnl: DealPnlResponse | null;
  isLoading: boolean;
  isError: boolean;
  error: ApiError | null;
}

// ============================================
// useDealDetail - Detalhe de Deal
// ============================================
export function useDealDetail(dealId: number | null) {
  const [state, setState] = useState<UseDealDetailState>({
    deal: null,
    isLoading: false,
    isError: false,
    error: null,
  });

  const fetchDeal = useCallback(async () => {
    if (!dealId) {
      setState({ deal: null, isLoading: false, isError: false, error: null });
      return;
    }
    
    setState(prev => ({ ...prev, isLoading: true, isError: false, error: null }));
    try {
      const data = await getDeal(dealId);
      setState({ deal: data, isLoading: false, isError: false, error: null });
    } catch (err) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        isError: true,
        error: err as ApiError,
      }));
    }
  }, [dealId]);

  useEffect(() => {
    fetchDeal();
  }, [fetchDeal]);

  return {
    ...state,
    refetch: fetchDeal,
  };
}

// ============================================
// useDealPnl - P&L do Deal (calculado pelo backend)
// ============================================
export function useDealPnl(dealId: number | null) {
  const [state, setState] = useState<UseDealPnlState>({
    pnl: null,
    isLoading: false,
    isError: false,
    error: null,
  });

  const fetchPnl = useCallback(async () => {
    if (!dealId) {
      setState({ pnl: null, isLoading: false, isError: false, error: null });
      return;
    }
    
    setState(prev => ({ ...prev, isLoading: true, isError: false, error: null }));
    try {
      const data = await getDealPnl(dealId);
      setState({ pnl: data, isLoading: false, isError: false, error: null });
    } catch (err) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        isError: true,
        error: err as ApiError,
      }));
    }
  }, [dealId]);

  useEffect(() => {
    fetchPnl();
  }, [fetchPnl]);

  return {
    ...state,
    refetch: fetchPnl,
  };
}
