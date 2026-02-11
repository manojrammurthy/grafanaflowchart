/**
 * useZoom — wheel zoom, mouse-drag pan, keyboard shortcuts
 */

import { useEffect, useCallback, useRef } from 'react';
import { MxGraph } from '../types/graph';
import { ZoomState } from '../types/state';
import { ZOOM_MIN, ZOOM_MAX } from '../types/constants';

interface UseZoomOptions {
  containerRef: React.RefObject<HTMLDivElement>;
  graph: MxGraph | null;
  enabled: boolean;
  enableWheel: boolean;
  enablePan: boolean;
  enableDoubleClick: boolean;
  onZoomChange?: (state: ZoomState) => void;
}

export function useZoom(options: UseZoomOptions): void {
  const {
    containerRef,
    graph,
    enabled,
    enableWheel,
    enablePan,
    enableDoubleClick,
    onZoomChange,
  } = options;

  const isPanning = useRef(false);
  const startX = useRef(0);
  const startY = useRef(0);
  const translateX = useRef(0);
  const translateY = useRef(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !graph || !enabled) {
      return;
    }

    const emitChange = () => {
      onZoomChange?.({
        scale: graph.view.scale,
        x: translateX.current,
        y: translateY.current,
      });
    };

    // Ctrl+wheel zoom
    const handleWheel = (e: WheelEvent) => {
      if (!enableWheel || !e.ctrlKey) {
        return;
      }
      e.preventDefault();
      const factor = e.deltaY > 0 ? 0.9 : 1.1;
      const newScale = Math.max(ZOOM_MIN, Math.min(ZOOM_MAX, graph.view.scale * factor));
      graph.view.setScale(newScale);
      emitChange();
    };

    // Pan: mouse down
    const handleMouseDown = (e: MouseEvent) => {
      if (!enablePan || e.button !== 0 || e.ctrlKey) {
        return;
      }
      isPanning.current = true;
      startX.current = e.clientX;
      startY.current = e.clientY;
      container.style.cursor = 'grabbing';
    };

    // Pan: mouse move
    const handleMouseMove = (e: MouseEvent) => {
      if (!isPanning.current) {
        return;
      }
      const dx = e.clientX - startX.current;
      const dy = e.clientY - startY.current;
      translateX.current += dx;
      translateY.current += dy;
      graph.view.setTranslate(translateX.current, translateY.current);
      startX.current = e.clientX;
      startY.current = e.clientY;
    };

    // Pan: mouse up
    const handleMouseUp = () => {
      if (isPanning.current) {
        isPanning.current = false;
        container.style.cursor = 'grab';
        emitChange();
      }
    };

    // Double-click: reset zoom
    const handleDblClick = (e: MouseEvent) => {
      if (!enableDoubleClick) {
        return;
      }
      e.preventDefault();
      graph.view.setScale(1);
      translateX.current = 0;
      translateY.current = 0;
      graph.view.setTranslate(0, 0);
      try {
        graph.center(true, true);
      } catch {
        // center may not be available
      }
      emitChange();
    };

    // ESC: reset zoom
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        graph.view.setScale(1);
        translateX.current = 0;
        translateY.current = 0;
        graph.view.setTranslate(0, 0);
        emitChange();
      }
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    container.addEventListener('mousedown', handleMouseDown);
    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseup', handleMouseUp);
    container.addEventListener('mouseleave', handleMouseUp);
    container.addEventListener('dblclick', handleDblClick);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      container.removeEventListener('wheel', handleWheel);
      container.removeEventListener('mousedown', handleMouseDown);
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseup', handleMouseUp);
      container.removeEventListener('mouseleave', handleMouseUp);
      container.removeEventListener('dblclick', handleDblClick);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [containerRef, graph, enabled, enableWheel, enablePan, enableDoubleClick, onZoomChange]);
}

/**
 * Programmatic zoom controls
 */
export function useZoomControl(graph: MxGraph | null) {
  const zoomIn = useCallback(() => {
    if (!graph) return;
    graph.view.setScale(Math.min(ZOOM_MAX, graph.view.scale * 1.2));
  }, [graph]);

  const zoomOut = useCallback(() => {
    if (!graph) return;
    graph.view.setScale(Math.max(ZOOM_MIN, graph.view.scale * 0.8));
  }, [graph]);

  const zoomToFit = useCallback(() => {
    if (!graph) return;
    graph.fit();
    graph.view.setScale(graph.view.scale * 0.9);
  }, [graph]);

  const resetZoom = useCallback(() => {
    if (!graph) return;
    graph.view.setScale(1);
    graph.view.setTranslate(0, 0);
    try {
      graph.center(true, true);
    } catch {
      // center may not exist
    }
  }, [graph]);

  return { zoomIn, zoomOut, zoomToFit, resetZoom };
}
