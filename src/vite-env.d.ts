/// <reference types="vite/client" />

interface ImportMetaEnv {
  // API
  readonly VITE_API_BASE_URL: string;
  readonly VITE_API_DEBUG?: 'true' | 'false';

  // Auth
  readonly VITE_AUTH_MODE?: 'local' | 'entra';
  readonly VITE_AUTO_LOGIN_DEV?: 'true' | 'false';

  // Microsoft Entra ID (Azure AD)
  readonly VITE_ENTRA_TENANT_ID?: string;
  readonly VITE_ENTRA_CLIENT_ID?: string;
  readonly VITE_ENTRA_API_SCOPE?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
