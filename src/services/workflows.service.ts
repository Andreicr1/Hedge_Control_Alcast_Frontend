/**
 * Workflows Service (T3 approvals)
 *
 * Endpoints:
 * - GET  /workflows/requests
 * - GET  /workflows/requests/{id}
 * - POST /workflows/requests/{id}/decisions
 */

import { api, endpoints } from '../api';
import type {
  WorkflowDecisionCreate,
  WorkflowDecisionRead,
  WorkflowRequestRead,
} from '../types';

export interface ListWorkflowRequestsParams {
  status?: string;
  action?: string;
  required_role?: string;
  limit?: number;
}

export async function listWorkflowRequests(
  params: ListWorkflowRequestsParams = {},
): Promise<WorkflowRequestRead[]> {
  const searchParams = new URLSearchParams();

  if (params.status) searchParams.set('status', params.status);
  if (params.action) searchParams.set('action', params.action);
  if (params.required_role) searchParams.set('required_role', params.required_role);
  if (typeof params.limit === 'number') searchParams.set('limit', String(params.limit));

  const qs = searchParams.toString();
  const url = qs ? `${endpoints.workflows.requests}?${qs}` : endpoints.workflows.requests;

  return api.get<WorkflowRequestRead[]>(url);
}

export async function getWorkflowRequest(workflowRequestId: number): Promise<WorkflowRequestRead> {
  return api.get<WorkflowRequestRead>(endpoints.workflows.requestDetail(workflowRequestId));
}

export async function createWorkflowDecision(
  workflowRequestId: number,
  data: WorkflowDecisionCreate,
): Promise<WorkflowDecisionRead> {
  return api.post<WorkflowDecisionRead>(endpoints.workflows.decisions(workflowRequestId), data);
}

export default {
  listWorkflowRequests,
  getWorkflowRequest,
  createWorkflowDecision,
};
