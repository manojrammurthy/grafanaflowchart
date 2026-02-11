/**
 * ValueMapEditor — value → display text list
 */

import React from 'react';
import { css } from '@emotion/css';
import { useTheme2, Button, Input, InlineSwitch } from '@grafana/ui';
import { GrafanaTheme2 } from '@grafana/data';
import { ValueMapOptions } from '../types/options';

interface ValueMapEditorProps {
  maps: ValueMapOptions[];
  onChange: (maps: ValueMapOptions[]) => void;
}

export const ValueMapEditor: React.FC<ValueMapEditorProps> = ({ maps, onChange }) => {
  const theme = useTheme2();
  const styles = getStyles(theme);

  const update = (idx: number, field: keyof ValueMapOptions, value: any) => {
    const updated = maps.map((m, i) => (i === idx ? { ...m, [field]: value } : m));
    onChange(updated);
  };

  const add = () => {
    onChange([...maps, { value: '0', text: 'Off', enabled: true }]);
  };

  const remove = (idx: number) => {
    onChange(maps.filter((_, i) => i !== idx));
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>Value Mappings</div>
      {maps.map((m, idx) => (
        <div key={idx} className={styles.row}>
          <InlineSwitch
            value={m.enabled}
            onChange={(e) => update(idx, 'enabled', e.currentTarget.checked)}
            transparent
          />
          <Input
            value={m.value}
            onChange={(e) => update(idx, 'value', e.currentTarget.value)}
            placeholder="Value"
            width={10}
          />
          <span className={styles.arrow}>&rarr;</span>
          <Input
            value={m.text}
            onChange={(e) => update(idx, 'text', e.currentTarget.value)}
            placeholder="Display text"
            width={16}
          />
          <Button variant="destructive" size="sm" icon="trash-alt" onClick={() => remove(idx)} />
        </div>
      ))}
      <Button variant="secondary" size="sm" icon="plus" onClick={add}>
        Add Value Map
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
  `,
  arrow: css`
    color: ${theme.colors.text.secondary};
    font-size: 14px;
  `,
});
