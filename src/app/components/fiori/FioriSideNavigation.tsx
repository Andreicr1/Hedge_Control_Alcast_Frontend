import { List, ListItemStandard, Title } from '@ui5/webcomponents-react';

export interface FioriSideNavigationProps {
  currentPath: string;
  isAdmin: boolean;
  onNavigate: (path: string) => void;
}

type NavigationItem = { label: string; path: string };

const FINANCE_ITEMS_BASE: NavigationItem[] = [
  { label: 'Exposições', path: '/financeiro/exposicoes' },
  { label: 'RFQs', path: '/financeiro/rfqs' },
  { label: 'Contratos', path: '/financeiro/contratos' },
  { label: 'Cashflow', path: '/financeiro/cashflow' },
  { label: 'Relatórios', path: '/financeiro/relatorios' },
  { label: 'Contrapartes', path: '/financeiro/contrapartes' },
];

export function FioriSideNavigation({ currentPath, isAdmin, onNavigate }: FioriSideNavigationProps) {
  const financeItems: NavigationItem[] = isAdmin
    ? [...FINANCE_ITEMS_BASE, { label: 'Governança • Saúde', path: '/financeiro/governanca/saude' }]
    : FINANCE_ITEMS_BASE;

  const handleItemClick = (event: any) => {
    const path = event?.detail?.item?.dataset?.path;
    if (typeof path === 'string' && path.length > 0) {
      onNavigate(path);
    }
  };

  return (
    <div style={{ padding: 8 }}>
      <List onItemClick={handleItemClick}>
        <ListItemStandard type="Navigation" data-path="/" selected={currentPath === '/'}>
          Dashboard
        </ListItemStandard>
      </List>

      <div style={{ marginTop: 12, marginBottom: 6, paddingLeft: 8 }}>
        <Title level="H6">Financeiro</Title>
      </div>

      <List onItemClick={handleItemClick}>
        {financeItems.map((item) => (
          <ListItemStandard
            key={item.path}
            type="Navigation"
            data-path={item.path}
            selected={currentPath === item.path}
          >
            {item.label}
          </ListItemStandard>
        ))}
      </List>
    </div>
  );
}