import { createContext, useContext, useMemo } from 'react';
import type { ReactNode } from 'react';

import { useAnalyticsEntityTree } from '../../hooks';
import type { ApiError, EntityTreeResponse } from '../../types';

export type AnalyticsEntityTreeValue = {
  data: EntityTreeResponse | null;
  isLoading: boolean;
  isError: boolean;
  error: ApiError | null;
  refetch: () => Promise<void>;
};

const AnalyticsEntityTreeContext = createContext<AnalyticsEntityTreeValue | null>(null);

export function AnalyticsEntityTreeProvider({ children }: { children: ReactNode }) {
  const tree = useAnalyticsEntityTree();

  const value = useMemo<AnalyticsEntityTreeValue>(
    () => ({
      data: tree.data,
      isLoading: tree.isLoading,
      isError: tree.isError,
      error: tree.error,
      refetch: tree.refetch,
    }),
    [tree.data, tree.error, tree.isError, tree.isLoading, tree.refetch],
  );

  return <AnalyticsEntityTreeContext.Provider value={value}>{children}</AnalyticsEntityTreeContext.Provider>;
}

export function useAnalyticsEntityTreeContext(): AnalyticsEntityTreeValue {
  const ctx = useContext(AnalyticsEntityTreeContext);
  if (!ctx) throw new Error('useAnalyticsEntityTreeContext must be used within AnalyticsEntityTreeProvider');
  return ctx;
}
