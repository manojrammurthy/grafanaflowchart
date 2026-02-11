import { css } from '@emotion/css';
import React__default, { memo } from 'react';
import '@grafana/data';
import { useStyles2 } from '../../../themes/ThemeContext.js';
import 'micro-memoize';
import '@emotion/react';
import 'tinycolor2';
import '../../../utils/skeleton.js';
import { TimePickerButtonLabel } from '../TimeRangePicker.js';
import { isValidTimeRange } from '../utils.js';

const TimeRangeLabel = memo(function TimePickerLabel({
  hideText,
  value,
  timeZone = "browser",
  placeholder = "No time range selected",
  className
}) {
  const styles = useStyles2(getLabelStyles);
  if (hideText) {
    return null;
  }
  return /* @__PURE__ */ React__default.createElement("span", { className }, isValidTimeRange(value) ? /* @__PURE__ */ React__default.createElement(TimePickerButtonLabel, { value, timeZone }) : /* @__PURE__ */ React__default.createElement("span", { className: styles.placeholder }, placeholder));
});
const getLabelStyles = (theme) => {
  return {
    placeholder: css({
      color: theme.colors.text.disabled,
      opacity: 1
    })
  };
};

export { TimeRangeLabel };
//# sourceMappingURL=TimeRangeLabel.js.map
