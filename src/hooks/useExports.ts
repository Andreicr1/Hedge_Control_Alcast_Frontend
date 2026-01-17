/**
 * useExports Hooks
 *
 * Small, explicit hooks for the /exports feature.
 * No business logic: only orchestration (loading/error/state).
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { ApiError, ExportJobCreate, ExportJobRead, ExportManifest } from '../types';
import {
  createExportJob,
  downloadExportArtifact,
  getExportJob,
  getExportManifest,
  type ExportManifestQuery,
} from '../services/exports.service';

interface UseExportManifestState {
  manifest: ExportManifest | null;
  isLoading: boolean;
  isError: boolean;
  error: ApiError | null;
}

export function useExportManifest(query: ExportManifestQuery | null) {
  const [state, setState] = useState<UseExportManifestState>({
    manifest: null,
    isLoading: false,
    isError: false,
    error: null,
  });

  const queryKey = useMemo(() => JSON.stringify(query ?? {}), [query]);

  const refetch = useCallback(async () => {
    if (!query) return;

    setState((prev) => ({ ...prev, isLoading: true, isError: false, error: null }));
    try {
      const data = await getExportManifest(query);
      setState({ manifest: data, isLoading: false, isError: false, error: null });
    } catch (err) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        isError: true,
        error: err as ApiError,
      }));
    }
  }, [queryKey]);

  useEffect(() => {
    // Auto-fetch only when query is provided
    if (query) {
      refetch();
    }
  }, [refetch, queryKey]);

  return {
    ...state,
    refetch,
  };
}

interface UseCreateExportJobState {
  job: ExportJobRead | null;
  isLoading: boolean;
  isError: boolean;
  error: ApiError | null;
  isSuccess: boolean;
}

export function useCreateExportJob() {
  const [state, setState] = useState<UseCreateExportJobState>({
    job: null,
    isLoading: false,
    isError: false,
    error: null,
    isSuccess: false,
  });

  const mutate = useCallback(async (payload: ExportJobCreate): Promise<ExportJobRead | null> => {
    setState({ job: null, isLoading: true, isError: false, error: null, isSuccess: false });
    try {
      const job = await createExportJob(payload);
      setState({ job, isLoading: false, isError: false, error: null, isSuccess: true });
      return job;
    } catch (err) {
      setState({ job: null, isLoading: false, isError: true, error: err as ApiError, isSuccess: false });
      return null;
    }
  }, []);

  const reset = useCallback(() => {
    setState({ job: null, isLoading: false, isError: false, error: null, isSuccess: false });
  }, []);

  return { ...state, mutate, reset };
}

interface UseExportJobState {
  job: ExportJobRead | null;
  isLoading: boolean;
  isError: boolean;
  error: ApiError | null;
}

export function useExportJob(exportId: string | null, opts?: { pollIntervalMs?: number }) {
  const pollIntervalMs = opts?.pollIntervalMs ?? 2000;

  const [state, setState] = useState<UseExportJobState>({
    job: null,
    isLoading: false,
    isError: false,
    error: null,
  });

  const exportIdKey = useMemo(() => (exportId ?? '').trim(), [exportId]);
  const timerRef = useRef<number | null>(null);

  const clearTimer = () => {
    if (timerRef.current != null) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const refetch = useCallback(async () => {
    const id = exportIdKey;
    if (!id) return;

    setState((prev) => ({ ...prev, isLoading: true, isError: false, error: null }));
    try {
      const job = await getExportJob(id);
      setState({ job, isLoading: false, isError: false, error: null });
      return job;
    } catch (err) {
      setState((prev) => ({ ...prev, isLoading: false, isError: true, error: err as ApiError }));
      return null;
    }
  }, [exportIdKey]);

  useEffect(() => {
    clearTimer();

    if (!exportIdKey) {
      setState({ job: null, isLoading: false, isError: false, error: null });
      return;
    }

    // initial fetch
    void refetch();

    // poll until done
    timerRef.current = window.setInterval(async () => {
      const job = await getExportJob(exportIdKey).catch(() => null);
      if (!job) return;

      setState({ job, isLoading: false, isError: false, error: null });

      if (job.status === 'done') {
        clearTimer();
      }
    }, pollIntervalMs);

    return () => clearTimer();
  }, [exportIdKey, pollIntervalMs, refetch]);

  return {
    ...state,
    refetch,
  };
}

export function useExportDownload() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  const download = useCallback(
    async (exportId: string, opts?: { filename?: string; kind?: string }): Promise<Blob | null> => {
    setIsLoading(true);
    setError(null);
    try {
      const blob = await downloadExportArtifact(exportId, opts);
      setIsLoading(false);
      return blob;
    } catch (err) {
      setIsLoading(false);
      setError(err as ApiError);
      return null;
    }
    },
    []
  );

  return { isLoading, error, download };
}

export default {
  useExportManifest,
  useCreateExportJob,
  useExportJob,
  useExportDownload,
};
