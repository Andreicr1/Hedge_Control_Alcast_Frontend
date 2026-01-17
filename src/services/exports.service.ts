/**
 * Exports Service
 *
 * Frontend adapter for backend /exports endpoints.
 * - Manifest: read-only deterministic preview (no side effects)
 * - Create job: explicit trigger (financeiro/admin)
 * - Status: read-only
 * - Download: artifact download when ready
 */

import { api, endpoints, getAuthToken } from '../api';
import { getApiBaseUrl } from '../api/client';
import type { ExportJobCreate, ExportJobRead, ExportManifest } from '../types';

const API_BASE_URL = getApiBaseUrl();

export interface ExportManifestQuery {
  export_type?: string;
  as_of?: string | null;
  subject_type?: string | null;
  subject_id?: number | null;
}

function toIsoDateTimeOrNull(dateOnly: string | null | undefined): string | null | undefined {
  if (!dateOnly) return dateOnly;
  // Convert YYYY-MM-DD to a datetime acceptable by backend Optional[datetime]
  return `${dateOnly}T00:00:00`;
}

export async function getExportManifest(query: ExportManifestQuery): Promise<ExportManifest> {
  const sp = new URLSearchParams();

  if (query.export_type) sp.set('export_type', query.export_type);
  if (query.as_of) sp.set('as_of', toIsoDateTimeOrNull(query.as_of) as string);
  if (query.subject_type) sp.set('subject_type', query.subject_type);
  if (query.subject_id != null) sp.set('subject_id', String(query.subject_id));

  const qs = sp.toString();
  return api.get<ExportManifest>(`${endpoints.exports.manifest}${qs ? `?${qs}` : ''}`);
}

export async function createExportJob(payload: ExportJobCreate): Promise<ExportJobRead> {
  const body: ExportJobCreate = {
    ...payload,
    as_of: toIsoDateTimeOrNull(payload.as_of ?? null) ?? undefined,
  };
  return api.post<ExportJobRead>(endpoints.exports.create, body);
}

export async function getExportJob(exportId: string): Promise<ExportJobRead> {
  return api.get<ExportJobRead>(endpoints.exports.status(exportId));
}

export async function downloadExportArtifact(
  exportId: string,
  opts?: { filename?: string; kind?: string }
): Promise<Blob> {
  const token = getAuthToken() || localStorage.getItem('auth_token') || '';

  const sp = new URLSearchParams();
  if (opts?.filename) sp.set('filename', opts.filename);
  if (opts?.kind) sp.set('kind', opts.kind);
  const qs = sp.toString();

  const response = await fetch(`${API_BASE_URL}${endpoints.exports.download(exportId)}${qs ? `?${qs}` : ''}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const text = await response.text().catch(() => '');
    throw new Error(text || 'Erro ao baixar export');
  }

  return response.blob();
}

export default {
  getManifest: getExportManifest,
  createJob: createExportJob,
  getJob: getExportJob,
  download: downloadExportArtifact,
};
