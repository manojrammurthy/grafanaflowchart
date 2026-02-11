/**
 * Draw.io specific utilities
 */

/**
 * Get an empty default Draw.io diagram
 */
export function getDefaultDiagram(): string {
  return `<mxGraphModel>
  <root>
    <mxCell id="0" />
    <mxCell id="1" parent="0" />
  </root>
</mxGraphModel>`;
}

/**
 * Wrap an mxGraphModel in an mxfile container
 */
export function wrapInMxfile(xml: string, name = 'Page-1'): string {
  return `<mxfile>
  <diagram name="${name}">
    ${xml}
  </diagram>
</mxfile>`;
}

/**
 * Detect the content type of a diagram string
 */
export function detectContentType(
  content: string
): 'svg' | 'xml' | 'mxfile' | 'compressed' | 'unknown' {
  const trimmed = content.trim();

  if (trimmed.startsWith('<svg') || trimmed.startsWith('<?xml') && trimmed.includes('<svg')) {
    return 'svg';
  }
  if (trimmed.startsWith('<mxfile')) {
    return 'mxfile';
  }
  if (trimmed.startsWith('<mxGraphModel')) {
    return 'xml';
  }
  if (trimmed.startsWith('<?xml')) {
    // Could be either svg or mxGraphModel wrapped in <?xml?>
    if (trimmed.includes('<mxfile')) {
      return 'mxfile';
    }
    if (trimmed.includes('<mxGraphModel')) {
      return 'xml';
    }
    return 'xml';
  }
  // If it doesn't start with '<', it's likely compressed base64
  if (!trimmed.startsWith('<') && /^[A-Za-z0-9+/\s]+=*$/.test(trimmed)) {
    return 'compressed';
  }
  return 'unknown';
}

/**
 * Build the Draw.io embed editor URL
 */
export function buildEditorUrl(
  baseUrl: string,
  theme: string
): string {
  const params = new URLSearchParams({
    embed: '1',
    spin: '1',
    modified: 'unsavedChanges',
    keepmodified: '1',
    noSaveBtn: '0',
    noExitBtn: '0',
    saveAndExit: '1',
    ui: theme,
    libraries: '1',
    dark: theme === 'dark' ? '1' : '0',
  });
  return `${baseUrl}?${params.toString()}`;
}
