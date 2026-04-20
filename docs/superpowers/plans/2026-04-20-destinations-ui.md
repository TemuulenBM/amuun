# Destinations UI Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the stubs at `src/app/[locale]/destinations/page.tsx` and `src/app/[locale]/destinations/[slug]/page.tsx` with production listing + detail pages anchored by an interactive Leaflet map and the existing dark+gold editorial-luxury aesthetic.

**Architecture:** Server Components fetch existing GROQ queries (`allDestinationsQuery`, `destinationBySlugQuery`) via `sanityFetch`. Listing groups results by region; detail composes a 7-section narrative. Two GSAP-pinned heroes (one per page). Two Leaflet maps via a shared `LeafletMap` wrapper that is dynamic-imported with `ssr: false` and ships an `sr-only` fallback list for screen readers. Schema gains an optional `coordinates` geopoint; seed data gains `story`, `gallery`, and `coordinates` for all five destinations.

**Tech Stack:** Next.js 16, React 19, TypeScript, Sanity, next-intl, GSAP, Tailwind v4, `@portabletext/react`, `leaflet` (new), `react-leaflet` (new — version selected per React 19 compat at install time).

**Spec:** [docs/superpowers/specs/2026-04-20-destinations-ui-design.md](../specs/2026-04-20-destinations-ui-design.md)

**Project testing note:** This repo has no test runner configured and the spec defers test infra. Each task's verification step is `pnpm typecheck` + `pnpm lint` + manual inspection. Final task is `pnpm build` + manual browser QA across all three locales.

---

## File Map

**New files:**
- `src/components/shared/leaflet-map.tsx` — server wrapper that dynamic-imports the client implementation
- `src/components/shared/leaflet-map.client.tsx` — `'use client'`, actual Leaflet bindings + SR fallback `<ul>`
- `src/components/destination/destinations-hero.tsx` — client GSAP-pinned listing hero
- `src/components/destination/destinations-overview-map.tsx` — client wrapper that passes 5 pins to `LeafletMap`
- `src/components/destination/destination-card.tsx` — server card (image left/right alternating)
- `src/components/destination/destination-region-section.tsx` — server, header + cards for one region
- `src/components/destination/destinations-cta-band.tsx` — server, shared between listing and detail
- `src/components/destination/destination-hero.tsx` — client GSAP-pinned detail hero
- `src/components/destination/destination-stat-strip.tsx` — server italic+bold strip
- `src/components/destination/destination-story.tsx` — server, Portable Text + Highlights side panel
- `src/components/destination/destination-gallery.tsx` — client, masonry + lightbox (extracted reuse of tour gallery)
- `src/components/destination/destination-location-map.tsx` — client wrapper that passes 1 pin to `LeafletMap`
- `src/components/destination/destination-tours.tsx` — server, tour card grid for reverse-referenced tours

**Modified files:**
- `package.json` + `pnpm-lock.yaml` — add `leaflet`, `react-leaflet`, `@types/leaflet`
- `src/sanity/schemas/documents/destination.ts` — add optional `coordinates` geopoint field
- `src/types/sanity.ts` — extend `Destination` interface with `coordinates?`
- `scripts/seed/data/destinations.ts` — add `coordinates`, `story`, `gallery` for all 5 destinations
- `messages/en.json`, `messages/ko.json`, `messages/mn.json` — add `destinations` namespace
- `src/app/[locale]/destinations/page.tsx` — full replacement
- `src/app/[locale]/destinations/[slug]/page.tsx` — full replacement
- `src/components/tour/tour-overview.tsx` — verify destination link includes locale prefix (small fix if needed)

---

## Task 1: Install Leaflet dependencies

**Files:** `package.json`, `pnpm-lock.yaml`

- [ ] **Step 1: Resolve react-leaflet version**

```bash
cd /Users/temuulen/Development/Amuun
pnpm view react-leaflet versions --json | tail -20
pnpm view react-leaflet peerDependencies
```

Look for the latest version whose `peerDependencies.react` accepts `^19`. As of writing, `react-leaflet@5` (or `4.2.x` with overrides) is the candidate. If only `4.x` is available and it requires `react@^18`, prefer raw `leaflet` and write a small `useEffect`-based wrapper instead. Pick one path and continue.

- [ ] **Step 2: Install packages**

```bash
pnpm add leaflet react-leaflet
pnpm add -D @types/leaflet
```

If raw-leaflet path was chosen in Step 1, skip `react-leaflet` and proceed with just `leaflet` + `@types/leaflet`.

- [ ] **Step 3: Verify install**

```bash
pnpm list leaflet @types/leaflet
pnpm list react-leaflet 2>/dev/null || true
```

Expected: resolved versions printed for `leaflet` and `@types/leaflet`. `react-leaflet` only if installed.

- [ ] **Step 4: Commit**

```bash
git add package.json pnpm-lock.yaml
git commit -m "chore(deps): add leaflet for destinations map"
```

---

## Task 2: Add `coordinates` field to destination schema and types

**Files:** `src/sanity/schemas/documents/destination.ts`, `src/types/sanity.ts`

- [ ] **Step 1: Extend the schema**

Edit `src/sanity/schemas/documents/destination.ts`. Insert a new `defineField` immediately after the `region` field (around line 40), inside the same `fields` array:

```typescript
defineField({
  name: 'coordinates',
  title: 'Coordinates',
  description: 'Geographic centroid used for map pins.',
  type: 'geopoint',
  group: 'content',
}),
```

Do **not** make it `required` yet — existing seeded documents would otherwise be invalid. The follow-up to flip it to required is out of scope for this plan.

- [ ] **Step 2: Extend the TypeScript type**

Edit `src/types/sanity.ts`. Inside the `Destination` interface (around line 100), add the field after `region`:

```typescript
coordinates?: {
  _type: 'geopoint';
  lat: number;
  lng: number;
  alt?: number;
};
```

- [ ] **Step 3: Typecheck**

```bash
pnpm typecheck
```

Expected: clean exit (no errors).

- [ ] **Step 4: Commit**

```bash
git add src/sanity/schemas/documents/destination.ts src/types/sanity.ts
git commit -m "feat(destination): add optional coordinates geopoint field"
```

---

## Task 3: Extend seed data — coordinates, story, gallery for all 5 destinations

**Files:** `scripts/seed/data/destinations.ts`

- [ ] **Step 1: Read existing seed file**

Read `scripts/seed/data/destinations.ts` end-to-end so the next edits land cleanly inside each destination object literal.

- [ ] **Step 2: Add a helper for Unsplash gallery images**

At the top of `scripts/seed/data/destinations.ts`, just below the existing import line, add:

```typescript
import { uploadRemoteImage } from '../upload';
```

If `uploadRemoteImage` does not yet exist in `scripts/seed/upload.ts`, add it there:

```typescript
export async function uploadRemoteImage(url: string): Promise<{ _type: 'image'; asset: { _type: 'reference'; _ref: string } }> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  const asset = await client.assets.upload('image', buf);
  return { _type: 'image', asset: { _type: 'reference', _ref: asset._id } };
}
```

(Use the same `client` import that the existing `uploadLocalImage` uses; mirror its return shape.)

- [ ] **Step 3: Add `coordinates`, `story`, and `gallery` to each destination**

For each of the five destination objects in `buildDestinations()`, insert the three new fields. Insert them in this order: `coordinates` after `region`, `story` after `bestTime`, `gallery` after `heroImage`.

