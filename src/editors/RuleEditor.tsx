/**
 * RuleEditor — editor for a single rule: metric, thresholds, format, and all mapping types
 */

import React, { useState } from 'react';
import { css } from '@emotion/css';
import { useTheme2, Input, Select, InlineSwitch, CollapsableSection } from '@grafana/ui';
import { GrafanaTheme2 } from '@grafana/data';
import { RuleOptions } from '../types/options';
import { AGGREGATION_TYPES, AggregationType } from '../types/constants';
import { ThresholdEditor } from './ThresholdEditor';
import { ShapeMapEditor } from './ShapeMapEditor';
import { TextMapEditor } from './TextMapEditor';
import { LinkMapEditor } from './LinkMapEditor';
import { EventMapEditor } from './EventMapEditor';
import { ValueMapEditor } from './ValueMapEditor';
import { RangeMapEditor } from './RangeMapEditor';

interface RuleEditorProps {
  rule: RuleOptions;
  onChange: (rule: RuleOptions) => void;
  queryOptions: Array<{ label: string; value: string }>;
  metricOptions: Array<{ label: string; value: string }>;
}

const aggOptions = AGGREGATION_TYPES.map((a) => ({ label: a, value: a }));

export const RuleEditor: React.FC<RuleEditorProps> = ({ rule, onChange, queryOptions, metricOptions }) => {
  const theme = useTheme2();
  const styles = getStyles(theme);

  const update = (field: keyof RuleOptions, value: any) => {
    onChange({ ...rule, [field]: value });
  };

  return (
    <div className={styles.container}>
      {/* Metric Matching */}
      <CollapsableSection label="Metric" isOpen={true}>
        <div className={styles.section}>
          <div className={styles.field}>
            <label className={styles.label}>Name</label>
            <Input
              value={rule.name}
              onChange={(e) => update('name', e.currentTarget.value)}
              width={20}
            />
          </div>

          {/* Apply to Query (refId) */}
          <div className={styles.field}>
            <label className={styles.label}>Apply to Query</label>
            <Select
              options={queryOptions}
              value={rule.refId ? { label: `Query ${rule.refId}`, value: rule.refId } : null}
              onChange={(v) => update('refId', v?.value ?? '')}
              placeholder="Select query"
              isClearable
              allowCustomValue
              width={20}
            />
          </div>

          {/* Apply to Column (column = device_id / metric value) */}
          <div className={styles.field}>
            <label className={styles.label}>Apply to Column</label>
            <Select
              options={metricOptions}
              value={rule.column ? { label: rule.column, value: rule.column } : null}
              onChange={(v) => update('column', v?.value ?? '')}
              placeholder="Select or type column value"
              isClearable
              isSearchable
              allowCustomValue
              width={28}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Aggregation</label>
            <Select
              options={aggOptions}
              value={aggOptions.find((o) => o.value === rule.aggregation)}
              onChange={(v) => update('aggregation', v.value as AggregationType)}
              width={14}
            />
          </div>
        </div>
      </CollapsableSection>

      {/* Thresholds */}
      <CollapsableSection label="Thresholds" isOpen={true}>
        <ThresholdEditor
          thresholds={rule.thresholds}
          colors={rule.colors}
          invert={rule.invert}
          onChange={(thresholds, colors, invert) => {
            onChange({ ...rule, thresholds, colors, invert });
          }}
        />
      </CollapsableSection>

      {/* Format */}
      <CollapsableSection label="Format" isOpen={false}>
        <div className={styles.section}>
          <div className={styles.field}>
            <label className={styles.label}>Unit</label>
            <Input
              value={rule.unit}
              onChange={(e) => update('unit', e.currentTarget.value)}
              width={12}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Decimals</label>
            <Input
              type="number"
              value={rule.decimals}
              onChange={(e) => update('decimals', parseInt(e.currentTarget.value, 10) || 0)}
              width={8}
            />
          </div>
        </div>
      </CollapsableSection>

      {/* Shape Maps */}
      <CollapsableSection label={`Shape Maps (${rule.shapeMaps.length})`} isOpen={false}>
        <ShapeMapEditor maps={rule.shapeMaps} onChange={(maps) => update('shapeMaps', maps)} />
      </CollapsableSection>

      {/* Text Maps */}
      <CollapsableSection label={`Text Maps (${rule.textMaps.length})`} isOpen={false}>
        <TextMapEditor maps={rule.textMaps} onChange={(maps) => update('textMaps', maps)} />
      </CollapsableSection>

      {/* Link Maps */}
      <CollapsableSection label={`Link Maps (${rule.linkMaps.length})`} isOpen={false}>
        <LinkMapEditor maps={rule.linkMaps} onChange={(maps) => update('linkMaps', maps)} />
      </CollapsableSection>

      {/* Event Maps */}
      <CollapsableSection label={`Event Maps (${rule.eventMaps.length})`} isOpen={false}>
        <EventMapEditor maps={rule.eventMaps} onChange={(maps) => update('eventMaps', maps)} />
      </CollapsableSection>

      {/* Value Maps */}
      <CollapsableSection label={`Value Maps (${rule.valueMaps.length})`} isOpen={false}>
        <ValueMapEditor maps={rule.valueMaps} onChange={(maps) => update('valueMaps', maps)} />
      </CollapsableSection>

      {/* Range Maps */}
      <CollapsableSection label={`Range Maps (${rule.rangeMaps.length})`} isOpen={false}>
        <RangeMapEditor maps={rule.rangeMaps} onChange={(maps) => update('rangeMaps', maps)} />
      </CollapsableSection>
    </div>
  );
};

const getStyles = (theme: GrafanaTheme2) => ({
  container: css`
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding: 8px;
    background: ${theme.colors.background.secondary};
    border: 1px solid ${theme.colors.border.weak};
    border-radius: 4px;
  `,
  section: css`
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 4px 0;
  `,
  field: css`
    display: flex;
    align-items: center;
    gap: 8px;
  `,
  label: css`
    font-size: 12px;
    color: ${theme.colors.text.secondary};
    min-width: 100px;
  `,
});
