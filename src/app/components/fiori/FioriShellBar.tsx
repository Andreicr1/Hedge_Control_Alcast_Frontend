import { Avatar, FlexBox, FlexBoxDirection, Text } from '@ui5/webcomponents-react';

export interface FioriShellBarProps {
  userName: string;
  userRole?: string;
  onToggleNavigation?: () => void;
  onOpenAgent?: () => void;
  onHome: () => void;
  onLogout: () => void;
}

function initialsFromName(name: string): string {
  const parts = name.trim().split(/\s+/g).filter(Boolean);
  const a = parts[0]?.[0] ?? '';
  const b = parts.length > 1 ? parts[parts.length - 1]?.[0] ?? '' : '';
  return (a + b).toUpperCase() || 'U';
}

export function FioriShellBar({ userName, userRole, onToggleNavigation, onOpenAgent, onHome, onLogout }: FioriShellBarProps) {
  return (
    <ui5-shellbar primary-title="Hedge Management">
      <ui5-button
        slot="startButton"
        icon="menu2"
        design="Transparent"
        onClick={onToggleNavigation}
        tooltip="Menu"
        aria-label="Menu"
      ></ui5-button>

      <div
        slot="logo"
        onClick={onHome}
        style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}
        aria-label="Ir para Visão Geral"
        title="Visão Geral"
      >
        <img
          src="/assets/alcast-logo.png"
          alt="ALCAST"
          style={{ height: 24, width: 'auto', display: 'block' }}
        />
        <span style={{ fontWeight: 700, letterSpacing: 0.2, color: 'var(--sapTextColor)' }}>ALCAST</span>
      </div>

      <ui5-shellbar-search slot="searchField" placeholder="Search"></ui5-shellbar-search>

      <ui5-shellbar-item
        icon="sys-help-2"
        text="Ajuda"
        onClick={onOpenAgent}
        title="Ajuda (Agente)"
      ></ui5-shellbar-item>

      <ui5-shellbar-item icon="log" text="Sair" onClick={onLogout} title="Sair"></ui5-shellbar-item>

      <div slot="profile">
        <FlexBox direction={FlexBoxDirection.Row} style={{ alignItems: 'center', gap: '0.5rem' }}>
          <FlexBox direction={FlexBoxDirection.Column} style={{ alignItems: 'flex-end' }}>
            <Text style={{ fontSize: '0.8125rem' }}>{userName}</Text>
            {userRole ? <Text style={{ fontSize: '0.75rem', opacity: 0.7 }}>{userRole}</Text> : null}
          </FlexBox>
          <Avatar initials={initialsFromName(userName)} />
        </FlexBox>
      </div>
    </ui5-shellbar>
  );
}
