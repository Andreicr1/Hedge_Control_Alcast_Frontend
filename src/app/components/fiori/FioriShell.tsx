import type { ReactNode } from 'react';
import { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { useAuthContext } from '../AuthProvider';
import { normalizeRoleName } from '../../../utils/role';

import { FioriShellBar } from './FioriShellBar';
import { FioriSideNavigation } from './FioriSideNavigation';

export interface FioriShellProps {
  children: ReactNode;
  userName: string;
  userRole?: string;
  isAuthenticated: boolean;
}

export function FioriShell({ children, userName, userRole, isAuthenticated }: FioriShellProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const auth = useAuthContext();

  const isAdmin = useMemo(() => normalizeRoleName(userRole) === 'admin', [userRole]);

  if (!isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <div style={{ display: 'flex', height: '100vh', background: 'var(--sapBackgroundColor)' }}>
      <FioriSideNavigation
        currentPath={location.pathname}
        isAdmin={isAdmin}
        onNavigate={(to) => navigate(to)}
      />

      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0 }}>
        <FioriShellBar
          userName={userName}
          userRole={userRole}
          onHome={() => navigate('/')}
          onLogout={() => {
            auth.logout();
            navigate('/login');
          }}
        />

        <div style={{ flex: 1, minHeight: 0, overflow: 'auto' }}>{children}</div>
      </div>
    </div>
  );
}
