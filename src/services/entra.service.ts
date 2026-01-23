import {
  PublicClientApplication,
  type AccountInfo,
  type AuthenticationResult,
  InteractionRequiredAuthError,
} from '@azure/msal-browser';

import { clearAuthToken, setAuthToken } from '../api/client';

export type AuthMode = 'local' | 'entra';

/* =========================================================
 * Helpers
 * ========================================================= */

function envVal(v: unknown): string {
  return String(v || '').trim();
}

function requiredEnv(name: string, value: unknown): string {
  const s = envVal(value);
  if (!s) {
    throw new Error(`Missing ${name} env var`);
  }
  return s;
}

/* =========================================================
 * Entra configuration checks
 * ========================================================= */

export function getMissingEntraEnvVars(): string[] {
  const missing: string[] = [];
  if (!envVal(import.meta.env.VITE_ENTRA_TENANT_ID)) missing.push('VITE_ENTRA_TENANT_ID');
  if (!envVal(import.meta.env.VITE_ENTRA_CLIENT_ID)) missing.push('VITE_ENTRA_CLIENT_ID');
  if (!envVal(import.meta.env.VITE_ENTRA_API_SCOPE)) missing.push('VITE_ENTRA_API_SCOPE');
  return missing;
}

export function isEntraConfigured(): boolean {
  return getMissingEntraEnvVars().length === 0;
}

export function getAuthMode(): AuthMode {
  const raw = envVal(import.meta.env.VITE_AUTH_MODE).toLowerCase();

  if (raw === 'entra') return 'entra';
  if (raw === 'local') return 'local';

  // Safety net for prod builds
  if (import.meta.env.PROD && isEntraConfigured()) return 'entra';

  return 'local';
}

/* =========================================================
 * MSAL setup (SWA-safe)
 * ========================================================= */

function createMsalInstance(): PublicClientApplication {
  const tenantId = requiredEnv('VITE_ENTRA_TENANT_ID', import.meta.env.VITE_ENTRA_TENANT_ID);
  const clientId = requiredEnv('VITE_ENTRA_CLIENT_ID', import.meta.env.VITE_ENTRA_CLIENT_ID);

  return new PublicClientApplication({
    auth: {
      authority: `https://login.microsoftonline.com/${tenantId}`,
      clientId,
      // IMPORTANT: must match Entra redirect URIs
      redirectUri: `${window.location.origin}/login`,
      postLogoutRedirectUri: `${window.location.origin}/login`,
    },
    cache: {
      cacheLocation: 'localStorage',
      storeAuthStateInCookie: false,
    },
  });
}

let _msalInstance: PublicClientApplication | null = null;

function msal(): PublicClientApplication {
  if (!_msalInstance) {
    _msalInstance = createMsalInstance();
  }
  return _msalInstance;
}

/* =========================================================
 * Token helpers
 * ========================================================= */

function getApiScopes(): string[] {
  // Example: api://<API_APP_ID>/access_as_user
  const scope = requiredEnv('VITE_ENTRA_API_SCOPE', import.meta.env.VITE_ENTRA_API_SCOPE);
  return [scope];
}

function pickAccount(accounts: AccountInfo[]): AccountInfo | null {
  if (!accounts || accounts.length === 0) return null;
  return accounts[0];
}

async function acquireApiToken(account: AccountInfo): Promise<AuthenticationResult> {
  return msal().acquireTokenSilent({
    account,
    scopes: getApiScopes(),
  });
}

/* =========================================================
 * Public API
 * ========================================================= */

/**
 * Called on app bootstrap / route guard.
 * Restores session after redirect.
 */
export async function entraTrySilentLogin(): Promise<string | null> {
  if (getAuthMode() !== 'entra') return null;

  const accounts = msal().getAllAccounts();
  const account = pickAccount(accounts);
  if (!account) return null;

  try {
    const result = await acquireApiToken(account);
    if (result?.accessToken) {
      setAuthToken(result.accessToken);
      return result.accessToken;
    }
    return null;
  } catch (err) {
    if (err instanceof InteractionRequiredAuthError) {
      return null;
    }
    throw err;
  }
}

/**
 * LOGIN — Redirect flow (MANDATORY for Azure Static Web Apps)
 */
export async function entraLoginRedirect(): Promise<void> {
  if (getAuthMode() !== 'entra') {
    throw new Error('Entra auth not enabled');
  }

  await msal().loginRedirect({
    scopes: getApiScopes(),
  });

  // IMPORTANT:
  // execution stops here — browser will redirect
}

/**
 * LOGOUT — Redirect flow
 */
export async function entraLogout(): Promise<void> {
  clearAuthToken();

  const account = pickAccount(msal().getAllAccounts());

  await msal().logoutRedirect({
    account: account ?? undefined,
    postLogoutRedirectUri: `${window.location.origin}/login`,
  });
}
