import React__default from 'react';

const Marker = ({ x, y, children }) => {
  return /* @__PURE__ */ React__default.createElement(
    "div",
    {
      style: {
        position: "absolute",
        top: `${y}px`,
        left: `${x}px`
      }
    },
    children
  );
};

export { Marker };
//# sourceMappingURL=Marker.js.map
