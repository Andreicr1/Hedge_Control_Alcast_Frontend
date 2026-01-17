import { ReactNode } from 'react';

interface FioriCardProps {
  children: ReactNode;
  className?: string;
  padding?: 'none' | 'small' | 'medium' | 'large';
}

export function FioriCard({ children, className = '', padding = 'medium' }: FioriCardProps) {
  const paddingClasses = {
    none: '',
    small: 'p-3',
    medium: 'p-4',
    large: 'p-6',
  };

  return (
    <div
      className={`bg-white rounded-[8px] shadow-[0_0_0_1px_rgba(217,217,217,1),0_2px_4px_0_rgba(0,0,0,0.1)] ${paddingClasses[padding]} ${className}`}
      data-name="Card"
    >
      {children}
    </div>
  );
}

interface FioriCardHeaderProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  badge?: ReactNode;
}

export function FioriCardHeader({ title, subtitle, action, badge }: FioriCardHeaderProps) {
  return (
    <div className="flex items-start justify-between mb-4">
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <h3 className="font-['72:Regular',sans-serif] text-[16px] text-[var(--sapTile_TitleTextColor,#131e29)] leading-[normal] m-0">
            {title}
          </h3>
          {badge}
        </div>
        {subtitle && (
          <p className="font-['72:Regular',sans-serif] text-[14px] text-[var(--sapContent_LabelColor,#556b82)] leading-[normal] mt-1 m-0">
            {subtitle}
          </p>
        )}
      </div>
      {action && <div className="ml-4">{action}</div>}
    </div>
  );
}

interface FioriCardContentProps {
  children: ReactNode;
}

export function FioriCardContent({ children }: FioriCardContentProps) {
  return <div className="sap-fiori-card-content">{children}</div>;
}

interface FioriCardMetricProps {
  value: string | number;
  label?: string;
  unit?: string;
  trend?: 'up' | 'down' | 'neutral';
  color?: 'default' | 'positive' | 'negative' | 'critical';
}

export function FioriCardMetric({ value, label, unit, trend, color = 'default' }: FioriCardMetricProps) {
  const colorClasses = {
    default: 'text-[var(--sapContent_ForegroundTextColor,#131e29)]',
    positive: 'text-[var(--sapPositiveTextColor,#0f7d0f)]',
    negative: 'text-[var(--sapNegativeTextColor,#bb0000)]',
    critical: 'text-[var(--sapCriticalTextColor,#e76500)]',
  };

  return (
    <div className="flex flex-col">
      {label && (
        <div className="font-['72:Regular',sans-serif] text-[14px] text-[var(--sapContent_LabelColor,#556b82)] leading-[normal] mb-1">
          {label}
        </div>
      )}
      <div className="flex items-baseline gap-2">
        <span className={`font-['72:Semibold_Duplex',sans-serif] text-[32px] leading-[normal] ${colorClasses[color]}`}>
          {value}
        </span>
        {unit && (
          <span className="font-['72:Regular',sans-serif] text-[14px] text-[var(--sapContent_LabelColor,#556b82)] leading-[normal]">
            {unit}
          </span>
        )}
      </div>
    </div>
  );
}
