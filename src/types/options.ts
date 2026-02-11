/**
 * Panel options interfaces for the Flowcharting plugin
 */

import {
  AggregationType,
  AnimationType,
  ColorTarget,
  ComparatorType,
  EditorTheme,
  LinkTarget,
  MappingCondition,
  MetricType,
  SourceType,
  TextReplaceMode,
  ThresholdLevel,
  DEFAULT_COLORS,
  DEFAULT_EDITOR_URL,
} from './constants';

// ============================================================================
// Panel Options (top-level)
// ============================================================================

export interface FlowchartPanelOptions {
  flowcharts: FlowchartSourceOptions[];
  rules: RuleOptions[];
  zoom: ZoomOptions;
  tooltip: TooltipOptions;
  background: BackgroundOptions;
  editorUrl: string;
  editorTheme: EditorTheme;
  activeFlowchartIndex: number;
  // Flat source fields — Grafana builder API doesn't support array paths like flowcharts[0].content
  sourceType: SourceType;
  content: string;
  sourceUrl: string;
  sourceName: string;
}

// ============================================================================
// Flowchart Source
// ============================================================================

export interface FlowchartSourceOptions {
  name: string;
  type: SourceType;
  content: string;
  url: string;
  download: boolean;
  enabled: boolean;
}

// ============================================================================
// Zoom / Display
// ============================================================================

export interface ZoomOptions {
  scale: number;
  center: boolean;
  lock: boolean;
  enableWheel: boolean;
  enableDoubleClick: boolean;
  enablePan: boolean;
}

export interface TooltipOptions {
  enabled: boolean;
  showGraph: boolean;
  showValue: boolean;
  showMetric: boolean;
  showTimestamp: boolean;
  customTemplate: string;
}

export interface BackgroundOptions {
  color: string;
  transparent: boolean;
}

// ============================================================================
// Rules
// ============================================================================

export interface RuleOptions {
  id: string;
  name: string;
  enabled: boolean;
  order: number;
  // Metric matching
  metricType: MetricType;
  pattern: string; // metric name/alias regex
  alias: string;
  column: string; // column name for table metric matching (e.g. MAC address)
  aggregation: AggregationType;
  // Thresholds
  thresholds: ThresholdOptions[];
  invert: boolean;
  colors: ThresholdColors;
  // Gradient mode: multiple thresholds with multiple colors
  gradient: boolean;
  gradientColors: string[]; // array of colors for gradient mode
  gradientThresholds: number[]; // flat array of threshold values for gradient mode
  // Format
  unit: string;
  decimals: number;
  // Mappings
  shapeMaps: ShapeMapOptions[];
  textMaps: TextMapOptions[];
  linkMaps: LinkMapOptions[];
  eventMaps: EventMapOptions[];
  // Value/Range maps
  valueMaps: ValueMapOptions[];
  rangeMaps: RangeMapOptions[];
}

export interface ThresholdOptions {
  value: number;
  level: ThresholdLevel;
  comparator: ComparatorType;
}

export interface ThresholdColors {
  ok: string;
  warning: string;
  critical: string;
}

// ============================================================================
// Shape / Text / Link / Event Mappings
// ============================================================================

export interface ShapeMapOptions {
  pattern: string; // cell ID/label regex
  hidden: boolean;
  target: ColorTarget;
  when: MappingCondition;
  enabled: boolean;
}

export interface TextMapOptions {
  pattern: string;
  hidden: boolean;
  mode: TextReplaceMode;
  template: string; // e.g. "${_value} ${_unit}"
  when: MappingCondition;
  enabled: boolean;
}

export interface LinkMapOptions {
  pattern: string;
  hidden: boolean;
  url: string;
  linkTarget: LinkTarget;
  params: string;
  when: MappingCondition;
  enabled: boolean;
}

export interface EventMapOptions {
  pattern: string;
  hidden: boolean;
  animation: AnimationType;
  duration: number; // ms
  when: MappingCondition;
  enabled: boolean;
}

// ============================================================================
// Value / Range Maps
// ============================================================================

export interface ValueMapOptions {
  value: string;
  text: string;
  enabled: boolean;
}

export interface RangeMapOptions {
  from: number;
  to: number;
  text: string;
  enabled: boolean;
}

// ============================================================================
// Default Values
// ============================================================================

export const DEFAULT_FLOWCHART_SOURCE: FlowchartSourceOptions = {
  name: 'Default',
  type: 'xml',
  content: '',
  url: '',
  download: false,
  enabled: true,
};

export const DEFAULT_ZOOM: ZoomOptions = {
  scale: 1,
  center: true,
  lock: false,
  enableWheel: true,
  enableDoubleClick: true,
  enablePan: true,
};

export const DEFAULT_TOOLTIP: TooltipOptions = {
  enabled: true,
  showGraph: false,
  showValue: true,
  showMetric: true,
  showTimestamp: false,
  customTemplate: '',
};

export const DEFAULT_BACKGROUND: BackgroundOptions = {
  color: 'transparent',
  transparent: true,
};

export const DEFAULT_PANEL_OPTIONS: FlowchartPanelOptions = {
  flowcharts: [{ ...DEFAULT_FLOWCHART_SOURCE }],
  rules: [],
  zoom: { ...DEFAULT_ZOOM },
  tooltip: { ...DEFAULT_TOOLTIP },
  background: { ...DEFAULT_BACKGROUND },
  editorUrl: DEFAULT_EDITOR_URL,
  editorTheme: 'light',
  activeFlowchartIndex: 0,
  sourceType: 'xml',
  content: '',
  sourceUrl: '',
  sourceName: 'Default',
};

let _ruleCounter = 0;

export function createDefaultRule(): RuleOptions {
  _ruleCounter++;
  return {
    id: `rule-${Date.now()}-${_ruleCounter}`,
    name: `Rule ${_ruleCounter}`,
    enabled: true,
    order: 0,
    metricType: 'series',
    pattern: '.*',
    alias: '',
    column: '',
    aggregation: 'current',
    thresholds: [
      { value: 50, level: 1, comparator: '>=' },
      { value: 80, level: 2, comparator: '>=' },
    ],
    invert: false,
    colors: { ...DEFAULT_COLORS },
    gradient: false,
    gradientColors: [],
    gradientThresholds: [],
    unit: 'short',
    decimals: 2,
    shapeMaps: [{ pattern: '.*', hidden: false, target: 'fillColor', when: 'always', enabled: true }],
    textMaps: [],
    linkMaps: [],
    eventMaps: [],
    valueMaps: [],
    rangeMaps: [],
  };
}
