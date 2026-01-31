import { useMemo, useState } from 'react';
import { Icon } from '@ui5/webcomponents-react';

import { useTimelineSubject } from '../../../hooks';
import { RoleName, TIMELINE_V1_EVENT_TYPES, TimelineEvent } from '../../../types';
import { ErrorState } from '../ui/ErrorState';
import { LoadingState } from '../ui/LoadingState';
import { EmptyState } from '../ui/EmptyState';
import { FioriButton } from '../fiori/FioriButton';
import { useAuthContext } from '../AuthProvider';
import { UX_COPY } from '../../ux/copy';
import { formatDateTime } from '../../ux/format';
import {
  createHumanComment,
  correctHumanComment,
  createHumanAttachmentEvent,
  downloadHumanAttachment,
  uploadHumanAttachment,
  type TimelineVisibility,
} from '../../../services/timeline.service';
import { canUseTimelineFinanceVisibility, canWriteTimeline } from '../../auth/accessPolicy';

function formatDateTimeLabel(value: string): string {
  return formatDateTime(value, 'pt-BR');
}

function eventTypeLabel(eventType: string): string {
  switch (eventType) {
    case 'SO_CREATED':
      return 'Pedido de Venda criado';
    case 'PO_CREATED':
      return 'Pedido de Compra criado';
    case 'CONTRACT_CREATED':
      return 'Contrato criado';
    case 'EXPOSURE_UPDATED':
      return 'Exposição atualizada';
    case 'MTM_REQUIRED':
      return 'Marcação a mercado necessária';
    case 'WORKFLOW_REQUESTED':
      return 'Aprovação solicitada';
    case 'WORKFLOW_APPROVED':
      return 'Aprovado';
    case 'WORKFLOW_REJECTED':
      return 'Rejeitado';
    case 'WORKFLOW_ADJUSTMENT_REQUESTED':
      return 'Ajuste solicitado';
    case 'WORKFLOW_EXECUTED':
      return 'Executado';
    case 'human.comment.created':
      return 'Comentário';
    case 'human.comment.corrected':
      return 'Comentário (correção)';
    case 'human.attachment.added':
      return 'Anexo';
    case 'human.mentioned':
      return 'Menção';
    default:
      return eventType;
  }
}

const WORKFLOW_EVENT_TYPES = [
  'WORKFLOW_REQUESTED',
  'WORKFLOW_APPROVED',
  'WORKFLOW_REJECTED',
  'WORKFLOW_ADJUSTMENT_REQUESTED',
  'WORKFLOW_EXECUTED',
] as const;

function isKnownWorkflowType(eventType: string): boolean {
  return (WORKFLOW_EVENT_TYPES as readonly string[]).includes(eventType);
}

function visibilityLabel(value: TimelineVisibility): string {
  return value === 'finance' ? 'Financeiro' : 'Geral';
}

function isKnownV1Type(eventType: string): boolean {
  return (TIMELINE_V1_EVENT_TYPES as readonly string[]).includes(eventType);
}

function isKnownType(eventType: string): boolean {
  return isKnownV1Type(eventType) || isKnownWorkflowType(eventType) || eventType.startsWith('human.');
}

function safeString(value: unknown): string | null {
  return typeof value === 'string' ? value : null;
}

function safeNumber(value: unknown): number | null {
  return typeof value === 'number' && Number.isFinite(value) ? value : null;
}

type AttachmentRef = {
  attachment_event_id: number;
  file_id: string;
  file_name: string;
  mime: string;
  size: number;
  checksum?: string;
  storage_uri: string;
};

function attachmentRefFromAttachmentEvent(ev: TimelineEvent): AttachmentRef | null {
  const p = (ev.payload || {}) as any;
  const fileId = safeString(p.file_id);
  const fileName = safeString(p.file_name);
  const mime = safeString(p.mime);
  const size = safeNumber(p.size);
  const storageUri = safeString(p.storage_uri);
  const checksum = safeString(p.checksum) || undefined;

  if (!fileId || !fileName || !mime || size === null || !storageUri) return null;
  return {
    attachment_event_id: ev.id,
    file_id: fileId,
    file_name: fileName,
    mime,
    size,
    checksum,
    storage_uri: storageUri,
  };
}

