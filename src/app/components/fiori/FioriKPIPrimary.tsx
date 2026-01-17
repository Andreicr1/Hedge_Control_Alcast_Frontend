import { ReactNode } from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface FioriKPIPrimaryProps {
  title: string;
  value: string | number;
  unit?: string;
  valueColor?: 'positive' | 'critical' | 'neutral';
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  subtitle?: string;
  icon?: ReactNode;
}

/**
 * Primary KPI Component - Enterprise Grade
 * Usado para o KPI mais importante da tela, com maior destaque visual
 */
export function FioriKPIPrimary({
  title,
  value,
  unit,
  valueColor = 'neutral',
  trend,
  trendValue,
  subtitle,
  icon,
}: FioriKPIPrimaryProps) {
  const getValueColor = () => {
    switch (valueColor) {
      case 'positive':
        return 'text-[var(--sapPositiveTextColor)]';
      case 'critical':
        return 'text-[var(--sapNegativeTextColor)]';
      default:
        return 'text-[#131e29]';
    }
  };

  const getTrendIcon = () => {
    if (trend === 'up')
      return <TrendingUp className="w-5 h-5 text-[var(--sapPositiveColor)]" />;
    if (trend === 'down')
      return <TrendingDown className="w-5 h-5 text-[var(--sapNegativeColor)]" />;
    if (trend === 'neutral')
      return <Minus className="w-5 h-5 text-[var(--sapNeutralTextColor)]" />;
    return null;
  };

  const getTrendColor = () => {
    if (trend === 'up') return 'text-[var(--sapPositiveTextColor)]';
    if (trend === 'down') return 'text-[var(--sapNegativeTextColor)]';
    return 'text-[var(--sapNeutralTextColor)]';
  };

  return (
    <div
      className="bg-white border border-[var(--sapList_BorderColor)] rounded-lg p-6 shadow-sm"
      role="article"
      aria-label={`Primary KPI: ${title}`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          {icon && (
            <div className="text-[var(--sapContent_IconColor)]">{icon}</div>
          )}
          <h3 className="font-['72:Bold',sans-serif] text-base text-[var(--sapContent_LabelColor)] uppercase tracking-wide">
            {title}
          </h3>
        </div>
        {trend && getTrendIcon()}
      </div>

      <div className="flex items-baseline gap-2 mb-2">
        <div className={`font-['72:Black',sans-serif] text-4xl ${getValueColor()}`}>
          {value}
        </div>
        {unit && (
          <div className="font-['72:Bold',sans-serif] text-lg text-[var(--sapContent_LabelColor)]">
            {unit}
          </div>
        )}
      </div>

      {(trendValue || subtitle) && (
        <div className="flex items-center gap-3 pt-2 border-t border-[var(--sapList_BorderColor)]">
          {trendValue && (
            <div className={`flex items-center gap-1 font-['72:Semibold_Duplex',sans-serif] text-sm ${getTrendColor()}`}>
              <span>{trendValue}</span>
            </div>
          )}
          {subtitle && (
            <div className="font-['72:Regular',sans-serif] text-xs text-[var(--sapContent_LabelColor)]">
              {subtitle}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
