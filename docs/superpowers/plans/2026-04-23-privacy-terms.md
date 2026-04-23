# Privacy & Terms Pages — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the "Coming soon" stub pages at `/privacy` and `/terms` with fully rendered legal pages that fetch content from Sanity CMS.

**Architecture:** Two thin page components share a `LegalHero` + `LegalContent` component pair. The GROQ query already exists (`legalPageBySlugQuery`). Pages resolve locale fields and pass plain strings/blocks to presentational components.

**Tech Stack:** Next.js 14 App Router, Sanity CMS, next-intl, @portabletext/react, Tailwind CSS, TypeScript

---

## File Map

| Action | File | Responsibility |
|--------|------|----------------|
| Already exists | `src/sanity/lib/queries.ts` | `legalPageBySlugQuery` already defined — no change |
| Create | `src/components/legal/legal-hero.tsx` | Title + eyebrow + last-updated date display |
| Create | `src/components/legal/legal-content.tsx` | PortableText section with container |
| Modify | `src/app/[locale]/privacy/page.tsx` | Fetch + render privacy page |
| Modify | `src/app/[locale]/terms/page.tsx` | Fetch + render terms page |

---

### Task 1: Create `LegalHero` component

**Files:**
- Create: `src/components/legal/legal-hero.tsx`

- [ ] **Step 1: Create the component**

Create `src/components/legal/legal-hero.tsx`:

```tsx
interface LegalHeroProps {
  title: string;
  updatedAt: string;
  locale: string;
}

export function LegalHero({ title, updatedAt, locale }: LegalHeroProps) {
  const formatted = new Intl.DateTimeFormat(locale, {
    month: 'long',
    year: 'numeric',
  }).format(new Date(updatedAt));

  return (
    <section className="bg-[#0B0D10] px-[7vw] pt-[18vh] pb-[10vh]">
      <div className="mx-auto max-w-2xl">
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#D4A23A]">
          Legal
        </span>
        <h1 className="mt-4 font-serif text-5xl font-semibold text-[#F7F7F5] md:text-6xl">
          {title}
        </h1>
        <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.14em] text-[#A7ACB4]">
          Last updated {formatted}
        </p>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Type-check**

```bash
cd /Users/temuulen/Development/Amuun && npx tsc --noEmit 2>&1 | head -30
```

Expected: no errors related to `legal-hero.tsx`

- [ ] **Step 3: Commit**

```bash
git add src/components/legal/legal-hero.tsx
git commit -m "feat(legal): add LegalHero component"
```

---

### Task 2: Create `LegalContent` component

**Files:**
- Create: `src/components/legal/legal-content.tsx`

- [ ] **Step 1: Create the component**

Create `src/components/legal/legal-content.tsx`:

```tsx
import type { PortableTextBlock } from '@portabletext/react';
import { PortableTextRenderer } from '@/lib/sanity/portable-text';

interface LegalContentProps {
  blocks: PortableTextBlock[];
}

