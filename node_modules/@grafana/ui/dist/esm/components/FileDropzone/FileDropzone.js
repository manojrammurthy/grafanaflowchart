import { cx, css } from '@emotion/css';
import { isString, uniqueId } from 'lodash';
import React__default, { useState, useCallback } from 'react';
import { useDropzone, ErrorCode } from 'react-dropzone';
import { getValueFormat, formattedValueToString } from '@grafana/data';
import { useTheme2 } from '../../themes/ThemeContext.js';
import 'micro-memoize';
import '@emotion/react';
import 'tinycolor2';
import '../../utils/skeleton.js';
import { Alert } from '../Alert/Alert.js';
import { Icon } from '../Icon/Icon.js';
import { FileListItem } from './FileListItem.js';

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
function FileDropzone({ options, children, readAs, onLoad, fileListRenderer, onFileRemove }) {
  const [files, setFiles] = useState([]);
  const [fileErrors, setErrorMessages] = useState([]);
  const formattedSize = getValueFormat("decbytes")((options == null ? void 0 : options.maxSize) ? options == null ? void 0 : options.maxSize : 0);
  const setFileProperty = useCallback(
    (customFile, action) => {
      setFiles((oldFiles) => {
        return oldFiles.map((oldFile) => {
          if (oldFile.id === customFile.id) {
            action(oldFile);
            return oldFile;
          }
          return oldFile;
        });
      });
    },
    []
  );
  const onDrop = useCallback(
    (acceptedFiles, rejectedFiles, event) => {
      let customFiles = acceptedFiles.map(mapToCustomFile);
      if ((options == null ? void 0 : options.multiple) === false) {
        setFiles(customFiles);
      } else {
        setFiles((oldFiles) => [...oldFiles, ...customFiles]);
      }
      setErrors(rejectedFiles);
      if (options == null ? void 0 : options.onDrop) {
        options.onDrop(acceptedFiles, rejectedFiles, event);
      } else {
        for (const customFile of customFiles) {
          const reader = new FileReader();
          const read = () => {
            if (readAs) {
              reader[readAs](customFile.file);
            } else {
              reader.readAsText(customFile.file);
            }
          };
          setFileProperty(customFile, (fileToModify) => {
            fileToModify.abortUpload = () => {
              reader.abort();
            };
            fileToModify.retryUpload = () => {
              setFileProperty(customFile, (fileToModify2) => {
                fileToModify2.error = null;
                fileToModify2.progress = void 0;
              });
              read();
            };
          });
          reader.onabort = () => {
            setFileProperty(customFile, (fileToModify) => {
              fileToModify.error = new DOMException("Aborted");
            });
          };
          reader.onprogress = (event2) => {
            setFileProperty(customFile, (fileToModify) => {
              fileToModify.progress = event2.loaded;
            });
          };
          reader.onload = () => {
            onLoad == null ? void 0 : onLoad(reader.result);
          };
          reader.onerror = () => {
            setFileProperty(customFile, (fileToModify) => {
              fileToModify.error = reader.error;
            });
          };
          read();
        }
      }
    },
    [onLoad, options, readAs, setFileProperty]
  );
  const removeFile = (file) => {
    const newFiles = files.filter((f) => file.id !== f.id);
    setFiles(newFiles);
    onFileRemove == null ? void 0 : onFileRemove(file);
  };
  const { getRootProps, getInputProps, isDragActive } = useDropzone(__spreadProps(__spreadValues({}, options), {
    useFsAccessApi: false,
    onDrop,
    accept: transformAcceptToNewFormat(options == null ? void 0 : options.accept)
  }));
  const theme = useTheme2();
  const styles = getStyles(theme, isDragActive);
  const fileList = files.map((file) => {
    if (fileListRenderer) {
      return fileListRenderer(file, removeFile);
    }
    return /* @__PURE__ */ React__default.createElement(FileListItem, { key: file.id, file, removeFile });
  });
  const setErrors = (rejectedFiles) => {
    let errors = [];
    rejectedFiles.map((rejectedFile) => {
      rejectedFile.errors.map((newError) => {
        if (errors.findIndex((presentError) => {
          return presentError.code === newError.code && presentError.message === newError.message;
        }) === -1) {
          errors.push(newError);
        }
      });
    });
    setErrorMessages(errors);
  };
  const renderErrorMessages = (errors) => {
    return /* @__PURE__ */ React__default.createElement("div", { className: styles.errorAlert }, /* @__PURE__ */ React__default.createElement(Alert, { title: "Upload failed", severity: "error", onRemove: clearAlert }, errors.map((error) => {
      switch (error.code) {
        case ErrorCode.FileTooLarge:
          return /* @__PURE__ */ React__default.createElement("div", { key: error.message + error.code }, "File is larger than ", formattedValueToString(formattedSize));
        default:
          return /* @__PURE__ */ React__default.createElement("div", { key: error.message + error.code }, error.message);
      }
    })));
  };
  const clearAlert = () => {
    setErrorMessages([]);
  };
  return /* @__PURE__ */ React__default.createElement("div", { className: styles.container }, /* @__PURE__ */ React__default.createElement("div", __spreadValues({ "data-testid": "dropzone" }, getRootProps({ className: styles.dropzone })), /* @__PURE__ */ React__default.createElement("input", __spreadValues({}, getInputProps())), children != null ? children : /* @__PURE__ */ React__default.createElement(FileDropzoneDefaultChildren, { primaryText: getPrimaryText(files, options) })), fileErrors.length > 0 && renderErrorMessages(fileErrors), /* @__PURE__ */ React__default.createElement("small", { className: cx(styles.small, styles.acceptContainer) }, (options == null ? void 0 : options.maxSize) && `Max file size: ${formattedValueToString(formattedSize)}`, (options == null ? void 0 : options.maxSize) && (options == null ? void 0 : options.accept) && /* @__PURE__ */ React__default.createElement("span", { className: styles.acceptSeparator }, "|"), (options == null ? void 0 : options.accept) && getAcceptedFileTypeText(options.accept)), fileList);
}
function getMimeTypeByExtension(ext) {
  if (["txt", "json", "csv", "xls", "yml"].some((e) => ext.match(e))) {
    return "text/plain";
  }
  return "application/octet-stream";
}
function transformAcceptToNewFormat(accept) {
  if (isString(accept)) {
    return {
      [getMimeTypeByExtension(accept)]: [accept]
    };
  }
  if (Array.isArray(accept)) {
    return accept.reduce((prev, current) => {
      const mime = getMimeTypeByExtension(current);
      prev[mime] = prev[mime] ? [...prev[mime], current] : [current];
      return prev;
    }, {});
  }
  return accept;
}
function FileDropzoneDefaultChildren({ primaryText = "Drop file here or click to upload", secondaryText = "" }) {
  const theme = useTheme2();
  const styles = getStyles(theme);
  return /* @__PURE__ */ React__default.createElement("div", { className: cx(styles.defaultDropZone), "data-testid": "file-drop-zone-default-children" }, /* @__PURE__ */ React__default.createElement(Icon, { className: cx(styles.icon), name: "upload", size: "xl" }), /* @__PURE__ */ React__default.createElement("h6", { className: cx(styles.primaryText) }, primaryText), /* @__PURE__ */ React__default.createElement("small", { className: styles.small }, secondaryText));
}
function getPrimaryText(files, options) {
  if ((options == null ? void 0 : options.multiple) === void 0 || (options == null ? void 0 : options.multiple)) {
    return "Upload file";
  }
  return files.length ? "Replace file" : "Upload file";
}
function getAcceptedFileTypeText(accept) {
  if (isString(accept)) {
    return `Accepted file type: ${accept}`;
  }
  if (Array.isArray(accept)) {
    return `Accepted file types: ${accept.join(", ")}`;
  }
  return `Accepted file types: ${Object.values(accept).flat().join(", ")}`;
}
function mapToCustomFile(file) {
  return {
    id: uniqueId("file"),
    file,
    error: null
  };
}
function getStyles(theme, isDragActive) {
  return {
    container: css({
      display: "flex",
      flexDirection: "column",
      width: "100%",
      padding: theme.spacing(2),
      borderRadius: theme.shape.radius.default,
      border: `1px dashed ${theme.colors.border.strong}`,
      backgroundColor: isDragActive ? theme.colors.background.secondary : theme.colors.background.primary,
      cursor: "pointer",
      alignItems: "center",
      justifyContent: "center"
    }),
    dropzone: css({
      height: "100%",
      width: "100%",
      display: "flex",
      flexDirection: "column"
    }),
    defaultDropZone: css({
      textAlign: "center"
    }),
    icon: css({
      marginBottom: theme.spacing(1)
    }),
    primaryText: css({
      marginBottom: theme.spacing(1)
    }),
    acceptContainer: css({
      textAlign: "center",
      margin: 0
    }),
    acceptSeparator: css({
      margin: `0 ${theme.spacing(1)}`
    }),
    small: css({
      color: theme.colors.text.secondary
    }),
    errorAlert: css({
      paddingTop: "10px"
    })
  };
}

export { FileDropzone, FileDropzoneDefaultChildren, getMimeTypeByExtension, transformAcceptToNewFormat };
//# sourceMappingURL=FileDropzone.js.map
