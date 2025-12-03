'use client';

import { DataStreamProvider } from '@/features/chat/components/data-stream-handler';

/**
 * Chat layout component
 * Wraps children with DataStreamProvider for streaming state management
 * Applies responsive container styles
 *
 * Requirements: 8.1, 8.2
 */
export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DataStreamProvider>
      <div className="flex min-h-screen flex-col bg-background">
        {/* Main content area with responsive constraints */}
        <main className="flex flex-1 flex-col">{children}</main>
      </div>
    </DataStreamProvider>
  );
}
