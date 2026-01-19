import { createContext, useContext, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import type { AnalyticScope } from './scope';

type ScopeContextValue = {
  scope: AnalyticScope;
  setScope: (scope: AnalyticScope) => void;
};

const ScopeContext = createContext<ScopeContextValue | null>(null);

export function AnalyticScopeProvider({ children }: { children: ReactNode }) {
  const [scope, setScope] = useState<AnalyticScope>({ kind: 'all' });

  const value = useMemo<ScopeContextValue>(() => ({ scope, setScope }), [scope]);

  return <ScopeContext.Provider value={value}>{children}</ScopeContext.Provider>;
}

export function useAnalyticScope(): ScopeContextValue {
  const ctx = useContext(ScopeContext);
  if (!ctx) throw new Error('useAnalyticScope must be used within AnalyticScopeProvider');
  return ctx;
}
