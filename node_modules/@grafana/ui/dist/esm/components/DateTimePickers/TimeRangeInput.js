import { css, cx } from '@emotion/css';
import React__default, { useState } from 'react';
import { getDefaultTimeRange, dateTime } from '@grafana/data';
import { selectors } from '@grafana/e2e-selectors';
import { useStyles2 } from '../../themes/ThemeContext.js';
import { ClickOutsideWrapper } from '../ClickOutsideWrapper/ClickOutsideWrapper.js';
import { Icon } from '../Icon/Icon.js';
import { getInputStyles } from '../Input/Input.js';
import { TimePickerContent } from './TimeRangePicker/TimePickerContent.js';
import { TimeRangeLabel } from './TimeRangePicker/TimeRangeLabel.js';
import { quickOptions } from './options.js';
import { isValidTimeRange } from './utils.js';

const noop = () => {
};
const TimeRangeInput = ({
  value,
  onChange,
  onChangeTimeZone = noop,
  clearable,
  hideTimeZone = true,
  timeZone = "browser",
  placeholder = "Select time range",
  isReversed = true,
  hideQuickRanges = false,
  disabled = false,
  showIcon = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const styles = useStyles2(getStyles, disabled);
  const onOpen = (event) => {
    event.stopPropagation();
    event.preventDefault();
    if (disabled) {
      return;
    }
    setIsOpen(!isOpen);
  };
  const onClose = () => {
    setIsOpen(false);
  };
  const onRangeChange = (timeRange) => {
    onClose();
    onChange(timeRange);
  };
  const onRangeClear = (event) => {
    event.stopPropagation();
    const from = dateTime(null);
    const to = dateTime(null);
    onChange({ from, to, raw: { from, to } });
  };
  return /* @__PURE__ */ React__default.createElement("div", { className: styles.container }, /* @__PURE__ */ React__default.createElement(
    "button",
    {
      type: "button",
      className: styles.pickerInput,
      "data-testid": selectors.components.TimePicker.openButton,
      onClick: onOpen
    },
    showIcon && /* @__PURE__ */ React__default.createElement(Icon, { name: "clock-nine", size: "sm", className: styles.icon }),
    /* @__PURE__ */ React__default.createElement(TimeRangeLabel, { value, timeZone, placeholder }),
    !disabled && /* @__PURE__ */ React__default.createElement("span", { className: styles.caretIcon }, isValidTimeRange(value) && clearable && /* @__PURE__ */ React__default.createElement(Icon, { className: styles.clearIcon, name: "times", size: "lg", onClick: onRangeClear }), /* @__PURE__ */ React__default.createElement(Icon, { name: isOpen ? "angle-up" : "angle-down", size: "lg" }))
  ), isOpen && /* @__PURE__ */ React__default.createElement(ClickOutsideWrapper, { includeButtonPress: false, onClick: onClose }, /* @__PURE__ */ React__default.createElement(
    TimePickerContent,
    {
      timeZone,
      value: isValidTimeRange(value) ? value : getDefaultTimeRange(),
      onChange: onRangeChange,
      quickOptions,
      onChangeTimeZone,
      className: styles.content,
      hideTimeZone,
      isReversed,
      hideQuickRanges
    }
  )));
};
const getStyles = (theme, disabled = false) => {
  const inputStyles = getInputStyles({ theme, invalid: false });
  return {
    container: css({
      display: "flex",
      position: "relative"
    }),
    content: css({
      marginLeft: 0,
      position: "absolute",
      top: "116%",
      zIndex: theme.zIndex.dropdown
    }),
    pickerInput: cx(
      inputStyles.input,
      disabled && inputStyles.inputDisabled,
      inputStyles.wrapper,
      css({
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        cursor: "pointer",
        paddingRight: 0,
        lineHeight: `${theme.spacing.gridSize * 4 - 2}px`
      })
    ),
    caretIcon: cx(
      inputStyles.suffix,
      css({
        position: "relative",
        top: "-1px",
        marginLeft: theme.spacing(0.5)
      })
    ),
    clearIcon: css({
      marginRight: theme.spacing(0.5),
      "&:hover": {
        color: theme.colors.text.maxContrast
      }
    }),
    placeholder: css({
      color: theme.colors.text.disabled,
      opacity: 1
    }),
    icon: css({
      marginRight: theme.spacing(0.5)
    })
  };
};

export { TimeRangeInput };
//# sourceMappingURL=TimeRangeInput.js.map
