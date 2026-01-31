/**
 * Governance Observability Types
 *
 * Frontend renders backend-provided governance snapshot fields.
 * No business logic is re-derived here.
 */

export type GovernanceHealthStatus = 'GREEN' | 'AMBER' | 'RED';

export interface GovernanceMetric {
  value: unknown;
  description: string;
  expected_zero: boolean;
  invariant: boolean;
  risk_signal: boolean;
}

export interface GovernanceHealthSnapshot {
  as_of_utc: string;
  stale_days: number;
  break_glass_days: number;

  metadata: Record<string, unknown> & {
    assumptions?: Record<string, string>;
  };

  locked_state_integrity: Record<string, GovernanceMetric>;
  exposure_governance: Record<string, GovernanceMetric>;
  lifecycle_hygiene: Record<string, GovernanceMetric>;
  governance_exceptions: Record<string, GovernanceMetric>;

  governance_health: Record<string, unknown> & {
    status: GovernanceHealthStatus;
    logic?: string[];
    invariant_breaches?: string[];
    risk_signals?: string[];
  };
}
