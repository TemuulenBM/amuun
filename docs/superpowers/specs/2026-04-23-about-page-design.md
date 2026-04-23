# About Page — Design Spec

**Date:** 2026-04-23  
**Scope:** `/about` page  
**Project:** Amuun travel portfolio (voidex.studio)

---

## Context

`src/app/[locale]/about/page.tsx` currently renders a `StubPage` placeholder. Sanity schemas for `teamMember` and `testimonial` are in place, with queries (`teamMembersQuery`, `testimonialsQuery`) and TypeScript types (`TeamMember`, `Testimonial`) already defined. The `siteSettings` schema needs two new fields added. Four fictional guides are in seed data; `team-temuulen` must NOT appear on this page.

---

## Design System Reference

- Background: `#0B0D10` (dark navy), section variant `#0D0F14`
- Text primary: `#F7F7F5` (cream)
- Accent: `#D4A23A` (gold)
- Font: `font-serif` for headings/quotes, `font-mono` for eyebrow/labels
- Padding: `px-[7vw]` horizontal, `py-[14vh]` vertical
- Follows the same pattern as destinations and journal pages

---

## Page Layout

```
[Nav]
[Hero]              — full-viewport image + tagline overlay
[Brand Story]       — 2-col text + image
[Team]              — asymmetric grid (Nomin large, others smaller)
[Testimonials]      — hero quote + 3-col grid
[Footer]
```

---

## Section 1: Hero

Full-viewport (`min-h-screen`) Mongolian landscape image from `siteSettings.heroImage` (existing field) with gradient overlay (`from-black/60 to-transparent`). Content bottom-left aligned (`px-[7vw] pb-[10vh]`).

- Eyebrow: `about.eyebrow` — "Our Story"
- H1 serif: `about.title` — "Born from the Steppe"
- Tagline: `siteSettings.tagline` (existing locale field)

GSAP animation: background image scale `1.06 → 1` on mount (1.2s ease), content `y: 40 → 0, opacity: 0 → 1` staggered (matches `journal-article-hero.tsx` pattern).

---

## Section 2: Brand Story

`px-[7vw] py-[14vh]`, navy background, `md:grid-cols-2` layout.

**Left column:**
- Eyebrow: `about.storyEyebrow` — "Why We Exist"
- H2 serif: `about.storyHeading` — "Mongolia, Unfiltered"
- Body: `siteSettings.aboutStory` (`localeBlockContent`) via `PortableTextRenderer`

**Right column:**
- `siteSettings.aboutImage` — `aspect-[3/4]`, `object-cover`
- Gold accent line (`w-12 h-0.5 bg-[#D4A23A]`) above the image

### Sanity Schema Changes (siteSettings)

Add to `siteSettings` schema:
```
aboutStory: { type: 'localeBlockContent' }
aboutImage: { type: 'image', options: { hotspot: true }, fields: [{ name: 'alt', type: 'localeString' }] }
```

Add to `siteSettingsQuery` GROQ projection:
```
aboutStory, "aboutImage": aboutImage { asset->, alt }
```

Add to seed data (`scripts/seed/data/settings.ts`): placeholder `aboutStory` text in en/ko/mn and `aboutImage` reference.

---

## Section 3: Team

`px-[7vw] py-[14vh]`, navy background.

**Header:**
- Eyebrow: `about.teamEyebrow` — "The Guides"
- H2 serif: `about.teamHeading` — "People Who Know Every Pass"

**Asymmetric grid:**

```
┌─────────────────────────┬──────────────┐
│  Nomin (col-span-2)     │  Erdene      │
│  aspect-[16/9]          │  aspect-[3/4]│
├─────────────────────────┼──────────────┤
│  Saraa (col-span-2)     │  Tuvshin     │
│  aspect-[16/9]          │  aspect-[3/4]│  
└─────────────────────────┴──────────────┘
```

Grid: `md:grid-cols-3`. Nomin → `md:col-span-2 aspect-[16/9]`. Others → `aspect-[3/4]`.

**Each card:**
- Fill image, bottom gradient overlay
- Hover: `scale-[1.02]` 300ms ease
- Overlaid: name (serif, cream), role (gold mono, `font-mono text-xs tracking-widest`)
- Nomin card: bio 3-line clamp visible; others: bio hidden (shown on hover or omitted)

**Data filter:** Query `teamMembersQuery` already returns all members ordered by `order`. Filter client-side: exclude member where `_id === 'team-temuulen'`. Take first 4.

---

## Section 4: Testimonials

`px-[7vw] py-[14vh]`, `bg-[#0D0F14]` slightly darker.

**Header:**
- Eyebrow: `about.testimonialsEyebrow` — "Voices from the Field"
- H2 serif: `about.testimonialsHeading` — "What Travelers Say"

**Hero testimonial** (first `isFeatured: true`, ordered by `order`):
- Decorative gold `"` (`text-8xl font-serif text-[#D4A23A] opacity-30`)
- Quote: serif `text-3xl md:text-5xl italic` cream
- Attribution: gold mono caps — `JAMES WHITFIELD · UNITED STATES`
- Full-width, generous padding

**3-col grid** (remaining featured testimonials, up to 3):
- Card with `border border-[#1E2128]` and `p-8`
- Gold `"` small (`text-4xl`)
- Quote serif `text-lg italic`
- Attribution gold mono below

**Data:** `testimonialsQuery` filtered to `isFeatured: true`, ordered by `order`. Split: index 0 → hero, index 1–3 → grid.

---

## i18n

New `about` namespace in `messages/en.json`, `ko.json`, `mn.json`:

| Key | EN value |
|-----|----------|
| `eyebrow` | "Our Story" |
| `title` | "Born from the Steppe" |
| `storyEyebrow` | "Why We Exist" |
| `storyHeading` | "Mongolia, Unfiltered" |
| `teamEyebrow` | "The Guides" |
| `teamHeading` | "People Who Know Every Pass" |
| `testimonialsEyebrow` | "Voices from the Field" |
| `testimonialsHeading` | "What Travelers Say" |
| `metaTitle` | "About · Amuun" |
| `metaDescription` | "Meet the guides and the story behind Amuun — Mongolia's premium expedition outfitter." |

---

## Components

All new components in `src/components/about/`:

| File | Purpose |
|------|---------|
| `about-hero.tsx` | Full-viewport hero with GSAP animation |
| `about-story.tsx` | 2-col brand story with PortableText + image |
| `about-team.tsx` | Asymmetric team grid |
| `about-testimonials.tsx` | Hero quote + 3-col testimonial grid |

---

## Page

`src/app/[locale]/about/page.tsx` — server component, `generateMetadata`, fetches siteSettings + teamMembers + testimonials in parallel via `Promise.all`.

---

## Queries

- Extend `siteSettingsQuery` projection with `aboutStory`, `aboutImage`
- Use existing `teamMembersQuery` (filter team-temuulen in component)
- Use existing `testimonialsQuery` with `isFeatured == true` filter

---

## Static Generation

No `generateStaticParams` needed — page is the same for all locales (locale handled by next-intl routing, no slug).

---

## Out of Scope

- Team member profile/detail pages
- Testimonial video embeds
- Awards or press logos section
- Contact CTA section (separate page exists)
- Animations/scroll-reveal beyond hero entrance
