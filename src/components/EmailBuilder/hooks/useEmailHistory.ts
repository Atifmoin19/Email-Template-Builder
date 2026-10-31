import { useCallback, useReducer } from 'react';
import type { EmailProject } from '../types';
import { historyReducer, initHistory } from './historyReducer';

/**
 * Snapshot-based undo/redo. State transitions live in a pure reducer so
 * rapid or repeated calls (key repeat on Cmd+Z, several updates in one tick)
 * never read a stale past/present from a render closure.
 */
export const useEmailHistory = (initialProject: EmailProject) => {
  const [state, dispatch] = useReducer(historyReducer, initialProject, initHistory);

  const setProject = useCallback(
    (project: EmailProject, coalesceKey?: string) => dispatch({ type: 'set', project, coalesceKey }),
    [],
  );
  const resetProject = useCallback((project: EmailProject) => dispatch({ type: 'reset', project }), []);
  const undo = useCallback(() => dispatch({ type: 'undo' }), []);
  const redo = useCallback(() => dispatch({ type: 'redo' }), []);

  return {
    project: state.present,
    setProject,
    resetProject,
    undo,
    redo,
    canUndo: state.past.length > 0,
    canRedo: state.future.length > 0,
  };
};
