import { useContext } from 'react';
import { DragStateContext } from './dragStateTypes';

export const useDragState = () => {
  const context = useContext(DragStateContext);
  if (context === undefined) {
    throw new Error('useDragState must be used within a DragStateProvider');
  }
  return context;
};
