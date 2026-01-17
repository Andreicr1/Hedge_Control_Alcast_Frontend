/**
 * Cashflow Service (read-only v0)
 *
 * Consumes backend GET /cashflow.
 * Frontend must not compute or infer valuation logic.
 */

import { api, endpoints } from '../api';
import type { CashflowQueryParams, CashflowResponse } from '../types';

function buildQuery(params: CashflowQueryParams): string {
  const sp = new URLSearchParams();

  if (params.start_date) sp.set('start_date', params.start_date);
  if (params.end_date) sp.set('end_date', params.end_date);
  if (params.as_of) sp.set('as_of', params.as_of);

  if (params.contract_id) sp.set('contract_id', params.contract_id);
  if (params.counterparty_id !== undefined) sp.set('counterparty_id', String(params.counterparty_id));
  if (params.deal_id !== undefined) sp.set('deal_id', String(params.deal_id));
  if (params.limit !== undefined) sp.set('limit', String(params.limit));

  const qs = sp.toString();
  return qs ? `?${qs}` : '';
}

export async function getCashflow(params: CashflowQueryParams): Promise<CashflowResponse> {
  const qs = buildQuery(params);
  return api.get<CashflowResponse>(`${endpoints.cashflow.list}${qs}`);
}
