# Kivo Web

Platform AI untuk membantu mengembangkan dan memvalidasi ide bisnis Anda.

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06B6D4?logo=tailwindcss)

## Tentang Kivo

Kivo adalah asisten AI yang membantu Anda:

- 💡 Membangun dan mengembangkan ide bisnis
- 🎯 Menganalisis peluang pasar
- 🚀 Memvalidasi konsep bisnis
- 🗺️ Menjelajahi data bisnis melalui peta interaktif

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **UI**: React 19, Tailwind CSS 4, Radix UI
- **AI**: Vercel AI SDK dengan OpenAI
- **Auth**: Clerk
- **Maps**: Mapbox GL
- **State**: SWR, nuqs
- **Testing**: Vitest, Testing Library
- **Animation**: Motion (Framer Motion)

## Struktur Proyek

```
├── app/                    # Next.js App Router
│   ├── (auth)/            # Auth routes (sign-in, sign-up)
│   ├── (chat)/            # Chat routes
│   └── explore/           # Explore map page
├── features/              # Feature-based modules
│   ├── auth/              # Authentication
│   ├── chat/              # AI Chat functionality
│   ├── explore/           # Map exploration
│   ├── landing/           # Landing page
│   └── shared/            # Shared components & utilities
├── lib/                   # Utilities & configurations
└── public/                # Static assets
```

## Getting Started

### Prerequisites

- Node.js 20+
- Bun (recommended) atau npm/yarn/pnpm

### Installation

1. Clone repository

```bash
git clone <repository-url>
cd kivo-web
```

2. Install dependencies

```bash
bun install
# atau
npm install
```

3. Setup environment variables

```bash
cp .env.example .env.local
```

Edit `.env.local` dengan kredensial Anda:

```env
# API Backend
NEXT_PUBLIC_API_URL=http://localhost:8000

# OpenAI
OPENAI_API_KEY=sk-your-openai-api-key

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxx
CLERK_SECRET_KEY=sk_test_xxx

# Mapbox
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=pk.xxx
```

4. Jalankan development server

```bash
bun dev
# atau
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000)

## Scripts

| Command          | Description                       |
| ---------------- | --------------------------------- |
| `bun dev`        | Start development server          |
| `bun build`      | Build for production              |
| `bun build:prod` | Build dengan validasi environment |
| `bun start`      | Start production server           |
| `bun lint`       | Run ESLint                        |
| `bun typecheck`  | Run TypeScript type checking      |
| `bun test`       | Run tests                         |
| `bun test:watch` | Run tests in watch mode           |

## Deployment

Lihat [DEPLOYMENT.md](./DEPLOYMENT.md) untuk panduan deployment lengkap.

### Quick Deploy ke Vercel

```bash
npm i -g vercel
vercel --prod
```

## Environment Variables

| Variable                            | Required | Description                    |
| ----------------------------------- | -------- | ------------------------------ |
| `OPENAI_API_KEY`                    | ✅       | OpenAI API key untuk AI chat   |
| `CLERK_SECRET_KEY`                  | ✅       | Clerk secret key (server-side) |
| `NEXT_PUBLIC_API_URL`               | ✅       | URL backend API                |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | ✅       | Clerk publishable key          |
| `NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN`   | ✅       | Mapbox access token            |

## License

Private - All rights reserved
