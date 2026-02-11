import { cx, css } from '@emotion/css';
import React__default from 'react';
import { selectors } from '@grafana/e2e-selectors';
import { useStyles2 } from '../../themes/ThemeContext.js';
import { getFocusStyles } from '../../themes/mixins.js';
import { Icon } from '../Icon/Icon.js';
import { IconButton } from '../IconButton/IconButton.js';
import { Link } from '../Link/Link.js';
import { ToolbarButtonRow } from '../ToolbarButton/ToolbarButtonRow.js';

const PageToolbar = React__default.memo(
  ({
    title,
    section,
    parent,
    pageIcon,
    onGoBack,
    children,
    titleHref,
    parentHref,
    leftItems,
    isFullscreen,
    className,
    /** main nav-container aria-label **/
    "aria-label": ariaLabel,
    buttonOverflowAlignment = "right",
    forceShowLeftItems = false
  }) => {
    const styles = useStyles2(getStyles);
    const mainStyle = cx(
      "page-toolbar",
      styles.toolbar,
      {
        ["page-toolbar--fullscreen"]: isFullscreen,
        [styles.noPageIcon]: !pageIcon
      },
      className
    );
    const titleEl = /* @__PURE__ */ React__default.createElement(React__default.Fragment, null, /* @__PURE__ */ React__default.createElement("span", { className: styles.truncateText }, title), section && /* @__PURE__ */ React__default.createElement("span", { className: styles.pre }, " / ", section));
    return /* @__PURE__ */ React__default.createElement("nav", { className: mainStyle, "aria-label": ariaLabel }, /* @__PURE__ */ React__default.createElement("div", { className: styles.leftWrapper }, pageIcon && !onGoBack && /* @__PURE__ */ React__default.createElement("div", { className: styles.pageIcon }, /* @__PURE__ */ React__default.createElement(Icon, { name: pageIcon, size: "lg", "aria-hidden": true })), onGoBack && /* @__PURE__ */ React__default.createElement("div", { className: styles.pageIcon }, /* @__PURE__ */ React__default.createElement(
      IconButton,
      {
        name: "arrow-left",
        tooltip: "Go back (Esc)",
        tooltipPlacement: "bottom",
        size: "xxl",
        "data-testid": selectors.components.BackButton.backArrow,
        onClick: onGoBack
      }
    )), /* @__PURE__ */ React__default.createElement("nav", { "aria-label": "Search links", className: styles.navElement }, parent && parentHref && /* @__PURE__ */ React__default.createElement(React__default.Fragment, null, /* @__PURE__ */ React__default.createElement(
      Link,
      {
        "aria-label": `Search dashboard in the ${parent} folder`,
        className: cx(styles.titleText, styles.parentLink, styles.titleLink, styles.truncateText),
        href: parentHref
      },
      parent,
      " ",
      /* @__PURE__ */ React__default.createElement("span", { className: styles.parentIcon })
    ), titleHref && /* @__PURE__ */ React__default.createElement("span", { className: cx(styles.titleText, styles.titleDivider), "aria-hidden": true }, "/")), (title || Boolean(leftItems == null ? void 0 : leftItems.length)) && /* @__PURE__ */ React__default.createElement("div", { className: styles.titleWrapper }, title && /* @__PURE__ */ React__default.createElement("h1", { className: styles.h1Styles }, titleHref ? /* @__PURE__ */ React__default.createElement(
      Link,
      {
        "aria-label": "Search dashboard by name",
        className: cx(styles.titleText, styles.titleLink),
        href: titleHref
      },
      titleEl
    ) : /* @__PURE__ */ React__default.createElement("div", { className: styles.titleText }, titleEl)), leftItems == null ? void 0 : leftItems.map((child, index) => /* @__PURE__ */ React__default.createElement(
      "div",
      {
        className: cx(styles.leftActionItem, { [styles.forceShowLeftActionItems]: forceShowLeftItems }),
        key: index
      },
      child
    ))))), /* @__PURE__ */ React__default.createElement(ToolbarButtonRow, { alignment: buttonOverflowAlignment }, React__default.Children.toArray(children).filter(Boolean)));
  }
);
PageToolbar.displayName = "PageToolbar";
const getStyles = (theme) => {
  const { spacing, typography } = theme;
  const focusStyle = getFocusStyles(theme);
  return {
    pre: css({
      whiteSpace: "pre"
    }),
    toolbar: css({
      alignItems: "center",
      background: theme.colors.background.canvas,
      display: "flex",
      gap: theme.spacing(2),
      justifyContent: "space-between",
      padding: theme.spacing(1.5, 2),
      [theme.breakpoints.down("md")]: {
        paddingLeft: "53px"
      }
    }),
    noPageIcon: css({
      [theme.breakpoints.down("md")]: {
        paddingLeft: theme.spacing(2)
      }
    }),
    leftWrapper: css({
      display: "flex",
      flexWrap: "nowrap",
      maxWidth: "70%"
    }),
    pageIcon: css({
      display: "none",
      [theme.breakpoints.up("sm")]: {
        display: "flex",
        paddingRight: theme.spacing(1),
        alignItems: "center"
      }
    }),
    truncateText: css({
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap"
    }),
    titleWrapper: css({
      display: "flex",
      margin: 0,
      minWidth: 0
    }),
    navElement: css({
      display: "flex",
      alignItems: "center",
      minWidth: 0
    }),
    h1Styles: css({
      margin: spacing(0, 1, 0, 0),
      lineHeight: "inherit",
      flexGrow: 1,
      minWidth: 0
    }),
    parentIcon: css({
      marginLeft: theme.spacing(0.5)
    }),
    titleText: css({
      display: "flex",
      fontSize: typography.size.lg,
      margin: 0,
      borderRadius: theme.shape.radius.default
    }),
    titleLink: css({
      "&:focus-visible": focusStyle
    }),
    titleDivider: css({
      padding: spacing(0, 0.5, 0, 0.5),
      display: "none",
      [theme.breakpoints.up("md")]: {
        display: "unset"
      }
    }),
    parentLink: css({
      display: "none",
      [theme.breakpoints.up("md")]: {
        display: "unset",
        flex: 1
      }
    }),
    leftActionItem: css({
      display: "none",
      alignItems: "center",
      paddingRight: spacing(0.5),
      [theme.breakpoints.up("md")]: {
        display: "flex"
      }
    }),
    forceShowLeftActionItems: css({
      display: "flex"
    })
  };
};

export { PageToolbar };
//# sourceMappingURL=PageToolbar.js.map
