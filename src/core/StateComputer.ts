/**
 * StateComputer — computes per-cell states from rule results and cell patterns
 */

import { CellState, ShapeState, TextState, LinkState, EventCellState } from '../types/state';
import { RuleOptions, ShapeMapOptions, TextMapOptions, LinkMapOptions, EventMapOptions } from '../types/options';
import { MappingCondition, ThresholdLevel } from '../types/constants';
import { RuleResult } from './RuleEvaluator';
import { matchPattern } from '../utils/patterns';
import { replaceCustomVariables, createVariableContext } from '../utils/variables';
import { log } from '../utils/logging';

/**
 * Given evaluated rule results and the list of cell IDs in the graph,
 * compute a Map<cellId, CellState> for all affected cells.
 */
export function computeCellStates(
  rules: RuleOptions[],
  ruleResults: RuleResult[],
  cellIds: string[],
  cellLabels: Map<string, string>
): Map<string, CellState> {
  const stateMap = new Map<string, CellState>();

  // Build a lookup from rule ID to result
  const resultByRuleId = new Map<string, RuleResult>();
  for (const r of ruleResults) {
    resultByRuleId.set(r.ruleId, r);
  }

  log.info(`StateComputer: ${rules.length} rules, ${ruleResults.length} results, ${cellIds.length} cells`);

  // Process rules in order; later rules override earlier ones
  for (const rule of rules) {
    if (!rule.enabled) {
      continue;
    }
    const lookupResult = resultByRuleId.get(rule.id);
    let result: RuleResult;
    if (lookupResult) {
      result = lookupResult;
    } else {
      // No metric data matched this rule. Still process mappings with when:"always"
      // (e.g., link buttons that should always be clickable regardless of data).
      const hasAlwaysMaps = rule.linkMaps.some(m => m.enabled && m.when === 'always') ||
        rule.shapeMaps.some(m => m.enabled && m.when === 'always') ||
        rule.textMaps.some(m => m.enabled && m.when === 'always') ||
        rule.eventMaps.some(m => m.enabled && m.when === 'always');
      if (!hasAlwaysMaps) {
        log.info(`StateComputer: rule "${rule.name}" (${rule.id}) — no result found`);
        continue;
      }
      // Create a default result so "always" mappings can be processed
      result = {
        ruleId: rule.id,
        ruleName: rule.name,
        metricName: '',
        value: 0,
        formattedValue: '',
        level: 0,
        color: rule.colors.ok || '#73BF69',
        matched: false,
      };
      log.info(`StateComputer: rule "${rule.name}" — no metric data, processing "always" mappings`);
    }

    // For each mapping type, find matching cells
    const prevSize = stateMap.size;
    processShapeMaps(rule, result, cellIds, cellLabels, stateMap);
    processTextMaps(rule, result, cellIds, cellLabels, stateMap);
    processLinkMaps(rule, result, cellIds, cellLabels, stateMap);
    processEventMaps(rule, result, cellIds, cellLabels, stateMap);
    const newStates = stateMap.size - prevSize;
    if (newStates > 0 || rule.shapeMaps.length > 0) {
      log.info(`StateComputer: rule "${rule.name}" color=${result.color} → ${newStates} new cell states (total ${stateMap.size}), shapeMaps=${rule.shapeMaps.length}`);
    }
  }

  log.info(`StateComputer: final state map has ${stateMap.size} entries`);
  return stateMap;
}

function shouldApply(when: MappingCondition, level: ThresholdLevel): boolean {
  switch (when) {
    case 'always':
      return true;
    case 'ok':
      return level === 0;
    case 'warning':
      return level === 1;
    case 'critical':
      return level === 2;
    case 'never':
      return false;
    default:
      return true;
  }
}

function getOrCreateState(
  cellId: string,
  result: RuleResult,
  stateMap: Map<string, CellState>
): CellState {
  const existing = stateMap.get(cellId);
  if (existing) {
    // Update with latest rule result
    existing.ruleId = result.ruleId;
    existing.ruleName = result.ruleName;
    existing.level = result.level;
    existing.value = result.value;
    existing.formattedValue = result.formattedValue;
    existing.color = result.color;
    existing.matched = true;
    existing.timestamp = Date.now();
    return existing;
  }

  const state: CellState = {
    cellId,
    ruleId: result.ruleId,
    ruleName: result.ruleName,
    level: result.level,
    value: result.value,
    formattedValue: result.formattedValue,
    color: result.color,
    matched: true,
    timestamp: Date.now(),
    shape: null,
    text: null,
    link: null,
    tooltip: {
      content: '',
      metricName: result.metricName,
      value: result.formattedValue,
    },
    event: null,
  };
  stateMap.set(cellId, state);
  return state;
}

