import { css } from '@emotion/css';
import { capitalize } from 'lodash';
import React__default from 'react';
import { formattedValueToString } from '@grafana/data';
import { useStyles2 } from '../../themes/ThemeContext.js';
import { InlineList } from '../List/InlineList.js';

const VizLegendStatsList = ({ stats }) => {
  const styles = useStyles2(getStyles);
  if (stats.length === 0) {
    return null;
  }
  return /* @__PURE__ */ React__default.createElement(
    InlineList,
    {
      className: styles.list,
      items: stats,
      renderItem: (stat) => /* @__PURE__ */ React__default.createElement("div", { className: styles.item, title: stat.description }, stat.title && `${capitalize(stat.title)}:`, " ", formattedValueToString(stat))
    }
  );
};
const getStyles = () => ({
  list: css({
    flexGrow: 1,
    textAlign: "right"
  }),
  item: css({
    marginLeft: "8px"
  })
});
VizLegendStatsList.displayName = "VizLegendStatsList";

export { VizLegendStatsList };
//# sourceMappingURL=VizLegendStatsList.js.map
