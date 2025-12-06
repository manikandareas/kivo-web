import type { Metadata } from 'next';
import { pageSEO, generateMetadata as genMeta } from '@/lib/seo';
import { ChatLayoutClient } from './layout-client';

export const metadata: Metadata = genMeta(pageSEO.home);

/**
 * Chat layout component
 * Provides SEO metadata and wraps children with client-side providers
 *
 * Requirements: 7.1, 7.2, 7.3
 */
export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ChatLayoutClient>{children}</ChatLayoutClient>;
}