function attachmentRefsFromPayload(payload: unknown): AttachmentRef[] {
  const p = (payload || {}) as any;
  const items = Array.isArray(p.attachments) ? p.attachments : [];
  const out: AttachmentRef[] = [];
  for (const it of items) {
    const a = it as any;
    const eventId = safeNumber(a.attachment_event_id);
    const fileId = safeString(a.file_id);
    const fileName = safeString(a.file_name);
    const mime = safeString(a.mime);
    const size = safeNumber(a.size);
    const storageUri = safeString(a.storage_uri);
    const checksum = safeString(a.checksum) || undefined;
    if (eventId === null || !fileId || !fileName || !mime || size === null || !storageUri) continue;
    out.push({
      attachment_event_id: eventId,
      file_id: fileId,
      file_name: fileName,
      mime,
      size,
      checksum,
      storage_uri: storageUri,
    });
  }
  return out;
}

function parseMentionsFromText(text: string): string[] {
  // MVP: collect @tokens (email or simple handle) and let backend normalize.
  const results = new Set<string>();
  const re = /@([\w.+-]+@[\w.-]+|[\w.-]{2,})/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    results.add(m[1]);
  }
  return Array.from(results);
}

async function triggerBrowserDownload(eventId: number): Promise<void> {
  const { blob, filename } = await downloadHumanAttachment(eventId);
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename || `anexo_${eventId}`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function computeCorrectionMap(events: TimelineEvent[]): Map<number, number> {
  // Maps superseded_event_id -> latest correcting_event_id within the loaded window.
  const map = new Map<number, number>();
  for (const ev of events) {
    if (typeof ev.supersedes_event_id === 'number') {
      map.set(ev.supersedes_event_id, ev.id);
    }
  }
  return map;
}

export interface TimelinePanelProps {
  title?: string;
  subjectType: string;
  subjectId: number;
  limit?: number;
  variant?: 'default' | 'audit';
}

export function TimelinePanel({
  title = 'Histórico',
  subjectType,
  subjectId,
  limit = 50,
  variant = 'default',
}: TimelinePanelProps) {
  const { events, isLoading, isError, error, hasMore, refetch, loadMore } = useTimelineSubject(
    subjectType,
    subjectId,
    limit
  );

  const { user } = useAuthContext();
  const canWrite = !!user && canWriteTimeline(user.role);
  const canUseFinanceVisibility = !!user && canUseTimelineFinanceVisibility(user.role);

  const [composerBody, setComposerBody] = useState('');
  const [composerVisibility, setComposerVisibility] = useState<TimelineVisibility>('all');
  const [composerAttachments, setComposerAttachments] = useState<AttachmentRef[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [composerError, setComposerError] = useState<string | null>(null);

  const [correctionTargetId, setCorrectionTargetId] = useState<number | null>(null);
  const [correctionBody, setCorrectionBody] = useState('');
  const [correctionVisibility, setCorrectionVisibility] = useState<TimelineVisibility>('all');
  const [correctionAttachments, setCorrectionAttachments] = useState<AttachmentRef[]>([]);
  const [isCorrecting, setIsCorrecting] = useState(false);

  const correctedBy = useMemo(() => computeCorrectionMap(events), [events]);

  const grouped = useMemo(() => {
    if (variant !== 'audit') return null;
    const manual: TimelineEvent[] = [];
    const automatic: TimelineEvent[] = [];
    for (const ev of events) {
      if (ev.event_type.startsWith('human.')) manual.push(ev);
      else automatic.push(ev);
    }
    return { manual, automatic };
  }, [events, variant]);

  const renderEvent = (ev: TimelineEvent) => {
    const isSuperseded = correctedBy.has(ev.id);
    const correctionId = correctedBy.get(ev.id);
    const known = isKnownType(ev.event_type);

    const payload = ev.payload || {};
    const commentBody = safeString((payload as any).body);
    const attachmentName = safeString((payload as any).file_name);
    const commentAttachments = attachmentRefsFromPayload(payload);
    const mention = safeString((payload as any).mention);
    const mentionCommentId = safeNumber((payload as any).comment_event_id);

    return (
      <div
        key={ev.id}
        className={`p-3 rounded border ${
          isSuperseded ? 'bg-[var(--sapGroup_ContentBackground)] opacity-75' : 'bg-white'
        } border-[var(--sapGroup_ContentBorderColor)]`}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-['72:Bold',sans-serif] text-sm text-[#131e29] truncate">
                {eventTypeLabel(ev.event_type)}
              </span>
              {!known && (
                <span className="text-xs px-2 py-0.5 rounded bg-[var(--sapErrorBackground,#ffebeb)] text-[var(--sapNegativeColor,#b00)]">
                  tipo não reconhecido
                </span>
              )}
              {ev.visibility === 'finance' && (
                <span className="text-xs px-2 py-0.5 rounded bg-[var(--sapWarningBackground,#fff3b8)] text-[var(--sapWarningColor,#8d2a00)]">
                  Financeiro
                </span>
              )}
            </div>
            <div className="text-xs text-[var(--sapContent_LabelColor)] mt-1">{formatDateTimeLabel(ev.occurred_at)}</div>

            {isSuperseded && typeof correctionId === 'number' && (
              <div className="text-xs text-[var(--sapContent_LabelColor)] mt-1">Comentário revisado</div>
            )}

            {commentBody && <div className="mt-2 text-sm text-[#131e29] whitespace-pre-wrap">{commentBody}</div>}

            {commentAttachments.length > 0 && (
              <div className="mt-2">
                <div className="text-xs text-[var(--sapContent_LabelColor)] mb-1">Anexos</div>
                <div className="flex flex-col gap-1">
                  {commentAttachments.map((a) => (
                    <div key={a.attachment_event_id} className="flex items-center justify-between gap-2">
                      <span className="text-sm text-[#131e29] truncate">{a.file_name}</span>
                      <FioriButton variant="ghost" onClick={() => void triggerBrowserDownload(a.attachment_event_id)}>
                        Baixar
                      </FioriButton>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {ev.event_type === 'human.mentioned' && mention && typeof mentionCommentId === 'number' && (
              <div className="mt-2 text-sm text-[#131e29]">
                <span className="text-xs text-[var(--sapContent_LabelColor)]">Menção:</span> @{mention}
              </div>
            )}

            {ev.event_type === 'human.attachment.added' && attachmentName && (
              <div className="mt-2 flex items-center gap-2">
                <span className="text-sm text-[#131e29]">{attachmentName}</span>
                <FioriButton variant="ghost" onClick={() => void triggerBrowserDownload(ev.id)}>
                  Baixar
                </FioriButton>
              </div>
            )}
          </div>

          <div className="text-right">
            {canWrite && ev.event_type.startsWith('human.comment') && !isSuperseded && (
              <div className="mt-2">
                <FioriButton
                  variant="ghost"
                  onClick={() => {
                    setCorrectionTargetId(ev.id);
                    setCorrectionBody(commentBody || '');
                    setCorrectionVisibility(ev.visibility);
                    setCorrectionAttachments(commentAttachments);
                  }}
                >
                  Revisar
                </FioriButton>
              </div>
            )}
          </div>
        </div>

        {canWrite && correctionTargetId === ev.id && (
          <div className="mt-3 p-3 rounded border border-[var(--sapGroup_ContentBorderColor)] bg-white">
            <div className="text-xs text-[var(--sapContent_LabelColor)] mb-2">Revisão do comentário</div>

            {correctionAttachments.length > 0 && (
              <div className="mb-2">
                <div className="text-xs text-[var(--sapContent_LabelColor)] mb-1">Anexos vinculados</div>
                <div className="flex flex-col gap-1">
                  {correctionAttachments.map((a) => (
                    <div key={a.attachment_event_id} className="flex items-center justify-between gap-2">
                      <span className="text-sm text-[#131e29] truncate">{a.file_name}</span>
                      <div className="flex items-center gap-2">
                        <FioriButton variant="ghost" onClick={() => void triggerBrowserDownload(a.attachment_event_id)}>
                          Baixar
                        </FioriButton>
                        <FioriButton
                          variant="ghost"
                          onClick={() =>
                            setCorrectionAttachments((prev) => prev.filter((x) => x.attachment_event_id !== a.attachment_event_id))
                          }
                        >
                          Remover
                        </FioriButton>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <textarea
              className="w-full text-sm border rounded p-2"
              value={correctionBody}
              onChange={(e) => setCorrectionBody(e.target.value)}
              aria-label="Texto de correção"
              title="Texto de correção"
              rows={3}
              disabled={isCorrecting}
            />

            <div className="flex items-center justify-between gap-2 mt-2">
              <input
                type="file"
                className="text-xs"
                aria-label="Adicionar anexo de correção"
                title="Adicionar anexo de correção"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f)
                    void onUploadAttachment(f, correctionVisibility, (a) =>
                      setCorrectionAttachments((prev) => [...prev, a])
                    );
                  e.currentTarget.value = '';
                }}
                disabled={isCorrecting}
              />
              <div className="text-xs text-[var(--sapContent_LabelColor)]">Visibilidade: {visibilityLabel(correctionVisibility)}</div>
            </div>

            <div className="flex items-center justify-end gap-2 mt-2">
              <FioriButton
                variant="ghost"
                onClick={() => {
                  setCorrectionTargetId(null);
                  setCorrectionBody('');
                  setCorrectionAttachments([]);
                }}
                disabled={isCorrecting}
              >
                Cancelar
              </FioriButton>
              <FioriButton variant="default" onClick={() => void onSubmitCorrection(ev.id)} disabled={isCorrecting}>
                {isCorrecting ? 'Salvando...' : 'Salvar correção'}
              </FioriButton>
            </div>
          </div>
        )}
      </div>
    );
  };

  async function onSubmitComment() {
    const body = composerBody.trim();
    if (!body) return;

    setIsSubmitting(true);
    setComposerError(null);

    try {
      await createHumanComment({
        subject_type: subjectType,
        subject_id: subjectId,
        body,
        visibility: composerVisibility,
        mentions: parseMentionsFromText(body),
        attachments: composerAttachments,
      });
      setComposerBody('');
      setComposerAttachments([]);
      await refetch();
    } catch (e: any) {
      setComposerError(UX_COPY.errors.title);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function onUploadAttachment(file: File, visibility: TimelineVisibility, onAttached: (a: AttachmentRef) => void) {
    setIsSubmitting(true);
    setComposerError(null);
    try {
      const meta = await uploadHumanAttachment(file, visibility);
      const ev = await createHumanAttachmentEvent({
        subject_type: subjectType,
        subject_id: subjectId,
        ...meta,
        visibility,
      });

      const ref = attachmentRefFromAttachmentEvent(ev);
      if (ref) {
        onAttached(ref);
      }
      await refetch();
    } catch (e: any) {
      setComposerError(UX_COPY.errors.title);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function onSubmitCorrection(supersedesEventId: number) {
    const body = correctionBody.trim();
    if (!body) return;

    setIsCorrecting(true);
    setComposerError(null);
    try {
      await correctHumanComment({
        supersedes_event_id: supersedesEventId,
        body,
        mentions: parseMentionsFromText(body),
        attachments: correctionAttachments,
      });
      setCorrectionTargetId(null);
      setCorrectionBody('');
      setCorrectionAttachments([]);
      await refetch();
    } catch (e: any) {
      setComposerError(UX_COPY.errors.title);
    } finally {
      setIsCorrecting(false);
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {variant !== 'audit' && (
            <Icon name="history" style={{ width: '1rem', height: '1rem', color: 'var(--sapContent_IconColor)' }} />
          )}
          <h3 className="font-['72:Bold',sans-serif] text-base text-[#131e29] m-0">{title}</h3>
        </div>
        <FioriButton
          variant="ghost"
          icon={variant !== 'audit' ? 'refresh' : undefined}
          onClick={refetch}
        >
          Atualizar
        </FioriButton>
      </div>

      {canWrite && (
        <div className="mb-4 p-3 rounded border border-[var(--sapGroup_ContentBorderColor)] bg-[var(--sapGroup_ContentBackground)]">
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="text-sm font-['72:Bold',sans-serif] text-[#131e29]">Adicionar comentário</div>
            <div className="flex items-center gap-2">
              <label className="text-xs text-[var(--sapContent_LabelColor)]">Visibilidade</label>
              <select
                className="text-xs border rounded px-2 py-1 bg-white"
                value={composerVisibility}
                onChange={(e) => setComposerVisibility(e.target.value as TimelineVisibility)}
                title={
                  canUseFinanceVisibility
                    ? ''
                    : 'Somente os perfis Financeiro ou Administrador podem restringir a visibilidade para Financeiro.'
                }
              >
                <option value="all">Geral</option>
                {canUseFinanceVisibility && <option value="finance">Financeiro</option>}
              </select>
            </div>
          </div>

          <textarea
            className="w-full text-sm border rounded p-2 bg-white"
            placeholder="Digite um comentário. Para mencionar alguém, use @nome."
            value={composerBody}
            onChange={(e) => setComposerBody(e.target.value)}
            rows={3}
            disabled={isSubmitting}
          />

          {composerAttachments.length > 0 && (
            <div className="mt-2">
              <div className="text-xs text-[var(--sapContent_LabelColor)] mb-1">Anexos vinculados ao comentário</div>
              <div className="flex flex-col gap-1">
                {composerAttachments.map((a) => (
                  <div key={a.attachment_event_id} className="flex items-center justify-between gap-2">
                    <div className="text-sm text-[#131e29] truncate">
                      {a.file_name}
                    </div>
                    <div className="flex items-center gap-2">
                      <FioriButton variant="ghost" onClick={() => void triggerBrowserDownload(a.attachment_event_id)}>
                        Baixar
                      </FioriButton>
                      <FioriButton
                        variant="ghost"
                        onClick={() =>
                          setComposerAttachments((prev) => prev.filter((x) => x.attachment_event_id !== a.attachment_event_id))
                        }
                      >
                        Remover
                      </FioriButton>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center justify-between mt-2 gap-2">
            <div className="flex items-center gap-2">
              <input
                type="file"
                className="text-xs"
                aria-label="Adicionar anexo"
                title="Adicionar anexo"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f)
                    void onUploadAttachment(f, composerVisibility, (a) =>
                      setComposerAttachments((prev) => [...prev, a])
                    );
                  // reset so selecting same file twice triggers onChange
                  e.currentTarget.value = '';
                }}
                disabled={isSubmitting}
              />
              <span className="text-xs text-[var(--sapContent_LabelColor)]">
                O anexo ficará registrado no histórico e vinculado ao comentário.
              </span>
            </div>

            <FioriButton variant="default" onClick={() => void onSubmitComment()} disabled={isSubmitting}>
              {isSubmitting ? 'Enviando...' : 'Enviar'}
            </FioriButton>
          </div>

          {composerError && <div className="mt-2 text-xs text-[var(--sapNegativeColor,#b00)]">{composerError}</div>}
        </div>
      )}

      {isLoading && events.length === 0 ? (
        <LoadingState message="Carregando histórico..." />
      ) : isError ? (
        <ErrorState error={error} onRetry={refetch} />
      ) : events.length === 0 ? (
        variant === 'audit' ? (
          <div className="py-4 text-sm text-[var(--sapContent_LabelColor)]">
            Ainda não há registros para este item.
          </div>
        ) : (
          <EmptyState
            title="Sem registros"
            description="Ainda não há registros no histórico para este item."
            icon={
              <Icon name="history" style={{ width: '2rem', height: '2rem', color: 'var(--sapContent_IconColor)' }} />
            }
          />
        )
      ) : (
        <div className="space-y-2">
          {variant === 'audit' && grouped ? (
            <div className="space-y-4">
              <div>
                <div className="text-xs text-[var(--sapContent_LabelColor)] mb-2">
                  Eventos automáticos ({grouped.automatic.length})
                </div>
                {grouped.automatic.length === 0 ? (
                  <div className="text-sm text-[var(--sapContent_LabelColor)]">Sem eventos automáticos.</div>
                ) : (
                  <div className="space-y-2">{grouped.automatic.map(renderEvent)}</div>
                )}
              </div>

              <div>
                <div className="text-xs text-[var(--sapContent_LabelColor)] mb-2">
                  Comentários e anexos ({grouped.manual.length})
                </div>
                {grouped.manual.length === 0 ? (
                  <div className="text-sm text-[var(--sapContent_LabelColor)]">Sem comentários.</div>
                ) : (
                  <div className="space-y-2">{grouped.manual.map(renderEvent)}</div>
                )}
              </div>
            </div>
          ) : (
            <>{events.map(renderEvent)}</>
          )}

          <div className="flex items-center justify-center pt-2">
            {hasMore ? (
              <FioriButton
                variant="default"
                icon={variant !== 'audit' ? 'slim-arrow-down' : undefined}
                onClick={loadMore}
                disabled={isLoading}
              >
                {isLoading ? 'Carregando...' : 'Carregar mais'}
              </FioriButton>
            ) : (
              <div className="text-xs text-[var(--sapContent_LabelColor)]">Fim da lista</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
