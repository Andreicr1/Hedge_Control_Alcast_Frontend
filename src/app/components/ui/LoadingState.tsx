/**
 * Loading State Component
 * 
 * Componente padronizado para estados de carregamento.
 */

import { Loader2 } from 'lucide-react';

interface LoadingStateProps {
  message?: string;
  size?: 'small' | 'medium' | 'large';
  fullPage?: boolean;
}

export function LoadingState({
  message = 'Carregando...',
  size = 'medium',
  fullPage = false,
}: LoadingStateProps) {
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8',
    large: 'w-12 h-12',
  };

  const content = (
    <div className="flex flex-col items-center justify-center gap-3">
      <Loader2 className={`${sizeClasses[size]} text-[var(--sapButton_TextColor,#0064d9)] animate-spin`} />
      {message && (
        <p className="font-['72:Regular',sans-serif] text-sm text-[var(--sapContent_LabelColor,#556b82)]">
          {message}
        </p>
      )}
    </div>
  );

  if (fullPage) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        {content}
      </div>
    );
  }

  return content;
}
