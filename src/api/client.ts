/**
 * API Client Configuration
 * 
 * Cliente HTTP centralizado com:
 * - Base URL configurável
 * - Interceptors de autenticação
 * - Tratamento de erros padronizado
 * - Retry automático (opcional)
 */

import { ApiError } from '../types';

// ============================================
// Configuração
// ============================================

// Declared early to avoid TS2448 ("used before its declaration") in any top-level initializers below.
export const API_BASE_URL = getApiBaseUrl();

export function getApiBaseUrl(): string {
  const configured = import.meta.env.VITE_API_BASE_URL;
  if (configured) {
    return String(configured).replace(/\/+$/, '');
  }

  // Azure-only policy:
  // - PROD (Azure Static Web Apps): same-origin /api (Azure Functions proxy)
  // - DEV: require explicit Azure URL to avoid local-backend assumptions
  if (import.meta.env.DEV) {
    throw new Error(
      'Missing VITE_API_BASE_URL. Set it to an Azure endpoint, e.g. https://<SWA_HOST>/api or https://<CONTAINER_APP_FQDN>/api.'
    );
  }

  return '/api';
}

const API_TIMEOUT = 30000; // 30 segundos

function getRequestBaseUrl(): string {
  return API_BASE_URL;
}

// ============================================
// Token Management
// ============================================

let authToken: string | null = null;

function decodeJwtMeta(token: string): Record<string, unknown> | null {
  const t = String(token || '').trim();
  if (!t) return null;

  const parts = t.split('.');
  if (parts.length < 2) return null;

  const b64urlToJson = (b64url: string): any => {
    const normalized = b64url.replace(/-/g, '+').replace(/_/g, '/');
    const pad = '='.repeat((4 - (normalized.length % 4)) % 4);
    const json = atob(normalized + pad);
    return JSON.parse(json);
  };

  try {
    const header = b64urlToJson(parts[0]);
    const payload = b64urlToJson(parts[1]);
    return {
      alg: header?.alg,
      aud: payload?.aud,
      iss: payload?.iss,
      tid: payload?.tid,
      roles: payload?.roles,
      scp: payload?.scp,
      appid: payload?.appid,
      azp: payload?.azp,
    };
  } catch {
    return null;
  }
}

function persistLastAuthTokenMeta(reason: string, token: string | null): void {
  try {
    const meta = token ? decodeJwtMeta(token) : null;
    if (meta) {
      localStorage.setItem(
        'hc_last_token_meta',
        JSON.stringify({ reason, at: Date.now(), ...meta })
      );
    }
  } catch {
    // ignore storage/parse failures
  }
}

function normalizeDoubleApiPath(url: string): string {
  const input = String(url || '');
  if (!input) return input;

  const fixPath = (path: string) => path.replace(/\/api\/api(\/|$)/, '/api$1');

  if (/^https?:\/\//i.test(input)) {
    try {
      const u = new URL(input);
      u.pathname = fixPath(u.pathname);
      return u.toString();
    } catch {
      return input;
    }
  }

  return fixPath(input);
}

export function setAuthToken(token: string | null): void {
  authToken = token;
  if (token) {
    localStorage.setItem('auth_token', token);
  } else {
    localStorage.removeItem('auth_token');
  }
}

export function getAuthToken(): string | null {
  if (!authToken) {
    authToken = localStorage.getItem('auth_token');
  }
  return authToken;
}

export function clearAuthToken(): void {
  authToken = null;
  localStorage.removeItem('auth_token');
}

// ============================================
// Error Handling
// ============================================

function sanitizeBackendDetail(detail: string): string | null {
  const text = String(detail || '').trim();
  if (!text) return null;

  // Avoid leaking technical/system details.
  const suspicious = /(traceback|exception|stack|sqlalchemy|psycopg|sqlite|syntax error|undefined|nan|null\b|KeyError|TypeError|ValueError|AssertionError)/i;
  if (suspicious.test(text)) return null;
  if (/[{}\[\]]/.test(text)) return null;
  if (text.length > 180) return null;
  return text;
}

