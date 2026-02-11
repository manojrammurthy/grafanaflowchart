import { cx, css } from '@emotion/css';
import React__default from 'react';
import { useStyles2 } from '../../themes/ThemeContext.js';

const CallToActionCard = ({ message, callToActionElement, footer, className }) => {
  const css2 = useStyles2(getStyles);
  return /* @__PURE__ */ React__default.createElement("div", { className: cx([css2.wrapper, className]) }, message && /* @__PURE__ */ React__default.createElement("div", { className: css2.message }, message), callToActionElement, footer && /* @__PURE__ */ React__default.createElement("div", { className: css2.footer }, footer));
};
const getStyles = (theme) => ({
  wrapper: css({
    label: "call-to-action-card",
    background: theme.colors.background.secondary,
    borderRadius: theme.shape.radius.default,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    flexGrow: 1,
    padding: theme.spacing(3),
    [theme.breakpoints.down("sm")]: {
      padding: theme.spacing(3, 1)
    }
  }),
  message: css({
    marginBottom: theme.spacing(3),
    fontStyle: "italic"
  }),
  footer: css({
    marginTop: theme.spacing(3)
  })
});

export { CallToActionCard };
//# sourceMappingURL=CallToActionCard.js.map
