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
function AlertingSettings({ options, onOptionsChange }) {
  return /* @__PURE__ */ React__default.createElement(React__default.Fragment, null, /* @__PURE__ */ React__default.createElement("h3", { className: "page-heading" }, "Alerting"), /* @__PURE__ */ React__default.createElement("div", { className: "gf-form-group" }, /* @__PURE__ */ React__default.createElement("div", { className: "gf-form-inline" }, /* @__PURE__ */ React__default.createElement("div", { className: "gf-form" }, /* @__PURE__ */ React__default.createElement(
    InlineField,
    {
      labelWidth: 29,
      label: "Manage alert rules in Alerting UI",
      disabled: options.readOnly,
      tooltip: "Manage alert rules for this data source. To manage other alerting resources, add an Alertmanager data source."
    },
    /* @__PURE__ */ React__default.createElement(
      InlineSwitch,
      {
        value: options.jsonData.manageAlerts !== false,
        onChange: (event) => onOptionsChange(__spreadProps(__spreadValues({}, options), {
          jsonData: __spreadProps(__spreadValues({}, options.jsonData), { manageAlerts: event.currentTarget.checked })
        }))
      }
    )
  )))));
}

export { AlertingSettings };
//# sourceMappingURL=AlertingSettings.js.map
