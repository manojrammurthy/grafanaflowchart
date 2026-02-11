/**
 * RangeMapEditor — range (from-to) → display text list
 */

import React from 'react';
import { css } from '@emotion/css';
import { useTheme2, Button, Input, InlineSwitch } from '@grafana/ui';
import { GrafanaTheme2 } from '@grafana/data';
import { RangeMapOptions } from '../types/options';

interface RangeMapEditorProps {
  maps: RangeMapOptions[];
  onChange: (maps: RangeMapOptions[]) => void;
}

export const RangeMapEditor: React.FC<RangeMapEditorProps> = ({ maps, onChange }) => {
  const theme = useTheme2();
  const styles = getStyles(theme);

  const update = (idx: number, field: keyof RangeMapOptions, value: any) => {
    const updated = maps.map((m, i) => (i === idx ? { ...m, [field]: value } : m));
    onChange(updated);
  };

  const add = () => {
    onChange([...maps, { from: 0, to: 100, text: 'Normal', enabled: true }]);
  };

  const remove = (idx: number) => {
    onChange(maps.filter((_, i) => i !== idx));
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>Range Mappings</div>
      {maps.map((m, idx) => (
        <div key={idx} className={styles.row}>
          <InlineSwitch
            value={m.enabled}
            onChange={(e) => update(idx, 'enabled', e.currentTarget.checked)}
            transparent
          />
          <Input
            type="number"
            value={m.from}
            onChange={(e) => update(idx, 'from', parseFloat(e.currentTarget.value) || 0)}
            width={8}
            prefix="From"
          />
          <Input
            type="number"
            value={m.to}
            onChange={(e) => update(idx, 'to', parseFloat(e.currentTarget.value) || 0)}
            width={8}
            prefix="To"
          />
          <span className={styles.arrow}>&rarr;</span>
          <Input
            value={m.text}
            onChange={(e) => update(idx, 'text', e.currentTarget.value)}
            placeholder="Display text"
            width={14}
          />
          <Button variant="destructive" size="sm" icon="trash-alt" onClick={() => remove(idx)} />
        </div>
      ))}
      <Button variant="secondary" size="sm" icon="plus" onClick={add}>
        Add Range Map
      </Button>
    </div>
  );
};

const getStyles = (theme: GrafanaTheme2) => ({
  container: css`
    display: flex;
    flex-direction: column;
    gap: 6px;
  `,
  header: css`
    font-weight: 500;
    font-size: 13px;
    color: ${theme.colors.text.primary};
    margin-bottom: 4px;
  `,
  row: css`
    display: flex;
    gap: 6px;
    align-items: center;
    flex-wrap: wrap;
  `,
  arrow: css`
    color: ${theme.colors.text.secondary};
    font-size: 14px;
  `,
});
