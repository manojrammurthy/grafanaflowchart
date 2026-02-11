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
const SelectOption = (props) => {
  const { children, isSelected, data } = props;
  return /* @__PURE__ */ React__default.createElement(components.Option, __spreadValues({}, props), /* @__PURE__ */ React__default.createElement("div", { className: "gf-form-select-box__desc-option" }, data.imgUrl && /* @__PURE__ */ React__default.createElement("img", { className: "gf-form-select-box__desc-option__img", src: data.imgUrl, alt: "" }), /* @__PURE__ */ React__default.createElement("div", { className: "gf-form-select-box__desc-option__body" }, /* @__PURE__ */ React__default.createElement("div", null, children), data.description && /* @__PURE__ */ React__default.createElement("div", { className: "gf-form-select-box__desc-option__desc" }, data.description)), isSelected && /* @__PURE__ */ React__default.createElement(Icon, { name: "check", "aria-hidden": "true" })));
};

export { SelectOption, SelectOption as default };
//# sourceMappingURL=SelectOption.js.map
