/**
 * useGraph — manages mxGraph lifecycle tied to React
 */

import { useRef, useEffect, useCallback, useState } from 'react';
import { XGraph } from '../graph/XGraph';
import { MxGraph } from '../types/graph';
import { log } from '../utils/logging';

interface UseGraphOptions {
  width: number;
  height: number;
  content: string;
  pageIndex?: number;
  background?: string;
  onError: (error: string) => void;
  onGraphReady?: (graph: MxGraph, cellIds: string[], cellLabels: Map<string, string>) => void;
}

interface UseGraphResult {
  containerRef: React.RefObject<HTMLDivElement>;
  graph: MxGraph | null;
  xgraph: XGraph;
  cellIds: string[];
  cellLabels: Map<string, string>;
  reload: () => void;
}

export function useGraph(options: UseGraphOptions): UseGraphResult {
  const containerRef = useRef<HTMLDivElement>(null);
  const xgraphRef = useRef<XGraph>(new XGraph());

  const [graph, setGraph] = useState<MxGraph | null>(null);
  const [cellIds, setCellIds] = useState<string[]>([]);
  const [cellLabels, setCellLabels] = useState<Map<string, string>>(new Map());

  const { width, height, content, pageIndex = 0, background, onError, onGraphReady } = options;

  // Store callbacks and dimensions in refs to avoid triggering effect re-runs
  const onErrorRef = useRef(onError);
  onErrorRef.current = onError;
  const onGraphReadyRef = useRef(onGraphReady);
  onGraphReadyRef.current = onGraphReady;
  const sizeRef = useRef({ width, height });
  sizeRef.current = { width, height };

  // Single effect with primitive deps only
  useEffect(() => {
    if (!containerRef.current) {
      return;
    }

    if (typeof (window as any).mxGraph === 'undefined') {
      onErrorRef.current('mxGraph library not loaded. Please refresh the page.');
      return;
    }

    xgraphRef.current.destroy();

    if (!content || !content.trim()) {
      setGraph(null);
      setCellIds([]);
      setCellLabels(new Map());
      return;
    }

    const { width: w, height: h } = sizeRef.current;

    try {
      const g = xgraphRef.current.init(containerRef.current, {
        width: w,
        height: h,
        background,
        readOnly: true,
      });

      xgraphRef.current.loadContent(content, pageIndex);
      xgraphRef.current.fit(w, h);

      const ids = xgraphRef.current.getCellIds();
      const labels = xgraphRef.current.getCellLabels();

      setGraph(g);
      setCellIds(ids);
      setCellLabels(labels);

      log.info(`Loaded ${ids.length} cells`);

      // Apply states immediately after graph creation — no cross-render dependency.
      // onGraphReady uses a ref, so it always has the latest rule results.
      if (onGraphReadyRef.current) {
        onGraphReadyRef.current(g, ids, labels);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      log.error('Graph init failed:', msg);
      onErrorRef.current(msg);
      setGraph(null);
    }

    return () => {
      xgraphRef.current.destroy();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content, pageIndex, background]);

  // Re-fit on resize
  useEffect(() => {
    if (graph) {
      xgraphRef.current.fit(width, height);
    }
  }, [width, height, graph]);

  const reload = useCallback(() => {
    xgraphRef.current.destroy();
    if (!containerRef.current || !content) {
      return;
    }
    const { width: w, height: h } = sizeRef.current;
    try {
      const g = xgraphRef.current.init(containerRef.current, {
        width: w, height: h, background, readOnly: true,
      });
      xgraphRef.current.loadContent(content, pageIndex);
      xgraphRef.current.fit(w, h);
      const ids = xgraphRef.current.getCellIds();
      const labels = xgraphRef.current.getCellLabels();
      setGraph(g);
      setCellIds(ids);
      setCellLabels(labels);
      if (onGraphReadyRef.current) {
        onGraphReadyRef.current(g, ids, labels);
      }
    } catch (err) {
      log.error('Reload failed:', err);
    }
  }, [content, pageIndex, background]);

  return {
    containerRef: containerRef as React.RefObject<HTMLDivElement>,
    graph,
    xgraph: xgraphRef.current,
    cellIds,
    cellLabels,
    reload,
  };
}
