import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthContext } from './AuthProvider';
import { formatRequiredProfiles } from '../ux/copy';
import { getRoutePolicyForPath, isPublicPath, normalizeAppRole } from '../auth/accessPolicy';
import { FioriAccessDenied } from './fiori/FioriAccessDenied';

export function RouteAccessGate({ children }: { children: ReactNode }) {
  const { user, isAuthenticated, isLoading } = useAuthContext();
  const location = useLocation();

  if (isLoading) return null;

  const pathname = location.pathname;

  if (!isAuthenticated || !user) {
    if (isPublicPath(pathname)) return <>{children}</>;
    return <Navigate to="/login" replace state={{ from: pathname }} />;
  }

  const policy = getRoutePolicyForPath(pathname);

  // Structural hardening: deny any route not in policy.
  if (!policy) {
    return <Navigate to="/" replace />;
  }

  const role = normalizeAppRole(user.role);
  const isAllowed = policy.allowed.includes(role);

  if (!isAllowed) {
    const requiredProfiles = formatRequiredProfiles(policy.allowed.map((r) => String(r)));
    return <FioriAccessDenied requiredProfilesLabel={requiredProfiles} />;
  }

  return <>{children}</>;
}
