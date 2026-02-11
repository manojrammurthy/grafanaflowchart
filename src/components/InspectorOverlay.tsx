/**
 * InspectorOverlay — displays cell ID/label/state info on hover in inspect mode
 */

import React, { useState } from 'react';
import { css } from '@emotion/css';
import { useTheme2 } from '@grafana/ui';
import { GrafanaTheme2 } from '@grafana/data';
import { CellState } from '../types/state';
import { getLevelName } from '../core/ThresholdEvaluator';

interface InspectorOverlayProps {
  cellStates: Map<string, CellState>;
  cellLabels: Map<string, string>;
  cellIds: string[];
}

export const InspectorOverlay: React.FC<InspectorOverlayProps> = ({
  cellStates,
  cellLabels,
  cellIds,
}) => {
  const theme = useTheme2();
  const styles = getStyles(theme);
  const [filter, setFilter] = useState('');

  const filteredIds = filter
    ? cellIds.filter((id) => {
        const label = cellLabels.get(id) || '';
        return (
          id.toLowerCase().includes(filter.toLowerCase()) ||
          label.toLowerCase().includes(filter.toLowerCase())
        );
      })
    : cellIds;

  return (
    <div className={styles.overlay}>
      <div className={styles.header}>Inspector Mode</div>
      <input
        className={styles.filter}
        placeholder="Filter cells..."
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      />
      <div className={styles.list}>
        {filteredIds.slice(0, 50).map((id) => {
          const state = cellStates.get(id);
          const label = cellLabels.get(id) || '';
          return (
            <div key={id} className={styles.item}>
              <div className={styles.cellId}>{id}</div>
              {label && <div className={styles.cellLabel}>{label}</div>}
              {state && (
                <div className={styles.stateInfo}>
                  <span
                    className={styles.dot}
                    style={{ background: state.color }}
                  />
                  <span>{getLevelName(state.level)}</span>
                  <span className={styles.stateValue}>
                    {state.formattedValue}
                  </span>
                </div>
              )}
            </div>
          );
        })}
        {filteredIds.length > 50 && (
          <div className={styles.more}>
            ...and {filteredIds.length - 50} more
          </div>
        )}
      </div>
      <div className={styles.footer}>
        Total: {cellIds.length} cells, {cellStates.size} with state
      </div>
    </div>
  );
};

const getStyles = (theme: GrafanaTheme2) => ({
  overlay: css`
    position: absolute;
    top: 8px;
    right: 8px;
    width: 260px;
    max-height: 400px;
    background: ${theme.colors.background.secondary};
    border: 1px solid ${theme.colors.border.weak};
    border-radius: 4px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    z-index: 100;
  `,
  header: css`
    font-weight: 600;
    font-size: 13px;
    color: ${theme.colors.text.primary};
    padding: 8px 10px;
    border-bottom: 1px solid ${theme.colors.border.weak};
  `,
  filter: css`
    margin: 6px 8px;
    padding: 4px 8px;
    font-size: 12px;
    border: 1px solid ${theme.colors.border.weak};
    border-radius: 3px;
    background: ${theme.colors.background.primary};
    color: ${theme.colors.text.primary};
    outline: none;
    &:focus {
      border-color: ${theme.colors.primary.main};
    }
  `,
  list: css`
    overflow-y: auto;
    flex: 1;
    padding: 4px 8px;
  `,
  item: css`
    padding: 4px 0;
    border-bottom: 1px solid ${theme.colors.border.weak};
    &:last-child {
      border-bottom: none;
    }
  `,
  cellId: css`
    font-size: 11px;
    font-family: monospace;
    color: ${theme.colors.text.primary};
  `,
  cellLabel: css`
    font-size: 11px;
    color: ${theme.colors.text.secondary};
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  `,
  stateInfo: css`
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 11px;
    color: ${theme.colors.text.secondary};
    margin-top: 2px;
  `,
  dot: css`
    width: 6px;
    height: 6px;
    border-radius: 50%;
    flex-shrink: 0;
  `,
  stateValue: css`
    margin-left: auto;
    font-family: monospace;
  `,
  more: css`
    font-size: 11px;
    color: ${theme.colors.text.secondary};
    padding: 4px 0;
    text-align: center;
  `,
  footer: css`
    font-size: 11px;
    color: ${theme.colors.text.secondary};
    padding: 6px 10px;
    border-top: 1px solid ${theme.colors.border.weak};
  `,
});
