import React__default from 'react';
import { Tab } from '../Tabs/Tab.js';
import { TabsBar } from '../Tabs/TabsBar.js';
import { ModalHeader } from './ModalHeader.js';

const ModalTabsHeader = ({ icon, title, tabs, activeTab, onChangeTab }) => {
  return /* @__PURE__ */ React__default.createElement(ModalHeader, { icon, title }, /* @__PURE__ */ React__default.createElement(TabsBar, { hideBorder: true }, tabs.map((t, index) => {
    return /* @__PURE__ */ React__default.createElement(
      Tab,
      {
        key: `${t.value}-${index}`,
        label: t.label,
        icon: t.icon,
        suffix: t.tabSuffix,
        active: t.value === activeTab,
        onChangeTab: () => onChangeTab(t)
      }
    );
  })));
};

export { ModalTabsHeader };
//# sourceMappingURL=ModalTabsHeader.js.map
