import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Contract, ContractDocument } from '../../../types';
import { useContractDocuments } from '../../../hooks/useContractDocuments';
import { fetchContractDocumentBlob } from '../../../services/contractDocuments.service';
import { FioriButton } from '../fiori/FioriButton';
import { LoadingState, ErrorState, EmptyState } from '../ui';
import { PdfViewerDialog } from '../documents/PdfViewerDialog';

function formatBytes(n: number | null | undefined): string {
  const v = Number(n || 0);
  if (!Number.isFinite(v) || v <= 0) return '—';
  const units = ['B', 'KB', 'MB', 'GB'];
  let idx = 0;
  let cur = v;
  while (cur >= 1024 && idx < units.length - 1) {
    cur /= 1024;
    idx += 1;
  }
  return `${cur.toFixed(idx === 0 ? 0 : 1)} ${units[idx]}`;
}

function safeDateLabel(iso: string | null | undefined): string {
  if (!iso) return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleString('pt-BR');
}

export interface ContractDocumentsPanelProps {
  contract: Contract;
}

function toInstitutionalError(err: unknown, action: 'upload' | 'view' | 'download'): string {
  const genericByAction: Record<'upload' | 'view' | 'download', string> = {
    upload: 'Não foi possível enviar o documento. Tente novamente.',
    view: 'Não foi possível abrir o documento. Tente novamente.',
    download: 'Não foi possível baixar o documento. Tente novamente.',
  };

  const statusCode = (() => {
    if (typeof err === 'object' && err) {
      const anyErr = err as any;
      if (typeof anyErr.status_code === 'number') return anyErr.status_code as number;
      if (typeof anyErr.status === 'number') return anyErr.status as number;
    }
    if (err instanceof Error) {
      const m = err.message || '';
      const match = m.match(/\bHTTP\s+(\d{3})\b/i);
      if (match) return Number(match[1]);
    }
    return null;
  })();

  if (statusCode === 401) return 'Sessão expirada. Entre novamente.';
  if (statusCode === 403) return 'Sem permissão para este documento.';
  if (statusCode === 404) return 'Documento não encontrado.';
  if (statusCode === 413) return 'Arquivo acima do limite. Reduza o tamanho e tente novamente.';
  if (statusCode === 415) return 'Tipo de arquivo não suportado. Envie um PDF.';
  if (statusCode === 422) return 'Documento inválido. Verifique o PDF e tente novamente.';

  if (typeof err === 'object' && err) {
    const anyErr = err as any;
    const detail = typeof anyErr.detail === 'string' ? anyErr.detail : null;
    if (detail && detail.trim()) return detail;
  }

  return genericByAction[action];
}

