/**
 * Compression utilities for Draw.io diagram content
 *
 * Draw.io compressed format: XML → deflateRaw → URL-encode → base64
 * Decompression:            base64 → URL-decode → inflateRaw → XML
 */

import pako from 'pako';
import { log } from './logging';

/**
 * Decompress a Draw.io compressed string back to XML
 */
export function decompress(data: string): string {
  try {
    // Step 1: base64 decode
    const binary = atob(data);

    // Step 2: convert to Uint8Array
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }

    // Step 3: inflate (raw deflate — no zlib header)
    let inflated: string;
    try {
      inflated = pako.inflateRaw(bytes, { to: 'string' });
    } catch {
      // Fallback: try full inflate (with header)
      inflated = pako.inflate(bytes, { to: 'string' });
    }

    // Step 4: URL-decode
    try {
      return decodeURIComponent(inflated);
    } catch {
      return inflated;
    }
  } catch (err) {
    log.error('Decompression failed:', err);
    throw new Error('Failed to decompress diagram data');
  }
}

/**
 * Compress XML string using Draw.io format
 */
export function compress(xml: string): string {
  try {
    // Step 1: URL-encode
    const encoded = encodeURIComponent(xml);

    // Step 2: deflateRaw
    const encoder = new TextEncoder();
    const deflated = pako.deflateRaw(encoder.encode(encoded), { level: 9 });

    // Step 3: base64 encode
    let binary = '';
    for (let i = 0; i < deflated.length; i++) {
      binary += String.fromCharCode(deflated[i]);
    }
    return btoa(binary);
  } catch (err) {
    log.error('Compression failed:', err);
    return xml;
  }
}

/**
 * Detect whether a string appears to be compressed (base64)
 */
export function isCompressed(content: string): boolean {
  if (!content) {
    return false;
  }
  const trimmed = content.trim();
  // Compressed data won't start with '<' and is base64
  return !trimmed.startsWith('<') && /^[A-Za-z0-9+/\s]+=*$/.test(trimmed);
}
