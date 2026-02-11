/**
 * GraphDecoder — decodes all Draw.io formats into mxGraph-ready XML
 *
 * Handles: raw XML, mxfile wrapper, compressed (base64+deflateRaw+URL-encode),
 * multi-page mxfiles, and SVG.
 */

import { extractDiagramXml } from '../utils/xml';
import { log } from '../utils/logging';

/**
 * Decode any Draw.io content format into an mxGraphModel XML string
 */
export function decodeDiagramContent(
  content: string,
  pageIndex = 0
): string {
  if (!content || !content.trim()) {
    throw new Error('No diagram content provided');
  }

  try {
    return extractDiagramXml(content, pageIndex);
  } catch (err) {
    log.error('Failed to decode diagram content:', err);
    throw new Error(
      `Failed to decode diagram: ${err instanceof Error ? err.message : String(err)}`
    );
  }
}

/**
 * Load decoded XML into an mxGraph instance
 */
export function loadXmlIntoGraph(graph: any, xml: string): void {
  if (!xml) {
    throw new Error('No XML content to load');
  }

  const mxUtils = (window as any).mxUtils;
  const mxCodec = (window as any).mxCodec;

  if (!mxUtils || !mxCodec) {
    throw new Error('mxGraph utilities not loaded');
  }

  const xmlDoc = mxUtils.parseXml(xml);
  if (!xmlDoc || !xmlDoc.documentElement) {
    throw new Error('Invalid XML content');
  }

  const codec = new mxCodec(xmlDoc);
  const model = graph.getModel();

  model.beginUpdate();
  try {
    codec.decode(xmlDoc.documentElement, model);
  } finally {
    model.endUpdate();
  }
}
