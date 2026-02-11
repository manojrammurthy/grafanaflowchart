import React__default from 'react';
import { Button } from '../Button/Button.js';
import '../Button/ButtonGroup.js';
import { ConfirmButton } from './ConfirmButton.js';

const DeleteButton = ({ size, disabled, onConfirm, "aria-label": ariaLabel, closeOnConfirm }) => {
  return /* @__PURE__ */ React__default.createElement(
    ConfirmButton,
    {
      confirmText: "Delete",
      confirmVariant: "destructive",
      size: size || "md",
      disabled,
      onConfirm,
      closeOnConfirm
    },
    /* @__PURE__ */ React__default.createElement(Button, { "aria-label": ariaLabel, variant: "destructive", icon: "times", size: size || "sm" })
  );
};

export { DeleteButton };
//# sourceMappingURL=DeleteButton.js.map
