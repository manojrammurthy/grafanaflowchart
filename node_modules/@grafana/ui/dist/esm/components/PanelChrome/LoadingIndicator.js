import { cx, css } from '@emotion/css';
import React__default from 'react';
import { selectors } from '@grafana/e2e-selectors';
import '@grafana/data';
import { useStyles2 } from '../../themes/ThemeContext.js';
import 'micro-memoize';
import '@emotion/react';
import 'tinycolor2';
import '../../utils/skeleton.js';
import { Icon } from '../Icon/Icon.js';
import { Tooltip } from '../Tooltip/Tooltip.js';

const LoadingIndicator = ({ onCancel, loading }) => {
  const styles = useStyles2(getStyles);
  if (!loading) {
    return null;
  }
  return /* @__PURE__ */ React__default.createElement(Tooltip, { content: "Cancel query" }, /* @__PURE__ */ React__default.createElement(
    Icon,
    {
      className: cx("spin-clockwise", { [styles.clickable]: !!onCancel }),
      name: "sync",
      size: "sm",
      onClick: onCancel,
      "data-testid": selectors.components.LoadingIndicator.icon
    }
  ));
};
const getStyles = () => {
  return {
    clickable: css({
      cursor: "pointer"
    })
  };
};

export { LoadingIndicator };
//# sourceMappingURL=LoadingIndicator.js.map