async function handleErrorResponse(response: Response): Promise<never> {
  let errorDetail = 'Não foi possível concluir a operação';
  let validationErrors = undefined;
  let detailObj: unknown = undefined;
  let responseBody: unknown = undefined;

  try {
    responseBody = await response.json();
    const errorBody = responseBody as { detail?: unknown };
    const detail = errorBody?.detail;

    if (typeof detail === 'string') {
      const safe = sanitizeBackendDetail(detail);
      if (safe && response.status >= 400 && response.status < 500) {
        errorDetail = safe;
      }
    } else if (Array.isArray(detail)) {
      // FastAPI validation errors
      validationErrors = detail as any;
      errorDetail = 'Verifique os dados informados.';
    } else if (detail && typeof detail === 'object') {
      // Structured errors (e.g., KYC gate returns {code, counterparty_id, details})
      detailObj = detail;
      // Keep a generic public message; pages can branch using detail_obj/response_body.
      errorDetail = 'Não foi possível concluir a operação';
    } else if (detail !== undefined) {
      errorDetail = 'Não foi possível concluir a operação';
    }
  } catch {
    errorDetail = response.statusText || `HTTP ${response.status}`;
  }

  // Status-specific public messages (override, keep consistent tone)
  if (response.status === 401) errorDetail = 'Sessão expirada. Faça login novamente.';
  if (response.status === 403) errorDetail = 'Acesso não autorizado para esta ação.';
  if (response.status === 404) errorDetail = 'Registro não encontrado.';
  if (response.status === 408) errorDetail = 'Tempo limite excedido. Tente novamente.';
  if (response.status === 422) errorDetail = 'Verifique os dados informados.';
  if (response.status >= 500) errorDetail = 'Não foi possível concluir a operação.';

  const error: ApiError = {
    detail: errorDetail,
    status_code: response.status,
    validation_errors: validationErrors,
    detail_obj: detailObj,
    response_body: responseBody,
  };

  // Handle specific status codes
  if (response.status === 401) {
    persistLastAuthTokenMeta('401', getAuthToken());
    clearAuthToken();
    // Opcionalmente redirecionar para login
    // window.location.href = '/login';
  }

  throw error;
}

// ============================================
// Request Helper
// ============================================

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: unknown;
  headers?: Record<string, string>;
  timeout?: number;
  skipAuth?: boolean;
}

interface RawRequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: BodyInit;
  headers?: Record<string, string>;
  timeout?: number;
  skipAuth?: boolean;
}

async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const {
    method = 'GET',
    body,
    headers = {},
    timeout = API_TIMEOUT,
    skipAuth = false,
  } = options;

  const rawUrl = endpoint.startsWith('http') ? endpoint : `${getRequestBaseUrl()}${endpoint}`;
  const url = normalizeDoubleApiPath(rawUrl);

  // Build headers
  const requestHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    ...headers,
  };

  // Add auth token if available
  const token = getAuthToken();
  if (token && !skipAuth) {
    const bearer = `Bearer ${token}`;
    requestHeaders['Authorization'] = bearer;
    // Some platforms can interfere with the standard Authorization header.
    // We also send a custom header so the SWA-integrated Functions proxy can forward it reliably.
    requestHeaders['x-hc-authorization'] = bearer;
  }

  // Create abort controller for timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      method,
      headers: requestHeaders,
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      await handleErrorResponse(response);
    }

    // Handle empty responses
    if (response.status === 204) {
      return undefined as T;
    }

    return await response.json();
  } catch (error) {
    clearTimeout(timeoutId);

    if (error instanceof DOMException && error.name === 'AbortError') {
      throw {
        detail: 'Timeout: A requisição demorou muito',
        status_code: 408,
      } as ApiError;
    }

    if ((error as ApiError).detail) {
      throw error;
    }

    throw {
      detail: 'Erro de conexão com o servidor',
      status_code: 0,
    } as ApiError;
  }
}

async function requestRaw(endpoint: string, options: RawRequestOptions = {}): Promise<Response> {
  const {
    method = 'GET',
    body,
    headers = {},
    timeout = API_TIMEOUT,
    skipAuth = false,
  } = options;

  const rawUrl = endpoint.startsWith('http') ? endpoint : `${getRequestBaseUrl()}${endpoint}`;
  const url = normalizeDoubleApiPath(rawUrl);

  const requestHeaders: Record<string, string> = {
    ...headers,
  };

  const token = getAuthToken();
  if (token && !skipAuth) {
    const bearer = `Bearer ${token}`;
    requestHeaders['Authorization'] = bearer;
    requestHeaders['x-hc-authorization'] = bearer;
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      method,
      headers: requestHeaders,
      body,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      await handleErrorResponse(response);
    }

    return response;
  } catch (error) {
    clearTimeout(timeoutId);

    if (error instanceof DOMException && error.name === 'AbortError') {
      throw {
        detail: 'Timeout: A requisição demorou muito',
        status_code: 408,
      } as ApiError;
    }

    if ((error as ApiError).detail) {
      throw error;
    }

    throw {
      detail: 'Erro de conexão com o servidor',
      status_code: 0,
    } as ApiError;
  }
}

