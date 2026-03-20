/**
 * Converts a style object to an inline CSS string
 */
export const objectToInlineCss = (style: Record<string, any>): string => {
  return Object.entries(style)
    .filter(([_, value]) => value !== undefined && value !== null)
    .map(([key, value]) => {
      // Convert camelCase to kebab-case
      const kebabKey = key.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
      // Ensure values like 20px are not double escaped or incorrectly formatted
      return `${kebabKey}:${value}`;
    })
    .join(';');
};

/**
 * Common email styles to ensure consistency across clients
 */
export const commonStyles = {
  table: {
    borderCollapse: 'collapse',
    msoTableLspace: '0pt',
    msoTableRspace: '0pt',
    width: '100%',
  },
  body: {
    margin: '0',
    padding: '0',
    width: '100% !important',
    backgroundColor: '#f4f4f4',
  },
};
