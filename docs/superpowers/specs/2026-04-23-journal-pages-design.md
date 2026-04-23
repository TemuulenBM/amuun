# Journal Listing + Article Detail — Design Spec

**Date:** 2026-04-23  
**Scope:** `/journal` listing page and `/journal/[slug]` article detail page  
**Project:** Amuun travel portfolio (voidex.studio)

---

## Context

The `blogPost` Sanity schema, GROQ queries (`allBlogPostsQuery`, `blogPostBySlugQuery`, `blogPostSlugsQuery`), TypeScript types (`BlogPost`), and seed data (3 trilingual articles) are all already in place. Only the UI layer is missing. Both pages currently render a `StubPage` placeholder.

Seed articles:
- "The Last Reindeer Herders" — culture, author: `team-saraa-dashdorj`
- "Crossing the Gobi Without a Road" — stories, author: `team-erdene-munkhbat`
- "Shooting the Altai at Golden Hour" — photography, author: (check seed)

**Author requirement:** All articles must display "Temuulen · Voidex Studio" as author. A new `teamMember` document will be added to the seed data with `_id: 'team-temuulen'`, `name: 'Temuulen'`, `role: 'Voidex Studio'`. All three blog posts will have their `author` reference updated to `team-temuulen`.

---

## Design System Reference

- Background: `#0B0D10` (dark navy)
- Text primary: `#F7F7F5` (cream)
- Accent: `#D4A23A` (gold)
- Font: serif (`font-serif`) for headings, `font-mono` for eyebrow/labels
- Padding: `px-[7vw]` horizontal, consistent with tours/destinations pages
- Components follow the same pattern as tours listing and destination detail

---

## Page 1: Journal Listing (`/journal`)

### Layout

```
[Nav]
[Hero Section]       — dark navy, eyebrow + serif headline + subtitle
[Featured Article]   — full-width card (~65vh), image with overlay, title, excerpt, link
[Article Grid]       — 2-column grid, remaining articles as uniform cards
[Footer]
```

### Hero Section

Same structure as tours listing hero:
- Eyebrow: `journalListing.eyebrow` — "Field Notes"
- H1: `journalListing.title` — "Stories from the Steppe"
- Subtitle: `journalListing.subtitle` — short editorial intro line

### Featured Article Card

- First article from the query (newest by `publishedAt`)
- Full-width, aspect ratio ~`16/7`
- Hero image fills the card with a bottom gradient overlay (`from-black/70 to-transparent`)
- Overlaid: category badge (gold mono caps), serif title (large), excerpt (2 lines max), "Read article →" link
- Hover: `scale-[1.02]` transition on image (300ms ease)

### Article Grid

- Remaining articles (index 1+) in a 2-column responsive grid (`md:grid-cols-2`)
- Each card:
  - `aspect-[4/5]` image with hover scale (matches tour cards)
  - Category + date below image in gold mono font (`CULTURE · MAR 2026`)
  - Serif title
  - 3-line excerpt clamp
  - "Read article →" in gold mono

### i18n

New namespace `journalListing` in all three message files (`en.json`, `ko.json`, `mn.json`):
- `eyebrow`, `title`, `subtitle`, `metaTitle`, `metaDescription`, `readArticle`

---

## Page 2: Article Detail (`/journal/[slug]`)

### Layout

```
[Nav]
[Article Hero]       — full-viewport image, overlaid metadata
[Article Body]       — centered narrow column, RichText
[Related Tours]      — horizontal strip (if relatedTours present)
[Footer]
```

### Article Hero

Full-viewport (`min-h-screen`) image with gradient overlay (`from-black/60 via-black/30 to-transparent`).

Overlaid content (bottom-left aligned, `px-[7vw] pb-[10vh]`):
- Category badge — gold mono caps
- H1 serif headline (large, cream)
- Byline: `"by Temuulen · Voidex Studio · {formatted date} · {read time}"`
  - Read time: calculated as `Math.ceil(wordCount / 200)` minutes from article body

### Article Body

- Max-width `max-w-2xl`, centered, `py-[10vh]`
- Uses existing `RichText` component for `localeBlockContent`
- Cream text on navy background
- Generous line-height for editorial feel

### Related Tours Strip

- Only rendered when `relatedTours` has 1+ items
- Section heading: `journalArticle.relatedTours` — "Expeditions You Might Consider"
- 2–3 horizontal tour cards (image + title + duration) linking to `/tours/[slug]`
- Reuses the same card style as `TourRelated` component

### i18n

New namespace `journalArticle` in all three message files:
- `metaTitle`, `readTime`, `byLine`, `relatedTours`

---

## Components

All new components go in `src/components/journal/`:

| File | Purpose |
|------|---------|
| `journal-hero.tsx` | Listing page hero (eyebrow + headline + subtitle) |
| `journal-featured-card.tsx` | Full-width featured article card with overlay |
| `journal-card.tsx` | Uniform grid card for remaining articles |
| `journal-article-hero.tsx` | Detail page full-viewport hero with overlaid metadata |
| `journal-article-body.tsx` | Centered article body wrapping RichText |
| `journal-related-tours.tsx` | Related tours strip at bottom of article |

---

## Data

### Seed Data Change

Add to `scripts/seed/data/team.ts`:
```
_id: 'team-temuulen'
name: 'Temuulen'
role: { en: 'Voidex Studio', ko: 'Voidex Studio', mn: 'Voidex Studio' }
isFounder: false
order: 5
```

Update all three blog posts in `scripts/seed/data/blogs.ts` to set:
```
author: { _type: 'reference', _ref: 'team-temuulen' }
```

### Query Changes

None required — `allBlogPostsQuery` already returns `author.name` and `author.role`. `blogPostBySlugQuery` returns full author with `bio` and `photo`.

---

## Static Generation

`generateStaticParams` on the detail page uses the existing `blogPostSlugsQuery` to pre-render all article slugs at build time across all three locales.

---

## Metadata

Both pages implement `generateMetadata` using `getTranslations` (listing) and Sanity post data (detail), matching the pattern used by tours and destinations.

---

## Out of Scope

- Category filter UI (3 articles don't warrant it)
- Pagination (not needed at current content volume)
- Author profile page
- Newsletter CTA (in PRD cut list)
- Animations / scroll-reveal (separate polish phase)