// ============================================
// HTTP Methods
// ============================================

export const api = {
  get<T>(endpoint: string, options?: Omit<RequestOptions, 'method' | 'body'>): Promise<T> {
    return request<T>(endpoint, { ...options, method: 'GET' });
  },

  post<T>(endpoint: string, body?: unknown, options?: Omit<RequestOptions, 'method' | 'body'>): Promise<T> {
    return request<T>(endpoint, { ...options, method: 'POST', body });
  },

  put<T>(endpoint: string, body?: unknown, options?: Omit<RequestOptions, 'method' | 'body'>): Promise<T> {
    return request<T>(endpoint, { ...options, method: 'PUT', body });
  },

  patch<T>(endpoint: string, body?: unknown, options?: Omit<RequestOptions, 'method' | 'body'>): Promise<T> {
    return request<T>(endpoint, { ...options, method: 'PATCH', body });
  },

  delete<T>(endpoint: string, options?: Omit<RequestOptions, 'method' | 'body'>): Promise<T> {
    return request<T>(endpoint, { ...options, method: 'DELETE' });
  },

  postForm<T>(endpoint: string, form: FormData, options?: Omit<RawRequestOptions, 'method' | 'body'>): Promise<T> {
    return requestRaw(endpoint, { ...options, method: 'POST', body: form }).then((r) => r.json());
  },

  getBlob(endpoint: string, options?: Omit<RawRequestOptions, 'method' | 'body'>): Promise<Response> {
    return requestRaw(endpoint, { ...options, method: 'GET' });
  },
};

// ============================================
// Endpoints centralizados
// ============================================