**Coordinate values:**
- `gobi`: `{ _type: 'geopoint', lat: 43.5, lng: 104.0 }`
- `altai`: `{ _type: 'geopoint', lat: 49.0, lng: 87.7 }`
- `khuvsgul`: `{ _type: 'geopoint', lat: 51.0, lng: 100.5 }`
- `kharkhorum`: `{ _type: 'geopoint', lat: 47.2, lng: 102.8 }`
- `terelj`: `{ _type: 'geopoint', lat: 48.0, lng: 107.5 }`

**Story values:** Each destination gets a `story: { _type: 'localeBlockContent', en: [...], ko: [...], mn: [...] }` with **3 paragraph blocks per locale**. Each block has the shape `{ _type: 'block', _key: '<unique>', style: 'normal', children: [{ _type: 'span', _key: '<unique>', text: '<paragraph text>', marks: [] }], markDefs: [] }`.

Write editorial copy matching the tone of existing `seo.description` lines. Aim for ~50–80 words per paragraph. **Do not paste lorem ipsum.** Examples for the Gobi (English) — use as a starting style:

> "The Gobi is not the desert of postcards. It is gravel plains, fossil-flecked cliffs that turn red at dusk, and herder camps that appear out of nothing. Days move by the sun and by what the camels can carry."
>
> "Drive south from Dalanzadgad and the Earth opens. Bayanzag's flaming cliffs gave the world its first dinosaur eggs. Yolyn Am holds ice into July. The Khongoryn dunes sing under bare feet."
>
> "What you take home from the Gobi is not a list of sights. It is a recalibrated sense of distance, of silence, of how little a person needs to be at ease."

Translate each English paragraph into Korean and Mongolian. Match length and tone — these are sales copy, not literal translations.

**Gallery values:** Each destination gets a `gallery: imageWithAlt[]` of **4 images**.
- Image 1: reuse the destination's hero image variable already at the top of `buildDestinations()` (the existing `gobi`, `altai`, `taiga`, `kharkhorum`, `terelj` locals)
- Images 2-4: use `uploadRemoteImage()` with curated Unsplash URLs. Pick images thematically matched to the destination (sand dunes for Gobi, alpine peaks for Altai, taiga / reindeer for Khuvsgul, ruins / steppe for Kharkhorum, granite cliffs for Terelj). Wrap each upload in `imageWithAlt(uploaded, { en: '...', ko: '...', mn: '...' })` with descriptive alt text.

Example (Gobi):

```typescript
const gobiAsset = await uploadLocalImage('gobi-crossing.jpg');
const gobiGallery2 = await uploadRemoteImage('https://images.unsplash.com/photo-<id1>?w=1600&q=80');
const gobiGallery3 = await uploadRemoteImage('https://images.unsplash.com/photo-<id2>?w=1600&q=80');
const gobiGallery4 = await uploadRemoteImage('https://images.unsplash.com/photo-<id3>?w=1600&q=80');
```

…then inside the destination object:

```typescript
gallery: [
  imageWithAlt(gobiAsset, { en: 'Camel caravan crossing dunes at sunrise', ko: '...', mn: '...' }),
  imageWithAlt(gobiGallery2, { en: 'Khongoryn singing dunes', ko: '...', mn: '...' }),
  imageWithAlt(gobiGallery3, { en: 'Bayanzag flaming cliffs at dusk', ko: '...', mn: '...' }),
  imageWithAlt(gobiGallery4, { en: 'Bactrian camels resting at a herder camp', ko: '...', mn: '...' }),
],
```

Pick real, currently-live Unsplash photo IDs by browsing unsplash.com search. Test each URL in a browser before committing.

- [ ] **Step 4: Typecheck**

```bash
pnpm typecheck
```

Expected: clean. If errors complain about `imageWithAlt`'s shape, mirror the existing usage exactly.

- [ ] **Step 5: Commit**

```bash
git add scripts/seed/data/destinations.ts scripts/seed/upload.ts
git commit -m "feat(seed): add coordinates, story, and gallery for destinations"
```

---

## Task 4: Re-run the seed script

**Files:** none (data-only)

- [ ] **Step 1: Run the seed**

```bash
cd /Users/temuulen/Development/Amuun
pnpm tsx scripts/seed.ts
```

Expected: prints upsert lines for all 5 destination IDs (`destination-gobi`, `destination-western`, `destination-northern`, `destination-central`, `destination-terelj`). No errors.

If the script does not exist as `scripts/seed.ts`, look at `package.json` and `scripts/` to find the actual entrypoint and use that instead.

- [ ] **Step 2: Verify in Sanity Studio**

Start dev server, open `/studio`, navigate to one destination, confirm `Coordinates` shows lat/lng, `Story` shows 3 paragraphs in EN/KO/MN tabs, and `Gallery` shows 4 images.

```bash
pnpm dev
```

Open `http://localhost:3000/studio`. Stop the dev server with Ctrl+C when done.

- [ ] **Step 3: No commit (data-only)**

Skip commit; data lives in Sanity, not in the repo.

---

## Task 5: Add `destinations` i18n namespace

**Files:** `messages/en.json`, `messages/ko.json`, `messages/mn.json`

- [ ] **Step 1: Add the namespace to all three locale files**

Append a new top-level `destinations` key to each of `messages/en.json`, `messages/ko.json`, `messages/mn.json`. English version (use as template):

```json
"destinations": {
  "metaTitle": "Destinations · Amuun",
  "metaDescription": "Five regions across Mongolia — Central, Gobi, Western, Northern, and Terelj. Choose where your journey runs.",
  "hero": {
    "eyebrow": "Geography",
    "heading": "Five regions, one country",
    "intro": "Mongolia is not a single landscape. From the gravel plains of the Gobi to the glaciated peaks of the Altai, from the taiga forests of Khuvsgul to the granite valleys of Terelj — every region carries its own weather, its own people, its own pace. Choose where your journey runs."
  },
  "regions": {
    "central": { "label": "Central", "tagline": "Empire and the Orkhon valley" },
    "gobi": { "label": "Gobi", "tagline": "Fossil cliffs and singing dunes" },
    "western": { "label": "Western", "tagline": "Glaciers and eagle hunters" },
    "northern": { "label": "Northern", "tagline": "Taiga, reindeer, and a dark blue lake" },
    "terelj": { "label": "Terelj", "tagline": "Granite cliffs an hour from the capital" }
  },
  "card": {
    "bestTime": "Best time",
    "highlightsCount": "{count} highlights",
    "cta": "Explore"
  },
  "detail": {
    "story": "Story",
    "highlights": "Highlights",
    "gallery": "Gallery",
    "location": "Location",
    "region": "Region",
    "toursAvailable": "Tours available",
    "toursHeading": "Tours featuring {destination}",
    "noTours": "No tours currently routed through here."
  },
  "cta": {
    "heading": "Compose a journey across regions",
    "body": "Mix any of the five into a single private itinerary. Tell us where you want to begin.",
    "button": "Design your trip"
  },
  "map": {
    "regionListLabel": "Destinations by region",
    "pinLabel": "{title}, {region}",
    "loadFailed": "The interactive map could not be loaded. Use the destination list below."
  }
}
```

For `messages/ko.json` and `messages/mn.json`, translate every value (not just the obvious ones — match length and tone). Use the same JSON shape; do not change keys.

- [ ] **Step 2: Validate JSON**

```bash
node -e "JSON.parse(require('fs').readFileSync('messages/en.json'))"
node -e "JSON.parse(require('fs').readFileSync('messages/ko.json'))"
node -e "JSON.parse(require('fs').readFileSync('messages/mn.json'))"
```

Expected: each prints nothing and exits 0.

- [ ] **Step 3: Typecheck**

```bash
pnpm typecheck
```

Expected: clean.