export function ContractDocumentsPanel({ contract }: ContractDocumentsPanelProps) {
  const contractId = contract.contract_id;

  const { documents, isLoading, isError, error, refetch, upload } = useContractDocuments(contractId);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [uploading, setUploading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerTitle, setViewerTitle] = useState('Documento');
  const [viewerUrl, setViewerUrl] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (viewerUrl) URL.revokeObjectURL(viewerUrl);
    };
  }, [viewerUrl]);

  const hasDocs = documents.length > 0;

  const handlePickFile = useCallback(() => {
    setLocalError(null);
    fileInputRef.current?.click();
  }, []);

  const handleUploadSelected = useCallback(
    async (file: File) => {
      setLocalError(null);

      const ct = String(file.type || '').toLowerCase();
      const name = String(file.name || '').toLowerCase();
      if (ct !== 'application/pdf' && !name.endsWith('.pdf')) {
        setLocalError('Formato inválido. Envie um PDF.');
        return;
      }

      const maxBytes = 25 * 1024 * 1024;
      if (file.size > maxBytes) {
        setLocalError('Arquivo acima de 25 MB.');
        return;
      }

      setUploading(true);
      try {
        await upload(file);
      } catch (err) {
        setLocalError(toInstitutionalError(err, 'upload'));
      } finally {
        setUploading(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    },
    [upload],
  );

  const handleView = useCallback(
    async (doc: ContractDocument) => {
      setLocalError(null);
      if (viewerUrl) URL.revokeObjectURL(viewerUrl);
      setViewerUrl(null);

      try {
        const blob = await fetchContractDocumentBlob(contractId, doc.id, 'view');
        const url = URL.createObjectURL(blob);
        setViewerTitle(`Contrato assinado • v${doc.version}`);
        setViewerUrl(url);
        setViewerOpen(true);
      } catch (err) {
        setLocalError(toInstitutionalError(err, 'view'));
      }
    },
    [contractId, viewerUrl],
  );

  const handleDownload = useCallback(
    async (doc: ContractDocument) => {
      setLocalError(null);
      try {
        const blob = await fetchContractDocumentBlob(contractId, doc.id, 'download');
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = doc.filename || `contrato_v${doc.version}.pdf`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
      } catch (err) {
        setLocalError(toInstitutionalError(err, 'download'));
      }
    },
    [contractId],
  );

  const rows = useMemo(() => {
    return documents
      .slice()
      .sort((a, b) => (b.version - a.version) || (b.id - a.id));
  }, [documents]);

  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <h3 className="font-['72:Bold',sans-serif] text-base text-[#131e29]">Documentos do Contrato</h3>
        </div>
        <div className="flex items-center gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf,.pdf"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) void handleUploadSelected(f);
            }}
          />
          <FioriButton variant="emphasized" onClick={handlePickFile} disabled={uploading}>
            {uploading ? 'Enviando…' : 'Anexar PDF'}
          </FioriButton>
          <FioriButton variant="ghost" onClick={refetch}>
            Atualizar
          </FioriButton>
        </div>
      </div>

      {localError && (
        <div className="mb-3 text-sm text-[var(--sapNegativeColor)]">{localError}</div>
      )}

      {isLoading ? (
        <LoadingState message="Carregando documentos..." />
      ) : isError ? (
        <ErrorState error={error} onRetry={refetch} />
      ) : !hasDocs ? (
        <EmptyState
          title="Nenhum documento"
          description="Anexe o PDF assinado."
        />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm border border-[var(--sapList_BorderColor)]">
            <thead className="bg-[var(--sapList_HeaderBackground)]">
              <tr>
                <th className="text-left px-3 py-2 font-['72:Bold',sans-serif] text-[var(--sapList_HeaderTextColor)]">Versão</th>
                <th className="text-left px-3 py-2 font-['72:Bold',sans-serif] text-[var(--sapList_HeaderTextColor)]">Arquivo</th>
                <th className="text-left px-3 py-2 font-['72:Bold',sans-serif] text-[var(--sapList_HeaderTextColor)]">Tamanho</th>
                <th className="text-left px-3 py-2 font-['72:Bold',sans-serif] text-[var(--sapList_HeaderTextColor)]">Upload</th>
                <th className="text-left px-3 py-2 font-['72:Bold',sans-serif] text-[var(--sapList_HeaderTextColor)]">Usuário</th>
                <th className="text-right px-3 py-2 font-['72:Bold',sans-serif] text-[var(--sapList_HeaderTextColor)]">Ações</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((doc) => {
                const uploadedBy = (doc.metadata_json as any)?.uploaded_by ?? '—';
                return (
                  <tr key={doc.id} className="border-t border-[var(--sapList_BorderColor)]">
                    <td className="px-3 py-2">v{doc.version}</td>
                    <td className="px-3 py-2">
                      <div className="font-['72:Bold',sans-serif] text-[#131e29] break-all">{doc.filename}</div>
                      {doc.sha256 && (
                        <div className="text-xs text-[var(--sapContent_LabelColor)] break-all">SHA-256: {doc.sha256}</div>
                      )}
                    </td>
                    <td className="px-3 py-2">{formatBytes(doc.file_size_bytes)}</td>
                    <td className="px-3 py-2">{safeDateLabel(doc.uploaded_at)}</td>
                    <td className="px-3 py-2">{String(uploadedBy)}</td>
                    <td className="px-3 py-2">
                      <div className="flex items-center justify-end gap-2">
                        <FioriButton variant="ghost" onClick={() => void handleView(doc)}>
                          Visualizar
                        </FioriButton>
                        <FioriButton variant="ghost" onClick={() => void handleDownload(doc)}>
                          Download
                        </FioriButton>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <PdfViewerDialog
        open={viewerOpen}
        onOpenChange={setViewerOpen}
        title={viewerTitle}
        fileUrl={viewerUrl}
      />
    </div>
  );
}
