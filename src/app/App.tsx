import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import type { ReactNode } from 'react';
import { FioriShell } from './components/fiori/FioriShell';
import { AuthProvider } from './components/AuthProvider';
import { useAuthContext } from './components/AuthProvider';
import { RouteAccessGate } from './components/RouteAccessGate';

// Integrated pages (backend API)
import { DashboardPageIntegrated } from './pages/DashboardPageIntegrated';
import { RFQsPageIntegrated } from './pages/RFQsPageIntegrated';
import { ContractsPageIntegrated } from './pages/ContractsPageIntegrated';
import { CounterpartiesPageIntegrated } from './pages/CounterpartiesPageIntegrated';
import { ExposuresPageIntegrated } from './pages/ExposuresPageIntegrated';
import { CashflowPageIntegrated } from './pages/CashflowPageIntegrated';
import { ExportsPageIntegrated } from './pages/ExportsPageIntegrated';
import { LoginPageIntegrated } from './pages/LoginPageIntegrated';
import { GovernanceHealthPageIntegrated } from './pages/GovernanceHealthPageIntegrated';
import { AnalyticScopeProvider } from './analytics/ScopeProvider';
import { AnalyticsEntityTreeProvider } from './analytics/EntityTreeProvider';

export default function App() {
  const content = (
    <BrowserRouter>
      <AppShell>
        <Routes>
          <Route path="/login" element={<LoginPageIntegrated />} />

          <Route
            element={
              <RouteAccessGate>
                <AnalyticScopeProvider>
                  <AnalyticsEntityTreeProvider>
                    <Outlet />
                  </AnalyticsEntityTreeProvider>
                </AnalyticScopeProvider>
              </RouteAccessGate>
            }
          >
            <Route path="/" element={<HomeRedirect />} />

            {/* Financeiro */}
            <Route path="/financeiro/exposicoes" element={<ExposuresPageIntegrated />} />
            <Route path="/financeiro/rfqs" element={<RFQsPageIntegrated />} />
            <Route path="/financeiro/contratos" element={<ContractsPageIntegrated />} />
            <Route path="/financeiro/contrapartes" element={<CounterpartiesPageIntegrated />} />
            <Route path="/financeiro/cashflow" element={<CashflowPageIntegrated />} />
            <Route path="/financeiro/relatorios" element={<ExportsPageIntegrated />} />

            <Route path="/financeiro/governanca/saude" element={<GovernanceHealthPageIntegrated />} />
            <Route path="/financeiro/exports" element={<Navigate to="/financeiro/relatorios" replace />} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
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

  // RouteAccessGate enforces role policy for '/'.
  return <DashboardPageIntegrated />;
}