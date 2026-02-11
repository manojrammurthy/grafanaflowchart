/**
 * useClickHandler — handles element clicks for link navigation
 */

import { useCallback } from 'react';
import { MxGraphCell } from '../types/graph';
import { CellState } from '../types/state';
import { resolveLinkVariables } from '../utils/variables';
import { log } from '../utils/logging';

interface UseClickHandlerOptions {
  replaceVariables: (str: string) => string;
  cellStates: Map<string, CellState>;
}

export function useClickHandler({ replaceVariables, cellStates }: UseClickHandlerOptions) {
  const handleClick = useCallback(
    (cell: MxGraphCell, event: MouseEvent) => {
      const state = cellStates.get(cell.id);
      if (!state || !state.link) {
        return;
      }

      const resolvedUrl = resolveLinkVariables(
        state.link.url,
        state,
        replaceVariables
      );

      if (!resolvedUrl) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();

      if (resolvedUrl.startsWith('http://') || resolvedUrl.startsWith('https://')) {
        window.open(resolvedUrl, state.link.target || '_blank');
      } else {
        // Internal Grafana link
        try {
          const { getLocationSrv } = require('@grafana/runtime');
          const locationSrv = getLocationSrv();
          locationSrv.update({ path: resolvedUrl });
        } catch {
          window.location.href = resolvedUrl;
        }
      }

      log.debug('Navigated to:', resolvedUrl);
    },
    [replaceVariables, cellStates]
  );

  return { handleClick };
}
