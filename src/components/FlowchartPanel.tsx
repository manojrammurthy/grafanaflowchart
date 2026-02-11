/**
 * FlowchartPanel — main panel component, orchestrates all hooks and rendering
 */

import React, { useState, useCallback, useMemo, useRef } from 'react';
import { PanelProps } from '@grafana/data';
import { FlowchartPanelOptions, DEFAULT_PANEL_OPTIONS } from '../types/options';
import { ZoomState } from '../types/state';
import { MxGraph } from '../types/graph';
import { useGraph } from '../hooks/useGraph';
import { useRulesEngine } from '../hooks/useRulesEngine';
import { useStateManager } from '../hooks/useStateManager';
import { useFlowchartNavigation } from '../hooks/useFlowchartNavigation';
import { FlowchartProvider } from '../context/FlowchartContext';
import { FlowchartRenderer } from './FlowchartRenderer';
import { FlowchartTabs } from './FlowchartTabs';
import { InspectorOverlay } from './InspectorOverlay';
import { FlowchartErrorBoundary } from './ErrorBoundary';
import { computeCellStates } from '../core/StateComputer';
import { applyCellStates } from '../core/StateCycleApplier';
import { log } from '../utils/logging';
import { css } from '@emotion/css';

type Props = PanelProps<FlowchartPanelOptions>;

export const FlowchartPanel: React.FC<Props> = ({
  options,
  data,
  width,
  height,
  replaceVariables,
}) => {
  // Merge with defaults for safety
  const opts = useMemo(() => ({ ...DEFAULT_PANEL_OPTIONS, ...options }), [options]);

  // Build flowcharts array from flat options (Grafana builder API doesn't support array paths)
  const flowcharts = useMemo(() => {
    // If flat content field is set, use it to build the primary flowchart
    if (opts.content) {
      return [{
        name: opts.sourceName || 'Default',
        type: opts.sourceType || 'xml' as const,
        content: opts.content,
        url: opts.sourceUrl || '',
        download: false,
        enabled: true,
      }];
    }
    // Fall back to flowcharts array (for migration or multi-flowchart scenarios)
    if (opts.flowcharts?.length > 0 && opts.flowcharts[0].content) {
      return opts.flowcharts;
    }
    return [{ name: 'Default', type: 'xml' as const, content: '', url: '', download: false, enabled: true }];
  }, [opts.content, opts.sourceName, opts.sourceType, opts.sourceUrl, opts.flowcharts]);

  const [error, setError] = useState<string | null>(null);
  const [zoomState, setZoomState] = useState<ZoomState>({ scale: 1, x: 0, y: 0 });
  const [inspectorMode] = useState(false);

  // Multi-flowchart navigation
  const { activeIndex, activeFlowchart, navigate, hasMultiple } = useFlowchartNavigation(
    flowcharts
  );

  // Rules engine: process data → evaluate rules (pure computation, no effects)
  const { ruleResults, metrics } = useRulesEngine({
    data: data.series,
    rules: opts.rules,
    replaceVariables,
  });

  // Store rules and ruleResults in refs so onGraphReady always has the latest
  const rulesRef = useRef(opts.rules);
  rulesRef.current = opts.rules;
  const ruleResultsRef = useRef(ruleResults);
  ruleResultsRef.current = ruleResults;

  // Callback: apply states immediately after graph creation (same effect, no cross-render)
  const handleGraphReady = useCallback((graph: MxGraph, cellIds: string[], cellLabels: Map<string, string>) => {
    const rules = rulesRef.current;
    const results = ruleResultsRef.current;
    if (results.length === 0 || cellIds.length === 0) {
      log.info(`onGraphReady: no states to apply (results=${results.length}, cells=${cellIds.length})`);
      return;
    }
    const states = computeCellStates(rules, results, cellIds, cellLabels);
    if (states.size > 0) {
      log.info(`onGraphReady: applying ${states.size} states immediately`);
      applyCellStates(graph, states);
    }
  }, []);

  // Graph lifecycle
  const { containerRef, graph, xgraph, cellIds, cellLabels } = useGraph({
    width,
    height: hasMultiple ? height - 30 : height,
    content: activeFlowchart?.content || '',
    pageIndex: 0,
    background: opts.background.transparent ? 'transparent' : opts.background.color,
    onError: setError,
    onGraphReady: handleGraphReady,
  });

  // State manager: also applies states when rule results change (data refresh)
  const cellStates = useStateManager({
    graph,
    rules: opts.rules,
    ruleResults,
    cellIds,
    cellLabels,
  });

  const handleZoomChange = useCallback((state: ZoomState) => {
    setZoomState(state);
  }, []);

  // Empty state
  if (!activeFlowchart?.content) {
    return (
      <div className={styles.empty}>
        <h3>Flowcharting Panel</h3>
        <p>Paste your diagram in panel options</p>
        <div className={styles.formats}>
          <strong>Supported Formats:</strong>
          <br />
          <br />
          Draw.io XML (File &rarr; Export as &rarr; XML)
          <br />
          Compressed Draw.io XML
          <br />
          SVG content
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className={styles.error}>
        <h3>Error Rendering Diagram</h3>
        <p>{error}</p>
        <p className={styles.hint}>
          Troubleshooting:
          <br />
          1. Make sure you copied the complete XML from Draw.io
          <br />
          2. Use File &rarr; Export as &rarr; XML
          <br />
          3. Check browser console (F12) for details
        </p>
      </div>
    );
  }

  return (
    <FlowchartErrorBoundary>
      <FlowchartProvider
        value={{
          graph,
          cellStates,
          zoomState,
          options: opts,
          data: data.series,
          replaceVariables,
        }}
      >
        <div className={styles.panel} style={{ width, height }}>
          {hasMultiple && (
            <FlowchartTabs
              flowcharts={flowcharts}
              activeIndex={activeIndex}
              onSelect={navigate}
            />
          )}
          <FlowchartRenderer
            containerRef={containerRef}
            graph={graph}
            width={width}
            height={hasMultiple ? height - 30 : height}
            cellStates={cellStates}
            zoomOptions={opts.zoom}
            tooltipOptions={opts.tooltip}
            backgroundOptions={opts.background}
            inspectorMode={inspectorMode}
            data={data.series}
            replaceVariables={replaceVariables}
            onZoomChange={handleZoomChange}
          />
          {inspectorMode && (
            <InspectorOverlay
              cellStates={cellStates}
              cellLabels={cellLabels}
              cellIds={cellIds}
            />
          )}
        </div>
      </FlowchartProvider>
    </FlowchartErrorBoundary>
  );
};

const styles = {
  panel: css`
    display: flex;
    flex-direction: column;
    overflow: hidden;
  `,
  empty: css`
    padding: 20px;
    text-align: center;
    font-family: Arial, sans-serif;
    h3 {
      margin-bottom: 8px;
    }
  `,
  formats: css`
    background: #f0f0f0;
    padding: 15px;
    border-radius: 5px;
    text-align: left;
    max-width: 400px;
    margin: 12px auto 0;
    font-size: 13px;
  `,
  error: css`
    padding: 20px;
    color: #c62828;
    font-family: Arial, sans-serif;
    h3 {
      margin-bottom: 8px;
    }
  `,
  hint: css`
    font-size: 12px;
    color: #666;
    margin-top: 12px;
  `,
};
