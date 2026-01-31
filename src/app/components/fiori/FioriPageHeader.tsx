import type { CSSProperties, ReactNode } from 'react';

import { FioriToolbarRow } from './FioriToolbarRow';

export interface FioriPageHeaderProps {
  title: ReactNode;
  status: ReactNode;
  actions: ReactNode;
  style?: CSSProperties;
}

export function FioriPageHeader({ title, status, actions, style }: FioriPageHeaderProps) {
  return <FioriToolbarRow style={style} leading={<>{title}{status}</>} trailing={actions} />;
}
