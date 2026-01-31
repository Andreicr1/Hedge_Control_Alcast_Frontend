import type { CSSProperties, ReactNode } from 'react';

import { Card, Title } from '@ui5/webcomponents-react';

export interface FioriHeaderCardProps {
  title: string;
  children: ReactNode;
  padding?: string;
  style?: CSSProperties;
  bodyStyle?: CSSProperties;
}

export function FioriHeaderCard({ title, children, padding = '0.75rem', style, bodyStyle }: FioriHeaderCardProps) {
  return (
    <Card header={<Title level="H5">{title}</Title>} style={style}>
      <div style={{ padding, ...(bodyStyle || {}) }}>{children}</div>
    </Card>
  );
}
