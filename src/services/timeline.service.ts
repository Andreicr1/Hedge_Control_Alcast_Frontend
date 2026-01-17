/**
 * Timeline Service
 *
 * Reads:
 * - GET /timeline (per-subject)
 * - GET /timeline/recent (global feed)
 *
 * Human collaboration (T1):
 * - POST /timeline/human/comments
 * - POST /timeline/human/comments/corrections
 * - POST /timeline/human/attachments (event)
 * - POST /timeline/human/attachments/upload (file)
 * - GET  /timeline/human/attachments/{event_id}/download
 */

import { api, endpoints } from '../api';
import { TimelineEvent } from '../types';

export type TimelineVisibility = 'all' | 'finance';

export interface HumanCommentCreatePayload {
  subject_type: string;
  subject_id: number;
  body: string;
  visibility?: TimelineVisibility;
  idempotency_key?: string;
  mentions?: string[];
  attachments?: Array<Record<string, unknown>>;
  meta?: Record<string, unknown>;
}

export interface HumanCommentCorrectionPayload {
  supersedes_event_id: number;
  body: string;
  idempotency_key?: string;
  mentions?: string[];
  attachments?: Array<Record<string, unknown>>;
  meta?: Record<string, unknown>;
}

export interface HumanAttachmentUploadResponse {
  file_id: string;
  file_name: string;
  mime: string;
  size: number;
  checksum: string;
  storage_uri: string;
}

export interface HumanAttachmentCreatePayload {
  subject_type: string;
  subject_id: number;
  file_id: string;
  file_name: string;
  mime: string;
  size: number;
  checksum?: string;
  storage_uri: string;
  visibility?: TimelineVisibility;
  idempotency_key?: string;
  meta?: Record<string, unknown>;
}

function buildQuery(params: Record<string, string | number | boolean | undefined | null>): string {
  const entries = Object.entries(params).filter(([, v]) => v !== undefined && v !== null);
  if (entries.length === 0) return '';

  const search = new URLSearchParams();
  for (const [k, v] of entries) {
    search.set(k, String(v));
  }
  return `?${search.toString()}`;
}

export interface ListTimelineParams {
  subject_type: string;
  subject_id: number;
  limit?: number;
  before?: string; // ISO datetime
}

export async function listTimeline(params: ListTimelineParams): Promise<TimelineEvent[]> {
  const query = buildQuery({
    subject_type: params.subject_type,
    subject_id: params.subject_id,
    limit: params.limit,
    before: params.before,
  });
  return api.get<TimelineEvent[]>(`${endpoints.timeline.list}${query}`);
}

export async function listRecentTimeline(limit?: number): Promise<TimelineEvent[]> {
  const query = buildQuery({ limit });
  return api.get<TimelineEvent[]>(`${endpoints.timeline.recent}${query}`);
}

export async function createHumanComment(payload: HumanCommentCreatePayload): Promise<TimelineEvent> {
  return api.post<TimelineEvent>(endpoints.timeline.humanCommentCreate, {
    ...payload,
    visibility: payload.visibility ?? 'all',
  });
}

export async function correctHumanComment(payload: HumanCommentCorrectionPayload): Promise<TimelineEvent> {
  return api.post<TimelineEvent>(endpoints.timeline.humanCommentCorrect, payload);
}

export async function uploadHumanAttachment(
  file: File,
  visibility: TimelineVisibility = 'all'
): Promise<HumanAttachmentUploadResponse> {
  const form = new FormData();
  form.append('file', file);
  form.append('visibility', visibility);
  return api.postForm<HumanAttachmentUploadResponse>(endpoints.timeline.humanAttachmentUpload, form);
}

export async function createHumanAttachmentEvent(payload: HumanAttachmentCreatePayload): Promise<TimelineEvent> {
  return api.post<TimelineEvent>(endpoints.timeline.humanAttachmentCreate, {
    ...payload,
    visibility: payload.visibility ?? 'all',
  });
}

function filenameFromContentDisposition(value: string | null): string | null {
  if (!value) return null;
  const m = /filename\*=UTF-8''([^;]+)|filename="?([^";]+)"?/i.exec(value);
  const raw = m?.[1] || m?.[2];
  if (!raw) return null;
  try {
    return decodeURIComponent(raw);
  } catch {
    return raw;
  }
}

export async function downloadHumanAttachment(eventId: number): Promise<{ blob: Blob; filename: string | null }> {
  const res = await api.getBlob(endpoints.timeline.humanAttachmentDownload(eventId));
  const blob = await res.blob();
  const filename = filenameFromContentDisposition(res.headers.get('Content-Disposition'));
  return { blob, filename };
}

export default {
  list: listTimeline,
  recent: listRecentTimeline,
  createHumanComment,
  correctHumanComment,
  uploadHumanAttachment,
  createHumanAttachmentEvent,
  downloadHumanAttachment,
};
