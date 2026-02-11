import { css } from '@emotion/css';
import React__default, { useMemo } from 'react';

const XYCanvas = ({ children, left, top }) => {
  const className = useMemo(() => {
    return css({
      position: "absolute",
      overflow: "visible",
      left: `${left}px`,
      top: `${top}px`
    });
  }, [left, top]);
  return /* @__PURE__ */ React__default.createElement("div", { className }, children);
};

export { XYCanvas };
//# sourceMappingURL=XYCanvas.js.map
