import type { EmailNode } from '../types';

export interface CompatibilityWarning {
  id: string;
  type: 'warning' | 'error';
  message: string;
}

/**
 * Static checks for common deliverability / client-rendering pitfalls.
 * These are heuristics, not a rendering test in real clients.
 */
export const validateCompatibility = (nodes: EmailNode[]): CompatibilityWarning[] => {
  const warnings: CompatibilityWarning[] = [];
  const warn = (id: string, message: string) => warnings.push({ id, type: 'warning', message });

  const traverse = (node: EmailNode) => {
    if (node.type === 'image') {
      if (!node.props.src) {
        warn(node.id, 'Image has no source URL and will render as a broken image.');
      }
      if (!node.props.alt) {
        warn(node.id, 'Image is missing alt text. Many clients block images by default, and spam filters penalise it.');
      }
      if (node.props.width && /px$|^\d+$/.test(node.props.width) && parseInt(node.props.width, 10) > 600) {
        warn(node.id, 'Image width exceeds 600px. This may cause horizontal scrolling in some clients.');
      }
    }

    if (node.type === 'button' && (!node.props.href || node.props.href === '#')) {
      warn(node.id, 'Button has no link URL.');
    }

    node.children?.forEach(traverse);
  };

  nodes.forEach(traverse);
  return warnings;
};
