import { cx, css } from '@emotion/css';
import React__default from 'react';
import '@grafana/data';
import { useStyles2 } from '../../../themes/ThemeContext.js';
import 'micro-memoize';
import '@emotion/react';
import 'tinycolor2';
import '../../../utils/skeleton.js';
import { isCompactUrl } from '../../../utils/dataLinks.js';
import { FieldValidationMessage } from '../../Forms/FieldValidationMessage.js';
import { IconButton } from '../../IconButton/IconButton.js';

const DataLinksListItem = ({ link, onEdit, onRemove }) => {
  const styles = useStyles2(getDataLinkListItemStyles);
  const { title = "", url = "" } = link;
  const hasTitle = title.trim() !== "";
  const hasUrl = url.trim() !== "";
  const isCompactExploreUrl = isCompactUrl(url);
  return /* @__PURE__ */ React__default.createElement("div", { className: styles.wrapper }, /* @__PURE__ */ React__default.createElement("div", { className: styles.titleWrapper }, /* @__PURE__ */ React__default.createElement("div", { className: cx(styles.url, !hasUrl && styles.notConfigured, isCompactExploreUrl && styles.errored) }, hasTitle ? title : "Data link title not provided"), /* @__PURE__ */ React__default.createElement("div", { className: styles.actionButtons }, /* @__PURE__ */ React__default.createElement(IconButton, { name: "pen", onClick: onEdit, tooltip: "Edit data link title" }), /* @__PURE__ */ React__default.createElement(IconButton, { name: "times", onClick: onRemove, tooltip: "Remove data link title" }))), /* @__PURE__ */ React__default.createElement(
    "div",
    {
      className: cx(styles.url, !hasUrl && styles.notConfigured, isCompactExploreUrl && styles.errored),
      title: url
    },
    hasUrl ? url : "Data link url not provided"
  ), isCompactExploreUrl && /* @__PURE__ */ React__default.createElement(FieldValidationMessage, null, "Explore data link may not work in the future. Please edit."));
};
const getDataLinkListItemStyles = (theme) => {
  return {
    wrapper: css({
      marginBottom: theme.spacing(2),
      width: "100%",
      "&:last-child": {
        marginBottom: 0
      },
      display: "flex",
      flexDirection: "column"
    }),
    titleWrapper: css({
      label: "data-links-list-item-title",
      justifyContent: "space-between",
      display: "flex",
      width: "100%",
      alignItems: "center"
    }),
    actionButtons: css({
      marginLeft: theme.spacing(1),
      display: "flex"
    }),
    errored: css({
      color: theme.colors.error.text,
      fontStyle: "italic"
    }),
    notConfigured: css({
      fontStyle: "italic"
    }),
    title: css({
      color: theme.colors.text.primary,
      fontSize: theme.typography.size.sm,
      fontWeight: theme.typography.fontWeightMedium
    }),
    url: css({
      color: theme.colors.text.secondary,
      fontSize: theme.typography.size.sm,
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
      maxWidth: "90%"
    })
  };
};

export { DataLinksListItem };
//# sourceMappingURL=DataLinksListItem.js.map
