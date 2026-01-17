import { TrendingUp, TrendingDown } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: string | number;
  unit?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
}

export function KPICard({ title, value, unit, trend, trendValue }: KPICardProps) {
  const getTrendIcon = () => {
    if (trend === 'up') return <TrendingUp className="w-4 h-4 text-[var(--sapPositiveColor)]" />;
    if (trend === 'down') return <TrendingDown className="w-4 h-4 text-[var(--sapNegativeColor)]" />;
    return null;
  };

  return (
    <div
      className="bg-[var(--sapList_Background)] border border-[var(--sapUiBorderColor)] rounded p-4 shadow-sm"
      role="article"
      aria-label={`KPI: ${title}`}
    >
      <div className="text-sm text-[var(--sapContent_LabelColor)] mb-2">{title}</div>
      <div className="flex items-end justify-between">
        <div className="flex items-baseline gap-1">
          <div className="text-2xl font-semibold text-[var(--sapTextColor)]">{value}</div>
          {unit && <div className="text-sm text-[var(--sapContent_LabelColor)]">{unit}</div>}
        </div>
        {trend && trendValue && (
          <div className="flex items-center gap-1 text-sm">
            {getTrendIcon()}
            <span>{trendValue}</span>
          </div>
        )}
      </div>
    </div>
  );
}
