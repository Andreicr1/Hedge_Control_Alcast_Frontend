import type { ApiError } from '../types';

export function getInstitutionalErrorMessage(error: ApiError | null | undefined): string {
  const status = error?.status_code;

  if (status === 401) {
    return 'Sessão expirada. Faça login novamente.';
  }

  if (status === 403) {
    return 'Ação não permitida para este perfil.';
  }

  if (status === 404) {
    return 'Nenhum dado encontrado.';
  }

  // Conectividade/timeout/gateway
  if (status === 0 || status === 408 || status === 502 || status === 503 || status === 504) {
    return 'Serviço temporariamente indisponível. Tente novamente em alguns instantes.';
  }

  return 'Não foi possível concluir a operação. Tente novamente.';
}

export function getInstitutionalErrorMessageFromUnknown(error: unknown): string {
  const maybe = error as Partial<ApiError> | null | undefined;
  const status = typeof maybe?.status_code === 'number' ? maybe.status_code : undefined;

  const normalized: ApiError = {
    detail: typeof maybe?.detail === 'string' ? maybe.detail : '',
    status_code: status,
  };

  return getInstitutionalErrorMessage(normalized);
}
