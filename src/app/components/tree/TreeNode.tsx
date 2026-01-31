import { Button, CheckBox } from '@ui5/webcomponents-react';

import type { TreeNode as ScopeTreeNode } from '../../stores/cashflowScopeTree.store';

export function TreeNode({
  node,
  level,
  onToggleExpanded,
  onToggleChecked,
}: {
  node: ScopeTreeNode;
  level: number;
  onToggleExpanded: (id: string) => void;
  onToggleChecked: (id: string, checked: boolean) => void;
}) {
  const hasChildren = !!node.children && node.children.length > 0;
  const expanded = !!node.expanded;
  const checked = !!node.checked;
  const indeterminate = !!node.indeterminate;

  return (
    <div>
      <div className="flex items-center gap-2 py-1.5" style={{ paddingLeft: `${level * 14}px` }}>
        {hasChildren ? (
          <Button
            design="Transparent"
            onClick={() => onToggleExpanded(node.id)}
            style={{ minWidth: '2rem' }}
          >
            {expanded ? '▾' : '▸'}
          </Button>
        ) : (
          <span className="w-5" />
        )}

        <CheckBox
          checked={checked}
          indeterminate={indeterminate}
          accessibleName={node.label}
          onChange={(e) => {
            onToggleChecked(node.id, e.target.checked);
          }}
        />

        <span className={level <= 1 ? "font-['72:Bold',sans-serif]" : ''}>{node.label}</span>
      </div>

      {hasChildren && expanded ? (
        <div>
          {node.children!.map((c) => (
            <TreeNode key={c.id} node={c} level={level + 1} onToggleExpanded={onToggleExpanded} onToggleChecked={onToggleChecked} />
          ))}
        </div>
      ) : null}
    </div>
  );
}
