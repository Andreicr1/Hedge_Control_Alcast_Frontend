import { useCallback, useEffect, useMemo, useState } from 'react';
import type {
  ApiError,
  WorkflowDecisionCreate,
  WorkflowDecisionRead,
  WorkflowRequestRead,
} from '../types';
import {
  createWorkflowDecision,
  getWorkflowRequest,
  listWorkflowRequests,
  type ListWorkflowRequestsParams,
} from '../services/workflows.service';

interface UseWorkflowRequestsState {
  requests: WorkflowRequestRead[];
  isLoading: boolean;
  isError: boolean;
  error: ApiError | null;
}

export function useWorkflowRequests(params: ListWorkflowRequestsParams) {
  const stableParams = useMemo(
    () => ({
      status: params.status,
      action: params.action,
      required_role: params.required_role,
      limit: params.limit,
    }),
    [params.status, params.action, params.required_role, params.limit],
  );

  const [state, setState] = useState<UseWorkflowRequestsState>({
    requests: [],
    isLoading: true,
    isError: false,
    error: null,
  });

  const fetchAll = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true, isError: false, error: null }));
    try {
      const data = await listWorkflowRequests(stableParams);
      setState({ requests: data, isLoading: false, isError: false, error: null });
    } catch (err) {
      setState({ requests: [], isLoading: false, isError: true, error: err as ApiError });
    }
  }, [stableParams]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  return { ...state, refetch: fetchAll };
}

interface UseWorkflowRequestState {
  request: WorkflowRequestRead | null;
  isLoading: boolean;
  isError: boolean;
  error: ApiError | null;
}

export function useWorkflowRequest(workflowRequestId: number | null) {
  const [state, setState] = useState<UseWorkflowRequestState>({
    request: null,
    isLoading: false,
    isError: false,
    error: null,
  });

  const fetchOne = useCallback(async () => {
    if (!workflowRequestId) {
      setState({ request: null, isLoading: false, isError: false, error: null });
      return;
    }

    setState((prev) => ({ ...prev, isLoading: true, isError: false, error: null }));
    try {
      const data = await getWorkflowRequest(workflowRequestId);
      setState({ request: data, isLoading: false, isError: false, error: null });
    } catch (err) {
      setState({ request: null, isLoading: false, isError: true, error: err as ApiError });
    }
  }, [workflowRequestId]);

  useEffect(() => {
    fetchOne();
  }, [fetchOne]);

  const submitDecision = useCallback(
    async (data: WorkflowDecisionCreate): Promise<WorkflowDecisionRead | null> => {
      if (!workflowRequestId) return null;
      const created = await createWorkflowDecision(workflowRequestId, data);
      await fetchOne();
      return created;
    },
    [workflowRequestId, fetchOne],
  );

  return { ...state, refetch: fetchOne, submitDecision };
}
