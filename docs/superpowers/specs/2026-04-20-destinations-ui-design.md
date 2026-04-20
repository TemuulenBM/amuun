# Destinations UI — Design Spec

**Date:** 2026-04-20
**Routes:** `/[locale]/destinations`, `/[locale]/destinations/[slug]`
**Status:** Approved
**Author:** Brainstormed with user in session 2026-04-20

## Goal

Replace the `StubPage` placeholders at `src/app/[locale]/destinations/page.tsx` and `src/app/[locale]/destinations/[slug]/page.tsx` with production-grade destination listing and detail pages. Listing presents Mongolia's five regions as an editorial, region-grouped layout anchored by an interactive MapLibre GL overview map. Detail pages tell each destination's story and surface the tours running through it.

This sub-project also delivers the **destinations half of PRD F14** (interactive map with pins). Tour-route polylines remain a separate sub-project.

## Non-Goals

- Tour-route polylines on the listing map (tour map is a separate sub-project)
- Booking/availability for destinations (destinations are not bookable units)
- User-submitted destination reviews
- Destination editor UI (Sanity Studio handles that)
- Real-time weather, currency, or external API enrichment
- Tour map polylines on detail pages (only a static location pin)

## Design Principles

1. **Brand continuity** — same dark-bg (`#0B0D10`) + gold (`#D4A23A`) palette as homepage and tour detail. No cream/navy switch.
2. **Editorial geography** — region grouping is the structural anchor. The page teaches Mongolia's geography through layout, not just lists.
3. **Map as first-class UI, not a footnote** — the listing's overview map is the primary navigation device alongside the region sections.
4. **Localized at every string** — `title`, `subtitle`, `story`, `bestTime`, `highlights`, `seo` all use `localeString`/`localeText`/`localeBlockContent`.
5. **One GSAP-pinned hero per page** — listing and detail each have one pinned hero (matching homepage and tour-detail rhythm); below-the-fold content scrolls normally.

## Data Source

### Existing GROQ queries (reuse)
- `allDestinationsQuery` — listing
- `destinationBySlugQuery` — detail (already returns reverse-referenced tours)
- `destinationSlugsQuery` — `generateStaticParams`

### Schema change required
Add to `src/sanity/schemas/documents/destination.ts`:
- `coordinates: geopoint` — **optional initially** (see Migration Strategy). Used for map pins.

`gallery: imageWithAlt[]` is already defined in the schema; only seed data needs to populate it.

### Fetching pattern
- Listing: `sanityFetch(allDestinationsQuery, { revalidate: 3600, tags: ['destination'] })`
- Detail: `sanityFetch(destinationBySlugQuery, { revalidate: 3600, tags: ['destination', slug] })`
- `generateStaticParams` uses `destinationSlugsQuery` to pre-render all five slugs per locale.

### Revalidation
Verify `/api/revalidate` already revalidates the `'destination'` tag on Sanity webhook. If not, extend the route handler to include `destination` in the type filter.

## Page Architecture

### Listing — `/[locale]/destinations`

```
<main class="relative bg-[#0B0D10]">
  <DestinationsHero />          ← pinned ~80vh; italic+bold "Destinations" headline + editorial intro
  <DestinationsOverviewMap />   ← client, dynamic MapLibre GL, ~600px tall, 5 pins
  <DestinationRegionSection />  ← repeated 5×, one per region (Central → Gobi → Western → Northern → Terelj)
  <DestinationsCTABand />       ← "Build a journey across regions" → /custom-trip
</main>
```

`DestinationRegionSection` layout per region:
- Region header — region name (italic+bold), 1-line description, count of destinations
- Destination cards — alternating image/text columns; image left/right by index
- Each card: hero image, title, subtitle, top-3 highlights, "Best time" line, CTA → detail

### Detail — `/[locale]/destinations/[slug]`

