import React__default from 'react';

function getChildId(children) {
  let inputId;
  const child = React__default.Children.only(children);
  if ("id" in (child == null ? void 0 : child.props)) {
    inputId = child.props.id;
  } else if ("inputId" in child.props) {
    inputId = child == null ? void 0 : child.props.inputId;
  }
  return typeof inputId === "string" ? inputId : void 0;
}
function renderOrCallToRender(itemToRender, props) {
  if (React__default.isValidElement(itemToRender) || typeof itemToRender === "string" || typeof itemToRender === "number") {
    return itemToRender;
  }
  if (typeof itemToRender === "function" && props) {
    return itemToRender(props);
  }
  throw new Error(`${itemToRender} is not a React element nor a function that returns React element`);
}

export { getChildId, renderOrCallToRender };
//# sourceMappingURL=reactUtils.js.map
