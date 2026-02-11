import { cx, css } from '@emotion/css';
import React__default from 'react';
import '@grafana/data';
import { useStyles2 } from '../../themes/ThemeContext.js';
import 'micro-memoize';
import '@emotion/react';
import 'tinycolor2';
import '../../utils/skeleton.js';
import { SeriesIcon } from '../VizLegend/SeriesIcon.js';

const getSeriesTableRowStyles = (theme) => {
  return {
    icon: css({
      marginRight: theme.spacing(1),
      verticalAlign: "middle"
    }),
    seriesTable: css({
      display: "table"
    }),
    seriesTableRow: css({
      display: "table-row",
      fontSize: theme.typography.bodySmall.fontSize
    }),
    seriesTableCell: css({
      display: "table-cell"
    }),
    label: css({
      wordBreak: "break-all"
    }),
    value: css({
      paddingLeft: theme.spacing(2),
      textAlign: "right"
    }),
    activeSeries: css({
      fontWeight: theme.typography.fontWeightBold,
      color: theme.colors.text.maxContrast
    }),
    timestamp: css({
      fontWeight: theme.typography.fontWeightBold,
      fontSize: theme.typography.bodySmall.fontSize
    })
  };
};
const SeriesTableRow = ({ color, label, value, isActive }) => {
  const styles = useStyles2(getSeriesTableRowStyles);
  return /* @__PURE__ */ React__default.createElement("div", { "data-testid": "SeriesTableRow", className: cx(styles.seriesTableRow, isActive && styles.activeSeries) }, color && /* @__PURE__ */ React__default.createElement("div", { className: styles.seriesTableCell }, /* @__PURE__ */ React__default.createElement(SeriesIcon, { color, className: styles.icon })), label && /* @__PURE__ */ React__default.createElement("div", { className: cx(styles.seriesTableCell, styles.label) }, label), value && /* @__PURE__ */ React__default.createElement("div", { className: cx(styles.seriesTableCell, styles.value) }, value));
};
const SeriesTable = ({ timestamp, series }) => {
  const styles = useStyles2(getSeriesTableRowStyles);
  return /* @__PURE__ */ React__default.createElement(React__default.Fragment, null, timestamp && /* @__PURE__ */ React__default.createElement("div", { className: styles.timestamp, "aria-label": "Timestamp" }, timestamp), series.map((s, i) => {
    return /* @__PURE__ */ React__default.createElement(
      SeriesTableRow,
      {
        isActive: s.isActive,
        label: s.label,
        color: s.color,
        value: s.value,
        key: `${s.label}-${i}`
      }
    );
  }));
};

export { SeriesTable, SeriesTableRow };
//# sourceMappingURL=SeriesTable.js.map
