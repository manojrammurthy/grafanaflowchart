/**
 * StateCycleApplier — imperatively applies CellState map to mxGraph cells
 */

import { MxGraph, MxGraphCell } from '../types/graph';
import { CellState } from '../types/state';
import { log } from '../utils/logging';

/**
 * Apply all computed cell states to the mxGraph model.
 * Must be called inside or wrapping a beginUpdate/endUpdate block.
 */
export function applyCellStates(
  graph: MxGraph,
  states: Map<string, CellState>
): void {
  if (states.size === 0) {
    return;
  }

  const model = graph.getModel();
  let applied = 0;
  model.beginUpdate();
  try {
    states.forEach((state, cellId) => {
      const cell = findCell(model, cellId);
      if (!cell) {
        return;
      }

      // Apply shape state (colors, visibility)
      if (state.shape) {
        applyShapeState(graph, cell, state);
        applied++;
      }

      // Apply text state
      if (state.text && state.text.value !== null) {
        model.setValue(cell, state.text.value);
      }

      // Apply visibility
      if (state.shape && !state.shape.visible) {
        model.setVisible(cell, false);
      }
    });
  } catch (err) {
    log.error('Error applying cell states:', err);
  } finally {
    model.endUpdate();
  }

  // Refresh after endUpdate so the model is in a consistent state
  graph.refresh();
  log.info(`Applied states to ${applied}/${states.size} cells`);
}

/**
 * Reset all cells to their original state
 */
export function resetCellStates(
  graph: MxGraph,
  originalValues: Map<string, string>
): void {
  const model = graph.getModel();
  model.beginUpdate();
  try {
    originalValues.forEach((value, cellId) => {
      const cell = findCell(model, cellId);
      if (cell) {
        model.setValue(cell, value);
        model.setVisible(cell, true);
      }
    });
    graph.refresh();
  } finally {
    model.endUpdate();
  }
}

function findCell(model: any, cellId: string): MxGraphCell | null {
  const cells = model.cells;
  if (cells[cellId]) {
    return cells[cellId];
  }
  // Fallback: search by value
  for (const id in cells) {
    const cell = cells[id];
    if (cell.value === cellId) {
      return cell;
    }
  }
  return null;
}

function applyShapeState(graph: MxGraph, cell: MxGraphCell, state: CellState): void {
  const shape = state.shape!;
  if (shape.fillColor) {
    graph.setCellStyles('fillColor', shape.fillColor, [cell]);
  }
  if (shape.strokeColor) {
    graph.setCellStyles('strokeColor', shape.strokeColor, [cell]);
  }
  if (shape.fontColor) {
    graph.setCellStyles('fontColor', shape.fontColor, [cell]);
  }
  if (shape.opacity !== null) {
    graph.setCellStyles('opacity', String(Math.round(shape.opacity * 100)), [cell]);
  }
}
