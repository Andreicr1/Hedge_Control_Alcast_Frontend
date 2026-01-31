/**
 * Empty State Component
 * 
 * Componente padronizado para estados vazios.
 */

import { Icon } from '@ui5/webcomponents-react';
import { FioriButton } from '../fiori/FioriButton';
import type { ReactNode } from 'react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: ReactNode;
  actionLabel?: string;
  onAction?: () => void;
  fullPage?: boolean;
}

export function EmptyState({
  title = 'Nenhum item encontrado',
  description = 'Não há dados para exibir no momento.',
  icon,
  actionLabel,
  onAction,
  fullPage = false,
}: EmptyStateProps) {
  const content = (
    <div className="flex flex-col items-center justify-center gap-4 p-6 text-center">
      <div className="w-16 h-16 rounded-full bg-[var(--sapNeutralBackground,#f5f5f5)] flex items-center justify-center">
        {icon || (
          <Icon name="document" style={{ width: '2rem', height: '2rem', color: 'var(--sapContent_IconColor,#556b82)' }} />
        )}
      </div>
      
      <div>
        <h3 className="font-['72:Bold',sans-serif] text-base text-[var(--sapContent_ForegroundTextColor,#131e29)] mb-2">
          {title}
        </h3>
        <p className="font-['72:Regular',sans-serif] text-sm text-[var(--sapContent_LabelColor,#556b82)] max-w-md">
          {description}
        </p>
      </div>
      
      {onAction && actionLabel && (
        <FioriButton variant="emphasized" icon="add" onClick={onAction}>
          {actionLabel}
        </FioriButton>
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
