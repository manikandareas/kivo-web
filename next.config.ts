import type { NextConfig } from 'next';

/**
 * Cache headers for static assets (1 year, immutable)
 * Used for versioned/hashed assets that won't change
 */
export const staticCacheHeaders = [
  {
    key: 'Cache-Control',
    value: 'public, max-age=31536000, immutable',
  },
];

/**
 * Cache headers for public assets (1 day with revalidation)
 * Used for assets that may be updated occasionally
 */
export const publicAssetCacheHeaders = [
  {
    key: 'Cache-Control',
    value: 'public, max-age=86400, stale-while-revalidate=604800',
  },
];

const nextConfig: NextConfig = {
  // Image optimization configuration
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.mapbox.com',
      },
      {
        protocol: 'https',
        hostname: 'api.mapbox.com',
      },
    ],
  },

  // Headers configuration
  async headers() {
    return [
      {
        // Cache static assets (JS, CSS, images in _next/static) - immutable
        source: '/_next/static/:path*',
        headers: staticCacheHeaders,
      },
      {
        // Cache favicon
        source: '/favicon.ico',
        headers: publicAssetCacheHeaders,
      },
      {
        // Cache SVG files in public folder
        source: '/:path*.svg',
        headers: publicAssetCacheHeaders,
      },
      {
        // Cache image files
        source: '/:path*.(png|jpg|jpeg|gif|webp|ico)',
        headers: publicAssetCacheHeaders,
      },
    ];
  },
};

export default nextConfig;
