import { Record } from 'immutable';
import React__default from 'react';
import TOKEN_MARK from './TOKEN_MARK.js';

function defaultOnlyIn(node) {
  return node.object === "block" && node.type === "code_block";
}
function defaultGetSyntax(node) {
  return "javascript";
}
function defaultRenderDecoration(props, editor, next) {
  const { decoration } = props;
  if (decoration.type !== TOKEN_MARK) {
    return next();
  }
  const className = decoration.data.get("className");
  return /* @__PURE__ */ React__default.createElement("span", { className }, props.children);
}
class Options extends Record({
  onlyIn: defaultOnlyIn,
  getSyntax: defaultGetSyntax,
  renderDecoration: defaultRenderDecoration
}) {
  constructor(props) {
    super(props);
  }
}

export { Options as default };
//# sourceMappingURL=options.js.map
