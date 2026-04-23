# Privacy & Terms Pages — Design Spec

**Date:** 2026-04-23  
**Status:** Approved

---

## Overview

Replace the current "Coming soon" stub pages at `/privacy` and `/terms` with fully rendered legal pages that pull content from Sanity CMS. Both pages share the same layout component; only the slug differs.

---

## Page Structure

```
[Navbar]
LegalHero        — dark bg, eyebrow + h1 + last-updated date
LegalContent     — dark bg, centered narrow column, PortableText
[Footer]
```

---

## Sections

### LegalHero

- Background: `#0B0D10`
- Padding: `px-[7vw] pt-[18vh] pb-[10vh]`
- Eyebrow: `"LEGAL"` — mono uppercase, gold (`#D4A23A`), tracking-[0.18em], 10px
- `h1`: locale-resolved `legalPage.title` — serif, `text-5xl md:text-6xl`, `font-semibold`, cream (`#F7F7F5`)
- Last-updated line: `"Last updated {date}"` — formatted as `"MMMM YYYY"` (e.g. "April 2026") — mono, 11px, muted (`#A7ACB4`)

### LegalContent

- Background: `#0B0D10`
- Padding: `px-[7vw] py-[10vh]`
- Inner container: `mx-auto max-w-2xl`
- Content: `<PortableTextRenderer value={blocks} />` — reuses existing portable-text components (h2, normal, strong, link, lists)

### Footer

- Reuse existing `<Footer />` component.

---

## Data Layer

### New GROQ query — `legalPageBySlugQuery`

Added to `src/sanity/lib/queries.ts`:

```groq
*[_type == "legalPage" && slug == $slug][0]{
  _id, slug, title, content, updatedAt, seo
}
```

Parameters: `{ slug: 'privacy' | 'terms' }`  
Cache tag: `['legalPage']`

### TypeScript type

`LegalPage` already defined in `src/types/sanity.ts` — no changes needed.

---

## Page Components

### `/src/app/[locale]/privacy/page.tsx`

- Fetch `legalPage` with `slug = "privacy"` via `sanityFetch`
- Generate `<Metadata>` from `legalPage.seo` (title + description)
- Resolve locale field for `title` and `content` via `resolveLocaleField`
- Render: `<LegalHero>` + `<LegalContent>` + `<Footer>`
- 404 guard: if no document returned, call `notFound()`

### `/src/app/[locale]/terms/page.tsx`

- Identical pattern to privacy page with `slug = "terms"`

---

## New Components

### `src/components/legal/legal-hero.tsx`

```ts
interface LegalHeroProps {
  title: string;
  updatedAt: string; // ISO datetime string
}
```

Formats `updatedAt` with `new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric' })`.

### `src/components/legal/legal-content.tsx`

```ts
interface LegalContentProps {
  blocks: PortableTextBlock[];
}
```

Thin wrapper around `<PortableTextRenderer>` with the section padding and max-width container.

---

## i18n

No new namespace required. Page titles and content come from Sanity. `updatedAt` is formatted inline via `Intl.DateTimeFormat` using the request locale.

---

## Seed Data

`scripts/seed/data/legals.ts` already contains complete EN/KO/MN content for both pages. No changes to seed data needed. Assumes documents are already in Sanity from prior seeding.

---

## Out of Scope

- Cookie policy page
- GDPR consent banner
- Editable SEO fields beyond what the schema provides
