import React__default from 'react';
import { Button } from '../Button/Button.js';
import '../Button/ButtonGroup.js';

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
function DataLinkButton({ link, buttonProps }) {
  return /* @__PURE__ */ React__default.createElement(
    "a",
    {
      href: link.href,
      target: link.target,
      rel: "noreferrer",
      onClick: link.onClick ? (event) => {
        if (!(event.ctrlKey || event.metaKey || event.shiftKey) && link.onClick) {
          event.preventDefault();
          link.onClick(event);
        }
      } : void 0
    },
    /* @__PURE__ */ React__default.createElement(
      Button,
      __spreadValues({
        icon: link.target === "_blank" ? "external-link-alt" : void 0,
        variant: "primary",
        size: "sm"
      }, buttonProps),
      link.title
    )
  );
}

export { DataLinkButton };
//# sourceMappingURL=DataLinkButton.js.map
