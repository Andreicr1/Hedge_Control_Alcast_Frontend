import { BrowserRouter, Routes, Route, Navigate, useParams } from 'react-router-dom';
import type { ReactNode } from 'react';
import { FioriShell } from './components/fiori/FioriShell';
import { AuthProvider } from './components/AuthProvider';
import { RequireRole } from './components/RequireRole';
import { useAuthContext } from './components/AuthProvider';
import { normalizeRoleName } from '../utils/role';
import { SalesOrdersPage } from './pages/SalesOrdersPage';
import { PurchaseOrdersPage } from './pages/PurchaseOrdersPage';
import { RFQFormPage } from './pages/RFQFormPage';

// Integrated pages (backend API)
import { DashboardPageIntegrated } from './pages/DashboardPageIntegrated';
import { RFQsPageIntegrated } from './pages/RFQsPageIntegrated';
import { ContractsPageIntegrated } from './pages/ContractsPageIntegrated';
import { CounterpartiesPageIntegrated } from './pages/CounterpartiesPageIntegrated';
import { ExposuresPageIntegrated } from './pages/ExposuresPageIntegrated';
import { DealsPageIntegrated } from './pages/DealsPageIntegrated';
import { InboxPageIntegrated } from './pages/InboxPageIntegrated';
import { CashflowPageIntegrated } from './pages/CashflowPageIntegrated';
import { ExportsPageIntegrated } from './pages/ExportsPageIntegrated';
import { ApprovalsPageIntegrated } from './pages/ApprovalsPageIntegrated';
import { SettingsPageIntegrated } from './pages/SettingsPageIntegrated';
import { LoginPageIntegrated } from './pages/LoginPageIntegrated';
import { CustomersPageIntegrated } from './pages/CustomersPageIntegrated';
import { SuppliersPageIntegrated } from './pages/SuppliersPageIntegrated';
import { AnalyticScopeProvider } from './analytics/ScopeProvider';

export default function App() {
  const content = (
    <BrowserRouter>
      <AppShell>
        <AnalyticScopeProvider>
          <Routes>
          <Route path="/login" element={<LoginPageIntegrated />} />
          <Route path="/" element={<HomeRedirect />} />
          
          {/* Vendas */}
          <Route
            path="/vendas/sales-orders"
            element={
              <RequireRole allowed={["vendas"]}>
                <SalesOrdersPage />
              </RequireRole>
            }
          />
          <Route
            path="/vendas/sales-orders/:soId"
            element={
              <RequireRole allowed={["vendas"]}>
                <SalesOrdersPage />
              </RequireRole>
            }
          />
          <Route
            path="/vendas/clientes"
            element={
              <RequireRole allowed={["vendas", "admin"]}>
                <CustomersPageIntegrated />
              </RequireRole>
            }
          />
          
          {/* Compras */}
          <Route
            path="/compras/purchase-orders"
            element={
              <RequireRole allowed={["compras"]}>
                <PurchaseOrdersPage />
              </RequireRole>
            }
          />
          <Route
            path="/compras/purchase-orders/:poId"
            element={
              <RequireRole allowed={["compras"]}>
                <PurchaseOrdersPage />
              </RequireRole>
            }
          />
          <Route
            path="/compras/fornecedores"
            element={
              <RequireRole allowed={["compras", "admin"]}>
                <SuppliersPageIntegrated />
              </RequireRole>
            }
          />
          
          {/* Financeiro */}
          <Route
            path="/financeiro/inbox"
            element={
              <RequireRole allowed={["financeiro", "admin", "auditoria"]}>
                <InboxPageIntegrated />
              </RequireRole>
            }
          />
          <Route
            path="/financeiro/aprovacoes"
            element={
              <RequireRole allowed={["financeiro", "admin", "auditoria"]}>
                <ApprovalsPageIntegrated />
              </RequireRole>
            }
          />
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
            path="/financeiro/rfqs/novo"
            element={
              <RequireRole allowed={["financeiro"]}>
                <RFQFormPage />
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
            path="/financeiro/deals"
            element={
              <RequireRole allowed={["financeiro", "auditoria", "admin"]}>
                <DealsPageIntegrated />
              </RequireRole>
            }
          />
          <Route
            path="/financeiro/pnl"
            element={
              <RequireRole allowed={["financeiro", "auditoria", "admin"]}>
                <Navigate to="/financeiro/cashflow" replace />
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
            path="/financeiro/exports"
            element={
              <RequireRole allowed={["financeiro", "auditoria", "admin"]}>
                <ExportsPageIntegrated />
              </RequireRole>
            }
          />
          <Route
            path="/financeiro/deals/:dealId"
            element={
              <RequireRole allowed={["financeiro", "auditoria", "admin"]}>
                <DealRedirectToCashflow />
              </RequireRole>
            }
          />
          
          {/* Mercado */}
          <Route
            path="/mercado/mtm"
            element={
              <Navigate to="/financeiro/cashflow" replace />
            }
          />
          <Route
            path="/mercado/settlements"
            element={
              <Navigate to="/financeiro/cashflow" replace />
            }
          />
          
          {/* Configurações */}
          <Route
            path="/configuracoes"
            element={<SettingsPageIntegrated />}
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
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
  if (role === 'compras') return <Navigate to="/compras/purchase-orders" replace />;
  if (role === 'vendas') return <Navigate to="/vendas/sales-orders" replace />;
  return <Navigate to="/configuracoes" replace />;
}

function DealRedirectToCashflow() {
  const { dealId } = useParams<{ dealId: string }>();
  const normalized = (dealId || '').trim();
  if (!normalized) return <Navigate to="/financeiro/cashflow" replace />;
  const qs = new URLSearchParams({ scope: 'deal', deal_id: normalized });
  return <Navigate to={`/financeiro/cashflow?${qs.toString()}`} replace />;
}