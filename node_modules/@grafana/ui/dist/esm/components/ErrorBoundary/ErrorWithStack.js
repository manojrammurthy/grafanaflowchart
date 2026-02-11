import { css } from '@emotion/css';
import React__default from 'react';
import '@grafana/data';
import { useStyles2 } from '../../themes/ThemeContext.js';
import 'micro-memoize';
import '@emotion/react';
import 'tinycolor2';
import '../../utils/skeleton.js';

const ErrorWithStack = ({ error, errorInfo, title }) => {
  const style = useStyles2(getStyles);
  return /* @__PURE__ */ React__default.createElement("div", { className: style }, /* @__PURE__ */ React__default.createElement("h2", null, title), /* @__PURE__ */ React__default.createElement("details", { style: { whiteSpace: "pre-wrap" } }, error && error.toString(), /* @__PURE__ */ React__default.createElement("br", null), errorInfo && errorInfo.componentStack));
};
ErrorWithStack.displayName = "ErrorWithStack";
const getStyles = () => {
  return css({
    width: "500px",
    margin: "64px auto"
  });
};

export { ErrorWithStack };
//# sourceMappingURL=ErrorWithStack.js.map
