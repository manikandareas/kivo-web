# Production Deployment Checklist

This document provides a comprehensive checklist for deploying Kivo Web to production.

## Pre-Deployment Checklist

### 1. Environment Variables

- [ ] All required environment variables are configured in production environment
- [ ] Server-side variables (never exposed to client):
  - [ ] `OPENAI_API_KEY` - OpenAI API key for AI chat functionality
  - [ ] `CLERK_SECRET_KEY` - Clerk authentication secret key
- [ ] Public variables (accessible in client):
  - [ ] `NEXT_PUBLIC_API_URL` - Base URL for API endpoints
  - [ ] `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` - Clerk publishable key
  - [ ] `NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN` - Mapbox token for explore map

### 2. Code Quality

- [ ] All TypeScript type checks pass: `npm run typecheck`
- [ ] All linting rules pass: `npm run lint`
- [ ] All tests pass: `npm run test`
- [ ] No console.log statements in production code (use logger instead)

### 3. Security

- [ ] `.env.local` is NOT committed to repository
- [ ] All sensitive files are in `.gitignore`
- [ ] Security headers are configured in `next.config.ts`
- [ ] API keys have appropriate rate limits configured
- [ ] CORS is properly configured for allowed domains

### 4. Build Verification

- [ ] Run production build with validation: `npm run build:prod`
- [ ] Build completes without errors
- [ ] Bundle size is within acceptable limits

## Deployment Steps

### Step 1: Validate Environment

```bash
# Validate all required environment variables are set
npm run validate-env
```

### Step 2: Run Quality Checks

```bash
# Type checking
npm run typecheck

# Linting
npm run lint

# Tests
npm run test
```

### Step 3: Build for Production

```bash
# Build with environment validation
npm run build:prod
```

### Step 4: Deploy

Deploy using your preferred platform (Vercel, AWS, etc.):

#### Vercel (Recommended)

```bash
# Install Vercel CLI if not already installed
npm i -g vercel

# Deploy to production
vercel --prod
```

#### Manual Deployment

```bash
# Start production server
npm run start
```

## Post-Deployment Verification

- [ ] Application loads without errors
- [ ] Authentication flow works correctly
- [ ] AI chat functionality responds
- [ ] Explore map renders correctly
- [ ] Error pages display correctly (test 404, 500)
- [ ] Security headers are present in responses

## Environment Setup by Platform

### Vercel

1. Go to Project Settings > Environment Variables
2. Add each required variable for Production environment
3. Redeploy after adding variables

### AWS Amplify

1. Go to App Settings > Environment Variables
2. Add each required variable
3. Trigger new deployment

### Docker

Create a `.env.production` file (never commit this):

```env
OPENAI_API_KEY=your_openai_key
CLERK_SECRET_KEY=your_clerk_secret
NEXT_PUBLIC_API_URL=https://your-domain.com
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=your_mapbox_token
```

## Rollback Procedure

If issues are detected after deployment:

1. Revert to previous deployment in your platform
2. Investigate logs for error details
3. Fix issues in development environment
4. Re-run deployment checklist before redeploying

## Monitoring

After deployment, monitor:

- Application error rates
- API response times
- User authentication success rates
- AI chat response quality

## Support

For deployment issues, check:

- Next.js deployment documentation: https://nextjs.org/docs/deployment
- Clerk documentation: https://clerk.com/docs
- Mapbox documentation: https://docs.mapbox.com
