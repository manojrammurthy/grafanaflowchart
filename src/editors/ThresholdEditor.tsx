/**
 * ThresholdEditor — edits threshold rows (value, comparator, colors)
 */

import React from 'react';
import { css } from '@emotion/css';
import { useTheme2, Button, Select, Input, ColorPicker } from '@grafana/ui';
import { GrafanaTheme2 } from '@grafana/data';
import { ThresholdOptions, ThresholdColors } from '../types/options';
import { COMPARATOR_TYPES, ComparatorType } from '../types/constants';

interface ThresholdEditorProps {
  thresholds: ThresholdOptions[];
  colors: ThresholdColors;
  invert: boolean;
  onChange: (thresholds: ThresholdOptions[], colors: ThresholdColors, invert: boolean) => void;
}

const comparatorOptions = COMPARATOR_TYPES.map((c) => ({ label: c, value: c }));

export const ThresholdEditor: React.FC<ThresholdEditorProps> = ({
  thresholds,
  colors,
  invert,
  onChange,
}) => {
  const theme = useTheme2();
  const styles = getStyles(theme);

  const updateThreshold = (idx: number, field: keyof ThresholdOptions, value: any) => {
    const updated = thresholds.map((t, i) =>
      i === idx ? { ...t, [field]: value } : t
    );
    onChange(updated, colors, invert);
  };

  const addThreshold = () => {
    const newT: ThresholdOptions = {
      value: thresholds.length === 0 ? 50 : 80,
      level: thresholds.length === 0 ? 1 : 2,
      comparator: '>=',
    };
    onChange([...thresholds, newT], colors, invert);
  };

  const removeThreshold = (idx: number) => {
    onChange(thresholds.filter((_, i) => i !== idx), colors, invert);
  };

  const updateColor = (key: keyof ThresholdColors, color: string) => {
    onChange(thresholds, { ...colors, [key]: color }, invert);
  };

  return (
    <div className={styles.container}>
      <div className={styles.colorRow}>
        <label className={styles.colorLabel}>
          OK
          <ColorPicker color={colors.ok} onChange={(c) => updateColor('ok', c)} />
        </label>
        <label className={styles.colorLabel}>
          Warning
          <ColorPicker color={colors.warning} onChange={(c) => updateColor('warning', c)} />
        </label>
        <label className={styles.colorLabel}>
          Critical
          <ColorPicker color={colors.critical} onChange={(c) => updateColor('critical', c)} />
        </label>
        <label className={styles.invertLabel}>
          <input
            type="checkbox"
            checked={invert}
            onChange={(e) => onChange(thresholds, colors, e.target.checked)}
          />
          Invert
        </label>
      </div>

      {thresholds.map((t, idx) => (
        <div key={idx} className={styles.row}>
          <Select
            options={comparatorOptions}
            value={comparatorOptions.find((o) => o.value === t.comparator)}
            onChange={(v) => updateThreshold(idx, 'comparator', v.value as ComparatorType)}
            width={10}
          />
          <Input
            type="number"
            value={t.value}
            onChange={(e) => updateThreshold(idx, 'value', parseFloat(e.currentTarget.value) || 0)}
            width={12}
          />
          <Select
            options={[
              { label: 'Warning', value: 1 },
              { label: 'Critical', value: 2 },
            ]}
            value={t.level}
            onChange={(v) => updateThreshold(idx, 'level', v.value)}
            width={14}
          />
          <Button
            variant="destructive"
            size="sm"
            icon="trash-alt"
            onClick={() => removeThreshold(idx)}
            tooltip="Remove"
          />
        </div>
      ))}

      <Button variant="secondary" size="sm" icon="plus" onClick={addThreshold}>
        Add Threshold
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
  colorRow: css`
    display: flex;
    gap: 16px;
    align-items: center;
    margin-bottom: 8px;
  `,
  colorLabel: css`
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    color: ${theme.colors.text.secondary};
  `,
  invertLabel: css`
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 12px;
    color: ${theme.colors.text.secondary};
    margin-left: auto;
  `,
  row: css`
    display: flex;
    gap: 6px;
    align-items: center;
  `,
});