export function LegalContent({ blocks }: LegalContentProps) {
  return (
    <section className="bg-[#0B0D10] px-[7vw] py-[10vh]">
      <div className="mx-auto max-w-2xl">
        <PortableTextRenderer value={blocks} />
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Type-check**

```bash
cd /Users/temuulen/Development/Amuun && npx tsc --noEmit 2>&1 | head -30
```

Expected: no errors related to `legal-content.tsx`

- [ ] **Step 3: Commit**

```bash
git add src/components/legal/legal-content.tsx
git commit -m "feat(legal): add LegalContent component"
```

---

### Task 3: Implement `/privacy` page

**Files:**
- Modify: `src/app/[locale]/privacy/page.tsx`

The current file contains only: `import { StubPage } from '@/components/sections/stub-page'; export default function Page() { return <StubPage titleKey="privacy" />; }`

Replace it entirely.

- [ ] **Step 1: Write the page**

Replace `src/app/[locale]/privacy/page.tsx` with:

```tsx
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import type { PortableTextBlock } from '@portabletext/react';
import { sanityFetch } from '@/sanity/lib/fetcher';
import { legalPageBySlugQuery } from '@/sanity/lib/queries';
import { resolveLocaleField, type Locale } from '@/lib/locale/resolve-locale-field';
import { Footer } from '@/components/layout/footer';
import { LegalHero } from '@/components/legal/legal-hero';
import { LegalContent } from '@/components/legal/legal-content';
import type { LegalPage } from '@/types/sanity';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const page = await sanityFetch<LegalPage>(
    legalPageBySlugQuery,
    { slug: 'privacy' },
    { tags: ['legalPage'] },
  );
  const title = page?.seo?.title
    ? (resolveLocaleField(page.seo.title, locale) ?? 'Privacy · Amuun')
    : 'Privacy · Amuun';
  const description = page?.seo?.description
    ? (resolveLocaleField(page.seo.description, locale) ?? '')
    : '';
  return { title, description };
}

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const page = await sanityFetch<LegalPage>(
    legalPageBySlugQuery,
    { slug: 'privacy' },
    { tags: ['legalPage'] },
  );

  if (!page) notFound();

  const title = resolveLocaleField(page.title, locale) ?? 'Privacy Policy';
  const blocks = (resolveLocaleField(page.content, locale) ?? []) as PortableTextBlock[];

  return (
    <>
      <LegalHero title={title} updatedAt={page.updatedAt} locale={locale} />
      <LegalContent blocks={blocks} />
      <Footer />
    </>
  );
}
```

- [ ] **Step 2: Type-check**

```bash
cd /Users/temuulen/Development/Amuun && npx tsc --noEmit 2>&1 | head -30
```

Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add "src/app/[locale]/privacy/page.tsx"
git commit -m "feat(legal): implement privacy page with Sanity content"
```

---

### Task 4: Implement `/terms` page

**Files:**
- Modify: `src/app/[locale]/terms/page.tsx`

The current file contains only: `import { StubPage } from '@/components/sections/stub-page'; export default function Page() { return <StubPage titleKey="terms" />; }`

Replace it entirely.

- [ ] **Step 1: Write the page**

Replace `src/app/[locale]/terms/page.tsx` with:

```tsx
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import type { PortableTextBlock } from '@portabletext/react';
import { sanityFetch } from '@/sanity/lib/fetcher';
import { legalPageBySlugQuery } from '@/sanity/lib/queries';
import { resolveLocaleField, type Locale } from '@/lib/locale/resolve-locale-field';
import { Footer } from '@/components/layout/footer';
import { LegalHero } from '@/components/legal/legal-hero';
import { LegalContent } from '@/components/legal/legal-content';
import type { LegalPage } from '@/types/sanity';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const page = await sanityFetch<LegalPage>(
    legalPageBySlugQuery,
    { slug: 'terms' },
    { tags: ['legalPage'] },
  );
  const title = page?.seo?.title
    ? (resolveLocaleField(page.seo.title, locale) ?? 'Terms · Amuun')
    : 'Terms · Amuun';
  const description = page?.seo?.description
    ? (resolveLocaleField(page.seo.description, locale) ?? '')
    : '';
  return { title, description };
}

export default async function TermsPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const page = await sanityFetch<LegalPage>(
    legalPageBySlugQuery,
    { slug: 'terms' },
    { tags: ['legalPage'] },
  );

  if (!page) notFound();

  const title = resolveLocaleField(page.title, locale) ?? 'Terms of Service';
  const blocks = (resolveLocaleField(page.content, locale) ?? []) as PortableTextBlock[];

  return (
    <>
      <LegalHero title={title} updatedAt={page.updatedAt} locale={locale} />
      <LegalContent blocks={blocks} />
      <Footer />
    </>
  );
}
```

- [ ] **Step 2: Type-check**

```bash
cd /Users/temuulen/Development/Amuun && npx tsc --noEmit 2>&1 | head -30
```

Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add "src/app/[locale]/terms/page.tsx"
git commit -m "feat(legal): implement terms page with Sanity content"
```

---

### Task 5: Build verification

- [ ] **Step 1: Run full build**

```bash
cd /Users/temuulen/Development/Amuun && npm run build 2>&1 | tail -30
```

Expected: `✓ Compiled successfully` with `/privacy` and `/terms` routes listed

- [ ] **Step 2: Verify unused import removed from stub-page (if needed)**

If the `StubPage` component no longer lists `'privacy'` or `'terms'` in its `titleKey` union after the pages are replaced — the type is still valid since those values remain in the union. No change needed.

- [ ] **Step 3: Final commit (if any cleanup)**

If any lint/build issues required fixes:

```bash
git add -p
git commit -m "fix(legal): address build issues"
```
