import { css, cx } from '@emotion/css';
import React__default, { useState, useCallback, useId } from 'react';
import { selectors } from '@grafana/e2e-selectors';
import '@grafana/data';
import { useTheme2 } from '../../themes/ThemeContext.js';
import 'micro-memoize';
import '@emotion/react';
import 'tinycolor2';
import '../../utils/skeleton.js';
import { FormField } from '../FormField/FormField.js';
import { InlineFormLabel } from '../FormLabel/FormLabel.js';
import { InlineField } from '../Forms/InlineField.js';
import { Input } from '../Forms/Legacy/Input/Input.js';
import { Icon } from '../Icon/Icon.js';
import { Select } from '../Select/Select.js';
import { InlineSwitch } from '../Switch/Switch.js';
import { TagsInput } from '../TagsInput/TagsInput.js';
import { BasicAuthSettings } from './BasicAuthSettings.js';
import { CustomHeadersSettings } from './CustomHeadersSettings.js';
import { HttpProxySettings } from './HttpProxySettings.js';
import { SecureSocksProxySettings } from './SecureSocksProxySettings.js';
import { TLSAuthSettings } from './TLSAuthSettings.js';

var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
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
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
const ACCESS_OPTIONS = [
  {
    label: "Server (default)",
    value: "proxy"
  },
  {
    label: "Browser",
    value: "direct"
  }
];
const DEFAULT_ACCESS_OPTION = {
  label: "Server (default)",
  value: "proxy"
};
const HttpAccessHelp = () => /* @__PURE__ */ React__default.createElement("div", { className: "grafana-info-box m-t-2" }, /* @__PURE__ */ React__default.createElement("p", null, "Access mode controls how requests to the data source will be handled.", /* @__PURE__ */ React__default.createElement("strong", null, "\xA0", /* @__PURE__ */ React__default.createElement("i", null, "Server")), " ", "should be the preferred way if nothing else is stated."), /* @__PURE__ */ React__default.createElement("div", { className: "alert-title" }, "Server access mode (Default):"), /* @__PURE__ */ React__default.createElement("p", null, "All requests will be made from the browser to Grafana backend/server which in turn will forward the requests to the data source and by that circumvent possible Cross-Origin Resource Sharing (CORS) requirements. The URL needs to be accessible from the grafana backend/server if you select this access mode."), /* @__PURE__ */ React__default.createElement("div", { className: "alert-title" }, "Browser access mode:"), /* @__PURE__ */ React__default.createElement("p", null, "All requests will be made from the browser directly to the data source and may be subject to Cross-Origin Resource Sharing (CORS) requirements. The URL needs to be accessible from the browser if you select this access mode."));
const LABEL_WIDTH = 26;
const DataSourceHttpSettings = (props) => {
  const {
    defaultUrl,
    dataSourceConfig,
    onChange,
    showAccessOptions,
    sigV4AuthToggleEnabled,
    showForwardOAuthIdentityOption,
    azureAuthSettings,
    renderSigV4Editor,
    secureSocksDSProxyEnabled,
    urlLabel,
    urlDocs
  } = props;
  const [isAccessHelpVisible, setIsAccessHelpVisible] = useState(false);
  const [azureAuthEnabled, setAzureAuthEnabled] = useState(false);
  const theme = useTheme2();
  let urlTooltip;
  const onSettingsChange = useCallback(
    (change) => {
      const isAzureAuthEnabled = (azureAuthSettings == null ? void 0 : azureAuthSettings.azureAuthSupported) && azureAuthSettings.getAzureAuthEnabled(dataSourceConfig) || false;
      setAzureAuthEnabled(isAzureAuthEnabled);
      if (isAzureAuthEnabled) {
        const tmpOauthPassThru = dataSourceConfig.jsonData.oauthPassThru !== void 0 ? dataSourceConfig.jsonData.oauthPassThru : false;
        change = __spreadProps(__spreadValues({}, change), {
          jsonData: __spreadProps(__spreadValues({}, dataSourceConfig.jsonData), {
            oauthPassThru: isAzureAuthEnabled ? false : tmpOauthPassThru
          })
        });
      }
      onChange(__spreadValues(__spreadValues({}, dataSourceConfig), change));
    },
    [azureAuthSettings, dataSourceConfig, onChange]
  );
  switch (dataSourceConfig.access) {
    case "direct":
      urlTooltip = /* @__PURE__ */ React__default.createElement(React__default.Fragment, null, "Your access method is ", /* @__PURE__ */ React__default.createElement("em", null, "Browser"), ", this means the URL needs to be accessible from the browser.", urlDocs);
      break;
    case "proxy":
      urlTooltip = /* @__PURE__ */ React__default.createElement(React__default.Fragment, null, "Your access method is ", /* @__PURE__ */ React__default.createElement("em", null, "Server"), ", this means the URL needs to be accessible from the grafana backend/server.", urlDocs);
      break;
    default:
      urlTooltip = /* @__PURE__ */ React__default.createElement(React__default.Fragment, null, "Specify a complete HTTP URL (for example http://your_server:8080) ", urlDocs);
  }
  const accessSelect = /* @__PURE__ */ React__default.createElement(
    Select,
    {
      "aria-label": "Access",
      className: "width-20 gf-form-input",
      options: ACCESS_OPTIONS,
      value: ACCESS_OPTIONS.filter((o) => o.value === dataSourceConfig.access)[0] || DEFAULT_ACCESS_OPTION,
      onChange: (selectedValue) => onSettingsChange({ access: selectedValue.value }),
      disabled: dataSourceConfig.readOnly
    }
  );
  const isValidUrl = /^(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?$/.test(
    dataSourceConfig.url
  );
  const notValidStyle = css({
    boxShadow: `inset 0 0px 5px ${theme.v1.palette.red}`
  });
  const inputStyle = cx({ [`width-20`]: true, [notValidStyle]: !isValidUrl });
  const fromFieldId = useId();
  const urlInput = /* @__PURE__ */ React__default.createElement(
    Input,
    {
      id: fromFieldId,
      className: inputStyle,
      placeholder: defaultUrl,
      value: dataSourceConfig.url,
      "data-testid": selectors.components.DataSource.DataSourceHttpSettings.urlInput,
      onChange: (event) => onSettingsChange({ url: event.currentTarget.value }),
      disabled: dataSourceConfig.readOnly
    }
  );
  return /* @__PURE__ */ React__default.createElement("div", { className: "gf-form-group" }, /* @__PURE__ */ React__default.createElement(React__default.Fragment, null, /* @__PURE__ */ React__default.createElement("h3", { className: "page-heading" }, "HTTP"), /* @__PURE__ */ React__default.createElement("div", { className: "gf-form-group" }, /* @__PURE__ */ React__default.createElement("div", { className: "gf-form" }, /* @__PURE__ */ React__default.createElement(
    FormField,
    {
      interactive: urlDocs ? true : false,
      label: urlLabel != null ? urlLabel : "URL",
      labelWidth: 13,
      tooltip: urlTooltip,
      inputEl: urlInput
    }
  )), showAccessOptions && /* @__PURE__ */ React__default.createElement(React__default.Fragment, null, /* @__PURE__ */ React__default.createElement("div", { className: "gf-form-inline" }, /* @__PURE__ */ React__default.createElement("div", { className: "gf-form" }, /* @__PURE__ */ React__default.createElement(FormField, { label: "Access", labelWidth: 13, inputWidth: 20, inputEl: accessSelect })), /* @__PURE__ */ React__default.createElement("div", { className: "gf-form" }, /* @__PURE__ */ React__default.createElement(
    "button",
    {
      type: "button",
      className: "gf-form-label query-keyword pointer",
      onClick: () => setIsAccessHelpVisible((isVisible) => !isVisible)
    },
    "Help\xA0",
    /* @__PURE__ */ React__default.createElement(Icon, { name: isAccessHelpVisible ? "angle-down" : "angle-right", style: { marginBottom: 0 } })
  ))), isAccessHelpVisible && /* @__PURE__ */ React__default.createElement(HttpAccessHelp, null)), dataSourceConfig.access === "proxy" && /* @__PURE__ */ React__default.createElement("div", { className: "gf-form-group" }, /* @__PURE__ */ React__default.createElement("div", { className: "gf-form" }, /* @__PURE__ */ React__default.createElement(
    InlineFormLabel,
    {
      width: 13,
      tooltip: "Grafana proxy deletes forwarded cookies by default. Specify cookies by name that should be forwarded to the data source."
    },
    "Allowed cookies"
  ), /* @__PURE__ */ React__default.createElement(
    TagsInput,
    {
      tags: dataSourceConfig.jsonData.keepCookies,
      width: 40,
      onChange: (cookies) => onSettingsChange({ jsonData: __spreadProps(__spreadValues({}, dataSourceConfig.jsonData), { keepCookies: cookies }) }),
      disabled: dataSourceConfig.readOnly
    }
  )), /* @__PURE__ */ React__default.createElement("div", { className: "gf-form" }, /* @__PURE__ */ React__default.createElement(
    FormField,
    {
      label: "Timeout",
      type: "number",
      labelWidth: 13,
      inputWidth: 20,
      tooltip: "HTTP request timeout in seconds",
      placeholder: "Timeout in seconds",
      "aria-label": "Timeout in seconds",
      value: dataSourceConfig.jsonData.timeout,
      onChange: (event) => {
        onSettingsChange({
          jsonData: __spreadProps(__spreadValues({}, dataSourceConfig.jsonData), { timeout: parseInt(event.currentTarget.value, 10) })
        });
      },
      disabled: dataSourceConfig.readOnly
    }
  ))))), /* @__PURE__ */ React__default.createElement(React__default.Fragment, null, /* @__PURE__ */ React__default.createElement("h3", { className: "page-heading" }, "Auth"), /* @__PURE__ */ React__default.createElement("div", { className: "gf-form-group" }, /* @__PURE__ */ React__default.createElement("div", { className: "gf-form-inline" }, /* @__PURE__ */ React__default.createElement(InlineField, { label: "Basic auth", labelWidth: LABEL_WIDTH, disabled: dataSourceConfig.readOnly }, /* @__PURE__ */ React__default.createElement(
    InlineSwitch,
    {
      id: "http-settings-basic-auth",
      value: dataSourceConfig.basicAuth,
      onChange: (event) => {
        onSettingsChange({ basicAuth: event.currentTarget.checked });
      }
    }
  )), /* @__PURE__ */ React__default.createElement(
    InlineField,
    {
      label: "With Credentials",
      tooltip: "Whether credentials such as cookies or auth headers should be sent with cross-site requests.",
      labelWidth: LABEL_WIDTH,
      disabled: dataSourceConfig.readOnly
    },
    /* @__PURE__ */ React__default.createElement(
      InlineSwitch,
      {
        id: "http-settings-with-credentials",
        value: dataSourceConfig.withCredentials,
        onChange: (event) => {
          onSettingsChange({ withCredentials: event.currentTarget.checked });
        }
      }
    )
  )), (azureAuthSettings == null ? void 0 : azureAuthSettings.azureAuthSupported) && /* @__PURE__ */ React__default.createElement("div", { className: "gf-form-inline" }, /* @__PURE__ */ React__default.createElement(
    InlineField,
    {
      label: "Azure Authentication",
      tooltip: "Use Azure authentication for Azure endpoint.",
      labelWidth: LABEL_WIDTH,
      disabled: dataSourceConfig.readOnly
    },
    /* @__PURE__ */ React__default.createElement(
      InlineSwitch,
      {
        id: "http-settings-azure-auth",
        value: azureAuthEnabled,
        onChange: (event) => {
          onSettingsChange(
            azureAuthSettings.setAzureAuthEnabled(dataSourceConfig, event.currentTarget.checked)
          );
        }
      }
    )
  )), sigV4AuthToggleEnabled && /* @__PURE__ */ React__default.createElement("div", { className: "gf-form-inline" }, /* @__PURE__ */ React__default.createElement(InlineField, { label: "SigV4 auth", labelWidth: LABEL_WIDTH, disabled: dataSourceConfig.readOnly }, /* @__PURE__ */ React__default.createElement(
    InlineSwitch,
    {
      id: "http-settings-sigv4-auth",
      value: dataSourceConfig.jsonData.sigV4Auth || false,
      onChange: (event) => {
        onSettingsChange({
          jsonData: __spreadProps(__spreadValues({}, dataSourceConfig.jsonData), { sigV4Auth: event.currentTarget.checked })
        });
      }
    }
  ))), dataSourceConfig.access === "proxy" && /* @__PURE__ */ React__default.createElement(
    HttpProxySettings,
    {
      dataSourceConfig,
      onChange: (jsonData) => onSettingsChange({ jsonData }),
      showForwardOAuthIdentityOption: azureAuthEnabled ? false : showForwardOAuthIdentityOption
    }
  )), dataSourceConfig.basicAuth && /* @__PURE__ */ React__default.createElement(React__default.Fragment, null, /* @__PURE__ */ React__default.createElement("h6", null, "Basic Auth Details"), /* @__PURE__ */ React__default.createElement("div", { className: "gf-form-group" }, /* @__PURE__ */ React__default.createElement(BasicAuthSettings, __spreadValues({}, props)))), (azureAuthSettings == null ? void 0 : azureAuthSettings.azureAuthSupported) && azureAuthEnabled && azureAuthSettings.azureSettingsUI && /* @__PURE__ */ React__default.createElement(azureAuthSettings.azureSettingsUI, { dataSourceConfig, onChange }), dataSourceConfig.jsonData.sigV4Auth && sigV4AuthToggleEnabled && renderSigV4Editor, (dataSourceConfig.jsonData.tlsAuth || dataSourceConfig.jsonData.tlsAuthWithCACert) && /* @__PURE__ */ React__default.createElement(TLSAuthSettings, { dataSourceConfig, onChange }), dataSourceConfig.access === "proxy" && /* @__PURE__ */ React__default.createElement(CustomHeadersSettings, { dataSourceConfig, onChange })), secureSocksDSProxyEnabled && /* @__PURE__ */ React__default.createElement(SecureSocksProxySettings, { options: dataSourceConfig, onOptionsChange: onChange }));
};

export { DataSourceHttpSettings };
//# sourceMappingURL=DataSourceHttpSettings.js.map
