/**
 * Constants for the Flowcharting plugin
 * Replaces the Angular GFCONSTANT pattern
 */

// Aggregation types
export const AGGREGATION_TYPES = [
  'current',
  'min',
  'max',
  'avg',
  'sum',
  'count',
  'delta',
  'diff',
  'range',
  'first',
  'last',
] as const;

export type AggregationType = (typeof AGGREGATION_TYPES)[number];

// Comparator types for threshold evaluation
export const COMPARATOR_TYPES = ['>', '<', '>=', '<=', '==', '!='] as const;
export type ComparatorType = (typeof COMPARATOR_TYPES)[number];

// Threshold levels: 0=OK, 1=Warning, 2=Critical
export type ThresholdLevel = 0 | 1 | 2;

// Mapping types
export const MAPPING_TYPES = [
  'color',
  'text',
  'link',
  'event',
  'visibility',
  'size',
  'opacity',
] as const;
export type MappingType = (typeof MAPPING_TYPES)[number];

// Mapping conditions
export const MAPPING_CONDITIONS = [
  'always',
  'ok',
  'warning',
  'critical',
  'never',
] as const;
export type MappingCondition = (typeof MAPPING_CONDITIONS)[number];

// Color mapping targets
export const COLOR_TARGETS = [
  'fillColor',
  'strokeColor',
  'fontColor',
  'bgColor',
  'gradientColor',
] as const;
export type ColorTarget = (typeof COLOR_TARGETS)[number];

// Text mapping targets
export const TEXT_TARGETS = ['label', 'tooltip'] as const;
export type TextTarget = (typeof TEXT_TARGETS)[number];

// Text replacement modes
export const TEXT_REPLACE_MODES = [
  'content',
  'pattern',
  'append',
  'prepend',
] as const;
export type TextReplaceMode = (typeof TEXT_REPLACE_MODES)[number];

// Animation types
export const ANIMATION_TYPES = [
  'blink',
  'fade',
  'pulse',
  'flow',
  'rotate',
] as const;
export type AnimationType = (typeof ANIMATION_TYPES)[number];

// Diagram source types
export const SOURCE_TYPES = ['xml', 'url', 'csv'] as const;
export type SourceType = (typeof SOURCE_TYPES)[number];

// Metric types
export const METRIC_TYPES = ['series', 'table'] as const;
export type MetricType = (typeof METRIC_TYPES)[number];

// Editor themes
export const EDITOR_THEMES = ['light', 'dark', 'kennedy', 'minimal'] as const;
export type EditorTheme = (typeof EDITOR_THEMES)[number];

// Link targets
export const LINK_TARGETS = ['_blank', '_self', '_top', '_parent'] as const;
export type LinkTarget = (typeof LINK_TARGETS)[number];

// Pattern match types
export const MATCH_TYPES = ['exact', 'regex', 'wildcard', 'value'] as const;
export type MatchType = (typeof MATCH_TYPES)[number];

// Default colors
export const DEFAULT_COLORS = {
  ok: '#73BF69',
  warning: '#FF9830',
  critical: '#F2495C',
  noData: '#999999',
  disabled: '#CCCCCC',
} as const;

// Default Draw.io editor URL
export const DEFAULT_EDITOR_URL = 'https://embed.diagrams.net';

// mxGraph CDN base path
export const MXGRAPH_BASE_PATH =
  'https://cdn.jsdelivr.net/npm/mxgraph@4.2.2/javascript/src';

// Zoom limits
export const ZOOM_MIN = 0.1;
export const ZOOM_MAX = 5;
export const ZOOM_STEP = 0.1;
export const ZOOM_WHEEL_FACTOR = 0.1;

// Tooltip defaults
export const TOOLTIP_DELAY_SHOW = 200;
export const TOOLTIP_DELAY_HIDE = 100;

// Log prefix
export const LOG_PREFIX = '[Flowcharting]';
