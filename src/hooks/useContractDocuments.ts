/**
 * useContractDocuments Hook
 *
 * Documentos do contrato operacional:
 * - Lista (auditoria)
 * - Upload de PDF assinado (rastreabilidade)
 */

import { useCallback, useEffect, useState } from 'react';
import { ApiError, ContractDocument } from '../types';
import {
  listContractDocuments,
  uploadContractDocument,
} from '../services/contractDocuments.service';

interface UseContractDocumentsState {
  documents: ContractDocument[];
  isLoading: boolean;
  isError: boolean;
  error: ApiError | null;
}

export function useContractDocuments(contractId: string | null) {
  const [state, setState] = useState<UseContractDocumentsState>({
    documents: [],
    isLoading: false,
    isError: false,
    error: null,
  });

  const fetchDocuments = useCallback(async () => {
    if (!contractId) {
      setState({ documents: [], isLoading: false, isError: false, error: null });
      return;
    }

    setState((prev) => ({ ...prev, isLoading: true, isError: false, error: null }));
    try {
      const docs = await listContractDocuments(contractId);
      setState({ documents: docs, isLoading: false, isError: false, error: null });
    } catch (err) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        isError: true,
        error: err as ApiError,
      }));
    }
  }, [contractId]);

  const upload = useCallback(
    async (file: File) => {
      if (!contractId) return;
      await uploadContractDocument(contractId, file);
      await fetchDocuments();
    },
    [contractId, fetchDocuments],
  );

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  return {
    ...state,
    refetch: fetchDocuments,
    upload,
  };
}
