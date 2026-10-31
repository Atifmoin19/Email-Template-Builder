import type { EmailNode } from '../types';
import type { Placement } from '../context/dragStateTypes';
import { findNodeById, findParentNode, removeNodeById, updateNodeInTree } from './astHelpers';
import { nanoid } from 'nanoid';

const ROOT_LEVEL_TYPES = ['section', 'header', 'footer'];
const CONTAINER_TYPES = ['section', 'column', 'header', 'footer'];

export const isRootLevelType = (type: string) => ROOT_LEVEL_TYPES.includes(type);
export const isContainerType = (type: string) => CONTAINER_TYPES.includes(type);

export interface DropParams {
  nodes: EmailNode[];
  activeNode: EmailNode;
  /** True when the node comes from the sidebar palette rather than the canvas. */
  isNew: boolean;
  overId: string;
  placement: Placement;
}

/**
 * Pure drop resolution: returns the new tree, or null when the drop is
 * invalid and the tree should stay as it is.
 *
 * Invariants:
 * - section / header / footer only ever live at the root.
 * - content (text, image, button, ...) always lives inside a container.
 * - a node can never be dropped into itself or its own subtree.
 */
export const applyDrop = ({ nodes, activeNode, isNew, overId, placement }: DropParams): EmailNode[] | null => {
  const isActiveRootLevel = isRootLevelType(activeNode.type);

  if (!isNew && activeNode.id !== overId && findNodeById([activeNode], overId)) {
    return null; // target is inside the dragged subtree
  }

  const withoutActive = isNew ? nodes : removeNodeById(nodes, activeNode.id);

  // 1. Drop on the canvas background: append
  if (overId === 'canvas-root') {
    if (isActiveRootLevel) return [...withoutActive, activeNode];
    if (withoutActive.length > 0) {
      const lastRoot = withoutActive[withoutActive.length - 1];
      return updateNodeInTree(withoutActive, lastRoot.id, (node) => ({
        ...node,
        children: [...(node.children || []), activeNode],
      }));
    }
    return [
      {
        id: `section-${nanoid(6)}`,
        type: 'section',
        props: { padding: '20px', backgroundColor: '#ffffff', gridColumns: 1 },
        children: [activeNode],
      },
    ];
  }

  const overNode = findNodeById(withoutActive, overId);
  if (!overNode) return null;
  const overParent = findParentNode(withoutActive, overId);

  // 2. Sibling placement
  if (placement === 'top' || placement === 'bottom' || placement === 'left' || placement === 'right') {
    const before = placement === 'top' || placement === 'left';

    if (overParent) {
      if (isActiveRootLevel) return null; // would nest a root-level block
      return updateNodeInTree(withoutActive, overParent.id, (node) => {
        const index = node.children?.findIndex((c) => c.id === overId) ?? -1;
        const children = [...(node.children || [])];
        children.splice(before ? index : index + 1, 0, activeNode);
        return { ...node, children };
      });
    }

    if (isActiveRootLevel) {
      const index = withoutActive.findIndex((n) => n.id === overId);
      const next = [...withoutActive];
      next.splice(before ? index : index + 1, 0, activeNode);
      return next;
    }

    // Content can't sit at the root: put it at the start/end of that section
    return updateNodeInTree(withoutActive, overId, (node) => ({
      ...node,
      children: before ? [activeNode, ...(node.children || [])] : [...(node.children || []), activeNode],
    }));
  }

  // 3. Inside a container
  if (!isContainerType(overNode.type) || isActiveRootLevel) return null;
  return updateNodeInTree(withoutActive, overId, (node) => ({
    ...node,
    children: [...(node.children || []), activeNode],
  }));
};
