/**
 * Approvals Inbox (T3)
 *
 * Minimal UX:
 * - List workflow requests (filters)
 * - Show request detail + decisions
 * - Approve/Reject with justification (financeiro/admin)
 * - Auditoria is read-only
 */

import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useRfqDetail, useWorkflowRequest, useWorkflowRequests } from '../../hooks';
import type { ApiError, WorkflowDecisionValue, WorkflowRequestRead } from '../../types';
import { LoadingState, ErrorState, EmptyState } from '../components/ui';
import { FioriButton } from '../components/fiori/FioriButton';
import { FioriFlexibleColumnLayout } from '../components/fiori/FioriFlexibleColumnLayout';
import { FioriObjectStatus } from '../components/fiori/FioriObjectStatus';
import { RefreshCw } from 'lucide-react';
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
  if (!key) return 'ƒ?"';
  if (key === 'rfq.award') return 'Adjudicar RFQ';
  if (key === 'hedge.manual.create') return 'Registrar hedge manual';
  return action || 'ƒ?"';
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

  const master = (
    <div className="sap-fiori-page">
      <div className="bg-[var(--sapPageHeader_Background)] border-b border-[var(--sapPageHeader_BorderColor)] -mx-4 -mt-4 px-4 py-4 mb-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-[var(--sapPageHeader_TextColor)] text-xl font-normal m-0">{UX_COPY.pages.approvals.title}</h1>
            <p className="text-[var(--sapContent_LabelColor)] text-sm mt-1">{UX_COPY.pages.approvals.subtitle}</p>
          </div>
          {userRole === 'auditoria' && <Badge>Somente leitura</Badge>}
          <FioriButton variant="ghost" icon={<RefreshCw className="w-4 h-4" />} onClick={refetch}>
            Atualizar
          </FioriButton>
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
          <label className="text-xs text-[var(--sapContent_LabelColor)]">
            Status
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

          <label className="text-xs text-[var(--sapContent_LabelColor)]">
            Tipo de solicitação
            <input
              className="mt-1 w-full p-2 border border-[var(--sapField_BorderColor)] rounded bg-white text-sm"
              value={actionFilter}
              onChange={(e) => {
                setSelectedId(null);
                setActionFilter(e.target.value);
              }}
            />
          </label>

          <label className="text-xs text-[var(--sapContent_LabelColor)]">
            Perfil necessário
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

      {isLoading && <LoadingState message="Carregando aprovações..." />}
      {isError && <ErrorState error={error || null} onRetry={refetch} />}

      {!isLoading && !isError && (
        <div className="sap-fiori-section">
          <div className="sap-fiori-section-content">
            {requests.length === 0 ? (
              <EmptyState title={UX_COPY.pages.approvals.empty} description="" />
            ) : (
              <div className="border border-[var(--sapList_BorderColor)] rounded overflow-hidden">
                {requests.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => onSelect(r.id)}
                    className={`w-full p-3 border-b border-[var(--sapList_BorderColor)] text-left hover:bg-[var(--sapList_HoverBackground)] transition-colors ${
                      selectedId === r.id ? 'bg-[var(--sapList_SelectionBackgroundColor)]' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-[#0064d9] font-['72:Bold',sans-serif]">
                        Solicitação nº {r.id}
                      </div>
                      <FioriObjectStatus status={statusToType(r.status)}>{formatApprovalStatusLabel(r.status)}</FioriObjectStatus>
                    </div>
                    <div className="text-xs text-[var(--sapContent_LabelColor)] mt-1">
                      {formatWorkflowActionLabel(r.action)}
                      {' • '}
                      {formatSubjectLabel(r.subject_type, r.subject_id)}
                      {' • '}
                      Perfil necessário: {formatRoleLabel(r.required_role)}
                      {' • '}Valor: {formatMoneyUsd(r.notional_usd)}
                    </div>
                    {r.sla_due_at && (
                      <div className="text-xs text-[var(--sapContent_LabelColor)] mt-1">
                        SLA: {formatDateTimePt(r.sla_due_at)}
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );

  const detail = (
    <div className="sap-fiori-page">
      <div className="sap-fiori-section">
        <div className="sap-fiori-section-content">
          {!selectedFromList && !wf && (
            <EmptyState title="Selecione uma solicitação" description="Clique em um item na lista para ver o detalhe." />
          )}

          {selectedFromList && !wf && !isLoadingDetail && !isErrorDetail && (
            <div className="text-sm text-[var(--sapContent_LabelColor)]">Carregando detalhe...</div>
          )}

          {isLoadingDetail && <LoadingState message="Carregando detalhe..." />}
          {isErrorDetail && <ErrorState error={errorDetail || null} onRetry={refetchDetail} />}

          {wf && (
            <>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h2 className="text-lg m-0">Solicitação nº {wf.id}</h2>
                </div>
                <div className="flex items-center gap-2">
                  <FioriObjectStatus status={statusToType(wf.status)}>{formatApprovalStatusLabel(wf.status)}</FioriObjectStatus>
                  {isOverdue && <Badge>Atrasada</Badge>}
                  <FioriButton variant="ghost" onClick={refetchDetail}>Atualizar</FioriButton>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                <div className="p-3 border border-[var(--sapGroup_ContentBorderColor)] rounded">
                  <div className="text-xs text-[var(--sapContent_LabelColor)]">Ação</div>
                  <div className="text-sm">{formatWorkflowActionLabel(wf.action)}</div>
                  <div className="text-xs text-[var(--sapContent_LabelColor)] mt-1">
                    {formatSubjectLabel(wf.subject_type, wf.subject_id)}
                  </div>
                </div>
                <div className="p-3 border border-[var(--sapGroup_ContentBorderColor)] rounded">
                  <div className="text-xs text-[var(--sapContent_LabelColor)]">Perfil necessário</div>
                  <div className="text-sm">{formatRoleLabel(wf.required_role)}</div>
                </div>
                <div className="p-3 border border-[var(--sapGroup_ContentBorderColor)] rounded">
                  <div className="text-xs text-[var(--sapContent_LabelColor)]">Limite / Valor</div>
                  <div className="text-sm">
                    {formatMoneyUsd(wf.threshold_usd)} / {formatMoneyUsd(wf.notional_usd)}
                  </div>
                </div>
                <div className="p-3 border border-[var(--sapGroup_ContentBorderColor)] rounded">
                  <div className="text-xs text-[var(--sapContent_LabelColor)]">SLA</div>
                  <div className="text-sm">{formatDateTimePt(wf.sla_due_at)}</div>
                </div>
              </div>

              <div className="p-3 border border-[var(--sapGroup_ContentBorderColor)] rounded mb-4">
                <div className="text-xs text-[var(--sapContent_LabelColor)] mb-2">Contexto operacional</div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="text-sm">
                    <div className="text-xs text-[var(--sapContent_LabelColor)]">Objeto</div>
                    <div>{formatSubjectLabel(wf.subject_type, wf.subject_id)}</div>
                  </div>
                  <div className="text-sm">
                    <div className="text-xs text-[var(--sapContent_LabelColor)]">Motivo</div>
                    <div>{String((wf.context as any)?.hint || '—')}</div>
                  </div>

                  <div className="text-sm">
                    <div className="text-xs text-[var(--sapContent_LabelColor)]">Empresa</div>
                    <div>{String((wf.context as any)?.company || '—')}</div>
                  </div>
                  <div className="text-sm">
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
                      <div className="text-sm">
                        <div className="text-xs text-[var(--sapContent_LabelColor)]">Deal / SO</div>
                        <div>
                          #{subjectRfq.deal_id ?? '—'} / #{subjectRfq.so_id ?? '—'}
                        </div>
                      </div>
                      <div className="text-sm">
                        <div className="text-xs text-[var(--sapContent_LabelColor)]">Período / Quantidade</div>
                        <div>
                          {subjectRfq.period || '—'} • {(subjectRfq.quantity_mt ?? 0).toLocaleString('pt-BR')} MT
                        </div>
                      </div>
                    </>
                  )}
                </div>

                <div className="flex items-center gap-2 mt-3">
                  {subjectRfqId && (
                    <FioriButton onClick={() => navigate(`/financeiro/rfqs?selected=${subjectRfqId}`)}>
                      Abrir RFQ
                    </FioriButton>
                  )}
                  <FioriButton variant="ghost" onClick={() => navigate('/financeiro/aprovacoes')}>
                    Voltar para lista
                  </FioriButton>
                </div>
              </div>

              <div className="p-3 border border-[var(--sapGroup_ContentBorderColor)] rounded mb-4">
                <div className="text-xs text-[var(--sapContent_LabelColor)] mb-2">Decisões</div>
                {decisions.length === 0 ? (
                  <div className="text-sm text-[var(--sapContent_LabelColor)]">Sem decisões ainda.</div>
                ) : (
                  <div className="border border-[var(--sapList_BorderColor)] rounded overflow-hidden">
                    {decisions.map((d) => (
                      <div key={d.id} className="p-3 border-b border-[var(--sapList_BorderColor)]">
                        <div className="flex items-center justify-between">
                          <div className="text-sm font-['72:Bold',sans-serif]">{formatApprovalStatusLabel(d.decision)}</div>
                        </div>
                        <div className="text-xs text-[var(--sapContent_LabelColor)] mt-1">{d.justification}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {!canDecideThisRequest(userRole, wf) && (
                <div className="text-xs text-[var(--sapContent_LabelColor)] mb-4">
                  Você tem acesso de visualização. Esta ação requer perfil {formatRoleLabel(wf.required_role)}.
                </div>
              )}

              {(wf.status || '').toLowerCase() === 'approved' && (
                <div className="text-xs text-[var(--sapContent_LabelColor)] mb-4">
                  Próximo passo: retorne ao módulo de origem e repita a ação para concluir a execução.
                </div>
              )}

              {canDecideThisRequest(userRole, wf) && (
                <div className="p-3 border border-[var(--sapGroup_ContentBorderColor)] rounded">
                  <div className="text-xs text-[var(--sapContent_LabelColor)] mb-2">Registrar decisão</div>

                  <textarea
                    className="w-full p-2 border border-[var(--sapField_BorderColor)] rounded bg-white text-sm"
                    rows={3}
                    value={justification}
                    onChange={(e) => setJustification(e.target.value)}
                    placeholder="Justificativa (mín. 3 caracteres)"
                  />

                  {submitError && (
                    <div className="text-xs text-[var(--sapNegativeColor)] mt-2">
                      {UX_COPY.errors.title}
                    </div>
                  )}

                  <div className="flex items-center gap-2 mt-3">
                    <FioriButton
                      onClick={() => doDecision('approved')}
                      disabled={submitting || justification.trim().length < 3 || (wf.status || '').toLowerCase() !== 'pending'}
                    >
                      Aprovar
                    </FioriButton>
                    <FioriButton
                      variant="negative"
                      onClick={() => doDecision('rejected')}
                      disabled={submitting || justification.trim().length < 3 || (wf.status || '').toLowerCase() !== 'pending'}
                    >
                      Rejeitar
                    </FioriButton>
                  </div>

                  {(wf.status || '').toLowerCase() !== 'pending' && (
                    <div className="text-xs text-[var(--sapContent_LabelColor)] mt-2">
                      Request não está pendente; decisões não são permitidas.
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <FioriFlexibleColumnLayout
      masterTitle="Aprovações"
      masterContent={master}
      detailContent={detail}
    />
  );
}
