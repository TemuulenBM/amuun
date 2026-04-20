# Tour Detail UI — Design Spec

**Date:** 2026-04-20
**Route:** `/[locale]/tours/[slug]`
**Status:** Approved
**Author:** Brainstormed with user in session 2026-04-20

## Goal

Replace the `StubPage` at `src/app/[locale]/tours/[slug]/page.tsx` with a production-grade tour detail page that fetches a `tour` document from Sanity by slug and renders it in Amuun's dark-and-gold editorial-luxury aesthetic. The page is the "sales asset core" — the conversion surface for premium viewers.

## Non-Goals

- Booking/checkout flow (no payment integration)
- User accounts / saved tours
- Real map integration (geopoints render as decorative static SVG route for now)
- Tour listing page (`/tours/`) — separate spec
- Admin editing UI (Sanity Studio handles that)

## Design Principles

1. **Brand continuity** — stays in the dark-bg (`#0B0D10`) + gold (`#D4A23A`) palette. No cream/navy switch even though design reference memory mentions it; the shipped homepage is dark+gold, interior pages must match.
2. **Cinematic hero, editorial body** — hero uses the homepage's GSAP pinned rhythm for brand recognition, but below-the-fold sections use regular vertical flow with `whileInView` fade-ups so data-heavy content stays readable.
3. **Editorial restraint** — one GSAP-driven pinned section per page (the hero), everything else quiet.
4. **Localized at every string** — `title`, `summary`, `description`, itinerary day fields, pricing notes — all use `localeString`/`localeText`/`localeBlockContent` and resolve via the active locale.

## Data Source

Query: existing `tourBySlugQuery` in `src/sanity/lib/queries.ts` (no schema changes needed). Returns:

- `title`, `slug`, `summary`, `description` (Portable Text), `heroImage`, `gallery`
- `duration`, `difficulty`, `seasons`, `included[]`, `excluded[]`
- `itinerary[]` (each: `day`, `title`, `description`, `accommodation`, `meals[]`, `image`)
- `mapRoute[]` (geopoints)
- `pricing` (`currency`, `perPerson`, `standard`, `deluxe`, `private`, `notes`)
- `destinations[]->{_id, title, slug, region, heroImage}`
- `faqs[]->{_id, question, answer, category, order}`
- `relatedTours[]->{_id, title, slug, summary, heroImage, duration, difficulty, pricing}`
- `seo`

Fetching: `sanityFetch` with `revalidate: 3600`, `tags: ['tour', slug]`.

Static generation: `generateStaticParams` uses `tourSlugsQuery` to pre-render all published tour slugs per locale.

## Page Architecture

```
<main class="relative bg-[#0B0D10]">
  <TourHero />              ← pinned, ~100vh, GSAP hero rhythm
  <TourOverview />          ← summary + Portable Text description + decorative route line
  <TourItinerary />         ← desktop sticky day-nav, mobile accordion
  <TourPricing />           ← 3 tier cards
  <TourGallery />           ← masonry grid + lightbox
  <TourIncludedExcluded />  ← two-column checklist
  <TourFaqs />              ← accordion
  <TourRelated />           ← 3 horizontal cards (skipped if empty)
  <TourCtaBand />           ← inquire CTA → /contact?tour=<slug>
  <Footer />
</main>
```

### Section details

**TourHero** (pinned, ~100vh)
- Full-bleed `heroImage` (Sanity URL via `urlFor`, width ≥ 2000, quality 85)
- Dark gradient overlay (matches `.dark-overlay`)
- Centered stack: eyebrow (`{duration} DAYS · {difficulty} · {seasons.join(" / ")}`) → serif H1 (`title[locale]`) → `summary[locale]` subtitle
- Stamp seal in bottom-left corner (reuses `<Stamp />`, tour-specific curved text: uppercase `title[locale]`)
- Floating stat strip at bottom (italic+bold pattern per design reference):
  `<i>{duration}</i> <b>DAYS</b> · <i>{difficulty}</i> <b>EXPEDITION</b> · <i>From</i> <b>{formatPrice(pricing.standard, pricing.currency)}</b>`
