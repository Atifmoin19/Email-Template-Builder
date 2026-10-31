import { useEffect, useState } from 'react';
import type { EmailProject } from '../types';
import { saveDraft } from '../utils/draftStorage';

export type SaveStatus = 'saved' | 'saving' | 'error';

/**
 * Debounced autosave of the current project. Status is derived by comparing
 * the live project with the last one written, so no state is set synchronously
 * inside the effect.
 */
export const useAutosave = (project: EmailProject, initiallySaved: EmailProject | null, delay = 500) => {
  const [saved, setSaved] = useState<EmailProject | null>(initiallySaved);
  const [failed, setFailed] = useState<EmailProject | null>(null);

  useEffect(() => {
    if (project === saved) return;
    const timer = window.setTimeout(() => {
      if (saveDraft(project)) {
        setSaved(project);
        setFailed(null);
      } else {
        setFailed(project);
      }
    }, delay);
    return () => window.clearTimeout(timer);
  }, [project, saved, delay]);

  /** Mark a project as already persisted (or deliberately cleared). */
  const markSaved = setSaved;

  const status: SaveStatus = failed === project ? 'error' : saved === project ? 'saved' : 'saving';
  return { status, markSaved };
};
