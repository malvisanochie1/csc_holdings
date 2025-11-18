# CSC Escrow & Settlement UK Ltd

A Next.js 15 financial recovery and asset management platform that enables users to track recovered assets, view transaction history, and process withdrawals.

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS 4 with custom design tokens
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Package Manager**: Yarn

## Getting Started

### Development Server

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Building the Application

#### Standard Build (SSR/SSG)
```bash
yarn build
```
This creates an optimized production build in `.next-build/` directory.

#### Single Page Application (SPA) Build
```bash
yarn build:spa
```
This generates a static SPA export in the `.next-build/` directory that can be served by any static file server.

### Production Server

```bash
yarn start
```
Runs the production build (requires `yarn build` first).

### Preview SPA Build

```bash
yarn preview:spa
```
Serves the static SPA build locally using `serve` package (requires `yarn build:spa` first).

### Linting

```bash
yarn lint
```

## Build Configurations

### Standard Build
- **Output**: `.next-build/` directory
- **Mode**: Server-side rendering with static generation
- **Deployment**: Requires Node.js server (Vercel, Railway, etc.)

### SPA Build
- **Output**: `.next-build/` directory
- **Mode**: Static export with client-side routing
- **Deployment**: Can be deployed to any static hosting (Netlify, GitHub Pages, AWS S3, etc.)
- **Features**: 
  - Pre-rendered static pages
  - Client-side navigation
  - Optimized images (unoptimized for compatibility)
  - Trailing slashes for better static hosting compatibility

## Deployment

### Static Hosting (SPA)
1. Run `yarn build:spa`
2. Upload the `.next-build/` directory contents to your static hosting provider
3. Configure your hosting to serve `index.html` for all routes (for client-side routing)

### Server Hosting (SSR)
1. Run `yarn build`
2. Deploy to Node.js hosting platform
3. Ensure `yarn start` command is used to start the server

### Recommended Platforms
- **Static (SPA)**: Netlify, Vercel (static), GitHub Pages, AWS S3/CloudFront
- **Server (SSR)**: Vercel, Railway, Heroku, DigitalOcean App Platform
"# csc_holdings" 