- GSAP: word-stagger reveal for H1, Ken Burns on hero image, scroll-pin with subtle scale-down as user scrolls past (matches `HeroSection.tsx`)
- Scroll indicator (eyebrow "Scroll" + thin line) bottom-right

**TourOverview** (normal flow, ~80vh min)
- Two-column desktop / stacked mobile
- Left: lead paragraph (`summary[locale]` enlarged) + Portable Text render of `description[locale]`
- Right: decorative static SVG route line (dashed gold path from `mapRoute` geopoints projected into 2D SVG — or stylised steppe silhouette if no mapRoute)
- Region chips: `destinations[].region` (deduped), each a `<LocaleLink>` to `/destinations/{slug}`

**TourItinerary** (~100vh min)
- Section title: serif H2 "Itinerary" + eyebrow "The journey, day by day"
- Desktop (≥md): 2-col grid
  - Left col (sticky, top 20vh): vertical day list `Day 01 — {title[locale]}`, active day highlighted gold, click scrolls to panel
  - Right col: scroll-snap container of day panels; each panel = day image (image-card border) + day number badge + title + description + accommodation + meals chips
- Mobile: accordion — day header bar, expand reveals full day content
- IntersectionObserver updates active day as user scrolls panels

**TourPricing** (~80vh min)
- Eyebrow "Investment" + H2 "Pricing"
- 3 cards (Standard / Deluxe / Private), each:
  - Card border: 1px gold (matches `.image-card`)
  - Eyebrow: tier name uppercase
  - Price: `{currency} {formatNumber(amount)}` (serif, large)
  - Sub: `{perPerson ? 'per person' : 'per group'}`
  - Single line CTA: `Inquire →` link to contact with tier+slug query
- Below cards: `pricing.notes[locale]` (muted small text)

**TourGallery** (~100vh)
- Eyebrow "Gallery" + H2 "In the field"
- Responsive masonry (CSS `columns-1 md:columns-2 lg:columns-3`, `gap-4`, `break-inside-avoid`)
- Click any image → lightbox (fixed modal, dark backdrop, prev/next keys, esc to close)
- Each image has subtle `image-card` border treatment

**TourIncludedExcluded** (~80vh min)
- Two columns desktop, stacked mobile
- Left: "Included" + gold `<Check />` bullets
- Right: "Not included" + muted `<X />` bullets (no red — editorial)
- Each `included[i]` / `excluded[i]` is a `localeString`

**TourFaqs** (only if `faqs.length > 0`)
- Eyebrow "Questions" + H2 "Before you go"
- Single-column accordion list, 1 expanded at a time
- Question (serif, medium) / Answer (Portable Text)

**TourRelated** (only if `relatedTours.length > 0`)
- Eyebrow "Further journeys" + H2 "You may also like"
- 3 cards horizontal strip, each:
  - Square hero image (image-card)
  - Eyebrow: duration · difficulty
  - Serif title
  - 2-line summary clamp
  - `View expedition →` link
- Use `<LocaleLink>` to `/tours/{slug}`

**TourCtaBand** (~60vh)
- Full-bleed dark section with subtle gold pattern
- Serif H2: "Ready to ride?" (or localized)
- Body: "Private expeditions are limited to six guests per departure."
- Primary CTA button (gold bg, dark text): "Inquire about this expedition" → `/contact?tour={slug}&tier=`
- Secondary link: "Download itinerary PDF" (placeholder href `#` for now)

**Footer** — existing `<Footer />` component

## Component Inventory

New files under `src/components/tour/`:
- `tour-hero.tsx` — client, GSAP
- `tour-overview.tsx` — client, Portable Text + whileInView
- `tour-itinerary.tsx` — client, sticky day-nav + IntersectionObserver
- `tour-pricing.tsx` — server (no interactivity) wrapping client card
- `tour-pricing-card.tsx` — client (hover states)
- `tour-gallery.tsx` — client, lightbox state
- `tour-gallery-lightbox.tsx` — client, modal with keyboard handlers
- `tour-included-excluded.tsx` — server
- `tour-faqs.tsx` — client, accordion state
- `tour-related.tsx` — server
- `tour-cta-band.tsx` — server
- `tour-stat-strip.tsx` — server (italic+bold pattern)

