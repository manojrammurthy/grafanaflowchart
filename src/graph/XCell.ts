/**
 * XCell — cell abstraction over mxGraph cells
 */

import { MxGraphCell, XCellData } from '../types/graph';

/**
 * Extract a simplified data representation from an mxGraph cell
 */
export function extractCellData(cell: MxGraphCell): XCellData {
  return {
    id: cell.id || '',
    value: extractCellValue(cell),
    style: cell.style || '',
    isVertex: !!cell.vertex,
    isEdge: !!cell.edge,
    geometry: cell.geometry
      ? {
          x: cell.geometry.x,
          y: cell.geometry.y,
          width: cell.geometry.width,
          height: cell.geometry.height,
        }
      : null,
    parent: cell.parent?.id || null,
    children: cell.children ? cell.children.map((c) => c.id) : [],
  };
}

/**
 * Extract the text value of a cell (handles XML nodes and strings)
 */
export function extractCellValue(cell: MxGraphCell): string {
  if (!cell.value) {
    return '';
  }
  if (typeof cell.value === 'object') {
    // Handle mxGraph XML nodes
    if (cell.value.nodeType === 1) {
      return (
        cell.value.getAttribute?.('label') ||
        cell.value.textContent ||
        ''
      );
    }
    return String(cell.value);
  }
  return String(cell.value);
}

/**
 * Extract the label from a cell's style string
 */
export function extractCellLabel(cell: MxGraphCell): string {
  const style = cell.style || '';
  const labelMatch = style.match(/label=([^;]+)/);
  if (labelMatch) {
    return labelMatch[1];
  }
  return extractCellValue(cell);
}

/**
 * Get all shape cells (vertices and edges, excluding root/layers)
 */
export function getAllShapeCells(model: any): MxGraphCell[] {
  const cells = model.cells;
  const result: MxGraphCell[] = [];
  for (const id in cells) {
    const cell = cells[id];
    if (cell.vertex || cell.edge) {
      result.push(cell);
    }
  }
  return result;
}

/**
 * Get all cell IDs from the model
 */
export function getAllCellIds(model: any): string[] {
  const cells = model.cells;
  const ids: string[] = [];
  for (const id in cells) {
    if (cells[id].vertex || cells[id].edge) {
      ids.push(id);
    }
  }
  return ids;
}

/**
 * Build a label map: cellId -> label text
 */
export function buildCellLabelMap(model: any): Map<string, string> {
  const cells = model.cells;
  const map = new Map<string, string>();
  for (const id in cells) {
    const cell = cells[id];
    if (cell.vertex || cell.edge) {
      map.set(id, extractCellValue(cell));
    }
  }
  return map;
}

/**
 * Get cell display name for debugging/inspector
 */
export function getCellDisplayName(cell: MxGraphCell): string {
  return cell.id || extractCellValue(cell) || '<unnamed>';
}
