import { cx, css } from '@emotion/css';
import { uniqueId } from 'lodash';
import React__default, { useState, useRef } from 'react';
import '@grafana/data';
import { useStyles2 } from '../../themes/ThemeContext.js';
import 'micro-memoize';
import '@emotion/react';
import { getFocusStyles } from '../../themes/mixins.js';
import '../../utils/skeleton.js';
import { Icon } from '../Icon/Icon.js';
import { Spinner } from '../Spinner/Spinner.js';

const CollapsableSection = ({
  label,
  isOpen,
  onToggle,
  className,
  contentClassName,
  children,
  labelId,
  loading = false,
  headerDataTestId,
  contentDataTestId
}) => {
  const [open, toggleOpen] = useState(isOpen);
  const styles = useStyles2(collapsableSectionStyles);
  const onClick = (e) => {
    if (e.target instanceof HTMLElement && e.target.tagName === "A") {
      return;
    }
    e.preventDefault();
    e.stopPropagation();
    onToggle == null ? void 0 : onToggle(!open);
    toggleOpen(!open);
  };
  const { current: id } = useRef(uniqueId());
  const buttonLabelId = labelId != null ? labelId : `collapse-label-${id}`;
  return /* @__PURE__ */ React__default.createElement(React__default.Fragment, null, /* @__PURE__ */ React__default.createElement("div", { onClick, className: cx(styles.header, className) }, /* @__PURE__ */ React__default.createElement(
    "button",
    {
      type: "button",
      id: `collapse-button-${id}`,
      className: styles.button,
      onClick,
      "aria-expanded": open && !loading,
      "aria-controls": `collapse-content-${id}`,
      "aria-labelledby": buttonLabelId
    },
    loading ? /* @__PURE__ */ React__default.createElement(Spinner, { className: styles.spinner }) : /* @__PURE__ */ React__default.createElement(Icon, { name: open ? "angle-up" : "angle-down", className: styles.icon })
  ), /* @__PURE__ */ React__default.createElement("div", { className: styles.label, id: `collapse-label-${id}`, "data-testid": headerDataTestId }, label)), open && /* @__PURE__ */ React__default.createElement(
    "div",
    {
      id: `collapse-content-${id}`,
      className: cx(styles.content, contentClassName),
      "data-testid": contentDataTestId
    },
    children
  ));
};
const collapsableSectionStyles = (theme) => ({
  header: css({
    display: "flex",
    cursor: "pointer",
    boxSizing: "border-box",
    flexDirection: "row-reverse",
    position: "relative",
    justifyContent: "space-between",
    fontSize: theme.typography.size.lg,
    padding: `${theme.spacing(0.5)} 0`,
    "&:focus-within": getFocusStyles(theme)
  }),
  button: css({
    all: "unset",
    "&:focus-visible": {
      outline: "none",
      outlineOffset: "unset",
      transition: "none",
      boxShadow: "none"
    }
  }),
  icon: css({
    color: theme.colors.text.secondary
  }),
  content: css({
    padding: `${theme.spacing(2)} 0`
  }),
  spinner: css({
    display: "flex",
    alignItems: "center",
    width: theme.spacing(2)
  }),
  label: css({
    display: "flex"
  })
});

export { CollapsableSection };
//# sourceMappingURL=CollapsableSection.js.map
