/**
 * TextMapEditor — pattern → text replacement mode/template
 */

import React from 'react';
import { css } from '@emotion/css';
import { useTheme2, Button, Select, Input, InlineSwitch } from '@grafana/ui';
import { GrafanaTheme2 } from '@grafana/data';
import { TextMapOptions } from '../types/options';
import { TEXT_REPLACE_MODES, MAPPING_CONDITIONS, TextReplaceMode, MappingCondition } from '../types/constants';

interface TextMapEditorProps {
  maps: TextMapOptions[];
  onChange: (maps: TextMapOptions[]) => void;
}

const modeOptions = TEXT_REPLACE_MODES.map((m) => ({ label: m, value: m }));
const conditionOptions = MAPPING_CONDITIONS.map((c) => ({ label: c, value: c }));

export const TextMapEditor: React.FC<TextMapEditorProps> = ({ maps, onChange }) => {
  const theme = useTheme2();
  const styles = getStyles(theme);

  const update = (idx: number, field: keyof TextMapOptions, value: any) => {
    const updated = maps.map((m, i) => (i === idx ? { ...m, [field]: value } : m));
    onChange(updated);
  };

  const add = () => {
    onChange([
      ...maps,
      { pattern: '.*', hidden: false, mode: 'content', template: '${_formattedValue}', when: 'always', enabled: true },
    ]);
  };

  const remove = (idx: number) => {
    onChange(maps.filter((_, i) => i !== idx));
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>Text Mappings</div>
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
            options={modeOptions}
            value={modeOptions.find((o) => o.value === m.mode)}
            onChange={(v) => update(idx, 'mode', v.value as TextReplaceMode)}
            width={12}
          />
          <Input
            value={m.template}
            onChange={(e) => update(idx, 'template', e.currentTarget.value)}
            placeholder="Template: ${_value}"
            width={18}
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
        Add Text Map
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
