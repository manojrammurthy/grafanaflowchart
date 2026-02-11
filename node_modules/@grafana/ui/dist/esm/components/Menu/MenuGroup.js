import { css } from '@emotion/css';
import { uniqueId } from 'lodash';
import React__default from 'react';
import '@grafana/data';
import { useStyles2 } from '../../themes/ThemeContext.js';
import 'micro-memoize';
import '@emotion/react';
import 'tinycolor2';
import '../../utils/skeleton.js';

const MenuGroup = ({ label, ariaLabel, children }) => {
  const styles = useStyles2(getStyles);
  const labelID = `group-label-${uniqueId()}`;
  return /* @__PURE__ */ React__default.createElement("div", { role: "group", "aria-labelledby": !ariaLabel && label ? labelID : void 0, "aria-label": ariaLabel }, label && /* @__PURE__ */ React__default.createElement("label", { id: labelID, className: styles.groupLabel, "aria-hidden": true }, label), children);
};
MenuGroup.displayName = "MenuGroup";
const getStyles = (theme) => {
  return {
    groupLabel: css({
      color: theme.colors.text.secondary,
      fontSize: theme.typography.size.sm,
      padding: theme.spacing(0.5, 1)
    })
  };
};

export { MenuGroup };
//# sourceMappingURL=MenuGroup.js.map
