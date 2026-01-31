import type { ReactNode } from 'react';

import { useNavigate } from 'react-router-dom';
import { Button, FlexBox, FlexBoxDirection, Text } from '@ui5/webcomponents-react';

export interface FioriQuickLinkProps {
  icon?: ReactNode;
  label: string;
  href: string;
}

export function FioriQuickLink({ icon, label, href }: FioriQuickLinkProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (href.startsWith('/')) {
      navigate(href);
      return;
    }
    window.open(href, '_blank', 'noopener,noreferrer');
  };

  return (
    <Button design="Transparent" onClick={handleClick} style={{ width: '100%', justifyContent: 'flex-start' }}>
      <FlexBox direction={FlexBoxDirection.Row} style={{ gap: '0.5rem', alignItems: 'center' }}>
        {icon}
        <Text>{label}</Text>
      </FlexBox>
    </Button>
  );
}
