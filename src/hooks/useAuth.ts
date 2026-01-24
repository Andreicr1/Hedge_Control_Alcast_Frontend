/**
 * Auth Hook
 *
 * Gerencia autenticação local ou Microsoft Entra ID
 * Compatível com Azure Static Web Apps (redirect flow)
 */

import { useState, useEffect, useCallback } from 'react';
import {
  login as loginService,
  logout as logoutService,
  getCurrentUser,
  isAuthenticated,
  autoLoginDev,
  LoginCredentials,
  UserInfo,
} from '../services/auth.service';

import {
  entraLoginRedirect,
  entraLogout,
  entraHandleRedirect,
  entraTrySilentLogin,
  getAuthMode,
} from '../services/entra.service';

/* =========================================================
 * Types
 * ========================================================= */

interface AuthState {
  user: UserInfo | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface UseAuthReturn extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  loginEntra: () => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
  authMode: 'local' | 'entra';
}

/* =========================================================
 * Hook
 * ========================================================= */

export function useAuth(): UseAuthReturn {
  // 🔒 Fonte única da verdade
  const authMode = getAuthMode();

  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: isAuthenticated(),
    isLoading: true,
    error: null,
  });

  /**
   * Restaura sessão após reload / redirect
   */
  const checkAuth = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      // 🔐 Entra redirect + silent restore
      if (authMode === 'entra') {
        await entraHandleRedirect();
        await entraTrySilentLogin();
      }

      // Auto-login DEV (opt-in)
      if (import.meta.env.DEV && import.meta.env.VITE_AUTO_LOGIN_DEV === 'true') {
        await autoLoginDev();
      }

      const user = await getCurrentUser();

      setState({
        user,
        isAuthenticated: !!user,
        isLoading: false,
        error: null,
      });
    } catch (err) {
      setState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: err instanceof Error ? err.message : 'Auth check failed',
      });
    }
  }, [authMode]);

  /**
   * Login LOCAL (email/senha)
   */
  const login = useCallback(
    async (credentials: LoginCredentials) => {
      setState(prev => ({ ...prev, isLoading: true, error: null }));

      try {
        await loginService(credentials);

        const user = await getCurrentUser();

        setState({
          user,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
      } catch (err) {
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: err instanceof Error ? err.message : 'Login failed',
        }));
        throw err;
      }
    },
    []
  );

  /**
   * Login ENTRA — REDIRECT FLOW (obrigatório no SWA)
   */
  const loginEntra = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    // ⛔ NÃO continuar execução
    // o browser será redirecionado
    await entraLoginRedirect();
  }, []);

  /**
   * Logout
   */
  const logout = useCallback(() => {
    if (authMode === 'entra') {
      void entraLogout();
    } else {
      logoutService();
    }

    setState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
  }, [authMode]);

  /**
   * Bootstrap
   */
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return {
    ...state,
    login,
    loginEntra,
    logout,
    checkAuth,
    authMode,
  };
}

export default useAuth;
