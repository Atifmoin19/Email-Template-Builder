import { describe, expect, it } from 'vitest';
import { HISTORY_LIMIT, historyReducer, initHistory } from './historyReducer';
import type { HistoryAction, HistoryState } from './historyReducer';
import type { EmailProject } from '../types';
import { defaultSettings } from '../presets';

const p = (label: string): EmailProject => ({
  settings: defaultSettings,
  nodes: [{ id: label, type: 'text', props: { content: label } }],
});

const run = (state: HistoryState, ...actions: HistoryAction[]) => actions.reduce(historyReducer, state);
const label = (s: HistoryState) => s.present.nodes[0].id;

describe('historyReducer', () => {
  it('undoes and redoes in order', () => {
    let s = run(initHistory(p('a')), { type: 'set', project: p('b') }, { type: 'set', project: p('c') });
    expect(label(s)).toBe('c');
    s = run(s, { type: 'undo' });
    expect(label(s)).toBe('b');
    s = run(s, { type: 'undo' });
    expect(label(s)).toBe('a');
    s = run(s, { type: 'redo' }, { type: 'redo' });
    expect(label(s)).toBe('c');
  });

  it('is a no-op when there is nothing to undo or redo', () => {
    const s = initHistory(p('a'));
    expect(run(s, { type: 'undo' })).toBe(s);
    expect(run(s, { type: 'redo' })).toBe(s);
  });

  it('clears the redo stack on a new edit', () => {
    const s = run(
      initHistory(p('a')),
      { type: 'set', project: p('b') },
      { type: 'undo' },
      { type: 'set', project: p('c') },
    );
    expect(s.future).toHaveLength(0);
    expect(s.past.map((x) => x.nodes[0].id)).toEqual(['a']);
  });

  it('collapses consecutive edits with the same coalesce key into one undo step', () => {
    let s = run(
      initHistory(p('a')),
      { type: 'set', project: p('H'), coalesceKey: 'text-1:content' },
      { type: 'set', project: p('He'), coalesceKey: 'text-1:content' },
      { type: 'set', project: p('Hey'), coalesceKey: 'text-1:content' },
    );
    expect(label(s)).toBe('Hey');
    expect(s.past).toHaveLength(1);
    s = run(s, { type: 'undo' });
    expect(label(s)).toBe('a');
  });

  it('starts a new step after undo even with the same coalesce key', () => {
    const s = run(
      initHistory(p('a')),
      { type: 'set', project: p('b'), coalesceKey: 'k' },
      { type: 'undo' },
      { type: 'set', project: p('c'), coalesceKey: 'k' },
      { type: 'set', project: p('d'), coalesceKey: 'other' },
    );
    expect(s.past.map((x) => x.nodes[0].id)).toEqual(['a', 'c']);
  });

  it(`caps history at ${HISTORY_LIMIT} entries`, () => {
    let s = initHistory(p('0'));
    for (let i = 1; i <= HISTORY_LIMIT + 20; i++) s = historyReducer(s, { type: 'set', project: p(String(i)) });
    expect(s.past).toHaveLength(HISTORY_LIMIT);
    expect(s.past[0].nodes[0].id).toBe('20');
  });

  it('reset wipes past and future', () => {
    const s = run(initHistory(p('a')), { type: 'set', project: p('b') }, { type: 'undo' }, { type: 'reset', project: p('z') });
    expect(s).toEqual(initHistory(p('z')));
  });
});
