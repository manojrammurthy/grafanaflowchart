import React__default from 'react';
import { InlineSwitch } from '../Switch/Switch.js';
import { InlineField } from '../Forms/InlineField.js';

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
function SecureSocksProxySettings({
  options,
  onOptionsChange
}) {
  var _a;
  return /* @__PURE__ */ React__default.createElement(React__default.Fragment, null, /* @__PURE__ */ React__default.createElement("h3", { className: "page-heading" }, "Secure Socks Proxy"), /* @__PURE__ */ React__default.createElement("div", { className: "gf-form-group" }, /* @__PURE__ */ React__default.createElement("div", { className: "gf-form-inline" }, /* @__PURE__ */ React__default.createElement("div", { className: "gf-form" }, /* @__PURE__ */ React__default.createElement(
    InlineField,
    {
      labelWidth: 26,
      label: "Enabled",
      tooltip: "Connect to this datasource via the secure socks proxy."
    },
    /* @__PURE__ */ React__default.createElement(
      InlineSwitch,
      {
        value: (_a = options.jsonData.enableSecureSocksProxy) != null ? _a : false,
        onChange: (event) => onOptionsChange(__spreadProps(__spreadValues({}, options), {
          jsonData: __spreadProps(__spreadValues({}, options.jsonData), { enableSecureSocksProxy: event.currentTarget.checked })
        }))
      }
    )
  )))));
}

export { SecureSocksProxySettings };
//# sourceMappingURL=SecureSocksProxySettings.js.map
