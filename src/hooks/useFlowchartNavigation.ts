/**
 * useFlowchartNavigation — manages multi-flowchart tab selection
 */

import { useState, useCallback } from 'react';
import { FlowchartSourceOptions } from '../types/options';

export function useFlowchartNavigation(flowcharts: FlowchartSourceOptions[]) {
  const [activeIndex, setActiveIndex] = useState(0);

  const navigate = useCallback(
    (index: number) => {
      if (index >= 0 && index < flowcharts.length) {
        setActiveIndex(index);
      }
    },
    [flowcharts.length]
  );

  const activeFlowchart = flowcharts[activeIndex] || flowcharts[0];

  return {
    activeIndex,
    activeFlowchart,
    navigate,
    hasMultiple: flowcharts.length > 1,
  };
}
