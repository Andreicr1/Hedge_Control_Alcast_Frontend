/**
 * Exports Page - Integrated
 *
 * Exposes backend /exports endpoints with controlled UX:
 * - Everyone (financeiro/auditoria) can view manifest + status + download.
 * - Only financeiro/admin can create (trigger) export jobs.
 */

import { useMemo, useState } from 'react';
import { useAuthContext } from '../components/AuthProvider';
import { ErrorState, LoadingState } from '../components/ui';
import { Icon } from '@ui5/webcomponents-react';
import { FioriButton } from '../components/fiori/FioriButton';
import { FioriInput } from '../components/fiori/FioriInput';
import { FioriSelect } from '../components/fiori/FioriSelect';
import type { ExportJobCreate } from '../../types';
import { useCreateExportJob, useExportDownload, useExportJob, useExportManifest } from '../../hooks/useExports';
import { UX_COPY, formatRoleLabel } from '../ux/copy';
import { formatNumberFixedNoGrouping } from '../ux/format';
import { canCreateExportJob } from '../auth/accessPolicy';

function formatReportStatus(status: string | null | undefined): string {
  const s = String(status || '').toLowerCase();
  if (!s) return '—';
  if (s === 'done') return 'Concluído';
  if (s === 'pending') return 'Em processamento';
  if (s === 'running') return 'Em processamento';
  if (s === 'failed') return 'Não concluído';
  if (s === 'error') return 'Não concluído';
  return status || '—';
}

function saveBlob(blob: Blob, filename: string) {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);
}

async function copyToClipboard(text: string) {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    const ta = document.createElement('textarea');
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    ta.remove();
  }
}

