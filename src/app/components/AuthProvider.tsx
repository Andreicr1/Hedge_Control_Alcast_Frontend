/**
 * Auth Provider
 * 
 * Componente que gerencia autenticação e faz auto-login em dev.
 * Envolve o aplicativo e garante que o usuário está autenticado.
 */

import { createContext, useContext, ReactNode, useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { UserInfo } from '../../services/auth.service';
import type { LoginCredentials } from '../../services/auth.service';
import { UX_COPY } from '../ux/copy';

interface AuthContextValue {
  user: UserInfo | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  loginEntra: () => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
  authMode: 'local' | 'entra';
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuthContext(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const auth = useAuth();
  const [initialized, setInitialized] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    if (!auth.isLoading) {
      setInitialized(true);
    }
  }, [auth.isLoading]);

  // Retry auth if failed (up to 3 times)
  useEffect(() => {
    if (initialized && auth.error && !auth.isAuthenticated && retryCount < 3) {
      const timer = setTimeout(() => {
        setRetryCount(prev => prev + 1);
        auth.checkAuth();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [initialized, auth.error, auth.isAuthenticated, retryCount, auth.checkAuth]);

  // Show loading state while checking auth
  if (!initialized || (auth.error && retryCount < 3)) {
    return (
      <div className="min-h-screen bg-[var(--sapBackgroundColor)] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--sapAccentColor3)] mx-auto mb-4"></div>
          <p className="text-[var(--sapContent_LabelColor)]">
            {retryCount > 0 ? `Tentativa ${retryCount + 1}/3...` : 'Conectando ao servidor...'}
          </p>
        </div>
      </div>
    );
  }

  // Show error if auth failed after retries
  if (auth.error && !auth.isAuthenticated) {
    return (
      <div className="min-h-screen bg-[var(--sapBackgroundColor)] flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md text-center">
          <div className="w-12 h-12 rounded-full bg-[var(--sapErrorBackground,#ffebeb)] flex items-center justify-center mx-auto mb-4">
            <span className="text-[var(--sapNegativeColor,#b00)] font-['72:Bold',sans-serif] text-xl">!</span>
          </div>
          <h2 className="font-['72:Bold',sans-serif] text-lg text-[var(--sapTextColor,#32363a)] mb-2">Serviço indisponível</h2>
          <p className="text-[var(--sapContent_LabelColor)] mb-4">
            Não foi possível validar a sessão no momento. Tente novamente em alguns instantes.
          </p>
          <button
            onClick={() => {
              setRetryCount(0);
              auth.checkAuth();
            }}
            className="mt-2 px-4 py-2 bg-[var(--sapButton_Emphasized_Background)] text-white rounded hover:bg-[var(--sapButton_Emphasized_Hover_Background)]"
          >
            {UX_COPY.errors.retry}
          </button>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        user: auth.user,
        isAuthenticated: auth.isAuthenticated,
        isLoading: auth.isLoading,
        error: auth.error,
        login: auth.login,
        loginEntra: auth.loginEntra,
        logout: auth.logout,
        checkAuth: auth.checkAuth,
        authMode: auth.authMode,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
