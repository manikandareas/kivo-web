import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import * as fc from 'fast-check';
import { ErrorBoundary } from '../error-boundary';

/**
 * **Feature: production-readiness, Property 3: Error Boundary Recovery**
 * **Validates: Requirements 3.1**
 *
 * Property: For any React component tree wrapped in ErrorBoundary,
 * when a child component throws an error, the ErrorBoundary should
 * catch it and render the fallback UI without propagating the error.
 */

// Component that throws an error when rendered
function ThrowingComponent({ error }: { error: Error }): never {
  throw error;
}

// Component that renders normally
function NormalComponent({ text }: { text: string }) {
  return <div data-testid="normal-content">{text}</div>;
}

describe('ErrorBoundary', () => {
  // Suppress console.error during tests since we expect errors
  const originalConsoleError = console.error;

  beforeEach(() => {
    console.error = vi.fn();
  });

  afterEach(() => {
    console.error = originalConsoleError;
    cleanup();
  });

  describe('Property-Based Tests', () => {
    /**
     * **Feature: production-readiness, Property 3: Error Boundary Recovery**
     * **Validates: Requirements 3.1**
     *
     * For any error message string, when a child component throws an error,
     * the ErrorBoundary should catch it and render the fallback UI.
     */
    it('should catch any error thrown by child components and render fallback', () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 1, maxLength: 100 }),
          (errorMessage) => {
            cleanup();
            const error = new Error(errorMessage);
            const fallbackText = 'Error caught';

            const { container, unmount } = render(
              <ErrorBoundary fallback={<div>{fallbackText}</div>}>
                <ThrowingComponent error={error} />
              </ErrorBoundary>
            );

            // Verify fallback is rendered
            expect(container.textContent).toContain(fallbackText);
            unmount();
          }
        ),
        { numRuns: 100 }
      );
    });

    /**
     * **Feature: production-readiness, Property 3: Error Boundary Recovery**
     * **Validates: Requirements 3.1**
     *
     * For any valid text content, when no error occurs,
     * the ErrorBoundary should render children normally.
     */
    it('should render children normally when no error occurs', () => {
      fc.assert(
        fc.property(fc.string({ minLength: 1, maxLength: 100 }), (text) => {
          cleanup();
          const { unmount } = render(
            <ErrorBoundary>
              <NormalComponent text={text} />
            </ErrorBoundary>
          );

          const element = screen.getByTestId('normal-content');
          expect(element.textContent).toBe(text);
          unmount();
        }),
        { numRuns: 100 }
      );
    });

    /**
     * **Feature: production-readiness, Property 3: Error Boundary Recovery**
     * **Validates: Requirements 3.1**
     *
     * For any error type (Error, TypeError, RangeError, etc.),
     * the ErrorBoundary should catch it and render fallback.
     */
    it('should catch different error types', () => {
      const errorTypes = [
        (msg: string) => new Error(msg),
        (msg: string) => new TypeError(msg),
        (msg: string) => new RangeError(msg),
        (msg: string) => new SyntaxError(msg),
      ];

      fc.assert(
        fc.property(
          fc.string({ minLength: 1, maxLength: 50 }),
          fc.integer({ min: 0, max: errorTypes.length - 1 }),
          (message, errorTypeIndex) => {
            cleanup();
            const error = errorTypes[errorTypeIndex](message);
            const fallbackText = 'Caught error';

            const { container, unmount } = render(
              <ErrorBoundary fallback={<div>{fallbackText}</div>}>
                <ThrowingComponent error={error} />
              </ErrorBoundary>
            );

            expect(container.textContent).toContain(fallbackText);
            unmount();
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('Unit Tests', () => {
    it('should render default fallback UI when no custom fallback provided', () => {
      const { container } = render(
        <ErrorBoundary>
          <ThrowingComponent error={new Error('Test error')} />
        </ErrorBoundary>
      );

      expect(container.textContent).toContain('Something went wrong');
      expect(container.textContent).toContain(
        'An unexpected error occurred. Please try again.'
      );
    });

    it('should call onError callback when error occurs', () => {
      const onError = vi.fn();
      const testError = new Error('Test error');

      render(
        <ErrorBoundary onError={onError} fallback={<div>Error</div>}>
          <ThrowingComponent error={testError} />
        </ErrorBoundary>
      );

      expect(onError).toHaveBeenCalledWith(testError, expect.any(Object));
    });

    it('should reset error state when try again button is clicked', () => {
      // Create a component that throws on first render but not after reset
      let shouldThrow = true;
      function ConditionalThrow() {
        if (shouldThrow) {
          throw new Error('Test error');
        }
        return <div data-testid="recovered">Recovered</div>;
      }

      render(
        <ErrorBoundary>
          <ConditionalThrow />
        </ErrorBoundary>
      );

      // Verify error state
      expect(screen.getByText('Something went wrong')).toBeTruthy();

      // Reset the throw condition and click try again
      shouldThrow = false;
      fireEvent.click(screen.getByText('Try again'));

      // Verify recovery
      expect(screen.getByTestId('recovered')).toBeTruthy();
    });
  });
});
