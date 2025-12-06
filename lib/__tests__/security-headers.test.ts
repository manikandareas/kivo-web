/**
 * Property-based tests for security headers configuration
 * **Feature: production-readiness, Property 2: Security Headers Completeness**
 * **Validates: Requirements 2.2**
 */

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { securityHeaders } from '../../next.config';

// Required security headers as per Requirements 2.2
const requiredSecurityHeaders = [
  'X-Frame-Options',
  'X-Content-Type-Options',
  'Referrer-Policy',
  'X-XSS-Protection',
] as const;

// Additional recommended security headers
const recommendedSecurityHeaders = [
  'Content-Security-Policy',
  'Strict-Transport-Security',
  'Permissions-Policy',
] as const;

describe('Security Headers Configuration', () => {
  /**
   * **Feature: production-readiness, Property 2: Security Headers Completeness**
   * **Validates: Requirements 2.2**
   *
   * For any HTTP response configuration, the headers array should contain all
   * required security headers (X-Frame-Options, X-Content-Type-Options,
   * Referrer-Policy, X-XSS-Protection).
   */
  describe('Property 2: Security Headers Completeness', () => {
    // Extract header keys from the configuration
    const configuredHeaderKeys = securityHeaders.map((h) => h.key);

    it('should contain all required security headers', () => {
      fc.assert(
        fc.property(
          fc.constantFrom(...requiredSecurityHeaders),
          (requiredHeader) => {
            expect(configuredHeaderKeys).toContain(requiredHeader);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should have no duplicate headers', () => {
      fc.assert(
        fc.property(fc.constant(securityHeaders), (headers) => {
          const keys = headers.map((h) => h.key);
          const uniqueKeys = new Set(keys);
          expect(keys.length).toBe(uniqueKeys.size);
        }),
        { numRuns: 100 }
      );
    });

    it('should have non-empty values for all headers', () => {
      fc.assert(
        fc.property(fc.constantFrom(...securityHeaders), (header) => {
          expect(header.value).toBeDefined();
          expect(header.value.trim()).not.toBe('');
        }),
        { numRuns: 100 }
      );
    });

    it('should include recommended security headers', () => {
      fc.assert(
        fc.property(
          fc.constantFrom(...recommendedSecurityHeaders),
          (recommendedHeader) => {
            expect(configuredHeaderKeys).toContain(recommendedHeader);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('X-Frame-Options should be DENY or SAMEORIGIN', () => {
      const xFrameHeader = securityHeaders.find(
        (h) => h.key === 'X-Frame-Options'
      );
      expect(xFrameHeader).toBeDefined();
      expect(['DENY', 'SAMEORIGIN']).toContain(xFrameHeader?.value);
    });

    it('X-Content-Type-Options should be nosniff', () => {
      const xContentTypeHeader = securityHeaders.find(
        (h) => h.key === 'X-Content-Type-Options'
      );
      expect(xContentTypeHeader).toBeDefined();
      expect(xContentTypeHeader?.value).toBe('nosniff');
    });

    it('should have valid Referrer-Policy value', () => {
      const validReferrerPolicies = [
        'no-referrer',
        'no-referrer-when-downgrade',
        'origin',
        'origin-when-cross-origin',
        'same-origin',
        'strict-origin',
        'strict-origin-when-cross-origin',
        'unsafe-url',
      ];

      const referrerHeader = securityHeaders.find(
        (h) => h.key === 'Referrer-Policy'
      );
      expect(referrerHeader).toBeDefined();
      expect(validReferrerPolicies).toContain(referrerHeader?.value);
    });
  });
});
