/**
 * Migration utility: converts Angular agenty-flowcharting-panel options to React plugin format
 */

import {
  FlowchartPanelOptions,
  DEFAULT_PANEL_OPTIONS,
  RuleOptions,
  ShapeMapOptions,
  TextMapOptions,
  LinkMapOptions,
  EventMapOptions,
  ValueMapOptions,
  RangeMapOptions,
} from '../types/options';
import { MappingCondition, DEFAULT_COLORS } from '../types/constants';
import { log } from './logging';

export interface MigrationResult {
  success: boolean;
  options: FlowchartPanelOptions;
  warnings: string[];
}

/**
 * Detect if the panel is from the Angular agenty-flowcharting-panel plugin
 */
export function isAngularFlowchartingPanel(panel: any): boolean {
  return !!(
    panel.type === 'agenty-flowcharting-panel' ||
    panel.flowchartsData ||
    panel.rulesData
  );
}

/**
 * Migrate from Angular agenty-flowcharting-panel to React format.
 * Handles the full panel object (not just options).
 */
export function migrateAngularPanel(panel: any): MigrationResult {
  const warnings: string[] = [];
  const options: FlowchartPanelOptions = { ...DEFAULT_PANEL_OPTIONS };

  try {
    // Migrate flowchart source from flowchartsData
    const flowchartsData = panel.flowchartsData || panel.options?.flowchartsData;
    if (flowchartsData?.flowcharts?.[0]) {
      const fc = flowchartsData.flowcharts[0];
      options.content = fc.xml || fc.content || '';
      options.sourceType = fc.type || 'xml';
      options.sourceUrl = fc.url || '';
      options.sourceName = fc.name || 'Main';

      // Also populate flowcharts array
      options.flowcharts = [{
        name: fc.name || 'Main',
        type: fc.type || 'xml',
        content: fc.xml || fc.content || '',
        url: fc.url || '',
        download: fc.download ?? false,
        enabled: true,
      }];

      // Migrate display options from flowchart
      if (fc.zoom || fc.scale) {
        options.zoom = {
          ...options.zoom,
          center: fc.center ?? true,
          lock: fc.lock ?? false,
        };
      }
      if (fc.bgColor) {
        const transparent = fc.bgColor === '#00000000' || fc.bgColor === 'transparent';
        options.background = { color: fc.bgColor, transparent };
      }
      if (fc.editorUrl) {
        options.editorUrl = fc.editorUrl;
      }
      if (fc.editorTheme) {
        options.editorTheme = fc.editorTheme;
      }
    }

    // Migrate rules from rulesData
    const rulesData = panel.rulesData?.rulesData || panel.rulesData || panel.options?.rulesData?.rulesData;
    if (Array.isArray(rulesData)) {
      options.rules = rulesData.map((oldRule: any, idx: number) => {
        return migrateAngularRule(oldRule, idx, warnings);
      });
    }

    log.info('Migration completed successfully');
    return { success: true, options, warnings };
  } catch (err) {
    log.error('Migration failed:', err);
    warnings.push(`Migration error: ${err instanceof Error ? err.message : String(err)}`);
    return { success: false, options: { ...DEFAULT_PANEL_OPTIONS }, warnings };
  }
}

/**
 * Migrate a single Angular rule to React format
 */
