import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthContext } from './AuthProvider';
import { normalizeRoleName } from '../../utils/role';
import { formatRequiredProfiles } from '../ux/copy';
import { FioriAccessDenied } from './fiori/FioriAccessDenied';

interface RequireRoleProps {
  allowed: string[];
  children: ReactNode;
  redirectTo?: string;
}

export function RequireRole({ allowed, children, redirectTo = '/login' }: RequireRoleProps) {
  const { user, isAuthenticated, isLoading } = useAuthContext();
  const location = useLocation();

  if (isLoading) {
    return null;
  }

  if (!isAuthenticated || !user) {
    return <Navigate to={redirectTo} replace state={{ from: location.pathname }} />;
  }

  const role = normalizeRoleName(user.role);
  const allowedNormalized = allowed.map((r) => normalizeRoleName(r));
  const isAllowed = allowedNormalized.includes(role);

  if (!isAllowed) {
    const requiredProfiles = formatRequiredProfiles(allowedNormalized);
    return <FioriAccessDenied requiredProfilesLabel={requiredProfiles} />;
  }

  return <>{children}</>;
}