- [ ] **Step 4: Commit**

```bash
git add messages/en.json messages/ko.json messages/mn.json
git commit -m "feat(i18n): add destinations namespace for en/ko/mn"
```

---

## Task 6: Build shared `LeafletMap` wrapper + client implementation

**Files:** `src/components/shared/leaflet-map.tsx`, `src/components/shared/leaflet-map.client.tsx`

- [ ] **Step 1: Create the shared types**

Create `src/components/shared/leaflet-map.tsx`:

```typescript
import dynamic from 'next/dynamic';
import type { ComponentType } from 'react';

export interface LeafletMapPin {
  id: string;
  lat: number;
  lng: number;
  label: string;
  href?: string;
  onClick?: () => void;
}

export interface LeafletMapProps {
  pins: LeafletMapPin[];
  center: [number, number];
  zoom: number;
  height: number;
  tileVariant?: 'positron' | 'positron-no-labels' | 'dark-matter';
  ariaListLabel: string;
  loadFailedMessage: string;
  className?: string;
}

const LeafletMapClient = dynamic<LeafletMapProps>(
  () => import('./leaflet-map.client').then((m) => m.LeafletMapClient),
  {
    ssr: false,
    loading: () => (
      <div
        role="status"
        aria-live="polite"
        className="flex items-center justify-center bg-[#11141A] text-[#9A9A95]"
        style={{ height: 480 }}
      >
        Loading map…
      </div>
    ),
  },
) as ComponentType<LeafletMapProps>;

export function LeafletMap(props: LeafletMapProps) {
  return <LeafletMapClient {...props} />;
}
```

- [ ] **Step 2: Create the client implementation**

Create `src/components/shared/leaflet-map.client.tsx`. The exact React API depends on the version chosen in Task 1.

If `react-leaflet` is installed and React-19-compatible:

```typescript
'use client';

import { useEffect, useRef } from 'react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import type { LeafletMapProps } from './leaflet-map';

const TILE_URLS: Record<NonNullable<LeafletMapProps['tileVariant']>, { url: string; attribution: string }> = {
  'positron': {
    url: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
    attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
  },
  'positron-no-labels': {
    url: 'https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png',
    attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
  },
  'dark-matter': {
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
  },
};

const goldDot = L.divIcon({
  className: 'amuun-pin',
  html: '<span style="display:block;width:14px;height:14px;border-radius:9999px;background:#D4A23A;border:2px solid #0B0D10;box-shadow:0 0 0 3px rgba(212,162,58,0.25);"></span>',
  iconSize: [14, 14],
  iconAnchor: [7, 7],
});

export function LeafletMapClient({
  pins,
  center,
  zoom,
  height,
  tileVariant = 'positron',
  ariaListLabel,
  loadFailedMessage,
  className,
}: LeafletMapProps) {
  const tile = TILE_URLS[tileVariant];
  return (
    <div className={className}>
      <ul className="sr-only" aria-label={ariaListLabel}>
        {pins.map((pin) => (
          <li key={pin.id}>
            {pin.href ? <a href={pin.href}>{pin.label}</a> : pin.label}
          </li>
        ))}
      </ul>
      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={false}
        keyboard
        style={{ height, width: '100%' }}
      >
        <TileLayer url={tile.url} attribution={tile.attribution} />
        {pins.map((pin) => (
          <Marker
            key={pin.id}
            position={[pin.lat, pin.lng]}
            icon={goldDot}
            eventHandlers={pin.onClick ? { click: pin.onClick } : undefined}
            keyboard
          >
            <Popup>
              <span>{pin.label}</span>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
```

If `react-leaflet` was skipped, write a minimal `useEffect`-based wrapper that creates a `L.map(...)`, adds a `L.tileLayer(tile.url, ...)`, and `L.marker([lat, lng], { icon: goldDot }).addTo(map).bindPopup(label)` for each pin. Cleanup with `map.remove()` in the effect's return.

`loadFailedMessage` is referenced by the SR fallback list label only when the map fails entirely; the dynamic-import loading state already handles in-flight loading. Keep the prop for future error-boundary use but you may omit rendering it directly in this task.

- [ ] **Step 3: Typecheck and lint**

```bash
pnpm typecheck && pnpm lint
```

Expected: clean.

- [ ] **Step 4: Commit**

```bash
git add src/components/shared/leaflet-map.tsx src/components/shared/leaflet-map.client.tsx
git commit -m "feat(shared): add Leaflet map wrapper with SR fallback list"
```

---

## Task 7: Build `DestinationsHero` (listing GSAP-pinned hero)

**Files:** `src/components/destination/destinations-hero.tsx`

- [ ] **Step 1: Read tour-hero for reference**

Read `src/components/tour/tour-hero.tsx` end-to-end. Match its GSAP pin pattern, useGSAP hook, and Tailwind class language.

- [ ] **Step 2: Create the component**

Create `src/components/destination/destinations-hero.tsx`:

```typescript
'use client';

import { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

interface DestinationsHeroProps {
  eyebrow: string;
  heading: string;
  intro: string;
}

export function DestinationsHero({ eyebrow, heading, intro }: DestinationsHeroProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      ScrollTrigger.create({
        trigger: ref.current,
        start: 'top top',
        end: '+=80%',
        pin: true,
        pinSpacing: true,
      });
    },
    { scope: ref },
  );

  return (
    <section ref={ref} className="relative flex min-h-[80vh] items-end px-[7vw] pb-[10vh] pt-[28vh] bg-[#0B0D10]">
      <div className="mx-auto max-w-6xl">
        <span className="eyebrow block text-[#D4A23A]">{eyebrow}</span>
        <h1 className="headline-hero mt-6 max-w-4xl font-serif font-semibold text-[#F7F7F5]">
          <em className="not-italic font-normal italic">Five regions,</em>{' '}
          <strong className="font-semibold">one country</strong>
        </h1>
        <p className="body-luxury mt-10 max-w-2xl text-[#C8C7C2]">{intro}</p>
      </div>
    </section>
  );
}
```

The italic+bold pattern in the heading should match the homepage memory note. If the user passes a localized `heading` prop instead of relying on the hard-coded English split, refactor to render `heading` directly. For Phase A, use the hard-coded English split and render `heading` as `aria-label` on the `<h1>` for SR users:

```typescript
<h1 aria-label={heading} className="...">
```

Adjust the JSX so the visible split is in English-only structure but the SR-announced label is the localized full string.

- [ ] **Step 3: Typecheck**

```bash
pnpm typecheck
```

Expected: clean.

- [ ] **Step 4: Commit**

```bash
git add src/components/destination/destinations-hero.tsx
git commit -m "feat(destination): add DestinationsHero pinned hero"
```

---

## Task 8: Build `DestinationsOverviewMap`

**Files:** `src/components/destination/destinations-overview-map.tsx`

- [ ] **Step 1: Create the component**

Create `src/components/destination/destinations-overview-map.tsx`:

```typescript
'use client';

import { useCallback } from 'react';
import { LeafletMap, type LeafletMapPin } from '@/components/shared/leaflet-map';

interface DestinationsOverviewMapProps {
  pins: LeafletMapPin[];
  ariaListLabel: string;
  loadFailedMessage: string;
}

export function DestinationsOverviewMap({
  pins,
  ariaListLabel,
  loadFailedMessage,
}: DestinationsOverviewMapProps) {
  const enrichedPins: LeafletMapPin[] = pins.map((pin) => ({
    ...pin,
    onClick: () => {
      const target = document.getElementById(`region-${pin.id}`);
      if (!target) return;
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
    },
  }));

  return (
    <section className="relative bg-[#0B0D10] px-[7vw] py-[6vh]">
      <div className="mx-auto max-w-6xl">
        <LeafletMap
          pins={enrichedPins}
          center={[46.8, 103.8]}
          zoom={5}
          height={600}
          tileVariant="positron"
          ariaListLabel={ariaListLabel}
          loadFailedMessage={loadFailedMessage}
          className="overflow-hidden rounded-2xl border border-[#1E2128]"
        />
      </div>
    </section>
  );
}
```

