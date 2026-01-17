import { ReactNode } from 'react';
import { AlertCircle, Info } from 'lucide-react';

interface FioriEmptyStateProps {
  icon?: ReactNode;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  variant?: 'info' | 'warning' | 'neutral';
}

/**
 * Empty State Component - Enterprise Grade
 * Estados vazios informativos para listas e dados ausentes
 */
export function FioriEmptyState({
  icon,
  title,
  description,
  action,
  variant = 'neutral',
}: FioriEmptyStateProps) {
  const getIcon = () => {
    if (icon) return icon;
    if (variant === 'warning')
      return <AlertCircle className="w-12 h-12 text-[var(--sapCriticalColor)]" />;
    return <Info className="w-12 h-12 text-[var(--sapContent_IconColor)]" />;
  };

  const getBgColor = () => {
    if (variant === 'warning') return 'bg-[var(--sapErrorBackground,#fff4f4)]';
    if (variant === 'info') return 'bg-[var(--sapInfoBackground,#f5faff)]';
    return 'bg-[var(--sapList_Background)]';
  };

  return (
    <div
      className={`${getBgColor()} border border-[var(--sapList_BorderColor)] rounded-lg p-8 text-center`}
      role="status"
      aria-live="polite"
    >
      <div className="flex justify-center mb-4 opacity-60">{getIcon()}</div>

      <h3 className="font-['72:Bold',sans-serif] text-base text-[#131e29] mb-2">
        {title}
      </h3>

      <p className="font-['72:Regular',sans-serif] text-sm text-[var(--sapContent_LabelColor)] mb-4 max-w-md mx-auto">
        {description}
      </p>

      {action && (
        <button
          onClick={action.onClick}
          className="px-4 py-2 text-sm font-['72:Regular',sans-serif] text-white bg-[var(--sapButton_Emphasized_Background)] border border-[var(--sapButton_Emphasized_BorderColor)] rounded hover:bg-[var(--sapButton_Emphasized_Hover_Background)] transition-colors"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
