import { matchPath } from 'react-router-dom';
import { normalizeRoleName } from '../../utils/role';

export type AppRole = 'admin' | 'financeiro' | 'auditoria' | 'comercial' | '';

export function normalizeAppRole(role: unknown): AppRole {
  return normalizeRoleName(role) as AppRole;
}

export type RoutePolicyEntry = {
  /** React Router path pattern (no regex). */
  pattern: string;
  /** Explicit allow list. No implicit admin bypass. */
  allowed: readonly AppRole[];
  /** Whether this route is public (no auth required). */
  public?: boolean;
};

// NOTE: This is the single authoritative route access policy.
// Any route not listed here is denied by default (structural hardening).
export const ROUTE_ACCESS_POLICY: readonly RoutePolicyEntry[] = [
  { pattern: '/login', allowed: ['admin', 'financeiro', 'auditoria', 'comercial', ''], public: true },

  // Home (Dashboard)
  { pattern: '/', allowed: ['admin', 'financeiro', 'auditoria'] },

  // Financeiro
  { pattern: '/financeiro/exposicoes', allowed: ['financeiro', 'auditoria', 'admin'] },
  { pattern: '/financeiro/rfqs', allowed: ['financeiro', 'auditoria', 'admin'] },
  { pattern: '/financeiro/contratos', allowed: ['financeiro', 'auditoria', 'admin'] },
  { pattern: '/financeiro/contrapartes', allowed: ['financeiro', 'auditoria', 'admin'] },
  { pattern: '/financeiro/cashflow', allowed: ['financeiro', 'auditoria', 'admin'] },
  { pattern: '/financeiro/relatorios', allowed: ['financeiro', 'auditoria', 'admin'] },

  // Legacy redirect route kept for compatibility
  { pattern: '/financeiro/exports', allowed: ['financeiro', 'auditoria', 'admin'] },

  // Admin-only governance observability
  { pattern: '/financeiro/governanca/saude', allowed: ['admin'] },
];

export function getRoutePolicyForPath(pathname: string): RoutePolicyEntry | null {
  for (const entry of ROUTE_ACCESS_POLICY) {
    const match = matchPath({ path: entry.pattern, end: true }, pathname);
    if (match) return entry;
  }
  return null;
}

export function isPublicPath(pathname: string): boolean {
  const entry = getRoutePolicyForPath(pathname);
  return Boolean(entry?.public);
}

export function isRoleAllowedForPath(role: unknown, pathname: string): boolean {
  const entry = getRoutePolicyForPath(pathname);
  if (!entry) return false;
  const normalized = normalizeAppRole(role);
  return entry.allowed.includes(normalized);
}

// ==========================================================
// Action-level policy helpers (for conditional rendering)
// ==========================================================

export function canCreateExportJob(role: unknown): boolean {
  const r = normalizeAppRole(role);
  return r === 'financeiro' || r === 'admin';
}

export function canMaterializePnlSnapshot(role: unknown): boolean {
  const r = normalizeAppRole(role);
  return r === 'financeiro' || r === 'admin';
}

export function canWriteTimeline(role: unknown): boolean {
  const r = normalizeAppRole(role);
  return r !== 'auditoria' && r !== '';
}

export function canUseTimelineFinanceVisibility(role: unknown): boolean {
  const r = normalizeAppRole(role);
  return r === 'financeiro' || r === 'admin';
}
