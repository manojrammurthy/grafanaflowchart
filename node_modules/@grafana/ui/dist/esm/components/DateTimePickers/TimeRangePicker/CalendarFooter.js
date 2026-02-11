import React__default from 'react';
import { Trans } from '../../../utils/i18n.js';
import { Button } from '../../Button/Button.js';
import '../../Button/ButtonGroup.js';
import { Stack } from '../../Layout/Stack/Stack.js';

function Footer({ onClose, onApply }) {
  return /* @__PURE__ */ React__default.createElement(Stack, { gap: 2, justifyContent: "space-between" }, /* @__PURE__ */ React__default.createElement(Button, { variant: "secondary", onClick: onClose }, /* @__PURE__ */ React__default.createElement(Trans, { i18nKey: "time-picker.calendar.cancel-button" }, "Cancel")), /* @__PURE__ */ React__default.createElement(Button, { onClick: onApply }, /* @__PURE__ */ React__default.createElement(Trans, { i18nKey: "time-picker.calendar.apply-button" }, "Apply time range")));
}
Footer.displayName = "Footer";

export { Footer };
//# sourceMappingURL=CalendarFooter.js.map
