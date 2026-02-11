import { cx, css } from '@emotion/css';
import React__default from 'react';
import '@grafana/data';
import { useStyles2 } from '../../themes/ThemeContext.js';
import 'micro-memoize';
import '@emotion/react';
import 'tinycolor2';
import '../../utils/skeleton.js';
import { Icon } from '../Icon/Icon.js';
import { Tooltip } from '../Tooltip/Tooltip.js';
import { TitleItem } from './TitleItem.js';

function PanelDescription({ description, className }) {
  const styles = useStyles2(getStyles);
  const getDescriptionContent = () => {
    const panelDescription = typeof description === "function" ? description() : description;
    return /* @__PURE__ */ React__default.createElement("div", { className: "panel-info-content markdown-html" }, /* @__PURE__ */ React__default.createElement("div", { dangerouslySetInnerHTML: { __html: panelDescription } }));
  };
  return description !== "" ? /* @__PURE__ */ React__default.createElement(Tooltip, { interactive: true, content: getDescriptionContent }, /* @__PURE__ */ React__default.createElement(TitleItem, { className: cx(className, styles.description) }, /* @__PURE__ */ React__default.createElement(Icon, { name: "info-circle", size: "md" }))) : null;
}
const getStyles = (theme) => {
  return {
    description: css({
      code: {
        whiteSpace: "normal",
        wordWrap: "break-word"
      },
      "pre > code": {
        display: "block"
      }
    })
  };
};

export { PanelDescription };
//# sourceMappingURL=PanelDescription.js.map
