import { css } from '@emotion/css';
import React__default from 'react';

const FooterCell = (props) => {
  const cell = css({
    width: "100%",
    listStyle: "none"
  });
  const list = css({
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between"
  });
  if (props.value && !Array.isArray(props.value)) {
    return /* @__PURE__ */ React__default.createElement("span", null, props.value);
  }
  if (props.value && Array.isArray(props.value) && props.value.length > 0) {
    return /* @__PURE__ */ React__default.createElement("ul", { className: cell }, props.value.map((v, i) => {
      const key = Object.keys(v)[0];
      return /* @__PURE__ */ React__default.createElement("li", { className: list, key: i }, /* @__PURE__ */ React__default.createElement("span", null, key), /* @__PURE__ */ React__default.createElement("span", null, v[key]));
    }));
  }
  return EmptyCell;
};
const EmptyCell = () => {
  return /* @__PURE__ */ React__default.createElement("span", null, "\xA0");
};

export { EmptyCell, FooterCell };
//# sourceMappingURL=FooterCell.js.map
