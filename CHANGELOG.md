# Changelog

## [1.0.0] - 2026-02-10

### Features

- **Draw.io Diagram Rendering**: Full mxGraph-based rendering of Draw.io XML diagrams including compressed format support
- **Data-Driven State Engine**: Rules-based system that maps metric values to diagram cell states (color, text, links, animations)
- **Gradient Thresholds**: Smooth RGB color interpolation across configurable temperature/value ranges
- **Shape Maps**: Map metric values to cell fill color, stroke color, font color, or opacity based on threshold levels
- **Text Maps**: Replace cell text content with formatted metric values using regex templates (`/.*/`)
- **Link Maps**: Add clickable navigation links to diagram cells with configurable targets
- **Event Maps**: CSS animations (blink, fade) triggered on threshold conditions (warning, critical)
- **Tooltip with Sparkline**: Hover tooltips showing metric name, current value, threshold status, timestamp, and mini sparkline graph
- **Zoom and Pan**: Mouse wheel zoom, click-drag pan, and double-click zoom with configurable options
- **Multiple Aggregations**: Support for last, first, min, max, sum, avg, count, delta, range, and diff
- **Value and Range Maps**: Custom text display for specific values or numeric ranges
- **Draw.io Editor Integration**: In-panel Draw.io iframe editor for live diagram editing
- **Multi-Flowchart Tabs**: Support for multiple diagrams with tab navigation
- **Table and Series Metric Types**: Match metrics by column name (table) or series alias
- **CSV Datasource Compatibility**: Automatic string-to-number parsing for CSV datasource fields
- **Grafana 10+ Compatible**: Built as a modern React panel plugin using `@grafana/data`, `@grafana/ui`, `@grafana/runtime`

### Architecture

- Pure React implementation (no Angular dependency)
- Core engine as pure functions (MetricProcessor, RuleEvaluator, ThresholdEvaluator, StateComputer, StateCycleApplier)
- Custom hooks for React integration (useGraph, useMetrics, useRulesEngine, useStateManager, useZoom, useTooltip)
- Portal-based tooltips to escape Grafana's CSS transform containers
- mxGraph native event system for reliable click handling
