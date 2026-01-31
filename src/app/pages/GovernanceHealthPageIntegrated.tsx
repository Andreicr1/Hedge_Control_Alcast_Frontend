/**
 * Governance Health Page (Admin-only, read-only)
 *
 * Renders backend-provided governance health snapshot.
 */

import { useMemo } from 'react';
import { useGovernanceHealth } from '../../hooks/useGovernanceHealth';
import { FioriGovernanceMetadata } from '../components/fiori/FioriGovernanceMetadata';
import type { GovernanceMetric, GovernanceHealthSnapshot, GovernanceHealthStatus } from '../../types/governance';
import {
  Button,
  BusyIndicator,
  Card,
  FlexBox,
  FlexBoxAlignItems,
  FlexBoxDirection,
  FlexBoxJustifyContent,
  Label,
  MessageStrip,
  ObjectStatus,
  Table,
  TableCell,
  TableHeaderCell,
  TableHeaderRow,
  TableRow,
  Text,
  Title,
} from '@ui5/webcomponents-react';
import ValueState from '@ui5/webcomponents-base/dist/types/ValueState.js';
import { UX_COPY } from '../ux/copy';
import { formatDateTime } from '../ux/format';

import '@ui5/webcomponents-icons/dist/refresh.js';

function asNumber(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  return null;
}

function formatDateTimeMaybe(raw: unknown): string {
  if (!raw) return '—';
  const s = String(raw);
  return formatDateTime(s);
}

function statusValueState(status: GovernanceHealthStatus): ValueState {
  if (status === 'GREEN') return ValueState.Positive;
  if (status === 'AMBER') return ValueState.Critical;
  return ValueState.Negative;
}

function flattenMetrics(snapshot: GovernanceHealthSnapshot) {
  const sections: Array<{ section: string; metrics: Record<string, GovernanceMetric> }> = [
    { section: 'locked_state_integrity', metrics: snapshot.locked_state_integrity || {} },
    { section: 'exposure_governance', metrics: snapshot.exposure_governance || {} },
    { section: 'lifecycle_hygiene', metrics: snapshot.lifecycle_hygiene || {} },
    { section: 'governance_exceptions', metrics: snapshot.governance_exceptions || {} },
  ];

  const rows: Array<{ section: string; key: string; metric: GovernanceMetric }> = [];
  for (const s of sections) {
    for (const [key, metric] of Object.entries(s.metrics || {})) {
      rows.push({ section: s.section, key, metric });
    }
  }
  return rows;
}