The `pin.id` is the destination's region slug (e.g. `gobi`); region sections in the next task render an element with `id="region-{regionSlug}"` that this map scrolls to.

- [ ] **Step 2: Typecheck**

```bash
pnpm typecheck
```

Expected: clean.

- [ ] **Step 3: Commit**

```bash
git add src/components/destination/destinations-overview-map.tsx
git commit -m "feat(destination): add DestinationsOverviewMap with scroll-to-region"
```

---

## Task 9: Build `DestinationCard`

**Files:** `src/components/destination/destination-card.tsx`

- [ ] **Step 1: Create the component**

Create `src/components/destination/destination-card.tsx`:

```typescript
import Image from 'next/image';
import { LocaleLink } from '@/components/shared/locale-link';
import { urlFor } from '@/sanity/lib/image';
import { resolveLocaleField, type Locale } from '@/lib/locale/resolve-locale-field';
import type { LocaleString, ImageWithAlt } from '@/types/tour';

interface DestinationCardData {
  _id: string;
  title: LocaleString;
  slug: { current: string };
  subtitle?: LocaleString;
  region: string;
  bestTime?: LocaleString;
  highlights?: LocaleString[];
  heroImage: ImageWithAlt;
}

interface DestinationCardProps {
  destination: DestinationCardData;
  locale: Locale;
  imageOnRight?: boolean;
  bestTimeLabel: string;
  highlightsCountLabel: (count: number) => string;
  ctaLabel: string;
}

export function DestinationCard({
  destination,
  locale,
  imageOnRight = false,
  bestTimeLabel,
  highlightsCountLabel,
  ctaLabel,
}: DestinationCardProps) {
  const title = resolveLocaleField(destination.title, locale) ?? '';
  const subtitle = resolveLocaleField(destination.subtitle, locale) ?? '';
  const bestTime = resolveLocaleField(destination.bestTime, locale) ?? '';
  const heroAlt = resolveLocaleField(destination.heroImage.alt, locale) ?? title;
  const heroSrc = urlFor(destination.heroImage).width(1600).quality(85).url();
  const highlightsCount = destination.highlights?.length ?? 0;

  const imageBlock = (
    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl">
      <Image src={heroSrc} alt={heroAlt} fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
    </div>
  );

  const textBlock = (
    <div className="flex flex-col justify-center gap-6">
      <h3 className="font-serif text-3xl font-semibold text-[#F7F7F5] md:text-4xl">
        <em className="italic font-normal">{title.split(' ')[0]}</em>
        {title.split(' ').length > 1 ? <strong className="font-semibold"> {title.split(' ').slice(1).join(' ')}</strong> : null}
      </h3>
      <p className="text-sm uppercase tracking-[0.2em] text-[#9A9A95]">{subtitle}</p>
      <dl className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm text-[#C8C7C2]">
        <div>
          <dt className="text-[#9A9A95]">{bestTimeLabel}</dt>
          <dd>{bestTime}</dd>
        </div>
        <div>
          <dt className="text-[#9A9A95]">&nbsp;</dt>
          <dd>{highlightsCountLabel(highlightsCount)}</dd>
        </div>
      </dl>
      <LocaleLink
        href={`/destinations/${destination.slug.current}`}
        className="mt-2 inline-flex items-center gap-2 text-sm uppercase tracking-[0.2em] text-[#D4A23A] hover:text-[#E8B958]"
      >
        {ctaLabel} →
      </LocaleLink>
    </div>
  );

  return (
    <article className="grid gap-10 md:grid-cols-2">
      {imageOnRight ? (
        <>
          {textBlock}
          {imageBlock}
        </>
      ) : (
        <>
          {imageBlock}
          {textBlock}
        </>
      )}
    </article>
  );
}
```

- [ ] **Step 2: Typecheck**

```bash
pnpm typecheck
```

Expected: clean.

- [ ] **Step 3: Commit**

```bash
git add src/components/destination/destination-card.tsx
git commit -m "feat(destination): add DestinationCard alternating layout"
```

---

## Task 10: Build `DestinationRegionSection`

**Files:** `src/components/destination/destination-region-section.tsx`

- [ ] **Step 1: Create the component**

Create `src/components/destination/destination-region-section.tsx`:

```typescript
import type { Locale } from '@/lib/locale/resolve-locale-field';
import { DestinationCard } from './destination-card';
import type { LocaleString, ImageWithAlt } from '@/types/tour';

export interface RegionSectionData {
  regionSlug: 'central' | 'gobi' | 'western' | 'northern' | 'terelj';
  regionLabel: string;
  regionTagline: string;
  destinations: Array<{
    _id: string;
    title: LocaleString;
    slug: { current: string };
    subtitle?: LocaleString;
    region: string;
    bestTime?: LocaleString;
    highlights?: LocaleString[];
    heroImage: ImageWithAlt;
  }>;
}

interface DestinationRegionSectionProps extends RegionSectionData {
  locale: Locale;
  bestTimeLabel: string;
  highlightsCountLabel: (count: number) => string;
  ctaLabel: string;
}

export function DestinationRegionSection({
  regionSlug,
  regionLabel,
  regionTagline,
  destinations,
  locale,
  bestTimeLabel,
  highlightsCountLabel,
  ctaLabel,
}: DestinationRegionSectionProps) {
  return (
    <section
      id={`region-${regionSlug}`}
      className="scroll-mt-20 border-t border-[#1E2128] px-[7vw] py-[14vh]"
    >
      <div className="mx-auto max-w-6xl">
        <header className="mb-[8vh] flex flex-col gap-3">
          <span className="eyebrow text-[#D4A23A]">{regionLabel}</span>
          <h2 className="font-serif text-4xl font-semibold text-[#F7F7F5] md:text-5xl">
            <em className="italic font-normal">{regionTagline.split(' ')[0]}</em>
            <strong className="font-semibold"> {regionTagline.split(' ').slice(1).join(' ')}</strong>
          </h2>
        </header>
        <div className="flex flex-col gap-[10vh]">
          {destinations.map((dest, idx) => (
            <DestinationCard
              key={dest._id}
              destination={dest}
              locale={locale}
              imageOnRight={idx % 2 === 1}
              bestTimeLabel={bestTimeLabel}
              highlightsCountLabel={highlightsCountLabel}
              ctaLabel={ctaLabel}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Typecheck**

```bash
pnpm typecheck
```

Expected: clean.

- [ ] **Step 3: Commit**

```bash
git add src/components/destination/destination-region-section.tsx
git commit -m "feat(destination): add DestinationRegionSection"
```

---

## Task 11: Build `DestinationsCtaBand` (shared)

**Files:** `src/components/destination/destinations-cta-band.tsx`

- [ ] **Step 1: Create the component**

Create `src/components/destination/destinations-cta-band.tsx`:

```typescript
import { LocaleLink } from '@/components/shared/locale-link';

interface DestinationsCtaBandProps {
  heading: string;
  body: string;
  buttonLabel: string;
  href?: string;
}

