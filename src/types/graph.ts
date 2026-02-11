/**
 * mxGraph wrapper types and global augmentations
 */

export interface XGraphOptions {
  width: number;
  height: number;
  readOnly: boolean;
  center: boolean;
  background: string;
}

export interface XCellData {
  id: string;
  value: string;
  style: string;
  isVertex: boolean;
  isEdge: boolean;
  geometry: {
    x: number;
    y: number;
    width: number;
    height: number;
  } | null;
  parent: string | null;
  children: string[];
}

export interface MxGraphCell {
  id: string;
  value: any;
  style: string;
  vertex: boolean;
  edge: boolean;
  parent: MxGraphCell | null;
  children: MxGraphCell[];
  geometry: {
    x: number;
    y: number;
    width: number;
    height: number;
    clone: () => any;
  } | null;
}

export interface MxGraph {
  container: HTMLElement;
  view: {
    scale: number;
    translate: { x: number; y: number };
    setScale: (scale: number) => void;
    setTranslate: (x: number, y: number) => void;
    getState: (cell: any) => any;
  };
  model: {
    cells: { [id: string]: MxGraphCell };
    beginUpdate: () => void;
    endUpdate: () => void;
    setValue: (cell: any, value: any) => void;
    setVisible: (cell: any, visible: boolean) => void;
    setGeometry: (cell: any, geo: any) => void;
    getChildCount: (cell: any) => number;
    getChildAt: (cell: any, index: number) => any;
  };
  getModel: () => any;
  getDefaultParent: () => any;
  getGraphBounds: () => { x: number; y: number; width: number; height: number };
  getChildVertices: (parent: any) => any[];
  getChildEdges: (parent: any) => any[];
  moveCells: (cells: any[], dx: number, dy: number) => void;
  setCellStyles: (style: string, value: any, cells: any[]) => void;
  getStylesheet: () => any;
  setEnabled: (enabled: boolean) => void;
  setHtmlLabels: (enabled: boolean) => void;
  setCellsResizable: (enabled: boolean) => void;
  setCellsMovable: (enabled: boolean) => void;
  setCellsSelectable: (enabled: boolean) => void;
  setPanning: (enabled: boolean) => void;
  fit: (border?: number) => number;
  center: (horizontal?: boolean, vertical?: boolean) => void;
  refresh: () => void;
  destroy: () => void;
  foldingEnabled: boolean;
}

// Global window augmentation for mxGraph
declare global {
  interface Window {
    mxGraph: any;
    mxUtils: any;
    mxCodec: any;
    mxCell: any;
    mxGeometry: any;
    mxEvent: any;
    mxClient: any;
    mxConstants: any;
    mxGraphModel: any;
    mxPoint: any;
    mxRectangle: any;
    pako: any;
  }
}
