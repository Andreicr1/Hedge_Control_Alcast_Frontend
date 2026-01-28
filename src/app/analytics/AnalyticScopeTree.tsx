import { useMemo, useState } from 'react';
import { ChevronDown, ChevronRight, FolderTree, RefreshCw } from 'lucide-react';

import type { EntityTreeNode } from '../../types';
import { ErrorState, LoadingState, EmptyState } from '../components/ui';
import { FioriButton } from '../components/fiori/FioriButton';
import { useAnalyticScope } from './ScopeProvider';
import { isSameScope, scopeKey } from './scope';
import { useAnalyticsEntityTreeContext } from './EntityTreeProvider';

function kindLabel(kind: EntityTreeNode['kind']): string {
  if (kind === 'root') return 'Todos os deals';
  if (kind === 'deal') return 'Deal';
  if (kind === 'so') return 'SO';
  if (kind === 'po') return 'PO';
  if (kind === 'contract') return 'Contrato';
  return 'Item';
}

function isDealNode(node: EntityTreeNode): boolean {
  return node.kind === 'deal';
}

function deriveScopeFromNode(node: EntityTreeNode) {
  if (node.kind === 'root') return { kind: 'all' as const };

  const dealId = Number(node.deal_id ?? node.entity_id ?? '');
  if (!Number.isFinite(dealId) || !Number.isInteger(dealId)) {
    return { kind: 'all' as const };
  }

  if (node.kind === 'deal') return { kind: 'deal' as const, dealId };

  if (node.kind === 'so') {
    const soId = Number(node.entity_id ?? '');
    if (!Number.isFinite(soId) || !Number.isInteger(soId)) return { kind: 'deal' as const, dealId };
    return { kind: 'so' as const, dealId, soId };
  }

  if (node.kind === 'po') {
    const poId = Number(node.entity_id ?? '');
    if (!Number.isFinite(poId) || !Number.isInteger(poId)) return { kind: 'deal' as const, dealId };
    return { kind: 'po' as const, dealId, poId };
  }

  // contract
  return {
    kind: 'contract' as const,
    dealId,
    contractId: String(node.entity_id ?? ''),
  };
}

export function AnalyticScopeTree() {
  const { scope, setScope } = useAnalyticScope();
  const selectedKey = scopeKey(scope);

  const tree = useAnalyticsEntityTreeContext();

  const [openDeals, setOpenDeals] = useState<Record<string, boolean>>({});

  const rows = useMemo(() => {
    const root = tree.data?.root;
    if (!root) return [] as Array<{ node: EntityTreeNode; depth: number }>;

    // Deals are the primary entry point. Children are shown under each deal.
    const out: Array<{ node: EntityTreeNode; depth: number }> = [];

    for (const deal of root.children || []) {
      out.push({ node: deal, depth: 0 });
      const isOpen = openDeals[deal.id] ?? true;
      if (!isOpen) continue;
      for (const child of deal.children || []) {
        out.push({ node: child, depth: 1 });
      }
    }

    return out;
  }, [openDeals, tree.data]);

  if (tree.isLoading && !tree.data) {
    return (
      <div className="p-4">
        <LoadingState message="Carregando estrutura..." />
      </div>
    );
  }

  if (tree.isError) {
    return (
      <div className="p-4">
        <ErrorState error={tree.error} onRetry={tree.refetch} />
      </div>
    );
  }

  if (!tree.data?.root || (tree.data.root.children || []).length === 0) {
    return (
      <div className="p-4">
        <EmptyState title="Sem operações" description="Não há deals para seleção no momento." />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full min-h-[60vh]">
      <div className="p-4 border-b border-[var(--sapList_BorderColor)] bg-[var(--sapList_HeaderBackground)]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FolderTree className="w-4 h-4 text-[var(--sapContent_IconColor)]" />
            <div>
              <div className="font-['72:Bold',sans-serif] text-sm text-[var(--sapList_HeaderTextColor)]">Escopo</div>
              <div className="text-xs text-[var(--sapContent_LabelColor)]">Selecione para consolidar</div>
            </div>
          </div>
          <FioriButton variant="ghost" icon={<RefreshCw className="w-4 h-4" />} onClick={tree.refetch}>
            Atualizar
          </FioriButton>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <div
          key="all"
          className={`flex items-center gap-2 px-3 py-2 border-b border-[var(--sapList_BorderColor)] hover:bg-[var(--sapList_HoverBackground)] cursor-pointer ${
            selectedKey === 'all' ? 'bg-[var(--sapList_SelectionBackgroundColor)]' : ''
          }`}
          style={{ paddingLeft: 12 }}
          role="button"
          tabIndex={0}
          onClick={() => setScope({ kind: 'all' })}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              setScope({ kind: 'all' });
            }
          }}
          aria-label="Todos os deals"
        >
          <span className="w-5" />
          <div className="min-w-0">
            <div className="text-sm text-[var(--sapTextColor,#131e29)] truncate">Todos os deals</div>
          </div>
        </div>

        {rows.map(({ node, depth }) => {
          const key = node.id;
          const rowScope = deriveScopeFromNode(node);
          const isSelected = isSameScope(scope, rowScope);
          const isDeal = isDealNode(node);
          const isOpen = isDeal ? (openDeals[node.id] ?? true) : true;
          const indent = depth * 12;

          return (
            <div
              key={key}
              className={`flex items-center gap-2 px-3 py-2 border-b border-[var(--sapList_BorderColor)] hover:bg-[var(--sapList_HoverBackground)] cursor-pointer ${
                isSelected ? 'bg-[var(--sapList_SelectionBackgroundColor)]' : ''
              }`}
              style={{ paddingLeft: 12 + indent }}
              role="button"
              tabIndex={0}
              onClick={() => {
                if (isDeal) {
                  setOpenDeals((prev) => ({ ...prev, [node.id]: !(prev[node.id] ?? true) }));
                  setScope(rowScope);
                  return;
                }
                setScope(rowScope);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  if (isDeal) {
                    setOpenDeals((prev) => ({ ...prev, [node.id]: !(prev[node.id] ?? true) }));
                    setScope(rowScope);
                    return;
                  }
                  setScope(rowScope);
                }
              }}
              aria-label={`${kindLabel(node.kind)} ${node.label}`}
            >
              {isDeal ? (
                <button
                  type="button"
                  className="w-5 h-5 flex items-center justify-center text-[var(--sapContent_IconColor)]"
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpenDeals((prev) => ({ ...prev, [node.id]: !(prev[node.id] ?? true) }));
                  }}
                  aria-label={isOpen ? 'Recolher' : 'Expandir'}
                >
                  {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </button>
              ) : (
                <span className="w-5" />
              )}

              <div className="min-w-0">
                <div className="text-sm text-[var(--sapTextColor,#131e29)] truncate">{node.label}</div>
                <div className="text-[11px] text-[var(--sapContent_LabelColor)]">{kindLabel(node.kind)}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
