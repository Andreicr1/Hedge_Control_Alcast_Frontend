/**
 * FioriDialog - Alias para FioriModal
 * 
 * Compatibilidade com as páginas integradas que usam FioriDialog.
 * Internamente usa o FioriModal existente.
 */

import { ReactNode } from 'react';
import { FioriModal } from './FioriModal';

interface FioriDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
  size?: 'small' | 'medium' | 'large';
}

export function FioriDialog({
  open,
  onOpenChange,
  title,
  children,
  footer,
  size = 'medium',
}: FioriDialogProps) {
  return (
    <FioriModal
      open={open}
      onClose={() => onOpenChange(false)}
      title={title}
      footer={footer}
      size={size}
    >
      {children}
    </FioriModal>
  );
}

export default FioriDialog;
