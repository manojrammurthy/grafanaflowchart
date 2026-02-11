/**
 * FloorplanShapes — registers Draw.io floorplan shape definitions with mxGraph.
 *
 * Without these, shapes like mxgraph.floorplan.doorRight render as plain rectangles.
 * Ported from: https://github.com/jgraph/drawio/blob/dev/src/main/webapp/shapes/mxFloorplan.js
 */

/* eslint-disable @typescript-eslint/no-this-alias */

import { log } from '../utils/logging';

/**
 * Register all floorplan shapes used in our diagrams.
 * Must be called AFTER mxGraph globals are loaded on window.
 */
export function registerFloorplanShapes(): void {
  const w = window as any;
  const mxShape = w.mxShape;
  const mxUtils = w.mxUtils;
  const mxCellRenderer = w.mxCellRenderer;

  if (!mxShape || !mxUtils || !mxCellRenderer) {
    log.warn('Cannot register floorplan shapes: mxGraph globals not available');
    return;
  }

  // Helper: create a shape constructor that extends mxShape
  function createShape(paintFn: (c: any, x: number, y: number, w: number, h: number) => void): any {
    const Ctor: any = function (this: any, bounds: any, fill: any, stroke: any, strokewidth: any) {
      mxShape.call(this);
      this.bounds = bounds;
      this.fill = fill;
      this.stroke = stroke;
      this.strokewidth = strokewidth != null ? strokewidth : 1;
    };
    mxUtils.extend(Ctor, mxShape);
    Ctor.prototype.paintVertexShape = paintFn;
    return Ctor;
  }

  // --- doorLeft: wall segment + arc swinging left ---
  const DoorLeft = createShape(function (c: any, x: number, y: number, w: number, _h: number) {
    c.translate(x, y);
    c.rect(0, 0, w, 5);
    c.fillAndStroke();
    c.begin();
    c.moveTo(w, 5);
    c.arcTo(w, w, 0, 0, 1, 0, 5 + w);
    c.lineTo(0, 5);
    c.stroke();
  });
  mxCellRenderer.registerShape('mxgraph.floorplan.doorLeft', DoorLeft);

  // --- doorRight: wall segment + arc swinging right ---
  const DoorRight = createShape(function (c: any, x: number, y: number, w: number, _h: number) {
    c.translate(x, y);
    c.rect(0, 0, w, 5);
    c.fillAndStroke();
    c.begin();
    c.moveTo(0, 5);
    c.arcTo(w, w, 0, 0, 0, w, 5 + w);
    c.lineTo(w, 5);
    c.stroke();
  });
  mxCellRenderer.registerShape('mxgraph.floorplan.doorRight', DoorRight);

  // --- doorDouble: wall segment + two arcs (one each side) ---
  const DoorDouble = createShape(function (c: any, x: number, y: number, w: number, _h: number) {
    c.translate(x, y);
    const halfW = w * 0.5;
    c.rect(0, 0, w, 5);
    c.fillAndStroke();
    c.begin();
    c.moveTo(halfW, 0);
    c.lineTo(halfW, 5);
    c.moveTo(halfW, 5);
    c.arcTo(halfW, halfW, 0, 0, 1, 0, 5 + halfW);
    c.lineTo(0, 5);
    c.moveTo(halfW, 5);
    c.arcTo(halfW, halfW, 0, 0, 0, w, 5 + halfW);
    c.lineTo(w, 5);
    c.stroke();
  });
  mxCellRenderer.registerShape('mxgraph.floorplan.doorDouble', DoorDouble);

  log.info('Registered floorplan shapes: doorLeft, doorRight, doorDouble');
}
