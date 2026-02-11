import React__default from 'react';
import '../../utils/dom.js';
import '../../utils/colors.js';
import 'slate';
import { getCellLinks } from '../../utils/table.js';
import 'lodash';
import 'ansicolor';
import '../../utils/logger.js';

var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
const DataLinksCell = (props) => {
  const { field, row, cellProps, tableStyles } = props;
  const links = getCellLinks(field, row);
  return /* @__PURE__ */ React__default.createElement("div", __spreadProps(__spreadValues({}, cellProps), { className: tableStyles.cellContainerText }), links && links.map((link, idx) => {
    return (
      // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
      /* @__PURE__ */ React__default.createElement("span", { key: idx, className: tableStyles.cellLink, onClick: link.onClick }, /* @__PURE__ */ React__default.createElement("a", { href: link.href, target: link.target }, link.title))
    );
  }));
};

export { DataLinksCell };
//# sourceMappingURL=DataLinksCell.js.map
