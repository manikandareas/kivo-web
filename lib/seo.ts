import type { Metadata } from 'next';

/**
 * SEO Configuration for Kivo Web
 * Provides metadata generation helpers for consistent SEO across pages
 */

export interface SEOConfig {
  title: string;
  description: string;
  url?: string;
  image?: string;
  type?: 'website' | 'article';
}

// Default SEO values for the site
export const defaultSEO: SEOConfig = {
  title: 'Kivo - AI Business Partner',
  description:
    'Kembangkan dan validasi ide bisnis Anda dengan AI. Kivo membantu Anda menganalisis peluang pasar dan membangun Business Model Canvas.',
  url: process.env.NEXT_PUBLIC_APP_URL || 'https://kivo.app',
  image: '/og-image.png',
  type: 'website',
};

export const siteName = 'Kivo';

/**
 * Generate page metadata with Open Graph and Twitter Card support
 * @param config - SEO configuration for the page
 * @returns Next.js Metadata object
 */
export function generateMetadata(config: Partial<SEOConfig> = {}): Metadata {
  const seo = { ...defaultSEO, ...config };
  const title = config.title ? `${config.title} | ${siteName}` : seo.title;

  return {
    title,
    description: seo.description,
    openGraph: {
      title,
      description: seo.description,
      url: seo.url,
      siteName,
      images: seo.image
        ? [
            {
              url: seo.image,
              width: 1200,
              height: 630,
              alt: title,
            },
          ]
        : [],
      type: seo.type || 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: seo.description,
      images: seo.image ? [seo.image] : [],
    },
  };
}

/**
 * Page-specific SEO configurations
 */
export const pageSEO = {
  home: {
    title: 'Kivo - AI Business Partner',
    description:
      'Kembangkan dan validasi ide bisnis Anda dengan AI. Kivo membantu Anda menganalisis peluang pasar dan membangun Business Model Canvas.',
  },
  explore: {
    title: 'Explore',
    description:
      'Jelajahi berbagai ide bisnis dan Business Model Canvas dari komunitas Kivo. Temukan inspirasi untuk bisnis Anda.',
  },
  chat: {
    title: 'Chat',
    description:
      'Mulai percakapan dengan AI untuk mengembangkan ide bisnis Anda. Dapatkan analisis dan saran untuk Business Model Canvas.',
  },
};
