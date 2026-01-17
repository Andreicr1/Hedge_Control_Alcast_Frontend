import { ReactNode } from 'react';

interface FioriTileProps {
  title: string;
  subtitle?: string;
  value?: string | number;
  unit?: string;
  icon?: ReactNode;
  valueColor?: 'positive' | 'critical' | 'negative' | 'neutral';
  onClick?: () => void;
  footer?: ReactNode;
}

export function FioriTile({
  title,
  subtitle,
  value,
  unit,
  icon,
  valueColor = 'neutral',
  onClick,
  footer,
}: FioriTileProps) {
  const getValueColor = () => {
    switch (valueColor) {
      case 'positive':
        return 'var(--sapPositiveTextColor)';
      case 'critical':
        return 'var(--sapCriticalTextColor)';
      case 'negative':
        return 'var(--sapNegativeTextColor)';
      default:
        return 'var(--sapContent_ForegroundColor)';
    }
  };

  const Component = onClick ? 'button' : 'div';

  return (
    <Component
      onClick={onClick}
      className={`
        flex flex-col h-full
        bg-[var(--sapTile_Background)]
        border border-[var(--sapTile_BorderColor)]
        rounded
        shadow-[var(--sapContent_Shadow0)]
        ${onClick ? 'cursor-pointer hover:shadow-[var(--sapContent_Shadow1)] transition-shadow' : ''}
      `}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      <div className="flex-1 p-4">
        {/* Header with Icon */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="text-[var(--sapTile_TitleTextColor)] font-normal text-sm mb-1">
              {title}
            </div>
            {subtitle && (
              <div className="text-[var(--sapTile_TextColor)] text-xs">{subtitle}</div>
            )}
          </div>
          {icon && (
            <div className="ml-2 text-[var(--sapContent_IconColor)] flex-shrink-0">
              {icon}
            </div>
          )}
        </div>

        {/* Value */}
        {value !== undefined && (
          <div className="flex items-baseline gap-1">
            <span
              className="text-2xl font-light"
              style={{ color: getValueColor() }}
            >
              {value}
            </span>
            {unit && (
              <span className="text-sm text-[var(--sapTile_TextColor)]">{unit}</span>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      {footer && (
        <div className="border-t border-[var(--sapTile_BorderColor)] px-4 py-2 text-xs text-[var(--sapTile_TextColor)]">
          {footer}
        </div>
      )}
    </Component>
  );
}
