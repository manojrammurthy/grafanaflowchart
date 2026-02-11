/**
 * CellStyler — helpers for mutating mxGraph cell styles
 */

import { MxGraph, MxGraphCell } from '../types/graph';

/**
 * Set fill color on a cell
 */
export function setCellFillColor(graph: MxGraph, cell: MxGraphCell, color: string): void {
  graph.setCellStyles('fillColor', color, [cell]);
}

/**
 * Set stroke (border) color on a cell
 */
export function setCellStrokeColor(graph: MxGraph, cell: MxGraphCell, color: string): void {
  graph.setCellStyles('strokeColor', color, [cell]);
}

/**
 * Set font color on a cell
 */
export function setCellFontColor(graph: MxGraph, cell: MxGraphCell, color: string): void {
  graph.setCellStyles('fontColor', color, [cell]);
}

/**
 * Set opacity on a cell (0–100)
 */
export function setCellOpacity(graph: MxGraph, cell: MxGraphCell, opacity: number): void {
  graph.setCellStyles('opacity', String(Math.round(opacity)), [cell]);
}

/**
 * Set visibility on a cell
 */
export function setCellVisible(graph: MxGraph, cell: MxGraphCell, visible: boolean): void {
  graph.getModel().setVisible(cell, visible);
}

/**
 * Set the text value of a cell
 */
export function setCellValue(graph: MxGraph, cell: MxGraphCell, value: string): void {
  graph.getModel().setValue(cell, value);
}

/**
 * Set multiple style properties at once
 */
export function setCellStyleProperties(
  graph: MxGraph,
  cell: MxGraphCell,
  props: Record<string, string>
): void {
  for (const [key, value] of Object.entries(props)) {
    graph.setCellStyles(key, value, [cell]);
  }
}

/**
 * Parse an mxGraph style string into a key-value map
 */
export function parseStyle(style: string): Record<string, string> {
  const result: Record<string, string> = {};
  if (!style) {
    return result;
  }
  const parts = style.split(';').filter(Boolean);
  for (const part of parts) {
    const eqIndex = part.indexOf('=');
    if (eqIndex > 0) {
      result[part.substring(0, eqIndex)] = part.substring(eqIndex + 1);
    } else {
      // Style name without value (e.g., "rounded")
      result[part] = '1';
    }
  }
  return result;
}
