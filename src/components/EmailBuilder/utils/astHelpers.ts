import type { EmailNode } from '../types';

/**
 * Recursively find a node by ID in the tree
 */
export const findNodeById = (nodes: EmailNode[], id: string): EmailNode | null => {
  for (const node of nodes) {
    if (node.id === id) return node;
    if (node.children) {
      const found = findNodeById(node.children, id);
      if (found) return found;
    }
  }
  return null;
};

/**
 * Recursively find the parent of a node by node ID
 */
export const findParentNode = (nodes: EmailNode[], id: string): EmailNode | null => {
  for (const node of nodes) {
    if (node.children?.some(child => child.id === id)) return node;
    if (node.children) {
      const found = findParentNode(node.children, id);
      if (found) return found;
    }
  }
  return null;
};

/**
 * Recursively remove a node from the tree
 */
export const removeNodeById = (nodes: EmailNode[], id: string): EmailNode[] => {
  return nodes
    .filter(node => node.id !== id)
    .map(node => ({
      ...node,
      children: node.children ? removeNodeById(node.children, id) : undefined
    }));
};

/**
 * Recursively update a node's properties
 */
export const updateNodeInTree = (nodes: EmailNode[], id: string, mapper: (node: EmailNode) => EmailNode): EmailNode[] => {
  return nodes.map(node => {
    if (node.id === id) return mapper(node);
    if (node.children) {
      return { ...node, children: updateNodeInTree(node.children, id, mapper) };
    }
    return node;
  });
};
