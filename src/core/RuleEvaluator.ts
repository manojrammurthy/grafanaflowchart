/**
 * RuleEvaluator — evaluates a single rule against metrics, producing a result
 */

import { ProcessedMetric } from '../types/metric';
import { RuleOptions } from '../types/options';
import { ThresholdLevel } from '../types/constants';
import { findMatchingMetrics, aggregateValues } from './MetricProcessor';
import { evaluateThreshold, evaluateGradientThreshold } from './ThresholdEvaluator';
import { formatValue } from '../utils/formatting';
import { applyValueMaps, applyRangeMaps } from '../utils/formatting';

export interface RuleResult {
  ruleId: string;
  ruleName: string;
  value: number;
  level: ThresholdLevel;
  color: string;
  formattedValue: string;
  matched: boolean;
  metricName: string;
}

/**
 * Evaluate a single rule against the available metrics
 */
export function evaluateRule(
  rule: RuleOptions,
  metrics: ProcessedMetric[],
  replaceVariables: (str: string) => string
): RuleResult | null {
  if (!rule.enabled) {
    return null;
  }

  // Find metrics matching this rule's alias/pattern, with optional column filtering
  const matched = findMatchingMetrics(
    metrics,
    rule.alias || rule.pattern,
    replaceVariables,
    rule.column || undefined
  );

  if (matched.length === 0) {
    return null;
  }

  // Collect all values from matched metrics and aggregate
  const allValues: number[] = [];
  for (const m of matched) {
    allValues.push(...m.values);
  }

  if (allValues.length === 0) {
    return null;
  }

  const value = aggregateValues(allValues, rule.aggregation);

  // Evaluate threshold — use gradient mode if configured
  let level: ThresholdLevel;
  let color: string;

  if (rule.gradient && rule.gradientColors.length > 0 && rule.gradientThresholds.length > 0) {
    const result = evaluateGradientThreshold(
      value,
      rule.gradientThresholds,
      rule.gradientColors,
      rule.invert
    );
    level = result.level;
    color = result.color;
  } else {
    const result = evaluateThreshold(
      value,
      rule.thresholds,
      rule.colors,
      rule.invert
    );
    level = result.level;
    color = result.color;
  }

  // Format value: first apply value/range maps, then fall back to unit formatting
  let formattedValue =
    applyValueMaps(value, rule.valueMaps) ??
    applyRangeMaps(value, rule.rangeMaps) ??
    formatValue(value, rule.unit, rule.decimals);

  return {
    ruleId: rule.id,
    ruleName: rule.name,
    value,
    level,
    color,
    formattedValue,
    matched: true,
    metricName: matched[0]?.name || '',
  };
}

/**
 * Evaluate all rules against all metrics
 */
export function evaluateAllRules(
  rules: RuleOptions[],
  metrics: ProcessedMetric[],
  replaceVariables: (str: string) => string
): RuleResult[] {
  const results: RuleResult[] = [];
  for (const rule of rules) {
    const result = evaluateRule(rule, metrics, replaceVariables);
    if (result) {
      results.push(result);
    }
  }
  return results;
}
