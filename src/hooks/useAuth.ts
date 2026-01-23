/**
 * Auth Hook
 *
 * Hook para gerenciar estado de autenticação no React.
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
  entraLoginPopup,
  entraLogout,
  entraTrySilentLogin,
  getAuthMode,
} from '../services/entra.service';

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

export function useAuth(): UseAuthReturn {
  // 🔒 Fonte única da verdade (imutável)
  const authMode = getAuthMode();

  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: isAuthenticated(),
    isLoading: true,
    error: null,
  });

  const checkAuth = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      if (authMode === 'entra') {
        await entraTrySilentLogin();
      }

      // Auto-login DEV é opt-in
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

  const login = useCallback(
    async (credentials: LoginCredentials) => {
      setState(prev => ({ ...prev, isLoading: true, error: null }));

      try {
        if (authMode === 'entra') {
          await entraLoginPopup();
        } else {
          await loginService(credentials);
        }

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
    [authMode]
  );

  const loginEntra = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      await entraLoginPopup();
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
  }, []);

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

  // Check auth on mount
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
