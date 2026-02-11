import { cx, css } from '@emotion/css';
import React__default from 'react';
import { renderMarkdown } from '@grafana/data';
import { useTheme2 } from '../../themes/ThemeContext.js';

const getStyles = (theme, height, visible) => {
  return {
    typeaheadItem: css({
      label: "type-ahead-item",
      zIndex: 11,
      padding: theme.spacing(1, 1, 1, 2),
      border: theme.colors.border.medium,
      overflowY: "scroll",
      overflowX: "hidden",
      outline: "none",
      background: theme.colors.background.secondary,
      color: theme.colors.text.secondary,
      boxShadow: `0 0 20px ${theme.v1.colors.dropdownShadow}`,
      visibility: visible === true ? "visible" : "hidden",
      width: "250px",
      minHeight: `${height + parseInt(theme.spacing(0.25), 10)}px`,
      position: "relative",
      wordBreak: "break-word"
    })
  };
};
const TypeaheadInfo = ({ item, height }) => {
  const visible = item && !!item.documentation;
  const label = item ? item.label : "";
  const documentation = renderMarkdown(item == null ? void 0 : item.documentation);
  const theme = useTheme2();
  const styles = getStyles(theme, height, visible);
  return /* @__PURE__ */ React__default.createElement("div", { className: cx([styles.typeaheadItem]) }, /* @__PURE__ */ React__default.createElement("b", null, label), /* @__PURE__ */ React__default.createElement("hr", null), /* @__PURE__ */ React__default.createElement("div", { dangerouslySetInnerHTML: { __html: documentation } }));
};

export { TypeaheadInfo };
//# sourceMappingURL=TypeaheadInfo.js.map
