/**
 * useTimeline Hooks (v1 - read-only)
 */

import { useCallback, useEffect, useMemo, useState } from 'react';
import { ApiError, TimelineEvent } from '../types';
import { listRecentTimeline, listTimeline } from '../services/timeline.service';

interface UseTimelineState {
  events: TimelineEvent[];
  isLoading: boolean;
  isError: boolean;
  error: ApiError | null;
  hasMore: boolean;
}

function lastOccurredAt(events: TimelineEvent[]): string | null {
  if (events.length === 0) return null;
  return events[events.length - 1]?.occurred_at ?? null;
}

export function useTimelineSubject(subjectType: string | null, subjectId: number | null, limit: number = 50) {
  const [state, setState] = useState<UseTimelineState>({
    events: [],
    isLoading: false,
    isError: false,
    error: null,
    hasMore: true,
  });

  const key = useMemo(() => (subjectType && subjectId ? `${subjectType}:${subjectId}` : null), [subjectType, subjectId]);

  const fetchFirstPage = useCallback(async () => {
    if (!subjectType || !subjectId) {
      setState({ events: [], isLoading: false, isError: false, error: null, hasMore: false });
      return;
    }

    setState(prev => ({ ...prev, isLoading: true, isError: false, error: null }));
    try {
      const events = await listTimeline({ subject_type: subjectType, subject_id: subjectId, limit });
      setState({
        events,
        isLoading: false,
        isError: false,
        error: null,
        hasMore: events.length >= limit,
      });
    } catch (err) {
      setState({ events: [], isLoading: false, isError: true, error: err as ApiError, hasMore: false });
    }
  }, [subjectType, subjectId, limit]);

  const loadMore = useCallback(async () => {
    if (!subjectType || !subjectId) return;
    if (state.isLoading || !state.hasMore) return;

    const before = lastOccurredAt(state.events);
    if (!before) return;

    setState(prev => ({ ...prev, isLoading: true, isError: false, error: null }));
    try {
      const next = await listTimeline({ subject_type: subjectType, subject_id: subjectId, limit, before });
      setState(prev => ({
        events: [...prev.events, ...next],
        isLoading: false,
        isError: false,
        error: null,
        hasMore: next.length >= limit,
      }));
    } catch (err) {
      setState(prev => ({ ...prev, isLoading: false, isError: true, error: err as ApiError }));
    }
  }, [subjectType, subjectId, limit, state.events, state.hasMore, state.isLoading]);

  useEffect(() => {
    fetchFirstPage();
  }, [fetchFirstPage, key]);

  return {
    ...state,
    refetch: fetchFirstPage,
    loadMore,
  };
}

export function useRecentTimeline(limit: number = 50) {
  const [state, setState] = useState<Omit<UseTimelineState, 'hasMore'> & { hasMore?: boolean }>({
    events: [],
    isLoading: true,
    isError: false,
    error: null,
  });

  const fetchRecent = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, isError: false, error: null }));
    try {
      const events = await listRecentTimeline(limit);
      setState({ events, isLoading: false, isError: false, error: null });
    } catch (err) {
      setState({ events: [], isLoading: false, isError: true, error: err as ApiError });
    }
  }, [limit]);

  useEffect(() => {
    fetchRecent();
  }, [fetchRecent]);

  return {
    ...state,
    refetch: fetchRecent,
  };
}
