import type { ReactNode } from 'react';

import { Button, MessageStrip } from '@ui5/webcomponents-react';

export interface FioriErrorRetryBlockProps {
  message: ReactNode;
  onRetry: () => void;
  retryLabel?: string;
}

export function FioriErrorRetryBlock({ message, onRetry, retryLabel = 'Tentar novamente' }: FioriErrorRetryBlockProps) {
  return (
    <>
      <MessageStrip design="Negative" style={{ marginBottom: '0.75rem' }}>
        {message}
      </MessageStrip>
      <Button design="Emphasized" onClick={onRetry}>
        {retryLabel}
      </Button>
    </>
  );
}
