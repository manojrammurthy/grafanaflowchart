/**
 * useRulesEngine — evaluates all rules against metrics and produces RuleResults
 */

import { useMemo } from 'react';
import { DataFrame } from '@grafana/data';
import { RuleOptions } from '../types/options';
import { ProcessedMetric } from '../types/metric';
import { RuleResult, evaluateAllRules } from '../core/RuleEvaluator';
import { processDataFrames } from '../core/MetricProcessor';

interface UseRulesEngineProps {
  data: DataFrame[];
  rules: RuleOptions[];
  replaceVariables: (str: string) => string;
}

interface UseRulesEngineResult {
  ruleResults: RuleResult[];
  metrics: ProcessedMetric[];
}

export function useRulesEngine({
  data,
  rules,
  replaceVariables,
}: UseRulesEngineProps): UseRulesEngineResult {
  const metrics = useMemo(
    () => processDataFrames(data, 'current'),
    [data]
  );

  const ruleResults = useMemo(() => {
    if (metrics.length === 0 || rules.length === 0) {
      return [];
    }
    return evaluateAllRules(rules, metrics, replaceVariables);
  }, [metrics, rules, replaceVariables]);

  return { ruleResults, metrics };
}
