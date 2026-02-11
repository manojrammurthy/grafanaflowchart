import 'lodash';
import 'marked';
import 'marked-mangle';
import { escapeHtml, hasAnsiCodes, sanitize, sanitizeTextPanelContent, sanitizeUrl, sanitizeSVGContent, sanitizeTrustedTypes, sanitizeTrustedTypesRSS } from './sanitize.js';

const textUtil = {
  escapeHtml,
  hasAnsiCodes,
  sanitize,
  sanitizeTextPanelContent,
  sanitizeUrl,
  sanitizeSVGContent,
  sanitizeTrustedTypes,
  sanitizeTrustedTypesRSS
};

export { textUtil };
//# sourceMappingURL=index.js.map