function MetricsTable({
  rows,
  emptyText,
}: {
  rows: Array<{ section: string; key: string; metric: GovernanceMetric }>;
  emptyText: string;
}) {
  return (
    <Table
      noDataText={emptyText}
      headerRow={
        <TableHeaderRow>
          <TableHeaderCell>
            <Label>Métrica</Label>
          </TableHeaderCell>
          <TableHeaderCell>
            <Label>Valor</Label>
          </TableHeaderCell>
          <TableHeaderCell>
            <Label>Descrição</Label>
          </TableHeaderCell>
        </TableHeaderRow>
      }
    >
      {rows.map((r) => (
        <TableRow key={`${r.section}:${r.key}`} rowKey={`${r.section}:${r.key}`}>
          <TableCell>
            <Text style={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>{r.key}</Text>
          </TableCell>
          <TableCell>
            <Text style={{ fontWeight: 700 }}>{String(r.metric.value)}</Text>
          </TableCell>
          <TableCell>
            <Text style={{ opacity: 0.8 }}>{r.metric.description}</Text>
          </TableCell>
        </TableRow>
      ))}
    </Table>
  );
}

export function GovernanceHealthPageIntegrated() {
  const { snapshot, isLoading, isError, error, refetch } = useGovernanceHealth();

  const status: GovernanceHealthStatus | null = snapshot?.governance_health?.status ?? null;

  const flattened = useMemo(() => (snapshot ? flattenMetrics(snapshot) : []), [snapshot]);

  const invariantBreaches = useMemo(() => {
    if (!snapshot) return [];
    return flattened
      .filter((r) => r.metric.invariant && r.metric.expected_zero)
      .filter((r) => {
        const n = asNumber(r.metric.value);
        return typeof n === 'number' && n > 0;
      })
      .map((r) => r);
  }, [snapshot, flattened]);

  const riskSignals = useMemo(() => {
    if (!snapshot) return [];
    return flattened
      .filter((r) => r.metric.risk_signal)
      .filter((r) => {
        const n = asNumber(r.metric.value);
        return typeof n === 'number' && n > 0;
      })
      .map((r) => r);
  }, [snapshot, flattened]);

  const breakGlass = useMemo(() => {
    const countsLastN = snapshot?.governance_exceptions?.break_glass_counts_last_n_days?.value;
    const countsAll = snapshot?.governance_exceptions?.break_glass_counts_all_time?.value;

    const lastN = (countsLastN && typeof countsLastN === 'object' ? (countsLastN as Record<string, unknown>) : {}) as Record<string, unknown>;
    const allT = (countsAll && typeof countsAll === 'object' ? (countsAll as Record<string, unknown>) : {}) as Record<string, unknown>;

    const keys = Array.from(new Set([...Object.keys(lastN), ...Object.keys(allT)])).sort((a, b) => a.localeCompare(b));
    return {
      keys,
      lastN,
      allT,
      mostRecentAt: snapshot?.governance_exceptions?.most_recent_break_glass_timestamp?.value,
      mostRecentActor: snapshot?.governance_exceptions?.most_recent_break_glass_actor?.value,
    };
  }, [snapshot]);

  if (isLoading && !snapshot) {
    return (
      <div className="sap-fiori-page p-4">
        <FlexBox
          direction={FlexBoxDirection.Column}
          alignItems={FlexBoxAlignItems.Center}
          justifyContent={FlexBoxJustifyContent.Center}
          gap="0.75rem"
          style={{ minHeight: 400 }}
        >
          <BusyIndicator active size="M" />
          <Text>Carregando saúde de governança...</Text>
        </FlexBox>
      </div>
    );
  }

  if (isError) {
    const messageLines = UX_COPY.errors.message.split('\n');
    return (
      <div className="sap-fiori-page p-4">
        <FlexBox
          direction={FlexBoxDirection.Column}
          alignItems={FlexBoxAlignItems.Center}
          justifyContent={FlexBoxJustifyContent.Center}
          gap="0.75rem"
          style={{ minHeight: 400 }}
        >
          <Title level="H2">{UX_COPY.errors.title}</Title>
          <MessageStrip design="Negative" hideCloseButton>
            <div>
              {messageLines.map((line, idx) => (
                <div key={idx}>{line}</div>
              ))}
            </div>
          </MessageStrip>
          <Button icon="refresh" design="Emphasized" onClick={() => refetch()}>
            {UX_COPY.errors.retry}
          </Button>
          {error?.detail ? (
            <Text style={{ opacity: 0.7 }}>{/* deterministic surfacing of backend summary */}{error.detail}</Text>
          ) : null}
        </FlexBox>
      </div>
    );
  }

  if (!snapshot || !status) {
    return (
      <div className="sap-fiori-page p-4">
        <div className="sap-fiori-section">
          <div className="sap-fiori-section-content">
            <div className="text-sm text-[var(--sapContent_LabelColor,#556b82)]">Nenhum dado disponível.</div>
          </div>
        </div>
      </div>
    );
  }

  const valueState = statusValueState(status);
  const logicLines = Array.isArray(snapshot.governance_health?.logic) ? (snapshot.governance_health.logic as string[]) : [];
  const assumptions = (snapshot.metadata as any)?.assumptions as Record<string, string> | undefined;

  return (
    <div className="sap-fiori-page p-4">
      <Card>
        <div className="p-4">
          <FlexBox direction={FlexBoxDirection.Column} gap="0.5rem">
            <FlexBox justifyContent={FlexBoxJustifyContent.SpaceBetween} alignItems={FlexBoxAlignItems.Center} style={{ gap: '0.75rem' }}>
              <div>
                <Title level="H1">Saúde de Governança</Title>
                <Text> Página institucional (somente leitura). Fonte única: backend /governance/health.</Text>
              </div>
              <Button icon="refresh" design="Transparent" onClick={() => refetch()} disabled={isLoading}>
                Atualizar
              </Button>
            </FlexBox>
          </FlexBox>
        </div>
      </Card>

      <div className="mb-4">
        <FioriGovernanceMetadata
          calculatedAt={formatDateTimeMaybe(snapshot.as_of_utc)}
          source="Backend /governance/health"
          refreshable
          onRefresh={() => refetch()}
        />
      </div>

      {/* Status */}
      <Card className="mb-4">
        <div className="p-4">
          <FlexBox direction={FlexBoxDirection.Column} gap="0.75rem">
            <FlexBox justifyContent={FlexBoxJustifyContent.SpaceBetween} alignItems={FlexBoxAlignItems.Start} style={{ gap: '0.75rem' }}>
              <div>
                <ObjectStatus state={valueState}>Status: {status}</ObjectStatus>
                <div className="text-sm text-[var(--sapContent_LabelColor,#556b82)] mt-2">
                  Invariantes com violação: <span className="font-['72:Semibold_Duplex',sans-serif]">{invariantBreaches.length}</span> •
                  Sinais de risco: <span className="font-['72:Semibold_Duplex',sans-serif]">{riskSignals.length}</span>
                </div>
              </div>
            </FlexBox>

            {logicLines.length > 0 && (
              <div className="mt-3 text-xs text-[var(--sapContent_LabelColor,#556b82)]">
                <div className="font-['72:Bold',sans-serif] mb-1">Lógica (backend)</div>
                <ul className="list-disc pl-5">
                  {logicLines.map((line, idx) => (
                    <li key={idx}>{line}</li>
                  ))}
                </ul>
              </div>
            )}

            {assumptions && (
              <div className="mt-3 text-xs text-[var(--sapContent_LabelColor,#556b82)]">
                <div className="font-['72:Bold',sans-serif] mb-1">Assumptions (backend)</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {Object.entries(assumptions).map(([k, v]) => (
                    <div key={k} className="flex items-center justify-between gap-2">
                      <span className="opacity-80">{k}</span>
                      <span className="font-['72:Semibold_Duplex',sans-serif]">{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </FlexBox>
        </div>
      </Card>

      {/* Invariant breaches (RED only) */}
      {status === 'RED' && (
        <div className="sap-fiori-section mb-4">
          <div className="sap-fiori-section-content">
            <div className="text-sm font-['72:Bold',sans-serif] mb-2 text-[var(--sapNegativeTextColor,#b00)]">
              Invariantes violadas (ação necessária)
            </div>
            <Card>
              <div className="p-2">
                <MetricsTable rows={invariantBreaches} emptyText="Nenhuma." />
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* Risk signals (AMBER/RED only) */}
      {(status === 'AMBER' || status === 'RED') && (
        <div className="sap-fiori-section mb-4">
          <div className="sap-fiori-section-content">
            <div className="text-sm font-['72:Bold',sans-serif] mb-2 text-[var(--sapTextColor,#131e29)]">
              Sinais de risco (monitorar)
            </div>
            <Card>
              <div className="p-2">
                <MetricsTable rows={riskSignals} emptyText="Nenhum." />
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* Break-glass */}
      <div className="sap-fiori-section">
        <div className="sap-fiori-section-content">
          <div className="text-sm font-['72:Bold',sans-serif] mb-2 text-[var(--sapTextColor,#131e29)]">Break-glass (exceções)</div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3 text-sm">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[var(--sapContent_LabelColor,#556b82)]">Último break-glass</span>
              <span className="text-[var(--sapTextColor,#131e29)]">{formatDateTimeMaybe(breakGlass.mostRecentAt)}</span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-[var(--sapContent_LabelColor,#556b82)]">Ator</span>
              <span className="text-[var(--sapTextColor,#131e29)]">{breakGlass.mostRecentActor ? String(breakGlass.mostRecentActor) : '—'}</span>
            </div>
          </div>

          {breakGlass.keys.length === 0 ? (
            <div className="text-sm text-[var(--sapContent_LabelColor,#556b82)]">Nenhuma ação de break-glass registrada.</div>
          ) : (
            <Table
              noDataText="Nenhuma ação de break-glass registrada."
              headerRow={
                <TableHeaderRow>
                  <TableHeaderCell>
                    <Label>Ação</Label>
                  </TableHeaderCell>
                  <TableHeaderCell>
                    <Label>Últimos {snapshot.break_glass_days} dias</Label>
                  </TableHeaderCell>
                  <TableHeaderCell>
                    <Label>Total</Label>
                  </TableHeaderCell>
                </TableHeaderRow>
              }
            >
              {breakGlass.keys.map((k) => (
                <TableRow key={k} rowKey={k}>
                  <TableCell>
                    <Text style={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>{k}</Text>
                  </TableCell>
                  <TableCell>
                    <Text>{String(breakGlass.lastN[k] ?? 0)}</Text>
                  </TableCell>
                  <TableCell>
                    <Text>{String(breakGlass.allT[k] ?? 0)}</Text>
                  </TableCell>
                </TableRow>
              ))}
            </Table>
          )}
        </div>
      </div>
    </div>
  );
}
