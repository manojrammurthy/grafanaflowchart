/**
 * FlowchartContext — shared context for graph instance, states, and options
 */

import React, { createContext, useContext } from 'react';
import { DataFrame } from '@grafana/data';
import { MxGraph } from '../types/graph';
import { CellState, ZoomState } from '../types/state';
import { FlowchartPanelOptions } from '../types/options';

export interface FlowchartContextValue {
  graph: MxGraph | null;
  cellStates: Map<string, CellState>;
  zoomState: ZoomState;
  options: FlowchartPanelOptions;
  data: DataFrame[];
  replaceVariables: (str: string) => string;
}

const FlowchartContext = createContext<FlowchartContextValue>({
  graph: null,
  cellStates: new Map(),
  zoomState: { scale: 1, x: 0, y: 0 },
  options: {} as FlowchartPanelOptions,
  data: [],
  replaceVariables: (s) => s,
});

export const FlowchartProvider = FlowchartContext.Provider;

export function useFlowchartContext(): FlowchartContextValue {
  return useContext(FlowchartContext);
}
