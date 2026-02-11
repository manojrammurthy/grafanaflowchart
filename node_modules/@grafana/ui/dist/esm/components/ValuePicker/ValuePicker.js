import React__default, { useState } from 'react';
import { selectors } from '@grafana/e2e-selectors';
import '@grafana/data';
import { useTheme2 } from '../../themes/ThemeContext.js';
import 'micro-memoize';
import '@emotion/react';
import 'tinycolor2';
import '../../utils/skeleton.js';
import { Button } from '../Button/Button.js';
import '../Button/ButtonGroup.js';
import { Select } from '../Select/Select.js';

function ValuePicker({
  "aria-label": ariaLabel,
  label,
  icon,
  options,
  onChange,
  variant,
  minWidth = 16,
  size = "sm",
  isFullWidth = true,
  menuPlacement,
  fill,
  buttonCss
}) {
  const [isPicking, setIsPicking] = useState(false);
  const theme = useTheme2();
  return /* @__PURE__ */ React__default.createElement(React__default.Fragment, null, !isPicking && /* @__PURE__ */ React__default.createElement(
    Button,
    {
      size: size || "sm",
      className: buttonCss,
      icon: icon || "plus",
      onClick: () => setIsPicking(true),
      variant,
      fill,
      fullWidth: isFullWidth,
      "data-testid": selectors.components.ValuePicker.button(ariaLabel != null ? ariaLabel : label)
    },
    label
  ), isPicking && /* @__PURE__ */ React__default.createElement("span", { style: { minWidth: theme.spacing(minWidth), flexGrow: isFullWidth ? 1 : void 0 } }, /* @__PURE__ */ React__default.createElement(
    Select,
    {
      placeholder: label,
      options,
      "aria-label": selectors.components.ValuePicker.select(ariaLabel != null ? ariaLabel : label),
      isOpen: true,
      onCloseMenu: () => setIsPicking(false),
      autoFocus: true,
      onChange: (value) => {
        setIsPicking(false);
        onChange(value);
      },
      menuPlacement
    }
  )));
}

export { ValuePicker };
//# sourceMappingURL=ValuePicker.js.map
