import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthContext } from './AuthProvider';
import { normalizeRoleName } from '../../utils/role';
import { formatRequiredProfiles, UX_COPY } from '../ux/copy';

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

  // UX hardening: Admin should not hit institutional "acesso negado" walls.
  // If the backend denies a specific action, the UI will surface it as a read-only/blocked action.
  if (!isAllowed && role === 'admin') {
    return <>{children}</>;
  }

  if (!isAllowed) {
    const requiredProfiles = formatRequiredProfiles(allowedNormalized);
    return (
      <div className="sap-fiori-page p-4">
        <div className="sap-fiori-section">
          <div className="sap-fiori-section-content">
            <h2 className="text-lg font-['72:Bold',sans-serif] text-[var(--sapTextColor,#131e29)]">{UX_COPY.errors.title}</h2>
            <p className="text-sm text-[var(--sapContent_LabelColor,#556b82)] mt-2">
              Você tem acesso de visualização. Esta ação requer perfil {requiredProfiles}.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
