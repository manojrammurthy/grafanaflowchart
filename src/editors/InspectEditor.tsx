/**
 * InspectEditor — cell listing, state inspection for debugging
 */

import React from 'react';
import { css } from '@emotion/css';
import { StandardEditorProps } from '@grafana/data';
import { useTheme2, Button } from '@grafana/ui';
import { GrafanaTheme2 } from '@grafana/data';
import { FlowchartPanelOptions } from '../types/options';

type InspectEditorProps = StandardEditorProps<boolean, any, FlowchartPanelOptions>;

export const InspectEditor: React.FC<InspectEditorProps> = ({ value, onChange }) => {
  const theme = useTheme2();
  const styles = getStyles(theme);

  return (
    <div className={styles.container}>
      <p className={styles.description}>
        Inspector mode overlays cell IDs and states on the diagram.
        Use this to find cell IDs for your rule patterns.
      </p>
      <Button
        variant={value ? 'primary' : 'secondary'}
        onClick={() => onChange(!value)}
        icon={value ? 'eye' : 'eye-slash'}
      >
        {value ? 'Disable Inspector' : 'Enable Inspector'}
      </Button>
    </div>
  );
};

const getStyles = (theme: GrafanaTheme2) => ({
  container: css`
    display: flex;
    flex-direction: column;
    gap: 8px;
  `,
  description: css`
    font-size: 12px;
    color: ${theme.colors.text.secondary};
    margin: 0;
  `,
});
