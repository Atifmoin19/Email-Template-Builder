import { describe, expect, it } from 'vitest';
import { DRAFT_KEY, clearDraft, loadDraft, parseDraft, saveDraft, serializeDraft } from './draftStorage';
import { defaultSettings, templates } from '../presets';
import type { EmailProject } from '../types';

const memoryStorage = () => {
  const data = new Map<string, string>();
  return {
    getItem: (k: string) => data.get(k) ?? null,
    setItem: (k: string, v: string) => void data.set(k, v),
    removeItem: (k: string) => void data.delete(k),
    data,
  };
};

const sample: EmailProject = templates.Welcome.project;

describe('draftStorage', () => {
  it('round-trips a project through serialize and parse', () => {
    expect(parseDraft(serializeDraft(sample))).toEqual(sample);
  });

  it('saves under the versioned key and restores it', () => {
    const storage = memoryStorage();
    expect(saveDraft(sample, storage)).toBe(true);
    expect([...storage.data.keys()]).toEqual([DRAFT_KEY]);
    expect(loadDraft(storage)).toEqual(sample);
    clearDraft(storage);
    expect(loadDraft(storage)).toBeNull();
  });

  it('does not store anything beyond nodes and settings', () => {
    const withExtra = { ...sample, past: [sample] } as unknown as EmailProject;
    expect(Object.keys(JSON.parse(serializeDraft(withExtra)).project).sort()).toEqual(['nodes', 'settings']);
  });

  it.each([
    ['missing', null],
    ['invalid JSON', '{not json'],
    ['wrong version', JSON.stringify({ version: 0, project: { nodes: [], settings: defaultSettings } })],
    ['no version (old format)', JSON.stringify({ nodes: [], settings: defaultSettings })],
    ['nodes not an array', JSON.stringify({ version: 1, project: { nodes: {}, settings: defaultSettings } })],
    ['unknown node type', JSON.stringify({ version: 1, project: { nodes: [{ id: 'a', type: 'video', props: {} }], settings: defaultSettings } })],
    ['bad nested child', JSON.stringify({ version: 1, project: { nodes: [{ id: 'a', type: 'section', props: {}, children: [{ id: 1 }] }], settings: defaultSettings } })],
    ['incomplete settings', JSON.stringify({ version: 1, project: { nodes: [], settings: { maxWidth: '600px' } } })],
  ])('falls back to no draft for %s data', (_label, raw) => {
    expect(parseDraft(raw)).toBeNull();
  });

  it('survives storage that throws', () => {
    const broken = {
      getItem: () => { throw new Error('denied'); },
      setItem: () => { throw new Error('quota'); },
      removeItem: () => { throw new Error('denied'); },
    };
    expect(loadDraft(broken)).toBeNull();
    expect(saveDraft(sample, broken)).toBe(false);
    expect(() => clearDraft(broken)).not.toThrow();
  });
});
