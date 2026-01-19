import { api, endpoints } from '../api';
import type { EntityTreeResponse } from '../types';

export type EntityTreeQuery = {
  deal_ids?: number[];
  limit_deals?: number;
};

function buildEntityTreeUrl(query?: EntityTreeQuery): string {
  if (!query) return endpoints.analytics.entityTree;

  const params = new URLSearchParams();

  for (const id of query.deal_ids ?? []) {
    if (typeof id !== 'number' || !Number.isFinite(id)) continue;
    params.append('deal_ids', String(id));
  }

  if (typeof query.limit_deals === 'number' && Number.isFinite(query.limit_deals)) {
    params.set('limit_deals', String(query.limit_deals));
  }

  const qs = params.toString();
  return qs ? `${endpoints.analytics.entityTree}?${qs}` : endpoints.analytics.entityTree;
}

export async function getEntityTree(query?: EntityTreeQuery): Promise<EntityTreeResponse> {
  return api.get<EntityTreeResponse>(buildEntityTreeUrl(query));
}
