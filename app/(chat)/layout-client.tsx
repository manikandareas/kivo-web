'use client';

import { DataStreamProvider } from '@/features/chat/components/data-stream-handler';

/**
 * Client-side chat layout component
 * Wraps children with DataStreamProvider for streaming state management
 */
export function ChatLayoutClient({ children }: { children: React.ReactNode }) {
  return (
    <DataStreamProvider>
      <div className="flex min-h-screen flex-col bg-background">
        <main className="flex flex-1 flex-col">{children}</main>
      </div>
    </DataStreamProvider>
  );
}
