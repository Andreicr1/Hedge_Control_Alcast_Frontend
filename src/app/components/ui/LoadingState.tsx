/**
 * Loading State Component
 * 
 * Componente padronizado para estados de carregamento.
 */

import { BusyIndicator } from '@ui5/webcomponents-react';

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
  const ui5Size = size === 'small' ? 'Small' : size === 'large' ? 'Large' : 'M';

  const content = (
    <div className="flex flex-col items-center justify-center gap-3">
      <BusyIndicator active delay={0} size={ui5Size as any} />
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
