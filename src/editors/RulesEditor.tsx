/**
 * RulesEditor — custom editor: rule list with add/remove/reorder/clone/expand
 */

import React, { useState } from 'react';
import { css } from '@emotion/css';
import { StandardEditorProps } from '@grafana/data';
import { useTheme2, Button, InlineSwitch } from '@grafana/ui';
import { GrafanaTheme2 } from '@grafana/data';
import { RuleOptions, FlowchartPanelOptions, createDefaultRule } from '../types/options';
import { RuleEditor } from './RuleEditor';

type RulesEditorProps = StandardEditorProps<RuleOptions[], any, FlowchartPanelOptions>;

export const RulesEditor: React.FC<RulesEditorProps> = ({ value, onChange, context }) => {
  const theme = useTheme2();
  const styles = getStyles(theme);
  const rules = value || [];
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const addRule = () => {
    const newRule = createDefaultRule();
    onChange([...rules, newRule]);
    setExpandedId(newRule.id);
  };

  const removeRule = (id: string) => {
    onChange(rules.filter((r) => r.id !== id));
    if (expandedId === id) {
      setExpandedId(null);
    }
  };

  const updateRule = (id: string, updated: RuleOptions) => {
    onChange(rules.map((r) => (r.id === id ? updated : r)));
  };

  const cloneRule = (rule: RuleOptions) => {
    const cloned = {
      ...rule,
      id: `rule-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      name: `${rule.name} (copy)`,
    };
    const idx = rules.findIndex((r) => r.id === rule.id);
    const updated = [...rules];
    updated.splice(idx + 1, 0, cloned);
    onChange(updated);
  };

  const moveRule = (id: string, direction: 'up' | 'down') => {
    const idx = rules.findIndex((r) => r.id === id);
    if (
      (direction === 'up' && idx <= 0) ||
      (direction === 'down' && idx >= rules.length - 1)
    ) {
      return;
    }
    const updated = [...rules];
    const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
    [updated[idx], updated[swapIdx]] = [updated[swapIdx], updated[idx]];
    onChange(updated);
  };

  const toggleRule = (id: string) => {
    onChange(
      rules.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r))
    );
  };

  return (
    <div className={styles.container}>
      {rules.length === 0 && (
        <div className={styles.empty}>
          No rules configured. Add a rule to map data to diagram elements.
        </div>
      )}

      {rules.map((rule, idx) => (
        <div key={rule.id} className={styles.ruleItem}>
          <div className={styles.ruleHeader}>
            <InlineSwitch
              value={rule.enabled}
              onChange={() => toggleRule(rule.id)}
              transparent
            />
            <button
              className={styles.ruleTitle}
              onClick={() =>
                setExpandedId(expandedId === rule.id ? null : rule.id)
              }
            >
              <span className={styles.ruleIndex}>#{idx + 1}</span>
              <span>{rule.name}</span>
              <span className={styles.expandIcon}>
                {expandedId === rule.id ? '\u25B2' : '\u25BC'}
              </span>
            </button>
            <div className={styles.ruleActions}>
              <Button
                variant="secondary"
                size="sm"
                icon="arrow-up"
                onClick={() => moveRule(rule.id, 'up')}
                disabled={idx === 0}
                tooltip="Move Up"
              />
              <Button
                variant="secondary"
                size="sm"
                icon="arrow-down"
                onClick={() => moveRule(rule.id, 'down')}
                disabled={idx === rules.length - 1}
                tooltip="Move Down"
              />
              <Button
                variant="secondary"
                size="sm"
                icon="copy"
                onClick={() => cloneRule(rule)}
                tooltip="Clone"
              />
              <Button
                variant="destructive"
                size="sm"
                icon="trash-alt"
                onClick={() => removeRule(rule.id)}
                tooltip="Delete"
              />
            </div>
          </div>
          {expandedId === rule.id && (
            <RuleEditor
              rule={rule}
              onChange={(updated) => updateRule(rule.id, updated)}
            />
          )}
        </div>
      ))}

      <Button variant="primary" icon="plus" onClick={addRule}>
        Add Rule
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
  empty: css`
    padding: 16px;
    text-align: center;
    color: ${theme.colors.text.secondary};
    font-size: 13px;
    background: ${theme.colors.background.secondary};
    border-radius: 4px;
  `,
  ruleItem: css`
    border: 1px solid ${theme.colors.border.weak};
    border-radius: 4px;
    overflow: hidden;
  `,
  ruleHeader: css`
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 6px 8px;
    background: ${theme.colors.background.secondary};
  `,
  ruleTitle: css`
    flex: 1;
    display: flex;
    align-items: center;
    gap: 8px;
    background: none;
    border: none;
    cursor: pointer;
    font-size: 13px;
    color: ${theme.colors.text.primary};
    text-align: left;
    padding: 4px 0;
    &:hover {
      color: ${theme.colors.primary.text};
    }
  `,
  ruleIndex: css`
    color: ${theme.colors.text.secondary};
    font-size: 11px;
    font-weight: 500;
  `,
  expandIcon: css`
    margin-left: auto;
    font-size: 10px;
    color: ${theme.colors.text.secondary};
  `,
  ruleActions: css`
    display: flex;
    gap: 4px;
  `,
});