export function DestinationsCtaBand({
  heading,
  body,
  buttonLabel,
  href = '/custom-trip',
}: DestinationsCtaBandProps) {
  return (
    <section className="border-t border-[#1E2128] bg-[#0B0D10] px-[7vw] py-[18vh]">
      <div className="mx-auto flex max-w-4xl flex-col items-start gap-8">
        <h2 className="font-serif text-4xl font-semibold text-[#F7F7F5] md:text-5xl">
          <em className="italic font-normal">{heading.split(' ').slice(0, 2).join(' ')}</em>
          <strong className="font-semibold"> {heading.split(' ').slice(2).join(' ')}</strong>
        </h2>
        <p className="body-luxury max-w-2xl text-[#C8C7C2]">{body}</p>
        <LocaleLink
          href={href}
          className="mt-4 inline-flex items-center gap-3 border border-[#D4A23A] px-8 py-4 text-sm uppercase tracking-[0.25em] text-[#D4A23A] transition hover:bg-[#D4A23A] hover:text-[#0B0D10]"
        >
          {buttonLabel}
        </LocaleLink>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Typecheck**

```bash
pnpm typecheck
```

Expected: clean.

- [ ] **Step 3: Commit**

```bash
git add src/components/destination/destinations-cta-band.tsx
git commit -m "feat(destination): add shared DestinationsCtaBand"
```

---

## Task 12: Wire the listing page

**Files:** `src/app/[locale]/destinations/page.tsx`

- [ ] **Step 1: Replace the stub**

Overwrite `src/app/[locale]/destinations/page.tsx`:

```typescript
import { setRequestLocale, getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { sanityFetch } from '@/sanity/lib/fetcher';
import { allDestinationsQuery } from '@/sanity/lib/queries';
import { resolveLocaleField, type Locale } from '@/lib/locale/resolve-locale-field';
import { Footer } from '@/components/layout/footer';
import { DestinationsHero } from '@/components/destination/destinations-hero';
import { DestinationsOverviewMap } from '@/components/destination/destinations-overview-map';
import { DestinationRegionSection, type RegionSectionData } from '@/components/destination/destination-region-section';
import { DestinationsCtaBand } from '@/components/destination/destinations-cta-band';
import type { LeafletMapPin } from '@/components/shared/leaflet-map';
import type { Destination } from '@/types/sanity';

const REGION_ORDER = ['central', 'gobi', 'western', 'northern', 'terelj'] as const;
type RegionSlug = (typeof REGION_ORDER)[number];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'destinations' });
  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
    alternates: {
      canonical: `/${locale}/destinations`,
      languages: {
        en: '/en/destinations',
        ko: '/ko/destinations',
        mn: '/mn/destinations',
      },
    },
  };
}

export default async function DestinationsListingPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('destinations');

  const destinations =
    (await sanityFetch<Destination[]>(allDestinationsQuery, {}, { tags: ['destination'] })) ?? [];

  const grouped: Record<RegionSlug, Destination[]> = {
    central: [],
    gobi: [],
    western: [],
    northern: [],
    terelj: [],
  };
  for (const dest of destinations) {
    if (dest.region in grouped) grouped[dest.region as RegionSlug].push(dest);
  }

  const pins: LeafletMapPin[] = destinations
    .filter((d) => d.coordinates)
    .map((d) => ({
      id: d.region,
      lat: d.coordinates!.lat,
      lng: d.coordinates!.lng,
      label: t('map.pinLabel', {
        title: resolveLocaleField(d.title, locale) ?? '',
        region: t(`regions.${d.region as RegionSlug}.label`),
      }),
    }));

  const sections: RegionSectionData[] = REGION_ORDER.filter((r) => grouped[r].length > 0).map((r) => ({
    regionSlug: r,
    regionLabel: t(`regions.${r}.label`),
    regionTagline: t(`regions.${r}.tagline`),
    destinations: grouped[r],
  }));

  const itemListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: destinations.map((d, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      url: `/${locale}/destinations/${d.slug.current}`,
      name: resolveLocaleField(d.title, locale) ?? '',
    })),
  };

  return (
    <main className="relative bg-[#0B0D10]">
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />
      <DestinationsHero
        eyebrow={t('hero.eyebrow')}
        heading={t('hero.heading')}
        intro={t('hero.intro')}
      />
      <DestinationsOverviewMap
        pins={pins}
        ariaListLabel={t('map.regionListLabel')}
        loadFailedMessage={t('map.loadFailed')}
      />
      {sections.map((s) => (
        <DestinationRegionSection
          key={s.regionSlug}
          {...s}
          locale={locale}
          bestTimeLabel={t('card.bestTime')}
          highlightsCountLabel={(count) => t('card.highlightsCount', { count })}
          ctaLabel={t('card.cta')}
        />
      ))}
      <DestinationsCtaBand
        heading={t('cta.heading')}
        body={t('cta.body')}
        buttonLabel={t('cta.button')}
      />
      <Footer />
    </main>
  );
}
```

- [ ] **Step 2: Typecheck and lint**

```bash
pnpm typecheck && pnpm lint
```

Expected: clean.

- [ ] **Step 3: Smoke test in dev**

```bash
pnpm dev
```

Open `http://localhost:3000/en/destinations`. Verify:
- Hero renders with eyebrow + heading + intro
- Map appears (after Loading map…) with five gold dots
- Click a pin → smooth-scrolls to that region section
- All region sections render with destination cards
- CTA band at bottom
- Repeat at `/ko/destinations` and `/mn/destinations` — strings change per locale, no English bleed

Stop the dev server.

- [ ] **Step 4: Commit**

```bash
git add src/app/[locale]/destinations/page.tsx
git commit -m "feat(destinations): wire listing page with map, regions, JSON-LD"
```

---

## Task 13: Build `DestinationHero` (detail GSAP-pinned hero)

**Files:** `src/components/destination/destination-hero.tsx`

- [ ] **Step 1: Create the component**

Create `src/components/destination/destination-hero.tsx`. Mirror `tour-hero.tsx` (read it again if memory is stale).

```typescript
'use client';

import Image from 'next/image';
import { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

interface DestinationHeroProps {
  heroImageUrl: string;
  heroImageAlt: string;
  title: string;
  subtitle: string;
  regionLabel: string;
}

export function DestinationHero({
  heroImageUrl,
  heroImageAlt,
  title,
  subtitle,
  regionLabel,
}: DestinationHeroProps) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      ScrollTrigger.create({
        trigger: ref.current,
        start: 'top top',
        end: '+=90%',
        pin: true,
        pinSpacing: true,
      });
    },
    { scope: ref },
  );

  const titleParts = title.split(' ');
  const firstWord = titleParts[0] ?? title;
  const restWords = titleParts.slice(1).join(' ');

  return (
    <section ref={ref} className="relative h-[90vh] overflow-hidden bg-[#0B0D10]">
      <Image
        src={heroImageUrl}
        alt={heroImageAlt}
        fill
        priority
        sizes="100vw"
        className="object-cover opacity-70"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0B0D10] via-[#0B0D10]/60 to-transparent" />
      <div className="relative z-10 flex h-full items-end px-[7vw] pb-[12vh]">
        <div className="mx-auto w-full max-w-6xl">
          <span className="eyebrow text-[#D4A23A]">{regionLabel}</span>
          <h1 className="headline-hero mt-6 max-w-4xl font-serif font-semibold text-[#F7F7F5]">
            <em className="italic font-normal">{firstWord}</em>
            {restWords ? <strong className="font-semibold"> {restWords}</strong> : null}
          </h1>
          <p className="mt-6 max-w-2xl text-sm uppercase tracking-[0.2em] text-[#C8C7C2]">{subtitle}</p>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Typecheck**

```bash
pnpm typecheck
```

Expected: clean.

- [ ] **Step 3: Commit**

```bash
git add src/components/destination/destination-hero.tsx
git commit -m "feat(destination): add DestinationHero pinned hero"
```

---

## Task 14: Build `DestinationStatStrip`

**Files:** `src/components/destination/destination-stat-strip.tsx`

- [ ] **Step 1: Create the component**

Create `src/components/destination/destination-stat-strip.tsx`. Mirror `tour-stat-strip.tsx` style (italic+bold floating strip).

```typescript
interface StatItem {
  label: string;
  value: string;
}

interface DestinationStatStripProps {
  items: StatItem[];
}

export function DestinationStatStrip({ items }: DestinationStatStripProps) {
  return (
    <section className="relative -mt-16 px-[7vw]">
      <div className="mx-auto max-w-6xl">
        <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-[#1E2128] bg-[#1E2128] md:grid-cols-4">
          {items.map((item) => (
            <div key={item.label} className="bg-[#0B0D10] p-6">
              <dt className="text-xs uppercase tracking-[0.2em] text-[#9A9A95]">{item.label}</dt>
              <dd className="mt-3 font-serif text-xl text-[#F7F7F5]">
                <em className="italic font-normal">{item.value}</em>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Typecheck**

```bash
pnpm typecheck
```

Expected: clean.

- [ ] **Step 3: Commit**

```bash
git add src/components/destination/destination-stat-strip.tsx
git commit -m "feat(destination): add DestinationStatStrip"
```

---

## Task 15: Build `DestinationStory`

**Files:** `src/components/destination/destination-story.tsx`

- [ ] **Step 1: Create the component**

Create `src/components/destination/destination-story.tsx`:

```typescript
import { PortableTextRenderer } from '@/lib/sanity/portable-text';
import { resolveLocaleField, type Locale } from '@/lib/locale/resolve-locale-field';
import type { LocaleBlockContent, LocaleString } from '@/types/sanity';

interface DestinationStoryProps {
  story?: LocaleBlockContent;
  highlights?: LocaleString[];
  storyHeading: string;
  highlightsHeading: string;
  locale: Locale;
}

export function DestinationStory({
  story,
  highlights = [],
  storyHeading,
  highlightsHeading,
  locale,
}: DestinationStoryProps) {
  const blocks = story ? story[locale] : null;

  return (
    <section className="border-t border-[#1E2128] bg-[#0B0D10] px-[7vw] py-[14vh]">
      <div className="mx-auto grid max-w-6xl gap-16 md:grid-cols-3">
        <div className="md:col-span-2">
          <h2 className="eyebrow text-[#D4A23A]">{storyHeading}</h2>
          <div className="mt-6 space-y-6 font-serif text-lg leading-relaxed text-[#E8E7E2]">
            {blocks ? <PortableTextRenderer value={blocks} /> : null}
          </div>
        </div>
        {highlights.length > 0 ? (
          <aside>
            <h3 className="eyebrow text-[#D4A23A]">{highlightsHeading}</h3>
            <ul className="mt-6 space-y-3 text-sm text-[#C8C7C2]">
              {highlights.map((h, idx) => (
                <li key={idx} className="flex gap-3">
                  <span aria-hidden className="text-[#D4A23A]">·</span>
                  <span>{resolveLocaleField(h, locale)}</span>
                </li>
              ))}
            </ul>
          </aside>
        ) : null}
      </div>
    </section>
  );
}
```

If the existing `PortableTextRenderer` import path differs, look at how `tour-overview.tsx` imports it and copy that import line exactly.

- [ ] **Step 2: Typecheck**

```bash
pnpm typecheck
```

Expected: clean.

- [ ] **Step 3: Commit**

```bash
git add src/components/destination/destination-story.tsx
git commit -m "feat(destination): add DestinationStory with highlights aside"
```

---

## Task 16: Build `DestinationGallery` (reuse tour gallery)

**Files:** `src/components/destination/destination-gallery.tsx`

- [ ] **Step 1: Read tour-gallery for the lightbox API**

Read `src/components/tour/tour-gallery.tsx` and `src/components/tour/tour-gallery-lightbox.tsx`. The destination version reuses the same lightbox component but accepts a destination's `gallery` array.

- [ ] **Step 2: Create the wrapper**

Create `src/components/destination/destination-gallery.tsx`. Wrap the existing `tour-gallery.tsx` code if its prop signature accepts a generic image array; otherwise, copy its rendering and substitute the props:

```typescript
'use client';

import Image from 'next/image';
import { useState } from 'react';
import { TourGalleryLightbox } from '@/components/tour/tour-gallery-lightbox';
import { urlFor } from '@/sanity/lib/image';
import { resolveLocaleField, type Locale } from '@/lib/locale/resolve-locale-field';
import type { ImageWithAlt } from '@/types/tour';

interface DestinationGalleryProps {
  images: ImageWithAlt[];
  locale: Locale;
  heading: string;
}

export function DestinationGallery({ images, locale, heading }: DestinationGalleryProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  if (images.length === 0) return null;

  return (
    <section className="border-t border-[#1E2128] bg-[#0B0D10] px-[7vw] py-[14vh]">
      <div className="mx-auto max-w-6xl">
        <h2 className="eyebrow text-[#D4A23A]">{heading}</h2>
        <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {images.map((img, idx) => {
            const alt = resolveLocaleField(img.alt, locale) ?? '';
            const src = urlFor(img).width(1000).quality(80).url();
            return (
              <button
                key={idx}
                type="button"
                onClick={() => setOpenIndex(idx)}
                className="relative aspect-[4/5] overflow-hidden rounded-md focus:outline-none focus:ring-2 focus:ring-[#D4A23A]"
                aria-label={alt || `Open image ${idx + 1}`}
              >
                <Image src={src} alt={alt} fill sizes="(min-width: 1024px) 25vw, 50vw" className="object-cover" />
              </button>
            );
          })}
        </div>
      </div>
      {openIndex !== null ? (
        <TourGalleryLightbox
          images={images}
          locale={locale}
          startIndex={openIndex}
          onClose={() => setOpenIndex(null)}
        />
      ) : null}
    </section>
  );
}
```

If `TourGalleryLightbox` props differ from `{ images, locale, startIndex, onClose }`, adjust to match its actual API (read the source).

- [ ] **Step 2: Typecheck**

```bash
pnpm typecheck
```

Expected: clean.

- [ ] **Step 3: Commit**

```bash
git add src/components/destination/destination-gallery.tsx
git commit -m "feat(destination): add DestinationGallery reusing tour lightbox"
```

---

## Task 17: Build `DestinationLocationMap`

**Files:** `src/components/destination/destination-location-map.tsx`

- [ ] **Step 1: Create the component**

Create `src/components/destination/destination-location-map.tsx`:

```typescript
'use client';

import { LeafletMap, type LeafletMapPin } from '@/components/shared/leaflet-map';

interface DestinationLocationMapProps {
  lat: number;
  lng: number;
  label: string;
  heading: string;
  ariaListLabel: string;
  loadFailedMessage: string;
}

export function DestinationLocationMap({
  lat,
  lng,
  label,
  heading,
  ariaListLabel,
  loadFailedMessage,
}: DestinationLocationMapProps) {
  const pins: LeafletMapPin[] = [{ id: 'self', lat, lng, label }];

  return (
    <section className="border-t border-[#1E2128] bg-[#0B0D10] px-[7vw] py-[14vh]">
      <div className="mx-auto max-w-6xl">
        <h2 className="eyebrow text-[#D4A23A]">{heading}</h2>
        <div className="mt-10">
          <LeafletMap
            pins={pins}
            center={[lat, lng]}
            zoom={6}
            height={400}
            tileVariant="positron"
            ariaListLabel={ariaListLabel}
            loadFailedMessage={loadFailedMessage}
            className="overflow-hidden rounded-2xl border border-[#1E2128]"
          />
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Typecheck**

```bash
pnpm typecheck
```

Expected: clean.

- [ ] **Step 3: Commit**

```bash
git add src/components/destination/destination-location-map.tsx
git commit -m "feat(destination): add DestinationLocationMap"
```

---

## Task 18: Build `DestinationTours`

**Files:** `src/components/destination/destination-tours.tsx`

- [ ] **Step 1: Read tours listing for the inline card markup**

Read `src/app/[locale]/tours/page.tsx`. The card markup inside the `tours.map(...)` block is the pattern to replicate inline (no shared `TourCard` exists yet).

- [ ] **Step 2: Create the component**

Create `src/components/destination/destination-tours.tsx`:

```typescript
import Image from 'next/image';
import { LocaleLink } from '@/components/shared/locale-link';
import { urlFor } from '@/sanity/lib/image';
import { resolveLocaleField, type Locale } from '@/lib/locale/resolve-locale-field';
import { formatPrice } from '@/lib/format/price';
import type { LocaleString, LocaleText, ImageWithAlt, TourPricingData } from '@/types/tour';

interface ReverseTourItem {
  _id: string;
  title: LocaleString;
  slug: { current: string };
  summary: LocaleText;
  duration: number;
  difficulty: 'easy' | 'moderate' | 'challenging' | 'expert';
  heroImage: ImageWithAlt;
  pricing: TourPricingData;
}

interface DestinationToursProps {
  tours: ReverseTourItem[];
  locale: Locale;
  heading: string;
  emptyMessage: string;
}

export function DestinationTours({ tours, locale, heading, emptyMessage }: DestinationToursProps) {
  return (
    <section className="border-t border-[#1E2128] bg-[#0B0D10] px-[7vw] py-[14vh]">
      <div className="mx-auto max-w-6xl">
        <h2 className="font-serif text-3xl font-semibold text-[#F7F7F5] md:text-4xl">{heading}</h2>
        {tours.length === 0 ? (
          <p className="mt-6 text-[#9A9A95]">{emptyMessage}</p>
        ) : (
          <div className="mt-10 grid gap-10 md:grid-cols-2">
            {tours.slice(0, 6).map((tour) => {
              const title = resolveLocaleField(tour.title, locale) ?? '';
              const summary = resolveLocaleField(tour.summary, locale) ?? '';
              const alt = resolveLocaleField(tour.heroImage.alt, locale) ?? title;
              const src = urlFor(tour.heroImage).width(1200).quality(85).url();
              const price = formatPrice(tour.pricing.standard, tour.pricing.currency, locale);
              return (
                <LocaleLink
                  key={tour._id}
                  href={`/tours/${tour.slug.current}`}
                  className="group block"
                >
                  <div className="relative aspect-[4/3] overflow-hidden rounded-xl">
                    <Image src={src} alt={alt} fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover transition group-hover:scale-105" />
                  </div>
                  <h3 className="mt-6 font-serif text-2xl text-[#F7F7F5]">{title}</h3>
                  <p className="mt-3 text-sm text-[#C8C7C2]">{summary}</p>
                  <p className="mt-4 text-xs uppercase tracking-[0.2em] text-[#D4A23A]">
                    {tour.duration} days · {price}
                  </p>
                </LocaleLink>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Typecheck**

```bash
pnpm typecheck
```

Expected: clean.

- [ ] **Step 4: Commit**

```bash
git add src/components/destination/destination-tours.tsx
git commit -m "feat(destination): add DestinationTours reverse-reference grid"
```

---

## Task 19: Wire the detail page

**Files:** `src/app/[locale]/destinations/[slug]/page.tsx`

- [ ] **Step 1: Replace the stub**

Overwrite `src/app/[locale]/destinations/[slug]/page.tsx`:

```typescript
import { notFound } from 'next/navigation';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { sanityFetch } from '@/sanity/lib/fetcher';
import { destinationBySlugQuery, destinationSlugsQuery } from '@/sanity/lib/queries';
import { urlFor } from '@/sanity/lib/image';
import { resolveLocaleField, type Locale } from '@/lib/locale/resolve-locale-field';
import { Footer } from '@/components/layout/footer';
import { DestinationHero } from '@/components/destination/destination-hero';
import { DestinationStatStrip } from '@/components/destination/destination-stat-strip';
import { DestinationStory } from '@/components/destination/destination-story';
import { DestinationGallery } from '@/components/destination/destination-gallery';
import { DestinationLocationMap } from '@/components/destination/destination-location-map';
import { DestinationTours } from '@/components/destination/destination-tours';
import { DestinationsCtaBand } from '@/components/destination/destinations-cta-band';
import { routing } from '@/i18n/routing';
import type { Destination } from '@/types/sanity';

interface DestinationDetail extends Destination {
  tours?: Array<{
    _id: string;
    title: { en: string; ko: string; mn: string };
    slug: { current: string };
    summary: { en: string; ko: string; mn: string };
    duration: number;
    difficulty: 'easy' | 'moderate' | 'challenging' | 'expert';
    heroImage: Destination['heroImage'];
    pricing: { standard: number; currency: string; perPerson?: boolean };
  }>;
}

export async function generateStaticParams() {
  const slugs = (await sanityFetch<string[]>(destinationSlugsQuery, {}, { tags: ['destination'] })) ?? [];
  return routing.locales.flatMap((locale) => slugs.map((slug) => ({ locale, slug })));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const dest = await sanityFetch<DestinationDetail>(
    destinationBySlugQuery,
    { slug },
    { tags: ['destination', slug] },
  );
  if (!dest) return { title: 'Amuun' };
  const title =
    resolveLocaleField(dest.seo?.title, locale) ?? resolveLocaleField(dest.title, locale) ?? 'Amuun';
  const description =
    resolveLocaleField(dest.seo?.description, locale) ?? resolveLocaleField(dest.subtitle, locale);
  const ogSrc = dest.seo?.ogImage ?? dest.heroImage;
  const ogImage = ogSrc ? urlFor(ogSrc).width(1200).height(630).url() : undefined;

  return {
    title: `${title} · Amuun`,
    description: description ?? undefined,
    alternates: {
      canonical: `/${locale}/destinations/${slug}`,
      languages: {
        en: `/en/destinations/${slug}`,
        ko: `/ko/destinations/${slug}`,
        mn: `/mn/destinations/${slug}`,
      },
    },
    openGraph: {
      title,
      description: description ?? undefined,
      images: ogImage ? [{ url: ogImage, width: 1200, height: 630 }] : undefined,
    },
  };
}

export default async function DestinationDetailPage({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('destinations');

  const dest = await sanityFetch<DestinationDetail>(
    destinationBySlugQuery,
    { slug },
    { tags: ['destination', slug] },
  );
  if (!dest) notFound();

  const title = resolveLocaleField(dest.title, locale) ?? '';
  const subtitle = resolveLocaleField(dest.subtitle, locale) ?? '';
  const heroAlt = resolveLocaleField(dest.heroImage.alt, locale) ?? title;
  const heroSrc = urlFor(dest.heroImage).width(2000).quality(85).url();
  const regionLabel = t(`regions.${dest.region as 'central' | 'gobi' | 'western' | 'northern' | 'terelj'}.label`);

  const stats = [
    { label: t('detail.region'), value: regionLabel },
    { label: t('card.bestTime'), value: resolveLocaleField(dest.bestTime, locale) ?? '—' },
    { label: t('detail.highlights'), value: String(dest.highlights?.length ?? 0) },
    { label: t('detail.toursAvailable'), value: String(dest.tours?.length ?? 0) },
  ];

  const jsonLd: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'TouristAttraction',
    name: title,
    description: subtitle,
    image: heroSrc,
    containedInPlace: { '@type': 'Country', name: 'Mongolia' },
  };
  if (dest.coordinates) {
    jsonLd.geo = {
      '@type': 'GeoCoordinates',
      latitude: dest.coordinates.lat,
      longitude: dest.coordinates.lng,
    };
  }

  return (
    <main className="relative bg-[#0B0D10]">
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <DestinationHero
        heroImageUrl={heroSrc}
        heroImageAlt={heroAlt}
        title={title}
        subtitle={subtitle}
        regionLabel={regionLabel}
      />
      <DestinationStatStrip items={stats} />
      <DestinationStory
        story={dest.story}
        highlights={dest.highlights}
        storyHeading={t('detail.story')}
        highlightsHeading={t('detail.highlights')}
        locale={locale}
      />
      {dest.gallery && dest.gallery.length > 0 ? (
        <DestinationGallery images={dest.gallery} locale={locale} heading={t('detail.gallery')} />
      ) : null}
      {dest.coordinates ? (
        <DestinationLocationMap
          lat={dest.coordinates.lat}
          lng={dest.coordinates.lng}
          label={title}
          heading={t('detail.location')}
          ariaListLabel={t('map.regionListLabel')}
          loadFailedMessage={t('map.loadFailed')}
        />
      ) : null}
      <DestinationTours
        tours={dest.tours ?? []}
        locale={locale}
        heading={t('detail.toursHeading', { destination: title })}
        emptyMessage={t('detail.noTours')}
      />
      <DestinationsCtaBand
        heading={t('cta.heading')}
        body={t('cta.body')}
        buttonLabel={t('cta.button')}
      />
      <Footer />
    </main>
  );
}
```

Note: the `stats` array uses `dest.tours?.length`, which depends on the GROQ query returning a `tours` field. Verify `destinationBySlugQuery` already projects the reverse-reference as `tours` (it does, per existing query). If the field name differs, adjust the cast accordingly.

- [ ] **Step 2: Typecheck and lint**

```bash
pnpm typecheck && pnpm lint
```

Expected: clean.

- [ ] **Step 3: Smoke test in dev**

```bash
pnpm dev
```

For each slug in `[gobi, altai, khuvsgul, kharkhorum, terelj]` and each locale `[en, ko, mn]`:
- Open `http://localhost:3000/{locale}/destinations/{slug}`
- Confirm hero, stat strip, story, gallery, location map, tours, CTA all render
- Open the gallery lightbox; arrow keys navigate; Escape closes

Stop the dev server.

- [ ] **Step 4: Commit**

```bash
git add src/app/[locale]/destinations/[slug]/page.tsx
git commit -m "feat(destinations): wire detail page with story, gallery, map, tours, JSON-LD"
```

---

## Task 20: Verify and fix tour-overview destination link

**Files:** `src/components/tour/tour-overview.tsx`

- [ ] **Step 1: Inspect the link**

Open `src/components/tour/tour-overview.tsx`. Around line 43 (current location of `href={\`/destinations/${dest.slug.current}\`}`), check whether the `<a>` is a plain anchor or a `LocaleLink`. If it is a plain `<a>`, the link will lose the `/[locale]` prefix and route to `/destinations/...` which falls through next-intl middleware behavior. Convert to `LocaleLink`:

```typescript
import { LocaleLink } from '@/components/shared/locale-link';
// ...
<LocaleLink href={`/destinations/${dest.slug.current}`} className="...">
  ...
</LocaleLink>
```

If it is already a `LocaleLink`, no change needed. Skip to Step 3.

- [ ] **Step 2: Typecheck**

```bash
pnpm typecheck
```

Expected: clean.

- [ ] **Step 3: Manual click-through**

```bash
pnpm dev
```

Navigate `/en/tours/gobi-crossing` → click a destination chip → URL must become `/en/destinations/{slug}` (locale prefix preserved). Repeat at `/ko/...` and `/mn/...`. Stop the dev server.

- [ ] **Step 4: Commit only if changed**

```bash
git status
```

If `tour-overview.tsx` changed:

```bash
git add src/components/tour/tour-overview.tsx
git commit -m "fix(tour): use LocaleLink for destination chip"
```

If unchanged, skip the commit.

---

## Task 21: Full-page verification

**Files:** none (verification only)

- [ ] **Step 1: Production build**

```bash
cd /Users/temuulen/Development/Amuun
pnpm build
```

Expected: build completes with no TypeScript or runtime errors. All five destination slugs appear in the static generation output (× 3 locales = 15 pages). Listing also pre-renders × 3 locales.

- [ ] **Step 2: Production smoke test**

```bash
pnpm start
```

Open the production server and walk through:
- `/en/destinations` — full listing, map, regions
- `/en/destinations/gobi` — full detail, story Portable Text renders, gallery lightbox, location map pin centered, "Tours featuring Gobi Desert" lists referencing tours
- Repeat at `/ko/...` and `/mn/...`
- Tour detail → click destination chip → destination detail (locale preserved)
- Destination detail → click a tour card → tour detail (locale preserved)

- [ ] **Step 3: SEO verification**

For one detail page per locale, view the page source and confirm:
- `<title>` includes the destination name
- `<meta name="description">` present
- `<link rel="canonical" href="/{locale}/destinations/{slug}">` present
- `<link rel="alternate" hreflang="en/ko/mn" ...>` for all three locales
- Open Graph tags present
- JSON-LD `<script type="application/ld+json">` present and valid (paste into https://validator.schema.org/)

- [ ] **Step 4: Accessibility spot-check**

- Tab through `/en/destinations`: focus order goes hero → map → first region heading → first card link → ...
- VoiceOver (or another screen reader) on the map element: announces the SR-only region list
- macOS System Settings → Accessibility → Display → Reduce Motion ON → click a map pin → instant scroll instead of smooth

- [ ] **Step 5: Sanity webhook check (operational, no code change)**

In Sanity Manage → API → Webhooks, confirm the `/api/revalidate` webhook's filter (`_type in [...]`) includes `"destination"`. If not, edit the webhook to include it. No code change.

- [ ] **Step 6: Verification complete**

If all the above pass, the sub-project is shippable. Push:

```bash
git push origin main
```

(Only push after the user confirms they want the changes deployed.)

---

## Notes for the executing engineer

- **Codebase patterns:** The site uses dark+gold (`#0B0D10` / `#D4A23A`), italic+bold typography splits, and `7vw` horizontal padding. Match these exactly — do not introduce new colors or spacing tokens.
- **Locale resolution:** Always use `resolveLocaleField` for `LocaleString`/`LocaleText` and pass `locale` through; never hard-code English fallbacks visible in UI.
- **Sanity fetcher:** `sanityFetch` accepts `(query, params, options)` where `options.tags` controls `revalidateTag` invalidation. Always tag with `'destination'` (and the slug for detail).
- **Server vs client:** Default to server. Only mark `'use client'` when GSAP, `useState`, or browser APIs are required. The map components must be client because Leaflet touches `window`.
- **Commits:** Follow Conventional Commits (`feat:`, `fix:`, `chore:`, `docs:`). The user has globally disabled Claude attribution — do not add `Co-Authored-By: Claude ...` lines to commits.
