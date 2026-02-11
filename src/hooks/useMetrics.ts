/**
 * useMetrics — processes DataFrames into ProcessedMetric objects
 */

import { useMemo } from 'react';
import { DataFrame } from '@grafana/data';
import { ProcessedMetric } from '../types/metric';
import { AggregationType } from '../types/constants';
import { processDataFrames } from '../core/MetricProcessor';

export function useMetrics(
  data: DataFrame[],
  aggregation: AggregationType = 'current'
): ProcessedMetric[] {
  return useMemo(
    () => processDataFrames(data, aggregation),
    [data, aggregation]
  );
}
