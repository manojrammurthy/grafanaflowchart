import { css } from '@emotion/css';
import { FocusScope } from '@react-aria/focus';
import React__default, { Component } from 'react';
import { colorManipulator } from '@grafana/data';
import { withTheme2 } from '../../themes/ThemeContext.js';
import { stylesFactory } from '../../themes/stylesFactory.js';
import '@emotion/react';
import 'tinycolor2';
import '../../utils/skeleton.js';
import { NamedColorsPalette } from './NamedColorsPalette.js';
import SpectrumPalette from './SpectrumPalette.js';

var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
class UnThemedColorPickerPopover extends Component {
  constructor(props) {
    super(props);
    __publicField(this, "getTabClassName", (tabName) => {
      const { activePicker } = this.state;
      return `ColorPickerPopover__tab ${activePicker === tabName && "ColorPickerPopover__tab--active"}`;
    });
    __publicField(this, "handleChange", (color) => {
      const { onChange, enableNamedColors, theme } = this.props;
      if (enableNamedColors) {
        return onChange(color);
      }
      onChange(colorManipulator.asHexString(theme.visualization.getColorByName(color)));
    });
    __publicField(this, "onTabChange", (tab) => {
      return () => this.setState({ activePicker: tab });
    });
    __publicField(this, "renderPicker", () => {
      const { activePicker } = this.state;
      const { color } = this.props;
      switch (activePicker) {
        case "spectrum":
          return /* @__PURE__ */ React__default.createElement(SpectrumPalette, { color, onChange: this.handleChange });
        case "palette":
          return /* @__PURE__ */ React__default.createElement(NamedColorsPalette, { color, onChange: this.handleChange });
        default:
          return this.renderCustomPicker(activePicker);
      }
    });
    __publicField(this, "renderCustomPicker", (tabKey) => {
      const { customPickers, color, theme } = this.props;
      if (!customPickers) {
        return null;
      }
      return React__default.createElement(customPickers[tabKey].tabComponent, {
        color,
        theme,
        onChange: this.handleChange
      });
    });
    __publicField(this, "renderCustomPickerTabs", () => {
      const { customPickers } = this.props;
      if (!customPickers) {
        return null;
      }
      return /* @__PURE__ */ React__default.createElement(React__default.Fragment, null, Object.keys(customPickers).map((key) => {
        return /* @__PURE__ */ React__default.createElement("button", { className: this.getTabClassName(key), onClick: this.onTabChange(key), key, type: "button" }, customPickers[key].name);
      }));
    });
    this.state = {
      activePicker: "palette"
    };
  }
  render() {
    const { theme } = this.props;
    const styles = getStyles(theme);
    return /* @__PURE__ */ React__default.createElement(FocusScope, { contain: true, restoreFocus: true, autoFocus: true }, /* @__PURE__ */ React__default.createElement("div", { tabIndex: -1, className: styles.colorPickerPopover }, /* @__PURE__ */ React__default.createElement("div", { className: styles.colorPickerPopoverTabs }, /* @__PURE__ */ React__default.createElement("button", { className: this.getTabClassName("palette"), onClick: this.onTabChange("palette"), type: "button" }, "Colors"), /* @__PURE__ */ React__default.createElement("button", { className: this.getTabClassName("spectrum"), onClick: this.onTabChange("spectrum"), type: "button" }, "Custom"), this.renderCustomPickerTabs()), /* @__PURE__ */ React__default.createElement("div", { className: styles.colorPickerPopoverContent }, this.renderPicker())));
  }
}
const ColorPickerPopover = withTheme2(UnThemedColorPickerPopover);
ColorPickerPopover.displayName = "ColorPickerPopover";
const getStyles = stylesFactory((theme) => {
  return {
    colorPickerPopover: css({
      borderRadius: theme.shape.radius.default,
      boxShadow: theme.shadows.z3,
      background: theme.colors.background.primary,
      border: `1px solid ${theme.colors.border.weak}`,
      ".ColorPickerPopover__tab": {
        width: "50%",
        textAlign: "center",
        padding: theme.spacing(1, 0),
        background: theme.colors.background.secondary,
        color: theme.colors.text.secondary,
        fontSize: theme.typography.bodySmall.fontSize,
        cursor: "pointer",
        border: "none",
        "&:focus:not(:focus-visible)": {
          outline: "none",
          boxShadow: "none"
        },
        ":focus-visible": {
          position: "relative"
        }
      },
      ".ColorPickerPopover__tab--active": {
        color: theme.colors.text.primary,
        fontWeight: theme.typography.fontWeightMedium,
        background: theme.colors.background.primary
      }
    }),
    colorPickerPopoverContent: css({
      width: "246px",
      fontSize: theme.typography.bodySmall.fontSize,
      minHeight: "184px",
      padding: theme.spacing(1),
      display: "flex",
      flexDirection: "column"
    }),
    colorPickerPopoverTabs: css({
      display: "flex",
      width: "100%",
      borderRadius: `${theme.shape.radius.default} ${theme.shape.radius.default} 0 0`
    })
  };
});

export { ColorPickerPopover };
//# sourceMappingURL=ColorPickerPopover.js.map
