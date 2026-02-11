import React__default, { useCallback } from 'react';
import { selectors } from '@grafana/e2e-selectors';
import { Select } from '../Select/Select.js';

const weekStarts = [
  { value: "", label: "Default" },
  { value: "saturday", label: "Saturday" },
  { value: "sunday", label: "Sunday" },
  { value: "monday", label: "Monday" }
];
const WeekStartPicker = (props) => {
  var _a;
  const { onChange, width, autoFocus = false, onBlur, value, disabled = false, inputId } = props;
  const onChangeWeekStart = useCallback(
    (selectable) => {
      if (selectable.value !== void 0) {
        onChange(selectable.value);
      }
    },
    [onChange]
  );
  return /* @__PURE__ */ React__default.createElement(
    Select,
    {
      inputId,
      value: (_a = weekStarts.find((item) => item.value === value)) == null ? void 0 : _a.value,
      placeholder: selectors.components.WeekStartPicker.placeholder,
      autoFocus,
      openMenuOnFocus: true,
      width,
      options: weekStarts,
      onChange: onChangeWeekStart,
      onBlur,
      disabled
    }
  );
};

export { WeekStartPicker };
//# sourceMappingURL=WeekStartPicker.js.map
