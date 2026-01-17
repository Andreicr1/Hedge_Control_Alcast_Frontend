import { ReactNode, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { FioriShellBar } from './FioriShellBar';
import { FioriSideNavigation } from './FioriSideNavigation';

interface ShellProps {
  children: ReactNode;
  userName?: string;
  userRole?: string;
  /** Hide shell chrome (navigation, sidebar) - used for login page or unauthenticated state */
  hideChrome?: boolean;
  /** Whether user is authenticated - if false, hides navigation */
  isAuthenticated?: boolean;
}

export function FioriShell({ children, userName = 'User', userRole, hideChrome, isAuthenticated = true }: ShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  
  // Hide chrome (shellbar + navigation) on login page or when not authenticated
  const isLoginPage = location.pathname === '/login';
  const showChrome = !hideChrome && !isLoginPage && isAuthenticated;

  // If no chrome, render just the content with minimal styling
  if (!showChrome) {
    return (
      <div className="sap-fiori-shell min-h-screen flex items-center justify-center">
        {children}
      </div>
    );
  }

  return (
    <div className="sap-fiori-shell">
      {/* Shell Bar */}
      <FioriShellBar
        onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
        sidebarOpen={sidebarOpen}
        userName={userName}
      />

      <div className="flex flex-1 overflow-hidden">
        {/* Side Navigation */}
        {sidebarOpen && (
          <aside
            className="w-64 border-r overflow-y-auto bg-[var(--sapList_Background)] border-[var(--sapList_BorderColor)]"
            role="navigation"
            aria-label="Main navigation"
          >
            <FioriSideNavigation isOpen={sidebarOpen} userRole={userRole} />
          </aside>
        )}

        {/* Main Content */}
        <main className="flex-1 overflow-auto" role="main">
          {children}
        </main>
      </div>
    </div>
  );
}