'use client';

import { useEffect } from 'react';

/**
 * Global error boundary for root-level errors
 * This catches errors that occur in the root layout
 *
 * Requirements: 3.1, 3.3 - WHEN an unhandled error occurs THEN the Kivo_Web
 * SHALL display a user-friendly error page without exposing technical details
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to console without exposing sensitive details
    console.error('Global error:', error.message);
  }, [error]);

  return (
    <html lang="en">
      <body className="antialiased dark">
        <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-gray-950 p-8 text-center">
          <div className="rounded-full bg-red-900/20 p-4">
            <svg
              className="h-8 w-8 text-red-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-semibold text-gray-100">
              Something went wrong
            </h1>
            <p className="max-w-md text-gray-400">
              We encountered a critical error. Please try refreshing the page.
            </p>
          </div>

          <button
            onClick={reset}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-950"
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
