import type { ReactNode } from 'react';

import { Card, FlexBox, FlexBoxDirection, Text, Title } from '@ui5/webcomponents-react';

export interface FioriCardProps {
  children: ReactNode;
  padding?: 'none' | 'small' | 'default';
  className?: string;
}

export function FioriCard({ children, padding = 'default', className }: FioriCardProps) {
  const pad = padding === 'none' ? '0' : padding === 'small' ? '0.5rem' : '1rem';

  return (
    <Card className={className} style={{ width: '100%' }}>
      <div style={{ padding: pad }}>{children}</div>
    </Card>
  );
}

export interface FioriCardHeaderProps {
  title: string;
  subtitle?: string;
}

export function FioriCardHeader({ title, subtitle }: FioriCardHeaderProps) {
  return (
    <FlexBox direction={FlexBoxDirection.Column} style={{ gap: '0.25rem', marginBottom: '0.75rem' }}>
      <Title level="H4">{title}</Title>
      {subtitle ? <Text style={{ opacity: 0.75 }}>{subtitle}</Text> : null}
    </FlexBox>
  );
}

export interface FioriCardMetricProps {
  value: string;
}

export function FioriCardMetric({ value }: FioriCardMetricProps) {
  return <Title level="H2">{value}</Title>;
}
