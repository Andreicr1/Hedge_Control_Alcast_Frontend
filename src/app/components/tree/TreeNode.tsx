import * as Checkbox from '@radix-ui/react-checkbox';
import * as Collapsible from '@radix-ui/react-collapsible';
import { Check, ChevronDown, ChevronRight, Minus } from 'lucide-react';

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
          <button
            type="button"
            className="w-5 h-5 inline-flex items-center justify-center text-[var(--sapContent_IconColor)] hover:bg-black/5 rounded"
            onClick={() => onToggleExpanded(node.id)}
            title={expanded ? 'Recolher' : 'Expandir'}
          >
            {expanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>
        ) : (
          <span className="w-5" />
        )}

        <Checkbox.Root
          checked={indeterminate ? 'indeterminate' : checked}
          onCheckedChange={(v) => {
            const nextChecked = v === true;
            onToggleChecked(node.id, nextChecked);
          }}
          className="w-4 h-4 shrink-0 rounded border border-[var(--sapField_BorderColor)] bg-white flex items-center justify-center"
          aria-label={node.label}
        >
          <Checkbox.Indicator className="text-[var(--sapContent_IconColor)]">
            {indeterminate ? <Minus className="w-3 h-3" /> : checked ? <Check className="w-3 h-3" /> : null}
          </Checkbox.Indicator>
        </Checkbox.Root>

        <span className={level <= 1 ? "font-['72:Bold',sans-serif]" : ''}>{node.label}</span>
      </div>

      {hasChildren ? (
        <Collapsible.Root open={expanded}>
          <Collapsible.Content>
            <div>
              {node.children!.map((c) => (
                <TreeNode key={c.id} node={c} level={level + 1} onToggleExpanded={onToggleExpanded} onToggleChecked={onToggleChecked} />
              ))}
            </div>
          </Collapsible.Content>
        </Collapsible.Root>
      ) : null}
    </div>
  );
}
