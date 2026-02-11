import React__default from 'react';
import '@grafana/data';
import { useStyles2 } from '../../themes/ThemeContext.js';
import 'micro-memoize';
import '@emotion/react';
import 'tinycolor2';
import '../../utils/skeleton.js';
import { getModalStyles } from './getModalStyles.js';

const ModalHeader = ({ icon, iconTooltip, title, children, id }) => {
  const styles = useStyles2(getModalStyles);
  return /* @__PURE__ */ React__default.createElement(React__default.Fragment, null, /* @__PURE__ */ React__default.createElement("h2", { className: styles.modalHeaderTitle, id }, title), children);
};

export { ModalHeader };
//# sourceMappingURL=ModalHeader.js.map
