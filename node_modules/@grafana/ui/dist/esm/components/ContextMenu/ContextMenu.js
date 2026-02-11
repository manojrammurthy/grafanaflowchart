import React__default, { useRef, useState, useLayoutEffect } from 'react';
import { useClickAway } from 'react-use';
import { selectors } from '@grafana/e2e-selectors';
import { Menu } from '../Menu/Menu.js';
import { Portal } from '../Portal/Portal.js';

const ContextMenu = React__default.memo(
  ({ x, y, onClose, focusOnOpen = true, renderMenuItems, renderHeader }) => {
    const menuRef = useRef(null);
    const [positionStyles, setPositionStyles] = useState({});
    useLayoutEffect(() => {
      const menuElement = menuRef.current;
      if (menuElement) {
        const rect = menuElement.getBoundingClientRect();
        const OFFSET = 5;
        const collisions = {
          right: window.innerWidth < x + rect.width,
          bottom: window.innerHeight < y + rect.height + OFFSET
        };
        setPositionStyles({
          position: "fixed",
          left: collisions.right ? x - rect.width - OFFSET : x - OFFSET,
          top: Math.max(0, collisions.bottom ? y - rect.height - OFFSET : y + OFFSET)
        });
      }
    }, [x, y]);
    useClickAway(menuRef, () => {
      onClose == null ? void 0 : onClose();
    });
    const header = renderHeader == null ? void 0 : renderHeader();
    const menuItems = renderMenuItems == null ? void 0 : renderMenuItems();
    const onOpen = (setFocusedItem) => {
      if (focusOnOpen) {
        setFocusedItem(0);
      }
    };
    const onKeyDown = (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        e.stopPropagation();
        onClose == null ? void 0 : onClose();
      }
    };
    return /* @__PURE__ */ React__default.createElement(Portal, null, /* @__PURE__ */ React__default.createElement(
      Menu,
      {
        header,
        ref: menuRef,
        style: positionStyles,
        ariaLabel: selectors.components.Menu.MenuComponent("Context"),
        onOpen,
        onClick: onClose,
        onKeyDown
      },
      menuItems
    ));
  }
);
ContextMenu.displayName = "ContextMenu";

export { ContextMenu };
//# sourceMappingURL=ContextMenu.js.map
