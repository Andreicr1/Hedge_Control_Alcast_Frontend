/**
 * Error State Component
 * 
 * Componente padronizado para estados de erro.
 */

import { AlertCircle, RefreshCw } from 'lucide-react';
import { FioriButton } from '../fiori/FioriButton';
import { ApiError } from '../../../types';
import { UX_COPY } from '../../ux/copy';

interface ErrorStateProps {
  error: ApiError | null;
  onRetry?: () => void;
  title?: string;
  fullPage?: boolean;
}

export function ErrorState({
  error,
  onRetry,
  title = UX_COPY.errors.title,
  fullPage = false,
}: ErrorStateProps) {
  void error;

  const messageLines = UX_COPY.errors.message.split('\n');

  const content = (
    <div className="flex flex-col items-center justify-center gap-4 p-6 text-center">
      <div className="w-12 h-12 rounded-full bg-[var(--sapErrorBackground,#ffebeb)] flex items-center justify-center">
        <AlertCircle className="w-6 h-6 text-[var(--sapNegativeColor,#b00)]" />
      </div>
      
      <div>
        <h3 className="font-['72:Bold',sans-serif] text-base text-[var(--sapNegativeTextColor,#b00)] mb-2">
          {title}
        </h3>
        <p className="font-['72:Regular',sans-serif] text-sm text-[var(--sapContent_LabelColor,#556b82)] max-w-md">
          {messageLines.map((line, idx) => (
            <span key={idx}>
              {line}
              {idx < messageLines.length - 1 ? <br /> : null}
            </span>
          ))}
        </p>
      </div>
      
      {onRetry && (
        <FioriButton variant="default" onClick={onRetry}>
          <RefreshCw className="w-4 h-4 mr-2" />
          {UX_COPY.errors.retry}
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

