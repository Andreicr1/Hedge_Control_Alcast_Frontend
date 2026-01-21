export type AnalyticScope =
  | { kind: 'none' }
  | { kind: 'all' }
  | { kind: 'deal'; dealId: number }
  | { kind: 'so'; dealId: number; soId: number }
  | { kind: 'po'; dealId: number; poId: number }
  | { kind: 'contract'; dealId: number; contractId: string };

export function isSameScope(a: AnalyticScope, b: AnalyticScope): boolean {
  if (a.kind !== b.kind) return false;
  if (a.kind === 'none') return true;
  if (a.kind === 'all') return true;
  if (a.kind === 'deal' && b.kind === 'deal') return a.dealId === b.dealId;
  if (a.kind === 'so' && b.kind === 'so') return a.dealId === b.dealId && a.soId === b.soId;
  if (a.kind === 'po' && b.kind === 'po') return a.dealId === b.dealId && a.poId === b.poId;
  if (a.kind === 'contract' && b.kind === 'contract') return a.dealId === b.dealId && a.contractId === b.contractId;
  return false;
}

export function scopeKey(scope: AnalyticScope): string {
  if (scope.kind === 'none') return 'none';
  if (scope.kind === 'all') return 'all';
  if (scope.kind === 'deal') return `deal:${scope.dealId}`;
  if (scope.kind === 'so') return `so:${scope.soId}`;
  if (scope.kind === 'po') return `po:${scope.poId}`;
  return `contract:${scope.contractId}`;
}

function readInt(params: URLSearchParams, key: string): number | null {
  const raw = (params.get(key) || '').trim();
  if (!raw) return null;
  const n = Number(raw);
  if (!Number.isFinite(n)) return null;
  if (!Number.isInteger(n)) return null;
  return n;
}

export function scopeFromSearchParams(params: URLSearchParams): AnalyticScope | null {
  const kind = (params.get('scope') || '').trim().toLowerCase();
  if (!kind) return null;

  if (kind === 'none') return { kind: 'none' };
  if (kind === 'all') return { kind: 'all' };

  const dealId = readInt(params, 'deal_id');
  if (!dealId) return null;

  if (kind === 'deal') return { kind: 'deal', dealId };

  if (kind === 'so') {
    const soId = readInt(params, 'so_id');
    if (!soId) return null;
    return { kind: 'so', dealId, soId };
  }

  if (kind === 'po') {
    const poId = readInt(params, 'po_id');
    if (!poId) return null;
    return { kind: 'po', dealId, poId };
  }

  if (kind === 'contract') {
    const contractId = (params.get('contract_id') || '').trim();
    if (!contractId) return null;
    return { kind: 'contract', dealId, contractId };
  }

  return null;
}

export function writeScopeToSearchParams(params: URLSearchParams, scope: AnalyticScope): URLSearchParams {
  const next = new URLSearchParams(params);

  // Clear previous scope keys.
  next.delete('scope');
  next.delete('deal_id');
  next.delete('so_id');
  next.delete('po_id');
  next.delete('contract_id');

  // For "none" (no selection), keep the URL clean.
  if (scope.kind === 'none') {
    return next;
  }

  if (scope.kind === 'all') {
    next.set('scope', 'all');
    return next;
  }

  next.set('scope', scope.kind);
  next.set('deal_id', String(scope.dealId));

  if (scope.kind === 'so') next.set('so_id', String(scope.soId));
  if (scope.kind === 'po') next.set('po_id', String(scope.poId));
  if (scope.kind === 'contract') next.set('contract_id', scope.contractId);

  return next;
}
