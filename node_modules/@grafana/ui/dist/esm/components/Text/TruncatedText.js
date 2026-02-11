import React__default, { useState, useRef, useImperativeHandle, useMemo, useEffect } from 'react';
import ReactDOMServer from 'react-dom/server';
import { Tooltip } from '../Tooltip/Tooltip.js';

const TruncatedText = React__default.forwardRef(({ childElement, children }, ref) => {
  const [isOverflowing, setIsOverflowing] = useState(false);
  const internalRef = useRef(null);
  useImperativeHandle(ref, () => internalRef.current);
  const resizeObserver = useMemo(
    () => new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.target.clientWidth && entry.target.scrollWidth) {
          if (entry.target.scrollWidth > entry.target.clientWidth) {
            setIsOverflowing(true);
          }
          if (entry.target.scrollWidth <= entry.target.clientWidth) {
            setIsOverflowing(false);
          }
        }
      }
    }),
    []
  );
  useEffect(() => {
    const { current } = internalRef;
    if (current) {
      resizeObserver.observe(current);
    }
    return () => {
      resizeObserver.disconnect();
    };
  }, [setIsOverflowing, resizeObserver]);
  const getTooltipText = (children2) => {
    if (typeof children2 === "string") {
      return children2;
    }
    const html = ReactDOMServer.renderToStaticMarkup(/* @__PURE__ */ React__default.createElement(React__default.Fragment, null, children2));
    return html.replace(/(<([^>]+)>)/gi, "");
  };
  if (isOverflowing) {
    return /* @__PURE__ */ React__default.createElement(Tooltip, { ref: internalRef, content: getTooltipText(children) }, childElement(void 0));
  } else {
    return childElement(internalRef);
  }
});
TruncatedText.displayName = "TruncatedText";

export { TruncatedText };
//# sourceMappingURL=TruncatedText.js.map
