import { ReactNode } from 'react';

interface FioriKPISecondaryProps {
  title: string;
  value: string | number;
  unit?: string;
  valueColor?: 'positive' | 'critical' | 'neutral' | 'information';
  icon?: ReactNode;
  subtitle?: string;
}

/**
 * Secondary KPI Component - Enterprise Grade
 * Usado para KPIs de suporte, com peso visual reduzido
 */
export function FioriKPISecondary({
  title,
  value,
  unit,
  valueColor = 'neutral',
  icon,
  subtitle,
}: FioriKPISecondaryProps) {
  const getValueColor = () => {
    switch (valueColor) {
      case 'positive':
        return 'text-[var(--sapPositiveTextColor)]';
      case 'critical':
        return 'text-[var(--sapNegativeTextColor)]';
      case 'information':
        return 'text-[var(--sapInformativeColor)]';
      default:
        return 'text-[#131e29]';
    }
  };

  return (
    <div
      className="bg-[var(--sapList_Background)] border border-[var(--sapList_BorderColor)] rounded p-3 hover:shadow-sm transition-shadow"
      role="article"
      aria-label={`Secondary KPI: ${title}`}
    >
      <div className="flex items-center gap-2 mb-2">
        {icon && (
          <div className="text-[var(--sapContent_IconColor)] opacity-70">
            {icon}
          </div>
        )}
        <div className="font-['72:Regular',sans-serif] text-xs text-[var(--sapContent_LabelColor)] uppercase tracking-wider">
          {title}
        </div>
      </div>

      <div className="flex items-baseline gap-1.5">
        <div className={`font-['72:Bold',sans-serif] text-xl ${getValueColor()}`}>
          {value}
        </div>
        {unit && (
          <div className="font-['72:Regular',sans-serif] text-sm text-[var(--sapContent_LabelColor)]">
            {unit}
          </div>
        )}
      </div>

      {subtitle && (
        <div className="font-['72:Regular',sans-serif] text-xs text-[var(--sapContent_LabelColor)] mt-1.5 opacity-80">
          {subtitle}
        </div>
      )}
    </div>
  );
}
