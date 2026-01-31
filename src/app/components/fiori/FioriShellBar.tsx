import { Bar, Button, FlexBox, FlexBoxDirection, Text, Title } from '@ui5/webcomponents-react';

export interface FioriShellBarProps {
  userName: string;
  userRole?: string;
  onHome: () => void;
  onLogout: () => void;
}

export function FioriShellBar({ userName, userRole, onHome, onLogout }: FioriShellBarProps) {
  return (
    <Bar
      startContent={
        <FlexBox direction={FlexBoxDirection.Row} style={{ gap: '0.75rem', alignItems: 'center' }}>
          <Button design="Transparent" onClick={onHome}>
            Início
          </Button>
          <Title level="H4">Hedge Control</Title>
        </FlexBox>
      }
      endContent={
        <FlexBox direction={FlexBoxDirection.Row} style={{ gap: '0.75rem', alignItems: 'center' }}>
          <FlexBox direction={FlexBoxDirection.Column} style={{ alignItems: 'flex-end' }}>
            <Text style={{ fontSize: '0.875rem' }}>{userName}</Text>
            {userRole ? <Text style={{ fontSize: '0.75rem', opacity: 0.75 }}>{userRole}</Text> : null}
          </FlexBox>
          <Button design="Transparent" onClick={onLogout}>
            Sair
          </Button>
        </FlexBox>
      }
    />
  );
}
