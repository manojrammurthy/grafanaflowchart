/**
 * MetricProcessor — converts Grafana DataFrames into ProcessedMetric objects
 */

import { DataFrame, FieldType } from '@grafana/data';
import { ProcessedMetric } from '../types/metric';
import { AggregationType } from '../types/constants';
import { matchPattern } from '../utils/patterns';

/**
 * Process all DataFrames into ProcessedMetric objects.
 * Handles time_series, table, and wide-format CSV data.
 */
export function processDataFrames(
  frames: DataFrame[],
  aggregation: AggregationType = 'current'
): ProcessedMetric[] {
  const metrics: ProcessedMetric[] = [];

  for (const frame of frames) {
    const timeField = frame.fields.find((f) => f.type === FieldType.time);
    const timestamps = timeField
      ? (timeField.values as unknown as number[])
      : [];

    // Check if this looks like a table with a "metric" column (pivoted time series)
    const metricField = frame.fields.find(
      (f) => f.name === 'metric' || f.name === 'Metric'
    );

    for (const field of frame.fields) {
      // Skip time fields
      if (field.type === FieldType.time) {
        continue;
      }

      // Skip fields that look like time/date strings
      const fieldNameClean = field.name.replace(/["\ufeff]/g, '').trim();
      if (fieldNameClean.toLowerCase() === 'time' || fieldNameClean.toLowerCase() === 'timestamp') {
        continue;
      }

      // Handle both number and string fields (CSV datasources return strings)
      let values: number[] = [];
      const raw = field.values as unknown as any[];

      if (field.type === FieldType.number) {
        for (let i = 0; i < raw.length; i++) {
          const v = raw[i];
          if (typeof v === 'number' && !isNaN(v)) {
            values.push(v);
          }
        }
      } else if (field.type === FieldType.string || field.type === FieldType.other) {
        // Try parsing string values as numbers (common with CSV datasources)
        for (let i = 0; i < raw.length; i++) {
          const v = raw[i];
          if (v === null || v === undefined || v === '') continue;
          const num = typeof v === 'number' ? v : parseFloat(String(v));
          if (!isNaN(num)) {
            values.push(num);
          }
        }
      }

      if (values.length === 0) {
        continue;
      }

      // For pivoted time series with "metric" column
      if (metricField) {
        const metricValues = metricField.values as unknown as string[];
        const grouped = groupByMetric(metricValues, raw, timestamps as number[]);

        for (const [metricName, data] of grouped) {
          const validValues = data.values.filter(v => typeof v === 'number' && !isNaN(v));
          if (validValues.length === 0) continue;

          metrics.push({
            name: metricName,
            refId: frame.refId || '',
            values: validValues,
            timestamps: data.timestamps,
            lastValue: validValues[validValues.length - 1],
            aggregatedValue: aggregateValues(validValues, aggregation),
            aggregation,
            fieldName: field.name || '',
            columnName: metricName,
          });
        }
      } else {
        // Wide-format: each column is a separate metric (e.g. MAC address columns)
        // The field name IS the metric/column identifier
        const name = fieldNameClean || frame.name || frame.refId || '';
        metrics.push({
          name,
          refId: frame.refId || '',
          values,
          timestamps: timestamps as number[],
          lastValue: values[values.length - 1],
          aggregatedValue: aggregateValues(values, aggregation),
          aggregation,
          fieldName: field.name || '',
          columnName: name,
        });
      }
    }
  }

  return metrics;
}

/**
 * Group values by metric column value (for pivoted time series)
 */
function groupByMetric(
  metricValues: string[],
  numericValues: any[],
  timestamps: number[]
): Map<string, { values: number[]; timestamps: number[] }> {
  const grouped = new Map<string, { values: number[]; timestamps: number[] }>();

  for (let i = 0; i < metricValues.length; i++) {
    const key = metricValues[i];
    if (!key) continue;

    let entry = grouped.get(key);
    if (!entry) {
      entry = { values: [], timestamps: [] };
      grouped.set(key, entry);
    }

    const num = typeof numericValues[i] === 'number'
      ? numericValues[i]
      : parseFloat(String(numericValues[i]));
    if (!isNaN(num)) {
      entry.values.push(num);
    }
    if (timestamps[i] !== undefined) {
      entry.timestamps.push(timestamps[i]);
    }
  }

  return grouped;
}

/**
 * Find metrics matching a pattern/alias, optionally filtering by column name
 */
export function findMatchingMetrics(
  metrics: ProcessedMetric[],
  alias: string,
  replaceVariables: (str: string) => string,
  column?: string
): ProcessedMetric[] {
  let filtered = metrics;

  // If column is specified, filter by column name first (exact match for MAC addresses etc.)
  if (column) {
    const resolvedColumn = replaceVariables(column);
    filtered = metrics.filter((m) => {
      if (m.columnName === resolvedColumn) return true;
      if (m.name === resolvedColumn) return true;
      return false;
    });

    // If we found column matches, return those
    if (filtered.length > 0) {
      return filtered;
    }
  }

  if (!alias) {
    return filtered;
  }
  const resolved = replaceVariables(alias);
  return filtered.filter((m) => {
    const { matched } = matchPattern(m.name, resolved);
    if (matched) {
      return true;
    }
    const { matched: refMatched } = matchPattern(m.refId, resolved);
    return refMatched;
  });
}

/**
 * Aggregate an array of numbers using the specified method
 */
export function aggregateValues(
  values: number[],
  type: AggregationType
): number {
  if (values.length === 0) {
    return 0;
  }

  switch (type) {
    case 'current':
    case 'last':
      return values[values.length - 1];
    case 'first':
      return values[0];
    case 'min':
      return Math.min(...values);
    case 'max':
      return Math.max(...values);
    case 'avg':
      return values.reduce((s, v) => s + v, 0) / values.length;
    case 'sum':
      return values.reduce((s, v) => s + v, 0);
    case 'count':
      return values.length;
    case 'delta':
    case 'diff':
      return values[values.length - 1] - values[0];
    case 'range':
      return Math.max(...values) - Math.min(...values);
    default:
      return values[values.length - 1];
  }
}
