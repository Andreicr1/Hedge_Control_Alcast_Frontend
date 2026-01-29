import { create } from 'zustand';

export type TreeNodeType = 'entity' | 'deal' | 'flow' | 'instrument';

export interface TreeNode {
  id: string;
  type: TreeNodeType;
  label: string;
  selectable: boolean;

  children?: TreeNode[];

  // UI state
  checked?: boolean;
  indeterminate?: boolean;
  expanded?: boolean;

  // metadata
  dealId?: string;
  instrumentType?: 'PO' | 'SO' | 'Contract';
}

type ScopeTreeState = {
  roots: TreeNode[];
  setRoots: (roots: TreeNode[]) => void;

  toggleExpanded: (id: string) => void;
  setExpanded: (id: string, expanded: boolean) => void;

  toggleChecked: (id: string, checked: boolean) => void;
  hydrateChildren: (id: string, children: TreeNode[]) => void;

  resetTreeUiState: () => void;
};

function deepCloneNodes(nodes: TreeNode[]): TreeNode[] {
  return nodes.map((n) => ({ ...n, children: n.children ? deepCloneNodes(n.children) : undefined }));
}

function applyCheckedToSubtree(node: TreeNode, checked: boolean) {
  node.checked = checked;
  node.indeterminate = false;
  if (node.children) {
    for (const c of node.children) applyCheckedToSubtree(c, checked);
  }
}

function recomputeFromChildren(node: TreeNode): { hasAnySelected: boolean; hasAnyUnselected: boolean; hasAnyIndeterminate: boolean } {
  if (!node.children || node.children.length === 0) {
    return {
      hasAnySelected: !!node.checked,
      hasAnyUnselected: !node.checked,
      hasAnyIndeterminate: false,
    };
  }

  let hasAnySelected = false;
  let hasAnyUnselected = false;
  let hasAnyIndeterminate = false;

  for (const c of node.children) {
    const childState = recomputeFromChildren(c);
    if (c.indeterminate) hasAnyIndeterminate = true;
    if (childState.hasAnySelected) hasAnySelected = true;
    if (childState.hasAnyUnselected) hasAnyUnselected = true;
  }

  if (!hasAnyIndeterminate && hasAnySelected && !hasAnyUnselected) {
    node.checked = true;
    node.indeterminate = false;
  } else if (!hasAnyIndeterminate && !hasAnySelected && hasAnyUnselected) {
    node.checked = false;
    node.indeterminate = false;
  } else {
    node.checked = false;
    node.indeterminate = true;
  }

  return { hasAnySelected, hasAnyUnselected, hasAnyIndeterminate };
}

function updateNode(nodes: TreeNode[], id: string, updater: (node: TreeNode) => void): boolean {
  for (const n of nodes) {
    if (n.id === id) {
      updater(n);
      return true;
    }
    if (n.children && updateNode(n.children, id, updater)) return true;
  }
  return false;
}

function recomputeAll(nodes: TreeNode[]) {
  for (const n of nodes) recomputeFromChildren(n);
}

export const useCashflowScopeTreeStore = create<ScopeTreeState>((set, get) => ({
  roots: [],

  setRoots: (roots) => {
    const cloned = deepCloneNodes(roots);
    recomputeAll(cloned);
    set({ roots: cloned });
  },

  toggleExpanded: (id) => {
    const next = deepCloneNodes(get().roots);
    updateNode(next, id, (n) => {
      n.expanded = !n.expanded;
    });
    set({ roots: next });
  },

  setExpanded: (id, expanded) => {
    const next = deepCloneNodes(get().roots);
    updateNode(next, id, (n) => {
      n.expanded = expanded;
    });
    set({ roots: next });
  },

  toggleChecked: (id, checked) => {
    const next = deepCloneNodes(get().roots);
    updateNode(next, id, (n) => {
      if (!n.selectable) return;
      applyCheckedToSubtree(n, checked);
    });
    recomputeAll(next);
    set({ roots: next });
  },

  hydrateChildren: (id, children) => {
    const next = deepCloneNodes(get().roots);
    updateNode(next, id, (n) => {
      n.children = children;
      // Ensure the subtree inherits a parent checked state.
      if (n.checked) {
        for (const c of children) applyCheckedToSubtree(c, true);
      }
    });
    recomputeAll(next);
    set({ roots: next });
  },

  resetTreeUiState: () => {
    const next = deepCloneNodes(get().roots);
    const walk = (nodes: TreeNode[]) => {
      for (const n of nodes) {
        n.expanded = false;
        n.checked = false;
        n.indeterminate = false;
        if (n.children) walk(n.children);
      }
    };
    walk(next);
    set({ roots: next });
  },
}));

export function findNodeById(nodes: TreeNode[], id: string): TreeNode | null {
  for (const n of nodes) {
    if (n.id === id) return n;
    if (n.children) {
      const hit = findNodeById(n.children, id);
      if (hit) return hit;
    }
  }
  return null;
}

export function walkNodes(nodes: TreeNode[], fn: (node: TreeNode) => void) {
  for (const n of nodes) {
    fn(n);
    if (n.children) walkNodes(n.children, fn);
  }
}
