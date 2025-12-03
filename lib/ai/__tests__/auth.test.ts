/**
 * Property-based tests for authentication utilities
 * **Feature: ai-chat-api, Property 2: Unauthorized Request Rejection**
 * **Validates: Requirements 4.1, 4.2**
 */

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { checkAuthentication, isAuthenticated } from '../auth';

/**
 * Helper to create a mock Request with specific headers
 */
function createMockRequest(headers: Record<string, string> = {}): Request {
  return new Request('http://localhost/api/chat', {
    method: 'POST',
    headers,
  });
}

/**
 * Arbitrary for valid HTTP header names (non-empty, no special chars)
 */
const validHeaderNameArb = fc
  .string({ minLength: 1, maxLength: 20 })
  .filter((s) => /^[a-zA-Z][a-zA-Z0-9-]*$/.test(s))
  .filter((s) => s.toLowerCase() !== 'authorization');

describe('Authentication', () => {
  /**
   * **Feature: ai-chat-api, Property 2: Unauthorized Request Rejection**
   * **Validates: Requirements 4.1, 4.2**
   *
   * For any request without valid authentication credentials,
   * the API SHALL return a 401 status code and never process the message.
   */
  describe('Property 2: Unauthorized Request Rejection', () => {
    it('should reject requests without Authorization header', async () => {
      await fc.assert(
        fc.asyncProperty(
          // Generate random headers that don't include Authorization
          fc.dictionary(validHeaderNameArb, fc.string()),
          async (headers) => {
            const request = createMockRequest(headers);
            const result = await checkAuthentication(request);

            expect(result.authenticated).toBe(false);
            if (!result.authenticated) {
              expect(result.error).toBe('Authentication required');
            }
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should reject requests with empty Authorization header', async () => {
      await fc.assert(
        fc.asyncProperty(fc.constant(''), async (authValue) => {
          const request = createMockRequest({ Authorization: authValue });
          const result = await checkAuthentication(request);

          expect(result.authenticated).toBe(false);
        }),
        { numRuns: 100 }
      );
    });

    it('should reject requests with non-Bearer Authorization', async () => {
      await fc.assert(
        fc.asyncProperty(
          // Generate non-empty auth headers that don't start with 'Bearer '
          fc
            .string({ minLength: 1 })
            .filter((s) => !s.startsWith('Bearer ') && s.trim().length > 0),
          async (authValue) => {
            const request = createMockRequest({ Authorization: authValue });
            const result = await checkAuthentication(request);

            expect(result.authenticated).toBe(false);
            if (!result.authenticated) {
              expect(result.error).toBe('Invalid credentials');
            }
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should reject requests with Bearer but empty token', async () => {
      await fc.assert(
        fc.asyncProperty(
          // Generate whitespace-only strings using array of whitespace chars
          fc.array(fc.constantFrom(' ', '\t'), { minLength: 0, maxLength: 5 }),
          async (whitespaceChars) => {
            const whitespace = whitespaceChars.join('');
            const request = createMockRequest({
              Authorization: `Bearer ${whitespace}`,
            });
            const result = await checkAuthentication(request);

            expect(result.authenticated).toBe(false);
            if (!result.authenticated) {
              expect(result.error).toBe('Invalid credentials');
            }
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should accept requests with valid Bearer token', async () => {
      await fc.assert(
        fc.asyncProperty(
          // Generate non-empty, non-whitespace tokens
          fc.string({ minLength: 1 }).filter((s) => s.trim().length > 0),
          async (token) => {
            const request = createMockRequest({
              Authorization: `Bearer ${token}`,
            });
            const result = await checkAuthentication(request);

            expect(result.authenticated).toBe(true);
            if (result.authenticated) {
              expect(result.userId).toBeDefined();
            }
          }
        ),
        { numRuns: 100 }
      );
    });

    it('isAuthenticated should return false for any unauthenticated request', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.oneof(
            // No auth header
            fc.constant({}),
            // Non-Bearer auth (non-empty)
            fc.record({
              Authorization: fc
                .string({ minLength: 1 })
                .filter((s) => !s.startsWith('Bearer ') && s.trim().length > 0),
            }),
            // Bearer with empty token
            fc.record({
              Authorization: fc
                .array(fc.constantFrom(' ', '\t'), {
                  minLength: 0,
                  maxLength: 3,
                })
                .map((ws) => `Bearer ${ws.join('')}`),
            })
          ),
          async (headers) => {
            const request = createMockRequest(
              headers as Record<string, string>
            );
            const result = await isAuthenticated(request);

            expect(result).toBe(false);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('isAuthenticated should return true for valid authenticated requests', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.string({ minLength: 1 }).filter((s) => s.trim().length > 0),
          async (token) => {
            const request = createMockRequest({
              Authorization: `Bearer ${token}`,
            });
            const result = await isAuthenticated(request);

            expect(result).toBe(true);
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});
