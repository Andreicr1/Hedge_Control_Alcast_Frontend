/**
 * useContracts Hook
 * 
 * Contratos são SOMENTE LEITURA no frontend.
 * Criados automaticamente pelo backend ao premiar RFQ.
 */

import { useState, useEffect, useCallback } from 'react';
import {
  listContracts,
  getContract,
  getContractExposures,
  getContractsByRfq,
  getContractsByDeal,
} from '../services/contracts.service';
import { Contract, ContractExposureLink, ApiError } from '../types';

interface UseContractsState {
  contracts: Contract[];
  isLoading: boolean;
  isError: boolean;
  error: ApiError | null;
}

interface UseContractDetailState {
  contract: Contract | null;
  exposures: ContractExposureLink[];
  isLoading: boolean;
  isError: boolean;
  error: ApiError | null;
}

// ============================================
// useContracts - Lista de Contratos
// ============================================
export function useContracts(filters?: { rfq_id?: number; deal_id?: number }) {
  const [state, setState] = useState<UseContractsState>({
    contracts: [],
    isLoading: true,
    isError: false,
    error: null,
  });

  const fetchContracts = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, isError: false, error: null }));
    try {
      const data = await listContracts(filters);
      setState({ contracts: data, isLoading: false, isError: false, error: null });
    } catch (err) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        isError: true,
        error: err as ApiError,
      }));
    }
  }, [filters?.rfq_id, filters?.deal_id]);

  useEffect(() => {
    fetchContracts();
  }, [fetchContracts]);

  return {
    ...state,
    refetch: fetchContracts,
  };
}

// ============================================
// useContractDetail - Detalhe de Contrato
// ============================================
export function useContractDetail(contractId: string | null) {
  const [state, setState] = useState<UseContractDetailState>({
    contract: null,
    exposures: [],
    isLoading: false,
    isError: false,
    error: null,
  });

  const fetchContract = useCallback(async () => {
    if (!contractId) {
      setState({ contract: null, exposures: [], isLoading: false, isError: false, error: null });
      return;
    }
    
    setState(prev => ({ ...prev, isLoading: true, isError: false, error: null }));
    try {
      const [data, links] = await Promise.all([
        getContract(contractId),
        getContractExposures(contractId),
      ]);
      setState({
        contract: data,
        exposures: links,
        isLoading: false,
        isError: false,
        error: null,
      });
    } catch (err) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        isError: true,
        error: err as ApiError,
      }));
    }
  }, [contractId]);

  useEffect(() => {
    fetchContract();
  }, [fetchContract]);

  return {
    ...state,
    refetch: fetchContract,
  };
}

// ============================================
// useContractsByRfq - Contratos de uma RFQ
// ============================================
export function useContractsByRfq(rfqId: number | null) {
  const [state, setState] = useState<UseContractsState>({
    contracts: [],
    isLoading: false,
    isError: false,
    error: null,
  });

  const fetchContracts = useCallback(async () => {
    if (!rfqId) {
      setState({ contracts: [], isLoading: false, isError: false, error: null });
      return;
    }
    
    setState(prev => ({ ...prev, isLoading: true, isError: false, error: null }));
    try {
      const data = await getContractsByRfq(rfqId);
      setState({ contracts: data, isLoading: false, isError: false, error: null });
    } catch (err) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        isError: true,
        error: err as ApiError,
      }));
    }
  }, [rfqId]);

  useEffect(() => {
    fetchContracts();
  }, [fetchContracts]);

  return {
    ...state,
    refetch: fetchContracts,
  };
}

// ============================================
// useContractsByDeal - Contratos de um Deal
// ============================================
export function useContractsByDeal(dealId: number | null) {
  const [state, setState] = useState<UseContractsState>({
    contracts: [],
    isLoading: false,
    isError: false,
    error: null,
  });

  const fetchContracts = useCallback(async () => {
    if (!dealId) {
      setState({ contracts: [], isLoading: false, isError: false, error: null });
      return;
    }
    
    setState(prev => ({ ...prev, isLoading: true, isError: false, error: null }));
    try {
      const data = await getContractsByDeal(dealId);
      setState({ contracts: data, isLoading: false, isError: false, error: null });
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
    fetchContracts();
  }, [fetchContracts]);

  return {
    ...state,
    refetch: fetchContracts,
  };
}
