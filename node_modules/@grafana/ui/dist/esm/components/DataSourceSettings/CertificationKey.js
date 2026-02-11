import React__default from 'react';
import { Button } from '../Button/Button.js';
import '../Button/ButtonGroup.js';
import { InlineField } from '../Forms/InlineField.js';
import { InlineFieldRow } from '../Forms/InlineFieldRow.js';
import { Input } from '../Input/Input.js';
import { TextArea } from '../TextArea/TextArea.js';

const CertificationKey = ({ hasCert, label, onChange, onClick, placeholder }) => {
  return /* @__PURE__ */ React__default.createElement(InlineFieldRow, null, /* @__PURE__ */ React__default.createElement(InlineField, { label, labelWidth: 14, disabled: hasCert }, hasCert ? /* @__PURE__ */ React__default.createElement(Input, { type: "text", value: "configured", width: 24 }) : /* @__PURE__ */ React__default.createElement(TextArea, { rows: 7, onChange, placeholder, required: true })), hasCert && /* @__PURE__ */ React__default.createElement(Button, { variant: "secondary", onClick, style: { marginLeft: 4 } }, "Reset"));
};

export { CertificationKey };
//# sourceMappingURL=CertificationKey.js.map
