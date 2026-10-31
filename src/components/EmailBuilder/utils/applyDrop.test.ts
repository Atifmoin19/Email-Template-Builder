import { describe, expect, it } from 'vitest';
import { applyDrop } from './applyDrop';
import type { EmailNode } from '../types';

const leaf = (id: string, type: EmailNode['type'] = 'text'): EmailNode => ({ id, type, props: {} });
const box = (id: string, type: EmailNode['type'], children: EmailNode[]): EmailNode => ({ id, type, props: {}, children });

/** Compact tree shape: "s1[t1,t2]" etc. */
const shape = (nodes: EmailNode[] | null): string =>
  nodes === null
    ? 'null'
    : nodes.map((n) => (n.children ? `${n.id}[${shape(n.children)}]` : n.id)).join(',');

const tree = () => [box('s1', 'section', [leaf('t1'), leaf('t2')]), box('s2', 'section', [box('c1', 'column', [leaf('t3')])])];

describe('applyDrop', () => {
  it('reorders content within a section', () => {
    const nodes = tree();
    const out = applyDrop({ nodes, activeNode: nodes[0].children![1], isNew: false, overId: 't1', placement: 'top' });
    expect(shape(out)).toBe('s1[t2,t1],s2[c1[t3]]');
  });

  it('moves content into a nested column', () => {
    const nodes = tree();
    const out = applyDrop({ nodes, activeNode: nodes[0].children![0], isNew: false, overId: 'c1', placement: 'inside' });
    expect(shape(out)).toBe('s1[t2],s2[c1[t3,t1]]');
  });

  it('inserts a new palette item after the hovered sibling', () => {
    const out = applyDrop({ nodes: tree(), activeNode: leaf('new'), isNew: true, overId: 't1', placement: 'bottom' });
    expect(shape(out)).toBe('s1[t1,new,t2],s2[c1[t3]]');
  });

  it('reorders root sections', () => {
    const nodes = tree();
    const out = applyDrop({ nodes, activeNode: nodes[1], isNew: false, overId: 's1', placement: 'top' });
    expect(shape(out)).toBe('s2[c1[t3]],s1[t1,t2]');
  });

  it('appends content dropped on the empty canvas area to the last section', () => {
    const out = applyDrop({ nodes: tree(), activeNode: leaf('new'), isNew: true, overId: 'canvas-root', placement: null });
    expect(shape(out)).toBe('s1[t1,t2],s2[c1[t3],new]');
  });

  it('wraps content in a new section when the canvas is empty', () => {
    const out = applyDrop({ nodes: [], activeNode: leaf('new'), isNew: true, overId: 'canvas-root', placement: null });
    expect(out).toHaveLength(1);
    expect(out![0].type).toBe('section');
    expect(shape(out![0].children!)).toBe('new');
  });

  it('refuses to nest a header, footer or section inside a container', () => {
    for (const type of ['section', 'header', 'footer'] as const) {
      expect(applyDrop({ nodes: tree(), activeNode: box('x', type, []), isNew: true, overId: 's1', placement: 'inside' })).toBeNull();
      expect(applyDrop({ nodes: tree(), activeNode: box('x', type, []), isNew: true, overId: 't1', placement: 'bottom' })).toBeNull();
    }
  });

  it('refuses to drop a container into its own subtree', () => {
    const nodes = tree();
    const column = nodes[1].children![0];
    expect(applyDrop({ nodes, activeNode: column, isNew: false, overId: 't3', placement: 'bottom' })).toBeNull();
  });

  it('treats dropping a node onto itself as a no-op', () => {
    const nodes = tree();
    expect(applyDrop({ nodes, activeNode: nodes[0].children![0], isNew: false, overId: 't1', placement: 'top' })).toBeNull();
  });
});
