import { cx, css } from '@emotion/css';
import React__default from 'react';
import '@grafana/data';
import { useStyles2 } from '../../themes/ThemeContext.js';
import 'micro-memoize';
import '@emotion/react';
import 'tinycolor2';
import '../../utils/skeleton.js';

const FullWidthButtonContainer = ({ className, children }) => {
  const styles = useStyles2(getStyles);
  return /* @__PURE__ */ React__default.createElement("div", { className: cx(styles, className) }, children);
};
const getStyles = () => css({
  display: "flex",
  button: {
    flexGrow: 1,
    justifyContent: "center"
  },
  "> *": {
    flexGrow: 1
  },
  label: {
    flexGrow: 1,
    textAlign: "center"
  }
});

export { FullWidthButtonContainer };
//# sourceMappingURL=FullWidthButtonContainer.js.map
