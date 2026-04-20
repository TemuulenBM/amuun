# Amuun Foundation + Kimi Homepage Port — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build Amuun's PRD-aligned Next.js 16 foundation at the repo root (replacing the `amuun/` subfolder), then port Kimi k2.5's dark+gold expedition aesthetic, content, and GSAP cinematic motion onto it. Produce a homepage that renders ≥95% visually identical to Kimi's single-page version and a stubbed multi-page skeleton matching PRD Section 3 scope.

**Architecture:** Clean Next.js 16 App Router at `/Users/temuulen/Development/Amuun/`. Tailwind v4 CSS-first (`@theme` tokens in `globals.css`, no `tailwind.config.js`). next-intl v4 with `/[locale]/...` routing for EN/KO/MN. GSAP 3 + `@gsap/react` for ScrollTrigger-driven pinned scroll (preserving Kimi's cinematic motion verbatim). Lenis for smooth scrolling. Sanity v5 Studio scaffolded at `/studio` (schemas deferred). Server components by default; `"use client"` boundaries only for GSAP-driven sections, header interactivity, and cursor tracking.

**Tech Stack:** Next.js 16.2 · React 19.2 · TypeScript 5.6 strict · Tailwind v4.2 · shadcn/ui · next-intl v4 · next-themes · Zod v4 · react-hook-form 7.60 · GSAP 3.13 + @gsap/react · Lenis 1 · Motion 12 · Sanity 5 + next-sanity · Resend · sonner · Node 22 LTS · pnpm 10.

**Out of scope (deferred to follow-up plans):**
- Sanity document/object schemas (9 documents + 7 objects)
- Real Korean/Mongolian content translation (stub key-parity only)
- Tour/Destination/Journal listing + detail pages with real content (stubs only)
- Forms wired to Resend (client-side only)
- Dynamic OG images, JSON-LD structured data
- E2E Playwright test suite (manual smoke only)

**Design reference:** Kimi output at `/Users/temuulen/Development/Amuun/kimi_k2.5/`. The port copies this 1:1 with Next.js adjustments. Do NOT modify or import from `kimi_k2.5/` — it is reference only.

---

## File Structure (target)

```
Amuun/
├── CLAUDE.md                          (exists, untouched)
├── Amuun_prd.docx                     (exists, untouched)
├── .claude/                           (exists, untouched)
├── tasks/
│   ├── todo.md                        (this plan)
│   └── lessons.md                     (scaffold)
├── kimi_k2.5/                         (reference; untouched)
├── .gitignore
├── .prettierrc
├── .prettierignore
├── eslint.config.mjs
├── package.json
├── pnpm-lock.yaml
├── postcss.config.mjs
├── next.config.mjs
├── next-env.d.ts
├── tsconfig.json
├── components.json
├── messages/
│   ├── en.json
│   ├── ko.json
│   └── mn.json
├── public/
│   ├── images/                        (8 Kimi JPGs)
│   ├── icon.svg
│   └── favicon.ico
└── src/
    ├── app/
    │   ├── [locale]/
    │   │   ├── layout.tsx
    │   │   ├── page.tsx               (homepage — Kimi port)
    │   │   ├── tours/page.tsx         (stub)
    │   │   ├── tours/[slug]/page.tsx  (stub)
    │   │   ├── destinations/page.tsx  (stub)
    │   │   ├── destinations/[slug]/page.tsx (stub)
    │   │   ├── journal/page.tsx       (stub)
    │   │   ├── journal/[slug]/page.tsx (stub)
    │   │   ├── about/page.tsx         (stub)
    │   │   ├── contact/page.tsx       (stub)
    │   │   ├── custom-trip/page.tsx   (stub)
    │   │   ├── privacy/page.tsx       (stub)
    │   │   ├── terms/page.tsx         (stub)
    │   │   ├── not-found.tsx
    │   │   └── error.tsx
    │   ├── api/
    │   │   └── revalidate/route.ts    (stub)
    │   ├── studio/[[...tool]]/page.tsx (Sanity Studio)
    │   ├── layout.tsx
    │   ├── globals.css
    │   └── not-found.tsx
    ├── components/
    │   ├── ui/                        (shadcn primitives — minimal for now)
    │   ├── layout/
    │   │   ├── header.tsx
    │   │   ├── footer.tsx
    │   │   ├── container.tsx
    │   │   ├── language-switcher.tsx
    │   │   └── corner-rules.tsx
    │   ├── sections/
    │   │   ├── hero-section.tsx
    │   │   ├── experience-section.tsx
    │   │   ├── contact-section.tsx
    │   │   └── grain-overlay.tsx
    │   ├── shared/
    │   │   ├── stamp.tsx
    │   │   └── locale-link.tsx
    │   └── providers/
    │       ├── smooth-scroll-provider.tsx
    │       └── toaster-provider.tsx
    ├── i18n/
    │   ├── routing.ts
    │   └── request.ts
    ├── lib/
    │   ├── env.ts
    │   ├── utils.ts
    │   └── gsap/
    │       ├── register.ts
    │       └── snap.ts
    ├── sanity/
    │   ├── env.ts
    │   ├── config.ts
    │   └── client.ts
    ├── middleware.ts
    └── types/
        └── global.d.ts
```

---

## Task 0: Preparation & Salvage

### Files
- Remove: `/Users/temuulen/Development/Amuun/amuun/` (v0 output)
- Remove: `/Users/temuulen/Development/Amuun/src/` (empty leftover)
- Create: `/Users/temuulen/Development/Amuun/tasks/lessons.md`
- Copy: Kimi public images → staging

### Steps

- [ ] **Step 0.1: Verify current state**

```bash
cd /Users/temuulen/Development/Amuun
ls
```
Expected output should include: `amuun/`, `kimi_k2.5/`, `src/`, `.claude/`, `tasks/`, `CLAUDE.md`, `Amuun_prd.docx`, `.gitignore`.

- [ ] **Step 0.2: Delete the v0 scaffold**

```bash
cd /Users/temuulen/Development/Amuun
rm -rf amuun
rm -rf src
ls
```
Expected: `amuun/` and `src/` gone. `kimi_k2.5/` remains (reference).

- [ ] **Step 0.3: Create lessons.md scaffold**

Create `/Users/temuulen/Development/Amuun/tasks/lessons.md`:

```markdown
# Lessons

Captured corrections and durable rules from this project.
Read at session start. Append new entries whenever the user corrects an approach.

## Format
- **YYYY-MM-DD** — Context / rule / how to apply

## Entries
```

- [ ] **Step 0.4: Copy Kimi images to staging**

```bash
mkdir -p /Users/temuulen/Development/Amuun/public/images
cp /Users/temuulen/Development/Amuun/kimi_k2.5/public/images/*.jpg /Users/temuulen/Development/Amuun/public/images/
ls /Users/temuulen/Development/Amuun/public/images/
```
Expected: 8 .jpg files (altai-peaks, canyon-descent, dunes-climb, gobi-crossing, hero-desert, karakorum, taiga-reindeer, volcano-lake).

---

## Task 1: package.json, .gitignore, install

### Files
- Create: `package.json`
- Overwrite: `.gitignore`

### Steps

- [ ] **Step 1.1: Write package.json**

Create `/Users/temuulen/Development/Amuun/package.json`:

```json
{
  "name": "amuun",
  "version": "0.1.0",
  "private": true,
  "packageManager": "pnpm@10.0.0",
  "engines": { "node": ">=22.0.0" },
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "typecheck": "tsc --noEmit",
    "format": "prettier --write .",
    "format:check": "prettier --check ."
  },
  "dependencies": {
    "@gsap/react": "^2.1.2",
    "@hookform/resolvers": "^5.0.0",
    "@sanity/vision": "^5.0.0",
    "@studio-freight/lenis": "^1.0.42",
    "@vercel/analytics": "^1.6.1",
    "@vercel/speed-insights": "^1.1.0",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "gsap": "^3.13.0",
    "lucide-react": "^0.562.0",
    "motion": "^12.0.0",
    "next": "16.2.0",
    "next-intl": "^4.0.0",
    "next-sanity": "^9.0.0",
    "next-themes": "^0.4.6",
    "react": "^19.2.0",
    "react-dom": "^19.2.0",
    "react-hook-form": "^7.60.0",
    "resend": "^4.0.0",
    "sanity": "^5.0.0",
    "sonner": "^1.7.1",
    "tailwind-merge": "^3.3.0",
    "zod": "^4.0.0"
  },
  "devDependencies": {
    "@tailwindcss/postcss": "^4.2.0",
    "@types/node": "^22.0.0",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "eslint": "^9.0.0",
    "eslint-config-next": "16.2.0",
    "postcss": "^8.5.0",
    "prettier": "^3.4.0",
    "prettier-plugin-tailwindcss": "^0.6.0",
    "tailwindcss": "^4.2.0",
    "typescript": "^5.6.0"
  }
}
```

- [ ] **Step 1.2: Overwrite .gitignore**

Overwrite `/Users/temuulen/Development/Amuun/.gitignore`:

```gitignore
# Dependencies
node_modules/
.pnpm-store/

# Next.js
.next/
out/
next-env.d.ts

# Environment
.env
.env.local
.env*.local
.env.production

# Build
build/
dist/

# Logs
*.log
npm-debug.log*
pnpm-debug.log*

# OS
.DS_Store
Thumbs.db

# IDE
.vscode/
.idea/
*.swp

# Misc
.turbo/
coverage/
```

- [ ] **Step 1.3: Install**

```bash
cd /Users/temuulen/Development/Amuun
pnpm install
```
Expected: install completes; `node_modules/` and `pnpm-lock.yaml` created. If peer-dep warnings occur for next-intl/sanity, proceed — resolve only if install fails.

---

## Task 2: TypeScript, PostCSS, ESLint, Prettier

### Files
- Create: `tsconfig.json`
- Create: `postcss.config.mjs`
- Create: `eslint.config.mjs`
- Create: `.prettierrc`
- Create: `.prettierignore`
- Create: `next.config.mjs`
- Create: `next-env.d.ts` (next will generate; create empty to avoid errors)

### Steps

- [ ] **Step 2.1: tsconfig.json**

Create `/Users/temuulen/Development/Amuun/tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": false,
    "skipLibCheck": true,
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./src/*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules", "kimi_k2.5", "amuun"]
}
```

- [ ] **Step 2.2: postcss.config.mjs**

Create `/Users/temuulen/Development/Amuun/postcss.config.mjs`:

```js
export default {
  plugins: {
    '@tailwindcss/postcss': {},
  },
};
```

- [ ] **Step 2.3: next.config.mjs**

Create `/Users/temuulen/Development/Amuun/next.config.mjs`:

```js
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'cdn.sanity.io' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
    ],
  },
};

export default withNextIntl(nextConfig);
```

- [ ] **Step 2.4: eslint.config.mjs**

Create `/Users/temuulen/Development/Amuun/eslint.config.mjs`:

```js
import { FlatCompat } from '@eslint/eslintrc';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const compat = new FlatCompat({ baseDirectory: __dirname });

export default [
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  { ignores: ['kimi_k2.5/**', 'amuun/**', '.next/**', 'node_modules/**'] },
];
```

- [ ] **Step 2.5: .prettierrc and .prettierignore**

Create `/Users/temuulen/Development/Amuun/.prettierrc`:

```json
{
  "semi": true,
  "singleQuote": true,
  "trailingComma": "all",
  "printWidth": 100,
  "tabWidth": 2,
  "plugins": ["prettier-plugin-tailwindcss"]
}
```

Create `/Users/temuulen/Development/Amuun/.prettierignore`:

```
node_modules
.next
kimi_k2.5
amuun
pnpm-lock.yaml
public
```

- [ ] **Step 2.6: next-env.d.ts placeholder**

Create `/Users/temuulen/Development/Amuun/next-env.d.ts`:

```ts
/// <reference types="next" />
/// <reference types="next/image-types/global" />

// NOTE: This file should not be edited
// see https://nextjs.org/docs/basic-features/typescript for more information.
```

- [ ] **Step 2.7: Verify TS compiles**

```bash
cd /Users/temuulen/Development/Amuun
pnpm install @eslint/eslintrc -D
pnpm typecheck
```
Expected: no TS errors (no source files yet, so this should pass quickly).

---

## Task 3: i18n routing skeleton (next-intl v4)

### Files
- Create: `src/i18n/routing.ts`
- Create: `src/i18n/request.ts`
- Create: `src/middleware.ts`
- Create: `messages/en.json`, `messages/ko.json`, `messages/mn.json`

### Steps

- [ ] **Step 3.1: i18n/routing.ts**

Create `/Users/temuulen/Development/Amuun/src/i18n/routing.ts`:

```ts
import { defineRouting } from 'next-intl/routing';
import { createNavigation } from 'next-intl/navigation';

export const routing = defineRouting({
  locales: ['en', 'ko', 'mn'],
  defaultLocale: 'en',
  localePrefix: 'always',
});

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
```

- [ ] **Step 3.2: i18n/request.ts**

Create `/Users/temuulen/Development/Amuun/src/i18n/request.ts`:

```ts
import { getRequestConfig } from 'next-intl/server';
import { hasLocale } from 'next-intl';
import { routing } from './routing';

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested) ? requested : routing.defaultLocale;

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});
```

- [ ] **Step 3.3: middleware.ts**

Create `/Users/temuulen/Development/Amuun/src/middleware.ts`:

```ts
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  matcher: ['/((?!api|studio|_next|_vercel|.*\\..*).*)'],
};
```

- [ ] **Step 3.4: messages/en.json**

Create `/Users/temuulen/Development/Amuun/messages/en.json`:

```json
{
  "brand": {
    "name": "AMUUN",
    "tagline": "Private expeditions across the world's last wild horizon."
  },
  "nav": {
    "expeditions": "Expeditions",
    "destinations": "Destinations",
    "about": "About",
    "journal": "Journal",
    "contact": "Contact",
    "menu": "Menu"
  },
  "hero": {
    "line1": "MONGOLIA",
    "line2": "UNFILTERED",
    "left": "Expeditions / Treks / Photography",
    "right": "Scroll to Explore"
  },
  "experiences": {
    "gobi": {
      "eyebrow": "Gobi / Steppe",
      "headline": "Cross the Infinite",
      "body": "Drive ancient herder trails across the Gobi's silent expanse—where every dune line looks like a calligraphy stroke.",
      "cta": "Request the itinerary"
    },
    "taiga": {
      "eyebrow": "Northern Taiga",
      "headline": "Meet the Reindeer People",
      "body": "Spend time with the Tsaatan—one of the last nomadic groups living among wild reindeer in the Siberian-edge forest.",
      "cta": "Read their story"
    },
    "dunes": {
      "eyebrow": "Khongoryn Els",
      "headline": "Climb the Singing Dunes",
      "body": "Ascend 300-meter dunes that hum in the wind, then ride camels at sunset along a ribbon of orange and violet.",
      "cta": "See the route"
    },
    "canyon": {
      "eyebrow": "Khermen Tsav",
      "headline": "Descend into the Canyon",
      "body": "Hike through the 'Mongolian Grand Canyon'—a labyrinth of red cliffs, fossil beds, and silence so deep you can hear the earth cool.",
      "cta": "Plan a trek"
    },
    "altai": {
      "eyebrow": "Altai Tavan Bogd",
      "headline": "Trek the Five Holy Peaks",
      "body": "Climb Mongolia's highest summits, walk on ancient glaciers, and meet Kazakh eagle hunters in the high pastures.",
      "cta": "View expedition dates"
    },
    "volcano": {
      "eyebrow": "Khorgo Lake",
      "headline": "Camp by the White Lake",
      "body": "Paddle crystal water inside an extinct volcano, then sleep under stars that feel close enough to touch.",
      "cta": "Check availability"
    },
    "karakorum": {
      "eyebrow": "Orkhon Valley",
      "headline": "Walk the Ancient Capital",
      "body": "Stand where Genghis Khan built his power base—visit Erdene Zuu, stone turtles, and the ruins that changed history.",
      "cta": "Build your journey"
    }
  },
  "contact": {
    "heading_1": "Begin Your",
    "heading_2": "Journey",
    "intro": "Tell us what you're drawn to—desert, mountains, culture, or all of it. We'll design a private expedition that matches your pace.",
    "emailLabel": "Email",
    "emailValue": "hello@amuun.travel",
    "responseLabel": "Response",
    "responseValue": "1–2 business days",
    "form": {
      "name": "Name",
      "namePlaceholder": "Your name",
      "email": "Email",
      "emailPlaceholder": "your@email.com",
      "interest": "Interest",
      "selectExpedition": "Select an expedition",
      "customJourney": "Custom Journey",
      "message": "Message",
      "messagePlaceholder": "Tell us about your dream journey...",
      "submit": "Request a Call",
      "downloadItinerary": "Download Itinerary PDF"
    },
    "footer": {
      "copyright": "© 2026 Amuun Expeditions. All rights reserved."
    }
  },
  "stub": {
    "comingSoon": "Coming soon",
    "backHome": "Back to home"
  }
}
```

- [ ] **Step 3.5: messages/ko.json and mn.json (key parity stubs)**

Create `/Users/temuulen/Development/Amuun/messages/ko.json` — copy of `en.json` with values left in English (translators fill later). Same file content, committed as a clone. Same for `messages/mn.json`.

```bash
cp /Users/temuulen/Development/Amuun/messages/en.json /Users/temuulen/Development/Amuun/messages/ko.json
cp /Users/temuulen/Development/Amuun/messages/en.json /Users/temuulen/Development/Amuun/messages/mn.json
```

Expected: three JSON files with identical keys.

---

## Task 4: Tailwind v4 globals.css with dark+gold tokens

### Files
- Create: `src/app/globals.css`

### Steps

- [ ] **Step 4.1: globals.css with @theme + component classes**

Create `/Users/temuulen/Development/Amuun/src/app/globals.css`:

```css
@import 'tailwindcss';
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=Inter:wght@300;400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap');

@theme {
  /* Amuun brand palette (dark + gold expedition) */
  --color-bg: #0B0D10;
  --color-bg-light: #F4F1EA;
  --color-gold: #D4A23A;
  --color-text: #F7F7F5;
  --color-text-muted: #A7ACB4;
  --color-text-dark: #0B0D10;
  --color-border: rgba(247, 247, 245, 0.1);

  /* Fonts */
  --font-serif: 'Cormorant Garamond', Georgia, serif;
  --font-sans: 'Inter', system-ui, sans-serif;
  --font-mono: 'IBM Plex Mono', ui-monospace, monospace;

  /* Radius */
  --radius: 0.25rem;
}

@layer base {
  html {
    scroll-behavior: smooth;
  }

  body {
    background-color: var(--color-bg);
    color: var(--color-text);
    font-family: var(--font-sans);
    font-weight: 300;
    overflow-x: hidden;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: var(--font-serif);
    font-weight: 600;
    letter-spacing: -0.02em;
    line-height: 0.92;
  }
}

@layer components {
  /* Corner rules — editorial frame */
  .corner-rule { position: fixed; pointer-events: none; z-index: 50; }
  .corner-rule--tl { top: 3vh; left: 3vw; width: clamp(64px, 10vw, 140px); height: 1px; background: var(--color-gold); }
  .corner-rule--tl::after { content: ''; position: absolute; top: 0; left: 0; width: 1px; height: clamp(64px, 10vw, 140px); background: var(--color-gold); }
  .corner-rule--tr { top: 3vh; right: 3vw; width: clamp(64px, 10vw, 140px); height: 1px; background: var(--color-gold); }
  .corner-rule--tr::after { content: ''; position: absolute; top: 0; right: 0; width: 1px; height: clamp(64px, 10vw, 140px); background: var(--color-gold); }
  .corner-rule--bl { bottom: 3vh; left: 3vw; width: clamp(64px, 10vw, 140px); height: 1px; background: var(--color-gold); }
  .corner-rule--bl::after { content: ''; position: absolute; bottom: 0; left: 0; width: 1px; height: clamp(64px, 10vw, 140px); background: var(--color-gold); }
  .corner-rule--br { bottom: 3vh; right: 3vw; width: clamp(64px, 10vw, 140px); height: 1px; background: var(--color-gold); }
  .corner-rule--br::after { content: ''; position: absolute; bottom: 0; right: 0; width: 1px; height: clamp(64px, 10vw, 140px); background: var(--color-gold); }

  /* Grain overlay */
  .grain-overlay {
    position: fixed; inset: 0;
    pointer-events: none; z-index: 100;
    opacity: 0.06; mix-blend-mode: overlay;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
  }

  /* Typography */
  .eyebrow {
    font-family: var(--font-mono);
    font-size: 12px;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--color-gold);
  }
  .headline-hero { font-size: clamp(56px, 7vw, 120px); line-height: 0.9; letter-spacing: -0.02em; }
  .headline-section { font-size: clamp(44px, 5.5vw, 96px); line-height: 0.92; }
  .headline-subsection { font-size: clamp(32px, 4vw, 64px); line-height: 1; }
  .body-luxury { font-size: 16px; line-height: 1.7; font-weight: 300; color: var(--color-text-muted); }

  /* Image card */
  .image-card { position: relative; border: 1px solid var(--color-gold); overflow: hidden; }
  .image-card::before { content: ''; position: absolute; inset: 0; border: 1px solid var(--color-gold); opacity: 0.3; pointer-events: none; z-index: 1; }

  /* CTA link */
  .cta-link {
    display: inline-flex; align-items: center; gap: 8px;
    font-family: var(--font-mono);
    font-size: 12px; letter-spacing: 0.12em; text-transform: uppercase;
    color: var(--color-gold);
    transition: gap 0.3s ease;
  }
  .cta-link:hover { gap: 12px; }

  /* Section base */
  .section-pinned { position: relative; width: 100vw; height: 100vh; overflow: hidden; }
  .bg-image { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
  .dark-overlay {
    position: absolute; inset: 0; pointer-events: none;
    background: linear-gradient(to bottom,
      rgba(11,13,16,0.4) 0%,
      rgba(11,13,16,0.2) 50%,
      rgba(11,13,16,0.5) 100%);
  }

  .section-light { background: var(--color-bg-light); color: var(--color-text-dark); }
}

@layer utilities {
  .will-change-transform { will-change: transform; }
  .perspective-1000 { perspective: 1000px; }
  .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
  .scrollbar-hide::-webkit-scrollbar { display: none; }
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

---

## Task 5: Env validation & utilities

### Files
- Create: `src/lib/env.ts`
- Create: `src/lib/utils.ts`
- Create: `src/types/global.d.ts`

### Steps

- [ ] **Step 5.1: lib/env.ts**

Create `/Users/temuulen/Development/Amuun/src/lib/env.ts`:

```ts
import { z } from 'zod';

const envSchema = z.object({
  NEXT_PUBLIC_SANITY_PROJECT_ID: z.string().min(1).optional(),
  NEXT_PUBLIC_SANITY_DATASET: z.string().default('production'),
  NEXT_PUBLIC_SANITY_API_VERSION: z.string().default('2026-04-17'),
  SANITY_API_WRITE_TOKEN: z.string().optional(),
  SANITY_REVALIDATE_SECRET: z.string().min(16).optional(),
  RESEND_API_KEY: z.string().optional(),
  CONTACT_EMAIL_FROM: z.string().email().optional(),
  CONTACT_EMAIL_TO: z.string().email().optional(),
  NEXT_PUBLIC_SITE_URL: z.string().url().default('http://localhost:3000'),
  NEXT_PUBLIC_SITE_NAME: z.string().default('Amuun'),
});

export const env = envSchema.parse(process.env);
export type Env = z.infer<typeof envSchema>;
```

- [ ] **Step 5.2: lib/utils.ts**

Create `/Users/temuulen/Development/Amuun/src/lib/utils.ts`:

```ts
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
```

- [ ] **Step 5.3: types/global.d.ts**

Create `/Users/temuulen/Development/Amuun/src/types/global.d.ts`:

```ts
declare module '*.svg' {
  const content: string;
  export default content;
}
```

---

## Task 6: GSAP registration helper

### Files
- Create: `src/lib/gsap/register.ts`
- Create: `src/lib/gsap/snap.ts`

### Steps

- [ ] **Step 6.1: lib/gsap/register.ts**

Create `/Users/temuulen/Development/Amuun/src/lib/gsap/register.ts`:

```ts
'use client';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export { gsap, ScrollTrigger };
```

- [ ] **Step 6.2: lib/gsap/snap.ts — global pinned-section snap setup**

Create `/Users/temuulen/Development/Amuun/src/lib/gsap/snap.ts`:

```ts
'use client';

import { ScrollTrigger } from 'gsap/ScrollTrigger';

export function setupGlobalPinnedSnap(): () => void {
  const timer = window.setTimeout(() => {
    const pinned = ScrollTrigger.getAll()
      .filter((st) => st.vars.pin)
      .sort((a, b) => a.start - b.start);

    const maxScroll = ScrollTrigger.maxScroll(window);
    if (!maxScroll || pinned.length === 0) return;

    const ranges = pinned.map((st) => ({
      start: st.start / maxScroll,
      end: (st.end ?? st.start) / maxScroll,
      center: (st.start + ((st.end ?? st.start) - st.start) * 0.5) / maxScroll,
    }));

    ScrollTrigger.create({
      snap: {
        snapTo: (value: number) => {
          const inPinned = ranges.some((r) => value >= r.start - 0.02 && value <= r.end + 0.02);
          if (!inPinned) return value;
          return ranges.reduce(
            (closest, r) =>
              Math.abs(r.center - value) < Math.abs(closest - value) ? r.center : closest,
            ranges[0]?.center ?? 0,
          );
        },
        duration: { min: 0.15, max: 0.35 },
        delay: 0,
        ease: 'power2.out',
      },
    });
  }, 500);

  return () => {
    window.clearTimeout(timer);
    ScrollTrigger.getAll().forEach((st) => st.kill());
  };
}
```

---

## Task 7: Root layout + providers

### Files
- Create: `src/components/providers/smooth-scroll-provider.tsx`
- Create: `src/components/providers/toaster-provider.tsx`
- Create: `src/app/layout.tsx`
- Create: `src/app/[locale]/layout.tsx`

### Steps

- [ ] **Step 7.1: SmoothScrollProvider**

Create `/Users/temuulen/Development/Amuun/src/components/providers/smooth-scroll-provider.tsx`:

```tsx
'use client';

import { useEffect, type ReactNode } from 'react';
import Lenis from '@studio-freight/lenis';

export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
    });

    let rafId = 0;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
