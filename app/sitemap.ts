import type { MetadataRoute } from 'next';

/**
 * Dynamic sitemap generator for Kivo Web
 * Lists all public pages with lastModified dates
 *
 * Requirements: 7.5
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://kivo.app';
  const lastModified = new Date();

  return [
    {
      url: baseUrl,
      lastModified,
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/explore`,
      lastModified,
      changeFrequency: 'daily',
      priority: 0.8,
    },
  ];
}
