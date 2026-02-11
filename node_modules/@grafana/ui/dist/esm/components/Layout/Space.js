import React__default from 'react';
import { Box } from './Box/Box.js';

const Space = ({ v = 0, h = 0, layout }) => {
  return /* @__PURE__ */ React__default.createElement(Box, { paddingRight: h, paddingBottom: v, display: layout === "inline" ? "inline-block" : "block" });
};

export { Space };
//# sourceMappingURL=Space.js.map
