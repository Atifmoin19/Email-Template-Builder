import type { EmailNode } from '../types';

export interface CompatibilityWarning {
  id: string;
  type: 'warning' | 'error';
  message: string;
}

export const validateCompatibility = (nodes: EmailNode[]): CompatibilityWarning[] => {
  const warnings: CompatibilityWarning[] = [];

  const traverse = (node: EmailNode) => {
    // Check for images without alt text
    if (node.type === 'image' && !node.props.alt) {
      warnings.push({
        id: node.id,
        type: 'warning',
        message: 'Image is missing alt text. This is bad for accessibility and spam filters.'
      });
    }

    // Check for large images
    if (node.type === 'image' && node.props.width && parseInt(node.props.width) > 600) {
      warnings.push({
        id: node.id,
        type: 'warning',
        message: 'Image width exceeds 600px. This may cause horizontal scrolling in some clients.'
      });
    }

    // Check for background images (Outlook pitfall)
    if (node.props.backgroundColor && node.props.backgroundColor.length > 7) {
       // Just a placeholder for complex checks if needed
    }

    if (node.children) {
      node.children.forEach(traverse);
    }
  };

  nodes.forEach(traverse);
  return warnings;
};
