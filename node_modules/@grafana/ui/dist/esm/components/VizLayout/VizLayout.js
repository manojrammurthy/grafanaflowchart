import { css } from '@emotion/css';
import React__default from 'react';
import { useMeasure } from 'react-use';
import { useTheme2, useStyles2 } from '../../themes/ThemeContext.js';
import { getFocusStyles } from '../../themes/mixins.js';
import { CustomScrollbar } from '../CustomScrollbar/CustomScrollbar.js';

const VizLayout = ({ width, height, legend, children }) => {
  const theme = useTheme2();
  const styles = useStyles2(getVizStyles);
  const containerStyle = {
    display: "flex",
    width: `${width}px`,
    height: `${height}px`
  };
  const [legendRef, legendMeasure] = useMeasure();
  if (!legend) {
    return /* @__PURE__ */ React__default.createElement(React__default.Fragment, null, /* @__PURE__ */ React__default.createElement("div", { style: containerStyle, className: styles.viz }, children(width, height)));
  }
  let { placement, maxHeight = "35%", maxWidth = "60%" } = legend.props;
  if (document.body.clientWidth < theme.breakpoints.values.lg) {
    placement = "bottom";
  }
  let size = null;
  const legendStyle = {};
  switch (placement) {
    case "bottom":
      containerStyle.flexDirection = "column";
      legendStyle.maxHeight = maxHeight;
      if (legendMeasure.height) {
        size = { width, height: height - legendMeasure.height };
      }
      break;
    case "right":
      containerStyle.flexDirection = "row";
      legendStyle.maxWidth = maxWidth;
      if (legendMeasure.width) {
        size = { width: width - legendMeasure.width, height };
      }
      if (legend.props.width) {
        legendStyle.width = legend.props.width;
        size = { width: width - legend.props.width, height };
      }
      break;
  }
  if ((size == null ? void 0 : size.width) === 0) {
    size.width = width;
  }
  if ((size == null ? void 0 : size.height) === 0) {
    size.height = height;
  }
  return /* @__PURE__ */ React__default.createElement("div", { style: containerStyle }, /* @__PURE__ */ React__default.createElement("div", { className: styles.viz }, size && children(size.width, size.height)), /* @__PURE__ */ React__default.createElement("div", { style: legendStyle, ref: legendRef }, /* @__PURE__ */ React__default.createElement(CustomScrollbar, { hideHorizontalTrack: true }, legend)));
};
const getVizStyles = (theme) => {
  return {
    viz: css({
      flexGrow: 2,
      borderRadius: theme.shape.radius.default,
      "&:focus-visible": getFocusStyles(theme)
    })
  };
};
const VizLayoutLegend = ({ children }) => {
  return /* @__PURE__ */ React__default.createElement(React__default.Fragment, null, children);
};
VizLayout.Legend = VizLayoutLegend;

export { VizLayout, VizLayoutLegend, getVizStyles };
//# sourceMappingURL=VizLayout.js.map
