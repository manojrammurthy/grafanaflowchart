/**
 * LinkMapEditor — pattern → URL + target
 */

import React from 'react';
import { css } from '@emotion/css';
import { useTheme2, Button, Select, Input, InlineSwitch } from '@grafana/ui';
import { GrafanaTheme2 } from '@grafana/data';
import { LinkMapOptions } from '../types/options';
import { LINK_TARGETS, MAPPING_CONDITIONS, LinkTarget, MappingCondition } from '../types/constants';

interface LinkMapEditorProps {
  maps: LinkMapOptions[];
  onChange: (maps: LinkMapOptions[]) => void;
}

const targetOptions = LINK_TARGETS.map((t) => ({ label: t, value: t }));
const conditionOptions = MAPPING_CONDITIONS.map((c) => ({ label: c, value: c }));

export const LinkMapEditor: React.FC<LinkMapEditorProps> = ({ maps, onChange }) => {
  const theme = useTheme2();
  const styles = getStyles(theme);

  const update = (idx: number, field: keyof LinkMapOptions, value: any) => {
    const updated = maps.map((m, i) => (i === idx ? { ...m, [field]: value } : m));
    onChange(updated);
  };

  const add = () => {
    onChange([
      ...maps,
      { pattern: '.*', hidden: false, url: '', linkTarget: '_blank', params: '', when: 'always', enabled: true },
    ]);
  };

  const remove = (idx: number) => {
    onChange(maps.filter((_, i) => i !== idx));
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>Link Mappings</div>
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
          <Input
            value={m.url}
            onChange={(e) => update(idx, 'url', e.currentTarget.value)}
            placeholder="URL"
            width={20}
          />
          <Select
            options={targetOptions}
            value={targetOptions.find((o) => o.value === m.linkTarget)}
            onChange={(v) => update(idx, 'linkTarget', v.value as LinkTarget)}
            width={10}
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
        Add Link Map
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
