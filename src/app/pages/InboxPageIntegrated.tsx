/**
 * Inbox / Financeiro Workbench (Integrated)
 *
 * Sprint 2: minimal view + audit-only decision "Não fazer hedge".
 */

import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInboxWorkbench, useInboxExposure } from '../../hooks';
import type { InboxDecisionCreate, Exposure } from '../../types';
import { ExposureStatus, ExposureType } from '../../types';
import { LoadingState, ErrorState, EmptyState } from '../components/ui';
import { FioriButton } from '../components/fiori/FioriButton';
import { FioriFlexibleColumnLayout } from '../components/fiori/FioriFlexibleColumnLayout';
import { FioriObjectStatus } from '../components/fiori/FioriObjectStatus';
import { RefreshCw } from 'lucide-react';
import { useAuthContext } from '../components/AuthProvider';
import { normalizeRoleName } from '../../utils/role';
import { UX_COPY } from '../ux/copy';

function Badge({ children }: { children: string }) {
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs border bg-[var(--sapNeutralBackground,#f5f6f7)] border-[var(--sapUiBorderColor,#d9d9d9)] text-[var(--sapTextColor,#131e29)]">
      {children}
    </span>
  );
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
  const canRegisterDecision = role === 'auditoria';

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

  const master = (
    <div className="sap-fiori-page">
      <div className="bg-[var(--sapPageHeader_Background)] border-b border-[var(--sapPageHeader_BorderColor)] -mx-4 -mt-4 px-4 py-4 mb-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-[var(--sapPageHeader_TextColor)] text-xl font-normal m-0">{UX_COPY.pages.pending.title}</h1>
            <div className="flex items-center gap-2">
              <p className="text-[var(--sapContent_LabelColor)] text-sm mt-1 m-0">{UX_COPY.pages.pending.subtitle}</p>
              {role === 'auditoria' && <Badge>Acesso de visualização</Badge>}
            </div>
          </div>
          <FioriButton variant="ghost" icon={<RefreshCw className="w-4 h-4" />} onClick={refetch}>
            Atualizar
          </FioriButton>
        </div>
      </div>

      {isLoading && <LoadingState message="Carregando pendências..." />}
      {isError && <ErrorState error={error || null} onRetry={refetch} />}

      {!isLoading && !isError && workbench && (
        <>
          <div className="sap-fiori-section mb-4">
            <div className="sap-fiori-section-content grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="p-3 border border-[var(--sapGroup_ContentBorderColor)] rounded bg-[var(--sapTile_Background)]">
                <div className="text-xs text-[var(--sapContent_LabelColor)]">Pedidos de venda pendentes</div>
                <div className="text-lg">{workbench.counts.sales_orders_pending}</div>
              </div>
              <div className="p-3 border border-[var(--sapGroup_ContentBorderColor)] rounded bg-[var(--sapTile_Background)]">
                <div className="text-xs text-[var(--sapContent_LabelColor)]">Pedidos de compra pendentes</div>
                <div className="text-lg">{workbench.counts.purchase_orders_pending}</div>
              </div>
              <div className="p-3 border border-[var(--sapGroup_ContentBorderColor)] rounded bg-[var(--sapTile_Background)]">
                <div className="text-xs text-[var(--sapContent_LabelColor)]">Exposições ativas</div>
                <div className="text-lg">{workbench.counts.exposures_active}</div>
              </div>
              <div className="p-3 border border-[var(--sapGroup_ContentBorderColor)] rounded bg-[var(--sapTile_Background)]">
                <div className="text-xs text-[var(--sapContent_LabelColor)]">Residuais</div>
                <div className="text-lg">{workbench.counts.exposures_residual}</div>
              </div>
            </div>
          </div>

          <div className="sap-fiori-section mb-4">
            <div className="sap-fiori-section-content">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm font-['72:Bold',sans-serif]">Exposição consolidada (por período)</div>
                <div className="text-xs text-[var(--sapContent_LabelColor)]">Fonte: consolidação do sistema</div>
              </div>

              {workbench.net_exposure.length === 0 ? (
                <div className="text-sm text-[var(--sapContent_LabelColor)]">Sem dados disponíveis no momento.</div>
              ) : (
                <div className="border border-[var(--sapList_BorderColor)] rounded overflow-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-[var(--sapList_HeaderBackground)]">
                      <tr className="text-left">
                        <th className="p-2 text-xs text-[var(--sapContent_LabelColor)] font-normal">Produto</th>
                        <th className="p-2 text-xs text-[var(--sapContent_LabelColor)] font-normal">Período</th>
                        <th className="p-2 text-xs text-[var(--sapContent_LabelColor)] font-normal">Ativo</th>
                        <th className="p-2 text-xs text-[var(--sapContent_LabelColor)] font-normal">Passivo</th>
                        <th className="p-2 text-xs text-[var(--sapContent_LabelColor)] font-normal">Hedgeado</th>
                        <th className="p-2 text-xs text-[var(--sapContent_LabelColor)] font-normal">Net</th>
                      </tr>
                    </thead>
                    <tbody>
                      {workbench.net_exposure.map((row, idx) => (
                        <tr key={`${row.product}-${row.period}-${idx}`} className="border-t border-[var(--sapList_BorderColor)]">
                          <td className="p-2">{row.product}</td>
                          <td className="p-2">{row.period}</td>
                          <td className="p-2">{row.gross_active.toLocaleString('pt-BR')}</td>
                          <td className="p-2">{row.gross_passive.toLocaleString('pt-BR')}</td>
                          <td className="p-2">{row.hedged.toLocaleString('pt-BR')}</td>
                          <td className="p-2 font-['72:Bold',sans-serif]">{row.net.toLocaleString('pt-BR')}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          <div className="sap-fiori-section">
            <div className="sap-fiori-section-content">
              {exposures.length === 0 ? (
                <EmptyState title={UX_COPY.pages.pending.empty} description="" />
              ) : (
                <div className="border border-[var(--sapList_BorderColor)] rounded overflow-hidden">
                  {exposures.map(exp => (
                    <button
                      key={exp.id}
                      onClick={() => setSelectedExposureId(exp.id)}
                      className={`w-full p-3 border-b border-[var(--sapList_BorderColor)] text-left hover:bg-[var(--sapList_HoverBackground)] transition-colors ${
                        selectedExposureId === exp.id ? 'bg-[var(--sapList_SelectionBackgroundColor)]' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-[#0064d9] font-['72:Bold',sans-serif]">Exposição nº {exp.id}</div>
                        <FioriObjectStatus status={statusToType(exp.status)}>
                          {bucketLabel(exp)}
                        </FioriObjectStatus>
                      </div>
                      <div className="text-xs text-[var(--sapContent_LabelColor)] mt-1">
                        {exp.product || 'Produto —'} | {exp.exposure_type?.toUpperCase() || '—'} | {exp.quantity_mt?.toLocaleString('pt-BR')} MT
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );

  const detail = (
    <div className="sap-fiori-page">
      <div className="sap-fiori-section">
        <div className="sap-fiori-section-content">
          {!selected && (
            <EmptyState
              title="Selecione um item"
              description="Selecione uma pendência para ver os detalhes."
            />
          )}

          {selected && (
            <>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h2 className="text-lg m-0">Exposição nº {selected.id}</h2>
                  <div className="text-xs text-[var(--sapContent_LabelColor)]">
                    Tipo: {bucketLabel(selected)} | Situação: {selected.status}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {canCreateRfq && (
                    <FioriButton
                      onClick={() => {
                        const sourceType = (selected.source_type || '').toLowerCase();
                        if (sourceType !== 'so' || !selected.source_id) return;
                        navigate(`/financeiro/rfqs/novo?so_id=${encodeURIComponent(String(selected.source_id))}&quantity_mt=${encodeURIComponent(String(selected.quantity_mt || ''))}&source_exposure_id=${encodeURIComponent(String(selected.id))}`);
                      }}
                      disabled={((selected.source_type || '').toLowerCase() !== 'so')}
                    >
                      Criar cotação
                    </FioriButton>
                  )}
                </div>
              </div>

              {((selected.source_type || '').toLowerCase() !== 'so') && (
                <div className="text-xs text-[var(--sapContent_LabelColor)] mb-3">
                  A criação de cotação está disponível apenas para exposições originadas de pedido de venda.
                </div>
              )}

              {(isLoadingDetail && !exposure) && <LoadingState message="Carregando detalhes..." />}
              {isErrorDetail && <ErrorState error={errorDetail || null} />}

              {exposure && (
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="p-3 border border-[var(--sapGroup_ContentBorderColor)] rounded">
                    <div className="text-xs text-[var(--sapContent_LabelColor)]">Produto</div>
                    <div className="text-sm">{exposure.product || '—'}</div>
                  </div>
                  <div className="p-3 border border-[var(--sapGroup_ContentBorderColor)] rounded">
                    <div className="text-xs text-[var(--sapContent_LabelColor)]">Quantidade</div>
                    <div className="text-sm">{exposure.quantity_mt?.toLocaleString('pt-BR')} MT</div>
                  </div>
                </div>
              )}

              <div className="p-3 border border-[var(--sapGroup_ContentBorderColor)] rounded mb-4">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="text-sm font-['72:Bold',sans-serif]">Decisão</div>
                  {canRegisterDecision ? <Badge>Auditoria</Badge> : <Badge>Somente leitura</Badge>}
                </div>

                {canRegisterDecision ? (
                  <DecisionForm
                    onSubmit={async (justification) => {
                      const payload: InboxDecisionCreate = { decision: 'no_hedge', justification };
                      await submitDecision(payload);
                    }}
                  />
                ) : (
                  <div className="text-sm text-[var(--sapContent_LabelColor)]">
                    Ações disponíveis apenas para Auditoria.
                  </div>
                )}
              </div>

              <div className="p-3 border border-[var(--sapGroup_ContentBorderColor)] rounded">
                <div className="text-sm font-['72:Bold',sans-serif] mb-2">Histórico</div>
                {decisions.length === 0 ? (
                  <div className="text-sm text-[var(--sapContent_LabelColor)]">Sem decisões registradas.</div>
                ) : (
                  <div className="space-y-2">
                    {decisions.map(d => (
                      <div key={d.id} className="p-2 rounded bg-[var(--sapTile_Background)] border border-[var(--sapGroup_ContentBorderColor)]">
                        <div className="text-xs text-[var(--sapContent_LabelColor)]">{new Date(d.created_at).toLocaleString('pt-BR')}</div>
                        <div className="text-sm">{d.justification}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <FioriFlexibleColumnLayout
      masterTitle={UX_COPY.pages.pending.title}
      masterContent={master}
      detailContent={detail}
      masterWidth={360}
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
