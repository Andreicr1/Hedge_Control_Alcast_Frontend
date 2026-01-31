// UI5 navigation uses web components directly here.

export interface FioriSideNavigationProps {
  currentPath: string;
  isAdmin: boolean;
  collapsed?: boolean;
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

function iconForPath(path: string): string {
  if (path === '/') return 'home';
  if (path.includes('pendencias')) return 'pending';
  if (path.includes('aprovacoes')) return 'approvals';
  if (path.includes('exposicoes')) return 'risk';
  if (path.includes('rfqs')) return 'request';
  if (path.includes('cotacoes')) return 'lead';
  if (path.includes('contratos')) return 'document';
  if (path.includes('cashflow')) return 'future';
  if (path.includes('relatorios')) return 'bar-chart';
  if (path.includes('contrapartes')) return 'group';
  if (path.includes('governanca')) return 'shield';
  return 'navigation-right-arrow';
}

export function FioriSideNavigation({ currentPath, isAdmin, collapsed = false, onNavigate }: FioriSideNavigationProps) {
  const financeItems: NavigationItem[] = isAdmin
    ? [...FINANCE_ITEMS_BASE, { label: 'Governança • Saúde', path: '/financeiro/governanca/saude' }]
    : FINANCE_ITEMS_BASE;

  return (
    <div
      style={{
        width: collapsed ? 56 : 256,
        transition: 'width 120ms ease',
        background: 'var(--sapList_Background)',
        borderRight: '1px solid var(--sapGroup_ContentBorderColor)',
        padding: 8,
        overflow: 'hidden',
      }}
    >
      <ui5-side-navigation collapsed={collapsed}>
        <ui5-side-navigation-item
          text="Visão Geral"
          icon="home"
          data-path="/"
          selected={currentPath === '/'}
          onClick={() => onNavigate('/')}
        />

        <ui5-side-navigation-group text="Financeiro" expanded icon="accounting-document-verification">
          {financeItems.map((item) => (
            <ui5-side-navigation-item
              key={item.path}
              text={item.label}
              icon={iconForPath(item.path)}
              data-path={item.path}
              selected={currentPath === item.path}
              onClick={() => onNavigate(item.path)}
            />
          ))}
        </ui5-side-navigation-group>
      </ui5-side-navigation>
    </div>
  );
}