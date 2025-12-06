/**
 * Property-based tests for production logger
 * **Feature: production-readiness, Property 4: Production Logger Suppression**
 * **Validates: Requirements 6.2**
 */

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import {
  createLogger,
  shouldLog,
  createLogEntry,
  LOG_LEVELS,
  type LogLevel,
  type LogEntry,
} from '../logger';

describe('Production Logger', () => {
  /**
   * **Feature: production-readiness, Property 4: Production Logger Suppression**
   * **Validates: Requirements 6.2**
   *
   * For any log call in production environment (NODE_ENV === 'production'),
   * debug-level logs should be suppressed while error-level logs should still be recorded.
   */
  describe('Property 4: Production Logger Suppression', () => {
    // Arbitrary for generating random log messages
    const messageArb = fc.string({ minLength: 1, maxLength: 200 });

    // Arbitrary for generating random metadata
    const metaArb = fc.option(
      fc.dictionary(fc.string({ minLength: 1, maxLength: 20 }), fc.jsonValue()),
      { nil: undefined }
    );

    // Arbitrary for log levels
    const logLevelArb = fc.constantFrom<LogLevel>(
      'debug',
      'info',
      'warn',
      'error'
    );

    it('should suppress debug logs when minLevel is info (production mode)', () => {
      fc.assert(
        fc.property(messageArb, metaArb, (message, meta) => {
          const logs: LogEntry[] = [];
          const logger = createLogger({
            minLevel: 'info', // Production mode
            output: (entry) => logs.push(entry),
          });

          // Call debug - should be suppressed
          logger.debug(message, meta ?? undefined);

          // No logs should be recorded
          expect(logs).toHaveLength(0);
        }),
        { numRuns: 100 }
      );
    });

    it('should allow error logs when minLevel is info (production mode)', () => {
      fc.assert(
        fc.property(messageArb, metaArb, (message, meta) => {
          const logs: LogEntry[] = [];
          const logger = createLogger({
            minLevel: 'info', // Production mode
            output: (entry) => logs.push(entry),
          });

          // Call error - should be recorded
          logger.error(message, undefined, meta ?? undefined);

          // Error log should be recorded
          expect(logs).toHaveLength(1);
          expect(logs[0].level).toBe('error');
          expect(logs[0].message).toBe(message);
        }),
        { numRuns: 100 }
      );
    });

    it('should allow warn logs when minLevel is info (production mode)', () => {
      fc.assert(
        fc.property(messageArb, metaArb, (message, meta) => {
          const logs: LogEntry[] = [];
          const logger = createLogger({
            minLevel: 'info', // Production mode
            output: (entry) => logs.push(entry),
          });

          // Call warn - should be recorded
          logger.warn(message, meta ?? undefined);

          // Warn log should be recorded
          expect(logs).toHaveLength(1);
          expect(logs[0].level).toBe('warn');
          expect(logs[0].message).toBe(message);
        }),
        { numRuns: 100 }
      );
    });

    it('should allow info logs when minLevel is info (production mode)', () => {
      fc.assert(
        fc.property(messageArb, metaArb, (message, meta) => {
          const logs: LogEntry[] = [];
          const logger = createLogger({
            minLevel: 'info', // Production mode
            output: (entry) => logs.push(entry),
          });

          // Call info - should be recorded
          logger.info(message, meta ?? undefined);

          // Info log should be recorded
          expect(logs).toHaveLength(1);
          expect(logs[0].level).toBe('info');
          expect(logs[0].message).toBe(message);
        }),
        { numRuns: 100 }
      );
    });

    it('should allow all log levels when minLevel is debug (development mode)', () => {
      fc.assert(
        fc.property(messageArb, logLevelArb, (message, level) => {
          const logs: LogEntry[] = [];
          const logger = createLogger({
            minLevel: 'debug', // Development mode
            output: (entry) => logs.push(entry),
          });

          // Call the appropriate log method
          if (level === 'debug') logger.debug(message);
          else if (level === 'info') logger.info(message);
          else if (level === 'warn') logger.warn(message);
          else logger.error(message);

          // All logs should be recorded in development mode
          expect(logs).toHaveLength(1);
          expect(logs[0].level).toBe(level);
          expect(logs[0].message).toBe(message);
        }),
        { numRuns: 100 }
      );
    });

    it('shouldLog correctly determines if a log level meets the minimum threshold', () => {
      fc.assert(
        fc.property(logLevelArb, logLevelArb, (level, minLevel) => {
          const result = shouldLog(level, minLevel);
          const expected = LOG_LEVELS[level] >= LOG_LEVELS[minLevel];
          expect(result).toBe(expected);
        }),
        { numRuns: 100 }
      );
    });

    it('should create structured log entries with correct format', () => {
      fc.assert(
        fc.property(logLevelArb, messageArb, (level, message) => {
          const entry = createLogEntry(level, message, true);

          expect(entry.level).toBe(level);
          expect(entry.message).toBe(message);
          expect(entry.timestamp).toBeTruthy();
          // Timestamp should be ISO format
          expect(() => new Date(entry.timestamp)).not.toThrow();
        }),
        { numRuns: 100 }
      );
    });

    it('should include metadata in log entries when provided', () => {
      // Generate non-empty metadata objects
      const nonEmptyMetaArb = fc
        .dictionary(
          fc.string({ minLength: 1, maxLength: 20 }),
          fc.jsonValue(),
          {
            minKeys: 1,
          }
        )
        .filter((obj) => Object.keys(obj).length > 0);

      fc.assert(
        fc.property(
          logLevelArb,
          messageArb,
          nonEmptyMetaArb,
          (level, message, meta) => {
            const entry = createLogEntry(level, message, true, meta);

            expect(entry.meta).toBeDefined();
            expect(entry.meta).toEqual(meta);
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});
