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

  // Safety net: if production is configured for Entra but VITE_AUTH_MODE wasn't embedded
  // correctly at build time, still show the Entra login path.
  if (import.meta.env.PROD && isEntraConfigured()) return 'entra';

  return 'local';
}

function requiredEnv(name: string, value: unknown): string {
  const s = envVal(value);
  if (!s) {
    throw new Error(`Missing ${name} env var`);
  }
  return s;
}

function getMsalInstance(): PublicClientApplication {
  const tenantId = requiredEnv('VITE_ENTRA_TENANT_ID', import.meta.env.VITE_ENTRA_TENANT_ID);
  const clientId = requiredEnv('VITE_ENTRA_CLIENT_ID', import.meta.env.VITE_ENTRA_CLIENT_ID);

  return new PublicClientApplication({
    auth: {
      authority: `https://login.microsoftonline.com/${tenantId}`,
      clientId,
      redirectUri: window.location.origin,
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
    _msalInstance = getMsalInstance();
  }
  return _msalInstance;
}

function getApiScopes(): string[] {
  // Typical value: api://<backend-app-client-id>/access_as_user
  const scope = requiredEnv('VITE_ENTRA_API_SCOPE', import.meta.env.VITE_ENTRA_API_SCOPE);
  return [scope];
}

function pickAccount(accounts: AccountInfo[]): AccountInfo | null {
  if (!accounts || accounts.length === 0) return null;
  return accounts[0];
}

async function acquireApiToken(account: AccountInfo): Promise<AuthenticationResult> {
  return await msal().acquireTokenSilent({
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
    const token = result.accessToken;
    if (token) {
      setAuthToken(token);
      return token;
    }
    return null;
  } catch (err) {
    if (err instanceof InteractionRequiredAuthError) {
      return null;
    }
    throw err;
  }
}

export async function entraLoginPopup(): Promise<string> {
  if (getAuthMode() !== 'entra') {
    throw new Error('Entra auth not enabled');
  }

  const login = await msal().loginPopup({
    scopes: getApiScopes(),
  });

  const account = login.account || pickAccount(msal().getAllAccounts());
  if (!account) {
    throw new Error('No account after login');
  }

  const tokenResult = await acquireApiToken(account);
  const token = tokenResult.accessToken;
  if (!token) {
    throw new Error('No access token');
  }

  setAuthToken(token);
  return token;
}

export async function entraLogout(): Promise<void> {
  clearAuthToken();

  const account = pickAccount(msal().getAllAccounts());
  if (!account) {
    return;
  }

  await msal().logoutRedirect({
    account,
  });
}

