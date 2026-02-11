/**
 * Pattern matching utilities — supports regex, wildcard, and exact matching
 */

import { MatchType } from '../types/constants';

export interface PatternResult {
  matched: boolean;
  matchType: MatchType;
}

/**
 * Parse a pattern string into a usable RegExp and metadata
 */
export function parsePattern(pattern: string): {
  regex: RegExp | null;
  isRegex: boolean;
  isWildcard: boolean;
} {
  if (!pattern) {
    return { regex: null, isRegex: false, isWildcard: false };
  }

  // Explicit regex: /pattern/ or /pattern/flags
  if (pattern.startsWith('/') && pattern.lastIndexOf('/') > 0) {
    const lastSlash = pattern.lastIndexOf('/');
    const body = pattern.slice(1, lastSlash);
    const flags = pattern.slice(lastSlash + 1);
    try {
      return { regex: new RegExp(body, flags), isRegex: true, isWildcard: false };
    } catch {
      return { regex: null, isRegex: false, isWildcard: false };
    }
  }

  // Wildcard: contains * or ?
  if (pattern.includes('*') || pattern.includes('?')) {
    const escaped = pattern
      .replace(/[.+^${}()|[\]\\]/g, '\\$&')
      .replace(/\*/g, '.*')
      .replace(/\?/g, '.');
    try {
      return { regex: new RegExp(`^${escaped}$`), isRegex: false, isWildcard: true };
    } catch {
      return { regex: null, isRegex: false, isWildcard: false };
    }
  }

  // Implicit regex: contains regex-special chars (not wildcards)
  if (/[.+^${}()|[\]\\]/.test(pattern)) {
    try {
      return { regex: new RegExp(pattern), isRegex: true, isWildcard: false };
    } catch {
      return { regex: null, isRegex: false, isWildcard: false };
    }
  }

  return { regex: null, isRegex: false, isWildcard: false };
}

/**
 * Test whether `text` matches `pattern`
 */
export function matchPattern(text: string, pattern: string): PatternResult {
  if (!text || !pattern) {
    return { matched: false, matchType: 'exact' };
  }

  const { regex, isRegex, isWildcard } = parsePattern(pattern);

  if (regex) {
    return {
      matched: regex.test(text),
      matchType: isRegex ? 'regex' : 'wildcard',
    };
  }

  // Exact match
  return { matched: text === pattern, matchType: 'exact' };
}

/**
 * Test pattern against multiple identifiers (id, value, label)
 */
export function matchAny(
  identifiers: string[],
  pattern: string
): PatternResult {
  for (const id of identifiers) {
    const result = matchPattern(id, pattern);
    if (result.matched) {
      return result;
    }
  }
  return { matched: false, matchType: 'exact' };
}
