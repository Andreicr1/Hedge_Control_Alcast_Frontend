import type { CSSProperties, ReactNode } from 'react';

import { Toolbar, ToolbarSpacer } from '@ui5/webcomponents-react';

export interface FioriToolbarRowProps {
  leading: ReactNode;
  trailing?: ReactNode;
  style?: CSSProperties;
}

export function FioriToolbarRow({ leading, trailing, style }: FioriToolbarRowProps) {
  return (
    <Toolbar style={style}>
      {leading}
      <ToolbarSpacer />
      {trailing}
    </Toolbar>
  );
}
