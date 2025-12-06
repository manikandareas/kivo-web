import Link from 'next/link';

/**
 * Custom 404 Not Found page
 *
 * Requirements: 3.2 - WHEN a 404 error occurs THEN the Kivo_Web SHALL
 * display a custom not-found page with navigation options
 */
export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-background p-8 text-center">
      <div className="rounded-full bg-blue-100 p-4 dark:bg-blue-900/20">
        <svg
          className="h-8 w-8 text-blue-600 dark:text-blue-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>

      <div className="space-y-2">
        <h1 className="text-4xl font-bold text-foreground">404</h1>
        <h2 className="text-xl font-semibold text-foreground">
          Page not found
        </h2>
        <p className="max-w-md text-muted-foreground">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
      </div>

      <div className="flex gap-4">
        <Link
          href="/"
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        >
          Go home
        </Link>
        <Link
          href="/explore"
          className="rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground hover:bg-accent focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        >
          Explore
        </Link>
      </div>
    </div>
  );
}
