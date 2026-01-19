import { ReactNode } from 'react';

type StatusType =
  | 'success'
  | 'error'
  | 'warning'
  | 'information'
  | 'neutral'
  | 'positive'
  | 'critical';

interface FioriObjectStatusProps {
  children: ReactNode;
  status?: StatusType;
  inverted?: boolean;
  icon?: ReactNode;
}

export function FioriObjectStatus({
  children,
  status = 'neutral',
  inverted = false,
  icon,
}: FioriObjectStatusProps) {
  const getClasses = (): { bg: string; border: string; text: string } => {
    const base = {
      success: {
        bg: inverted ? 'bg-[var(--sapSuccessTextColor)]' : 'bg-[var(--sapSuccessBackground)]',
        border: 'border-[var(--sapSuccessBorderColor)]',
        text: inverted ? 'text-white' : 'text-[var(--sapSuccessTextColor)]',
      },
      error: {
        bg: inverted ? 'bg-[var(--sapErrorTextColor)]' : 'bg-[var(--sapErrorBackground)]',
        border: 'border-[var(--sapErrorBorderColor)]',
        text: inverted ? 'text-white' : 'text-[var(--sapErrorTextColor)]',
      },
      warning: {
        bg: inverted ? 'bg-[var(--sapWarningTextColor)]' : 'bg-[var(--sapWarningBackground)]',
        border: 'border-[var(--sapWarningBorderColor)]',
        text: inverted ? 'text-white' : 'text-[var(--sapWarningTextColor)]',
      },
      information: {
        bg: inverted ? 'bg-[var(--sapInformationTextColor)]' : 'bg-[var(--sapInformationBackground)]',
        border: 'border-[var(--sapInformationBorderColor)]',
        text: inverted ? 'text-white' : 'text-[var(--sapInformationTextColor)]',
      },
      neutral: {
        bg: inverted ? 'bg-[var(--sapNeutralColor)]' : 'bg-[#f2f2f2]',
        border: 'border-[var(--sapNeutralBorderColor)]',
        text: inverted ? 'text-white' : 'text-[var(--sapNeutralTextColor)]',
      },
      positive: {
        bg: inverted ? 'bg-[var(--sapSuccessTextColor)]' : 'bg-[var(--sapSuccessBackground)]',
        border: 'border-[var(--sapSuccessBorderColor)]',
        text: inverted ? 'text-white' : 'text-[var(--sapSuccessTextColor)]',
      },
      critical: {
        bg: inverted ? 'bg-[var(--sapWarningTextColor)]' : 'bg-[var(--sapWarningBackground)]',
        border: 'border-[var(--sapWarningBorderColor)]',
        text: inverted ? 'text-white' : 'text-[var(--sapWarningTextColor)]',
      },
    } satisfies Record<StatusType, { bg: string; border: string; text: string }>;

    return base[status] || base.neutral;
  };

  const { bg, border, text } = getClasses();

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded border ${bg} ${border} ${text}`}
      role="status"
      aria-label={`Status: ${children}`}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      <span className="font-normal">{children}</span>
    </span>
  );
}

// Status mapping helper
export const mapStatusToType = (status: string): StatusType => {
  const statusMap: Record<string, StatusType> = {
    Active: 'success',
    Completed: 'success',
    Closed: 'neutral',
    Draft: 'information',
    Pending: 'warning',
    Rejected: 'error',
    Error: 'error',
    Failed: 'error',
    Settled: 'neutral',
    Open: 'warning',
    Partial: 'warning',
    Hedged: 'success',
    Sent: 'information',
    Awarded: 'success',
    Quoted: 'information',
    Accepted: 'success',
    Inactive: 'neutral',
    Suspended: 'error',
  };

  if (statusMap[status]) return statusMap[status];

  const normalized = String(status)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase();

  const normalizedMap: Record<string, StatusType> = {
    // Backend enums
    active: 'success',
    completed: 'success',
    draft: 'information',
    cancelled: 'error',

    // PT-BR labels
    ativo: 'success',
    concluido: 'success',
    rascunho: 'information',
    cancelado: 'error',
  };

  return normalizedMap[normalized] || 'neutral';
};