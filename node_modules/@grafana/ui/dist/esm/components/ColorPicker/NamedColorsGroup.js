import { css } from '@emotion/css';
import { upperFirst } from 'lodash';
import React__default from 'react';
import { useStyles2 } from '../../themes/ThemeContext.js';
import { reverseMap } from '../../utils/reverseMap.js';
import { ColorSwatch, ColorSwatchVariant } from './ColorSwatch.js';

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
const NamedColorsGroup = (_a) => {
  var _b = _a, { hue, selectedColor, onColorSelect } = _b, otherProps = __objRest(_b, ["hue", "selectedColor", "onColorSelect"]);
  const label = upperFirst(hue.name);
  const styles = useStyles2(getStyles);
  return /* @__PURE__ */ React__default.createElement("div", { className: styles.colorRow }, /* @__PURE__ */ React__default.createElement("div", { className: styles.colorLabel }, label), /* @__PURE__ */ React__default.createElement("div", __spreadProps(__spreadValues({}, otherProps), { className: styles.swatchRow }), reverseMap(hue.shades, (shade) => /* @__PURE__ */ React__default.createElement(
    ColorSwatch,
    {
      key: shade.name,
      "aria-label": shade.name,
      variant: shade.primary ? ColorSwatchVariant.Large : ColorSwatchVariant.Small,
      isSelected: shade.name === selectedColor,
      color: shade.color,
      onClick: () => onColorSelect(shade.name)
    }
  ))));
};
const getStyles = (theme) => {
  return {
    colorRow: css({
      display: "grid",
      gridTemplateColumns: "25% 1fr",
      gridColumnGap: theme.spacing(2),
      padding: theme.spacing(0.5, 0),
      "&:hover": {
        background: theme.colors.background.secondary
      }
    }),
    colorLabel: css({
      paddingLeft: theme.spacing(2),
      display: "flex",
      alignItems: "center"
    }),
    swatchRow: css({
      display: "flex",
      gap: theme.spacing(1),
      alignItems: "center",
      justifyContent: "space-around",
      flexDirection: "row"
    })
  };
};

export { NamedColorsGroup as default };
//# sourceMappingURL=NamedColorsGroup.js.map
