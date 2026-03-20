import React, { createContext, useContext, useState } from 'react';
import type { EmailNodeType } from '../types';

export type Placement = 'left' | 'right' | 'top' | 'bottom' | 'inside' | null;

interface DragState {
  overId: string | null;
  placement: Placement;
  activeType: EmailNodeType | null;
  isNew: boolean;
}

interface DragStateContextType {
  dragState: DragState;
  setDragState: (state: Partial<DragState>) => void;
  resetDragState: () => void;
}

const DragStateContext = createContext<DragStateContextType | undefined>(undefined);

export const DragStateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [dragState, setDragStateInternal] = useState<DragState>({
    overId: null,
    placement: null,
    activeType: null,
    isNew: false,
  });

  const setDragState = (newState: Partial<DragState>) => {
    setDragStateInternal(prev => ({ ...prev, ...newState }));
  };

  const resetDragState = () => {
    setDragStateInternal({
      overId: null,
      placement: null,
      activeType: null,
      isNew: false,
    });
  };

  return (
    <DragStateContext.Provider value={{ dragState, setDragState, resetDragState }}>
      {children}
    </DragStateContext.Provider>
  );
};

export const useDragState = () => {
  const context = useContext(DragStateContext);
  if (context === undefined) {
    throw new Error('useDragState must be used within a DragStateProvider');
  }
  return context;
};