New helpers:
- `src/lib/locale/resolve-locale-field.ts` — `resolveLocaleField<T>(field, locale, fallback='en'): T | undefined`
- `src/lib/format/price.ts` — `formatPrice(amount, currency, locale): string`
- `src/lib/format/duration.ts` — `formatDuration(days, locale): string`
- `src/lib/sanity/portable-text.ts` — Portable Text components for rich-text rendering with Sanity image URL builder

Metadata:
- `generateMetadata({ params })` — returns `title`, `description` (from `seo.metaDescription` or `summary`), OpenGraph image from `heroImage`

i18n additions to `messages/{en,ko,mn}.json` under a new `tour` namespace:
- `tour.overview`, `tour.itinerary`, `tour.pricing`, `tour.pricingStandard`, `tour.pricingDeluxe`, `tour.pricingPrivate`, `tour.pricingPerPerson`, `tour.pricingPerGroup`, `tour.gallery`, `tour.included`, `tour.excluded`, `tour.faqs`, `tour.related`, `tour.ctaHeadline`, `tour.ctaBody`, `tour.ctaPrimary`, `tour.ctaSecondary`, `tour.scroll`, `tour.dayLabel`, `tour.notFound`

## Error / Edge States

- Slug not found in Sanity → `notFound()` (triggers `not-found.tsx`)
- `sanityFetch` returns null (Sanity down or misconfigured) → `notFound()` with logged warning
- Missing optional fields handled gracefully:
  - `description` missing → skip Portable Text block
  - `gallery` empty or `<3` → hide gallery section
  - `faqs` empty → hide FAQ section
  - `relatedTours` empty → hide related section
  - `mapRoute` empty → fallback decorative steppe SVG
  - `pricing.notes` missing → no notes line

## Accessibility

- Every image has `alt` from `imageWithAlt.alt[locale]`
- Accordion uses `<button aria-expanded>` + `aria-controls`
- Lightbox traps focus, restores on close, listens for Escape
- Sticky day-nav items are `<a href="#day-{n}">` so keyboard nav works
- Respect `prefers-reduced-motion` (already handled globally in `globals.css`)
- Color contrast: gold on dark bg checked at WCAG AA for eyebrow text size

## Testing

The project has no test runner configured (no vitest/jest/playwright in `package.json`). Rather than expanding this spec's scope to also install testing infra, verification for this feature is:

- **Type safety:** `pnpm typecheck` must pass
- **Lint:** `pnpm lint` must pass
- **Build:** `pnpm build` must succeed (catches server/client boundary errors, missing params)
- **Manual QA:** browse each seeded tour at `/en/tours/<slug>`, `/ko/tours/<slug>`, `/mn/tours/<slug>` and verify hero, itinerary day-switching, pricing cards, gallery lightbox, related tour navigation, and locale fallback when a field is missing in a locale

Testing infrastructure (vitest for unit/component + Playwright for E2E) is explicitly deferred to a follow-up spec. The implementation plan should NOT try to set up test runners as part of this work.

## Implementation Order

1. Helpers (`resolveLocaleField`, `formatPrice`, `formatDuration`, portable text components)
2. `generateStaticParams` + `generateMetadata` + page skeleton that fetches tour and renders sections in order
3. `TourHero` with GSAP
4. `TourOverview`
5. `TourItinerary` (largest piece — sticky nav + scroll sync)
6. `TourPricing` + card
7. `TourIncludedExcluded`
8. `TourGallery` + lightbox
9. `TourFaqs`
10. `TourRelated`
11. `TourCtaBand`
12. i18n additions to `messages/*.json`
13. Manual QA in browser at `/en/tours/<slug>` for each seeded tour
14. Tests

Each step commits independently so bisecting is easy.

## Open Questions

None blocking. Future iterations could add:
- Real Mapbox/Leaflet map using `mapRoute`
- Actual PDF itinerary generation
- "Best time to visit" calendar heatmap from `seasons`
- Animated number counters on stat strip
