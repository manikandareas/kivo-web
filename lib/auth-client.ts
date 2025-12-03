import { createAuthClient } from 'better-auth/react'; // make sure to import from better-auth/react

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
  basePath: 'api/v1/auth',
  plugins: [
    {
      id: 'next-cookies-request',
      fetchPlugins: [
        {
          id: 'next-cookies-request-plugin',
          name: 'next-cookies-request-plugin',
          hooks: {
            async onRequest(ctx) {
              if (typeof window === 'undefined') {
                const { cookies } = await import('next/headers');
                const headers = await cookies();
                ctx.headers.set('cookie', headers.toString());
              }
            },
          },
        },
      ],
    },
  ],
});
