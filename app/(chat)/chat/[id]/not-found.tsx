import Link from 'next/link';

/**
 * Not found page for chat routes
 * Displayed when chat doesn't exist or user doesn't have access
 *
 * Requirements: 4.3, 4.5
 */
export default function ChatNotFound() {
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-4">
      <h1 className="text-2xl font-semibold">Chat Not Found</h1>
      <p className="text-muted-foreground">
        The chat you&apos;re looking for doesn&apos;t exist or you don&apos;t
        have access to it.
      </p>
      <Link href="/" className="text-primary hover:underline">
        Start a new chat
      </Link>
    </div>
  );
}
