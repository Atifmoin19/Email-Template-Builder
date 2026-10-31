import { describe, expect, it } from 'vitest';
import { instantiatePreset, templates } from '.';
import { generateEmailHtml } from '../utils/emailRenderer';
import type { EmailNode } from '../types';

const ids = (nodes: EmailNode[]): string[] => nodes.flatMap((n) => [n.id, ...ids(n.children ?? [])]);

describe('template presets', () => {
  it.each(Object.entries(templates))('%s exports a complete HTML document', (_id, preset) => {
    expect(preset.name).not.toBe('');
    expect(preset.description).not.toBe('');
    const html = generateEmailHtml(instantiatePreset(preset.project));
    expect(html.startsWith('<!DOCTYPE html')).toBe(true);
    expect(html.trimEnd().endsWith('</html>')).toBe(true);
    expect(html).not.toContain('undefined');
  });

  it('gives every instantiated copy fresh, unique ids', () => {
    const a = ids(instantiatePreset(templates.OrderReceipt.project).nodes);
    const b = ids(instantiatePreset(templates.OrderReceipt.project).nodes);
    expect(new Set(a).size).toBe(a.length);
    expect(a.some((id) => b.includes(id))).toBe(false);
  });
});
