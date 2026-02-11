import React__default, { PureComponent } from 'react';
import { faro } from '@grafana/faro-web-sdk';
import { Alert } from '../Alert/Alert.js';
import { ErrorWithStack } from './ErrorWithStack.js';

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
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
class ErrorBoundary extends PureComponent {
  constructor() {
    super(...arguments);
    __publicField(this, "state", {
      error: null,
      errorInfo: null
    });
  }
  componentDidCatch(error, errorInfo) {
    var _a, _b;
    (_b = (_a = faro) == null ? void 0 : _a.api) == null ? void 0 : _b.pushError(error);
    this.setState({ error, errorInfo });
    if (this.props.onError) {
      this.props.onError(error);
    }
  }
  componentDidUpdate(prevProps) {
    const { dependencies, onRecover } = this.props;
    if (this.state.error) {
      if (dependencies && prevProps.dependencies) {
        for (let i = 0; i < dependencies.length; i++) {
          if (dependencies[i] !== prevProps.dependencies[i]) {
            this.setState({ error: null, errorInfo: null });
            if (onRecover) {
              onRecover();
            }
            break;
          }
        }
      }
    }
  }
  render() {
    const { children } = this.props;
    const { error, errorInfo } = this.state;
    return children({
      error,
      errorInfo
    });
  }
}
class ErrorBoundaryAlert extends PureComponent {
  render() {
    const { title, children, style, dependencies } = this.props;
    return /* @__PURE__ */ React__default.createElement(ErrorBoundary, { dependencies }, ({ error, errorInfo }) => {
      if (!errorInfo) {
        return children;
      }
      if (style === "alertbox") {
        return /* @__PURE__ */ React__default.createElement(Alert, { title: title || "" }, /* @__PURE__ */ React__default.createElement("details", { style: { whiteSpace: "pre-wrap" } }, error && error.toString(), /* @__PURE__ */ React__default.createElement("br", null), errorInfo.componentStack));
      }
      return /* @__PURE__ */ React__default.createElement(ErrorWithStack, { title: title || "", error, errorInfo });
    });
  }
}
__publicField(ErrorBoundaryAlert, "defaultProps", {
  title: "An unexpected error happened",
  style: "alertbox"
});
function withErrorBoundary(Component, errorBoundaryProps = {}) {
  const comp = (props) => /* @__PURE__ */ React__default.createElement(ErrorBoundaryAlert, __spreadValues({}, errorBoundaryProps), /* @__PURE__ */ React__default.createElement(Component, __spreadValues({}, props)));
  comp.displayName = "WithErrorBoundary";
  return comp;
}

export { ErrorBoundary, ErrorBoundaryAlert, withErrorBoundary };
//# sourceMappingURL=ErrorBoundary.js.map
