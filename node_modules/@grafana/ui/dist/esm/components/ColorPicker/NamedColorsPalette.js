import { css } from '@emotion/css';
import React__default from 'react';
import { useTheme2, useStyles2 } from '../../themes/ThemeContext.js';
import { ColorSwatch } from './ColorSwatch.js';
import NamedColorsGroup from './NamedColorsGroup.js';

const NamedColorsPalette = ({ color, onChange }) => {
  const theme = useTheme2();
  const styles = useStyles2(getStyles);
  const swatches = [];
  for (const hue of theme.visualization.hues) {
    swatches.push(/* @__PURE__ */ React__default.createElement(NamedColorsGroup, { key: hue.name, selectedColor: color, hue, onColorSelect: onChange }));
  }
  return /* @__PURE__ */ React__default.createElement(React__default.Fragment, null, /* @__PURE__ */ React__default.createElement("div", { className: styles.swatches }, swatches), /* @__PURE__ */ React__default.createElement("div", { className: styles.extraColors }, /* @__PURE__ */ React__default.createElement(
    ColorSwatch,
    {
      isSelected: color === "transparent",
      color: "rgba(0,0,0,0)",
      label: "Transparent",
      onClick: () => onChange("transparent")
    }
  ), /* @__PURE__ */ React__default.createElement(
    ColorSwatch,
    {
      isSelected: color === "text",
      color: theme.colors.text.primary,
      label: "Text color",
      onClick: () => onChange("text")
    }
  )));
};
const getStyles = (theme) => {
  return {
    container: css({
      display: "flex",
      flexDirection: "column"
    }),
    extraColors: css({
      display: "flex",
      alignItems: "center",
      justifyContent: "space-around",
      gap: theme.spacing(1),
      padding: theme.spacing(1, 0)
    }),
    swatches: css({
      display: "grid",
      flexGrow: 1
    })
  };
};

export { NamedColorsPalette };
//# sourceMappingURL=NamedColorsPalette.js.map
