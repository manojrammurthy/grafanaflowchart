import React__default from 'react';
import { components } from 'react-select';
import { Icon } from '../../../Icon/Icon.js';

var __defProp = Object.defineProperty;
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
const IndicatorsContainer = (props) => {
  const isOpen = props.selectProps.menuIsOpen;
  return /* @__PURE__ */ React__default.createElement(components.IndicatorsContainer, __spreadValues({}, props), /* @__PURE__ */ React__default.createElement(Icon, { name: isOpen ? "angle-up" : "angle-down", style: { marginTop: "7px" } }));
};

export { IndicatorsContainer, IndicatorsContainer as default };
//# sourceMappingURL=IndicatorsContainer.js.map
