import { useCallback, useEffect, useMemo, useState } from 'react';
import type { ApiError, EntityTreeResponse } from '../types';
import { getEntityTree, type EntityTreeQuery } from '../services/analytics.service';

export function useAnalyticsEntityTree(query?: EntityTreeQuery) {
  const [data, setData] = useState<EntityTreeResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);
  const [error, setError] = useState<ApiError | null>(null);

  const queryKey = useMemo(() => JSON.stringify(query ?? {}), [query]);

  const refetch = useCallback(async () => {
    setIsLoading(true);
    setIsError(false);
    setError(null);

    try {
      const res = await getEntityTree(query);
      setData(res);
    } catch (e) {
      setIsError(true);
      setError(e as ApiError);
      setData(null);
    } finally {
      setIsLoading(false);
    }
  }, [queryKey]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { data, isLoading, isError, error, refetch };
}
