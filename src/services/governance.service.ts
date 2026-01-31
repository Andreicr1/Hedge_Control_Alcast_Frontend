/**
 * Governance Service (read-only)
 *
 * Consumes backend governance observability endpoints.
 * The frontend never recalculates governance semantics — it only renders backend data.
 */

import { api, endpoints } from '../api';
import type { GovernanceHealthSnapshot } from '../types/governance';

export async function getGovernanceHealthSnapshot(params?: {
  staleDays?: number;
  breakGlassDays?: number;
}): Promise<GovernanceHealthSnapshot> {
  const staleDays = params?.staleDays;
  const breakGlassDays = params?.breakGlassDays;

  const search = new URLSearchParams();
  if (typeof staleDays === 'number') search.set('stale_days', String(staleDays));
  if (typeof breakGlassDays === 'number') search.set('break_glass_days', String(breakGlassDays));

  const qs = search.toString();
  const url = qs ? `${endpoints.governance.health}?${qs}` : endpoints.governance.health;

  return api.get<GovernanceHealthSnapshot>(url);
}
