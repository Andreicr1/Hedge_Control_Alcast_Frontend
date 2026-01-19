import { useEffect, useMemo, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { isSameScope, scopeFromSearchParams, writeScopeToSearchParams } from './scope';
import { useAnalyticScope } from './ScopeProvider';

export type ScopeUrlSyncOptions = {
  /** Accept legacy `deal_id` without `scope=deal` and translate into scope. */
  acceptLegacyDealId?: boolean;
};

function readLegacyDealId(params: URLSearchParams): number | null {
  const raw = (params.get('deal_id') || '').trim();
  if (!raw) return null;
  const n = Number(raw);
  if (!Number.isFinite(n) || !Number.isInteger(n)) return null;
  return n;
}

export function useAnalyticScopeUrlSync(options: ScopeUrlSyncOptions = {}) {
  const { acceptLegacyDealId = true } = options;

  const { scope, setScope } = useAnalyticScope();
  const [searchParams, setSearchParams] = useSearchParams();

  const currentFromUrl = useMemo(() => scopeFromSearchParams(searchParams), [searchParams]);

  const lastWriteRef = useRef<string>('');

  // URL -> store
  useEffect(() => {
    if (currentFromUrl) {
      if (!isSameScope(currentFromUrl, scope)) {
        setScope(currentFromUrl);
      }
      return;
    }

    if (acceptLegacyDealId) {
      const did = readLegacyDealId(searchParams);
      if (did && (!scope || scope.kind === 'all')) {
        setScope({ kind: 'deal', dealId: did });
      }
    }
  }, [acceptLegacyDealId, currentFromUrl, scope, searchParams, setScope]);

  // store -> URL
  useEffect(() => {
    const next = writeScopeToSearchParams(searchParams, scope);
    const nextStr = next.toString();

    if (nextStr === searchParams.toString()) return;
    if (nextStr === lastWriteRef.current) return;

    lastWriteRef.current = nextStr;
    setSearchParams(next, { replace: true });
  }, [scope, searchParams, setSearchParams]);
}
