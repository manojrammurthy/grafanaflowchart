import { cx, css } from '@emotion/css';
import React__default from 'react';
import '@grafana/data';
import { useStyles2 } from '../../themes/ThemeContext.js';
import 'micro-memoize';
import '@emotion/react';
import 'tinycolor2';
import '../../utils/skeleton.js';

const TabsBar = React__default.forwardRef(({ children, className, hideBorder = false }, ref) => {
  const styles = useStyles2(getStyles);
  return /* @__PURE__ */ React__default.createElement("div", { className: cx(styles.tabsWrapper, hideBorder && styles.noBorder, className), ref }, /* @__PURE__ */ React__default.createElement("div", { className: styles.tabs, role: "tablist" }, children));
});
const getStyles = (theme) => ({
  tabsWrapper: css({
    borderBottom: `1px solid ${theme.colors.border.weak}`,
    overflowX: "auto"
  }),
  noBorder: css({
    borderBottom: 0
  }),
  tabs: css({
    position: "relative",
    display: "flex",
    height: `${theme.components.menuTabs.height}px`,
    alignItems: "center"
  })
});
TabsBar.displayName = "TabsBar";

export { TabsBar };
//# sourceMappingURL=TabsBar.js.map
