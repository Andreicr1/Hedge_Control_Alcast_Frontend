import type { ReactNode } from 'react';

import { Label } from '@ui5/webcomponents-react';

export interface FioriBadgeProps {
  children: ReactNode;
  variant?: 'new' | 'default';
  size?: 'small' | 'default';
}

export function FioriBadge({ children, variant = 'default', size = 'default' }: FioriBadgeProps) {
  const bg = variant === 'new' ? 'var(--sapAccentColor6, #eaf6ff)' : 'var(--sapNeutralBackground, #f5f6f7)';
  const fg = 'var(--sapContent_LabelColor, #556b82)';
  const pad = size === 'small' ? '0.125rem 0.375rem' : '0.25rem 0.5rem';

  return (
    <Label style={{ background: bg, color: fg, padding: pad, borderRadius: 999, fontSize: size === 'small' ? '0.6875rem' : '0.75rem' }}>
      {children}
    </Label>
  );
}
