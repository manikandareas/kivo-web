import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { generateProfileImage } from '../profile';

/**
 * **Feature: authentication, Property 5: DiceBear Profile Image URL Generation**
 * *For any* valid user name string, the generated DiceBear URL SHALL be a valid URL
 * containing the encoded name as seed parameter.
 * **Validates: Requirements 2.1**
 */
describe('Property 5: DiceBear Profile Image URL Generation', () => {
  it('should generate a valid URL for any name string', () => {
    fc.assert(
      fc.property(fc.string(), (name: string) => {
        const url = generateProfileImage(name);

        // Property: The result is a valid URL
        const parsedUrl = new URL(url);
        expect(parsedUrl).toBeDefined();

        // Property: The URL uses the DiceBear API
        expect(parsedUrl.origin).toBe('https://api.dicebear.com');

        // Property: The URL uses the open-peeps style
        expect(parsedUrl.pathname).toBe('/9.x/open-peeps/svg');

        // Property: The seed parameter contains the encoded name
        expect(parsedUrl.searchParams.get('seed')).toBe(name);
      }),
      { numRuns: 100 }
    );
  });

  it('should properly encode special characters in the name', () => {
    fc.assert(
      fc.property(
        fc.string().filter((s) => /[&=?#%]/.test(s)),
        (name: string) => {
          const url = generateProfileImage(name);

          // Property: The URL is still valid even with special characters
          const parsedUrl = new URL(url);
          expect(parsedUrl).toBeDefined();

          // Property: The seed parameter correctly decodes to the original name
          expect(parsedUrl.searchParams.get('seed')).toBe(name);
        }
      ),
      { numRuns: 100 }
    );
  });
});
