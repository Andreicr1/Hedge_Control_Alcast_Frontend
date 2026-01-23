import {
  PublicClientApplication,
  type AccountInfo,
  type AuthenticationResult,
  InteractionRequiredAuthError,
} from '@azure/msal-browser';

import { clearAuthToken, setAuthToken } from '../api/client';

export type AuthMode = 'local' | 'entra';

function envVal(v: unknown): string {
  return String(v || '').trim();
}

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

  if (import.meta.env.PROD && isEntraConfigured()) return 'entra';
  return 'local';
}

function requiredEnv(name: string, value: unknown): string {
  const s = envVal(value);
  if (!s) throw new Error(`Missing ${name} env var`);
  return s;
}

let _msal: PublicClientApplication | null = null;

function msal(): PublicClientApplication {
  if (_msal) return _msal;

  const tenantId = requiredEnv('VITE_ENTRA_TENANT_ID', import.meta.env.VITE_ENTRA_TENANT_ID);
  const clientId = requiredEnv('VITE_ENTRA_CLIENT_ID', import.meta.env.VITE_ENTRA_CLIENT_ID);

  _msal = new PublicClientApplication({
    auth: {
      authority: `https://login.microsoftonline.com/${tenantId}`,
      clientId,
      redirectUri: `${window.location.origin}/login`,
      postLogoutRedirectUri: `${window.location.origin}/login`,
    },
    cache: {
      cacheLocation: 'localStorage',
      storeAuthStateInCookie: false,
    },
  });

  return _msal;
}

function getApiScopes(): string[] {
  return [requiredEnv('VITE_ENTRA_API_SCOPE', import.meta.env.VITE_ENTRA_API_SCOPE)];
}

function pickAccount(accounts: AccountInfo[]): AccountInfo | null {
  return accounts?.[0] ?? null;
}

/**
 * 🔑 PROCESSA O REDIRECT DO ENTRA
 * Isso PRECISA rodar no boot da aplicação
 */
export async function entraHandleRedirect(): Promise<string | null> {
  if (getAuthMode() !== 'entra') return null;

  const result = await msal().handleRedirectPromise();

  if (!result) return null;

  setAuthToken(result.accessToken);
  return result.accessToken;
}

async function acquireApiToken(account: AccountInfo): Promise<AuthenticationResult> {
  return msal().acquireTokenSilent({
    account,
    scopes: getApiScopes(),
  });
}

export async function entraTrySilentLogin(): Promise<string | null> {
  if (getAuthMode() !== 'entra') return null;

  const account = pickAccount(msal().getAllAccounts());
  if (!account) return null;

  try {
    const result = await acquireApiToken(account);
    setAuthToken(result.accessToken);
    return result.accessToken;
  } catch (err) {
    if (err instanceof InteractionRequiredAuthError) {
      return null;
    }
    throw err;
  }
}

export async function entraLoginRedirect(): Promise<void> {
  if (getAuthMode() !== 'entra') {
    throw new Error('Entra auth not enabled');
  }

  await msal().loginRedirect({
    scopes: getApiScopes(),
  });
}

export async function entraLogout(): Promise<void> {
  clearAuthToken();

  const account = pickAccount(msal().getAllAccounts());
  if (!account) return;

  await msal().logoutRedirect({ account });
}
