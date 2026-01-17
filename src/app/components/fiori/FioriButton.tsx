import { ButtonHTMLAttributes, ReactNode } from 'react';

interface FioriButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'emphasized' | 'default' | 'ghost' | 'transparent' | 'negative' | 'positive';
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
}

export function FioriButton({ 
  variant = 'default', 
  icon, 
  iconPosition = 'left',
  fullWidth = false,
  children, 
  className = '', 
  ...props 
}: FioriButtonProps) {
  const variantClasses = {
    emphasized: `
      bg-[var(--sapButton_Emphasized_Background,#0064d9)] 
      text-[var(--sapButton_Emphasized_TextColor,#ffffff)] 
      border-[var(--sapButton_Emphasized_BorderColor,#0064d9)]
      hover:bg-[var(--sapButton_Emphasized_Hover_Background,#0054b8)]
      hover:border-[var(--sapButton_Emphasized_Hover_BorderColor,#0054b8)]
      active:bg-[var(--sapButton_Emphasized_Active_Background,#004a9e)]
      active:border-[var(--sapButton_Emphasized_Active_BorderColor,#004a9e)]
    `,
    default: `
      bg-[var(--sapButton_Background,#ffffff)] 
      text-[var(--sapButton_TextColor,#0064d9)] 
      border-[var(--sapButton_BorderColor,#0064d9)]
      hover:bg-[var(--sapButton_Hover_Background,#eaf6ff)]
      hover:border-[var(--sapButton_Hover_BorderColor,#0064d9)]
      active:bg-[var(--sapButton_Active_Background,#d3efff)]
      active:border-[var(--sapButton_Active_BorderColor,#0064d9)]
    `,
    ghost: `
      bg-transparent
      text-[var(--sapButton_TextColor,#0064d9)] 
      border-transparent
      hover:bg-[var(--sapButton_Lite_Hover_Background,#eaf6ff)]
      active:bg-[var(--sapButton_Lite_Active_Background,#d3efff)]
    `,
    transparent: `
      bg-transparent
      text-[var(--sapButton_TextColor,#0064d9)] 
      border-transparent
      hover:bg-[var(--sapButton_Lite_Hover_Background,#eaf6ff)]
      active:bg-[var(--sapButton_Lite_Active_Background,#d3efff)]
    `,
    negative: `
      bg-[var(--sapButton_Reject_Background,#ffffff)]
      text-[var(--sapButton_Reject_TextColor,#bb0000)] 
      border-[var(--sapButton_Reject_BorderColor,#bb0000)]
      hover:bg-[var(--sapButton_Reject_Hover_Background,#ffebeb)]
      hover:border-[var(--sapButton_Reject_Hover_BorderColor,#bb0000)]
      active:bg-[var(--sapButton_Reject_Active_Background,#ffd6d6)]
      active:border-[var(--sapButton_Reject_Active_BorderColor,#bb0000)]
    `,
    positive: `
      bg-[var(--sapButton_Accept_Background,#ffffff)]
      text-[var(--sapButton_Accept_TextColor,#0f7d0f)] 
      border-[var(--sapButton_Accept_BorderColor,#0f7d0f)]
      hover:bg-[var(--sapButton_Accept_Hover_Background,#ebf5eb)]
      hover:border-[var(--sapButton_Accept_Hover_BorderColor,#0f7d0f)]
      active:bg-[var(--sapButton_Accept_Active_Background,#d1ead1)]
      active:border-[var(--sapButton_Accept_Active_BorderColor,#0f7d0f)]
    `,
  };

  return (
    <button
      className={`
        inline-flex items-center justify-center gap-2
        px-4 py-2
        border border-solid
        rounded-[4px]
        font-['72:Semibold_Duplex',sans-serif]
        text-[14px]
        leading-[normal]
        cursor-pointer
        transition-all
        disabled:opacity-40
        disabled:cursor-not-allowed
        disabled:hover:bg-[var(--sapButton_Background,#ffffff)]
        ${variantClasses[variant]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      {...props}
    >
      {icon && iconPosition === 'left' && <span className="flex items-center">{icon}</span>}
      {children}
      {icon && iconPosition === 'right' && <span className="flex items-center">{icon}</span>}
    </button>
  );
}
