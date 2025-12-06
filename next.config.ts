import type { NextConfig } from 'next';

/**
 * Security headers configuration for production
 * Based on OWASP security best practices
 */
export const securityHeaders = [
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'X-XSS-Protection', value: '1; mode=block' },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(self)',
  },
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://api.mapbox.com",
      "style-src 'self' 'unsafe-inline' https://api.mapbox.com",
      "img-src 'self' data: blob: https://*.mapbox.com https://*.openstreetmap.org",
      "font-src 'self' data:",
      "connect-src 'self' https://api.mapbox.com https://*.mapbox.com https://events.mapbox.com https://api.openai.com",
      "worker-src 'self' blob:",
      "frame-ancestors 'none'",
    ].join('; '),
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=31536000; includeSubDomains',
  },
];

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
        // Apply security headers to all routes
        source: '/:path*',
        headers: securityHeaders,
      },
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
