import { css } from '@emotion/css';
import React__default from 'react';
import '@grafana/data';
import { useStyles2 } from '../../../themes/ThemeContext.js';
import 'micro-memoize';
import '@emotion/react';
import 'tinycolor2';
import '../../../utils/skeleton.js';

const RadioButtonDot = ({
  id,
  name,
  label,
  checked,
  value,
  disabled,
  description,
  onChange
}) => {
  const styles = useStyles2(getStyles);
  return /* @__PURE__ */ React__default.createElement("label", { title: description, className: styles.label }, /* @__PURE__ */ React__default.createElement(
    "input",
    {
      id,
      name,
      type: "radio",
      checked,
      value,
      disabled,
      className: styles.input,
      onChange: () => onChange && onChange(id)
    }
  ), /* @__PURE__ */ React__default.createElement("div", null, label, description && /* @__PURE__ */ React__default.createElement("div", { className: styles.description }, description)));
};
const getStyles = (theme) => ({
  input: css({
    position: "relative",
    appearance: "none",
    outline: "none",
    backgroundColor: theme.colors.background.canvas,
    width: `${theme.spacing(2)} !important`,
    height: theme.spacing(2),
    border: `1px solid ${theme.colors.border.medium}`,
    borderRadius: theme.shape.radius.circle,
    margin: "3px 0",
    ":checked": {
      backgroundColor: theme.v1.palette.white,
      border: `5px solid ${theme.colors.primary.main}`
    },
    ":disabled": {
      backgroundColor: `${theme.colors.action.disabledBackground} !important`,
      borderColor: theme.colors.border.weak
    },
    ":disabled:checked": {
      border: `1px solid ${theme.colors.border.weak}`
    },
    ":disabled:checked::after": {
      content: '""',
      width: "6px",
      height: "6px",
      backgroundColor: theme.colors.text.disabled,
      borderRadius: theme.shape.radius.circle,
      display: "inline-block",
      position: "absolute",
      top: "4px",
      left: "4px"
    },
    ":focus": {
      outline: "none !important",
      boxShadow: `0 0 0 1px ${theme.colors.background.canvas}, 0 0 0 3px ${theme.colors.primary.main}`
    }
  }),
  label: css({
    fontSize: theme.typography.fontSize,
    lineHeight: "22px",
    display: "grid",
    gridTemplateColumns: `${theme.spacing(2)} auto`,
    gap: theme.spacing(1)
  }),
  description: css({
    fontSize: theme.typography.size.sm,
    color: theme.colors.text.secondary
  })
});

export { RadioButtonDot };
//# sourceMappingURL=RadioButtonDot.js.map
