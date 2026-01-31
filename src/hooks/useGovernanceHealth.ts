/**
 * useGovernanceHealth
 *
 * Thin read-only hook for GET /governance/health.
 * No business logic: only orchestration (loading/error/state).
 */

import { useCallback, useEffect, useState } from 'react';
import type { ApiError } from '../types';
import type { GovernanceHealthSnapshot } from '../types/governance';
import { getGovernanceHealthSnapshot } from '../services/governance.service';

interface UseGovernanceHealthState {
  snapshot: GovernanceHealthSnapshot | null;
  isLoading: boolean;
  isError: boolean;
  error: ApiError | null;
}

export function useGovernanceHealth(params?: { staleDays?: number; breakGlassDays?: number }) {
  const [state, setState] = useState<UseGovernanceHealthState>({
    snapshot: null,
    isLoading: true,
    isError: false,
    error: null,
  });

  const refetch = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true, isError: false, error: null }));
    try {
      const snapshot = await getGovernanceHealthSnapshot(params);
      setState({ snapshot, isLoading: false, isError: false, error: null });
    } catch (err) {
      setState({ snapshot: null, isLoading: false, isError: true, error: err as ApiError });
    }
  }, [params?.staleDays, params?.breakGlassDays]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return {
    ...state,
    refetch,
  };
}
