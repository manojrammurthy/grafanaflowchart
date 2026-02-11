/**
 * FlowchartTooltip — tooltip overlay showing metric values and sparklines
 *
 * Uses ReactDOM.createPortal to render at document.body, escaping any ancestor
 * CSS transforms that would break position:fixed (Grafana's react-grid-item
 * uses transform: matrix(...) which creates a new containing block).
 */

import React, { useRef, useEffect, useLayoutEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { css } from '@emotion/css';
import { GrafanaTheme2, DataFrame } from '@grafana/data';
import { useTheme2 } from '@grafana/ui';
import { CellState } from '../types/state';
import { TooltipOptions } from '../types/options';
import { getLevelName } from '../core/ThresholdEvaluator';
import { TooltipData } from '../hooks/useTooltip';

interface FlowchartTooltipProps {
  tooltip: TooltipData;
  options: TooltipOptions;
  data?: DataFrame[];
}

export const FlowchartTooltip: React.FC<FlowchartTooltipProps> = ({
  tooltip,
  options,
  data,
}) => {
  const theme = useTheme2();
  const tooltipRef = useRef<HTMLDivElement>(null);
  const { state, position } = tooltip;
  const [adjustedPos, setAdjustedPos] = useState(position);

  // Reposition after mount/update to prevent overflow
  useLayoutEffect(() => {
    const el = tooltipRef.current;
    if (!el) {
      setAdjustedPos(position);
      return;
    }
    const rect = el.getBoundingClientRect();
    let x = position.x;
    let y = position.y;
    if (x + rect.width > window.innerWidth) {
      x = window.innerWidth - rect.width - 10;
    }
    if (x < 0) {
      x = 10;
    }
    if (y + rect.height > window.innerHeight) {
      y = position.y - rect.height - 10;
    }
    if (y < 0) {
      y = 10;
    }
    setAdjustedPos({ x, y });
  }, [position]);

  if (!options.enabled || !state) {
    return null;
  }

  const styles = getStyles(theme);

  const content = (
    <div
      ref={tooltipRef}
      className={styles.tooltip}
      style={{ left: adjustedPos.x, top: adjustedPos.y }}
    >
      {options.showMetric && (
        <div className={styles.metric}>
          <strong>{state.ruleName}</strong>
        </div>
      )}
      {options.showValue && (
        <div className={styles.value}>
          <span className={styles.valueLabel}>Value:</span>
          <span className={styles.valueNumber} style={{ color: state.color }}>
            {state.formattedValue || state.value}
          </span>
        </div>
      )}
      <div className={styles.level}>
        <span className={styles.levelDot} style={{ background: state.color }} />
        <span className={styles.levelText}>{getLevelName(state.level)}</span>
      </div>
      {options.showTimestamp && state.timestamp && (
        <div className={styles.timestamp}>
          {new Date(state.timestamp).toLocaleString()}
        </div>
      )}
      {options.showGraph && data && data.length > 0 && (
        <div className={styles.graph}>
          <MiniGraph data={data} color={state.color} theme={theme} />
        </div>
      )}
    </div>
  );

  // Portal to document.body so position:fixed works correctly
  return ReactDOM.createPortal(content, document.body);
};

const MiniGraph: React.FC<{
  data: DataFrame[];
  color: string;
  theme: GrafanaTheme2;
}> = ({ data, color, theme }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current || !data || data.length === 0) {
      return;
    }
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) {
      return;
    }

    // Find the first field with parseable numeric values (skip time/date fields)
    const values: number[] = [];
    outer:
    for (const frame of data) {
      for (const field of frame.fields) {
        if (field.type === 'time') {
          continue;
        }
        const raw = field.values as unknown as (number | string)[];
        if (!raw || raw.length === 0) {
          continue;
        }
        // Check if first value is parseable as number
        const first = typeof raw[0] === 'string' ? parseFloat(raw[0] as string) : raw[0] as number;
        if (typeof first !== 'number' || isNaN(first)) {
          continue;
        }
        // Use this field
        for (let i = 0; i < raw.length; i++) {
          const v = typeof raw[i] === 'string' ? parseFloat(raw[i] as string) : raw[i] as number;
          if (typeof v === 'number' && !isNaN(v)) {
            values.push(v);
          }
        }
        break outer;
      }
    }
    if (values.length === 0) {
      return;
    }

    drawSparkline(ctx, values, color, theme);
  }, [data, color, theme]);

  return <canvas ref={canvasRef} width={200} height={60} style={{ display: 'block' }} />;
};

function drawSparkline(
  ctx: CanvasRenderingContext2D,
  values: number[],
  color: string,
  theme: GrafanaTheme2
): void {
  const w = ctx.canvas.width;
  const h = ctx.canvas.height;
  const pad = 4;
  const gw = w - pad * 2;
  const gh = h - pad * 2;

  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = theme.colors.background.secondary;
  ctx.fillRect(0, 0, w, h);

  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;

  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.beginPath();

  values.forEach((v, i) => {
    const x = pad + (gw / (values.length - 1)) * i;
    const y = pad + gh - ((v - min) / range) * gh;
    if (i === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  });
  ctx.stroke();

  // Area under line
  ctx.lineTo(w - pad, h - pad);
  ctx.lineTo(pad, h - pad);
  ctx.closePath();
  ctx.fillStyle = color + '20';
  ctx.fill();

  // Last value dot
  const lastY = pad + gh - ((values[values.length - 1] - min) / range) * gh;
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(w - pad, lastY, 3, 0, Math.PI * 2);
  ctx.fill();
}

const getStyles = (theme: GrafanaTheme2) => ({
  tooltip: css`
    position: fixed;
    z-index: 10000;
    background: ${theme.colors.background.primary};
    border: 1px solid ${theme.colors.border.medium};
    border-radius: 4px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    padding: 12px;
    min-width: 180px;
    max-width: 350px;
    pointer-events: none;
  `,
  metric: css`
    font-size: 14px;
    color: ${theme.colors.text.primary};
    margin-bottom: 6px;
  `,
  value: css`
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 13px;
    margin-bottom: 6px;
  `,
  valueLabel: css`
    color: ${theme.colors.text.secondary};
  `,
  valueNumber: css`
    font-size: 18px;
    font-weight: 600;
  `,
  level: css`
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
  `,
  levelDot: css`
    width: 8px;
    height: 8px;
    border-radius: 50%;
  `,
  levelText: css`
    color: ${theme.colors.text.secondary};
    text-transform: uppercase;
    font-weight: 500;
  `,
  timestamp: css`
    font-size: 11px;
    color: ${theme.colors.text.secondary};
    margin-top: 6px;
    padding-top: 6px;
    border-top: 1px solid ${theme.colors.border.weak};
  `,
  graph: css`
    margin-top: 8px;
    padding-top: 8px;
    border-top: 1px solid ${theme.colors.border.weak};
  `,
});
