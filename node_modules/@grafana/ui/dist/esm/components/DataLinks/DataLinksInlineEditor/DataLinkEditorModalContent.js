import React__default, { useState } from 'react';
import { Button } from '../../Button/Button.js';
import '../../Button/ButtonGroup.js';
import { Modal } from '../../Modal/Modal.js';
import { DataLinkEditor } from '../DataLinkEditor.js';

const DataLinkEditorModalContent = ({
  link,
  index,
  getSuggestions,
  onSave,
  onCancel
}) => {
  const [dirtyLink, setDirtyLink] = useState(link);
  return /* @__PURE__ */ React__default.createElement(React__default.Fragment, null, /* @__PURE__ */ React__default.createElement(
    DataLinkEditor,
    {
      value: dirtyLink,
      index,
      isLast: false,
      suggestions: getSuggestions(),
      onChange: (index2, link2) => {
        setDirtyLink(link2);
      }
    }
  ), /* @__PURE__ */ React__default.createElement(Modal.ButtonRow, null, /* @__PURE__ */ React__default.createElement(Button, { variant: "secondary", onClick: () => onCancel(index), fill: "outline" }, "Cancel"), /* @__PURE__ */ React__default.createElement(
    Button,
    {
      onClick: () => {
        onSave(index, dirtyLink);
      }
    },
    "Save"
  )));
};

export { DataLinkEditorModalContent };
//# sourceMappingURL=DataLinkEditorModalContent.js.map