function migrateAngularRule(oldRule: any, idx: number, warnings: string[]): RuleOptions {
  const id = `rule-migrated-${idx + 1}`;

  // Map "colorOn"/"textOn"/"linkOn" values to MappingCondition
  const mapCondition = (on: string): MappingCondition => {
    switch (on) {
      case 'a': return 'always';
      case 'wc': return 'critical';
      case 'ww': return 'warning';
      case 'wmd': return 'always'; // "when matched with data" → always (if rule matches)
      case 'n': return 'never';
      default: return 'always';
    }
  };

  // Migrate shape maps from shapeData[]
  const shapeMaps: ShapeMapOptions[] = (oldRule.shapeData || []).map((sd: any) => ({
    pattern: sd.pattern || '.*',
    hidden: sd.hidden ?? false,
    target: sd.style || 'fillColor',
    when: mapCondition(sd.colorOn || 'a'),
    enabled: true,
  }));

  // Migrate text maps from textData[]
  const textMaps: TextMapOptions[] = (oldRule.textData || []).map((td: any) => ({
    pattern: td.pattern || '.*',
    hidden: td.hidden ?? false,
    mode: td.textReplace || 'content',
    template: td.textPattern || '${_formattedValue}',
    when: mapCondition(td.textOn || 'a'),
    enabled: true,
  }));

  // Migrate link maps from linkData[]
  const linkMaps: LinkMapOptions[] = (oldRule.linkData || []).map((ld: any) => ({
    pattern: ld.pattern || '.*',
    hidden: ld.hidden ?? false,
    url: ld.linkUrl || ld.url || '',
    linkTarget: '_blank',
    params: ld.linkParams ? '' : '',
    when: mapCondition(ld.linkOn || 'a'),
    enabled: true,
  }));

  // Migrate event maps from eventData[]
  const eventMaps: EventMapOptions[] = (oldRule.eventData || []).map((ed: any) => ({
    pattern: ed.pattern || '.*',
    hidden: ed.hidden ?? false,
    animation: ed.animation || ed.type || 'blink',
    duration: ed.duration ?? 1000,
    when: mapCondition(ed.eventOn || 'a'),
    enabled: true,
  }));

  // Migrate value/range maps
  const valueMaps: ValueMapOptions[] = (oldRule.valueData || []).map((vd: any) => ({
    value: String(vd.value ?? ''),
    text: vd.text || '',
    enabled: true,
  }));

  const rangeMaps: RangeMapOptions[] = (oldRule.rangeData || []).map((rd: any) => ({
    from: rd.from ?? 0,
    to: rd.to ?? 0,
    text: rd.text || '',
    enabled: true,
  }));

  // Handle gradient mode: many thresholds + many colors
  const isGradient = oldRule.gradient === true;
  const oldColors: string[] = Array.isArray(oldRule.colors) ? oldRule.colors : [];
  const oldThresholds: number[] = Array.isArray(oldRule.thresholds)
    ? oldRule.thresholds.map(Number).filter((n: number) => !isNaN(n))
    : [];

  // Build standard 3-level thresholds as fallback
  let thresholds = [
    { value: 50, level: 1 as const, comparator: '>=' as const },
    { value: 80, level: 2 as const, comparator: '>=' as const },
  ];
  let colors: { ok: string; warning: string; critical: string } = {
    ok: DEFAULT_COLORS.ok,
    warning: DEFAULT_COLORS.warning,
    critical: DEFAULT_COLORS.critical,
  };

  if (!isGradient && oldThresholds.length >= 2) {
    // Standard mode: first two thresholds as warning/critical
    thresholds = [
      { value: oldThresholds[0], level: 1 as const, comparator: '>=' as const },
      { value: oldThresholds[1], level: 2 as const, comparator: '>=' as const },
    ];
  }

  if (!isGradient && oldColors.length >= 3) {
    colors = {
      ok: oldColors[0],
      warning: oldColors[1],
      critical: oldColors[2],
    };
  }

  return {
    id,
    name: oldRule.alias || oldRule.name || `Rule ${idx + 1}`,
    enabled: oldRule.hidden !== true,
    order: oldRule.order ?? idx + 1,
    metricType: oldRule.metricType || 'series',
    pattern: oldRule.pattern || '.*',
    alias: oldRule.alias || '',
    column: oldRule.column || '',
    aggregation: oldRule.aggregation || 'current',
    thresholds,
    invert: oldRule.invert ?? false,
    colors,
    gradient: isGradient,
    gradientColors: isGradient ? oldColors : [],
    gradientThresholds: isGradient ? oldThresholds : [],
    unit: oldRule.unit || 'short',
    decimals: oldRule.decimals ?? 2,
    shapeMaps,
    textMaps,
    linkMaps,
    eventMaps,
    valueMaps,
    rangeMaps,
  };
}

/**
 * Generic migration for simple options format changes (non-Angular)
 */
export function migrateOptions(oldOptions: any): MigrationResult {
  const warnings: string[] = [];
  const options: FlowchartPanelOptions = { ...DEFAULT_PANEL_OPTIONS };

  try {
    // Check if this has the Angular format nested inside options
    if (oldOptions.flowchartsData || oldOptions.rulesData) {
      return migrateAngularPanel(oldOptions);
    }

    // Migrate flowchart sources
    if (oldOptions.flowcharts && Array.isArray(oldOptions.flowcharts)) {
      options.flowcharts = oldOptions.flowcharts.map((fc: any) => ({
        name: fc.name || 'Migrated',
        type: fc.type || 'xml',
        content: fc.xml || fc.content || '',
        url: fc.url || '',
        download: fc.download ?? false,
        enabled: fc.enabled ?? true,
      }));
    }

    // Migrate flat content fields
    if (oldOptions.content) {
      options.content = oldOptions.content;
    }
    if (oldOptions.sourceType) {
      options.sourceType = oldOptions.sourceType;
    }

    // Migrate rules
    if (oldOptions.rules && Array.isArray(oldOptions.rules)) {
      options.rules = oldOptions.rules;
    }

    log.info('Migration completed successfully');
    return { success: true, options, warnings };
  } catch (err) {
    log.error('Migration failed:', err);
    warnings.push(`Migration error: ${err instanceof Error ? err.message : String(err)}`);
    return { success: false, options: { ...DEFAULT_PANEL_OPTIONS }, warnings };
  }
}
