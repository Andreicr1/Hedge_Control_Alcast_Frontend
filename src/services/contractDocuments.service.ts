/**
 * Contract Documents Service
 *
 * Documentos do contrato operacional:
 * - Upload/consulta de PDF assinado (rastreabilidade)
 * - Vínculo por contract_id
 */

import { api, endpoints } from '../api';
import { ContractDocument } from '../types';

export async function listContractDocuments(contractId: string): Promise<ContractDocument[]> {
  return api.get<ContractDocument[]>(endpoints.contracts.documents.list(contractId));
}

export async function uploadContractDocument(
  contractId: string,
  file: File,
): Promise<ContractDocument> {
  const form = new FormData();
  form.append('file', file);
  return api.postForm<ContractDocument>(endpoints.contracts.documents.upload(contractId), form);
}

export async function fetchContractDocumentBlob(
  contractId: string,
  documentId: number,
  mode: 'view' | 'download' = 'view',
): Promise<Blob> {
  const endpoint =
    mode === 'download'
      ? endpoints.contracts.documents.download(contractId, documentId)
      : endpoints.contracts.documents.view(contractId, documentId);

  const res = await api.getBlob(endpoint);
  if (!res.ok) {
    // Reuse standard error handling in api.get by calling json handler.
    // We don't have direct access here; fall back to a generic error.
    throw new Error(`HTTP ${res.status}`);
  }
  return res.blob();
}