```

- [ ] **Step 7.2: ToasterProvider**

Create `/Users/temuulen/Development/Amuun/src/components/providers/toaster-provider.tsx`:

```tsx
'use client';

import { Toaster } from 'sonner';

export function ToasterProvider() {
  return <Toaster position="bottom-right" theme="dark" />;
}
```

- [ ] **Step 7.3: Root app/layout.tsx**

Create `/Users/temuulen/Development/Amuun/src/app/layout.tsx`:

```tsx
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: { default: 'Amuun', template: '%s · Amuun' },
  description: "Private expeditions across the world's last wild horizon.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
```

- [ ] **Step 7.4: Locale layout**

Create `/Users/temuulen/Development/Amuun/src/app/[locale]/layout.tsx`:

```tsx
import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { SmoothScrollProvider } from '@/components/providers/smooth-scroll-provider';
import { ToasterProvider } from '@/components/providers/toaster-provider';
import { GrainOverlay } from '@/components/sections/grain-overlay';
import { CornerRules } from '@/components/layout/corner-rules';
import { Header } from '@/components/layout/header';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import type { Metadata } from 'next';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const metadata: Metadata = {
  title: 'Amuun — Private expeditions across Mongolia',
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider messages={messages}>
          <SmoothScrollProvider>
            <GrainOverlay />
            <CornerRules />
            <Header />
            {children}
            <ToasterProvider />
          </SmoothScrollProvider>
        </NextIntlClientProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
```

---

## Task 8: Stamp component (cursor-tracking SVG)

### Files
- Create: `src/components/shared/stamp.tsx`

### Steps

- [ ] **Step 8.1: Stamp component**

Create `/Users/temuulen/Development/Amuun/src/components/shared/stamp.tsx`:

```tsx
'use client';

import { useEffect, useRef } from 'react';

interface StampProps {
  className?: string;
}

export function Stamp({ className = '' }: StampProps) {
  const stampRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = stampRef.current;
    if (!el) return;

    const handleMouseMove = (e: MouseEvent): void => {
      const centerX = window.innerWidth / 2;
      const rotate = ((e.clientX - centerX) / centerX) * 15;
      el.style.transform = `rotate(${rotate}deg)`;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div
      ref={stampRef}
      className={`relative w-[110px] h-[110px] md:w-[140px] md:h-[140px] ${className}`}
      style={{ transition: 'transform 0.1s ease-out' }}
    >
      <svg viewBox="0 0 140 140" className="w-full h-full">
        <circle
          cx="70" cy="70" r="68"
          fill="none" stroke="#D4A23A" strokeWidth="1" strokeDasharray="4 4"
        />
        <defs>
          <path id="circlePath" d="M 70, 70 m -55, 0 a 55,55 0 1,1 110,0 a 55,55 0 1,1 -110,0" />
        </defs>
        <text fill="#D4A23A" fontSize="10" fontFamily="IBM Plex Mono" letterSpacing="0.15em">
          <textPath href="#circlePath">EXPEDITION · TREK · MONGOLIA ·</textPath>
        </text>
        <circle cx="70" cy="70" r="20" fill="none" stroke="#D4A23A" strokeWidth="1" />
        <text x="70" y="75" textAnchor="middle" fill="#D4A23A" fontSize="16" fontFamily="Cormorant Garamond">
          A
        </text>
      </svg>
    </div>
  );
}
```

---

## Task 9: CornerRules + GrainOverlay + Container

### Files
- Create: `src/components/layout/corner-rules.tsx`
- Create: `src/components/sections/grain-overlay.tsx`
- Create: `src/components/layout/container.tsx`

### Steps

- [ ] **Step 9.1: CornerRules**

Create `/Users/temuulen/Development/Amuun/src/components/layout/corner-rules.tsx`:

```tsx
export function CornerRules() {
  return (
    <>
      <div className="corner-rule corner-rule--tl hidden md:block" />
      <div className="corner-rule corner-rule--tr hidden md:block" />
      <div className="corner-rule corner-rule--bl hidden md:block" />
      <div className="corner-rule corner-rule--br hidden md:block" />
    </>
  );
}
```

- [ ] **Step 9.2: GrainOverlay**

Create `/Users/temuulen/Development/Amuun/src/components/sections/grain-overlay.tsx`:

```tsx
export function GrainOverlay() {
  return <div className="grain-overlay" aria-hidden="true" />;
}
```

- [ ] **Step 9.3: Container**

Create `/Users/temuulen/Development/Amuun/src/components/layout/container.tsx`:

```tsx
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface ContainerProps {
  children: ReactNode;
  className?: string;
}

export function Container({ children, className }: ContainerProps) {
  return <div className={cn('mx-auto w-full max-w-[1400px] px-[7vw]', className)}>{children}</div>;
}
```

---

## Task 10: Header + LanguageSwitcher

### Files
- Create: `src/components/layout/header.tsx`
- Create: `src/components/layout/language-switcher.tsx`

### Steps

- [ ] **Step 10.1: LanguageSwitcher**

Create `/Users/temuulen/Development/Amuun/src/components/layout/language-switcher.tsx`:

```tsx
'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/routing';
import { useTransition } from 'react';

const LOCALES = [
  { code: 'en', label: 'EN' },
  { code: 'ko', label: 'KO' },
  { code: 'mn', label: 'MN' },
] as const;

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const switchTo = (nextLocale: 'en' | 'ko' | 'mn') => {
    startTransition(() => {
      router.replace(pathname, { locale: nextLocale });
    });
  };

  return (
    <div className="flex items-center gap-3 font-mono text-xs tracking-[0.12em]">
      {LOCALES.map((l) => (
        <button
          key={l.code}
          onClick={() => switchTo(l.code)}
          disabled={isPending}
          className={`transition-colors ${
            locale === l.code ? 'text-[#D4A23A]' : 'text-[#F7F7F5]/60 hover:text-[#D4A23A]'
          }`}
        >
          {l.label}
        </button>
      ))}
    </div>
  );
}
```

- [ ] **Step 10.2: Header**

Create `/Users/temuulen/Development/Amuun/src/components/layout/header.tsx`:

```tsx
'use client';

