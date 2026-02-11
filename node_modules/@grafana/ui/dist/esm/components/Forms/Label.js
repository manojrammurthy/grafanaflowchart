import { cx, css } from '@emotion/css';
import React__default from 'react';
import '@grafana/data';
import { useStyles2 } from '../../themes/ThemeContext.js';
import 'micro-memoize';
import '@emotion/react';
import 'tinycolor2';
import '../../utils/skeleton.js';
import { Icon } from '../Icon/Icon.js';

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
var __objRest = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
const Label = (_a) => {
  var _b = _a, { children, description, className, category } = _b, labelProps = __objRest(_b, ["children", "description", "className", "category"]);
  const styles = useStyles2(getLabelStyles);
  const categories = category == null ? void 0 : category.map((c, i) => {
    return /* @__PURE__ */ React__default.createElement("span", { className: styles.categories, key: `${c}/${i}` }, /* @__PURE__ */ React__default.createElement("span", null, c), /* @__PURE__ */ React__default.createElement(Icon, { name: "angle-right", className: styles.chevron }));
  });
  return /* @__PURE__ */ React__default.createElement("div", { className: cx(styles.label, className) }, /* @__PURE__ */ React__default.createElement("label", __spreadValues({}, labelProps), /* @__PURE__ */ React__default.createElement("div", { className: styles.labelContent }, categories, children), description && /* @__PURE__ */ React__default.createElement("span", { className: styles.description }, description)));
};
const getLabelStyles = (theme) => ({
  label: css({
    label: "Label",
    fontSize: theme.typography.size.sm,
    fontWeight: theme.typography.fontWeightMedium,
    lineHeight: 1.25,
    marginBottom: theme.spacing(0.5),
    color: theme.colors.text.primary,
    maxWidth: "480px"
  }),
  labelContent: css({
    display: "flex",
    alignItems: "center"
  }),
  description: css({
    label: "Label-description",
    color: theme.colors.text.secondary,
    fontSize: theme.typography.size.sm,
    fontWeight: theme.typography.fontWeightRegular,
    marginTop: theme.spacing(0.25),
    display: "block"
  }),
  categories: css({
    label: "Label-categories",
    display: "inline-flex",
    alignItems: "center"
  }),
  chevron: css({
    margin: theme.spacing(0, 0.25)
  })
});

export { Label, getLabelStyles };
//# sourceMappingURL=Label.js.map
