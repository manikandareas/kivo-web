/**
 * Property-based tests for request validation
 * **Feature: ai-chat-api, Property 1: Request Validation Completeness**
 * **Validates: Requirements 1.2, 1.3**
 */

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { validateChatRequest, isValidChatRequest } from '../validation';

describe('Request Validation', () => {
  /**
   * **Feature: ai-chat-api, Property 1: Request Validation Completeness**
   * **Validates: Requirements 1.2, 1.3**
   *
   * For any request body object, the validation function SHALL correctly
   * identify whether all required fields (id, message with content) are
   * present and valid, returning true only when all requirements are met.
   */
  describe('Property 1: Request Validation Completeness', () => {
    // Arbitrary for valid chat request
    const validChatRequestArb = fc.record({
      id: fc.uuid(),
      message: fc.record({
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
      }),
      selectedChatModel: fc.option(fc.string(), { nil: undefined }),
    });

    it('should accept all valid chat requests', () => {
      fc.assert(
        fc.property(validChatRequestArb, (request) => {
          const result = validateChatRequest(request);
          expect(result.success).toBe(true);
          if (result.success) {
            expect(result.data.id).toBe(request.id);
            expect(result.data.message.content).toBe(request.message.content);
          }
        }),
        { numRuns: 100 }
      );
    });

    it('should reject requests with invalid UUID for chat id', () => {
      fc.assert(
        fc.property(
          fc.record({
            id: fc.string().filter((s) => !isValidUUID(s)),
            message: fc.record({
              id: fc.string({ minLength: 1 }),
              role: fc.constantFrom('user' as const, 'assistant' as const),
              content: fc.string({ minLength: 1 }),
            }),
          }),
          (request) => {
            const result = validateChatRequest(request);
            expect(result.success).toBe(false);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should reject requests with empty message content', () => {
      fc.assert(
        fc.property(
          fc.record({
            id: fc.uuid(),
            message: fc.record({
              id: fc.string({ minLength: 1 }),
              role: fc.constantFrom('user' as const, 'assistant' as const),
              content: fc.constant(''),
            }),
          }),
          (request) => {
            const result = validateChatRequest(request);
            expect(result.success).toBe(false);
            if (!result.success) {
              expect(result.error).toContain('content');
            }
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should reject requests with empty message id', () => {
      fc.assert(
        fc.property(
          fc.record({
            id: fc.uuid(),
            message: fc.record({
              id: fc.constant(''),
              role: fc.constantFrom('user' as const, 'assistant' as const),
              content: fc.string({ minLength: 1 }),
            }),
          }),
          (request) => {
            const result = validateChatRequest(request);
            expect(result.success).toBe(false);
            if (!result.success) {
              expect(result.error).toContain('id');
            }
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should reject requests missing required fields', () => {
      // Test missing id
      fc.assert(
        fc.property(
          fc.record({
            message: fc.record({
              id: fc.string({ minLength: 1 }),
              role: fc.constantFrom('user' as const, 'assistant' as const),
              content: fc.string({ minLength: 1 }),
            }),
          }),
          (request) => {
            const result = validateChatRequest(request);
            expect(result.success).toBe(false);
          }
        ),
        { numRuns: 100 }
      );

      // Test missing message
      fc.assert(
        fc.property(
          fc.record({
            id: fc.uuid(),
          }),
          (request) => {
            const result = validateChatRequest(request);
            expect(result.success).toBe(false);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should reject requests with invalid role', () => {
      fc.assert(
        fc.property(
          fc.record({
            id: fc.uuid(),
            message: fc.record({
              id: fc.string({ minLength: 1 }),
              role: fc
                .string()
                .filter(
                  (s) => s !== 'user' && s !== 'assistant'
                ) as fc.Arbitrary<'user' | 'assistant'>,
              content: fc.string({ minLength: 1 }),
            }),
          }),
          (request) => {
            const result = validateChatRequest(request);
            expect(result.success).toBe(false);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('isValidChatRequest should return boolean matching validateChatRequest success', () => {
      // Test with valid requests
      fc.assert(
        fc.property(validChatRequestArb, (request) => {
          const validateResult = validateChatRequest(request);
          const isValidResult = isValidChatRequest(request);
          expect(isValidResult).toBe(validateResult.success);
        }),
        { numRuns: 100 }
      );

      // Test with invalid requests (missing fields)
      fc.assert(
        fc.property(fc.anything(), (request) => {
          const validateResult = validateChatRequest(request);
          const isValidResult = isValidChatRequest(request);
          expect(isValidResult).toBe(validateResult.success);
        }),
        { numRuns: 100 }
      );
    });
  });
});

/**
 * Helper function to check if a string is a valid UUID
 */
function isValidUUID(str: string): boolean {
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(str);
}
