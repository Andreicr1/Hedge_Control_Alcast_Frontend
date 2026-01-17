/**
 * Inbox / Financeiro Workbench Service
 *
 * Guardrails:
 * - Inbox is a view over backend data
 * - Decisions are audit-only (no side effects in domain)
 */

import { api, endpoints } from '../api';
import type {
  InboxWorkbenchResponse,
  Exposure,
  InboxDecisionCreate,
  InboxDecisionRead,
} from '../types';

export async function getInboxWorkbench(): Promise<InboxWorkbenchResponse> {
  return api.get<InboxWorkbenchResponse>(endpoints.inbox.workbench);
}

export async function getInboxExposureDetail(exposureId: number): Promise<Exposure> {
  return api.get<Exposure>(endpoints.inbox.exposureDetail(exposureId));
}

export async function listInboxDecisions(exposureId: number): Promise<InboxDecisionRead[]> {
  return api.get<InboxDecisionRead[]>(endpoints.inbox.exposureDecisions(exposureId));
}

export async function createInboxDecision(
  exposureId: number,
  data: InboxDecisionCreate,
): Promise<InboxDecisionRead> {
  return api.post<InboxDecisionRead>(endpoints.inbox.exposureDecisions(exposureId), data);
}
