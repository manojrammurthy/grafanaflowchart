/**
 * CellAnimator — CSS-based animations for mxGraph cells
 */

import { AnimationType } from '../types/constants';
import { MxGraph, MxGraphCell } from '../types/graph';
import { log } from '../utils/logging';

// Global stylesheet for animations (injected once)
let styleInjected = false;

const ANIMATION_CSS = `
@keyframes fc-blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.2; }
}
@keyframes fc-fade {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}
@keyframes fc-pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}
@keyframes fc-rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
@keyframes fc-flow {
  from { stroke-dashoffset: 24; }
  to { stroke-dashoffset: 0; }
}
.fc-anim-blink { animation: fc-blink var(--fc-duration, 1s) ease-in-out infinite; }
.fc-anim-fade { animation: fc-fade var(--fc-duration, 2s) ease-in-out infinite; }
.fc-anim-pulse { animation: fc-pulse var(--fc-duration, 1s) ease-in-out infinite; }
.fc-anim-rotate { animation: fc-rotate var(--fc-duration, 2s) linear infinite; }
.fc-anim-flow {
  stroke-dasharray: 8 4;
  animation: fc-flow var(--fc-duration, 1s) linear infinite;
}
`;

function injectStyles(): void {
  if (styleInjected) {
    return;
  }
  const style = document.createElement('style');
  style.id = 'fc-animations';
  style.textContent = ANIMATION_CSS;
  document.head.appendChild(style);
  styleInjected = true;
}

/**
 * Apply an animation to a cell's SVG element
 */
export function applyAnimation(
  graph: MxGraph,
  cell: MxGraphCell,
  animation: AnimationType,
  duration = 1000
): void {
  injectStyles();

  const state = graph.view.getState(cell);
  if (!state || !state.shape || !state.shape.node) {
    return;
  }

  const node = state.shape.node as HTMLElement;
  removeAnimation(node);

  node.style.setProperty('--fc-duration', `${duration}ms`);
  node.classList.add(`fc-anim-${animation}`);
}

/**
 * Remove all animations from a cell's SVG element
 */
export function removeAnimation(node: HTMLElement): void {
  node.classList.remove(
    'fc-anim-blink',
    'fc-anim-fade',
    'fc-anim-pulse',
    'fc-anim-rotate',
    'fc-anim-flow'
  );
}

/**
 * Remove all animations from all cells
 */
export function clearAllAnimations(graph: MxGraph): void {
  const container = graph.container;
  const animated = container.querySelectorAll('[class*="fc-anim-"]');
  animated.forEach((el) => removeAnimation(el as HTMLElement));
}

/**
 * Apply animations from cell states
 */
export function applyAnimationsFromStates(
  graph: MxGraph,
  states: Map<string, { animation: AnimationType; duration: number; active: boolean }>,
  model: any
): void {
  injectStyles();

  states.forEach((eventState, cellId) => {
    if (!eventState.active) {
      return;
    }
    const cell = model.cells[cellId];
    if (cell) {
      applyAnimation(graph, cell, eventState.animation, eventState.duration);
    }
  });
}
