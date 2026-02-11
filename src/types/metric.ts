/**
 * Metric data types for processing DataFrames
 */

import { AggregationType } from './constants';

export interface ProcessedMetric {
  name: string;
  refId: string;
  values: number[];
  timestamps: number[];
  lastValue: number;
  aggregatedValue: number;
  aggregation: AggregationType;
  fieldName: string;
  columnName: string; // column value for table metric matching (e.g. MAC address)
}

export interface MetricMatch {
  metric: ProcessedMetric;
  pattern: string;
  matched: boolean;
}
