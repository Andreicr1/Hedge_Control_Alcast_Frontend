import { useMemo, useState } from 'react';

import type { EntityTreeNode } from '../../types';
import { useAnalyticScope } from './ScopeProvider';
import { isSameScope, scopeKey } from './scope';
import { useAnalyticsEntityTreeContext } from './EntityTreeProvider';

import { FioriToolbarRow } from '../components/fiori';

import {
  BusyIndicator,
  Button,
  FlexBox,
  FlexBoxDirection,
  IllustratedMessage,
  List,
  ListItemStandard,
  MessageStrip,
  Text,
  Title,
} from '@ui5/webcomponents-react';

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

  const rows = useMemo(() => {
    const root = tree.data?.root;
    if (!root) return [] as Array<{ node: EntityTreeNode; depth: number }>;

    // Deals are the primary entry point. Children are shown under each deal.
    const out: Array<{ node: EntityTreeNode; depth: number }> = [];

    for (const deal of root.children || []) {
      out.push({ node: deal, depth: 0 });
      for (const child of deal.children || []) {
        out.push({ node: child, depth: 1 });
      }
    }

    return out;
  }, [tree.data]);

  if (tree.isLoading && !tree.data) {
    return (
      <FlexBox direction={FlexBoxDirection.Column} style={{ padding: '1rem' }}>
        <BusyIndicator active delay={0} />
        <Text style={{ marginTop: '0.5rem', opacity: 0.75 }}>Carregando estrutura...</Text>
      </FlexBox>
    );
  }

  if (tree.isError) {
    return (
      <div style={{ padding: '1rem' }}>
        <MessageStrip design="Negative" style={{ marginBottom: '0.75rem' }}>
          Falha ao carregar estrutura.
        </MessageStrip>
        <Button design="Emphasized" onClick={tree.refetch}>
          Tentar novamente
        </Button>
      </div>
    );
  }

  if (!tree.data?.root || (tree.data.root.children || []).length === 0) {
    return (
      <div style={{ padding: '1rem' }}>
        <IllustratedMessage name="NoData" titleText="Sem operações" subtitleText="Não há deals para seleção no momento." />
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: '60vh' }}>
      <FioriToolbarRow
        leading={<Title level="H5">Escopo</Title>}
        trailing={
          <Button design="Transparent" onClick={tree.refetch}>
            Atualizar
          </Button>
        }
      />

      <div style={{ padding: '0.25rem 1rem 0.75rem 1rem' }}>
        <Text style={{ opacity: 0.75, fontSize: '0.8125rem' }}>Selecione para consolidar</Text>
      </div>

      <div style={{ flex: 1, overflow: 'auto' }}>
        <List separators="All">
          <ListItemStandard
            type="Active"
            onClick={() => setScope({ kind: 'all' })}
            selected={selectedKey === 'all'}
            description="Todos os deals"
          >
            Todos os deals
          </ListItemStandard>

          {rows.map(({ node, depth }) => {
            const key = node.id;
            const rowScope = deriveScopeFromNode(node);
            const isSelected = isSameScope(scope, rowScope);
            const indent = depth * 12;

            return (
              <div key={key} style={{ paddingLeft: `${indent}px` }}>
                <ListItemStandard
                  type="Active"
                  onClick={() => setScope(rowScope)}
                  selected={isSelected}
                  description={kindLabel(node.kind)}
                >
                  {node.label}
                </ListItemStandard>
              </div>
            );
          })}
        </List>
      </div>
    </div>
  );
}
