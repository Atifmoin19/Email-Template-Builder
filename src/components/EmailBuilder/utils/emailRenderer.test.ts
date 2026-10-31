import { describe, expect, it } from 'vitest';
import { generateEmailHtml, escapeHtml } from './emailRenderer';
import type { EmailNode, EmailProject } from '../types';
import { defaultSettings, templates } from '../presets';

const project = (nodes: EmailNode[], settings = defaultSettings): EmailProject => ({
  nodes,
  settings,
});

const section = (children: EmailNode[], props: Record<string, unknown> = {}): EmailNode => ({
  id: 'section-1',
  type: 'section',
  props,
  children,
});

const text = (props: Record<string, unknown>): EmailNode => ({
  id: `text-${Math.random()}`,
  type: 'text',
  props,
});

/** Grab the style attribute of the first element whose text content matches. */
const styleOf = (html: string, content: string): string => {
  const match = html.match(new RegExp(`<div style="([^"]*)">${content}</div>`));
  if (!match) throw new Error(`no element with content "${content}"`);
  return match[1];
};

describe('generateEmailHtml: document shell', () => {
  it('emits an XHTML doctype, MSO conditional block and a media query at maxWidth', () => {
    const html = generateEmailHtml(project([], { ...defaultSettings, maxWidth: '640px' }));

    expect(html.startsWith('<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"')).toBe(true);
    expect(html).toContain('<!--[if mso]>');
    expect(html).toContain('<![endif]-->');
    expect(html).toContain('@media only screen and (max-width: 640px)');
    expect(html).toContain('max-width: 640px');
  });

  it('applies page and content background colours from settings', () => {
    const html = generateEmailHtml(
      project([], { ...defaultSettings, pageBackgroundColor: '#123456', contentBackgroundColor: '#abcdef' }),
    );
    expect(html).toContain('background-color: #123456');
    expect(html).toContain('background-color: #abcdef');
  });
});

describe('generateEmailHtml: text', () => {
  it('applies the global font to text nested inside a section', () => {
    const html = generateEmailHtml(
      project([section([text({ content: 'Hello' })])], { ...defaultSettings, fontFamily: 'Georgia, serif' }),
    );
    expect(styleOf(html, 'Hello')).toContain('font-family:Georgia, serif');
  });

  it('lets a node-level font override the global font', () => {
    const html = generateEmailHtml(
      project([section([text({ content: 'Mono', fontFamily: 'Courier, monospace' })])]),
    );
    expect(styleOf(html, 'Mono')).toContain('font-family:Courier, monospace');
  });

  it('exports fontWeight so headings stay bold outside the editor', () => {
    const html = generateEmailHtml(project([section([text({ content: 'Title', fontWeight: '800' })])]));
    expect(styleOf(html, 'Title')).toContain('font-weight:800');
  });

  it('escapes user text so it renders literally, as it does on the canvas', () => {
    const html = generateEmailHtml(project([section([text({ content: 'Tom & Jerry <script>' })])]));
    expect(html).toContain('Tom &amp; Jerry &lt;script&gt;');
    expect(html).not.toContain('<script>');
  });
});

describe('generateEmailHtml: images and buttons', () => {
  it('escapes attribute values and writes a numeric width attribute for px widths', () => {
    const html = generateEmailHtml(
      project([
        section([
          {
            id: 'img',
            type: 'image',
            props: { src: 'https://x.test/a.png?a=1&b=2', alt: 'A "quoted" alt', width: '300px', height: 'auto' },
          },
        ]),
      ]),
    );
    expect(html).toContain('src="https://x.test/a.png?a=1&amp;b=2"');
    expect(html).toContain('alt="A &quot;quoted&quot; alt"');
    expect(html).toContain('width="300"');
    expect(html).not.toContain('height="auto"');
  });

  it('renders a bulletproof table button with an escaped href', () => {
    const html = generateEmailHtml(
      project([
        section([
          {
            id: 'btn',
            type: 'button',
            props: { content: 'Buy', href: 'https://x.test/?q="x"', backgroundColor: '#ff0000' },
          },
        ]),
      ]),
    );
    expect(html).toMatch(/<table[^>]*style="[^"]*background-color:#ff0000/);
    expect(html).toContain('href="https://x.test/?q=&quot;x&quot;"');
    expect(html).toContain('>Buy</a>');
  });
});

describe('generateEmailHtml: grid layout', () => {
  const col = (id: string): EmailNode => ({ id, type: 'column', props: {}, children: [] });

  it('splits a multi-column section into equal-width cells that stack on mobile', () => {
    const html = generateEmailHtml(project([section([col('a'), col('b')], { gridColumns: 2 })]));
    const cells = html.match(/<td width="50%"[^>]*>/g) ?? [];
    expect(cells).toHaveLength(2);
    cells.forEach((cell) => expect(cell).toContain('class="column-cell"'));
    expect(html).toContain('.column-cell {');
  });

  it('wraps children onto a new row when they exceed gridColumns', () => {
    const html = generateEmailHtml(project([section([col('a'), col('b'), col('c')], { gridColumns: 2 })]));
    const inner = html.slice(html.indexOf('container-table'));
    expect((inner.match(/<tr>/g) ?? []).length).toBeGreaterThanOrEqual(2);
  });

  it('renders an empty section as a spacer row instead of collapsing', () => {
    const html = generateEmailHtml(project([section([])]));
    expect(html).toContain('<tr><td style="padding: 20px;">&nbsp;</td></tr>');
  });
});

describe('generateEmailHtml: presets', () => {
  it.each(Object.entries(templates))('renders the %s preset without leaking undefined/null', (_, template) => {
    const html = generateEmailHtml(template.project);
    expect(html).not.toMatch(/undefined|null|\[object Object\]/);
  });
});

describe('escapeHtml', () => {
  it('escapes the five HTML-significant characters and stringifies nullish values', () => {
    expect(escapeHtml(`<a href="x">'&'</a>`)).toBe('&lt;a href=&quot;x&quot;&gt;&#39;&amp;&#39;&lt;/a&gt;');
    expect(escapeHtml(undefined)).toBe('');
  });
});
