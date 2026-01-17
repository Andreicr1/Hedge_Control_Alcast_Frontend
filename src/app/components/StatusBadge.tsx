interface StatusBadgeProps {
  status: string;
  type?: 'default' | 'positive' | 'negative' | 'critical' | 'neutral';
}

const statusColorMap: Record<string, string> = {
  Active: 'positive',
  Draft: 'neutral',
  Closed: 'neutral',
  Sent: 'critical',
  Awarded: 'positive',
  Rejected: 'negative',
  Settled: 'neutral',
  Open: 'critical',
  Partial: 'critical',
  Hedged: 'positive',
};

export function StatusBadge({ status, type }: StatusBadgeProps) {
  const colorType = type || statusColorMap[status] || 'neutral';

  const colorClasses = {
    positive: 'bg-[var(--sapPositiveColor)] text-white',
    negative: 'bg-[var(--sapNegativeColor)] text-white',
    critical: 'bg-[var(--sapCriticalColor)] text-white',
    neutral: 'bg-[var(--sapNeutralColor)] text-white',
    default: 'bg-gray-200 text-gray-800',
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-1 rounded text-xs ${colorClasses[colorType]}`}
      role="status"
      aria-label={`Status: ${status}`}
    >
      {status}
    </span>
  );
}
