/**
 * GraphInitializer — creates and configures an mxGraph instance
 */

import { MxGraph } from '../types/graph';
import { log } from '../utils/logging';

export interface GraphConfig {
  width: number;
  height: number;
  background?: string;
  readOnly?: boolean;
}

/**
 * Create and configure an mxGraph instance attached to the given container
 */
export function createGraph(
  container: HTMLElement,
  config: GraphConfig
): MxGraph {
  const MxGraphClass = (window as any).mxGraph;
  if (!MxGraphClass) {
    throw new Error('mxGraph library not loaded');
  }

  // Clear container
  container.innerHTML = '';

  const graph = new MxGraphClass(container) as MxGraph;

  // Read-only mode
  if (config.readOnly !== false) {
    graph.setEnabled(false);
    graph.setCellsSelectable(false);
    graph.setCellsResizable(false);
    graph.setCellsMovable(false);
  }

  // Configuration
  graph.setHtmlLabels(true);
  graph.foldingEnabled = false;
  graph.setPanning(true);

  // Container sizing
  container.style.width = `${config.width}px`;
  container.style.height = `${config.height}px`;
  container.style.overflow = 'hidden';
  container.style.position = 'relative';

  if (config.background) {
    container.style.background = config.background;
  }

  log.debug('Graph created', config.width, 'x', config.height);
  return graph;
}

/**
 * Fit and center the graph content within the container.
 * Handles negative coordinates (common in Draw.io exports).
 */
export function fitGraphToContainer(
  graph: MxGraph,
  width: number,
  height: number,
  padding = 10
): void {
  // Always reset to identity transform first so getGraphBounds() returns model coords.
  // This is critical for resize (second call) where scale was already changed.
  graph.view.setScale(1);
  graph.view.setTranslate(0, 0);

  let bounds = graph.getGraphBounds();

  // Fix negative coordinates by translating all cells
  if (bounds.x < 0 || bounds.y < 0) {
    const parent = graph.getDefaultParent();
    const vertices = graph.getChildVertices(parent);
    const edges = graph.getChildEdges(parent);
    const allCells = [...vertices, ...edges];

    if (allCells.length > 0) {
      const dx = -Math.min(bounds.x, 0);
      const dy = -Math.min(bounds.y, 0);
      graph.moveCells(allCells, dx, dy);
      bounds = graph.getGraphBounds();
    }
  }

  if (bounds.width === 0 || bounds.height === 0) {
    return;
  }

  // Calculate scale to fit diagram in container with padding (never scale up)
  const availW = width - padding * 2;
  const availH = height - padding * 2;
  const scaleX = availW / bounds.width;
  const scaleY = availH / bounds.height;
  const scale = Math.min(scaleX, scaleY, 1);

  graph.view.setScale(scale);

  // Center the diagram within the container.
  // mxGraph transform: screen_pos = (graph_pos + translate) * scale
  // Solve for translate: translate = desired_screen_pos / scale - graph_pos
  const screenX = padding + (availW - bounds.width * scale) / 2;
  const screenY = padding + (availH - bounds.height * scale) / 2;
  const tx = screenX / scale - bounds.x;
  const ty = screenY / scale - bounds.y;
  graph.view.setTranslate(tx, ty);

  graph.refresh();
  log.info(`Fit: bounds=${Math.round(bounds.x)},${Math.round(bounds.y)} ${Math.round(bounds.width)}x${Math.round(bounds.height)} → container=${width}x${height} scale=${(scale*100).toFixed(1)}% translate=${tx.toFixed(1)},${ty.toFixed(1)}`);
}

/**
 * Destroy the graph and clean up resources
 */
export function destroyGraph(graph: MxGraph): void {
  try {
    graph.destroy();
  } catch {
    // Ignore destroy errors
  }
}