```
<main class="relative bg-[#0B0D10]">
  <DestinationHero />           ← pinned ~90vh, full-bleed heroImage + region badge + title + subtitle
  <DestinationStatStrip />      ← Region · Best time · X highlights · Y tours available
  <DestinationStory />          ← Portable Text story (2/3) + Highlights side panel (1/3)
  <DestinationGallery />        ← masonry grid + lightbox (reuses tour-gallery + tour-gallery-lightbox)
  <DestinationLocationMap />    ← client, dynamic MapLibre GL, ~400px tall, single pin
  <DestinationTours />          ← "Tours featuring this place" — reverse-referenced tour cards (max 6)
  <DestinationCTABand />        ← "Plan a journey here" → /custom-trip
</main>
```

## Components

All under `src/components/destination/` unless noted.

### Server components (default)
- `destinations-cta-band.tsx`
- `destination-region-section.tsx` — accepts `region` + `destinations[]` props
- `destination-card.tsx`
- `destination-stat-strip.tsx` (detail)
- `destination-story.tsx` (detail) — wraps `RichText` Portable Text renderer
- `destination-tours.tsx` (detail) — reuses tour-card component
- `destination-cta-band.tsx`

### Client components (interactive / animation)
- `destinations-hero.tsx` — `'use client'`, GSAP-pinned listing hero (matches `tour-hero.tsx` pattern)
- `destination-hero.tsx` — `'use client'`, GSAP-pinned detail hero
- `destinations-overview-map.tsx` — `'use client'`, dynamic-imports `MapLibre GLMap`
- `destination-location-map.tsx` — `'use client'`, dynamic-imports `MapLibre GLMap`
- `destination-gallery.tsx` — reuses existing `tour-gallery.tsx` + `tour-gallery-lightbox.tsx` patterns (already client)

### Shared
- `src/components/shared/maplibre-map.tsx` — generic MapLibre GL wrapper
  - Props: `center`, `zoom`, `pins[]`, `styleUrl`, `onPinClick?`, `height`, `interactive?`
  - Internal: SSR-safe via `dynamic(() => import('./maplibre-map.client'), { ssr: false })`
  - Default style: Protomaps light (brand-tinted via `src/styles/maplibre-style.ts`)
  - Includes a screen-reader-only `<ul>` of pins with `aria-label`s for a11y fallback
  - Pin rendering: custom HTML/SVG markers (gold dot matching brand)

## Schema Migration Strategy

Adding `coordinates` as **required** would invalidate the five existing seeded documents. Sequence:

1. **Phase A (this PR):** Add `coordinates` as **optional** in schema.
2. **Phase A (this PR):** Update seed data with coordinates for all five destinations and re-run seed (upsert by `_id`).
3. **Phase B (follow-up, not in this spec):** Once production Sanity dataset confirmed populated, flip `coordinates` to `required` in a separate small PR.

Coordinate values (decimal degrees, WGS84):
- `gobi` — `[43.5, 104.0]`
- `altai` — `[49.0, 87.7]`
- `khuvsgul` — `[51.0, 100.5]`
- `kharkhorum` — `[47.2, 102.8]`
- `terelj` — `[48.0, 107.5]`

Mongolia centroid for map default view: `[46.8, 103.8]`, zoom `5`.

## Seed Content Additions

Edit `scripts/seed/data/destinations.ts` to add to each of the five destinations:

1. **`coordinates`** — geopoint object
2. **`story`** — `localeBlockContent` (3 paragraph blocks per locale, editorial tone matching tour summaries)
3. **`gallery`** — `imageWithAlt[]`, 4 images per destination

Image source plan:
- Local images already on disk in `public/images/`: `gobi-crossing.jpg`, `altai-peaks.jpg`, `taiga-reindeer.jpg`, `karakorum.jpg`, `canyon-descent.jpg`, `dunes-climb.jpg`, `hero-desert.jpg`, `volcano-lake.jpg`
- Each destination's hero stays as-is; gallery uses 1 reused destination image + 3 supplemental Unsplash CDN URLs (same approach as testimonials and team seed)
- Unsplash query themes per destination (sand dunes, alpine peaks, taiga reindeer, monastery ruins, granite cliffs)

