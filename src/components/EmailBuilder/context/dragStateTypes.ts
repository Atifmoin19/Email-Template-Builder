import { createContext } from 'react';
import type { EmailNodeType } from '../types';

export type Placement = 'left' | 'right' | 'top' | 'bottom' | 'inside' | null;

export interface DragState {
  overId: string | null;
  placement: Placement;
  activeType: EmailNodeType | null;
  isNew: boolean;
}

export interface DragStateContextType {
  dragState: DragState;
  setDragState: (state: Partial<DragState>) => void;
  resetDragState: () => void;
}

export const initialDragState: DragState = {
  overId: null,
  placement: null,
  activeType: null,
  isNew: false,
};

export const DragStateContext = createContext<DragStateContextType | undefined>(undefined);
