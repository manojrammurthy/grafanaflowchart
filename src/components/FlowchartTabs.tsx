/**
 * FlowchartTabs — multi-flowchart tab navigation bar
 */

import React from 'react';
import { css } from '@emotion/css';
import { useTheme2 } from '@grafana/ui';
import { GrafanaTheme2 } from '@grafana/data';
import { FlowchartSourceOptions } from '../types/options';

interface FlowchartTabsProps {
  flowcharts: FlowchartSourceOptions[];
  activeIndex: number;
  onSelect: (index: number) => void;
}

export const FlowchartTabs: React.FC<FlowchartTabsProps> = ({
  flowcharts,
  activeIndex,
  onSelect,
}) => {
  const theme = useTheme2();
  const styles = getStyles(theme);

  if (flowcharts.length <= 1) {
    return null;
  }

  return (
    <div className={styles.tabBar}>
      {flowcharts.map((fc, idx) => (
        <button
          key={idx}
          className={idx === activeIndex ? styles.activeTab : styles.tab}
          onClick={() => onSelect(idx)}
          disabled={!fc.enabled}
        >
          {fc.name || `Flowchart ${idx + 1}`}
        </button>
      ))}
    </div>
  );
};

const getStyles = (theme: GrafanaTheme2) => ({
  tabBar: css`
    display: flex;
    border-bottom: 1px solid ${theme.colors.border.weak};
    padding: 0 4px;
    gap: 2px;
    background: ${theme.colors.background.secondary};
    flex-shrink: 0;
  `,
  tab: css`
    padding: 6px 12px;
    border: none;
    background: transparent;
    color: ${theme.colors.text.secondary};
    font-size: 12px;
    cursor: pointer;
    border-bottom: 2px solid transparent;
    &:hover {
      color: ${theme.colors.text.primary};
      background: ${theme.colors.background.primary};
    }
    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  `,
  activeTab: css`
    padding: 6px 12px;
    border: none;
    background: ${theme.colors.background.primary};
    color: ${theme.colors.text.primary};
    font-size: 12px;
    cursor: pointer;
    font-weight: 500;
    border-bottom: 2px solid ${theme.colors.primary.main};
  `,
});
