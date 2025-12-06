/**
 * Property-based tests for environment validation
 * **Feature: production-readiness, Property 1: Environment Variable Validation Completeness**
 * **Validates: Requirements 1.2, 1.3**
 */

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import {
  validateEnv,
  requiredServerEnvVars,
  requiredPublicEnvVars,
} from '../env';

// All required environment variables combined
const allRequiredVars = [...requiredServerEnvVars, ...requiredPublicEnvVars];

describe('Environment Validation', () => {
  /**
   * **Feature: production-readiness, Property 1: Environment Variable Validation Completeness**
   * **Validates: Requirements 1.2, 1.3**
   *
   * For any set of required environment variables and any subset of defined variables,
   * the validation function should return isValid: false with the exact list of missing
   * variables when any required variable is undefined.
   */
  describe('Property 1: Environment Variable Validation Completeness', () => {
    // Arbitrary for generating valid environment variable values
    const validEnvValueArb = fc
      .string({ minLength: 1 })
      .filter((s) => s.trim() !== '');

    // Arbitrary for generating a complete valid environment
    const completeEnvArb = fc.record(
      Object.fromEntries(allRequiredVars.map((v) => [v, validEnvValueArb]))
    ) as fc.Arbitrary<Record<string, string>>;

    it('should return isValid: true when all required variables are defined', () => {
      fc.assert(
        fc.property(completeEnvArb, (env) => {
          const result = validateEnv(env);
          expect(result.isValid).toBe(true);
          expect(result.missingVars).toHaveLength(0);
          expect(result.errors).toHaveLength(0);
        }),
        { numRuns: 100 }
      );
    });

    it('should return isValid: false with exact missing vars when any required variable is missing', () => {
      // Generate a subset of required vars to remove
      const subsetToRemoveArb = fc
        .subarray(allRequiredVars, { minLength: 1 })
        .map((arr) => new Set(arr));

      fc.assert(
        fc.property(completeEnvArb, subsetToRemoveArb, (env, varsToRemove) => {
          // Create env with some vars removed
          const partialEnv: Record<string, string | undefined> = { ...env };
          for (const varName of varsToRemove) {
            delete partialEnv[varName];
          }

          const result = validateEnv(partialEnv);

          // Should be invalid
          expect(result.isValid).toBe(false);

          // Should contain exactly the missing vars
          expect(result.missingVars.length).toBe(varsToRemove.size);
          for (const missingVar of varsToRemove) {
            expect(result.missingVars).toContain(missingVar);
          }

          // Should have corresponding error messages
          expect(result.errors.length).toBe(varsToRemove.size);
        }),
        { numRuns: 100 }
      );
    });

    it('should treat empty strings as missing variables', () => {
      // Generate which vars to set as empty
      const varsToEmptyArb = fc
        .subarray(allRequiredVars, { minLength: 1 })
        .map((arr) => new Set(arr));

      fc.assert(
        fc.property(completeEnvArb, varsToEmptyArb, (env, varsToEmpty) => {
          // Create env with some vars set to empty string
          const envWithEmpty: Record<string, string> = { ...env };
          for (const varName of varsToEmpty) {
            envWithEmpty[varName] = '';
          }

          const result = validateEnv(envWithEmpty);

          // Should be invalid
          expect(result.isValid).toBe(false);

          // Should contain exactly the empty vars as missing
          expect(result.missingVars.length).toBe(varsToEmpty.size);
          for (const emptyVar of varsToEmpty) {
            expect(result.missingVars).toContain(emptyVar);
          }
        }),
        { numRuns: 100 }
      );
    });

    it('should treat whitespace-only strings as missing variables', () => {
      // Arbitrary for whitespace-only strings
      const whitespaceArb = fc
        .array(fc.constantFrom(' ', '\t', '\n', '\r'), { minLength: 1 })
        .map((arr) => arr.join(''));

      // Generate which vars to set as whitespace
      const varsToWhitespaceArb = fc
        .subarray(allRequiredVars, { minLength: 1 })
        .map((arr) => new Set(arr));

      fc.assert(
        fc.property(
          completeEnvArb,
          varsToWhitespaceArb,
          whitespaceArb,
          (env, varsToWhitespace, whitespace) => {
            // Create env with some vars set to whitespace
            const envWithWhitespace: Record<string, string> = { ...env };
            for (const varName of varsToWhitespace) {
              envWithWhitespace[varName] = whitespace;
            }

            const result = validateEnv(envWithWhitespace);

            // Should be invalid
            expect(result.isValid).toBe(false);

            // Should contain exactly the whitespace vars as missing
            expect(result.missingVars.length).toBe(varsToWhitespace.size);
            for (const wsVar of varsToWhitespace) {
              expect(result.missingVars).toContain(wsVar);
            }
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should return empty missingVars array when all vars are valid', () => {
      fc.assert(
        fc.property(completeEnvArb, (env) => {
          const result = validateEnv(env);
          expect(result.missingVars).toEqual([]);
        }),
        { numRuns: 100 }
      );
    });
  });
});
