import { useCallback, useEffect, useState } from 'react';
import type {
  ApiError,
  InboxWorkbenchResponse,
  InboxDecisionCreate,
  InboxDecisionRead,
  Exposure,
} from '../types';
import {
  getInboxWorkbench,
  getInboxExposureDetail,
  listInboxDecisions,
  createInboxDecision,
} from '../services/inbox.service';

interface UseInboxWorkbenchState {
  workbench: InboxWorkbenchResponse | null;
  isLoading: boolean;
  isError: boolean;
  error: ApiError | null;
}

export function useInboxWorkbench() {
  const [state, setState] = useState<UseInboxWorkbenchState>({
    workbench: null,
    isLoading: true,
    isError: false,
    error: null,
  });

  const fetchWorkbench = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, isError: false, error: null }));
    try {
      const data = await getInboxWorkbench();
      setState({ workbench: data, isLoading: false, isError: false, error: null });
    } catch (err) {
      setState({ workbench: null, isLoading: false, isError: true, error: err as ApiError });
    }
  }, []);

  useEffect(() => {
    fetchWorkbench();
  }, [fetchWorkbench]);

  return { ...state, refetch: fetchWorkbench };
}

interface UseInboxExposureState {
  exposure: Exposure | null;
  decisions: InboxDecisionRead[];
  isLoading: boolean;
  isError: boolean;
  error: ApiError | null;
}

export function useInboxExposure(exposureId: number | null) {
  const [state, setState] = useState<UseInboxExposureState>({
    exposure: null,
    decisions: [],
    isLoading: false,
    isError: false,
    error: null,
  });

  const fetchAll = useCallback(async () => {
    if (!exposureId) {
      setState({ exposure: null, decisions: [], isLoading: false, isError: false, error: null });
      return;
    }
    setState(prev => ({ ...prev, isLoading: true, isError: false, error: null }));
    try {
      const [exposure, decisions] = await Promise.all([
        getInboxExposureDetail(exposureId),
        listInboxDecisions(exposureId),
      ]);
      setState({ exposure, decisions, isLoading: false, isError: false, error: null });
    } catch (err) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        isError: true,
        error: err as ApiError,
      }));
    }
  }, [exposureId]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const submitDecision = useCallback(
    async (data: InboxDecisionCreate) => {
      if (!exposureId) return;
      await createInboxDecision(exposureId, data);
      await fetchAll();
    },
    [exposureId, fetchAll],
  );

  return { ...state, refetch: fetchAll, submitDecision };
}
