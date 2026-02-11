import React__default from 'react';
import { TooltipDisplayMode } from '@grafana/schema';
import { MultiModeGraphTooltip } from './MultiModeGraphTooltip.js';
import { SingleModeGraphTooltip } from './SingleModeGraphTooltip.js';

const GraphTooltip = ({
  mode = TooltipDisplayMode.Single,
  dimensions,
  activeDimensions,
  pos,
  timeZone
}) => {
  if (!activeDimensions || !activeDimensions.xAxis) {
    return null;
  }
  if (mode === "single") {
    return /* @__PURE__ */ React__default.createElement(SingleModeGraphTooltip, { dimensions, activeDimensions, timeZone });
  } else {
    return /* @__PURE__ */ React__default.createElement(
      MultiModeGraphTooltip,
      {
        dimensions,
        activeDimensions,
        pos,
        timeZone
      }
    );
  }
};
GraphTooltip.displayName = "GraphTooltip";

export { GraphTooltip };
//# sourceMappingURL=GraphTooltip.js.map
