/**
 * Plugin entry point — registers the panel, options editors, and migration
 */

import { PanelPlugin } from '@grafana/data';
import { FlowchartPanel } from './components/FlowchartPanel';
import { FlowchartPanelOptions, DEFAULT_PANEL_OPTIONS, RuleOptions } from './types/options';
import { MXGRAPH_BASE_PATH } from './types/constants';
import { migrateOptions, migrateAngularPanel, isAngularFlowchartingPanel } from './utils/migration';
import { log } from './utils/logging';
import { RulesEditor } from './editors/RulesEditor';
import { registerFloorplanShapes } from './graph/FloorplanShapes';

// ============================================================================
// Load mxGraph globally
// ============================================================================

if (typeof window !== 'undefined' && typeof (window as any).mxGraph === 'undefined') {
  try {
    const mxgraph = require('mxgraph');
    const mx = mxgraph({ mxBasePath: MXGRAPH_BASE_PATH });

    (window as any).mxGraph = mx.mxGraph;
    (window as any).mxUtils = mx.mxUtils;
    (window as any).mxCodec = mx.mxCodec;
    (window as any).mxCell = mx.mxCell;
    (window as any).mxGeometry = mx.mxGeometry;
    (window as any).mxEvent = mx.mxEvent;
    (window as any).mxClient = mx.mxClient;
    (window as any).mxConstants = mx.mxConstants;
    (window as any).mxGraphModel = mx.mxGraphModel;
    (window as any).mxPoint = mx.mxPoint;
    (window as any).mxRectangle = mx.mxRectangle;
    (window as any).mxShape = mx.mxShape;
    (window as any).mxCellRenderer = mx.mxCellRenderer;

    // Register Draw.io custom shapes (doors, etc.)
    registerFloorplanShapes();

    log.info('mxGraph loaded successfully');
  } catch (error) {
    log.error('Failed to load mxGraph:', error);
  }
}

// ============================================================================
// Panel Plugin Registration
// ============================================================================

export const plugin = new PanelPlugin<FlowchartPanelOptions>(FlowchartPanel)
  .setMigrationHandler((panel: any) => {
    // Handle migration from Angular agenty-flowcharting-panel
    if (isAngularFlowchartingPanel(panel)) {
      const { options } = migrateAngularPanel(panel);
      return options;
    }
    // Handle migration from older React options format
    if (panel.options && !panel.options.flowcharts) {
      const { options } = migrateOptions(panel.options);
      return options;
    }
    return panel.options;
  })
  .setPanelOptions((builder) => {
    // ---- Flowchart Source ----
    // NOTE: Grafana builder API does NOT support array bracket paths like flowcharts[0].content.
    // We use flat top-level paths and reconstruct the flowcharts array in FlowchartPanel.
    builder
      .addRadio({
        path: 'sourceType',
        name: 'Source Type',
        category: ['Flowchart Source'],
        defaultValue: 'xml',
        settings: {
          options: [
            { value: 'xml', label: 'XML / Draw.io' },
            { value: 'url', label: 'URL' },
          ],
        },
      })
      .addTextInput({
        path: 'content',
        name: 'Diagram Content',
        category: ['Flowchart Source'],
        description: 'Paste your Draw.io XML, compressed data, or SVG content',
        defaultValue: '',
        settings: {
          useTextarea: true,
          rows: 8,
        },
      })
      .addTextInput({
        path: 'sourceUrl',
        name: 'Diagram URL',
        category: ['Flowchart Source'],
        description: 'URL to fetch diagram from (when Source Type is URL)',
        defaultValue: '',
        showIf: (config: any) => config.sourceType === 'url',
      })
      .addTextInput({
        path: 'sourceName',
        name: 'Flowchart Name',
        category: ['Flowchart Source'],
        defaultValue: 'Default',
      });

    // ---- Display ----
    builder
      .addSliderInput({
        path: 'zoom.scale',
        name: 'Initial Zoom Scale',
        category: ['Display'],
        defaultValue: 1,
        settings: {
          min: 0.1,
          max: 3,
          step: 0.1,
        },
      })
      .addBooleanSwitch({
        path: 'zoom.center',
        name: 'Center Diagram',
        category: ['Display'],
        defaultValue: true,
      })
      .addBooleanSwitch({
        path: 'zoom.lock',
        name: 'Lock Zoom/Pan',
        category: ['Display'],
        defaultValue: false,
      })
      .addBooleanSwitch({
        path: 'zoom.enableWheel',
        name: 'Enable Wheel Zoom',
        category: ['Display'],
        defaultValue: true,
      })
      .addBooleanSwitch({
        path: 'zoom.enablePan',
        name: 'Enable Pan',
        category: ['Display'],
        defaultValue: true,
      })
      .addBooleanSwitch({
        path: 'background.transparent',
        name: 'Transparent Background',
        category: ['Display'],
        defaultValue: true,
      })
      .addColorPicker({
        path: 'background.color',
        name: 'Background Color',
        category: ['Display'],
        defaultValue: '#ffffff',
        showIf: (config: any) => !config.background?.transparent,
      });

    // ---- Tooltips ----
    builder
      .addBooleanSwitch({
        path: 'tooltip.enabled',
        name: 'Enable Tooltips',
        category: ['Tooltips'],
        defaultValue: true,
      })
      .addBooleanSwitch({
        path: 'tooltip.showValue',
        name: 'Show Value',
        category: ['Tooltips'],
        defaultValue: true,
        showIf: (config: any) => config.tooltip?.enabled,
      })
      .addBooleanSwitch({
        path: 'tooltip.showMetric',
        name: 'Show Metric Name',
        category: ['Tooltips'],
        defaultValue: true,
        showIf: (config: any) => config.tooltip?.enabled,
      })
      .addBooleanSwitch({
        path: 'tooltip.showGraph',
        name: 'Show Sparkline Graph',
        category: ['Tooltips'],
        defaultValue: false,
        showIf: (config: any) => config.tooltip?.enabled,
      })
      .addBooleanSwitch({
        path: 'tooltip.showTimestamp',
        name: 'Show Timestamp',
        category: ['Tooltips'],
        defaultValue: false,
        showIf: (config: any) => config.tooltip?.enabled,
      });

    // ---- Rules (custom editor) ----
    builder.addCustomEditor({
      id: 'rules',
      path: 'rules',
      name: 'Rules',
      category: ['Rules'],
      defaultValue: [] as RuleOptions[],
      editor: RulesEditor as any,
    });

    // ---- Editor ----
    builder
      .addTextInput({
        path: 'editorUrl',
        name: 'Draw.io Editor URL',
        category: ['Draw.io Editor'],
        defaultValue: 'https://embed.diagrams.net',
      })
      .addRadio({
        path: 'editorTheme',
        name: 'Editor Theme',
        category: ['Draw.io Editor'],
        defaultValue: 'light',
        settings: {
          options: [
            { value: 'light', label: 'Light' },
            { value: 'dark', label: 'Dark' },
            { value: 'kennedy', label: 'Kennedy' },
            { value: 'minimal', label: 'Minimal' },
          ],
        },
      });

    return builder;
  });
