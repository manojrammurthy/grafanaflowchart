import { cx, css } from '@emotion/css';
import React__default, { memo, forwardRef } from 'react';
import '@grafana/data';
import { useTheme2, useStyles2 } from '../../themes/ThemeContext.js';
import 'micro-memoize';
import '@emotion/react';
import 'tinycolor2';
import { attachSkeleton } from '../../utils/skeleton.js';
import { Tag } from './Tag.js';

var __defProp = Object.defineProperty;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
const TagListComponent = memo(
  forwardRef(
    ({ displayMax, tags, icon, onClick, className, getAriaLabel, getColorIndex }, ref) => {
      const theme = useTheme2();
      const styles = getStyles(theme, Boolean(displayMax && displayMax > 0));
      const numTags = tags.length;
      const tagsToDisplay = displayMax ? tags.slice(0, displayMax) : tags;
      return /* @__PURE__ */ React__default.createElement("ul", { className: cx(styles.wrapper, className), "aria-label": "Tags", ref }, tagsToDisplay.map((tag, i) => /* @__PURE__ */ React__default.createElement("li", { className: styles.li, key: tag }, /* @__PURE__ */ React__default.createElement(
        Tag,
        {
          name: tag,
          icon,
          onClick,
          "aria-label": getAriaLabel == null ? void 0 : getAriaLabel(tag, i),
          "data-tag-id": i,
          colorIndex: getColorIndex == null ? void 0 : getColorIndex(tag, i)
        }
      ))), displayMax && displayMax > 0 && numTags - displayMax > 0 && /* @__PURE__ */ React__default.createElement("span", { className: styles.moreTagsLabel }, "+ ", numTags - displayMax));
    }
  )
);
TagListComponent.displayName = "TagList";
const TagListSkeleton = ({ rootProps }) => {
  const styles = useStyles2(getSkeletonStyles);
  return /* @__PURE__ */ React__default.createElement("div", __spreadValues({ className: styles.container }, rootProps), /* @__PURE__ */ React__default.createElement(Tag.Skeleton, null), /* @__PURE__ */ React__default.createElement(Tag.Skeleton, null));
};
const TagList = attachSkeleton(TagListComponent, TagListSkeleton);
const getSkeletonStyles = (theme) => ({
  container: css({
    display: "flex",
    gap: theme.spacing(1)
  })
});
const getStyles = (theme, isTruncated) => {
  return {
    wrapper: css({
      position: "relative",
      alignItems: isTruncated ? "center" : "unset",
      display: "flex",
      flex: "1 1 auto",
      flexWrap: "wrap",
      flexShrink: isTruncated ? 0 : 1,
      justifyContent: "flex-end",
      gap: "6px"
    }),
    moreTagsLabel: css({
      color: theme.colors.text.secondary,
      fontSize: theme.typography.size.sm
    }),
    li: css({
      listStyle: "none"
    })
  };
};

export { TagList };
//# sourceMappingURL=TagList.js.map
