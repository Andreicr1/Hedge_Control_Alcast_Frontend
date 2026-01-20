/**
 * Team Activities / Inbox - Cleaned Up
 *
 * Mandatory Correction:
 * - Remove backend timestamps and technical events
 * - Show ONLY institutional events
 * - Human language, short, auditable
 * - Backend logs NEVER appear in UI
 */

import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInboxWorkbench, useInboxExposure } from '../../hooks';
import type { InboxDecisionCreate, InboxDecisionRead, Exposure } from '../../types';
import { ExposureStatus, ExposureType } from '../../types';
import { LoadingState, ErrorState, EmptyState } from '../components/ui';
import { FioriButton } from '../components/fiori/FioriButton';
import { TwoColumnAnalyticalLayout } from '../components/fiori/TwoColumnAnalyticalLayout';
import { FioriObjectStatus } from '../components/fiori/FioriObjectStatus';
import { RefreshCw, FileText, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { useAuthContext } from '../components/AuthProvider';
import { normalizeRoleName } from '../../utils/role';
import { UX_COPY } from '../ux/copy';

function formatInstitutionalEvent(decision: InboxDecisionRead): { label: string; icon: JSX.Element; color: string } {
  const type = (decision.decision || '').toLowerCase();
  
  if (type === 'no_hedge') {
    return {
      label: 'Decisão registrada: não hedgear',
      icon: <FileText className="w-4 h-4" />,
      color: 'var(--sapInformativeTextColor)',
    };
  }
  
  if (type === 'hedge_executed' || type === 'executed') {
    return {
      label: 'Hedge executado',
      icon: <CheckCircle className="w-4 h-4" />,
      color: 'var(--sapPositiveTextColor)',
    };
  }
  
  if (type === 'contract_created' || type.includes('contract')) {
    return {
      label: 'Contrato firmado',
      icon: <CheckCircle className="w-4 h-4" />,
      color: 'var(--sapPositiveTextColor)',
    };
  }
  
  if (type === 'exception_approved' || type.includes('exception')) {
    return {
      label: 'Exceção aprovada',
      icon: <AlertTriangle className="w-4 h-4" />,
      color: 'var(--sapCriticalTextColor)',
    };
  }
  
  if (type.includes('reject')) {
    return {
      label: 'Decisão rejeitada',
      icon: <XCircle className="w-4 h-4" />,
      color: 'var(--sapNegativeTextColor)',
    };
  }
  
  // Default for any registered decision
  return {
    label: 'Decisão registrada',
    icon: <FileText className="w-4 h-4" />,
    color: 'var(--sapInformativeTextColor)',
  };
}

function formatBusinessDate(dateStr: string): string {
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return '—';
  
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  
  if (diffMins < 1) return 'Agora';
  if (diffMins < 60) return `${diffMins}m atrás`;
  if (diffHours < 24) return `${diffHours}h atrás`;
  if (diffDays === 0) return 'Hoje';
  if (diffDays === 1) return 'Ontem';
  if (diffDays < 7) return `${diffDays} dias atrás`;
  
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
}

function statusToType(status?: ExposureStatus): 'success' | 'error' | 'warning' | 'information' | 'neutral' {
  switch (status) {
    case ExposureStatus.OPEN:
      return 'warning';
    case ExposureStatus.PARTIALLY_HEDGED:
      return 'information';
    case ExposureStatus.HEDGED:
      return 'success';
    case ExposureStatus.CLOSED:
      return 'neutral';
    default:
      return 'neutral';
  }
}

function bucketLabel(exp: Exposure): string {
  if (exp.status === ExposureStatus.PARTIALLY_HEDGED) return 'Residual';
  if (exp.exposure_type === ExposureType.ACTIVE) return 'Ativa';
  return 'Passiva';
}

export function InboxPageIntegrated() {
  const navigate = useNavigate();

  const { user } = useAuthContext();
  const role = normalizeRoleName(user?.role);
  const canCreateRfq = role === 'financeiro';
  const canRegisterDecision = role === 'financeiro';

  const { workbench, isLoading, isError, error, refetch } = useInboxWorkbench();
  const [selectedExposureId, setSelectedExposureId] = useState<number | null>(null);

  const { exposure, decisions, isLoading: isLoadingDetail, isError: isErrorDetail, error: errorDetail, submitDecision } =
    useInboxExposure(selectedExposureId);

  const exposures = useMemo(() => {
    if (!workbench) return [];
    return [...workbench.active, ...workbench.passive, ...workbench.residual];
  }, [workbench]);

  const selected = useMemo(() => {
    if (!selectedExposureId) return null;
    return exposures.find(e => e.id === selectedExposureId) || null;
  }, [selectedExposureId, exposures]);

  const leftColumn = (
    <>
      {isLoading && <LoadingState message="Carregando atividades..." />}
      {isError && <ErrorState error={error || null} onRetry={refetch} />}

      {!isLoading && !isError && workbench && (
        <>
          {/* Summary Cards */}
          <div className="p-3 border-b border-[var(--sapList_BorderColor)] bg-[var(--sapBackgroundColor)]">
            <div className="grid grid-cols-2 gap-2">
              <div className="p-2 border border-[var(--sapGroup_ContentBorderColor)] rounded bg-white">
                <div className="text-xs text-[var(--sapContent_LabelColor)]">Vendas pendentes</div>
                <div className="text-base font-['72:Bold',sans-serif]">{workbench.counts.sales_orders_pending}</div>
              </div>
              <div className="p-2 border border-[var(--sapGroup_ContentBorderColor)] rounded bg-white">
                <div className="text-xs text-[var(--sapContent_LabelColor)]">Compras pendentes</div>
                <div className="text-base font-['72:Bold',sans-serif]">{workbench.counts.purchase_orders_pending}</div>
              </div>
              <div className="p-2 border border-[var(--sapGroup_ContentBorderColor)] rounded bg-white">
                <div className="text-xs text-[var(--sapContent_LabelColor)]">Exposições ativas</div>
                <div className="text-base font-['72:Bold',sans-serif]">{workbench.counts.exposures_active}</div>
              </div>
              <div className="p-2 border border-[var(--sapGroup_ContentBorderColor)] rounded bg-white">
                <div className="text-xs text-[var(--sapContent_LabelColor)]">Residuais</div>
                <div className="text-base font-['72:Bold',sans-serif]">{workbench.counts.exposures_residual}</div>
              </div>
            </div>
          </div>

          {/* Exposures List */}
          <div>
            {exposures.length === 0 ? (
              <div className="p-4">
                <EmptyState title={UX_COPY.pages.pending.empty} description="" />
              </div>
            ) : (
              <div>
                {exposures.map(exp => (
                  <button
                    key={exp.id}
                    onClick={() => setSelectedExposureId(exp.id)}
                    className={`w-full p-3 border-b border-[var(--sapList_BorderColor)] text-left hover:bg-[var(--sapList_HoverBackground)] transition-colors ${
                      selectedExposureId === exp.id ? 'bg-[var(--sapList_SelectionBackgroundColor)]' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="text-xs font-['72:Bold',sans-serif] text-[var(--sapContent_LabelColor)]">
                        Exposição #{exp.id}
                      </div>
                      <FioriObjectStatus status={statusToType(exp.status)}>
                        {bucketLabel(exp)}
                      </FioriObjectStatus>
                    </div>
                    <div className="text-sm text-[var(--sapTextColor)]">{exp.product || 'Produto —'}</div>
                    <div className="text-xs text-[var(--sapContent_LabelColor)] mt-1">
                      {exp.quantity_mt?.toLocaleString('pt-BR')} MT · {exp.exposure_type?.toUpperCase()}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </>
  );

  const rightColumn = (
    <>
      {!selected && (
        <EmptyState
          title="Selecione uma exposição"
          description="Selecione uma exposição para ver detalhes e histórico de atividades."
        />
      )}

      {selected && (
        <>
          {/* Exposure Details */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h2 className="text-lg font-['72:Bold',sans-serif] m-0">Exposição #{selected.id}</h2>
                <div className="text-sm text-[var(--sapContent_LabelColor)]">{bucketLabel(selected)} · {selected.status}</div>
              </div>
              <div className="flex items-center gap-2">
                {canCreateRfq && (selected.source_type || '').toLowerCase() === 'so' && (
                  <FioriButton
                    onClick={() => {
                      navigate(`/financeiro/rfqs/novo?so_id=${encodeURIComponent(String(selected.source_id))}&quantity_mt=${encodeURIComponent(String(selected.quantity_mt || ''))}&source_exposure_id=${encodeURIComponent(String(selected.id))}`);
                    }}
                  >
                    Criar cotação
                  </FioriButton>
                )}
              </div>
            </div>

            {(isLoadingDetail && !exposure) && <LoadingState message="Carregando detalhes..." />}
            {isErrorDetail && <ErrorState error={errorDetail || null} />}

            {exposure && (
              <div className="p-4 border border-[var(--sapGroup_ContentBorderColor)] rounded bg-[var(--sapBackgroundColor)]">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <div className="text-xs text-[var(--sapContent_LabelColor)]">Produto</div>
                    <div className="font-['72:Bold',sans-serif]">{exposure.product || '—'}</div>
                  </div>
                  <div>
                    <div className="text-xs text-[var(--sapContent_LabelColor)]">Quantidade</div>
                    <div className="font-['72:Bold',sans-serif]">{exposure.quantity_mt?.toLocaleString('pt-BR')} MT</div>
                  </div>
                  <div>
                    <div className="text-xs text-[var(--sapContent_LabelColor)]">Tipo</div>
                    <div>{exposure.exposure_type || '—'}</div>
                  </div>
                  <div>
                    <div className="text-xs text-[var(--sapContent_LabelColor)]">Status</div>
                    <div>{exposure.status || '—'}</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Activity Timeline - Business Events Only */}
          <div className="mb-6">
            <h3 className="text-base font-['72:Bold',sans-serif] mb-3">Histórico de atividades</h3>
            {decisions.length === 0 ? (
              <div className="p-4 border border-[var(--sapGroup_ContentBorderColor)] rounded">
                <div className="text-sm text-[var(--sapContent_LabelColor)]">Nenhuma atividade registrada ainda.</div>
              </div>
            ) : (
              <div className="space-y-3">
                {decisions.map((d, idx) => {
                  const event = formatInstitutionalEvent(d);
                  return (
                    <div key={d.id} className="flex gap-3">
                      {/* Timeline indicator */}
                      <div className="flex flex-col items-center">
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center border-2"
                          style={{ borderColor: event.color, color: event.color }}
                        >
                          {event.icon}
                        </div>
                        {idx < decisions.length - 1 && (
                          <div className="w-0.5 flex-1 mt-1" style={{ backgroundColor: 'var(--sapList_BorderColor)' }} />
                        )}
                      </div>

                      {/* Event content */}
                      <div className="flex-1 pb-4">
                        <div className="flex items-center justify-between mb-1">
                          <div className="text-sm font-['72:Bold',sans-serif]" style={{ color: event.color }}>
                            {event.label}
                          </div>
                          <div className="text-xs text-[var(--sapContent_LabelColor)]">
                            {formatBusinessDate(d.created_at)}
                          </div>
                        </div>
                        {d.justification && (
                          <div className="text-sm text-[var(--sapTextColor)] mt-1 p-2 rounded bg-[var(--sapBackgroundColor)] border border-[var(--sapList_BorderColor)]">
                            {d.justification}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Decision Form for Financeiro */}
          {canRegisterDecision && (
            <div className="p-4 border-2 border-[var(--sapGroup_ContentBorderColor)] rounded">
              <h3 className="text-base font-['72:Bold',sans-serif] mb-3">Registrar nova decisão</h3>
              <DecisionForm
                onSubmit={async (justification) => {
                  const payload: InboxDecisionCreate = { decision: 'no_hedge', justification };
                  await submitDecision(payload);
                }}
              />
            </div>
          )}

          {!canRegisterDecision && (
            <div className="p-3 border border-[var(--sapInformativeColor)] rounded bg-[var(--sapInformativeElementColor,#e5f0fa)]">
              <div className="text-sm text-[var(--sapInformativeTextColor)]">
                Registro de decisões disponível apenas para perfil Financeiro.
              </div>
            </div>
          )}
        </>
      )}
    </>
  );

  const leftActions = (
    <FioriButton variant="ghost" icon={<RefreshCw className="w-4 h-4" />} onClick={refetch} />
  );

  return (
    <TwoColumnAnalyticalLayout
      leftColumn={leftColumn}
      rightColumn={rightColumn}
      leftTitle="Atividades da equipe"
      rightTitle={selected ? `Exposição #${selected.id}` : undefined}
      leftActions={leftActions}
      leftWidth={360}
    />
  );
}

function DecisionForm({ onSubmit }: { onSubmit: (justification: string) => Promise<void> }) {
  const [justification, setJustification] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        setError(null);
        if (justification.trim().length < 3) {
          setError('Justificativa muito curta.');
          return;
        }
        setIsSubmitting(true);
        try {
          await onSubmit(justification.trim());
          setJustification('');
        } catch (err) {
          setError(UX_COPY.errors.title);
        } finally {
          setIsSubmitting(false);
        }
      }}
    >
      <div className="space-y-2">
        <textarea
          value={justification}
          onChange={(e) => setJustification(e.target.value)}
          placeholder="Registrar decisão: não realizar hedge (com justificativa)"
          className="w-full min-h-[80px] p-2 text-sm bg-[var(--sapField_Background)] border border-[var(--sapField_BorderColor)] rounded outline-none focus:border-[var(--sapField_Focus_BorderColor)]"
        />
        {error && <div className="text-sm text-[var(--sapNegativeTextColor)]">{error}</div>}
        <div className="flex justify-end">
          <FioriButton type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Salvando...' : 'Registrar decisão'}
          </FioriButton>
        </div>
      </div>
    </form>
  );
}
