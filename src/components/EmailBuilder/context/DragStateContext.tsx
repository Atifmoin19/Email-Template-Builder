import React, { useCallback, useMemo, useState } from 'react';
import { DragStateContext, initialDragState } from './dragStateTypes';
import type { DragState } from './dragStateTypes';

export const DragStateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [dragState, setDragStateInternal] = useState<DragState>(initialDragState);

  const setDragState = useCallback((newState: Partial<DragState>) => {
    setDragStateInternal(prev => ({ ...prev, ...newState }));
  }, []);

  const resetDragState = useCallback(() => {
    setDragStateInternal(initialDragState);
  }, []);

  const value = useMemo(
    () => ({ dragState, setDragState, resetDragState }),
    [dragState, setDragState, resetDragState],
  );

  return <DragStateContext.Provider value={value}>{children}</DragStateContext.Provider>;
};
