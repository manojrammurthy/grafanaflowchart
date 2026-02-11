import { css } from '@emotion/css';
import React__default from 'react';
import '@grafana/data';
import { useStyles2 } from '../../themes/ThemeContext.js';
import 'micro-memoize';
import '@emotion/react';
import 'tinycolor2';
import '../../utils/skeleton.js';

const Divider = ({ direction = "horizontal", spacing = 2 }) => {
  const styles = useStyles2(getStyles, spacing);
  if (direction === "vertical") {
    return /* @__PURE__ */ React__default.createElement("div", { className: styles.verticalDivider });
  } else {
    return /* @__PURE__ */ React__default.createElement("hr", { className: styles.horizontalDivider });
  }
};
Divider.displayName = "Divider";
const getStyles = (theme, spacing) => {
  return {
    horizontalDivider: css({
      borderTop: `1px solid ${theme.colors.border.weak}`,
      margin: theme.spacing(spacing, 0),
      width: "100%"
    }),
    verticalDivider: css({
      borderRight: `1px solid ${theme.colors.border.weak}`,
      margin: theme.spacing(0, spacing),
      height: "100%"
    })
  };
};

export { Divider };
//# sourceMappingURL=Divider.js.map
