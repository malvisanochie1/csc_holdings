# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 15 application for CSC Escrow & Settlement UK Ltd, a financial recovery and asset management platform. The app enables users to track recovered assets (cryptocurrencies and precious metals), view transaction history, manage their profile, and process withdrawals.

## Development Commands

```bash
# Start development server (runs on http://localhost:3000)
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint
```

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS 4 with custom design tokens
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Theme**: next-themes for dark mode support
- **Icons**: lucide-react, react-icons
- **Charts**: lightweight-charts for financial visualizations

## Architecture

### Project Structure

```
src/
├── app/                          # Next.js App Router pages
│   ├── dashboard/               # Main dashboard and transactions
│   ├── profile/                 # User profile management
│   ├── notification/            # Notifications page
│   ├── settings/                # Settings page
│   ├── login/                   # Authentication pages
│   ├── register/
│   ├── forgot-password/
│   └── layout.tsx               # Root layout with theme provider
├── components/
│   ├── modals/                  # Modal dialogs (withdrawal flows)
│   ├── sections/                # Major page sections
│   │   ├── dashboard/           # Dashboard-specific components
│   │   ├── profile/             # Profile-specific components
│   │   ├── withdraw/            # Withdrawal flow components
│   │   └── navs/                # Navigation components (navbar, sidebar)
│   ├── ui/                      # shadcn/ui components
│   ├── text/csc.tsx            # Centralized data definitions
│   └── theme-provider.tsx       # Theme context provider
└── lib/
    └── utils.ts                 # Utility functions (cn helper)
```

### Key Design Patterns

**Responsive Navigation**: The app uses three navigation patterns:
- **Mobile** (<640px): Bottom navigation bar with icons
- **Tablet** (640px-1280px): Top navbar with hamburger menu
- **Desktop** (>1280px): Fixed left sidebar

Navigation state management is handled in `src/components/sections/navs/navbar.tsx` and `sidebar.tsx` with route-based active state inference.

**Component Organization**:
- Page components in `src/app/` are kept minimal, composing larger sections from `src/components/sections/`
- Reusable UI primitives live in `src/components/ui/`
- Modal workflows are in `src/components/modals/`

**Data Management**: Static data (navigation items, asset lists, recovery steps) is centralized in `src/components/text/csc.tsx` for easy maintenance.

**Theme System**: Uses `next-themes` with Tailwind CSS custom properties defined in `src/app/globals.css`. The app supports light/dark modes with OKLCH color space for better color consistency.

### Path Aliases

Import paths use the `@/*` alias mapped to `src/*`:
```typescript
import Component from '@/components/ui/button'
import { cn } from '@/lib/utils'
```

### Styling Conventions

**Custom CSS Classes** (defined in globals.css):
- `.card` - White/gray-800 rounded card container
- `.home-bg` - Page background color
- `.header` - Large header text (gray-600, bold, lg/xl)
- `.header-sm` - Small header text (gray-400, xs)
- `.nav-blue-text` / `.nav-blue-bg` - Brand color (#3E2BCE)
- `.gradient` - Teal-to-indigo gradient
- `.lato` - Lato font family (custom font used throughout)

**Responsive Patterns**:
- Use Tailwind's responsive prefixes: `sm:`, `md:`, `lg:`, `xl:`
- Mobile-first approach with progressive enhancement
- Custom scrollbar styling (hidden on mobile, visible on desktop)

### TypeScript Configuration

- Strict mode enabled
- Path aliases: `@/*` → `./src/*`
- Target: ES2017
- Module resolution: bundler (Next.js optimized)

## Important Notes

**shadcn/ui Integration**: Components are configured with:
- Style: "new-york"
- Icon library: lucide
- CSS variables enabled
- Base color: slate

**Font System**: Uses both Geist (sans/mono) from next/font and Lato from Google Fonts. Lato is the primary font with custom weight classes in globals.css.

**Data Types**: Key types are defined in `src/components/text/csc.tsx`:
- `NavKey` - Navigation route keys
- `AccountAssets` - Cryptocurrency/precious metal holdings
- `AccountCurrency` - Fiat currency holdings

**Recovery Process**: The app tracks a 6-stage recovery process defined in the `steps` array (Recovery Initiated → Processing → Legal Process → Litigation → Funds Reclaim → Complete).