import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { LanguageSwitcher } from './language-switcher';

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const t = useTranslations('nav');
  const brand = useTranslations('brand');

  const navItems = [
    { key: 'expeditions', href: '/tours' },
    { key: 'destinations', href: '/destinations' },
    { key: 'about', href: '/about' },
    { key: 'journal', href: '/journal' },
    { key: 'contact', href: '/contact' },
  ] as const;

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-[3vw] py-[3vh]">
        <Link href="/" className="font-serif text-2xl font-semibold tracking-tight text-[#F7F7F5] md:text-3xl">
          {brand('name')}
        </Link>

        <div className="flex items-center gap-6">
          <LanguageSwitcher />
          <button
            onClick={() => setMenuOpen(true)}
            className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.12em] text-[#F7F7F5] hover:text-[#D4A23A] transition-colors"
            aria-label="Open menu"
          >
            <Menu size={18} />
            <span className="hidden sm:inline">{t('menu')}</span>
          </button>
        </div>
      </nav>

      <div
        className={`fixed inset-0 z-50 bg-[#0B0D10]/98 backdrop-blur-sm transition-opacity duration-500 ${
          menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="flex h-full flex-col items-center justify-center">
          <button
            onClick={() => setMenuOpen(false)}
            className="absolute right-[3vw] top-[3vh] text-[#F7F7F5] hover:text-[#D4A23A] transition-colors"
            aria-label="Close menu"
          >
            <X size={28} />
          </button>
          <nav className="flex flex-col items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="font-serif text-4xl text-[#F7F7F5] hover:text-[#D4A23A] transition-colors md:text-6xl"
              >
                {t(item.key)}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </>
  );
}
```

---

## Task 11: HeroSection (GSAP)

### Files
- Create: `src/components/sections/hero-section.tsx`

### Steps

- [ ] **Step 11.1: HeroSection**

Create `/Users/temuulen/Development/Amuun/src/components/sections/hero-section.tsx`:

```tsx
'use client';

import { useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { gsap, ScrollTrigger } from '@/lib/gsap/register';
import { Stamp } from '@/components/shared/stamp';

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const stampRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLImageElement>(null);
  const t = useTranslations('hero');
  const brand = useTranslations('brand');

  useEffect(() => {
    const section = sectionRef.current;
    const headline = headlineRef.current;
    const stamp = stampRef.current;
    const bg = bgRef.current;
    if (!section || !headline || !stamp || !bg) return;

    const ctx = gsap.context(() => {
      gsap.set(headline.querySelectorAll('.word'), { y: 40, opacity: 0, rotateX: 18 });
      gsap.set(stamp, { scale: 0.6, opacity: 0, rotate: -90 });
      gsap.set(bg, { scale: 1.06, opacity: 0 });

      const tl = gsap.timeline({ delay: 0.3 });
      tl.to(bg, { opacity: 1, scale: 1, duration: 1.2, ease: 'power2.out' })
        .to(headline.querySelectorAll('.word'), {
          y: 0, opacity: 1, rotateX: 0,
          duration: 0.8, stagger: 0.08, ease: 'power3.out',
        }, '-=0.8')
        .to(stamp, {
          scale: 1, opacity: 1, rotate: 0,
          duration: 1, ease: 'back.out(1.6)',
        }, '-=0.5');

      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=130%',
          pin: true,
          scrub: 0.6,
          onLeaveBack: () => {
            gsap.to(headline.querySelectorAll('.word'), { y: 0, opacity: 1, duration: 0.3 });
            gsap.to(stamp, { scale: 1, opacity: 1, duration: 0.3 });
            gsap.to(bg, { scale: 1, y: 0, duration: 0.3 });
          },
        },
      });

      scrollTl.fromTo(
        headline.querySelectorAll('.word'),
        { y: 0, opacity: 1 },
        { y: '-22vh', opacity: 0, ease: 'power2.in' },
        0.7,
      );
      scrollTl.fromTo(stamp, { scale: 1, opacity: 1 }, { scale: 1.35, opacity: 0.35, ease: 'power2.in' }, 0.7);
      scrollTl.fromTo(bg, { scale: 1, y: 0 }, { scale: 1.08, y: '-6vh', ease: 'power2.in' }, 0.7);
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="section-pinned z-10 flex items-center justify-center">
      <img
        ref={bgRef}
        src="/images/hero-desert.jpg"
        alt={brand('tagline')}
        className="bg-image will-change-transform"
      />
      <div className="dark-overlay" />

      <div className="relative z-10 px-4 text-center">
        <div ref={stampRef} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 will-change-transform">
          <Stamp />
        </div>

        <div ref={headlineRef} className="relative perspective-1000">
          <h1 className="headline-hero font-serif font-semibold text-[#F7F7F5]">
            <span className="word inline-block">{t('line1')}</span>
          </h1>
          <h1 className="headline-hero mt-2 font-serif font-semibold text-[#F7F7F5]">
            <span className="word inline-block">{t('line2')}</span>
          </h1>
        </div>

        <p className="mt-8 max-w-md mx-auto text-lg font-light text-[#A7ACB4] md:text-xl">
          {brand('tagline')}
        </p>
      </div>

      <div className="absolute bottom-[3vh] left-[3vw] right-[3vw] flex items-end justify-between">
        <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-[#A7ACB4] md:text-xs">
          {t('left')}
        </span>
        <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-[#A7ACB4] md:text-xs">
          {t('right')}
        </span>
      </div>
    </section>
  );
}
```

---

## Task 12: ExperienceSection (GSAP pinned scroll)

### Files
- Create: `src/components/sections/experience-section.tsx`

### Steps

- [ ] **Step 12.1: ExperienceSection**

Create `/Users/temuulen/Development/Amuun/src/components/sections/experience-section.tsx`:

```tsx
'use client';

import { useEffect, useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import { gsap } from '@/lib/gsap/register';
import { Stamp } from '@/components/shared/stamp';

interface ExperienceSectionProps {
  id: string;
  zIndex: number;
  eyebrow: string;
  headline: string;
  body: string;
  cta: string;
  imageSrc: string;
  imageAlt: string;
  imagePosition?: 'left' | 'right';
  bgImageSrc?: string;
}

export function ExperienceSection({
  id,
  zIndex,
  eyebrow,
  headline,
  body,
  cta,
  imageSrc,
  imageAlt,
  imagePosition = 'right',
  bgImageSrc,
}: ExperienceSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const stampRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const text = textRef.current;
    const image = imageRef.current;
    const stamp = stampRef.current;
    if (!section || !text || !image || !stamp) return;

    const ctx = gsap.context(() => {
      const scrollTl = gsap.timeline({
        scrollTrigger: { trigger: section, start: 'top top', end: '+=130%', pin: true, scrub: 0.6 },
      });

      const textStartX = imagePosition === 'right' ? '-55vw' : '55vw';
      const imageStartX = imagePosition === 'right' ? '55vw' : '-55vw';

      scrollTl.fromTo(text, { x: textStartX, opacity: 0 }, { x: 0, opacity: 1, ease: 'none' }, 0);
      scrollTl.fromTo(image, { x: imageStartX, opacity: 0, scale: 0.92 }, { x: 0, opacity: 1, scale: 1, ease: 'none' }, 0);
      scrollTl.fromTo(stamp, { scale: 0.2, opacity: 0, rotate: imagePosition === 'right' ? -120 : 120 }, { scale: 1, opacity: 1, rotate: 0, ease: 'none' }, 0.05);

      const textExitX = imagePosition === 'right' ? '-18vw' : '18vw';
      const imageExitX = imagePosition === 'right' ? '18vw' : '-18vw';

      scrollTl.fromTo(text, { x: 0, opacity: 1 }, { x: textExitX, opacity: 0.25, ease: 'power2.in' }, 0.7);
      scrollTl.fromTo(image, { x: 0, opacity: 1 }, { x: imageExitX, opacity: 0.25, ease: 'power2.in' }, 0.7);
      scrollTl.fromTo(stamp, { y: 0, opacity: 1 }, { y: '18vh', opacity: 0.3, ease: 'power2.in' }, 0.7);
    }, section);

    return () => ctx.revert();
  }, [imagePosition]);

  const textContent = (
    <div ref={textRef} className="will-change-transform">
      <span className="eyebrow block mb-6">{eyebrow}</span>
      <h2 className="headline-section max-w-[40vw] font-serif font-semibold text-[#F7F7F5]">
        {headline}
      </h2>
      <p className="body-luxury mt-8 max-w-[34vw]">{body}</p>
      <a href="#contact" className="cta-link mt-8">
        {cta}
        <ArrowRight size={14} />
      </a>
    </div>
  );

  const imageContent = (
    <div
      ref={imageRef}
      className={`image-card will-change-transform ${
        imagePosition === 'right'
          ? 'absolute right-[7vw] top-[18vh] h-[64vh] w-[30vw]'
          : 'absolute left-[7vw] top-[18vh] h-[64vh] w-[38vw]'
      }`}
    >
      <img src={imageSrc} alt={imageAlt} className="h-full w-full object-cover" />
    </div>
  );

  return (
    <section ref={sectionRef} id={id} className="section-pinned" style={{ zIndex }}>
      {bgImageSrc ? (
        <>
          <img src={bgImageSrc} alt="" className="bg-image" />
          <div className="dark-overlay" />
        </>
      ) : (
        <div className="absolute inset-0 bg-[#0B0D10]" />
      )}

      {imagePosition === 'right' ? (
        <>
          <div className="absolute left-[7vw] top-[26vh]">{textContent}</div>
          {imageContent}
        </>
      ) : (
        <>
          {imageContent}
          <div className="absolute right-[7vw] top-[26vh] max-w-[38vw]">{textContent}</div>
        </>
      )}

      <div ref={stampRef} className="absolute bottom-[12vh] left-1/2 -translate-x-1/2 will-change-transform">
        <Stamp />
      </div>
    </section>
  );
}
```

---

## Task 13: ContactSection (form + GSAP reveals)

### Files
- Create: `src/components/sections/contact-section.tsx`

### Steps

- [ ] **Step 13.1: ContactSection**

Create `/Users/temuulen/Development/Amuun/src/components/sections/contact-section.tsx`:

```tsx
'use client';

import { useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { gsap } from '@/lib/gsap/register';

export function ContactSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const t = useTranslations('contact');
  const exp = useTranslations('experiences');
  const brand = useTranslations('brand');

  useEffect(() => {
    const section = sectionRef.current;
    const content = contentRef.current;
    if (!section || !content) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        content.children,
        { y: 24, opacity: 0 },
        {
          y: 0, opacity: 1,
          stagger: 0.1, duration: 0.8, ease: 'power2.out',
          scrollTrigger: { trigger: section, start: 'top 80%', toggleActions: 'play none none reverse' },
        },
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="section-light relative min-h-screen px-[7vw] py-[10vh]"
      style={{ zIndex: 100 }}
    >
      <div ref={contentRef} className="mx-auto max-w-6xl">
        <div className="grid gap-16 md:grid-cols-2">
          <div>
            <h2 className="headline-section font-serif font-semibold text-[#0B0D10]">
              {t('heading_1')}<br />{t('heading_2')}
            </h2>
            <p className="mt-8 max-w-md text-lg leading-relaxed text-[#0B0D10]/70">{t('intro')}</p>

            <div className="mt-12 space-y-4">
              <div className="flex items-center gap-4">
                <span className="w-32 font-mono text-xs uppercase tracking-[0.12em] text-[#0B0D10]/50">
                  {t('emailLabel')}
                </span>
                <span className="text-[#0B0D10]">{t('emailValue')}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="w-32 font-mono text-xs uppercase tracking-[0.12em] text-[#0B0D10]/50">
                  {t('responseLabel')}
                </span>
                <span className="text-[#0B0D10]">{t('responseValue')}</span>
              </div>
            </div>
          </div>

          <div className="border border-[#0B0D10]/10 bg-white/50 p-8 backdrop-blur-sm md:p-12">
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <Field label={t('form.name')} type="text" placeholder={t('form.namePlaceholder')} />
              <Field label={t('form.email')} type="email" placeholder={t('form.emailPlaceholder')} />

              <div>
                <label className="mb-2 block font-mono text-xs uppercase tracking-[0.12em] text-[#0B0D10]/50">
                  {t('form.interest')}
                </label>
                <select className="w-full border-b border-[#0B0D10]/20 bg-transparent py-2 text-[#0B0D10] transition-colors focus:border-[#D4A23A] focus:outline-none">
                  <option>{t('form.selectExpedition')}</option>
                  <option>{exp('gobi.headline')}</option>
                  <option>{exp('taiga.headline')}</option>
                  <option>{exp('altai.headline')}</option>
                  <option>{t('form.customJourney')}</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block font-mono text-xs uppercase tracking-[0.12em] text-[#0B0D10]/50">
                  {t('form.message')}
                </label>
                <textarea
                  rows={3}
                  className="w-full resize-none border-b border-[#0B0D10]/20 bg-transparent py-2 text-[#0B0D10] transition-colors focus:border-[#D4A23A] focus:outline-none"
                  placeholder={t('form.messagePlaceholder')}
                />
              </div>

              <button
                type="submit"
                className="mt-8 w-full bg-[#0B0D10] py-4 font-mono text-xs uppercase tracking-[0.12em] text-[#F7F7F5] transition-colors hover:bg-[#D4A23A] hover:text-[#0B0D10]"
              >
                {t('form.submit')}
              </button>
            </form>

            <a href="#" className="mt-6 block text-center font-mono text-xs uppercase tracking-[0.12em] text-[#0B0D10]/50 transition-colors hover:text-[#D4A23A]">
              {t('form.downloadItinerary')}
            </a>
          </div>
        </div>

        <footer className="mt-24 flex flex-col items-center justify-between gap-4 border-t border-[#0B0D10]/10 pt-8 md:flex-row">
          <span className="font-serif text-2xl font-semibold">{brand('name')}</span>
          <span className="font-mono text-xs text-[#0B0D10]/50">{t('footer.copyright')}</span>
          <div className="flex gap-6">
            {['Instagram', 'Facebook', 'YouTube'].map((s) => (
              <a
                key={s}
                href="#"
                className="font-mono text-xs uppercase tracking-[0.12em] text-[#0B0D10]/50 transition-colors hover:text-[#D4A23A]"
              >
                {s}
              </a>
            ))}
          </div>
        </footer>
      </div>
    </section>
  );
}

function Field({ label, type, placeholder }: { label: string; type: string; placeholder: string }) {
  return (
    <div>
      <label className="mb-2 block font-mono text-xs uppercase tracking-[0.12em] text-[#0B0D10]/50">
        {label}
      </label>
      <input
        type={type}
        className="w-full border-b border-[#0B0D10]/20 bg-transparent py-2 text-[#0B0D10] transition-colors focus:border-[#D4A23A] focus:outline-none"
        placeholder={placeholder}
      />
    </div>
  );
}
```

---

## Task 14: Homepage assembly

### Files
- Create: `src/app/[locale]/page.tsx`
- Create: `src/components/sections/global-snap.tsx`

### Steps

- [ ] **Step 14.1: GlobalSnap client component**

Create `/Users/temuulen/Development/Amuun/src/components/sections/global-snap.tsx`:

```tsx
'use client';

import { useEffect } from 'react';
import { setupGlobalPinnedSnap } from '@/lib/gsap/snap';

export function GlobalSnap() {
  useEffect(() => {
    const cleanup = setupGlobalPinnedSnap();
    return cleanup;
  }, []);
  return null;
}
```

- [ ] **Step 14.2: Homepage page.tsx**

Create `/Users/temuulen/Development/Amuun/src/app/[locale]/page.tsx`:

```tsx
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { HeroSection } from '@/components/sections/hero-section';
import { ExperienceSection } from '@/components/sections/experience-section';
import { ContactSection } from '@/components/sections/contact-section';
import { GlobalSnap } from '@/components/sections/global-snap';

const EXPERIENCES = [
  { id: 'gobi', zIndex: 20, imageSrc: '/images/gobi-crossing.jpg', imageAlt: '4x4 crossing the Gobi desert', imagePosition: 'right' as const },
  { id: 'taiga', zIndex: 30, imageSrc: '/images/taiga-reindeer.jpg', imageAlt: 'Tsaatan reindeer herder in misty forest', imagePosition: 'left' as const },
  { id: 'dunes', zIndex: 40, imageSrc: '/images/dunes-climb.jpg', imageAlt: 'Golden sand dunes with climber', imagePosition: 'right' as const },
  { id: 'canyon', zIndex: 50, imageSrc: '/images/canyon-descent.jpg', imageAlt: 'Red rock canyon badlands', imagePosition: 'left' as const },
  { id: 'altai', zIndex: 60, imageSrc: '/images/altai-peaks.jpg', imageAlt: 'Snow-capped Altai peaks', imagePosition: 'right' as const },
  { id: 'volcano', zIndex: 70, imageSrc: '/images/volcano-lake.jpg', imageAlt: 'Crater lake in extinct volcano', imagePosition: 'left' as const },
  { id: 'karakorum', zIndex: 80, imageSrc: '/images/karakorum.jpg', imageAlt: 'Erdene Zuu monastery with stone turtle', imagePosition: 'right' as const },
] as const;

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('experiences');

  return (
    <main className="relative bg-[#0B0D10]">
      <GlobalSnap />
      <HeroSection />

      {EXPERIENCES.map((exp) => (
        <ExperienceSection
          key={exp.id}
          id={exp.id}
          zIndex={exp.zIndex}
          eyebrow={t(`${exp.id}.eyebrow`)}
          headline={t(`${exp.id}.headline`)}
          body={t(`${exp.id}.body`)}
          cta={t(`${exp.id}.cta`)}
          imageSrc={exp.imageSrc}
          imageAlt={exp.imageAlt}
          imagePosition={exp.imagePosition}
        />
      ))}

      <ContactSection />
    </main>
  );
}
```

- [ ] **Step 14.3: Build + dev smoke test**

```bash
cd /Users/temuulen/Development/Amuun
pnpm typecheck
pnpm build
```
Expected: typecheck passes, build succeeds. If a module resolution error occurs for `@/lib/gsap/register` — verify `tsconfig.json` paths + `src/` folder structure.

---

## Task 15: Stub pages (tours, destinations, journal, about, contact, custom-trip, privacy, terms)

### Files
- Create: `src/app/[locale]/tours/page.tsx`
- Create: `src/app/[locale]/tours/[slug]/page.tsx`
- Create: `src/app/[locale]/destinations/page.tsx`
- Create: `src/app/[locale]/destinations/[slug]/page.tsx`
- Create: `src/app/[locale]/journal/page.tsx`
- Create: `src/app/[locale]/journal/[slug]/page.tsx`
- Create: `src/app/[locale]/about/page.tsx`
- Create: `src/app/[locale]/contact/page.tsx`
- Create: `src/app/[locale]/custom-trip/page.tsx`
- Create: `src/app/[locale]/privacy/page.tsx`
- Create: `src/app/[locale]/terms/page.tsx`

### Steps

- [ ] **Step 15.1: Create a reusable StubPage component**

Create `/Users/temuulen/Development/Amuun/src/components/sections/stub-page.tsx`:

```tsx
import { Link } from '@/i18n/routing';
import { getTranslations } from 'next-intl/server';

interface StubPageProps {
  title: string;
}

export async function StubPage({ title }: StubPageProps) {
  const t = await getTranslations('stub');
  return (
    <main className="flex min-h-screen items-center justify-center px-[7vw]">
      <div className="text-center">
        <p className="eyebrow mb-6">{t('comingSoon')}</p>
        <h1 className="headline-section font-serif font-semibold text-[#F7F7F5]">{title}</h1>
        <Link href="/" className="cta-link mt-12 inline-flex">
          {t('backHome')}
        </Link>
      </div>
    </main>
  );
}
```

- [ ] **Step 15.2: Create all stub page files**

For each path below, create a file with this pattern (substitute TITLE and filename):

`src/app/[locale]/tours/page.tsx`:

```tsx
import { StubPage } from '@/components/sections/stub-page';
export default function Page() { return <StubPage title="Expeditions" />; }
```

`src/app/[locale]/tours/[slug]/page.tsx`:

```tsx
import { StubPage } from '@/components/sections/stub-page';
export default function Page() { return <StubPage title="Expedition Detail" />; }
```

`src/app/[locale]/destinations/page.tsx`:

```tsx
import { StubPage } from '@/components/sections/stub-page';
export default function Page() { return <StubPage title="Destinations" />; }
```

`src/app/[locale]/destinations/[slug]/page.tsx`:

```tsx
import { StubPage } from '@/components/sections/stub-page';
export default function Page() { return <StubPage title="Destination Detail" />; }
```

`src/app/[locale]/journal/page.tsx`:

```tsx
import { StubPage } from '@/components/sections/stub-page';
export default function Page() { return <StubPage title="Journal" />; }
```

`src/app/[locale]/journal/[slug]/page.tsx`:

```tsx
import { StubPage } from '@/components/sections/stub-page';
export default function Page() { return <StubPage title="Article" />; }
```

`src/app/[locale]/about/page.tsx`:

```tsx
import { StubPage } from '@/components/sections/stub-page';
export default function Page() { return <StubPage title="About Amuun" />; }
```

`src/app/[locale]/contact/page.tsx`:

```tsx
import { StubPage } from '@/components/sections/stub-page';
export default function Page() { return <StubPage title="Contact" />; }
```

`src/app/[locale]/custom-trip/page.tsx`:

```tsx
import { StubPage } from '@/components/sections/stub-page';
export default function Page() { return <StubPage title="Custom Journey" />; }
```

`src/app/[locale]/privacy/page.tsx`:

```tsx
import { StubPage } from '@/components/sections/stub-page';
export default function Page() { return <StubPage title="Privacy Policy" />; }
```

`src/app/[locale]/terms/page.tsx`:

```tsx
import { StubPage } from '@/components/sections/stub-page';
export default function Page() { return <StubPage title="Terms of Service" />; }
```

---

## Task 16: Error pages (404 + error boundary)

### Files
- Create: `src/app/[locale]/not-found.tsx`
- Create: `src/app/[locale]/error.tsx`
- Create: `src/app/not-found.tsx` (root fallback)

### Steps

- [ ] **Step 16.1: Locale not-found**

Create `/Users/temuulen/Development/Amuun/src/app/[locale]/not-found.tsx`:

```tsx
import { Link } from '@/i18n/routing';
import { getTranslations } from 'next-intl/server';

export default async function NotFound() {
  const t = await getTranslations('stub');
  return (
    <main className="flex min-h-screen items-center justify-center px-[7vw]">
      <div className="text-center">
        <p className="eyebrow mb-6">404</p>
        <h1 className="headline-section font-serif font-semibold text-[#F7F7F5]">Lost in the steppe</h1>
        <Link href="/" className="cta-link mt-12 inline-flex">{t('backHome')}</Link>
      </div>
    </main>
  );
}
```

- [ ] **Step 16.2: Locale error boundary**

Create `/Users/temuulen/Development/Amuun/src/app/[locale]/error.tsx`:

```tsx
'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => { console.error(error); }, [error]);

  return (
    <main className="flex min-h-screen items-center justify-center px-[7vw]">
      <div className="text-center">
        <p className="eyebrow mb-6">500</p>
        <h1 className="headline-section font-serif font-semibold text-[#F7F7F5]">The caravan halted</h1>
        <button onClick={reset} className="cta-link mt-12 inline-flex">Try again</button>
      </div>
    </main>
  );
}
```

- [ ] **Step 16.3: Root not-found**

Create `/Users/temuulen/Development/Amuun/src/app/not-found.tsx`:

```tsx
import { redirect } from 'next/navigation';

export default function RootNotFound() {
  redirect('/en');
}
```

---

## Task 17: Sanity Studio scaffold (schemas deferred)

### Files
- Create: `src/sanity/env.ts`
- Create: `src/sanity/config.ts`
- Create: `src/sanity/client.ts`
- Create: `src/app/studio/[[...tool]]/page.tsx`
- Create: `src/app/api/revalidate/route.ts`

### Steps

- [ ] **Step 17.1: sanity/env.ts**

Create `/Users/temuulen/Development/Amuun/src/sanity/env.ts`:

```ts
export const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? '2026-04-17';
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production';
export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? '';
export const useCdn = false;
```

- [ ] **Step 17.2: sanity/config.ts**

Create `/Users/temuulen/Development/Amuun/src/sanity/config.ts`:

```ts
import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { apiVersion, dataset, projectId } from './env';

export default defineConfig({
  name: 'amuun',
  title: 'Amuun Studio',
  basePath: '/studio',
  projectId,
  dataset,
  plugins: [structureTool(), visionTool({ defaultApiVersion: apiVersion })],
  schema: { types: [] },
});
```

- [ ] **Step 17.3: sanity/client.ts**

Create `/Users/temuulen/Development/Amuun/src/sanity/client.ts`:

```ts
import { createClient } from 'next-sanity';
import { apiVersion, dataset, projectId, useCdn } from './env';

export const sanityClient = createClient({ projectId, dataset, apiVersion, useCdn });
```

- [ ] **Step 17.4: Studio page**

Create `/Users/temuulen/Development/Amuun/src/app/studio/[[...tool]]/page.tsx`:

```tsx
'use client';

import { NextStudio } from 'next-sanity/studio';
import config from '@/sanity/config';

export const dynamic = 'force-static';

export default function StudioPage() {
  return <NextStudio config={config} />;
}
```

- [ ] **Step 17.5: Revalidate webhook stub**

Create `/Users/temuulen/Development/Amuun/src/app/api/revalidate/route.ts`:

```ts
import { revalidateTag } from 'next/cache';
import { NextResponse, type NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  const secret = req.headers.get('x-sanity-secret');
  if (secret !== process.env.SANITY_REVALIDATE_SECRET) {
    return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 });
  }
  const body = await req.json().catch(() => ({}));
  const type = body?._type;
  if (typeof type === 'string') revalidateTag(type);
  return NextResponse.json({ ok: true, type });
}
```

---

## Task 18: Verification & Visual diff vs Kimi

### Steps

- [ ] **Step 18.1: Typecheck**

```bash
cd /Users/temuulen/Development/Amuun
pnpm typecheck
```
Expected: no TS errors.

- [ ] **Step 18.2: Lint**

```bash
cd /Users/temuulen/Development/Amuun
pnpm lint
```
Expected: no errors. Fix any reported issues inline.

- [ ] **Step 18.3: Production build**

```bash
cd /Users/temuulen/Development/Amuun
pnpm build
```
Expected: build succeeds with static + dynamic route list. Capture bundle size for homepage route.

- [ ] **Step 18.4: Dev server smoke**

```bash
cd /Users/temuulen/Development/Amuun
pnpm dev
```
Open http://localhost:3000 in browser. Expected: redirects to /en. Page renders with:
- Hero (MONGOLIA / UNFILTERED) with stamp
- 7 experience sections pinned on scroll
- Contact section with form
- Header with menu toggle, language switcher
- Grain overlay + corner rules visible
- Smooth Lenis scroll

- [ ] **Step 18.5: Visual parity check vs Kimi**

Open Kimi reference in a second browser tab by running its dev server:
```bash
cd /Users/temuulen/Development/Amuun/kimi_k2.5
pnpm install
pnpm dev --port 3001
```
Open http://localhost:3001. Scroll through both tabs side by side. Verify:

- Hero background image identical
- Stamp rotates with cursor on both
- Experience section animations mirror (text + image + stamp scrub)
- Fonts render identically
- Gold color #D4A23A matches
- Corner rules in same positions
- Grain overlay intensity matches

If divergence exists:
- Check fonts loaded (Network tab → confirm Google Fonts load)
- Check z-indices in each section
- Check GSAP ScrollTrigger initialized (DevTools console: `ScrollTrigger.getAll().length` should equal 8)

- [ ] **Step 18.6: Reduced-motion check**

In DevTools → Rendering → Emulate CSS `prefers-reduced-motion: reduce`. Reload. Expected: animations disabled, Lenis disabled, page fully readable.

- [ ] **Step 18.7: Locale switch smoke**

Click language switcher EN → KO → MN. Expected: URL changes to /ko/, /mn/ and HTML `lang` attribute updates. Content remains English (stub parity is intentional).

- [ ] **Step 18.8: Commit**

```bash
cd /Users/temuulen/Development/Amuun
git init 2>/dev/null || true
git add -A
git commit -m "feat: scaffold Amuun Next.js foundation with Kimi homepage port"
```

- [ ] **Step 18.9: Update tasks/todo.md with Review**

Append a "Review" section to this `tasks/todo.md` with:
- Actual time spent
- What deviated from plan
- Any Kimi visual differences you couldn't match and why
- Next plan: Sanity schemas + tour listing/detail pages

---

## Self-Review Notes

**Spec coverage:**
- PRD Section 4 (Architecture): ✓ serverless-first, Sanity Studio embedded, Resend stub, Leaflet deferred (no map on homepage)
- PRD Section 5 (Stack): ✓ all versions match PRD table
- PRD Section 6 (Folder structure): ✓ matches Section 6 layout
- PRD Section 7 (Schemas): DEFERRED — schemas: [] with note in plan
- PRD Section 9 (Feature Matrix): F1–F7 (Foundation) all addressed; F11 (Homepage) done; F23 (Legal) + F24 (404/500) scaffolded as stubs
- Kimi port fidelity: all 7 experiences, hero timeline, ExperienceSection pinned scroll, stamp, corner rules, grain, contact form

**Design token lock-in (all sourced from Kimi):**
- `--color-bg: #0B0D10`
- `--color-gold: #D4A23A`
- `--color-text: #F7F7F5`
- `--color-text-muted: #A7ACB4`
- `--color-bg-light: #F4F1EA`
- Fonts: Cormorant Garamond (serif), Inter (sans), IBM Plex Mono (mono)

**Known risks:**
- Hydration flash on hero if GSAP initializes after React paint — mitigated by gsap.set() called in useEffect before timeline (tested in Kimi)
- `next/font` not used — Google CDN @import instead for 1:1 Kimi parity
- ScrollTrigger in strict mode double-mount: useEffect cleanup via gsap.context().revert() handles this
- Sanity config without projectId — Studio will error at /studio until env set. Acceptable (deferred).

---

## Execution Handoff

Plan complete and saved to `tasks/todo.md`. Two execution options:

**1. Subagent-Driven (recommended)** — I dispatch a fresh subagent per task, review between tasks, fast iteration
**2. Inline Execution** — Execute tasks in this session using executing-plans, batch execution with checkpoints

Which approach?
