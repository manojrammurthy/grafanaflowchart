import React__default from 'react';
import { EventBusSrv } from '@grafana/data';

const PanelContextRoot = React__default.createContext({
  eventsScope: "global",
  eventBus: new EventBusSrv()
});
const PanelContextProvider = PanelContextRoot.Provider;
const usePanelContext = () => React__default.useContext(PanelContextRoot);

export { PanelContextProvider, PanelContextRoot, usePanelContext };
//# sourceMappingURL=PanelContext.js.map
