/**
 * Structured logging utility
 */

import { LOG_PREFIX } from '../types/constants';

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

let currentLevel: LogLevel = 'info';

export function setLogLevel(level: LogLevel): void {
  currentLevel = level;
}

function shouldLog(level: LogLevel): boolean {
  return LOG_LEVELS[level] >= LOG_LEVELS[currentLevel];
}

export const log = {
  debug(msg: string, ...args: any[]): void {
    if (shouldLog('debug')) {
      console.debug(`${LOG_PREFIX} ${msg}`, ...args);
    }
  },
  info(msg: string, ...args: any[]): void {
    if (shouldLog('info')) {
      console.log(`${LOG_PREFIX} ${msg}`, ...args);
    }
  },
  warn(msg: string, ...args: any[]): void {
    if (shouldLog('warn')) {
      console.warn(`${LOG_PREFIX} ${msg}`, ...args);
    }
  },
  error(msg: string, ...args: any[]): void {
    if (shouldLog('error')) {
      console.error(`${LOG_PREFIX} ${msg}`, ...args);
    }
  },
};
