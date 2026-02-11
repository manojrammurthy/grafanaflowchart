/**
 * useStateManager — orchestrates computing cell states and applying them to the graph
 */

import { useLayoutEffect, useMemo } from 'react';
import { MxGraph } from '../types/graph';
import { CellState } from '../types/state';
import { RuleOptions } from '../types/options';
import { RuleResult } from '../core/RuleEvaluator';
import { computeCellStates } from '../core/StateComputer';
import { applyCellStates } from '../core/StateCycleApplier';
import { applyAnimation, clearAllAnimations } from '../graph/CellAnimator';
import { log } from '../utils/logging';

interface UseStateManagerProps {
  graph: MxGraph | null;
  rules: RuleOptions[];
  ruleResults: RuleResult[];
  cellIds: string[];
  cellLabels: Map<string, string>;
}

export function useStateManager({
  graph,
  rules,
  ruleResults,
  cellIds,
  cellLabels,
}: UseStateManagerProps): Map<string, CellState> {
  const cellStates = useMemo(() => {
    if (ruleResults.length === 0 || cellIds.length === 0) {
      return new Map<string, CellState>();
    }
    return computeCellStates(rules, ruleResults, cellIds, cellLabels);
  }, [rules, ruleResults, cellIds, cellLabels]);

  // Apply states on every render — no dependency array, no ref guard.
  // Applying ~20 cell styles is cheap. This ensures states survive graph re-init.
  useLayoutEffect(() => {
    log.info(`useLayoutEffect EVERY: graph=${!!graph}, cellStates=${cellStates.size}, cellIds=${cellIds.length}, ruleResults=${ruleResults.length}`);
    if (!graph || cellStates.size === 0) {
      return;
    }

    try {
      applyCellStates(graph, cellStates);

      // Apply animations
      clearAllAnimations(graph);
      cellStates.forEach((state, cellId) => {
        if (state.event && state.event.active) {
          const cell = graph.getModel().cells[cellId];
          if (cell) {
            applyAnimation(graph, cell, state.event.animation, state.event.duration);
          }
        }
      });
    } catch (err) {
      log.error('useStateManager apply error:', err);
    }
  });

  return cellStates;
}
