import React__default, { useState, useEffect } from 'react';

function DelayRender({ children, delay }) {
  const [shouldRender, setShouldRender] = useState(false);
  useEffect(() => {
    window.setTimeout(() => {
      setShouldRender(true);
    }, delay);
  }, [children, delay]);
  return /* @__PURE__ */ React__default.createElement(React__default.Fragment, null, shouldRender ? children : null);
}

export { DelayRender };
//# sourceMappingURL=DelayRender.js.map
