/**
 * Approvals Inbox - Redesigned
 *
 * Every approval must answer 3 questions:
 * 1. What is being approved?
 * 2. Which decision is pending?
 * 3. Who decides and why?
 *
 * Actions: Approve, Reject, Request Adjustment
 * Rule: If no action is possible → it's not an approval, it's noise.
 */

import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useRfqDetail, useWorkflowRequest, useWorkflowRequests } from '../../hooks';
import type { ApiError, WorkflowDecisionValue, WorkflowRequestRead } from '../../types';
import { LoadingState, ErrorState, EmptyState } from '../components/ui';
import { FioriButton } from '../components/fiori/FioriButton';
import { TwoColumnAnalyticalLayout } from '../components/fiori/TwoColumnAnalyticalLayout';
import { FioriObjectStatus } from '../components/fiori/FioriObjectStatus';
import { RefreshCw, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import { useAuthContext } from '../components/AuthProvider';
import { normalizeRoleName } from '../../utils/role';
import { UX_COPY, formatRoleLabel } from '../ux/copy';

function formatApprovalStatusLabel(status?: string): string {
  switch ((status || '').toLowerCase()) {
    case 'pending':
      return 'Pendente';
    case 'approved':
      return 'Aprovada';
    case 'rejected':
      return 'Rejeitada';
    case 'executed':
      return 'Executada';
    default:
      return status || '—';
  }
}

function formatWorkflowActionLabel(action?: string | null): string {
  const key = String(action || '').toLowerCase();
  if (!key) return 'Ação não identificada';
  if (key === 'rfq.award') return 'Adjudicar RFQ';
  if (key === 'hedge.manual.create') return 'Registrar hedge manual';
  if (key.includes('rfq')) return 'Operação RFQ';
  if (key.includes('hedge')) return 'Operação de hedge';
  if (key.includes('deal')) return 'Operação comercial';
  if (key.includes('limit')) return 'Ajuste de limite';
  if (key.includes('override')) return 'Exceção solicitada';
  return action || 'Ação não identificada';
}

function getApprovalTypeLabel(action?: string | null): string {
  const key = String(action || '').toLowerCase();
  if (key.includes('rfq')) return 'RFQ';
  if (key.includes('hedge')) return 'Hedge';
  if (key.includes('deal')) return 'Deal';
  if (key.includes('limit')) return 'Limite';
  if (key.includes('override') || key.includes('exception')) return 'Exceção';
  return 'Aprovação';
}

function getPendingDecisionLabel(wf: WorkflowRequestRead): string {
  if ((wf.status || '').toLowerCase() === 'approved') return 'Aprovado';
  if ((wf.status || '').toLowerCase() === 'rejected') return 'Rejeitado';
  return 'Aprovar ou rejeitar operação';
}

function formatSubjectLabel(subjectType?: string | null, subjectId?: string | null): string {
  const t = String(subjectType || '').trim();
  const id = String(subjectId || '').trim();
  if (!t && !id) return 'ƒ?"';
  if (!id) return t || 'ƒ?"';
  return `${t} #${id}`;
}

function formatDateTimePt(value?: string | null): string {
  if (!value) return 'ƒ?"';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return String(value);
  return d.toLocaleString('pt-BR');
}

function Badge({ children }: { children: string }) {
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs border bg-[var(--sapNeutralBackground,#f5f6f7)] border-[var(--sapUiBorderColor,#d9d9d9)] text-[var(--sapTextColor,#131e29)]">
      {children}
    </span>
  );
}

function statusToType(status?: string): 'success' | 'error' | 'warning' | 'information' | 'neutral' {
  switch ((status || '').toLowerCase()) {
    case 'approved':
      return 'success';
    case 'rejected':
      return 'error';
    case 'pending':
      return 'warning';
    case 'executed':
      return 'information';
    default:
      return 'neutral';
  }
}

function formatMoneyUsd(value?: number | null): string {
  if (typeof value !== 'number' || Number.isNaN(value)) return '—';
  return value.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 });
}

