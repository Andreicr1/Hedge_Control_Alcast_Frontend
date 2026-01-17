import { ReactNode } from 'react';

interface FioriBadgeProps {
  children: ReactNode;
  variant?: 'default' | 'information' | 'success' | 'warning' | 'error' | 'new';
  size?: 'small' | 'medium';
}

export function FioriBadge({ children, variant = 'default', size = 'medium' }: FioriBadgeProps) {
  const variantClasses = {
    default: 'bg-[var(--sapButton_Lite_Background,#ffffff)] text-[var(--sapButton_TextColor,#0064d9)] border-[var(--sapButton_Lite_BorderColor,#0064d9)]',
    information: 'bg-[var(--sapInformativeColor,#0064d9)] text-white border-transparent',
    success: 'bg-[var(--sapPositiveColor,#0f7d0f)] text-white border-transparent',
    warning: 'bg-[var(--sapCriticalColor,#e76500)] text-white border-transparent',
    error: 'bg-[var(--sapNegativeColor,#bb0000)] text-white border-transparent',
    new: 'bg-[#0064d9] text-white border-transparent',
  };

  const sizeClasses = {
    small: 'px-2 py-0.5 text-[12px]',
    medium: 'px-3 py-1 text-[14px]',
  };

  return (
    <span
      className={`inline-flex items-center justify-center font-['72:Semibold_Duplex',sans-serif] rounded-[4px] border border-solid leading-[normal] ${variantClasses[variant]} ${sizeClasses[size]}`}
      data-name="Badge"
    >
      {children}
    </span>
  );
}
