import { css } from '@emotion/css';
import React__default from 'react';
import { getValueFromDimension, dateTimeFormat } from '@grafana/data';
import { ContextMenu } from '../../components/ContextMenu/ContextMenu.js';
import { FormattedValueDisplay } from '../../components/FormattedValueDisplay/FormattedValueDisplay.js';
import { HorizontalGroup } from '../../components/Layout/Layout.js';
import { MenuGroup } from '../../components/Menu/MenuGroup.js';
import { MenuItem } from '../../components/Menu/MenuItem.js';
import { SeriesIcon } from '../../components/VizLegend/SeriesIcon.js';
import { useStyles2 } from '../../themes/ThemeContext.js';
import 'micro-memoize';
import '@emotion/react';
import 'tinycolor2';
import '../../utils/skeleton.js';

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
const GraphContextMenu = (_a) => {
  var _b = _a, {
    getContextMenuSource,
    timeZone,
    itemsGroup,
    dimensions,
    contextDimensions
  } = _b, otherProps = __objRest(_b, [
    "getContextMenuSource",
    "timeZone",
    "itemsGroup",
    "dimensions",
    "contextDimensions"
  ]);
  const source = getContextMenuSource();
  const itemsToRender = itemsGroup ? itemsGroup.map((group) => {
    var _a2;
    return __spreadProps(__spreadValues({}, group), {
      items: (_a2 = group.items) == null ? void 0 : _a2.filter((item) => item.label)
    });
  }) : [];
  const renderHeader = () => {
    var _a2;
    if (!source) {
      return null;
    }
    let value;
    if ((dimensions == null ? void 0 : dimensions.yAxis) && ((_a2 = contextDimensions == null ? void 0 : contextDimensions.yAxis) == null ? void 0 : _a2[1])) {
      const valueFromDimensions = getValueFromDimension(
        dimensions.yAxis,
        contextDimensions.yAxis[0],
        contextDimensions.yAxis[1]
      );
      const display = source.series.valueField.display;
      value = display(valueFromDimensions);
    }
    const formattedValue = dateTimeFormat(source.datapoint[0], {
      defaultWithMS: source.series.hasMsResolution,
      timeZone
    });
    return /* @__PURE__ */ React__default.createElement(
      GraphContextMenuHeader,
      {
        timestamp: formattedValue,
        seriesColor: source.series.color,
        displayName: source.series.alias || source.series.label,
        displayValue: value
      }
    );
  };
  const renderMenuGroupItems = () => {
    return itemsToRender == null ? void 0 : itemsToRender.map((group, index) => /* @__PURE__ */ React__default.createElement(MenuGroup, { key: `${group.label}${index}`, label: group.label }, (group.items || []).map((item) => /* @__PURE__ */ React__default.createElement(
      MenuItem,
      {
        key: `${item.label}`,
        url: item.url,
        label: item.label,
        target: item.target,
        icon: item.icon,
        active: item.active,
        onClick: item.onClick
      }
    ))));
  };
  return /* @__PURE__ */ React__default.createElement(ContextMenu, __spreadProps(__spreadValues({}, otherProps), { renderMenuItems: renderMenuGroupItems, renderHeader }));
};
const GraphContextMenuHeader = ({
  timestamp,
  seriesColor,
  displayName,
  displayValue
}) => {
  const styles = useStyles2(getStyles);
  return /* @__PURE__ */ React__default.createElement("div", { className: styles.wrapper }, /* @__PURE__ */ React__default.createElement("strong", null, timestamp), /* @__PURE__ */ React__default.createElement(HorizontalGroup, null, /* @__PURE__ */ React__default.createElement("div", null, /* @__PURE__ */ React__default.createElement(SeriesIcon, { color: seriesColor }), /* @__PURE__ */ React__default.createElement("span", { className: styles.displayName }, displayName)), displayValue && /* @__PURE__ */ React__default.createElement(FormattedValueDisplay, { value: displayValue })));
};
function getStyles(theme) {
  return {
    wrapper: css({
      padding: theme.spacing(0.5, 1),
      fontSize: theme.typography.size.sm,
      zIndex: theme.zIndex.tooltip
    }),
    displayName: css({
      whiteSpace: "nowrap",
      paddingLeft: theme.spacing(0.5)
    })
  };
}

export { GraphContextMenu, GraphContextMenuHeader };
//# sourceMappingURL=GraphContextMenu.js.map
