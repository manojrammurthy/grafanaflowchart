import { css } from '@emotion/css';
import React__default from 'react';
import '@grafana/data';
import { useStyles2 } from '../../../themes/ThemeContext.js';
import 'micro-memoize';
import '@emotion/react';
import 'tinycolor2';
import '../../../utils/skeleton.js';

const TimeZoneGroup = (props) => {
  const { children, label } = props;
  const styles = useStyles2(getStyles);
  if (!label) {
    return /* @__PURE__ */ React__default.createElement("div", null, children);
  }
  return /* @__PURE__ */ React__default.createElement("div", null, /* @__PURE__ */ React__default.createElement("div", { className: styles.header }, /* @__PURE__ */ React__default.createElement("span", { className: styles.label }, label)), children);
};
const getStyles = (theme) => {
  return {
    header: css({
      padding: "7px 10px",
      width: "100%",
      borderTop: `1px solid ${theme.colors.border.weak}`,
      textTransform: "capitalize"
    }),
    label: css({
      fontSize: theme.typography.size.sm,
      color: theme.colors.text.secondary,
      fontWeight: theme.typography.fontWeightMedium
    })
  };
};

export { TimeZoneGroup };
//# sourceMappingURL=TimeZoneGroup.js.map
