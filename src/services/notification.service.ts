import type { TimelineEvent } from '../types';

export interface NotificationItem {
  id: string;
  title: string;
  object?: string;
  timestamp: string;
  href: string;
  read: boolean;
}

const STORAGE_KEY_READ = 'alcast.notifications.read.v1';

type ReadState = Record<string, string>; // id -> readAt ISO

function safeParseJson<T>(value: string | null): T | null {
  if (!value) return null;
  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
}

function loadReadState(): ReadState {
  return safeParseJson<ReadState>(localStorage.getItem(STORAGE_KEY_READ)) ?? {};
}

function saveReadState(state: ReadState): void {
  localStorage.setItem(STORAGE_KEY_READ, JSON.stringify(state));
}

export function markNotificationRead(id: string): void {
  const state = loadReadState();
  if (state[id]) return;
  state[id] = new Date().toISOString();
  saveReadState(state);
}

export function clearNotificationReadState(): void {
  localStorage.removeItem(STORAGE_KEY_READ);
}

function normalizeFractionalSeconds(value: string): string {
  // .ssssssZ / .ssssss+00:00 -> .sss...
  return String(value)
    .trim()
    .replace(/\.(\d{3})\d+(?=(Z|[+-]\d{2}:\d{2})$)/, '.$1');
}

function formatClockHHMM(d: Date): string {
  const hh = String(d.getHours()).padStart(2, '0');
  const mm = String(d.getMinutes()).padStart(2, '0');
  return `${hh}:${mm}`;
}

function isSameLocalDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function formatNotificationTimestamp(iso: string): string {
  const normalized = normalizeFractionalSeconds(iso);
  const d = new Date(normalized);
  if (!Number.isFinite(d.getTime())) return '—';

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const thatDay = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const diffDays = Math.round((thatDay.getTime() - today.getTime()) / (24 * 60 * 60 * 1000));

  if (diffDays === 0) return `Hoje, ${formatClockHHMM(d)}`;
  if (diffDays === -1) return `Ontem, ${formatClockHHMM(d)}`;

  const months = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'] as const;
  const dd = String(d.getDate()).padStart(2, '0');
  const mon = months[d.getMonth()] ?? '';
  return `${dd} ${mon}, ${formatClockHHMM(d)}`;
}

function subjectLabel(subjectType: string, subjectId: number): string {
  const key = String(subjectType || '').toLowerCase();
  if (key === 'deal') return `Deal ${subjectId}`;
  if (key === 'exposure') return `Exposição ${subjectId}`;
  if (key === 'approval') return `Aprovação ${subjectId}`;
  if (key === 'contract') return `Contrato ${subjectId}`;
  if (key === 'rfq') return `RFQ ${subjectId}`;
  return `${subjectType} ${subjectId}`;
}

function hrefForSubject(subjectType: string, subjectId: number): string {
  const key = String(subjectType || '').toLowerCase();
  if (key === 'deal') return `/financeiro/deals/${subjectId}`;
  if (key === 'exposure') return `/financeiro/exposicoes`;
  if (key === 'approval') return `/financeiro/aprovacoes?request_id=${encodeURIComponent(String(subjectId))}`;
  if (key === 'contract') return `/financeiro/contratos?id=${encodeURIComponent(String(subjectId))}`;
  if (key === 'rfq') return `/financeiro/rfqs?selected=${encodeURIComponent(String(subjectId))}`;
  return '/';
}

function toNotification(event: TimelineEvent): Omit<NotificationItem, 'read'> | null {
  const type = String(event.event_type || '').toUpperCase();

  // Scope is CLOSED: only active attention items.
  if (type.includes('APPROVAL') && type.includes('PENDING')) {
    return {
      id: `timeline:${event.id}`,
      title: 'Aprovação pendente',
      object: subjectLabel(event.subject_type, event.subject_id),
      timestamp: formatNotificationTimestamp(event.occurred_at),
      href: hrefForSubject('approval', event.subject_id),
    };
  }

  if (type.includes('TREASURY') && type.includes('PENDING')) {
    return {
      id: `timeline:${event.id}`,
      title: 'Decisão pendente',
      object: subjectLabel(event.subject_type, event.subject_id),
      timestamp: formatNotificationTimestamp(event.occurred_at),
      href: hrefForSubject(event.subject_type, event.subject_id),
    };
  }

  if ((type.includes('EXPOSURE') && type.includes('NO_DECISION')) || type === 'MTM_REQUIRED') {
    return {
      id: `timeline:${event.id}`,
      title: 'Exposição sem decisão',
      object: subjectLabel(event.subject_type, event.subject_id),
      timestamp: formatNotificationTimestamp(event.occurred_at),
      href: hrefForSubject('exposure', event.subject_id),
    };
  }

  if (type.includes('KYC') && (type.includes('OVERRIDE') || type.includes('EXCEPTION'))) {
    return {
      id: `timeline:${event.id}`,
      title: 'Exceção registrada',
      object: subjectLabel(event.subject_type, event.subject_id),
      timestamp: formatNotificationTimestamp(event.occurred_at),
      href: hrefForSubject(event.subject_type, event.subject_id),
    };
  }

  if (type.includes('QUOTE') && type.includes('EXPIRED')) {
    return {
      id: `timeline:${event.id}`,
      title: 'Cotação expirada',
      object: subjectLabel(event.subject_type, event.subject_id),
      timestamp: formatNotificationTimestamp(event.occurred_at),
      href: hrefForSubject(event.subject_type, event.subject_id),
    };
  }

  if (type.includes('CONTRACT') && (type.includes('CONFIRMED') || type.includes('LIQUIDATED'))) {
    return {
      id: `timeline:${event.id}`,
      title: type.includes('LIQUIDATED') ? 'Contrato liquidado' : 'Contrato confirmado',
      object: subjectLabel(event.subject_type, event.subject_id),
      timestamp: formatNotificationTimestamp(event.occurred_at),
      href: hrefForSubject('contract', event.subject_id),
    };
  }

  if (type.includes('OPERATIONAL') && type.includes('FAIL')) {
    return {
      id: `timeline:${event.id}`,
      title: 'Falha operacional',
      object: subjectLabel(event.subject_type, event.subject_id),
      timestamp: formatNotificationTimestamp(event.occurred_at),
      href: hrefForSubject(event.subject_type, event.subject_id),
    };
  }

  return null;
}

export function listNotificationsFromTimeline(events: TimelineEvent[]): NotificationItem[] {
  const readState = loadReadState();
  return events
    .map(toNotification)
    .filter(Boolean)
    .map((n) => ({
      ...n,
      read: !!readState[n!.id],
    })) as NotificationItem[];
}

export function countUnread(items: NotificationItem[]): number {
  return items.reduce((acc, it) => acc + (it.read ? 0 : 1), 0);
}