function matchCells(
  pattern: string,
  cellIds: string[],
  cellLabels: Map<string, string>
): string[] {
  const matched: string[] = [];
  for (const id of cellIds) {
    const label = cellLabels.get(id) || '';
    const identifiers = [id, label].filter(Boolean);
    for (const ident of identifiers) {
      const { matched: m } = matchPattern(ident, pattern);
      if (m) {
        matched.push(id);
        break;
      }
    }
  }
  if (matched.length === 0 && pattern !== '.*') {
    log.info(`matchCells: pattern "${pattern}" matched 0 cells (first 5 IDs: ${cellIds.slice(0, 5).join(', ')})`);
  }
  return matched;
}

function processShapeMaps(
  rule: RuleOptions,
  result: RuleResult,
  cellIds: string[],
  cellLabels: Map<string, string>,
  stateMap: Map<string, CellState>
): void {
  for (const sm of rule.shapeMaps) {
    if (!sm.enabled || !shouldApply(sm.when, result.level)) {
      continue;
    }
    const ids = matchCells(sm.pattern, cellIds, cellLabels);
    for (const cellId of ids) {
      const state = getOrCreateState(cellId, result, stateMap);
      if (!state.shape) {
        state.shape = {
          fillColor: null,
          strokeColor: null,
          fontColor: null,
          bgColor: null,
          opacity: null,
          visible: !sm.hidden,
        };
      }
      // Apply color to the appropriate target
      switch (sm.target) {
        case 'fillColor':
          state.shape.fillColor = result.color;
          break;
        case 'strokeColor':
          state.shape.strokeColor = result.color;
          break;
        case 'fontColor':
          state.shape.fontColor = result.color;
          break;
        case 'bgColor':
          state.shape.bgColor = result.color;
          break;
        case 'gradientColor':
          // Gradient uses the color for fill
          state.shape.fillColor = result.color;
          break;
      }
      state.shape.visible = !sm.hidden;
    }
  }
}

function processTextMaps(
  rule: RuleOptions,
  result: RuleResult,
  cellIds: string[],
  cellLabels: Map<string, string>,
  stateMap: Map<string, CellState>
): void {
  for (const tm of rule.textMaps) {
    if (!tm.enabled || !shouldApply(tm.when, result.level)) {
      continue;
    }
    const ids = matchCells(tm.pattern, cellIds, cellLabels);
    for (const cellId of ids) {
      const state = getOrCreateState(cellId, result, stateMap);
      const template = tm.template || '${_formattedValue}';
      const originalText = cellLabels.get(cellId) || '';

      let resolved: string;
      // If template starts with a regex like /.*/ or /.*/suffix, do regex replacement
      // on the original cell text with the formatted value
      // Supports: /.*/  /pattern/flags  /.*/EB032 (regex + trailing text)
      const regexMatch = template.match(/^\/(.+?)\/([gimsuy]*)(.*)?$/);
      if (regexMatch) {
        try {
          const re = new RegExp(regexMatch[1], regexMatch[2]);
          const suffix = regexMatch[3] || '';
          resolved = originalText.replace(re, result.formattedValue + suffix);
        } catch {
          resolved = result.formattedValue;
        }
      } else {
        // Template with variables like ${_formattedValue}
        const ctx = createVariableContext(state);
        resolved = replaceCustomVariables(template, ctx);
      }

      state.text = {
        value: resolved,
        originalValue: originalText || null,
      };
    }
  }
}

function processLinkMaps(
  rule: RuleOptions,
  result: RuleResult,
  cellIds: string[],
  cellLabels: Map<string, string>,
  stateMap: Map<string, CellState>
): void {
  for (const lm of rule.linkMaps) {
    if (!lm.enabled || !shouldApply(lm.when, result.level)) {
      continue;
    }
    const ids = matchCells(lm.pattern, cellIds, cellLabels);
    for (const cellId of ids) {
      const state = getOrCreateState(cellId, result, stateMap);
      state.link = {
        url: lm.url,
        target: lm.linkTarget,
        params: lm.params,
      };
    }
  }
}

function processEventMaps(
  rule: RuleOptions,
  result: RuleResult,
  cellIds: string[],
  cellLabels: Map<string, string>,
  stateMap: Map<string, CellState>
): void {
  for (const em of rule.eventMaps) {
    if (!em.enabled || !shouldApply(em.when, result.level)) {
      continue;
    }
    const ids = matchCells(em.pattern, cellIds, cellLabels);
    for (const cellId of ids) {
      const state = getOrCreateState(cellId, result, stateMap);
      state.event = {
        animation: em.animation,
        duration: em.duration,
        active: true,
      };
    }
  }
}
