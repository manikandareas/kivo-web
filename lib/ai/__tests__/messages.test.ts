/**
 * Property-based tests for message transformation utilities
 * **Feature: ai-chat-api, Property 3: Message Format Transformation**
 * **Feature: ai-chat-api, Property 4: Context Truncation Preservation**
 */

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import {
  convertToModelMessage,
  convertToModelMessages,
  truncateMessages,
  DEFAULT_CONTEXT_LIMIT,
} from '../messages';
import type { ChatMessage } from '../validation';

/**
 * Arbitrary for valid ChatMessage
 */
const chatMessageArb: fc.Arbitrary<ChatMessage> = fc.record({
  id: fc.string({ minLength: 1 }),
  role: fc.constantFrom('user' as const, 'assistant' as const),
  content: fc.string({ minLength: 1 }),
  parts: fc.option(
    fc.array(
      fc.record({
        type: fc.constant('text' as const),
        text: fc.string(),
      })
    ),
    { nil: undefined }
  ),
});

describe('Message Transformation', () => {
  /**
   * **Feature: ai-chat-api, Property 3: Message Format Transformation**
   * **Validates: Requirements 6.2**
   *
   * For any valid ChatMessage from the frontend, the transformation function
   * SHALL produce a model-compatible message format that preserves the role and content.
   */
  describe('Property 3: Message Format Transformation', () => {
    it('should preserve role and content for any valid ChatMessage', () => {
      fc.assert(
        fc.property(chatMessageArb, (message) => {
          const result = convertToModelMessage(message);

          // Role must be preserved
          expect(result.role).toBe(message.role);

          // Content must be preserved
          expect(result.content).toBe(message.content);

          // Result should only have role and content
          expect(Object.keys(result).sort()).toEqual(['content', 'role']);
        }),
        { numRuns: 100 }
      );
    });

    it('should transform arrays of messages preserving all roles and contents', () => {
      fc.assert(
        fc.property(fc.array(chatMessageArb), (messages) => {
          const results = convertToModelMessages(messages);

          // Length must be preserved
          expect(results.length).toBe(messages.length);

          // Each message must have role and content preserved
          messages.forEach((original, index) => {
            expect(results[index].role).toBe(original.role);
            expect(results[index].content).toBe(original.content);
          });
        }),
        { numRuns: 100 }
      );
    });

    it('should produce model messages with only role and content fields', () => {
      fc.assert(
        fc.property(chatMessageArb, (message) => {
          const result = convertToModelMessage(message);

          // Verify the result is a plain object with exactly two keys
          const keys = Object.keys(result);
          expect(keys).toHaveLength(2);
          expect(keys).toContain('role');
          expect(keys).toContain('content');
        }),
        { numRuns: 100 }
      );
    });
  });
});

describe('Context Truncation', () => {
  /**
   * **Feature: ai-chat-api, Property 4: Context Truncation Preservation**
   * **Validates: Requirements 6.3**
   *
   * For any array of messages exceeding the context limit, the truncation function
   * SHALL preserve the N most recent messages where N is the maximum allowed,
   * maintaining chronological order.
   */
  describe('Property 4: Context Truncation Preservation', () => {
    it('should preserve N most recent messages when array exceeds limit', () => {
      fc.assert(
        fc.property(
          fc.array(chatMessageArb, { minLength: 1 }),
          fc.integer({ min: 1, max: 100 }),
          (messages, limit) => {
            const result = truncateMessages(messages, limit);

            if (messages.length <= limit) {
              // If under limit, all messages should be preserved
              expect(result.length).toBe(messages.length);
              expect(result).toEqual(messages);
            } else {
              // If over limit, exactly 'limit' messages should remain
              expect(result.length).toBe(limit);

              // The preserved messages should be the last N messages
              const expectedMessages = messages.slice(-limit);
              expect(result).toEqual(expectedMessages);
            }
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should maintain chronological order after truncation', () => {
      // Create messages with sequential IDs to verify order
      const sequentialMessagesArb = fc
        .integer({ min: 1, max: 200 })
        .chain((count) =>
          fc.tuple(
            fc.constant(count),
            fc.integer({ min: 1, max: Math.max(1, count - 1) })
          )
        )
        .map(([count, limit]) => {
          const messages: ChatMessage[] = Array.from(
            { length: count },
            (_, i) => ({
              id: `msg-${i}`,
              role: i % 2 === 0 ? ('user' as const) : ('assistant' as const),
              content: `Message ${i}`,
            })
          );
          return { messages, limit };
        });

      fc.assert(
        fc.property(sequentialMessagesArb, ({ messages, limit }) => {
          const result = truncateMessages(messages, limit);

          // Verify order is maintained by checking sequential IDs
          for (let i = 1; i < result.length; i++) {
            const prevIndex = parseInt(result[i - 1].id.split('-')[1]);
            const currIndex = parseInt(result[i].id.split('-')[1]);
            expect(currIndex).toBeGreaterThan(prevIndex);
          }
        }),
        { numRuns: 100 }
      );
    });

    it('should return original array when length is within limit', () => {
      fc.assert(
        fc.property(
          fc.array(chatMessageArb, { minLength: 0, maxLength: 50 }),
          (messages) => {
            const limit = messages.length + 10; // Limit is always greater
            const result = truncateMessages(messages, limit);

            expect(result.length).toBe(messages.length);
            expect(result).toEqual(messages);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should work with default context limit', () => {
      fc.assert(
        fc.property(
          fc.array(chatMessageArb, { minLength: 0, maxLength: 100 }),
          (messages) => {
            const result = truncateMessages(messages);

            if (messages.length <= DEFAULT_CONTEXT_LIMIT) {
              expect(result.length).toBe(messages.length);
            } else {
              expect(result.length).toBe(DEFAULT_CONTEXT_LIMIT);
              // Verify last messages are preserved
              const expectedMessages = messages.slice(-DEFAULT_CONTEXT_LIMIT);
              expect(result).toEqual(expectedMessages);
            }
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should handle edge case of limit equal to array length', () => {
      fc.assert(
        fc.property(
          fc.array(chatMessageArb, { minLength: 1, maxLength: 50 }),
          (messages) => {
            const result = truncateMessages(messages, messages.length);

            expect(result.length).toBe(messages.length);
            expect(result).toEqual(messages);
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});
