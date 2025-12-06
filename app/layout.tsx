import type { Metadata } from 'next';
import { DM_Sans, Fuzzy_Bubbles } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import './globals.css';
import { ClerkProvider } from '@clerk/nextjs';
import { ErrorBoundary } from '@/features/shared/components/error-boundary';
import { defaultSEO, siteName } from '@/lib/seo';

const dmSans = DM_Sans({
  variable: '--font-dm-sans',
  subsets: ['latin'],
});

const fuzzyBubbles = Fuzzy_Bubbles({
  variable: '--font-fuzzy-bubbles',
  subsets: ['latin'],
  weight: ['400', '700'],
});

export const metadata: Metadata = {
  metadataBase: new URL(defaultSEO.url || 'https://kivo.app'),
  title: {
    default: defaultSEO.title,
    template: `%s | ${siteName}`,
  },
  description: defaultSEO.description,
  openGraph: {
    title: defaultSEO.title,
    description: defaultSEO.description,
    url: defaultSEO.url,
    siteName,
    images: defaultSEO.image
      ? [
          {
            url: defaultSEO.image,
            width: 1200,
            height: 630,
            alt: defaultSEO.title,
          },
        ]
      : [],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: defaultSEO.title,
    description: defaultSEO.description,
    images: defaultSEO.image ? [defaultSEO.image] : [],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      signInFallbackRedirectUrl={'/'}
      signUpFallbackRedirectUrl={'/'}
    >
      <html lang="en">
        <body
          className={`${dmSans.variable} ${fuzzyBubbles.variable} antialiased dark`}
        >
          <NuqsAdapter>
            <Toaster position="top-center" />
            <ErrorBoundary>{children}</ErrorBoundary>
          </NuqsAdapter>
        </body>
      </html>
    </ClerkProvider>
  );
}
