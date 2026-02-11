import { css } from '@emotion/css';
import React__default from 'react';
import '@grafana/data';
import { useStyles2 } from '../../themes/ThemeContext.js';
import 'micro-memoize';
import '@emotion/react';
import 'tinycolor2';
import '../../utils/skeleton.js';
import { InlineFieldRow } from '../Forms/InlineFieldRow.js';
import { InlineLabel } from '../Forms/InlineLabel.js';

const SegmentSection = ({
  label,
  htmlFor,
  children,
  fill
}) => {
  const styles = useStyles2(getStyles);
  return /* @__PURE__ */ React__default.createElement(React__default.Fragment, null, /* @__PURE__ */ React__default.createElement(InlineFieldRow, null, /* @__PURE__ */ React__default.createElement(InlineLabel, { htmlFor, width: 12, className: styles.label }, label), children, fill && /* @__PURE__ */ React__default.createElement("div", { className: styles.fill }, /* @__PURE__ */ React__default.createElement(InlineLabel, null, ""))));
};
const getStyles = (theme) => ({
  label: css({
    color: theme.colors.primary.text
  }),
  fill: css({
    flexGrow: 1,
    marginBottom: theme.spacing(0.5)
  })
});

export { SegmentSection };
//# sourceMappingURL=SegmentSection.js.map
