export const UX_COPY = {
  errors: {
    title: 'Não foi possível concluir a operação',
    message:
      'O sistema não conseguiu processar esta solicitação agora.\nTente novamente ou entre em contato com o administrador.',
    retry: 'Tentar novamente',
  },

  common: {
    comingSoon: 'Esta funcionalidade será disponibilizada em breve.',
  },

  nav: {
    dashboard: 'Visão Geral',
    sales: 'Vendas',
    salesOrders: 'Pedidos de Venda',
    customers: 'Clientes',
    purchases: 'Compras',
    purchaseOrders: 'Pedidos de Compra',
    suppliers: 'Fornecedores',
    finance: 'Financeiro',
    pending: 'Pendências',
    approvals: 'Aprovações',
    riskExposure: 'Exposição de Risco',
    rfqs: 'Cotações',
    contracts: 'Contratos',
    cashflow: 'Fluxo de Caixa',
    reports: 'Relatórios',
    counterparties: 'Contrapartes',
    deals: 'Operações',
    settings: 'Administração',
    governanceHealth: 'Saúde de Governança',
  },

  pages: {
    reports: {
      title: 'Relatórios',
      subtitle: '',
      sections: {
        configuration: 'Configuração do relatório',
        tracking: 'Acompanhar relatório',
      },
      buttons: {
        generate: 'Gerar relatório',
        viewScope: 'Visualizar escopo',
        viewStatus: 'Ver status',
        download: 'Baixar relatório',
      },
    },

    pending: {
      title: 'Pendências',
      subtitle: '',
      empty: 'Não há pendências no momento.',
    },

    approvals: {
      title: 'Aprovações',
      subtitle: '',
      empty: 'Não há solicitações pendentes de aprovação.',
    },

    riskExposure: {
      title: 'Exposição de Risco',
      subtitle: '',
      emptyTitle: 'Nenhuma exposição ativa no momento.',
      emptyDescription: 'Não há exposições para os filtros selecionados.',
    },

    rfqs: {
      title: 'Cotações',
      subtitle: '',
    },

    contracts: {
      title: 'Contratos',
      subtitle: '',
    },

    cashflow: {
      title: 'Fluxo de Caixa',
      subtitle: '',
      empty: 'Nenhuma linha encontrada no período.',
      comingSoon: 'Indisponível no momento.',
    },

    settings: {
      title: 'Administração',
      subtitle: '',
      empty: 'Nenhuma configuração disponível para este perfil.',
    },
  },
} as const;

export type UxRole = 'admin' | 'financeiro' | 'auditoria' | 'compras' | 'vendas' | string;

export function formatRoleLabel(role: UxRole | null | undefined): string {
  const key = String(role || '').toLowerCase();
  if (key === 'admin') return 'Administrador';
  if (key === 'financeiro') return 'Financeiro';
  if (key === 'auditoria') return 'Auditoria';
  if (key === 'compras') return 'Compras';
  if (key === 'vendas') return 'Vendas';
  return role ? String(role) : '—';
}

export function formatRequiredProfiles(allowedRoles: string[]): string {
  const unique = Array.from(new Set((allowedRoles || []).map((r) => String(r).toLowerCase())));
  const labels = unique.map((r) => formatRoleLabel(r));
  return labels.join(' ou ');
}
