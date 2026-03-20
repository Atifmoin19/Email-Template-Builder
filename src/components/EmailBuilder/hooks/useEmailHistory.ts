import { useState, useCallback } from 'react';
import type { EmailProject } from '../types';

export const useEmailHistory = (initialProject: EmailProject) => {
  const [past, setPast] = useState<EmailProject[]>([]);
  const [present, setPresent] = useState<EmailProject>(initialProject);
  const [future, setFuture] = useState<EmailProject[]>([]);

  const canUndo = past.length > 0;
  const canRedo = future.length > 0;

  const undo = useCallback(() => {
    if (!canUndo) return;

    const previous = past[past.length - 1];
    const newPast = past.slice(0, past.length - 1);

    setPast(newPast);
    setFuture([present, ...future]);
    setPresent(previous);
  }, [canUndo, past, present, future]);

  const redo = useCallback(() => {
    if (!canRedo) return;

    const next = future[0];
    const newFuture = future.slice(1);

    setPast([...past, present]);
    setPresent(next);
    setFuture(newFuture);
  }, [canRedo, future, past, present]);

  const updateProject = useCallback((newProject: EmailProject) => {
    setPast([...past, present]);
    setPresent(newProject);
    setFuture([]);
  }, [past, present]);

  const resetProject = useCallback((newProject: EmailProject) => {
    setPast([]);
    setPresent(newProject);
    setFuture([]);
  }, []);

  return {
    project: present,
    setProject: updateProject,
    resetProject,
    undo,
    redo,
    canUndo,
    canRedo,
  };
};
