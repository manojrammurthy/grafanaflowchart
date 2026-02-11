/**
 * Value formatting utilities with Grafana unit support
 */

import { formatValueWithUnit } from './variables';

/**
 * Format a numeric value for display using configured unit and decimals
 */
export function formatValue(
  value: number | string | null | undefined,
  unit?: string,
  decimals?: number
): string {
  if (value === null || value === undefined) {
    return 'N/A';
  }
  if (typeof value === 'string') {
    return value;
  }
  if (isNaN(value)) {
    return 'NaN';
  }
  return formatValueWithUnit(value, unit, decimals);
}

/**
 * Apply value maps: if the numeric value matches a map entry, return its text
 */
export function applyValueMaps(
  value: number | string,
  maps: Array<{ value: string; text: string; enabled: boolean }>
): string | null {
  const strVal = String(value);
  for (const m of maps) {
    if (!m.enabled) {
      continue;
    }
    if (m.value === strVal) {
      return m.text;
    }
  }
  return null;
}

/**
 * Apply range maps: if the numeric value falls within a range, return its text
 */
export function applyRangeMaps(
  value: number,
  maps: Array<{ from: number; to: number; text: string; enabled: boolean }>
): string | null {
  for (const m of maps) {
    if (!m.enabled) {
      continue;
    }
    if (value >= m.from && value <= m.to) {
      return m.text;
    }
  }
  return null;
}
