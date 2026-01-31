import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Contract, ContractDocument } from '../../../types';
import { useContractDocuments } from '../../../hooks/useContractDocuments';
import { fetchContractDocumentBlob } from '../../../services/contractDocuments.service';
import { PdfViewerDialog } from '../documents/PdfViewerDialog';

import { FioriBusyText, FioriErrorRetryBlock, FioriHeaderCard } from '../fiori';

import {
  AnalyticalTable,
  Button,
  FlexBox,
  FlexBoxDirection,
  IllustratedMessage,
  MessageStrip,
  Text,
  Toolbar,
  ToolbarSpacer,
} from '@ui5/webcomponents-react';
import { formatDateTimeFromDate, formatNumberFixedNoGrouping } from '../../ux/format';

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
  return `${formatNumberFixedNoGrouping(cur, idx === 0 ? 0 : 1, 'en-US')} ${units[idx]}`;
}

function safeDateLabel(iso: string | null | undefined): string {
  if (!iso) return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '—';
  return formatDateTimeFromDate(d, 'pt-BR');
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

  const tableData = useMemo(() => {
    return rows.map((doc) => {
      const uploadedBy = (doc.metadata_json as any)?.uploaded_by ?? '—';
      return {
        id: doc.id,
        version: `v${doc.version}`,
        filename: doc.filename,
        sha256: doc.sha256,
        size: formatBytes(doc.file_size_bytes),
        uploadedAt: safeDateLabel(doc.uploaded_at),
        uploadedBy: String(uploadedBy),
        _doc: doc,
      };
    });
  }, [rows]);

  return (
    <FioriHeaderCard title="Documentos do Contrato">
      <Toolbar style={{ marginBottom: '0.75rem' }}>
        <Text style={{ opacity: 0.75 }}>Repositório central (PDF)</Text>
        <ToolbarSpacer />
        <input
          ref={fileInputRef}
          type="file"
          accept="application/pdf,.pdf"
          style={{ display: 'none' }}
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) void handleUploadSelected(f);
          }}
        />
        <FlexBox direction={FlexBoxDirection.Row} style={{ gap: '0.5rem' }}>
          <Button design="Emphasized" onClick={handlePickFile} disabled={uploading}>
            {uploading ? 'Enviando…' : 'Anexar PDF'}
          </Button>
          <Button design="Transparent" onClick={refetch} disabled={isLoading}>
            Atualizar
          </Button>
        </FlexBox>
      </Toolbar>

      {localError ? (
        <MessageStrip design="Negative" style={{ marginBottom: '0.75rem' }}>
          {localError}
        </MessageStrip>
      ) : null}

      {isLoading ? (
        <div>
          <FioriBusyText message="Carregando documentos…" />
        </div>
      ) : isError ? (
        <div>
          <FioriErrorRetryBlock message="Falha ao carregar documentos." onRetry={refetch} />
        </div>
      ) : !hasDocs ? (
        <IllustratedMessage name="NoData" titleText="Nenhum documento" subtitleText="Anexe o PDF assinado." />
      ) : (
        <AnalyticalTable
          columns={[
            { Header: 'Versão', accessor: 'version' },
            { Header: 'Arquivo', accessor: 'filename' },
            { Header: 'Tamanho', accessor: 'size' },
            { Header: 'Upload', accessor: 'uploadedAt' },
            { Header: 'Usuário', accessor: 'uploadedBy' },
            {
              Header: 'Ações',
              accessor: 'actions',
              Cell: ({ row }: any) => {
                const doc: ContractDocument = row.original._doc;
                return (
                  <FlexBox direction={FlexBoxDirection.Row} style={{ gap: '0.5rem' }}>
                    <Button design="Transparent" onClick={() => void handleView(doc)}>
                      Visualizar
                    </Button>
                    <Button design="Transparent" onClick={() => void handleDownload(doc)}>
                      Download
                    </Button>
                  </FlexBox>
                );
              },
            },
          ]}
          data={tableData}
          alternateRowColor
          visibleRows={Math.min(tableData.length, 8)}
          minRows={Math.min(tableData.length, 8)}
          style={{ width: '100%' }}
        />
      )}

      <PdfViewerDialog open={viewerOpen} onOpenChange={setViewerOpen} title={viewerTitle} fileUrl={viewerUrl} />
    </FioriHeaderCard>
  );
}
