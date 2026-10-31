import type { EmailProject } from '../types';

/** Oldest entries are dropped beyond this many undo steps. */
export const HISTORY_LIMIT = 100;

export interface HistoryState {
  past: EmailProject[];
  present: EmailProject;
  future: EmailProject[];
  /**
   * Key of the last committed edit. Consecutive edits with the same key
   * (e.g. typing into one field, dragging a colour picker) collapse into a
   * single undo step instead of one step per keystroke.
   */
  lastKey: string | null;
}

export type HistoryAction =
  | { type: 'set'; project: EmailProject; coalesceKey?: string }
  | { type: 'reset'; project: EmailProject }
  | { type: 'undo' }
  | { type: 'redo' };

export const initHistory = (project: EmailProject): HistoryState => ({
  past: [],
  present: project,
  future: [],
  lastKey: null,
});

export const historyReducer = (state: HistoryState, action: HistoryAction): HistoryState => {
  switch (action.type) {
    case 'set': {
      if (action.project === state.present) return state;
      const key = action.coalesceKey ?? null;
      if (key !== null && key === state.lastKey) {
        return { ...state, present: action.project, future: [] };
      }
      return {
        past: [...state.past, state.present].slice(-HISTORY_LIMIT),
        present: action.project,
        future: [],
        lastKey: key,
      };
    }
    case 'reset':
      return initHistory(action.project);
    case 'undo': {
      if (state.past.length === 0) return state;
      return {
        past: state.past.slice(0, -1),
        present: state.past[state.past.length - 1],
        future: [state.present, ...state.future],
        lastKey: null,
      };
    }
    case 'redo': {
      if (state.future.length === 0) return state;
      return {
        past: [...state.past, state.present],
        present: state.future[0],
        future: state.future.slice(1),
        lastKey: null,
      };
    }
    default:
      return state;
  }
};