function formatBytes(bytes: number | null | undefined): string {
  if (typeof bytes !== 'number' || Number.isNaN(bytes)) return '—';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${formatNumberFixedNoGrouping(bytes / 1024, 1, 'en-US')} KB`;
  return `${formatNumberFixedNoGrouping(bytes / (1024 * 1024), 1, 'en-US')} MB`;
}

export function ExportsPageIntegrated() {
  const { user } = useAuthContext();
  const canCreate = canCreateExportJob(user?.role);

  const [exportType, setExportType] = useState('chain_export');
  const [asOf, setAsOf] = useState<string>('');
  const [subjectType, setSubjectType] = useState<string>('');
  const [subjectId, setSubjectId] = useState<string>('');

  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const [appliedQuery, setAppliedQuery] = useState<{
    export_type: string;
    as_of?: string | null;
    subject_type?: string | null;
    subject_id?: number | null;
  } | null>(null);

  const manifest = useExportManifest(
    appliedQuery
      ? {
          export_type: appliedQuery.export_type,
          as_of: appliedQuery.as_of ?? null,
          subject_type: appliedQuery.subject_type ?? null,
          subject_id: appliedQuery.subject_id ?? null,
        }
      : null
  );

  const createJob = useCreateExportJob();

  const [exportIdLookup, setExportIdLookup] = useState<string>('');

  const effectiveExportId = useMemo(() => {
    // prefer manifest export_id (computed) if present, else manual lookup
    const fromManifest = manifest.manifest?.export_id;
    if (fromManifest && typeof fromManifest === 'string') return fromManifest;
    return exportIdLookup.trim() || null;
  }, [manifest.manifest, exportIdLookup]);

  const job = useExportJob(effectiveExportId);
  const dl = useExportDownload();

  const artifacts = useMemo(() => {
    const list = job.job?.status === 'done' ? (job.job?.artifacts ?? []) : [];
    return Array.isArray(list) ? list : [];
  }, [job.job]);

  const handleApply = () => {
    const next = {
      export_type: exportType.trim() || 'chain_export',
      as_of: asOf.trim() || null,
      subject_type: subjectType.trim() || null,
      subject_id: subjectId.trim() ? Number(subjectId) : null,
    };
    setAppliedQuery(next);
  };

  const handleCreate = async () => {
    const asOfValue = appliedQuery?.as_of ?? (asOf.trim() ? asOf.trim() : null);
    const subjectTypeValue = appliedQuery?.subject_type ?? (subjectType.trim() ? subjectType.trim() : null);

    const payload: ExportJobCreate = {
      export_type: (appliedQuery?.export_type || exportType || 'chain_export').trim(),
      as_of: asOfValue,
      subject_type: subjectTypeValue,
      subject_id: appliedQuery?.subject_id ?? (subjectId.trim() ? Number(subjectId) : null),
    };

    const created = await createJob.mutate(payload);
    if (created?.export_id) {
      setExportIdLookup(created.export_id);
    }
  };

  const handleDownload = async () => {
    if (!effectiveExportId) return;

    const first = artifacts[0] as Record<string, unknown> | undefined;
    const filename = typeof first?.filename === 'string' ? first.filename : `${effectiveExportId}.zip`;

    const blob = await dl.download(effectiveExportId, {
      filename: typeof first?.filename === 'string' ? first.filename : undefined,
      kind: typeof first?.kind === 'string' ? first.kind : undefined,
    });
    if (!blob) return;
    saveBlob(blob, filename);
  };

  const handleDownloadArtifact = async (a: Record<string, unknown>) => {
    if (!effectiveExportId) return;

    const filename = typeof a.filename === 'string' ? a.filename : `${effectiveExportId}.bin`;
    const blob = await dl.download(effectiveExportId, {
      filename: typeof a.filename === 'string' ? a.filename : undefined,
      kind: typeof a.kind === 'string' ? a.kind : undefined,
    });
    if (!blob) return;
    saveBlob(blob, filename);
  };

  const handleCopy = async (key: string, value: string) => {
    await copyToClipboard(value);
    setCopiedKey(key);
    window.setTimeout(() => {
      setCopiedKey((prev) => (prev === key ? null : prev));
    }, 900);
  };

  if (manifest.isLoading && !manifest.manifest && appliedQuery) {
    return <LoadingState message="Carregando escopo do relatório..." fullPage />;
  }

  if (manifest.isError) {
    return <ErrorState error={manifest.error} onRetry={manifest.refetch} fullPage />;
  }

  return (
    <div className="sap-fiori-page p-4">
      {/* Header */}
      <div className="bg-[var(--sapPageHeader_Background)] border-b border-[var(--sapPageHeader_BorderColor)] -mx-4 -mt-4 px-4 py-4 mb-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-['72:Bold',sans-serif] text-xl text-[var(--sapTextColor,#131e29)]">{UX_COPY.pages.reports.title}</h1>
            <p className="text-sm text-[var(--sapContent_LabelColor,#556b82)] mt-1">{UX_COPY.pages.reports.subtitle}</p>
          </div>
          <FioriButton variant="ghost" icon="refresh" onClick={() => {
            manifest.refetch();
            job.refetch();
          }}>
            Atualizar
          </FioriButton>
        </div>
      </div>

      {/* Configuração do relatório */}
      <div className="bg-[var(--sapGroup_ContentBackground)] border border-[var(--sapGroup_ContentBorderColor)] rounded p-4 mb-4">
        <div className="flex items-center gap-2 mb-3">
          <Icon name="search" style={{ width: '1rem', height: '1rem', color: 'var(--sapContent_LabelColor,#556b82)' }} />
          <div className="font-['72:Bold',sans-serif] text-sm text-[var(--sapTextColor,#131e29)]">{UX_COPY.pages.reports.sections.configuration}</div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          <FioriSelect
            label="Tipo de relatório"
            value={exportType}
            onChange={(e) => setExportType(e.target.value)}
            fullWidth
            options={[
              { value: 'chain_export', label: 'Relatório consolidado' },
              { value: 'state_at_time', label: 'Posição em data-base' },
              { value: 'audit_log', label: 'Registro de auditoria' },
            ]}
          />
          <FioriInput label="Data-base" type="date" value={asOf} onChange={(e) => setAsOf(e.target.value)} fullWidth />
          <FioriInput label="Tipo de referência" value={subjectType} onChange={(e) => setSubjectType(e.target.value)} fullWidth />
          <FioriInput label="Código de referência" value={subjectId} onChange={(e) => setSubjectId(e.target.value)} fullWidth />

          <div className="flex items-end gap-2">
            <FioriButton variant="emphasized" icon="document" onClick={handleApply}>
              {UX_COPY.pages.reports.buttons.viewScope}
            </FioriButton>
            {canCreate && (
              <FioriButton variant="default" onClick={handleCreate} disabled={createJob.isLoading}>
                {UX_COPY.pages.reports.buttons.generate}
              </FioriButton>
            )}
          </div>
        </div>

        {!canCreate && (
          <div className="mt-3 text-xs text-[var(--sapContent_LabelColor,#556b82)]">
            Você tem acesso de visualização. Para gerar relatórios, é necessário perfil {formatRoleLabel('financeiro')}.
          </div>
        )}
      </div>

      {/* Acompanhar relatório */}
      <div className="bg-[var(--sapGroup_ContentBackground)] border border-[var(--sapGroup_ContentBorderColor)] rounded p-4 mb-4">
        <div className="flex items-center gap-2 mb-3">
          <Icon name="search" style={{ width: '1rem', height: '1rem', color: 'var(--sapContent_LabelColor,#556b82)' }} />
          <div className="font-['72:Bold',sans-serif] text-sm text-[var(--sapTextColor,#131e29)]">{UX_COPY.pages.reports.sections.tracking}</div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
          <FioriInput
            label="Código do relatório"
            value={exportIdLookup}
            onChange={(e) => setExportIdLookup(e.target.value)}
            fullWidth
          />
          <FioriButton variant="default" onClick={() => job.refetch()}>{UX_COPY.pages.reports.buttons.viewStatus}</FioriButton>
          <FioriButton
            variant="emphasized"
            icon="download"
            onClick={handleDownload}
            disabled={!effectiveExportId || job.job?.status !== 'done' || dl.isLoading}
          >
            {UX_COPY.pages.reports.buttons.download}
          </FioriButton>
        </div>

        {job.isError && (
          <div className="mt-3">
            <ErrorState error={job.error} onRetry={job.refetch} />
          </div>
        )}

        {createJob.isError && (
          <div className="mt-3">
            <ErrorState error={createJob.error} onRetry={handleCreate} />
          </div>
        )}

        {dl.error && (
          <div className="mt-3">
            <ErrorState error={dl.error} onRetry={handleDownload} />
          </div>
        )}

        <div className="mt-3 text-sm text-[var(--sapContent_LabelColor,#556b82)]">
          <div>
            Código do relatório: <span className="font-['72:Bold',sans-serif]">{effectiveExportId || '—'}</span>
          </div>
          <div>
            Situação: <span className="font-['72:Bold',sans-serif]">{formatReportStatus(job.job?.status)}</span>
          </div>
        </div>

        {job.job?.status === 'done' && artifacts.length > 0 && (
          <div className="mt-4">
            <div className="font-['72:Bold',sans-serif] text-sm text-[var(--sapTextColor,#131e29)] mb-2">Arquivos do relatório</div>
            <div className="space-y-2">
              {artifacts.map((a, idx) => {
                const rec = a as Record<string, unknown>;
                const name = typeof rec.filename === 'string' ? rec.filename : `artifact_${idx}`;
                const sizeBytes = typeof rec.size_bytes === 'number' ? rec.size_bytes : null;

                return (
                  <div key={`${name}_${idx}`} className="flex items-center justify-between gap-3 border border-gray-200 rounded px-3 py-2 bg-white">
                    <div className="min-w-0">
                      <div className="text-sm text-[var(--sapTextColor,#131e29)] truncate">
                        <span className="font-mono">{name}</span>
                      </div>
                      <div className="text-xs text-[var(--sapContent_LabelColor,#556b82)] truncate">
                        Tamanho: <span className="font-['72:Bold',sans-serif]">{formatBytes(sizeBytes)}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <FioriButton variant="default" onClick={() => handleDownloadArtifact(rec)} disabled={dl.isLoading}>
                        Baixar arquivo
                      </FioriButton>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Escopo do relatório */}
      {manifest.manifest && (
        <div className="bg-[var(--sapGroup_ContentBackground)] border border-[var(--sapGroup_ContentBorderColor)] rounded p-4">
          <div className="flex items-center justify-between gap-3 mb-3">
            <div className="flex items-center gap-2">
              <Icon name="document" style={{ width: '1rem', height: '1rem', color: 'var(--sapContent_LabelColor,#556b82)' }} />
              <div className="font-['72:Bold',sans-serif] text-sm text-[var(--sapTextColor,#131e29)]">{UX_COPY.pages.reports.buttons.viewScope}</div>
            </div>
            <FioriButton
              variant="ghost"
              icon={copiedKey === 'report_code' ? 'accept' : 'copy'}
              onClick={() => handleCopy('report_code', String(manifest.manifest?.export_id ?? ''))}
            >
              Copiar código
            </FioriButton>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="border border-gray-200 rounded bg-white p-3">
              <div className="text-xs text-[var(--sapContent_LabelColor,#556b82)]">Código do relatório</div>
              <div className="flex items-center justify-between gap-2">
                <div className="font-['72:Bold',sans-serif] text-sm break-all">{manifest.manifest.export_id}</div>
                <FioriButton
                  variant="ghost"
                  icon={copiedKey === 'export_id' ? 'accept' : 'copy'}
                  onClick={() => handleCopy('export_id', String(manifest.manifest?.export_id ?? ''))}
                />
              </div>
            </div>

            <div className="border border-gray-200 rounded bg-white p-3">
              <div className="text-xs text-[var(--sapContent_LabelColor,#556b82)]">Gerado em</div>
              <div className="text-sm">{String(manifest.manifest.gerado_em || '—')}</div>
            </div>
          </div>

          <div className="mt-3 text-sm text-[var(--sapContent_LabelColor,#556b82)]">
            <div>Data-base: <span className="font-['72:Bold',sans-serif]">{String(manifest.manifest.as_of || '—')}</span></div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ExportsPageIntegrated;
