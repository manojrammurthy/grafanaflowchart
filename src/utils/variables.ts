/**
 * Template variable resolution utilities
 */

import { CellState } from '../types/state';

export interface VariableContext {
  __from?: string;
  __to?: string;
  __interval?: string;
  __interval_ms?: string;
  _value?: any;
  _label?: string;
  _alias?: string;
  _rule?: string;
  _level?: number;
  _color?: string;
  _formattedValue?: string;
  [key: string]: any;
}

/**
 * Replace custom flowcharting variables in text
 * Supports both ${var} and $var syntax
 */
export function replaceCustomVariables(
  text: string,
  vars: VariableContext
): string {
  let result = text;
  for (const [key, value] of Object.entries(vars)) {
    if (value === undefined || value === null) {
      continue;
    }
    const formatted = formatVariableValue(value);
    result = result.replace(new RegExp(`\\$\\{${key}\\}`, 'g'), formatted);
    result = result.replace(new RegExp(`\\$${key}\\b`, 'g'), formatted);
  }
  return result;
}

/**
 * Create a variable context from a CellState
 */
export function createVariableContext(
  state: CellState,
  additional?: Record<string, any>
): VariableContext {
  return {
    _value: state.value,
    _label: state.cellId,
    _alias: state.ruleName,
    _rule: state.ruleName,
    _level: state.level,
    _color: state.color,
    _formattedValue: state.formattedValue || String(state.value),
    ...additional,
  };
}

/**
 * Resolve a template expression with variables
 */
export function resolveExpression(
  expression: string,
  context: VariableContext
): string {
  return replaceCustomVariables(expression, context);
}

/**
 * Resolve link URL with state variables and Grafana replaceVariables
 */
export function resolveLinkVariables(
  url: string,
  state: CellState,
  replaceVariables: (str: string) => string,
  additional?: Record<string, any>
): string {
  const context = createVariableContext(state, additional);
  let resolved = replaceVariables(url);
  resolved = replaceCustomVariables(resolved, context);
  return resolved;
}

/**
 * Format a variable value to string for display
 */
function formatVariableValue(value: any): string {
  if (typeof value === 'number') {
    return value % 1 === 0 ? String(value) : value.toFixed(2);
  }
  if (typeof value === 'boolean') {
    return value ? 'true' : 'false';
  }
  if (value instanceof Date) {
    return value.toISOString();
  }
  if (Array.isArray(value)) {
    return value.join(', ');
  }
  if (typeof value === 'object') {
    return JSON.stringify(value);
  }
  return String(value);
}

/**
 * Extract variable names from a template string
 */
export function extractVariables(text: string): string[] {
  const vars: string[] = [];
  for (const m of text.matchAll(/\$\{([^}]+)\}/g)) {
    if (!vars.includes(m[1])) {
      vars.push(m[1]);
    }
  }
  for (const m of text.matchAll(/\$([a-zA-Z_][a-zA-Z0-9_]*)/g)) {
    if (!vars.includes(m[1])) {
      vars.push(m[1]);
    }
  }
  return vars;
}

/**
 * Format a value with unit
 */
export function formatValueWithUnit(
  value: number,
  unit?: string,
  decimals = 2
): string {
  const formatted = value.toFixed(decimals);
  if (!unit || unit === 'none' || unit === 'short') {
    return formatShort(value, decimals);
  }
  switch (unit) {
    case 'percent':
    case 'percentunit':
      return `${formatted}%`;
    case 'bytes':
      return formatBytes(value);
    case 'ms':
      return `${formatted}ms`;
    case 's':
      return `${formatted}s`;
    default:
      return `${formatted} ${unit}`;
  }
}

function formatBytes(bytes: number): string {
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let value = bytes;
  let i = 0;
  while (value >= 1024 && i < units.length - 1) {
    value /= 1024;
    i++;
  }
  return `${value.toFixed(2)} ${units[i]}`;
}

function formatShort(value: number, decimals = 2): string {
  const abs = Math.abs(value);
  if (abs >= 1e9) {
    return `${(value / 1e9).toFixed(decimals)}B`;
  }
  if (abs >= 1e6) {
    return `${(value / 1e6).toFixed(decimals)}M`;
  }
  if (abs >= 1e3) {
    return `${(value / 1e3).toFixed(decimals)}K`;
  }
  return value.toFixed(decimals);
}
