import React, { useMemo } from 'react';
import { Context } from './PluginContext.js';

function DataSourcePluginContextProvider(props) {
  const { children, instanceSettings } = props;
  const value = useMemo(() => {
    return { instanceSettings, meta: instanceSettings.meta };
  }, [instanceSettings]);
  return /* @__PURE__ */ React.createElement(Context.Provider, { value }, children);
}

export { DataSourcePluginContextProvider };
//# sourceMappingURL=DataSourcePluginContextProvider.js.map
