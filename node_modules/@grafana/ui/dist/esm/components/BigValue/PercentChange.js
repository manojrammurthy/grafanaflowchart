import React__default from 'react';
import { Icon } from '../Icon/Icon.js';

const PercentChange = ({ percentChange, styles }) => {
  const percentChangeIcon = percentChange && (percentChange > 0 ? "arrow-up" : percentChange < 0 ? "arrow-down" : void 0);
  return /* @__PURE__ */ React__default.createElement("div", { style: styles.containerStyles }, percentChangeIcon && /* @__PURE__ */ React__default.createElement(Icon, { name: percentChangeIcon, height: styles.iconSize, width: styles.iconSize, viewBox: "6 6 12 12" }), percentChangeString(percentChange));
};
const percentChangeString = (percentChange) => {
  var _a;
  return (_a = percentChange == null ? void 0 : percentChange.toLocaleString(void 0, { style: "percent", maximumSignificantDigits: 3 })) != null ? _a : "";
};

export { PercentChange, percentChangeString };
//# sourceMappingURL=PercentChange.js.map
