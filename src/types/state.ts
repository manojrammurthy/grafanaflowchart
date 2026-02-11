/**
 * Cell state types — the computed result of rule evaluation applied to cells
 */

import { AnimationType, ThresholdLevel, LinkTarget } from './constants';

export interface CellState {
  cellId: string;
  ruleId: string;
  ruleName: string;
  level: ThresholdLevel;
  value: number | string;
  formattedValue: string;
  color: string;
  matched: boolean;
  timestamp: number;
  shape: ShapeState | null;
  text: TextState | null;
  link: LinkState | null;
  tooltip: TooltipCellState | null;
  event: EventCellState | null;
}

export interface ShapeState {
  fillColor: string | null;
  strokeColor: string | null;
  fontColor: string | null;
  bgColor: string | null;
  opacity: number | null;
  visible: boolean;
}

export interface TextState {
  value: string | null;
  originalValue: string | null;
}

export interface LinkState {
  url: string;
  target: LinkTarget;
  params: string;
}

export interface TooltipCellState {
  content: string;
  metricName: string;
  value: string;
}

export interface EventCellState {
  animation: AnimationType;
  duration: number;
  active: boolean;
}

export interface ZoomState {
  scale: number;
  x: number;
  y: number;
}

export interface PanelState {
  initialized: boolean;
  loading: boolean;
  error: string | null;
  inspectorMode: boolean;
  editorOpen: boolean;
}
