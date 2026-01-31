import type { ReactNode } from 'react';

import { useNavigate } from 'react-router-dom';
import { Avatar, Button, FlexBox, FlexBoxDirection, Text } from '@ui5/webcomponents-react';

export interface FioriTeamCardProps {
  actor: string;
  initials: string;
  timestamp: string;
  description: string;
  object?: string;
  href?: string;
  backgroundColor?: string;
}

export function FioriTeamCard({ actor, initials, timestamp, description, object, href, backgroundColor }: FioriTeamCardProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (!href) return;
    if (href.startsWith('/')) {
      navigate(href);
      return;
    }
    window.open(href, '_blank', 'noopener,noreferrer');
  };

  return (
    <Button
      design="Transparent"
      onClick={href ? handleClick : undefined}
      style={{ width: '100%', justifyContent: 'flex-start' }}
    >
      <FlexBox direction={FlexBoxDirection.Row} style={{ gap: '0.75rem', alignItems: 'center', width: '100%' }}>
        <Avatar initials={initials} style={backgroundColor ? { backgroundColor } : undefined} />
        <FlexBox direction={FlexBoxDirection.Column} style={{ gap: '0.125rem', alignItems: 'flex-start', width: '100%' }}>
          <FlexBox direction={FlexBoxDirection.Row} style={{ gap: '0.5rem', alignItems: 'baseline', width: '100%' }}>
            <Text style={{ fontSize: '0.875rem' }}>{actor}</Text>
            <Text style={{ fontSize: '0.75rem', opacity: 0.75 }}>{timestamp}</Text>
          </FlexBox>
          <Text style={{ fontSize: '0.8125rem', opacity: 0.85 }}>{description}</Text>
          {object ? <Text style={{ fontSize: '0.75rem', opacity: 0.75 }}>{object}</Text> : null}
        </FlexBox>
      </FlexBox>
    </Button>
  );
}
