import React__default from 'react';

function useCombinedRefs(...refs) {
  const targetRef = React__default.useRef(null);
  React__default.useEffect(() => {
    refs.forEach((ref) => {
      if (!ref) {
        return;
      }
      if (typeof ref === "function") {
        ref(targetRef.current);
      } else {
        ref.current = targetRef.current;
      }
    });
  }, [refs]);
  return targetRef;
}

export { useCombinedRefs };
//# sourceMappingURL=useCombinedRefs.js.map
