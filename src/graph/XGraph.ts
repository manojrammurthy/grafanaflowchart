/**
 * XGraph — high-level wrapper around an mxGraph instance
 *
 * Manages lifecycle, cell access, view control, and model mutation.
 */

import { MxGraph, MxGraphCell } from '../types/graph';
import { GraphConfig, createGraph, fitGraphToContainer, destroyGraph } from './GraphInitializer';
import { decodeDiagramContent, loadXmlIntoGraph } from './GraphDecoder';
import { getAllShapeCells, getAllCellIds, buildCellLabelMap, extractCellValue } from './XCell';
import { log } from '../utils/logging';

export class XGraph {
  private graph: MxGraph | null = null;
  private container: HTMLElement | null = null;
  private originalValues = new Map<string, string>();

  /**
   * Initialize graph in the given container
   */
  init(container: HTMLElement, config: GraphConfig): MxGraph {
    this.container = container;
    this.graph = createGraph(container, config);
    return this.graph;
  }

  /**
   * Load diagram content (handles all formats)
   */
  loadContent(content: string, pageIndex = 0): void {
    if (!this.graph) {
      throw new Error('Graph not initialized');
    }

    const xml = decodeDiagramContent(content, pageIndex);
    loadXmlIntoGraph(this.graph, xml);

    // Store original values for reset
    this.saveOriginalValues();

    log.info('Diagram loaded successfully');
  }

  /**
   * Fit the diagram to the container
   */
  fit(width: number, height: number, padding = 10): void {
    if (!this.graph) {
      return;
    }
    fitGraphToContainer(this.graph, width, height, padding);
  }

  /**
   * Get the underlying mxGraph instance
   */
  getGraph(): MxGraph | null {
    return this.graph;
  }

  /**
   * Get all cell IDs
   */
  getCellIds(): string[] {
    if (!this.graph) {
      return [];
    }
    return getAllCellIds(this.graph.getModel());
  }

  /**
   * Get cell ID -> label map
   */
  getCellLabels(): Map<string, string> {
    if (!this.graph) {
      return new Map();
    }
    return buildCellLabelMap(this.graph.getModel());
  }

  /**
   * Get all shape cells
   */
  getShapeCells(): MxGraphCell[] {
    if (!this.graph) {
      return [];
    }
    return getAllShapeCells(this.graph.getModel());
  }

  /**
   * Get original cell values (for reset)
   */
  getOriginalValues(): Map<string, string> {
    return new Map(this.originalValues);
  }

  /**
   * Set zoom scale
   */
  setScale(scale: number): void {
    this.graph?.view.setScale(scale);
  }

  /**
   * Set translation
   */
  setTranslate(x: number, y: number): void {
    this.graph?.view.setTranslate(x, y);
  }

  /**
   * Destroy the graph
   */
  destroy(): void {
    if (this.graph) {
      destroyGraph(this.graph);
      this.graph = null;
    }
    this.container = null;
    this.originalValues.clear();
  }

  private saveOriginalValues(): void {
    if (!this.graph) {
      return;
    }
    this.originalValues.clear();
    const cells = getAllShapeCells(this.graph.getModel());
    for (const cell of cells) {
      this.originalValues.set(cell.id, extractCellValue(cell));
    }
  }
}