## i18n

Add a `destinations` namespace to `messages/{en,ko,mn}.json`:

- `destinations.hero.eyebrow` — "Geography" / "지리" / "Газар зүй"
- `destinations.hero.heading` — "Five regions, one country" / etc.
- `destinations.hero.intro` — editorial intro paragraph
- `destinations.regions.central.label`, `.tagline` — and same for `gobi`, `western`, `northern`, `terelj`
- `destinations.card.bestTime` — "Best time"
- `destinations.card.highlightsCount` — "{count} highlights"
- `destinations.card.cta` — "Explore"
- `destinations.detail.toursHeading` — "Tours featuring {destination}" (parameterized per destination title)
- `destinations.detail.noTours` — "No tours currently routed through here."
- `destinations.cta.heading`, `.body`, `.button` — CTA band copy
- `destinations.map.regionListLabel` — "Destinations by region" (SR fallback)
- `destinations.map.pinLabel` — "{title}, {region}" (per-pin aria-label template)

## SEO & Structured Data

### Metadata API per page

Both pages export `generateMetadata()` returning:
- `title` — from `seo.title.{locale}` (detail) or i18n string (listing)
- `description` — from `seo.description.{locale}` (detail) or i18n string (listing)
- `alternates.canonical` — current URL
- `alternates.languages` — hreflang map for `en`/`ko`/`mn`
- `openGraph` — `title`, `description`, `images: [heroImage URL via Sanity image builder]`
- `twitter` — same shape

### JSON-LD

- **Listing page:** `ItemList` schema linking five destinations as `Place` entries
- **Detail page:** `TouristAttraction` schema with `name`, `description`, `image`, `geo` (lat/long from `coordinates`), `containedInPlace` (Mongolia)

Embedded as `<script type="application/ld+json">` in the page's server-rendered output.

## Accessibility

- **Map fallback:** Inside both map components, render an `<ul aria-label={t('destinations.map.regionListLabel')}>` that is `sr-only` but contains every destination as a real link. Screen-reader users navigate via the list, not the map canvas.
- **Pin a11y:** Each MapLibre GL marker uses an `aria-label` matching the pin label template. Markers are keyboard-focusable via MapLibre GL's keyboard nav (`keyboard: true`).
- **Reduced motion:** Pin click → smooth scroll to region section is gated on `window.matchMedia('(prefers-reduced-motion: reduce)').matches`. If reduced, fall back to instant `scrollIntoView({ behavior: 'auto' })`.
- **Skip link:** Existing layout-level skip link must skip past the map.
- **WCAG AA contrast:** Region badges, pin labels, and CTA buttons inherit existing token-based colors that already pass AA.
- **Focus order:** After map, focus moves to the first region section heading. Region headings are `<h2>`; destination titles are `<h3>`.

## Dark-Mode Hook (Future-Proof)

The `MaplibreMap` component accepts a `styleUrl` prop. Default points to a brand-tinted Protomaps light style. When the dark mode toggle (PRD F40) ships, callers can pass a dark style URL (Protomaps "dark" or our own brand-tinted dark JSON). No conditional logic in this spec; just the prop surface so the integration is a one-line change later.

## Error Handling

| Layer | Strategy |
|---|---|
| Slug not found | `notFound()` returns the existing not-found page |
| Sanity fetch failure | `error.tsx` at `/[locale]/destinations` and `/[locale]/destinations/[slug]` (small wrappers around shared error UI) |
| MapLibre GL load failure | The `dynamic` loader's fallback renders a `<div role="alert">` explaining the map is unavailable, plus the SR fallback list is visible to all users |
| No tours referenced | `destination-tours.tsx` renders the `destinations.detail.noTours` message instead of an empty grid |
| No coordinates on a destination doc | `destinations-overview-map.tsx` filters out pins where `coordinates` is `null`; detail map renders fallback message |

