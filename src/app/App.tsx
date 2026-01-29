import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import type { ReactNode } from 'react';
import { FioriShell } from './components/fiori/FioriShell';
import { AuthProvider } from './components/AuthProvider';
import { RequireRole } from './components/RequireRole';
import { useAuthContext } from './components/AuthProvider';
import { normalizeRoleName } from '../utils/role';

// Integrated pages (backend API)
import { DashboardPageIntegrated } from './pages/DashboardPageIntegrated';
import { RFQsPageIntegrated } from './pages/RFQsPageIntegrated';
import { ContractsPageIntegrated } from './pages/ContractsPageIntegrated';
import { CounterpartiesPageIntegrated } from './pages/CounterpartiesPageIntegrated';
import { ExposuresPageIntegrated } from './pages/ExposuresPageIntegrated';
import { CashflowPageIntegrated } from './pages/CashflowPageIntegrated';
import { ExportsPageIntegrated } from './pages/ExportsPageIntegrated';
import { LoginPageIntegrated } from './pages/LoginPageIntegrated';
import { AnalyticScopeProvider } from './analytics/ScopeProvider';
import { AnalyticsEntityTreeProvider } from './analytics/EntityTreeProvider';

export default function App() {
  const content = (
    <BrowserRouter>
      <AppShell>
        <AnalyticScopeProvider>
          <AnalyticsEntityTreeProvider>
          <Routes>
          <Route path="/login" element={<LoginPageIntegrated />} />
          <Route path="/" element={<HomeRedirect />} />
          
          {/* Financeiro */}
          <Route
            path="/financeiro/exposicoes"
            element={
              <RequireRole allowed={["financeiro", "auditoria", "admin"]}>
                <ExposuresPageIntegrated />
              </RequireRole>
            }
          />
          <Route
            path="/financeiro/rfqs"
            element={
              <RequireRole allowed={["financeiro", "auditoria", "admin"]}>
                <RFQsPageIntegrated />
              </RequireRole>
            }
          />
          <Route
            path="/financeiro/contratos"
            element={
              <RequireRole allowed={["financeiro", "auditoria", "admin"]}>
                <ContractsPageIntegrated />
              </RequireRole>
            }
          />
          <Route
            path="/financeiro/contrapartes"
            element={
              <RequireRole allowed={["financeiro", "auditoria", "admin"]}>
                <CounterpartiesPageIntegrated />
              </RequireRole>
            }
          />
          <Route
            path="/financeiro/cashflow"
            element={
              <RequireRole allowed={["financeiro", "auditoria", "admin"]}>
                <CashflowPageIntegrated />
              </RequireRole>
            }
          />
          <Route
            path="/financeiro/relatorios"
            element={
              <RequireRole allowed={["financeiro", "auditoria", "admin"]}>
                <ExportsPageIntegrated />
              </RequireRole>
            }
          />
          <Route
            path="/financeiro/exports"
            element={<Navigate to="/financeiro/relatorios" replace />}
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          </AnalyticsEntityTreeProvider>
        </AnalyticScopeProvider>
      </AppShell>
    </BrowserRouter>
  );

  return <AuthProvider>{content}</AuthProvider>;
}

function AppShell({ children }: { children: ReactNode }) {
  return <FioriShellWithAuth>{children}</FioriShellWithAuth>;
}

function FioriShellWithAuth({ children }: { children: ReactNode }) {
  const { user, isAuthenticated } = useAuthContext();
  return (
    <FioriShell 
      userName={user?.name || 'User'} 
      userRole={user?.role || undefined}
      isAuthenticated={isAuthenticated}
    >
      {children}
    </FioriShell>
  );
}

function HomeRedirect() {
  const { user, isAuthenticated, isLoading } = useAuthContext();

  if (isLoading) return null;
  if (!isAuthenticated || !user) return <Navigate to="/login" replace />;

  const role = normalizeRoleName(user.role);
  if (role === 'admin' || role === 'financeiro' || role === 'auditoria') return <DashboardPageIntegrated />;
  return <Navigate to="/" replace />;
}