import { css } from '@emotion/css';
import React__default from 'react';
import '@grafana/data';
import { useStyles2 } from '../../themes/ThemeContext.js';
import 'micro-memoize';
import '@emotion/react';
import 'tinycolor2';
import '../../utils/skeleton.js';
import { Icon } from '../Icon/Icon.js';
import { DataLinkButton } from './DataLinkButton.js';

function FieldLinkList({ links }) {
  const styles = useStyles2(getStyles);
  if (links.length === 1) {
    return /* @__PURE__ */ React__default.createElement(DataLinkButton, { link: links[0] });
  }
  const externalLinks = links.filter((link) => link.target === "_blank");
  const internalLinks = links.filter((link) => link.target === "_self");
  return /* @__PURE__ */ React__default.createElement(React__default.Fragment, null, internalLinks.map((link, i) => {
    return /* @__PURE__ */ React__default.createElement(DataLinkButton, { key: i, link });
  }), /* @__PURE__ */ React__default.createElement("div", { className: styles.wrapper }, /* @__PURE__ */ React__default.createElement("p", { className: styles.externalLinksHeading }, "External links"), externalLinks.map((link, i) => /* @__PURE__ */ React__default.createElement("a", { key: i, href: link.href, target: link.target, className: styles.externalLink }, /* @__PURE__ */ React__default.createElement(Icon, { name: "external-link-alt" }), link.title))));
}
const getStyles = (theme) => ({
  wrapper: css({
    flexBasis: "150px",
    width: "100px",
    marginTop: theme.spacing(1)
  }),
  externalLinksHeading: css({
    color: theme.colors.text.secondary,
    fontWeight: theme.typography.fontWeightRegular,
    fontSize: theme.typography.size.sm,
    margin: 0
  }),
  externalLink: css({
    color: theme.colors.text.link,
    fontWeight: theme.typography.fontWeightRegular,
    display: "block",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    "&:hover": {
      textDecoration: "underline"
    },
    div: {
      marginRight: theme.spacing(1)
    }
  })
});

export { FieldLinkList };
//# sourceMappingURL=FieldLinkList.js.map
