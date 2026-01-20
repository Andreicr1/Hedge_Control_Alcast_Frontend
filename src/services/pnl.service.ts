/**
 * P&L Service (Portfolio)
 *
 * Backend is the source of truth.
 *
 * Endpoints:
 * - GET /pnl (aggregate)
 * - GET /pnl/contracts/{contract_id} (detail)
 * - POST /pnl/snapshots (materialize/dry-run) [not used by minimal UI]
 */

import { api, endpoints } from '../api';
import {
  PnlAggregateResponse,
  PnlSnapshotExecuteResponse,
  PnlSnapshotRequest,
} from '../types';

export interface PnlAggregateQuery {
  as_of_date?: string; // YYYY-MM-DD
  deal_id?: number;
  contract_id?: string;
  counterparty_id?: number;
}

function toQueryString(query: Record<string, string | number | undefined>): string {
  const params = new URLSearchParams();
  Object.entries(query).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return;
    params.set(key, String(value));
  });
  const qs = params.toString();
  return qs ? `?${qs}` : '';
}

export async function getPnlAggregated(query: PnlAggregateQuery = {}): Promise<PnlAggregateResponse> {
  const qs = toQueryString({
    as_of_date: query.as_of_date,
    deal_id: query.deal_id,
    contract_id: query.contract_id,
    counterparty_id: query.counterparty_id,
  });
  return api.get<PnlAggregateResponse>(`${endpoints.pnl.aggregated}${qs}`);
}

export async function createPnlSnapshot(payload: PnlSnapshotRequest): Promise<PnlSnapshotExecuteResponse> {
  const body = {
    as_of_date: payload.as_of_date,
    filters: payload.filters || {},
    dry_run: Boolean(payload.dry_run),
  };
  return api.post<PnlSnapshotExecuteResponse>(endpoints.pnl.createSnapshot, body);
}

export function formatUsd(value: number | null | undefined): string {
  if (value === null || value === undefined) return '—';
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}

export default {
  getAggregated: getPnlAggregated,
  createSnapshot: createPnlSnapshot,
};
