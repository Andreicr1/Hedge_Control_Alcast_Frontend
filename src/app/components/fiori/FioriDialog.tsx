import type { ReactNode } from 'react';

import { Dialog } from '@ui5/webcomponents-react';

export interface FioriDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  footer?: ReactNode;
  children: ReactNode;
}

export function FioriDialog({ open, onOpenChange, title, footer, children }: FioriDialogProps) {
  return (
    <Dialog
      open={open}
      headerText={title}
      onClose={() => onOpenChange(false)}
      footer={footer}
      style={{ maxWidth: '900px' }}
    >
      <div style={{ padding: '1rem' }}>{children}</div>
    </Dialog>
  );
}
