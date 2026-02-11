/**
 * EventMapEditor — pattern → animation type
 */

import React from 'react';
import { css } from '@emotion/css';
import { useTheme2, Button, Select, Input, InlineSwitch } from '@grafana/ui';
import { GrafanaTheme2 } from '@grafana/data';
import { EventMapOptions } from '../types/options';
import { ANIMATION_TYPES, MAPPING_CONDITIONS, AnimationType, MappingCondition } from '../types/constants';

interface EventMapEditorProps {
  maps: EventMapOptions[];
  onChange: (maps: EventMapOptions[]) => void;
}

const animOptions = ANIMATION_TYPES.map((a) => ({ label: a, value: a }));
const conditionOptions = MAPPING_CONDITIONS.map((c) => ({ label: c, value: c }));

export const EventMapEditor: React.FC<EventMapEditorProps> = ({ maps, onChange }) => {
  const theme = useTheme2();
  const styles = getStyles(theme);

  const update = (idx: number, field: keyof EventMapOptions, value: any) => {
    const updated = maps.map((m, i) => (i === idx ? { ...m, [field]: value } : m));
    onChange(updated);
  };

  const add = () => {
    onChange([
      ...maps,
      { pattern: '.*', hidden: false, animation: 'blink', duration: 1000, when: 'critical', enabled: true },
    ]);
  };

  const remove = (idx: number) => {
    onChange(maps.filter((_, i) => i !== idx));
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>Event / Animation Mappings</div>
      {maps.map((m, idx) => (
        <div key={idx} className={styles.row}>
          <InlineSwitch
            value={m.enabled}
            onChange={(e) => update(idx, 'enabled', e.currentTarget.checked)}
            transparent
          />
          <Input
            value={m.pattern}
            onChange={(e) => update(idx, 'pattern', e.currentTarget.value)}
            placeholder="Cell pattern"
            width={14}
          />
          <Select
            options={animOptions}
            value={animOptions.find((o) => o.value === m.animation)}
            onChange={(v) => update(idx, 'animation', v.value as AnimationType)}
            width={12}
          />
          <Input
            type="number"
            value={m.duration}
            onChange={(e) => update(idx, 'duration', parseInt(e.currentTarget.value, 10) || 1000)}
            width={10}
            suffix="ms"
          />
          <Select
            options={conditionOptions}
            value={conditionOptions.find((o) => o.value === m.when)}
            onChange={(v) => update(idx, 'when', v.value as MappingCondition)}
            width={12}
          />
          <Button variant="destructive" size="sm" icon="trash-alt" onClick={() => remove(idx)} />
        </div>
      ))}
      <Button variant="secondary" size="sm" icon="plus" onClick={add}>
        Add Event Map
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
});
