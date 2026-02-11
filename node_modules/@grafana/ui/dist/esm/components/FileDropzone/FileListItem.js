import { css } from '@emotion/css';
import React__default from 'react';
import { getValueFormat, formattedValueToString } from '@grafana/data';
import { useStyles2 } from '../../themes/ThemeContext.js';
import 'micro-memoize';
import '@emotion/react';
import 'tinycolor2';
import '../../utils/skeleton.js';
import { trimFileName } from '../../utils/file.js';
import { Button } from '../Button/Button.js';
import '../Button/ButtonGroup.js';
import { Icon } from '../Icon/Icon.js';
import { IconButton } from '../IconButton/IconButton.js';

const REMOVE_FILE = "Remove file";
function FileListItem({ file: customFile, removeFile }) {
  const styles = useStyles2(getStyles);
  const { file, progress, error, abortUpload, retryUpload } = customFile;
  const renderRightSide = () => {
    if (error) {
      return /* @__PURE__ */ React__default.createElement(React__default.Fragment, null, /* @__PURE__ */ React__default.createElement("span", { className: styles.error }, error.message), retryUpload && /* @__PURE__ */ React__default.createElement(IconButton, { name: "sync", tooltip: "Retry", tooltipPlacement: "top", onClick: retryUpload }), removeFile && /* @__PURE__ */ React__default.createElement(
        IconButton,
        {
          className: retryUpload ? styles.marginLeft : "",
          name: "trash-alt",
          onClick: () => removeFile(customFile),
          tooltip: REMOVE_FILE
        }
      ));
    }
    if (progress && file.size > progress) {
      return /* @__PURE__ */ React__default.createElement(React__default.Fragment, null, /* @__PURE__ */ React__default.createElement("progress", { className: styles.progressBar, max: file.size, value: progress }), /* @__PURE__ */ React__default.createElement("span", { className: styles.paddingLeft }, Math.round(progress / file.size * 100), "%"), abortUpload && /* @__PURE__ */ React__default.createElement(Button, { variant: "secondary", type: "button", fill: "text", onClick: abortUpload }, "Cancel upload"));
    }
    return removeFile && /* @__PURE__ */ React__default.createElement(
      IconButton,
      {
        name: "trash-alt",
        onClick: () => removeFile(customFile),
        tooltip: REMOVE_FILE,
        tooltipPlacement: "top"
      }
    );
  };
  const valueFormat = getValueFormat("decbytes")(file.size);
  return /* @__PURE__ */ React__default.createElement("div", { className: styles.fileListContainer }, /* @__PURE__ */ React__default.createElement("span", { className: styles.fileNameWrapper }, /* @__PURE__ */ React__default.createElement(Icon, { name: "file-blank", size: "lg", "aria-hidden": true }), /* @__PURE__ */ React__default.createElement("span", { className: styles.padding }, trimFileName(file.name)), /* @__PURE__ */ React__default.createElement("span", null, formattedValueToString(valueFormat))), /* @__PURE__ */ React__default.createElement("div", { className: styles.fileNameWrapper }, renderRightSide()));
}
function getStyles(theme) {
  return {
    fileListContainer: css({
      width: "100%",
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      padding: theme.spacing(2),
      border: `1px dashed ${theme.colors.border.medium}`,
      backgroundColor: `${theme.colors.background.secondary}`,
      marginTop: theme.spacing(1)
    }),
    fileNameWrapper: css({
      display: "flex",
      flexDirection: "row",
      alignItems: "center"
    }),
    padding: css({
      padding: theme.spacing(0, 1)
    }),
    paddingLeft: css({
      paddingLeft: theme.spacing(2)
    }),
    marginLeft: css({
      marginLeft: theme.spacing(1)
    }),
    error: css({
      paddingRight: theme.spacing(2),
      color: theme.colors.error.text
    }),
    progressBar: css({
      borderRadius: theme.shape.radius.default,
      height: "4px",
      "::-webkit-progress-bar": {
        backgroundColor: theme.colors.border.weak,
        borderRadius: theme.shape.radius.default
      },
      "::-webkit-progress-value": {
        backgroundColor: theme.colors.primary.main,
        borderRadius: theme.shape.radius.default
      }
    })
  };
}

export { FileListItem, REMOVE_FILE };
//# sourceMappingURL=FileListItem.js.map