export const endpoints = {
  // Auth
  auth: {
    login: '/auth/token',
    me: '/auth/me',
    // Note: /auth/refresh not implemented in backend - tokens are short-lived
  },

  // Analytics (shared selection/tree)
  analytics: {
    entityTree: '/analytics/entity-tree',
  },

  // Dashboard
  dashboard: {
    summary: '/dashboard/summary',
  },

  // Alumínio LME (APIs reais)
  aluminum: {
    live: '/market/lme/aluminum/live',
    historyCash: '/market/lme/aluminum/history/cash',
    history3m: '/market/lme/aluminum/history/3m',
    officialLatest: '/market/lme/aluminum/official/latest',
  },

  // Settlements (APIs reais)
  settlements: {
    today: '/contracts/settlements/today',
    upcoming: (limit: number = 10) => `/contracts/settlements/upcoming?limit=${limit}`,
  },

  // Cashflow (read-only v0)
  cashflow: {
    list: '/cashflow',
    analytic: '/cashflow/analytic',
  },

  // Deals
  deals: {
    list: '/deals',
    create: '/deals',
    detail: (id: number) => `/deals/${id}`,
    update: (id: number) => `/deals/${id}`,
    pnl: (id: number) => `/deals/${id}/pnl`,
  },

  // P&L (Portfolio snapshots/read models)
  pnl: {
    aggregated: '/pnl',
    createSnapshot: '/pnl/snapshots',
  },

  // Sales Orders
  salesOrders: {
    list: '/sales-orders',
    detail: (id: number) => `/sales-orders/${id}`,
    create: '/sales-orders',
    update: (id: number) => `/sales-orders/${id}`,
    delete: (id: number) => `/sales-orders/${id}`,
  },

  // Purchase Orders
  purchaseOrders: {
    list: '/purchase-orders',
    detail: (id: number) => `/purchase-orders/${id}`,
    create: '/purchase-orders',
    update: (id: number) => `/purchase-orders/${id}`,
    delete: (id: number) => `/purchase-orders/${id}`,
  },

  // RFQs
  rfqs: {
    list: '/rfqs',
    detail: (id: number) => `/rfqs/${id}`,
    create: '/rfqs',
    update: (id: number) => `/rfqs/${id}`,
    send: (id: number) => `/rfqs/${id}/send`,
    award: (id: number) => `/rfqs/${id}/award`,
    cancel: (id: number) => `/rfqs/${id}/cancel`,
    addQuote: (id: number) => `/rfqs/${id}/quotes`,
    exportQuotes: (id: number) => `/rfqs/${id}/quotes/export`,
    preview: '/rfqs/preview',
    sendAttempts: (id: number) => `/rfqs/${id}/send-attempts`,
    updateAttemptStatus: (rfqId: number, attemptId: number) => `/rfqs/${rfqId}/send-attempts/${attemptId}/status`,
  },

  // Contracts
  contracts: {
    list: '/contracts',
    detail: (id: string) => `/contracts/${id}`,
    exposures: (id: string) => `/contracts/${id}/exposures`,
    byRfq: (rfqId: number) => `/contracts?rfq_id=${rfqId}`,
    byDeal: (dealId: number) => `/contracts?deal_id=${dealId}`,

    documents: {
      list: (contractId: string) => `/contracts/${contractId}/documents`,
      upload: (contractId: string) => `/contracts/${contractId}/documents`,
      view: (contractId: string, documentId: number) =>
        `/contracts/${contractId}/documents/${documentId}/view`,
      download: (contractId: string, documentId: number) =>
        `/contracts/${contractId}/documents/${documentId}/download`,
    },
  },

  // Exposures
  exposures: {
    list: '/exposures',
  },

  // Inbox (Financeiro Workbench)
  inbox: {
    counts: '/inbox/counts',
    workbench: '/inbox/workbench',
    exposureDetail: (id: number) => `/inbox/exposures/${id}`,
    exposureDecisions: (id: number) => `/inbox/exposures/${id}/decisions`,
  },

  // Workflows (T3 approvals)
  workflows: {
    requests: '/workflows/requests',
    requestDetail: (id: number) => `/workflows/requests/${id}`,
    decisions: (id: number) => `/workflows/requests/${id}/decisions`,
  },

  // Counterparties
  counterparties: {
    list: '/counterparties',
    detail: (id: number) => `/counterparties/${id}`,
    create: '/counterparties',
    update: (id: number) => `/counterparties/${id}`,
    delete: (id: number) => `/counterparties/${id}`,
    kycPreflight: (id: number) => `/counterparties/${id}/kyc/preflight`,
  },

  // Timeline (read-only v1)
  timeline: {
    list: '/timeline',
    recent: '/timeline/recent',

    // Human collaboration (T1)
    humanCommentCreate: '/timeline/human/comments',
    humanCommentCorrect: '/timeline/human/comments/corrections',
    humanAttachmentCreate: '/timeline/human/attachments',
    humanAttachmentUpload: '/timeline/human/attachments/upload',
    humanAttachmentDownload: (eventId: number) => `/timeline/human/attachments/${eventId}/download`,
  },

  // Governance (read-only observability)
  governance: {
    health: '/governance/health',
  },

  // Exports (jobs + manifest + download)
  exports: {
    create: '/exports',
    status: (exportId: string) => `/exports/${exportId}`,
    download: (exportId: string) => `/exports/${exportId}/download`,
    manifest: '/exports/manifest',
  },

  // Hedges
  hedges: {
    list: '/hedges',
    detail: (id: number) => `/hedges/${id}`,
    create: '/hedges',
    update: (id: number) => `/hedges/${id}`,
  },

  // Suppliers
  suppliers: {
    list: '/suppliers',
    detail: (id: number) => `/suppliers/${id}`,
    create: '/suppliers',
    update: (id: number) => `/suppliers/${id}`,
    delete: (id: number) => `/suppliers/${id}`,
  },

  // Customers
  customers: {
    list: '/customers',
    detail: (id: number) => `/customers/${id}`,
    create: '/customers',
    update: (id: number) => `/customers/${id}`,
    delete: (id: number) => `/customers/${id}`,
  },

  // MTM
  mtm: {
    compute: '/mtm/compute',
    portfolio: '/mtm/portfolio',
    snapshots: '/mtm/snapshots',
  },

  // Market Data
  market: {
    prices: '/market-data',
    aluminum: '/market/aluminum',
    lme: '/market-data/lme',
    westmetall: '/market-data/westmetall',
  },

  // Health
  health: '/health',
};

export default api;
