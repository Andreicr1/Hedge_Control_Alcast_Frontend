/**
 * Auth Service
 * 
 * Gerencia autenticação com o backend:
 * - Login (OAuth2 password flow)
 * - Logout
 * - Verificação de usuário atual
 */

import { setAuthToken, clearAuthToken, getAuthToken, getApiBaseUrl } from '../api/client';
import { normalizeRoleName } from '../utils/role';

// ============================================
// Types
// ============================================

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface TokenResponse {
  access_token: string;
  token_type?: string;
}

export interface UserInfo {
  id: number;
  email: string;
  name: string;
  role: string;
  active: boolean;
}

// ============================================
// Login
// ============================================

/**
 * Login com email e senha.
 * O backend usa OAuth2PasswordRequestForm (x-www-form-urlencoded).
 */
export async function login(credentials: LoginCredentials): Promise<TokenResponse> {
  const formData = new URLSearchParams();
  formData.append('username', credentials.email);
  formData.append('password', credentials.password);

  const apiBaseUrl = getApiBaseUrl();

  const response = await fetch(`${apiBaseUrl}/auth/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: formData.toString(),
  });

  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      throw new Error('Credenciais inválidas. Verifique usuário e senha.');
    }
    throw new Error('Serviço temporariamente indisponível. Tente novamente em alguns instantes.');
  }

  const data: TokenResponse = await response.json();
  
  // Store token
  setAuthToken(data.access_token);
  
  return data;
}

// ============================================
// Logout
// ============================================

export function logout(): void {
  clearAuthToken();
  // Optionally redirect to login
  window.location.href = '/login';
}

// ============================================
// Get Current User
// ============================================

export async function getCurrentUser(): Promise<UserInfo | null> {
  const token = getAuthToken();
  if (!token) {
    return null;
  }

  const apiBaseUrl = getApiBaseUrl();

  try {
    const response = await fetch(`${apiBaseUrl}/auth/me`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        clearAuthToken();
      }
      return null;
    }

    const raw = (await response.json()) as Record<string, unknown>;
    return {
      ...(raw as unknown as UserInfo),
      role: normalizeRoleName(raw.role),
    };
  } catch {
    return null;
  }
}

// ============================================
// Check if Authenticated
// ============================================

export function isAuthenticated(): boolean {
  return !!getAuthToken();
}

// ============================================
// Auto Login for Development
// ============================================

/**
 * Auto login para desenvolvimento.
 * Usa credenciais padrão se não estiver autenticado.
 * Habilitado apenas quando `VITE_AUTO_LOGIN_DEV=true`.
 */
export async function autoLoginDev(): Promise<boolean> {
  const enabled = import.meta.env.DEV && import.meta.env.VITE_AUTO_LOGIN_DEV === 'true';
  if (!enabled) {
    return false;
  }

  if (isAuthenticated()) {
    // Verifica se o token ainda é válido
    const user = await getCurrentUser();
    if (user) {
      return true;
    }
    // Token inválido, limpar e fazer login novamente
    clearAuthToken();
  }

  // Tenta fazer login com credenciais de desenvolvimento
  try {
    await login({
      email: 'admin@alcast.dev',
      password: '123',
    });
    console.log('[Auth] Auto-login: admin@alcast.dev');
    return true;
  } catch (err) {
    console.error('[Auth] Auto-login failed:', err);
    return false;
  }
}

export default {
  login,
  logout,
  getCurrentUser,
  isAuthenticated,
  autoLoginDev,
};
