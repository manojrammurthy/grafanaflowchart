/**
 * useTooltip — debounced tooltip show/hide state management
 */

import { useState, useCallback, useRef } from 'react';
import { MxGraphCell } from '../types/graph';
import { CellState } from '../types/state';
import { TOOLTIP_DELAY_SHOW, TOOLTIP_DELAY_HIDE } from '../types/constants';

export interface TooltipData {
  cell: MxGraphCell;
  state: CellState;
  position: { x: number; y: number };
}

export function useTooltip() {
  const [tooltip, setTooltip] = useState<TooltipData | null>(null);
  const showTimer = useRef<number | null>(null);
  const hideTimer = useRef<number | null>(null);

  const showTooltip = useCallback(
    (cell: MxGraphCell, state: CellState, position: { x: number; y: number }) => {
      if (hideTimer.current) {
        clearTimeout(hideTimer.current);
        hideTimer.current = null;
      }
      showTimer.current = window.setTimeout(() => {
        setTooltip({ cell, state, position });
      }, TOOLTIP_DELAY_SHOW);
    },
    []
  );

  const hideTooltip = useCallback(() => {
    if (showTimer.current) {
      clearTimeout(showTimer.current);
      showTimer.current = null;
    }
    hideTimer.current = window.setTimeout(() => {
      setTooltip(null);
    }, TOOLTIP_DELAY_HIDE);
  }, []);

  const hideImmediately = useCallback(() => {
    if (showTimer.current) {
      clearTimeout(showTimer.current);
      showTimer.current = null;
    }
    if (hideTimer.current) {
      clearTimeout(hideTimer.current);
      hideTimer.current = null;
    }
    setTooltip(null);
  }, []);

  return { tooltip, showTooltip, hideTooltip, hideImmediately };
}
