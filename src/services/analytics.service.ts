import { api, endpoints } from '../api';
import type { EntityTreeResponse } from '../types';

export async function getEntityTree(): Promise<EntityTreeResponse> {
  return api.get<EntityTreeResponse>(endpoints.analytics.entityTree);
}
