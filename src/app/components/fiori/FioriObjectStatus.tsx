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
  const getStyles = () => {
    const styles: Record<StatusType, { bg: string; border: string; text: string }> = {
      success: {
        bg: inverted ? 'var(--sapSuccessTextColor)' : 'var(--sapSuccessBackground)',
        border: 'var(--sapSuccessBorderColor)',
        text: inverted ? '#fff' : 'var(--sapSuccessTextColor)',
      },
      error: {
        bg: inverted ? 'var(--sapErrorTextColor)' : 'var(--sapErrorBackground)',
        border: 'var(--sapErrorBorderColor)',
        text: inverted ? '#fff' : 'var(--sapErrorTextColor)',
      },
      warning: {
        bg: inverted ? 'var(--sapWarningTextColor)' : 'var(--sapWarningBackground)',
        border: 'var(--sapWarningBorderColor)',
        text: inverted ? '#fff' : 'var(--sapWarningTextColor)',
      },
      information: {
        bg: inverted ? 'var(--sapInformationTextColor)' : 'var(--sapInformationBackground)',
        border: 'var(--sapInformationBorderColor)',
        text: inverted ? '#fff' : 'var(--sapInformationTextColor)',
      },
      neutral: {
        bg: inverted ? 'var(--sapNeutralColor)' : '#f2f2f2',
        border: 'var(--sapNeutralBorderColor)',
        text: inverted ? '#fff' : 'var(--sapNeutralTextColor)',
      },
      positive: {
        bg: inverted ? 'var(--sapSuccessTextColor)' : 'var(--sapSuccessBackground)',
        border: 'var(--sapSuccessBorderColor)',
        text: inverted ? '#fff' : 'var(--sapSuccessTextColor)',
      },
      critical: {
        bg: inverted ? 'var(--sapWarningTextColor)' : 'var(--sapWarningBackground)',
        border: 'var(--sapWarningBorderColor)',
        text: inverted ? '#fff' : 'var(--sapWarningTextColor)',
      },
    };

    return styles[status] || styles.neutral;
  };

  const { bg, border, text } = getStyles();

  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded border"
      style={{
        backgroundColor: bg,
        borderColor: border,
        color: text,
      }}
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

  return statusMap[status] || 'neutral';
};