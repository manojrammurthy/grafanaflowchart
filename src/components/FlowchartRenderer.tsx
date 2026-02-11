/**
 * FlowchartRenderer — mxGraph rendering surface with interaction handlers
 */

import React, { useEffect, useRef, useCallback } from 'react';
import { css } from '@emotion/css';
import { GrafanaTheme2, DataFrame } from '@grafana/data';
import { useTheme2 } from '@grafana/ui';
import { MxGraph, MxGraphCell } from '../types/graph';
import { CellState, ZoomState } from '../types/state';
import { BackgroundOptions, TooltipOptions } from '../types/options';
import { useZoom } from '../hooks/useZoom';
import { useTooltip, TooltipData } from '../hooks/useTooltip';
import { useClickHandler } from '../hooks/useClickHandler';
import { FlowchartTooltip } from './FlowchartTooltip';
import { log } from '../utils/logging';

interface FlowchartRendererProps {
  containerRef: React.RefObject<HTMLDivElement>;
  graph: MxGraph | null;
  width: number;
  height: number;
  cellStates: Map<string, CellState>;
  zoomOptions: {
    enableWheel: boolean;
    enablePan: boolean;
    enableDoubleClick: boolean;
    lock: boolean;
  };
  tooltipOptions: TooltipOptions;
  backgroundOptions: BackgroundOptions;
  inspectorMode: boolean;
  data: DataFrame[];
  replaceVariables: (str: string) => string;
  onZoomChange?: (state: ZoomState) => void;
}

export const FlowchartRenderer: React.FC<FlowchartRendererProps> = ({
  containerRef,
  graph,
  width,
  height,
  cellStates,
  zoomOptions,
  tooltipOptions,
  backgroundOptions,
  inspectorMode,
  data,
  replaceVariables,
  onZoomChange,
}) => {
  const theme = useTheme2();
  const { tooltip, showTooltip, hideTooltip } = useTooltip();
  const { handleClick } = useClickHandler({ replaceVariables, cellStates });
  const currentCellRef = useRef<MxGraphCell | null>(null);

  // Zoom handling
  useZoom({
    containerRef,
    graph,
    enabled: !zoomOptions.lock,
    enableWheel: zoomOptions.enableWheel,
    enablePan: zoomOptions.enablePan,
    enableDoubleClick: zoomOptions.enableDoubleClick,
    onZoomChange,
  });

  // Mouse interaction handlers for tooltip and click
  useEffect(() => {
    const container = containerRef.current;
    if (!container || !graph) {
      return;
    }

    // Use clientX/clientY relative to container rect (not offsetX/offsetY which
    // is relative to event target — can be SVG child, not the container div)
    const getContainerCoords = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      return { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };

    const handleMouseMove = (e: MouseEvent) => {
      const { x, y } = getContainerCoords(e);
      const cell = getCellAtPoint(graph, x, y);
      if (cell !== currentCellRef.current) {
        if (currentCellRef.current) {
          hideTooltip();
        }
        if (cell) {
          const state = cellStates.get(cell.id);
          if (state && tooltipOptions.enabled) {
            showTooltip(cell, state, {
              x: e.clientX + 10,
              y: e.clientY + 10,
            });
          }
          // Set cursor for clickable cells
          if (state?.link) {
            container.style.cursor = 'pointer';
          } else {
            container.style.cursor = zoomOptions.enablePan ? 'grab' : 'default';
          }
        } else {
          container.style.cursor = zoomOptions.enablePan ? 'grab' : 'default';
        }
        currentCellRef.current = cell;
      }
    };

    const handleMouseLeave = () => {
      hideTooltip();
      currentCellRef.current = null;
    };

    const handleMouseClick = (e: MouseEvent) => {
      const { x, y } = getContainerCoords(e);
      const cell = getCellAtPoint(graph, x, y);
      if (cell) {
        const state = cellStates.get(cell.id);
        log.info(`Click on cell ${cell.id}: hasLink=${!!state?.link}, link=${state?.link?.url || 'none'}`);
        handleClick(cell, e);
      }
    };

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseleave', handleMouseLeave);
    // Use capture phase for click — mxGraph consumes click events in bubble phase
    container.addEventListener('click', handleMouseClick, true);

    // Also register with mxGraph's event system as fallback
    const g = graph as any;
    const mxEvent = (window as any).mxEvent;
    let mxClickHandler: any = null;
    if (mxEvent && typeof g.addListener === 'function') {
      mxClickHandler = (sender: any, evt: any) => {
        const cell = evt.getProperty('cell');
        const mouseEvt = evt.getProperty('event');
        if (cell && mouseEvt) {
          const state = cellStates.get(cell.id);
          if (state?.link) {
            log.info(`mxGraph click on cell ${cell.id}: link=${state.link.url}`);
            handleClick(cell, mouseEvt);
          }
        }
      };
      g.addListener(mxEvent.CLICK, mxClickHandler);
    }

    return () => {
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseleave', handleMouseLeave);
      container.removeEventListener('click', handleMouseClick, true);
      if (mxEvent && mxClickHandler && typeof g.removeListener === 'function') {
        g.removeListener(mxClickHandler);
      }
    };
  }, [graph, cellStates, tooltipOptions.enabled, zoomOptions.enablePan, showTooltip, hideTooltip, handleClick, containerRef]);

  const styles = getStyles(theme, backgroundOptions);

  return (
    <div className={styles.wrapper} style={{ width, height }}>
      <div
        ref={containerRef}
        className={styles.graphContainer}
        style={{ width, height }}
      />
      {tooltip && (
        <FlowchartTooltip
          tooltip={tooltip}
          options={tooltipOptions}
          data={data}
        />
      )}
    </div>
  );
};

/**
 * Get the mxGraph cell at a point using mxGraph's getCellAt if available
 */
function getCellAtPoint(
  graph: MxGraph,
  x: number,
  y: number
): MxGraphCell | null {
  try {
    const g = graph as any;
    if (typeof g.getCellAt === 'function') {
      const cell = g.getCellAt(x, y);
      if (cell && (cell.vertex || cell.edge)) {
        return cell;
      }
    }
  } catch {
    // Fallback: no cell
  }
  return null;
}

const getStyles = (theme: GrafanaTheme2, bg: BackgroundOptions) => ({
  wrapper: css`
    position: relative;
    overflow: hidden;
  `,
  graphContainer: css`
    overflow: hidden;
    background: ${bg.transparent ? 'transparent' : bg.color || theme.colors.background.primary};
    cursor: grab;
    &:active {
      cursor: grabbing;
    }
    & svg {
      display: block;
      overflow: hidden;
      max-width: 100%;
      max-height: 100%;
    }
    & > div {
      overflow: hidden !important;
    }
  `,
});
