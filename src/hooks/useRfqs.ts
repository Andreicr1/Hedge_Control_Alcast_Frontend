/**
 * useRfqs Hook
 * 
 * Hook de gerenciamento de estado para RFQs.
 * Encapsula loading, error, cache e mutations.
 */

import { useState, useEffect, useCallback } from 'react';
import {
  listRfqs,
  getRfq,
  createRfq,
  updateRfq,
  sendRfq,
  awardQuote,
  cancelRfq,
  addQuoteToRfq,
  previewRfq,
  listSendAttempts,
  sendRfqWithTracking,
} from '../services/rfqs.service';
import {
  Rfq,
  RfqCreate,
  RfqUpdate,
  RfqAwardRequest,
  RfqQuoteCreate,
  RfqQuote,
  RfqPreviewRequest,
  RfqPreviewResponse,
  RfqSendAttempt,
  RfqSendAttemptCreate,
  ApiError,
} from '../types';

interface UseRfqsState {
  rfqs: Rfq[];
  isLoading: boolean;
  isError: boolean;
  error: ApiError | null;
}

interface UseRfqDetailState {
  rfq: Rfq | null;
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
// useRfqs - Lista de RFQs
// ============================================
export function useRfqs() {
  const [state, setState] = useState<UseRfqsState>({
    rfqs: [],
    isLoading: true,
    isError: false,
    error: null,
  });

  const fetchRfqs = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, isError: false, error: null }));
    try {
      const data = await listRfqs();
      setState({ rfqs: data, isLoading: false, isError: false, error: null });
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
    fetchRfqs();
  }, [fetchRfqs]);

  return {
    ...state,
    refetch: fetchRfqs,
  };
}