## Verification & Acceptance

PRD-aligned manual QA, no automated test setup.

### Build verification
- `pnpm build` completes without TypeScript errors
- `pnpm lint` clean
- No console errors in dev or production build

### Functional checks (per locale: en, ko, mn)
- `/destinations` renders with all 5 region sections in order
- Overview map loads, shows 5 pins with correct coordinates
- Click a pin → smooth-scrolls to that region section (or jumps if reduced-motion)
- Each destination card shows correct title, subtitle, highlights count, best-time, hero image
- Card CTA → `/[locale]/destinations/{slug}` works
- Detail page renders all 7 sections in order
- Story Portable Text renders correctly
- Gallery lightbox opens, navigates, closes
- Location map shows single pin at correct coordinates
- "Tours featuring this place" shows the tours that reference this destination
- All hardcoded strings come from `messages/*.json` — no English bleeding into KO/MN

### Cross-page integration
- Tour detail's destination links (`tour-overview.tsx:43`) resolve correctly. Verify the link includes locale prefix; if not, this is a pre-existing bug to fix as part of this work.
- Tour detail page → click destination → destination detail → click tour → loop closes

### SEO checks
- View page source on detail: `<title>`, OG tags, hreflang, JSON-LD all present and correct per locale
- Listing JSON-LD validates as `ItemList` (use Google's Rich Results Test or schema.org validator)

### Accessibility checks
- Tab through listing: skip link → hero → map (focusable) → region sections → CTA
- Screen reader (VoiceOver) announces the SR-only region list inside the map
- `prefers-reduced-motion` respected (toggle in macOS System Settings)
- Color contrast spot-checks with browser devtools

### Mobile (≤768px)
- Listing map height collapses appropriately, pins remain tappable
- Region sections stack vertically with image above text
- Detail location map remains usable
- Gallery lightbox swipe gestures work

## Out of Scope (Explicitly Deferred)

- **Lazy-loading the listing map** via intersection observer — post-launch perf optimization
- **CartoDB tile localization** (Mongolian/Korean labels) — current OSM-source labels accepted
- **Dark mode integration** — surface ready via `styleUrl` prop (with `MAPLIBRE_STYLE_DARK` already exported), wiring deferred to F40
- **Tour-route polylines on map** — separate F14 sub-project
- **Cross-region "related destinations" section** on detail — YAGNI for 5 destinations
- **Schema migration to make `coordinates` required** — separate follow-up PR after seed verified
- **Custom MapLibre GL marker icons** matching brand — Phase B polish; default markers acceptable initially as long as they're styled minimally (gold dot or similar)

## Dependencies

**Not currently installed.** Add before scaffolding components:
- `maplibre-gl` — MapLibre GL JS core (vector-tile renderer, MIT-licensed fork of Mapbox GL JS pre-BSL)
- `react-map-gl` — React wrapper; import bindings from `react-map-gl/maplibre` entry point (supports React 18/19 and Next 16)

CSS: import `maplibre-gl/dist/maplibre-gl.css` once at the map component level.

## Tile Provider

**Protomaps hosted basemap** as default (free, no API key required for development):

- URL: `https://api.protomaps.com/v4.pmtiles` (public demo instance) or self-hosted `.pmtiles` on Vercel's edge
- Style: Protomaps "light" (default) with brand color overrides for roads and labels; `"dark"` style available for future dark-mode wiring

Switch to paid/self-hosted tiles at traffic volume. An alternative (no-key) provider is **OpenFreeMap** — also free, community-hosted.

Styles are plain JSON, so the component accepts a `styleUrl` prop and brand customization happens in a single `src/styles/maplibre-style.ts` module — not hard-coded in the component.

## Open Questions

None. All design decisions resolved during brainstorming session 2026-04-20.
