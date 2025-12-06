/**
 * Production logger module with environment-aware logging
 * Suppresses debug-level logs in production while maintaining error logging
 *
 * Requirements: 6.2
 */

/**
 * Log levels in order of severity (lowest to highest)
 */
export const LOG_LEVELS = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
} as const;

export type LogLevel = keyof typeof LOG_LEVELS;

/**
 * Structured log entry format
 */
export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  meta?: Record<string, unknown>;
  error?: {
    name: string;
    message: string;
    stack?: string;
  };
}

/**
 * Logger interface
 */
export interface Logger {
  debug(message: string, meta?: Record<string, unknown>): void;
  info(message: string, meta?: Record<string, unknown>): void;
  warn(message: string, meta?: Record<string, unknown>): void;
  error(message: string, error?: Error, meta?: Record<string, unknown>): void;
}

/**
 * Configuration for the logger
 */
export interface LoggerConfig {
  /** Minimum log level to output */
  minLevel: LogLevel;
  /** Whether to include timestamps */
  includeTimestamp: boolean;
  /** Custom output function (defaults to console) */
  output?: (entry: LogEntry) => void;
}

/**
 * Default configuration based on environment
 */
export function getDefaultConfig(): LoggerConfig {
  const isProduction = process.env.NODE_ENV === 'production';

  return {
    // In production, suppress debug logs (min level is 'info')
    // In development, show all logs (min level is 'debug')
    minLevel: isProduction ? 'info' : 'debug',
    includeTimestamp: true,
  };
}

/**
 * Determines if a log should be output based on the configured minimum level
 */
export function shouldLog(level: LogLevel, minLevel: LogLevel): boolean {
  return LOG_LEVELS[level] >= LOG_LEVELS[minLevel];
}

/**
 * Creates a structured log entry
 */
export function createLogEntry(
  level: LogLevel,
  message: string,
  includeTimestamp: boolean,
  meta?: Record<string, unknown>,
  error?: Error
): LogEntry {
  const entry: LogEntry = {
    timestamp: includeTimestamp ? new Date().toISOString() : '',
    level,
    message,
  };

  if (meta && Object.keys(meta).length > 0) {
    entry.meta = meta;
  }

  if (error) {
    entry.error = {
      name: error.name,
      message: error.message,
      // Only include stack in non-production to avoid exposing internals
      stack: process.env.NODE_ENV !== 'production' ? error.stack : undefined,
    };
  }

  return entry;
}

/**
 * Default output function using console
 */
function defaultOutput(entry: LogEntry): void {
  const prefix = entry.timestamp ? `[${entry.timestamp}]` : '';
  const levelTag = `[${entry.level.toUpperCase()}]`;
  const baseMessage = `${prefix}${levelTag} ${entry.message}`;

  const consoleFn =
    entry.level === 'error'
      ? console.error
      : entry.level === 'warn'
        ? console.warn
        : entry.level === 'debug'
          ? console.debug
          : console.info;

  if (entry.meta || entry.error) {
    consoleFn(baseMessage, { meta: entry.meta, error: entry.error });
  } else {
    consoleFn(baseMessage);
  }
}

/**
 * Creates a logger instance with the given configuration
 */
export function createLogger(config: Partial<LoggerConfig> = {}): Logger {
  const finalConfig: LoggerConfig = {
    ...getDefaultConfig(),
    ...config,
  };

  const output = finalConfig.output || defaultOutput;

  const log = (
    level: LogLevel,
    message: string,
    meta?: Record<string, unknown>,
    error?: Error
  ): void => {
    if (!shouldLog(level, finalConfig.minLevel)) {
      return;
    }

    const entry = createLogEntry(
      level,
      message,
      finalConfig.includeTimestamp,
      meta,
      error
    );
    output(entry);
  };

  return {
    debug: (message, meta) => log('debug', message, meta),
    info: (message, meta) => log('info', message, meta),
    warn: (message, meta) => log('warn', message, meta),
    error: (message, error, meta) => log('error', message, meta, error),
  };
}

/**
 * Default logger instance using environment-based configuration
 */
export const logger = createLogger();
