import React__default from 'react';
import { selectors } from '@grafana/e2e-selectors';
import { Trans, t } from '../../../utils/i18n.js';
import { IconButton } from '../../IconButton/IconButton.js';
import { Stack } from '../../Layout/Stack/Stack.js';
import { TimePickerTitle } from './TimePickerTitle.js';

function Header({ onClose }) {
  return /* @__PURE__ */ React__default.createElement(Stack, { justifyContent: "space-between" }, /* @__PURE__ */ React__default.createElement(TimePickerTitle, null, /* @__PURE__ */ React__default.createElement(Trans, { i18nKey: "time-picker.calendar.select-time" }, "Select a time range")), /* @__PURE__ */ React__default.createElement(
    IconButton,
    {
      "data-testid": selectors.components.TimePicker.calendar.closeButton,
      tooltip: t(`time-picker.calendar.close`, "Close calendar"),
      name: "times",
      variant: "secondary",
      onClick: onClose
    }
  ));
}
Header.displayName = "Header";

export { Header };
//# sourceMappingURL=CalendarHeader.js.map
