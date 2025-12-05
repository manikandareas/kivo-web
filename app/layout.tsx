import type { Metadata } from 'next';
import { DM_Sans, Fuzzy_Bubbles } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import './globals.css';
import { ClerkProvider } from '@clerk/nextjs';

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
  title: 'Kivo',
  description: 'Kivo your AI Business partner',
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
            {children}
          </NuqsAdapter>
        </body>
      </html>
    </ClerkProvider>
  );
}
