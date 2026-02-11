/**
 * RuleEditor — editor for a single rule: metric, thresholds, format, and all mapping types
 */

import React, { useState } from 'react';
import { css } from '@emotion/css';
import { useTheme2, Input, Select, InlineSwitch, CollapsableSection } from '@grafana/ui';
import { GrafanaTheme2 } from '@grafana/data';
import { RuleOptions } from '../types/options';
import { AGGREGATION_TYPES, METRIC_TYPES, AggregationType, MetricType } from '../types/constants';
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
}

const aggOptions = AGGREGATION_TYPES.map((a) => ({ label: a, value: a }));
const metricTypeOptions = METRIC_TYPES.map((m) => ({ label: m, value: m }));

export const RuleEditor: React.FC<RuleEditorProps> = ({ rule, onChange }) => {
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
          <div className={styles.field}>
            <label className={styles.label}>Metric Type</label>
            <Select
              options={metricTypeOptions}
              value={metricTypeOptions.find((o) => o.value === rule.metricType)}
              onChange={(v) => update('metricType', v.value as MetricType)}
              width={14}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Alias / Pattern</label>
            <Input
              value={rule.alias}
              onChange={(e) => update('alias', e.currentTarget.value)}
              placeholder="Metric name or regex"
              width={24}
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
