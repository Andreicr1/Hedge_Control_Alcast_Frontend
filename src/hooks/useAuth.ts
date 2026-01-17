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

interface AuthState {
  user: UserInfo | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface UseAuthReturn extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

export function useAuth(): UseAuthReturn {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: isAuthenticated(),
    isLoading: true,
    error: null,
  });

  const checkAuth = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      // Auto-login is opt-in only (prevents bypassing the login screen in institutional UX).
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
  }, []);

  const login = useCallback(async (credentials: LoginCredentials) => {
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
  }, []);

  const logout = useCallback(() => {
    logoutService();
    setState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
  }, []);

  // Check auth on mount
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return {
    ...state,
    login,
    logout,
    checkAuth,
  };
}

export default useAuth;
