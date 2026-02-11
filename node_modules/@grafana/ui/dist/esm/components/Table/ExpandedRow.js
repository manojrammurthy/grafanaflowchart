import { css } from '@emotion/css';
import React__default from 'react';
import '@grafana/data';
import { useTheme2, useStyles2 } from '../../themes/ThemeContext.js';
import 'micro-memoize';
import '@emotion/react';
import 'tinycolor2';
import '../../utils/skeleton.js';
import { Table } from './Table.js';
import { EXPANDER_WIDTH } from './utils.js';

function ExpandedRow({ tableStyles, nestedData, rowIndex, width, cellHeight }) {
  const frames = nestedData.values;
  const subTables = [];
  const theme = useTheme2();
  const styles = useStyles2(getStyles);
  let top = tableStyles.rowHeight + theme.spacing.gridSize;
  frames[rowIndex].forEach((nf, nfIndex) => {
    var _a, _b;
    const noHeader = !!((_b = (_a = nf.meta) == null ? void 0 : _a.custom) == null ? void 0 : _b.noHeader);
    const height = tableStyles.rowHeight * (nf.length + (noHeader ? 0 : 1));
    const subTable = {
      height,
      paddingLeft: EXPANDER_WIDTH,
      position: "absolute",
      top
    };
    top += height + theme.spacing.gridSize;
    subTables.push(
      /* @__PURE__ */ React__default.createElement("div", { style: subTable, key: `subTable_${rowIndex}_${nfIndex}` }, /* @__PURE__ */ React__default.createElement(
        Table,
        {
          data: nf,
          width: width - EXPANDER_WIDTH,
          height: tableStyles.rowHeight * (nf.length + 1),
          noHeader,
          cellHeight
        }
      ))
    );
  });
  return /* @__PURE__ */ React__default.createElement("div", { className: styles.subTables }, subTables);
}
const getStyles = (theme) => {
  return {
    subTables: css({
      "&:before": {
        content: '""',
        position: "absolute",
        width: "1px",
        top: theme.spacing(5),
        left: theme.spacing(1),
        bottom: theme.spacing(2),
        background: theme.colors.border.medium
      }
    })
  };
};
function getExpandedRowHeight(nestedData, rowIndex, tableStyles) {
  const frames = nestedData.values;
  const height = frames[rowIndex].reduce((acc, frame) => {
    var _a, _b;
    if (frame.length) {
      const noHeader = !!((_b = (_a = frame.meta) == null ? void 0 : _a.custom) == null ? void 0 : _b.noHeader);
      return acc + tableStyles.rowHeight * (frame.length + (noHeader ? 0 : 1)) + 8;
    }
    return acc;
  }, tableStyles.rowHeight);
  return height != null ? height : tableStyles.rowHeight;
}

export { ExpandedRow, getExpandedRowHeight };
//# sourceMappingURL=ExpandedRow.js.map
