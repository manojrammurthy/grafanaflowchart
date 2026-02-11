import { cx, css } from '@emotion/css';
import React__default from 'react';
import { FormField } from '../FormField/FormField.js';
import { Icon } from '../Icon/Icon.js';
import { Tooltip } from '../Tooltip/Tooltip.js';
import { CertificationKey } from './CertificationKey.js';

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
const TLSAuthSettings = ({ dataSourceConfig, onChange }) => {
  const hasTLSCACert = dataSourceConfig.secureJsonFields && dataSourceConfig.secureJsonFields.tlsCACert;
  const hasTLSClientCert = dataSourceConfig.secureJsonFields && dataSourceConfig.secureJsonFields.tlsClientCert;
  const hasTLSClientKey = dataSourceConfig.secureJsonFields && dataSourceConfig.secureJsonFields.tlsClientKey;
  const hasServerName = dataSourceConfig.jsonData && dataSourceConfig.jsonData.serverName;
  const onResetClickFactory = (field) => (event) => {
    event.preventDefault();
    const newSecureJsonFields = __spreadValues({}, dataSourceConfig.secureJsonFields);
    newSecureJsonFields[field] = false;
    onChange(__spreadProps(__spreadValues({}, dataSourceConfig), {
      secureJsonFields: newSecureJsonFields
    }));
  };
  const onCertificateChangeFactory = (field) => (event) => {
    const newSecureJsonData = __spreadValues({}, dataSourceConfig.secureJsonData);
    newSecureJsonData[field] = event.currentTarget.value;
    onChange(__spreadProps(__spreadValues({}, dataSourceConfig), {
      secureJsonData: newSecureJsonData
    }));
  };
  const onServerNameLabelChange = (event) => {
    const newJsonData = __spreadProps(__spreadValues({}, dataSourceConfig.jsonData), {
      serverName: event.currentTarget.value
    });
    onChange(__spreadProps(__spreadValues({}, dataSourceConfig), {
      jsonData: newJsonData
    }));
  };
  return /* @__PURE__ */ React__default.createElement("div", { className: "gf-form-group" }, /* @__PURE__ */ React__default.createElement(
    "div",
    {
      className: cx(
        "gf-form",
        css({
          alignItems: "baseline"
        })
      )
    },
    /* @__PURE__ */ React__default.createElement("h6", null, "TLS/SSL Auth Details"),
    /* @__PURE__ */ React__default.createElement(
      Tooltip,
      {
        placement: "right-end",
        content: "TLS/SSL Certs are encrypted and stored in the Grafana database.",
        theme: "info"
      },
      /* @__PURE__ */ React__default.createElement(Icon, { name: "info-circle", size: "xs", style: { marginLeft: "10px" } })
    )
  ), /* @__PURE__ */ React__default.createElement("div", null, dataSourceConfig.jsonData.tlsAuthWithCACert && /* @__PURE__ */ React__default.createElement(
    CertificationKey,
    {
      hasCert: !!hasTLSCACert,
      onChange: onCertificateChangeFactory("tlsCACert"),
      placeholder: "Begins with -----BEGIN CERTIFICATE-----",
      label: "CA Cert",
      onClick: onResetClickFactory("tlsCACert")
    }
  ), dataSourceConfig.jsonData.tlsAuth && /* @__PURE__ */ React__default.createElement(React__default.Fragment, null, /* @__PURE__ */ React__default.createElement("div", { className: "gf-form" }, /* @__PURE__ */ React__default.createElement(
    FormField,
    {
      label: "ServerName",
      labelWidth: 7,
      inputWidth: 30,
      placeholder: "domain.example.com",
      value: hasServerName && dataSourceConfig.jsonData.serverName,
      onChange: onServerNameLabelChange
    }
  )), /* @__PURE__ */ React__default.createElement(
    CertificationKey,
    {
      hasCert: !!hasTLSClientCert,
      label: "Client Cert",
      onChange: onCertificateChangeFactory("tlsClientCert"),
      placeholder: "Begins with -----BEGIN CERTIFICATE-----",
      onClick: onResetClickFactory("tlsClientCert")
    }
  ), /* @__PURE__ */ React__default.createElement(
    CertificationKey,
    {
      hasCert: !!hasTLSClientKey,
      label: "Client Key",
      placeholder: "Begins with -----BEGIN RSA PRIVATE KEY-----",
      onChange: onCertificateChangeFactory("tlsClientKey"),
      onClick: onResetClickFactory("tlsClientKey")
    }
  ))));
};

export { TLSAuthSettings };
//# sourceMappingURL=TLSAuthSettings.js.map
