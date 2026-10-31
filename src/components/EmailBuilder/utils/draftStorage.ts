import type { EmailNode, EmailNodeType, EmailProject, EmailSettings } from '../types';

/**
 * Autosaved draft of the open template. Only the document and its global
 * settings are stored, never the undo history. Bump the version in the key
 * when the stored shape changes so old drafts are ignored, not misread.
 */
export const DRAFT_KEY = 'etf:draft:v1';
const DRAFT_VERSION = 1;

type DraftStorage = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>;

const NODE_TYPES: ReadonlySet<EmailNodeType> = new Set<EmailNodeType>([
  'section', 'column', 'text', 'image', 'button', 'divider', 'spacer', 'header', 'footer',
]);

const SETTINGS_KEYS: (keyof EmailSettings)[] = [
  'pageBackgroundColor', 'contentBackgroundColor', 'fontFamily', 'globalPadding', 'maxWidth',
];

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const isNode = (value: unknown): value is EmailNode =>
  isObject(value) &&
  typeof value.id === 'string' &&
  NODE_TYPES.has(value.type as EmailNodeType) &&
  isObject(value.props) &&
  (value.children === undefined || (Array.isArray(value.children) && value.children.every(isNode)));

const isSettings = (value: unknown): value is EmailSettings =>
  isObject(value) && SETTINGS_KEYS.every((key) => typeof value[key] === 'string');

export const serializeDraft = (project: EmailProject): string =>
  JSON.stringify({ version: DRAFT_VERSION, project: { nodes: project.nodes, settings: project.settings } });

/** Returns the stored project, or null for missing, corrupt or outdated data. */
export const parseDraft = (raw: string | null): EmailProject | null => {
  if (!raw) return null;
  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch {
    return null;
  }
  if (!isObject(data) || data.version !== DRAFT_VERSION || !isObject(data.project)) return null;
  const { nodes, settings } = data.project;
  if (!Array.isArray(nodes) || !nodes.every(isNode) || !isSettings(settings)) return null;
  return { nodes, settings };
};

const defaultStorage = (): DraftStorage | null => {
  try {
    return typeof window === 'undefined' ? null : window.localStorage;
  } catch {
    return null;
  }
};

export const loadDraft = (storage: DraftStorage | null = defaultStorage()): EmailProject | null => {
  try {
    return parseDraft(storage?.getItem(DRAFT_KEY) ?? null);
  } catch {
    return null;
  }
};

/** Returns false when storage is unavailable or full. */
export const saveDraft = (project: EmailProject, storage: DraftStorage | null = defaultStorage()): boolean => {
  if (!storage) return false;
  try {
    storage.setItem(DRAFT_KEY, serializeDraft(project));
    return true;
  } catch {
    return false;
  }
};

export const clearDraft = (storage: DraftStorage | null = defaultStorage()): void => {
  try {
    storage?.removeItem(DRAFT_KEY);
  } catch {
    // Nothing to do: a draft we cannot remove will be overwritten on next save.
  }
};