function canDecide(userRole: string): boolean {
  const role = normalizeRoleName(userRole);
  return role === 'financeiro' || role === 'admin';
}

function canDecideThisRequest(userRole: string, wf: WorkflowRequestRead | null): boolean {
  if (!wf) return false;
  const role = normalizeRoleName(userRole);
  const required = (wf.required_role || '').toLowerCase();

  if (!canDecide(role)) return false;
  if (required === 'admin' && role !== 'admin') return false;
  return true;
}

export function ApprovalsPageIntegrated() {
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const userRole = normalizeRoleName(user?.role);

  const [searchParams] = useSearchParams();

  const [statusFilter, setStatusFilter] = useState<string>('pending');
  const [actionFilter, setActionFilter] = useState<string>('');
  const [requiredRoleFilter, setRequiredRoleFilter] = useState<string>('');

  const {
    requests,
    isLoading,
    isError,
    error,
    refetch,
  } = useWorkflowRequests({
    status: statusFilter || undefined,
    action: actionFilter || undefined,
    required_role: requiredRoleFilter || undefined,
    limit: 100,
  });

  const [selectedId, setSelectedId] = useState<number | null>(null);

  useEffect(() => {
    const raw = searchParams.get('request_id');
    if (!raw) return;
    const id = Number(raw);
    if (!Number.isFinite(id) || id <= 0) return;
    setSelectedId(id);
  }, [searchParams]);

  const selectedFromList = useMemo(
    () => (selectedId ? requests.find((r) => r.id === selectedId) || null : null),
    [selectedId, requests],
  );

  const {
    request: wf,
    isLoading: isLoadingDetail,
    isError: isErrorDetail,
    error: errorDetail,
    submitDecision,
    refetch: refetchDetail,
  } = useWorkflowRequest(selectedId);

  const [justification, setJustification] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<ApiError | null>(null);

  const decisions = wf?.decisions || [];

  const subjectRfqId = useMemo(() => {
    if (!wf) return null;
    if (String(wf.subject_type || '').toLowerCase() !== 'rfq') return null;
    const n = Number(wf.subject_id);
    return Number.isFinite(n) && n > 0 ? n : null;
  }, [wf]);

  const { rfq: subjectRfq } = useRfqDetail(subjectRfqId);

  const isOverdue = useMemo(() => {
    if (!wf) return false;
    if (String(wf.status || '').toLowerCase() !== 'pending') return false;
    const due = wf.sla_due_at ? new Date(wf.sla_due_at) : null;
    if (!due || Number.isNaN(due.getTime())) return false;
    return due.getTime() < Date.now();
  }, [wf]);

  const onSelect = (id: number) => {
    setSelectedId(id);
    setJustification('');
    setSubmitError(null);
  };

  const doDecision = async (decision: WorkflowDecisionValue) => {
    if (!selectedId) return;
    setSubmitting(true);
    setSubmitError(null);

    try {
      await submitDecision({ decision, justification: justification.trim() });
      setJustification('');
    } catch (err) {
      setSubmitError(err as ApiError);
    } finally {
      setSubmitting(false);
    }
  };

  const leftColumn = (
    <>
      {isLoading && <LoadingState message="Carregando aprovações..." />}
      {isError && <ErrorState error={error || null} onRetry={refetch} />}

      {!isLoading && !isError && (
        <>
          <div className="p-3 border-b border-[var(--sapList_BorderColor)] bg-[var(--sapBackgroundColor)]">
            <div className="space-y-2">
              <label className="block">
                <span className="text-xs text-[var(--sapContent_LabelColor)]">Status</span>
                <select
                  className="mt-1 w-full p-2 border border-[var(--sapField_BorderColor)] rounded bg-white text-sm"
                  value={statusFilter}
                  onChange={(e) => {
                    setSelectedId(null);
                    setStatusFilter(e.target.value);
                  }}
                >
                  <option value="">(todos)</option>
                  <option value="pending">Pendente</option>
                  <option value="approved">Aprovada</option>
                  <option value="rejected">Rejeitada</option>
                  <option value="executed">Executada</option>
                </select>
              </label>

              <label className="block">
                <span className="text-xs text-[var(--sapContent_LabelColor)]">Perfil necessário</span>
                <select
                  className="mt-1 w-full p-2 border border-[var(--sapField_BorderColor)] rounded bg-white text-sm"
                  value={requiredRoleFilter}
                  onChange={(e) => {
                    setSelectedId(null);
                    setRequiredRoleFilter(e.target.value);
                  }}
                >
                  <option value="">(todas)</option>
                  <option value="financeiro">{formatRoleLabel('financeiro')}</option>
                  <option value="admin">{formatRoleLabel('admin')}</option>
                </select>
              </label>
            </div>
          </div>

          <div>
            {requests.length === 0 ? (
              <div className="p-4">
                <EmptyState title={UX_COPY.pages.approvals.empty} description="" />
              </div>
            ) : (
              <div>
                {requests.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => onSelect(r.id)}
                    className={`w-full p-3 border-b border-[var(--sapList_BorderColor)] text-left hover:bg-[var(--sapList_HoverBackground)] transition-colors ${
                      selectedId === r.id ? 'bg-[var(--sapList_SelectionBackgroundColor)]' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="text-xs font-['72:Bold',sans-serif] text-[var(--sapContent_LabelColor)]">
                        #{r.id} · {getApprovalTypeLabel(r.action)}
                      </div>
                      <FioriObjectStatus status={statusToType(r.status)}>{formatApprovalStatusLabel(r.status)}</FioriObjectStatus>
                    </div>
                    <div className="text-sm text-[var(--sapTextColor)] font-['72',sans-serif]">
                      {formatWorkflowActionLabel(r.action)}
                    </div>
                    <div className="text-xs text-[var(--sapContent_LabelColor)] mt-1">
                      {formatSubjectLabel(r.subject_type, r.subject_id)} · {formatMoneyUsd(r.notional_usd)}
                    </div>
                    {isOverdue && r.id === selectedId && (
                      <div className="text-xs text-[var(--sapNegativeTextColor)] mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> Atrasada
                      </div>
                    )}
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
      {!selectedFromList && !wf && (
        <EmptyState title="Selecione uma aprovação" description="Clique em um item na lista à esquerda para ver os detalhes." />
      )}

      {selectedFromList && !wf && !isLoadingDetail && !isErrorDetail && (
        <LoadingState message="Carregando detalhe..." />
      )}

      {isLoadingDetail && <LoadingState message="Carregando detalhe..." />}
      {isErrorDetail && <ErrorState error={errorDetail || null} onRetry={refetchDetail} />}

      {wf && (
        <>
          {/* Header: O que está sendo aprovado? */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <h2 className="text-lg font-['72:Bold',sans-serif] m-0">O que está sendo aprovado?</h2>
              <FioriObjectStatus status={statusToType(wf.status)}>{formatApprovalStatusLabel(wf.status)}</FioriObjectStatus>
              {isOverdue && <Badge>Atrasada</Badge>}
            </div>
            <div className="p-4 border border-[var(--sapGroup_ContentBorderColor)] rounded bg-[var(--sapHighlightColor,#fff3cd)]">
              <div className="text-base font-['72:Bold',sans-serif] mb-2">{formatWorkflowActionLabel(wf.action)}</div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-[var(--sapContent_LabelColor)]">Tipo:</span> {getApprovalTypeLabel(wf.action)}
                </div>
                <div>
                  <span className="text-[var(--sapContent_LabelColor)]">Objeto:</span> {formatSubjectLabel(wf.subject_type, wf.subject_id)}
                </div>
                <div>
                  <span className="text-[var(--sapContent_LabelColor)]">Valor:</span> {formatMoneyUsd(wf.notional_usd)}
                </div>
                <div>
                  <span className="text-[var(--sapContent_LabelColor)]">Limite:</span> {formatMoneyUsd(wf.threshold_usd)}
                </div>
              </div>
            </div>
          </div>

          {/* Decision Panel: Qual decisão está pendente? */}
          <div className="mb-6">
            <h3 className="text-base font-['72:Bold',sans-serif] mb-2">Qual decisão está pendente?</h3>
            <div className="p-4 border border-[var(--sapGroup_ContentBorderColor)] rounded">
              <div className="text-sm mb-2">{getPendingDecisionLabel(wf)}</div>
              {wf.sla_due_at && (
                <div className="text-xs text-[var(--sapContent_LabelColor)]">
                  Prazo: {formatDateTimePt(wf.sla_due_at)}
                  {isOverdue && <span className="text-[var(--sapNegativeTextColor)] ml-2">(vencido)</span>}
                </div>
              )}
            </div>
          </div>

          {/* Authority Panel: Quem decide e por quê? */}
          <div className="mb-6">
            <h3 className="text-base font-['72:Bold',sans-serif] mb-2">Quem decide e por quê?</h3>
            <div className="p-4 border border-[var(--sapGroup_ContentBorderColor)] rounded">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <div className="text-xs text-[var(--sapContent_LabelColor)]">Perfil autorizado</div>
                  <div className="font-['72:Bold',sans-serif]">{formatRoleLabel(wf.required_role)}</div>
                </div>
                <div>
                  <div className="text-xs text-[var(--sapContent_LabelColor)]">Motivo</div>
                  <div>Valor {formatMoneyUsd(wf.notional_usd)} excede limite {formatMoneyUsd(wf.threshold_usd)}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Operational Context */}
          <div className="mb-6">
            <h3 className="text-base font-['72:Bold',sans-serif] mb-2">Contexto operacional</h3>
            <div className="p-4 border border-[var(--sapGroup_ContentBorderColor)] rounded">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <div className="text-xs text-[var(--sapContent_LabelColor)]">Empresa</div>
                  <div>{String((wf.context as any)?.company || '—')}</div>
                </div>
                <div>
                  <div className="text-xs text-[var(--sapContent_LabelColor)]">Exposição</div>
                  <div>
                    {(() => {
                      const ex = (wf.context as any)?.exposure_id;
                      return ex ? `#${ex}` : '—';
                    })()}
                  </div>
                </div>
                {subjectRfq && (
                  <>
                    <div>
                      <div className="text-xs text-[var(--sapContent_LabelColor)]">Deal / SO</div>
                      <div>#{subjectRfq.deal_id ?? '—'} / #{subjectRfq.so_id ?? '—'}</div>
                    </div>
                    <div>
                      <div className="text-xs text-[var(--sapContent_LabelColor)]">Período / Quantidade</div>
                      <div>{subjectRfq.period || '—'} • {(subjectRfq.quantity_mt ?? 0).toLocaleString('pt-BR')} MT</div>
                    </div>
                  </>
                )}
              </div>
              {subjectRfqId && (
                <div className="mt-3">
                  <FioriButton size="small" onClick={() => navigate(`/financeiro/rfqs?selected=${subjectRfqId}`)}>
                    Abrir RFQ
                  </FioriButton>
                </div>
              )}
            </div>
          </div>

          {/* Decisions History */}
          {decisions.length > 0 && (
            <div className="mb-6">
              <h3 className="text-base font-['72:Bold',sans-serif] mb-2">Histórico de decisões</h3>
              <div className="border border-[var(--sapList_BorderColor)] rounded overflow-hidden">
                {decisions.map((d) => (
                  <div key={d.id} className="p-3 border-b border-[var(--sapList_BorderColor)] last:border-b-0">
                    <div className="flex items-center gap-2 mb-1">
                      {d.decision === 'approved' && <CheckCircle className="w-4 h-4 text-[var(--sapPositiveTextColor)]" />}
                      {d.decision === 'rejected' && <XCircle className="w-4 h-4 text-[var(--sapNegativeTextColor)]" />}
                      <span className="text-sm font-['72:Bold',sans-serif]">{formatApprovalStatusLabel(d.decision)}</span>
                    </div>
                    <div className="text-sm text-[var(--sapContent_LabelColor)]">{d.justification}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          {!canDecideThisRequest(userRole, wf) && (
            <div className="p-3 border border-[var(--sapInformativeColor)] rounded bg-[var(--sapInformativeElementColor,#e5f0fa)]">
              <div className="text-sm">
                Você tem acesso de visualização. Esta ação requer perfil <strong>{formatRoleLabel(wf.required_role)}</strong>.
              </div>
            </div>
          )}

          {(wf.status || '').toLowerCase() !== 'pending' && (
            <div className="p-3 border border-[var(--sapInformativeColor)] rounded bg-[var(--sapInformativeElementColor,#e5f0fa)]">
              <div className="text-sm">
                {(wf.status || '').toLowerCase() === 'approved' && 'Aprovação concedida. Retorne ao módulo de origem para concluir a execução.'}
                {(wf.status || '').toLowerCase() === 'rejected' && 'Solicitação rejeitada. Nenhuma ação adicional é necessária.'}
                {!['approved', 'rejected'].includes((wf.status || '').toLowerCase()) && 'Esta solicitação não está mais pendente.'}
              </div>
            </div>
          )}

          {canDecideThisRequest(userRole, wf) && (wf.status || '').toLowerCase() === 'pending' && (
            <div className="p-4 border-2 border-[var(--sapGroup_ContentBorderColor)] rounded">
              <h3 className="text-base font-['72:Bold',sans-serif] mb-3">Ações disponíveis</h3>

              <textarea
                className="w-full p-3 border border-[var(--sapField_BorderColor)] rounded bg-white text-sm mb-3"
                rows={3}
                value={justification}
                onChange={(e) => setJustification(e.target.value)}
                placeholder="Justificativa obrigatória (mínimo 3 caracteres)"
              />

              {submitError && (
                <div className="p-2 mb-3 rounded bg-[var(--sapErrorBackground)] text-[var(--sapNegativeTextColor)] text-sm">
                  {UX_COPY.errors.title}
                </div>
              )}

              <div className="flex items-center gap-3">
                <FioriButton
                  icon={<CheckCircle className="w-4 h-4" />}
                  onClick={() => doDecision('approved')}
                  disabled={submitting || justification.trim().length < 3}
                >
                  Aprovar
                </FioriButton>
                <FioriButton
                  icon={<XCircle className="w-4 h-4" />}
                  variant="negative"
                  onClick={() => doDecision('rejected')}
                  disabled={submitting || justification.trim().length < 3}
                >
                  Rejeitar
                </FioriButton>
                <FioriButton
                  icon={<AlertCircle className="w-4 h-4" />}
                  variant="ghost"
                  onClick={() => {
                    if (justification.trim().length < 3) return;
                    // Note: Request adjustment is a rejection with justification for modification.
                    // The justification should indicate what needs to be adjusted.
                    doDecision('rejected');
                  }}
                  disabled={submitting || justification.trim().length < 3}
                  title="Rejeitar com solicitação de ajustes. Use a justificativa para explicar as mudanças necessárias."
                >
                  Solicitar Ajuste
                </FioriButton>
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

  const rightActions = wf && (
    <div className="flex items-center gap-2">
      {userRole === 'auditoria' && <Badge>Somente leitura</Badge>}
      <FioriButton variant="ghost" icon={<RefreshCw className="w-4 h-4" />} onClick={refetchDetail} />
    </div>
  );

  return (
    <TwoColumnAnalyticalLayout
      leftColumn={leftColumn}
      rightColumn={rightColumn}
      leftTitle={UX_COPY.pages.approvals.title}
      rightTitle={wf ? `Aprovação #${wf.id}` : undefined}
      leftActions={leftActions}
      rightActions={rightActions}
      leftWidth={360}
    />
  );
}
