import type { ReactNode } from 'react';

import { ObjectStatus } from '@ui5/webcomponents-react';
import ValueState from '@ui5/webcomponents-base/dist/types/ValueState.js';

export interface FioriObjectStatusProps {
  status: 'success' | 'information' | 'warning' | 'error' | 'none';
  children: ReactNode;
}

function mapValueState(status: FioriObjectStatusProps['status']): ValueState {
  switch (status) {
    case 'success':
      return ValueState.Positive;
    case 'information':
      return ValueState.Information;
    case 'warning':
      return ValueState.Critical;
    case 'error':
      return ValueState.Negative;
    case 'none':
    default:
      return ValueState.None;
  }
}

export function FioriObjectStatus({ status, children }: FioriObjectStatusProps) {
  return <ObjectStatus state={mapValueState(status)}>{children}</ObjectStatus>;
}
