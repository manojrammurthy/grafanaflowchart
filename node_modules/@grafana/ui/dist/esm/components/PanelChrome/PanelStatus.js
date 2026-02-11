import { css } from '@emotion/css';
import React__default from 'react';
import { selectors } from '@grafana/e2e-selectors';
import '@grafana/data';
import { useStyles2 } from '../../themes/ThemeContext.js';
import 'micro-memoize';
import '@emotion/react';
import 'tinycolor2';
import '../../utils/skeleton.js';
import { ToolbarButton } from '../ToolbarButton/ToolbarButton.js';

function PanelStatus({ message, onClick, ariaLabel = "status" }) {
  const styles = useStyles2(getStyles);
  return /* @__PURE__ */ React__default.createElement(
    ToolbarButton,
    {
      className: styles.buttonStyles,
      onClick,
      variant: "destructive",
      icon: "exclamation-triangle",
      iconSize: "md",
      tooltip: message || "",
      "aria-label": ariaLabel,
      "data-testid": selectors.components.Panels.Panel.status("error")
    }
  );
}
const getStyles = (theme) => {
  const { headerHeight, padding } = theme.components.panel;
  return {
    buttonStyles: css({
      label: "panel-header-state-button",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: theme.spacing(padding),
      width: theme.spacing(headerHeight),
      height: theme.spacing(headerHeight),
      borderRadius: theme.shape.radius.default
    })
  };
};

export { PanelStatus };
//# sourceMappingURL=PanelStatus.js.map