// ============================================
// useRfqDetail - Detalhe de RFQ
// ============================================
export function useRfqDetail(rfqId: number | null) {
  const [state, setState] = useState<UseRfqDetailState>({
    rfq: null,
    isLoading: false,
    isError: false,
    error: null,
  });

  const fetchRfq = useCallback(async () => {
    if (!rfqId) {
      setState({ rfq: null, isLoading: false, isError: false, error: null });
      return;
    }
    
    setState(prev => ({ ...prev, isLoading: true, isError: false, error: null }));
    try {
      const data = await getRfq(rfqId);
      setState({ rfq: data, isLoading: false, isError: false, error: null });
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
    fetchRfq();
  }, [fetchRfq]);

  return {
    ...state,
    refetch: fetchRfq,
  };
}

// ============================================
// useCreateRfq - Criar RFQ
// ============================================
export function useCreateRfq() {
  const [state, setState] = useState<UseMutationState>({
    isLoading: false,
    isError: false,
    error: null,
    isSuccess: false,
  });

  const mutate = useCallback(async (data: RfqCreate): Promise<Rfq | null> => {
    setState({ isLoading: true, isError: false, error: null, isSuccess: false });
    try {
      const result = await createRfq(data);
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
// useUpdateRfq - Atualizar RFQ
// ============================================
export function useUpdateRfq() {
  const [state, setState] = useState<UseMutationState>({
    isLoading: false,
    isError: false,
    error: null,
    isSuccess: false,
  });

  const mutate = useCallback(async (rfqId: number, data: RfqUpdate): Promise<Rfq | null> => {
    setState({ isLoading: true, isError: false, error: null, isSuccess: false });
    try {
      const result = await updateRfq(rfqId, data);
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
// useSendRfq - Enviar RFQ
// ============================================
export function useSendRfq() {
  const [state, setState] = useState<UseMutationState>({
    isLoading: false,
    isError: false,
    error: null,
    isSuccess: false,
  });

  const mutate = useCallback(async (rfqId: number): Promise<Rfq | null> => {
    setState({ isLoading: true, isError: false, error: null, isSuccess: false });
    try {
      const result = await sendRfq(rfqId);
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
// useAwardQuote - Premiar cotação
// ============================================
export function useAwardQuote() {
  const [state, setState] = useState<UseMutationState>({
    isLoading: false,
    isError: false,
    error: null,
    isSuccess: false,
  });

  const mutate = useCallback(async (rfqId: number, data: RfqAwardRequest): Promise<Rfq | null> => {
    setState({ isLoading: true, isError: false, error: null, isSuccess: false });
    try {
      const result = await awardQuote(rfqId, data);
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
// useCancelRfq - Cancelar RFQ
// ============================================
export function useCancelRfq() {
  const [state, setState] = useState<UseMutationState>({
    isLoading: false,
    isError: false,
    error: null,
    isSuccess: false,
  });

  const mutate = useCallback(async (rfqId: number, motivo: string): Promise<Rfq | null> => {
    setState({ isLoading: true, isError: false, error: null, isSuccess: false });
    try {
      const result = await cancelRfq(rfqId, motivo);
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
// useAddQuote - Adicionar cotação
// ============================================
export function useAddQuote() {
  const [state, setState] = useState<UseMutationState>({
    isLoading: false,
    isError: false,
    error: null,
    isSuccess: false,
  });

  const mutate = useCallback(async (rfqId: number, data: RfqQuoteCreate): Promise<RfqQuote | null> => {
    setState({ isLoading: true, isError: false, error: null, isSuccess: false });
    try {
      const result = await addQuoteToRfq(rfqId, data);
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
// useRfqSendAttempts - Histórico de tentativas
// ============================================
interface UseRfqSendAttemptsState {
  attempts: RfqSendAttempt[];
  isLoading: boolean;
  isError: boolean;
  error: ApiError | null;
}

export function useRfqSendAttempts(rfqId: number | null) {
  const [state, setState] = useState<UseRfqSendAttemptsState>({
    attempts: [],
    isLoading: false,
    isError: false,
    error: null,
  });

  const fetchAttempts = useCallback(async () => {
    if (!rfqId) {
      setState({ attempts: [], isLoading: false, isError: false, error: null });
      return;
    }

    setState(prev => ({ ...prev, isLoading: true, isError: false, error: null }));
    try {
      const data = await listSendAttempts(rfqId);
      setState({ attempts: data, isLoading: false, isError: false, error: null });
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
    fetchAttempts();
  }, [fetchAttempts]);

  return { ...state, refetch: fetchAttempts };
}

// ============================================
// useSendRfqWithTracking - Enviar com tracking
// ============================================
export function useSendRfqWithTracking() {
  const [state, setState] = useState<UseMutationState>({
    isLoading: false,
    isError: false,
    error: null,
    isSuccess: false,
  });

  const mutate = useCallback(async (
    rfqId: number, 
    data: RfqSendAttemptCreate
  ): Promise<RfqSendAttempt | null> => {
    setState({ isLoading: true, isError: false, error: null, isSuccess: false });
    try {
      const result = await sendRfqWithTracking(rfqId, data);
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
// useRfqPreview - Gerar preview de mensagem RFQ
// ============================================
interface UseRfqPreviewState {
  preview: RfqPreviewResponse | null;
  isLoading: boolean;
  isError: boolean;
  error: ApiError | null;
}

export function useRfqPreview() {
  const [state, setState] = useState<UseRfqPreviewState>({
    preview: null,
    isLoading: false,
    isError: false,
    error: null,
  });

  const generatePreview = useCallback(async (data: RfqPreviewRequest): Promise<RfqPreviewResponse | null> => {
    setState(prev => ({ ...prev, isLoading: true, isError: false, error: null }));
    try {
      const result = await previewRfq(data);
      setState({ preview: result, isLoading: false, isError: false, error: null });
      return result;
    } catch (err) {
      setState({
        preview: null,
        isLoading: false,
        isError: true,
        error: err as ApiError,
      });
      return null;
    }
  }, []);

  const reset = useCallback(() => {
    setState({ preview: null, isLoading: false, isError: false, error: null });
  }, []);

  return { ...state, generatePreview, reset };
}
