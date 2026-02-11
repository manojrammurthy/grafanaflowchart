import { css } from '@emotion/css';
import { cloneDeep } from 'lodash';
import React__default, { useState } from 'react';
import '@grafana/data';
import { useStyles2 } from '../../../themes/ThemeContext.js';
import 'micro-memoize';
import '@emotion/react';
import 'tinycolor2';
import '../../../utils/skeleton.js';
import { Button } from '../../Button/Button.js';
import { Modal } from '../../Modal/Modal.js';
import { DataLinkEditorModalContent } from './DataLinkEditorModalContent.js';
import { DataLinksListItem } from './DataLinksListItem.js';

const DataLinksInlineEditor = ({ links, onChange, getSuggestions, data }) => {
  const [editIndex, setEditIndex] = useState(null);
  const [isNew, setIsNew] = useState(false);
  const styles = useStyles2(getDataLinksInlineEditorStyles);
  const linksSafe = links != null ? links : [];
  const isEditing = editIndex !== null;
  const onDataLinkChange = (index, link) => {
    if (isNew) {
      if (link.title.trim() === "" && link.url.trim() === "") {
        setIsNew(false);
        setEditIndex(null);
        return;
      } else {
        setEditIndex(null);
        setIsNew(false);
      }
    }
    const update = cloneDeep(linksSafe);
    update[index] = link;
    onChange(update);
    setEditIndex(null);
  };
  const onDataLinkAdd = () => {
    let update = cloneDeep(linksSafe);
    setEditIndex(update.length);
    setIsNew(true);
  };
  const onDataLinkCancel = (index) => {
    if (isNew) {
      setIsNew(false);
    }
    setEditIndex(null);
  };
  const onDataLinkRemove = (index) => {
    const update = cloneDeep(linksSafe);
    update.splice(index, 1);
    onChange(update);
  };
  return /* @__PURE__ */ React__default.createElement(React__default.Fragment, null, linksSafe.length > 0 && /* @__PURE__ */ React__default.createElement("div", { className: styles.wrapper }, linksSafe.map((l, i) => {
    return /* @__PURE__ */ React__default.createElement(
      DataLinksListItem,
      {
        key: `${l.title}/${i}`,
        index: i,
        link: l,
        onChange: onDataLinkChange,
        onEdit: () => setEditIndex(i),
        onRemove: () => onDataLinkRemove(i),
        data
      }
    );
  })), isEditing && editIndex !== null && /* @__PURE__ */ React__default.createElement(
    Modal,
    {
      title: "Edit link",
      isOpen: true,
      closeOnBackdropClick: false,
      onDismiss: () => {
        onDataLinkCancel();
      }
    },
    /* @__PURE__ */ React__default.createElement(
      DataLinkEditorModalContent,
      {
        index: editIndex,
        link: isNew ? { title: "", url: "" } : linksSafe[editIndex],
        data,
        onSave: onDataLinkChange,
        onCancel: onDataLinkCancel,
        getSuggestions
      }
    )
  ), /* @__PURE__ */ React__default.createElement(Button, { size: "sm", icon: "plus", onClick: onDataLinkAdd, variant: "secondary" }, "Add link"));
};
const getDataLinksInlineEditorStyles = (theme) => ({
  wrapper: css({
    marginBottom: theme.spacing(2)
  })
});

export { DataLinksInlineEditor };
//# sourceMappingURL=DataLinksInlineEditor.js.map
