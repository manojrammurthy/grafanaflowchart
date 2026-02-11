/**
 * XML parsing utilities
 */

import { decompress, isCompressed } from './compression';
import { log } from './logging';

/**
 * Parse an XML string into a Document
 */
export function parseXml(xml: string): Document {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xml, 'text/xml');
  const error = doc.querySelector('parsererror');
  if (error) {
    throw new Error('Invalid XML: ' + error.textContent);
  }
  return doc;
}

/**
 * Extract the <mxGraphModel> node from an mxfile document,
 * handling compressed diagram content and multi-page files.
 *
 * @param content Raw content (could be raw XML, mxfile wrapper, or compressed)
 * @param pageIndex Which diagram page to use (0-based)
 * @returns The decompressed mxGraphModel XML string
 */
export function extractDiagramXml(content: string, pageIndex = 0): string {
  const trimmed = content.trim();

  // If the content itself is compressed, decompress first
  if (isCompressed(trimmed)) {
    const decompressed = decompress(trimmed);
    return extractDiagramXml(decompressed, pageIndex);
  }

  // If it's already an mxGraphModel, return as-is
  if (trimmed.startsWith('<mxGraphModel')) {
    return trimmed;
  }

  // Parse XML
  const doc = parseXml(trimmed);
  const root = doc.documentElement;

  // If root is mxGraphModel, serialize and return
  if (root.nodeName === 'mxGraphModel') {
    return new XMLSerializer().serializeToString(root);
  }

  // If root is mxfile, extract the diagram
  if (root.nodeName === 'mxfile') {
    const diagrams = root.getElementsByTagName('diagram');
    if (diagrams.length === 0) {
      throw new Error('No <diagram> found inside <mxfile>');
    }

    const idx = Math.min(pageIndex, diagrams.length - 1);
    const diagramNode = diagrams[idx];
    const diagramContent = diagramNode.textContent || '';

    if (!diagramContent.trim()) {
      // Diagram may contain child mxGraphModel directly
      const child = diagramNode.getElementsByTagName('mxGraphModel')[0];
      if (child) {
        return new XMLSerializer().serializeToString(child);
      }
      throw new Error('Empty diagram content');
    }

    // The text content may be compressed
    if (isCompressed(diagramContent.trim())) {
      return decompress(diagramContent.trim());
    }

    // It may be uncompressed XML inside the diagram tag
    try {
      const innerDoc = parseXml(diagramContent.trim());
      return new XMLSerializer().serializeToString(innerDoc.documentElement);
    } catch {
      // Not valid XML on its own — try URL-decoding
      try {
        const decoded = decodeURIComponent(diagramContent.trim());
        return decoded;
      } catch {
        return diagramContent.trim();
      }
    }
  }

  // Unknown root
  log.warn('Unknown XML root element:', root.nodeName);
  return trimmed;
}

/**
 * Count the number of diagram pages in an mxfile
 */
export function getDiagramPageCount(content: string): number {
  try {
    const trimmed = content.trim();
    if (isCompressed(trimmed)) {
      const decompressed = decompress(trimmed);
      return getDiagramPageCount(decompressed);
    }
    const doc = parseXml(trimmed);
    if (doc.documentElement.nodeName === 'mxfile') {
      return doc.documentElement.getElementsByTagName('diagram').length;
    }
    return 1;
  } catch {
    return 1;
  }
}

/**
 * Get page names from an mxfile
 */
export function getDiagramPageNames(content: string): string[] {
  try {
    const trimmed = content.trim();
    if (isCompressed(trimmed)) {
      const decompressed = decompress(trimmed);
      return getDiagramPageNames(decompressed);
    }
    const doc = parseXml(trimmed);
    if (doc.documentElement.nodeName === 'mxfile') {
      const diagrams = doc.documentElement.getElementsByTagName('diagram');
      const names: string[] = [];
      for (let i = 0; i < diagrams.length; i++) {
        names.push(diagrams[i].getAttribute('name') || `Page ${i + 1}`);
      }
      return names;
    }
    return ['Page 1'];
  } catch {
    return ['Page 1'];
  }
}
