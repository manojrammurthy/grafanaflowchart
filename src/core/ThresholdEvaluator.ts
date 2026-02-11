/**
 * ThresholdEvaluator — evaluates a value against threshold definitions
 */

import { ThresholdLevel, ComparatorType, DEFAULT_COLORS } from '../types/constants';
import { ThresholdOptions, ThresholdColors } from '../types/options';

export interface ThresholdResult {
  level: ThresholdLevel;
  color: string;
}

/**
 * Evaluate a value against an array of thresholds.
 * Thresholds are checked from highest level (critical) to lowest (ok).
 * If `invert` is true, the level logic is reversed.
 */
export function evaluateThreshold(
  value: number | string,
  thresholds: ThresholdOptions[],
  colors: ThresholdColors,
  invert = false
): ThresholdResult {
  if (!thresholds || thresholds.length === 0) {
    return { level: 0, color: colors.ok };
  }

  // Sort by level descending (check critical first, then warning)
  const sorted = [...thresholds].sort((a, b) => b.level - a.level);

  for (const threshold of sorted) {
    if (compareValues(value, threshold.value, threshold.comparator)) {
      const level = invert ? invertLevel(threshold.level) : threshold.level;
      return { level, color: getColorForLevel(level, colors) };
    }
  }

  const defaultLevel: ThresholdLevel = invert ? 2 : 0;
  return { level: defaultLevel, color: getColorForLevel(defaultLevel, colors) };
}

/**
 * Evaluate a value against gradient thresholds with multiple colors.
 * Returns an interpolated color based on where the value falls between thresholds.
 *
 * thresholds: sorted ascending array of threshold values [24, 25, 26, ...]
 * colors: array of colors, one more than thresholds (colors.length = thresholds.length + 1)
 *         or same length (colors.length = thresholds.length)
 *
 * Segments:
 *   value <= thresholds[0]  → colors[0]
 *   thresholds[i] < value <= thresholds[i+1] → interpolate(colors[i], colors[i+1], progress)
 *   value > thresholds[last] → colors[last] (or last color)
 */
export function evaluateGradientThreshold(
  value: number,
  thresholds: number[],
  colors: string[],
  invert = false
): ThresholdResult {
  if (!thresholds || thresholds.length === 0 || !colors || colors.length === 0) {
    return { level: 0, color: colors?.[0] || DEFAULT_COLORS.ok };
  }

  // Sort thresholds ascending
  const sorted = [...thresholds].sort((a, b) => a - b);
  // Ensure we have the right number of colors
  const colorList = colors.length > 0 ? colors : [DEFAULT_COLORS.ok];

  // If value is at or below the first threshold
  if (value <= sorted[0]) {
    const color = invert ? colorList[colorList.length - 1] : colorList[0];
    return { level: 0, color };
  }

  // If value is above the last threshold
  if (value >= sorted[sorted.length - 1]) {
    const color = invert ? colorList[0] : colorList[colorList.length - 1];
    return { level: 2, color };
  }

  // Find the segment the value falls into
  for (let i = 0; i < sorted.length - 1; i++) {
    if (value >= sorted[i] && value <= sorted[i + 1]) {
      const range = sorted[i + 1] - sorted[i];
      const progress = range > 0 ? (value - sorted[i]) / range : 0;

      // Map segment index to color indices
      const colorIdx = invert ? colorList.length - 1 - i : i;
      const nextColorIdx = invert ? colorList.length - 2 - i : i + 1;

      const c1 = colorList[Math.max(0, Math.min(colorIdx, colorList.length - 1))];
      const c2 = colorList[Math.max(0, Math.min(nextColorIdx, colorList.length - 1))];

      const interpolated = interpolateColor(c1, c2, invert ? 1 - progress : progress);

      // Determine threshold level based on position in range
      const position = (value - sorted[0]) / (sorted[sorted.length - 1] - sorted[0]);
      const level: ThresholdLevel = position < 0.33 ? 0 : position < 0.66 ? 1 : 2;

      return { level, color: interpolated };
    }
  }

  return { level: 0, color: colorList[0] };
}

/**
 * Interpolate between two hex colors
 */
function interpolateColor(color1: string, color2: string, t: number): string {
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);

  if (!rgb1 || !rgb2) {
    return t < 0.5 ? color1 : color2;
  }

  const r = Math.round(rgb1.r + (rgb2.r - rgb1.r) * t);
  const g = Math.round(rgb1.g + (rgb2.g - rgb1.g) * t);
  const b = Math.round(rgb1.b + (rgb2.b - rgb1.b) * t);

  return rgbToHex(r, g, b);
}

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const clean = hex.replace('#', '');
  if (clean.length === 3) {
    return {
      r: parseInt(clean[0] + clean[0], 16),
      g: parseInt(clean[1] + clean[1], 16),
      b: parseInt(clean[2] + clean[2], 16),
    };
  }
  if (clean.length === 6) {
    return {
      r: parseInt(clean.substring(0, 2), 16),
      g: parseInt(clean.substring(2, 4), 16),
      b: parseInt(clean.substring(4, 6), 16),
    };
  }
  return null;
}

function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (n: number) => Math.max(0, Math.min(255, n)).toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

/**
 * Compare two values using a comparator
 */
function compareValues(
  a: number | string,
  b: number | string,
  operator: ComparatorType
): boolean {
  const numA = typeof a === 'number' ? a : parseFloat(String(a));
  const numB = typeof b === 'number' ? b : parseFloat(String(b));

  if (!isNaN(numA) && !isNaN(numB)) {
    switch (operator) {
      case '>':
        return numA > numB;
      case '<':
        return numA < numB;
      case '>=':
        return numA >= numB;
      case '<=':
        return numA <= numB;
      case '==':
        return numA === numB;
      case '!=':
        return numA !== numB;
      default:
        return false;
    }
  }

  // String comparison
  const strA = String(a);
  const strB = String(b);
  switch (operator) {
    case '==':
      return strA === strB;
    case '!=':
      return strA !== strB;
    default:
      return false;
  }
}

/**
 * Get the color for a threshold level
 */
export function getColorForLevel(
  level: ThresholdLevel,
  colors: ThresholdColors = DEFAULT_COLORS
): string {
  switch (level) {
    case 0:
      return colors.ok;
    case 1:
      return colors.warning;
    case 2:
      return colors.critical;
    default:
      return colors.ok;
  }
}

/**
 * Invert threshold level: 0 <-> 2, 1 stays
 */
function invertLevel(level: ThresholdLevel): ThresholdLevel {
  switch (level) {
    case 0:
      return 2;
    case 2:
      return 0;
    default:
      return level;
  }
}

/**
 * Get the level name string
 */
export function getLevelName(level: ThresholdLevel): string {
  switch (level) {
    case 0:
      return 'OK';
    case 1:
      return 'Warning';
    case 2:
      return 'Critical';
    default:
      return 'Unknown';
  }
}
