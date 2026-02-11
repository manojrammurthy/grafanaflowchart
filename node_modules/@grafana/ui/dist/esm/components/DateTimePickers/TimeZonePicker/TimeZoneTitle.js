import { css } from '@emotion/css';
import React__default from 'react';
import '@grafana/data';
import { useStyles2 } from '../../../themes/ThemeContext.js';
import 'micro-memoize';
import '@emotion/react';
import 'tinycolor2';
import '../../../utils/skeleton.js';

const TimeZoneTitle = ({ title }) => {
  const styles = useStyles2(getStyles);
  if (!title) {
    return null;
  }
  return /* @__PURE__ */ React__default.createElement("span", { className: styles.title }, title);
};
const getStyles = (theme) => {
  return {
    title: css({
      fontWeight: theme.typography.fontWeightRegular,
      textOverflow: "ellipsis"
    })
  };
};

export { TimeZoneTitle };
//# sourceMappingURL=TimeZoneTitle.js.map
