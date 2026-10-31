/**
 * Converts a style object to an inline CSS string.
 * Undefined, null and empty-string values are dropped.
 */
export const objectToInlineCss = (style: Record<string, string | number | undefined | null>): string => {
  return Object.entries(style)
    .filter(([, value]) => value !== undefined && value !== null && value !== '')
    .map(([key, value]) => {
      // Convert camelCase to kebab-case
      const kebabKey = key.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
      return `${kebabKey}:${value}`;
    })
    .join(';');
};
