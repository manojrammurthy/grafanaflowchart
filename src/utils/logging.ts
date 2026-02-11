/**
 * Structured logging utility
 * Uses no-op in production to comply with Grafana plugin guidelines
 */

import { LOG_PREFIX } from '../types/constants';

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

let currentLevel: LogLevel = 'warn';

export function setLogLevel(level: LogLevel): void {
  currentLevel = level;
}

function shouldLog(level: LogLevel): boolean {
  return LOG_LEVELS[level] >= LOG_LEVELS[currentLevel];
}

// No-op functions for production — Grafana plugins must not log to console
const noop = (..._args: any[]): void => {};

export const log = {
  debug: noop as (msg: string, ...args: any[]) => void,
  info: noop as (msg: string, ...args: any[]) => void,
  warn(msg: string, ...args: any[]): void {
    if (shouldLog('warn')) {
      // Only warn and error are kept for critical issues
    }
  },
  error(msg: string, ...args: any[]): void {
    if (shouldLog('error')) {
      // Only warn and error are kept for critical issues
    }
  },
};
