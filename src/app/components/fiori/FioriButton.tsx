import type { ReactNode } from 'react';

import { Button } from '@ui5/webcomponents-react';
import type ButtonDesign from '@ui5/webcomponents/dist/types/ButtonDesign.js';
import type ButtonType from '@ui5/webcomponents/dist/types/ButtonType.js';

export type FioriButtonVariant = 'emphasized' | 'default' | 'ghost' | 'transparent' | 'negative' | 'positive';

export interface FioriButtonProps {
  variant?: FioriButtonVariant;
  icon?: string;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  children?: ReactNode;
  onClick?: () => void;
}

function mapDesign(variant: FioriButtonVariant): ButtonDesign {
  switch (variant) {
    case 'emphasized':
      return 'Emphasized';
    case 'negative':
      return 'Negative';
    case 'positive':
      return 'Positive';
    case 'ghost':
    case 'transparent':
      return 'Transparent';
    case 'default':
    default:
      return 'Default';
  }
}

function mapType(type?: 'button' | 'submit' | 'reset'): ButtonType {
  switch (type) {
    case 'submit':
      return 'Submit';
    case 'reset':
      return 'Reset';
    case 'button':
    default:
      return 'Button';
  }
}

export function FioriButton({
  variant = 'default',
  icon,
  iconPosition = 'left',
  fullWidth = false,
  disabled,
  type,
  className,
  children,
  onClick,
}: FioriButtonProps) {
  return (
    <Button
      design={mapDesign(variant)}
      icon={icon}
      iconEnd={iconPosition === 'right'}
      disabled={disabled}
      type={mapType(type)}
      className={className}
      style={fullWidth ? { width: '100%' } : undefined}
      onClick={onClick}
    >
      {children}
    </Button>
  );
}
