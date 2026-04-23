# About Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the About page stub with a premium full-page layout featuring a full-viewport hero, 2-column brand story, asymmetric team grid, and testimonials hero+grid.

**Architecture:** Server component page fetches siteSettings + teamMembers + testimonials in parallel; client components (about-hero, about-team card hover) use GSAP for entrance animations; static i18n strings power section labels while Sanity CMS drives the brand story body text and images.

**Tech Stack:** Next.js 15 App Router, Sanity v5 (GROQ), next-intl, GSAP, Tailwind CSS, TypeScript

---

## File Map

**Create:**
- `src/components/about/about-hero.tsx` — full-viewport hero with GSAP
- `src/components/about/about-story.tsx` — 2-col brand story + PortableText
- `src/components/about/about-team.tsx` — asymmetric team grid
- `src/components/about/about-testimonials.tsx` — hero quote + 3-col grid

**Modify:**
- `src/sanity/schemas/documents/siteSettings.ts` — add `aboutHeroImage`, `aboutStory`, `aboutImage` fields
- `src/types/sanity.ts` — extend `SiteSettings` interface
- `src/sanity/lib/queries.ts` — extend `siteSettingsQuery` projection
- `scripts/seed/data/settings.ts` — add `aboutStory` seed text
- `messages/en.json`, `messages/ko.json`, `messages/mn.json` — add `about` namespace
- `src/app/[locale]/about/page.tsx` — replace stub with full implementation

---

## Task 1: Sanity Schema + TypeScript Type + Query

**Files:**
- Modify: `src/sanity/schemas/documents/siteSettings.ts`
- Modify: `src/types/sanity.ts`
- Modify: `src/sanity/lib/queries.ts`

- [ ] **Step 1: Add three fields to siteSettings schema**

In `src/sanity/schemas/documents/siteSettings.ts`, add a new group `about` and three fields. Insert after the `seo` group definition and after the `defaultSeo` field:

```typescript
// Add to groups array (after { name: 'seo', title: 'SEO' }):
{ name: 'about', title: 'About page' },
```

```typescript
// Add these three fields inside the fields array, before defaultSeo:
defineField({
  name: 'aboutHeroImage',
  title: 'About hero image',
  type: 'image',
  group: 'about',
  options: { hotspot: true },
  fields: [defineField({ name: 'alt', type: 'localeString' })],
}),
defineField({
  name: 'aboutStory',
  title: 'About brand story',
  type: 'localeBlockContent',
  group: 'about',
}),
defineField({
  name: 'aboutImage',
  title: 'About story image',
  type: 'image',
  group: 'about',
  options: { hotspot: true },
  fields: [defineField({ name: 'alt', type: 'localeString' })],
}),
```

The full updated `siteSettings.ts`:

```typescript
import { defineArrayMember, defineField, defineType } from 'sanity';

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site settings',
  type: 'document',
  groups: [
    { name: 'brand', title: 'Brand', default: true },
    { name: 'contact', title: 'Contact' },
    { name: 'trust', title: 'Trust signals' },
    { name: 'about', title: 'About page' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    defineField({ name: 'siteName', title: 'Site name', type: 'string', initialValue: 'Amuun', group: 'brand', validation: (r) => r.required() }),
    defineField({ name: 'tagline', title: 'Tagline', type: 'localeString', group: 'brand' }),
    defineField({
      name: 'socialLinks',
      title: 'Social links',
      type: 'array',
      group: 'contact',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'socialLink',
          fields: [
            defineField({
              name: 'platform',
              type: 'string',
              options: {
                list: [
                  { title: 'Instagram', value: 'instagram' },
                  { title: 'Facebook', value: 'facebook' },
                  { title: 'YouTube', value: 'youtube' },
                  { title: 'TikTok', value: 'tiktok' },
                  { title: 'LinkedIn', value: 'linkedin' },
                  { title: 'X', value: 'x' },
                ],
              },
              validation: (r) => r.required(),
            }),
            defineField({ name: 'url', type: 'url', validation: (r) => r.required() }),
          ],
          preview: { select: { title: 'platform', subtitle: 'url' } },
        }),
      ],
    }),
    defineField({
      name: 'contactInfo',
      title: 'Contact info',
      type: 'object',
      group: 'contact',
      fields: [
        defineField({ name: 'email', title: 'Email', type: 'string' }),
        defineField({ name: 'phone', title: 'Phone', type: 'string' }),
        defineField({ name: 'address', title: 'Address', type: 'localeText' }),
        defineField({ name: 'mapUrl', title: 'Map URL', type: 'url' }),
      ],
    }),
    defineField({
      name: 'certifications',
      title: 'Certifications',
      type: 'array',
      group: 'trust',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'certification',
          fields: [
            defineField({ name: 'name', type: 'string', validation: (r) => r.required() }),
            defineField({ name: 'logo', type: 'image', options: { hotspot: true }, validation: (r) => r.required() }),
            defineField({ name: 'url', type: 'url' }),
          ],
          preview: { select: { title: 'name', media: 'logo' } },
        }),
      ],
    }),
    defineField({
      name: 'pressFeatures',
      title: 'Press features',
      type: 'array',
      group: 'trust',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'pressFeature',
          fields: [
            defineField({ name: 'publication', type: 'string', validation: (r) => r.required() }),
            defineField({ name: 'logo', type: 'image', options: { hotspot: true } }),
            defineField({ name: 'url', type: 'url' }),
            defineField({ name: 'quote', type: 'localeText' }),
          ],
          preview: { select: { title: 'publication', media: 'logo' } },
        }),
      ],
    }),
    defineField({
      name: 'partnerLogos',
      title: 'Partner logos',
      type: 'array',
      group: 'trust',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'partnerLogo',
          fields: [
            defineField({ name: 'name', type: 'string', validation: (r) => r.required() }),
            defineField({ name: 'logo', type: 'image', options: { hotspot: true }, validation: (r) => r.required() }),
            defineField({ name: 'url', type: 'url' }),
          ],
          preview: { select: { title: 'name', media: 'logo' } },
        }),
      ],
    }),
    defineField({
      name: 'aboutHeroImage',
      title: 'About hero image',
      type: 'image',
      group: 'about',
      options: { hotspot: true },
      fields: [defineField({ name: 'alt', type: 'localeString' })],
    }),
    defineField({
      name: 'aboutStory',
      title: 'About brand story',
      type: 'localeBlockContent',
      group: 'about',
    }),
    defineField({
      name: 'aboutImage',
      title: 'About story image',
      type: 'image',
      group: 'about',
      options: { hotspot: true },
      fields: [defineField({ name: 'alt', type: 'localeString' })],
    }),
    defineField({ name: 'defaultSeo', title: 'Default SEO', type: 'seo', group: 'seo' }),
  ],
  preview: {
    prepare: () => ({ title: 'Site settings' }),
  },
});
```

- [ ] **Step 2: Extend SiteSettings TypeScript interface**

In `src/types/sanity.ts`, find the `SiteSettings` interface (line ~262) and add three optional fields before `defaultSeo`:

```typescript
export interface SiteSettings extends BaseDocument {
  _type: 'siteSettings';
  siteName: string;
  tagline?: LocaleString;
  socialLinks?: SocialLink[];
  contactInfo?: {
    email?: string;
    phone?: string;
    address?: LocaleText;
    mapUrl?: string;
  };
  certifications?: Certification[];
  pressFeatures?: PressFeature[];
  partnerLogos?: PartnerLogo[];
  aboutHeroImage?: ImageWithAlt;
  aboutStory?: LocaleBlockContent;
  aboutImage?: ImageWithAlt;
  defaultSeo?: Seo;
}
```

- [ ] **Step 3: Extend siteSettingsQuery projection**

In `src/sanity/lib/queries.ts`, replace `siteSettingsQuery` with:

```typescript
export const siteSettingsQuery = /* groq */ `
*[_type == "siteSettings" && _id == "siteSettings"][0]{
  ...,
  "socialLinks": socialLinks[]{_key, platform, url},
  "certifications": certifications[]{_key, name, logo, url},
  "pressFeatures": pressFeatures[]{_key, publication, logo, url, quote},
  "partnerLogos": partnerLogos[]{_key, name, logo, url},
  "aboutHeroImage": aboutHeroImage { ..., alt },
  "aboutImage": aboutImage { ..., alt }
}
`;
```

Note: `aboutStory` is a `localeBlockContent` — the `...,` spread already includes it.

- [ ] **Step 4: Verify TypeScript compiles**

```bash
cd /Users/temuulen/Development/Amuun && npx tsc --noEmit 2>&1 | head -30
```

Expected: no errors related to siteSettings.

- [ ] **Step 5: Commit**

```bash
git add src/sanity/schemas/documents/siteSettings.ts src/types/sanity.ts src/sanity/lib/queries.ts
git commit -m "feat(about): extend siteSettings schema with aboutHeroImage, aboutStory, aboutImage"
```

---

## Task 2: i18n Strings

**Files:**
- Modify: `messages/en.json`
- Modify: `messages/ko.json`
- Modify: `messages/mn.json`

- [ ] **Step 1: Add `about` namespace to en.json**

Add after the `journalArticle` block (or at the end of the top-level object, before the closing `}`):

```json
"about": {
  "eyebrow": "Our Story",
  "title": "Born from the Steppe",
  "storyEyebrow": "Why We Exist",
  "storyHeading": "Mongolia, Unfiltered",
  "teamEyebrow": "The Guides",
  "teamHeading": "People Who Know Every Pass",
  "testimonialsEyebrow": "Voices from the Field",
  "testimonialsHeading": "What Travelers Say",
  "metaTitle": "About · Amuun",
  "metaDescription": "Meet the guides and the story behind Amuun — Mongolia's premium expedition outfitter."
}
```

- [ ] **Step 2: Add `about` namespace to ko.json**

```json
"about": {
  "eyebrow": "우리 이야기",
  "title": "스텝에서 태어나다",
  "storyEyebrow": "우리가 존재하는 이유",
  "storyHeading": "가감 없는 몽골",
  "teamEyebrow": "가이드",
  "teamHeading": "모든 길을 아는 사람들",
  "testimonialsEyebrow": "현장의 목소리",
  "testimonialsHeading": "여행자들의 이야기",
  "metaTitle": "소개 · Amuun",
  "metaDescription": "Amuun의 가이드와 이야기를 만나보세요 — 몽골 프리미엄 원정 전문가."
}
```

- [ ] **Step 3: Add `about` namespace to mn.json**

```json
"about": {
  "eyebrow": "Манай түүх",
  "title": "Тал нутгаас төрсөн",
  "storyEyebrow": "Бид яагаад байдаг вэ",
  "storyHeading": "Монгол, гоёлгүй",
  "teamEyebrow": "Хөтөчид",
  "teamHeading": "Бүх замыг мэддэг хүмүүс",
  "testimonialsEyebrow": "Талбараас ирсэн дуу хоолой",
  "testimonialsHeading": "Жуулчдын үг",
  "metaTitle": "Бидний тухай · Amuun",
  "metaDescription": "Amuun-ы хөтөч болон түүхтэй танилцаарай — Монголын тансаг аяллын компани."
}
```

- [ ] **Step 4: Verify no JSON syntax errors**

```bash
node -e "require('./messages/en.json'); require('./messages/ko.json'); require('./messages/mn.json'); console.log('OK')"
```

Expected: `OK`

- [ ] **Step 5: Commit**

```bash
git add messages/en.json messages/ko.json messages/mn.json
git commit -m "feat(about): add about namespace to all three locale message files"
```

---

## Task 3: Seed Data Update

**Files:**
- Modify: `scripts/seed/data/settings.ts`

- [ ] **Step 1: Add aboutStory text to buildSiteSettings()**

In `scripts/seed/data/settings.ts`, add `aboutStory` to the returned object (after `tagline`):

```typescript
aboutStory: {
  _type: 'localeBlockContent',
  en: [
    {
      _type: 'block',
      _key: 'story-en-1',
      style: 'normal',
      children: [
        {
          _type: 'span',
          _key: 'story-en-1-span',
          text: "Amuun was born from a simple frustration: Mongolia's most extraordinary landscapes were inaccessible to the kind of traveller who would truly appreciate them. Not inaccessible by distance, but by design — overloaded group itineraries, generic ger camps, and guides who recited the same script to every visitor.",
          marks: [],
        },
      ],
      markDefs: [],
    },
    {
      _type: 'block',
      _key: 'story-en-2',
      style: 'normal',
      children: [
        {
          _type: 'span',
          _key: 'story-en-2-span',
          text: 'We build six private expeditions per year — no more. Each one is shaped around a single party, a single season, and a single question: what does this landscape reveal when you slow down enough to listen?',
          marks: [],
        },
      ],
      markDefs: [],
    },
  ],
  ko: [
    {
      _type: 'block',
      _key: 'story-ko-1',
      style: 'normal',
      children: [
        {
          _type: 'span',
          _key: 'story-ko-1-span',
          text: 'Amuun은 단순한 좌절에서 탄생했습니다. 몽골의 가장 비범한 풍경들은 그것을 진정으로 감상할 수 있는 여행자들에게 접근하기 어려웠습니다. 거리의 문제가 아니라 설계의 문제였습니다.',
          marks: [],
        },
      ],
      markDefs: [],
    },
    {
      _type: 'block',
      _key: 'story-ko-2',
      style: 'normal',
      children: [
        {
          _type: 'span',
          _key: 'story-ko-2-span',
          text: '우리는 연간 6개의 프라이빗 원정만을 운영합니다. 각각은 단일 그룹, 단일 시즌, 그리고 하나의 질문을 중심으로 구성됩니다.',
          marks: [],
        },
      ],
      markDefs: [],
    },
  ],
  mn: [
    {
      _type: 'block',
      _key: 'story-mn-1',
      style: 'normal',
      children: [
        {
          _type: 'span',
          _key: 'story-mn-1-span',
          text: 'Amuun нь энгийн хүсэл тэмүүллээс төрсөн: Монголын хамгийн гайхамшигт газар нутаг нь тэдгээрийг үнэн сэтгэлээсээ үнэлж чадах жуулчдад хүрэхэд хэцүү байсан.',
          marks: [],
        },
      ],
      markDefs: [],
    },
    {
      _type: 'block',
      _key: 'story-mn-2',
      style: 'normal',
      children: [
        {
          _type: 'span',
          _key: 'story-mn-2-span',
          text: 'Бид жилд зургаан хаалттай аялал зохион байгуулдаг — цаашгүй. Тус бүр нь нэг бүлэг, нэг улирал, нэг асуулт дээр тулгуурладаг.',
          marks: [],
        },
      ],
      markDefs: [],
    },
  ],
},
```

Note: `aboutHeroImage` and `aboutImage` are left out of seed data intentionally — they require real image assets to be uploaded via Sanity Studio. The components handle null gracefully with a fallback background.

- [ ] **Step 2: Commit**

```bash
git add scripts/seed/data/settings.ts
git commit -m "feat(about): add aboutStory seed data to siteSettings"
```

---

## Task 4: AboutHero Component

**Files:**
- Create: `src/components/about/about-hero.tsx`

- [ ] **Step 1: Create the component**

```typescript
'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { gsap } from '@/lib/gsap/register';

interface AboutHeroProps {
  imageUrl: string | null;
  imageAlt: string;
  eyebrow: string;
  title: string;
  tagline: string;
}

export function AboutHero({ imageUrl, imageAlt, eyebrow, title, tagline }: AboutHeroProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const bg = bgRef.current;
    const content = contentRef.current;
    if (!section || !bg || !content) return;

    const ctx = gsap.context(() => {
      gsap.set(bg, { scale: 1.06, opacity: 0 });
      gsap.set(content, { y: 40, opacity: 0 });
      const tl = gsap.timeline();
      tl.to(bg, { scale: 1, opacity: 1, duration: 1.2, ease: 'power3.out' }).to(
        content,
        { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' },
        '-=0.6',
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative flex min-h-screen items-end bg-[#0B0D10]">
      <div ref={bgRef} className="absolute inset-0">
        {imageUrl ? (
          <Image src={imageUrl} alt={imageAlt} fill className="object-cover" priority />
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
      </div>
      <div ref={contentRef} className="relative z-10 w-full px-[7vw] pb-[10vh]">
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#D4A23A]">
          {eyebrow}
        </span>
        <h1 className="mt-4 max-w-4xl font-serif text-4xl font-semibold text-[#F7F7F5] md:text-6xl">
          {title}
        </h1>
        <p className="mt-6 max-w-2xl font-serif text-xl italic text-[#C8C7C2] md:text-2xl">
          {tagline}
        </p>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
cd /Users/temuulen/Development/Amuun && npx tsc --noEmit 2>&1 | head -20
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/about/about-hero.tsx
git commit -m "feat(about): add AboutHero component with GSAP entrance animation"
```

---

## Task 5: AboutStory Component

**Files:**
- Create: `src/components/about/about-story.tsx`

- [ ] **Step 1: Create the component**

```typescript
import type { PortableTextBlock } from '@portabletext/react';
import Image from 'next/image';
import { PortableTextRenderer } from '@/lib/sanity/portable-text';

interface AboutStoryProps {
  eyebrow: string;
  heading: string;
  storyBlocks: PortableTextBlock[] | null;
  imageUrl: string | null;
  imageAlt: string;
}

export function AboutStory({ eyebrow, heading, storyBlocks, imageUrl, imageAlt }: AboutStoryProps) {
  return (
    <section className="bg-[#0B0D10] px-[7vw] py-[14vh]">
      <div className="mx-auto grid max-w-6xl gap-16 md:grid-cols-2">
        <div>
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#D4A23A]">
            {eyebrow}
          </span>
          <h2 className="mt-4 font-serif text-3xl font-semibold text-[#F7F7F5] md:text-4xl">
            {heading}
          </h2>
          {storyBlocks ? (
            <div className="mt-8 space-y-6 font-serif text-lg leading-relaxed text-[#C8C7C2]">
              <PortableTextRenderer value={storyBlocks} />
            </div>
          ) : null}
        </div>
        <div className="flex flex-col justify-center">
          <div className="w-12 h-0.5 bg-[#D4A23A] mb-6" />
          <div className="relative aspect-[3/4] overflow-hidden bg-[#1E2128]">
            {imageUrl ? (
              <Image src={imageUrl} alt={imageAlt} fill className="object-cover" />
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
cd /Users/temuulen/Development/Amuun && npx tsc --noEmit 2>&1 | head -20
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/about/about-story.tsx
git commit -m "feat(about): add AboutStory component with 2-col PortableText + image layout"
```

---

## Task 6: AboutTeam Component

**Files:**
- Create: `src/components/about/about-team.tsx`

- [ ] **Step 1: Create the component**

The grid uses `md:grid-cols-3`. Nomin (index 0) gets `md:col-span-2 aspect-[16/9]`. All other cards get `aspect-[3/4] md:aspect-auto md:h-full`. The team-temuulen member (order 5) is excluded — caller passes only the first 4 members.

```typescript
import Image from 'next/image';
import { resolveLocaleField, type Locale } from '@/lib/locale/resolve-locale-field';
import { urlFor } from '@/sanity/lib/image';
import type { TeamMember } from '@/types/sanity';

interface AboutTeamProps {
  eyebrow: string;
  heading: string;
  members: TeamMember[];
  locale: Locale;
}

export function AboutTeam({ eyebrow, heading, members, locale }: AboutTeamProps) {
  return (
    <section className="bg-[#0B0D10] px-[7vw] py-[14vh]">
      <div className="mx-auto max-w-6xl">
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#D4A23A]">
          {eyebrow}
        </span>
        <h2 className="mt-4 font-serif text-3xl font-semibold text-[#F7F7F5] md:text-4xl">
          {heading}
        </h2>
        <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-3">
          {members.map((member, idx) => {
            const isLead = idx % 2 === 0;
            const name = member.name;
            const role = resolveLocaleField(member.role, locale);
            const bio = member.bio ? resolveLocaleField(member.bio, locale) : null;
            const photoUrl = member.photo?.asset
              ? urlFor(member.photo).width(isLead ? 1200 : 600).quality(85).url()
              : null;

            return (
              <div
                key={member._id}
                className={isLead ? 'md:col-span-2' : 'md:col-span-1'}
              >
                <div
                  className={`group relative overflow-hidden bg-[#1E2128] ${
                    isLead ? 'aspect-[16/9]' : 'aspect-[3/4] md:aspect-auto md:h-full'
                  }`}
                  style={!isLead ? { minHeight: '280px' } : undefined}
                >
                  {photoUrl ? (
                    <Image
                      src={photoUrl}
                      alt={name}
                      fill
                      className="object-cover transition-transform duration-300 ease-in-out group-hover:scale-[1.02]"
                    />
                  ) : null}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                  <div className="absolute bottom-0 left-0 p-6">
                    <p className="font-serif text-xl font-semibold text-[#F7F7F5]">{name}</p>
                    <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.18em] text-[#D4A23A]">
                      {role}
                    </p>
                    {isLead && bio ? (
                      <p className="mt-3 line-clamp-3 max-w-sm text-sm leading-relaxed text-[#C8C7C2]">
                        {bio}
                      </p>
                    ) : null}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
cd /Users/temuulen/Development/Amuun && npx tsc --noEmit 2>&1 | head -20
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/about/about-team.tsx
git commit -m "feat(about): add AboutTeam component with asymmetric 3-col grid"
```

---

## Task 7: AboutTestimonials Component

**Files:**
- Create: `src/components/about/about-testimonials.tsx`

- [ ] **Step 1: Create the component**

The component receives all testimonials, takes `featured` ones, splits: index 0 → hero, index 1–3 → grid.

```typescript
import { resolveLocaleField, type Locale } from '@/lib/locale/resolve-locale-field';
import type { Testimonial } from '@/types/sanity';

interface AboutTestimonialsProps {
  eyebrow: string;
  heading: string;
  testimonials: Testimonial[];
  locale: Locale;
}

export function AboutTestimonials({ eyebrow, heading, testimonials, locale }: AboutTestimonialsProps) {
  const featured = testimonials.filter((t) => t.featured);
  const [hero, ...grid] = featured;
  const gridItems = grid.slice(0, 3);

  if (!hero) return null;

  const heroQuote = resolveLocaleField(hero.quote, locale);

  return (
    <section className="bg-[#0D0F14] px-[7vw] py-[14vh]">
      <div className="mx-auto max-w-6xl">
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#D4A23A]">
          {eyebrow}
        </span>
        <h2 className="mt-4 font-serif text-3xl font-semibold text-[#F7F7F5] md:text-4xl">
          {heading}
        </h2>

        {/* Hero testimonial */}
        <div className="mt-16">
          <div className="font-serif text-7xl leading-none text-[#D4A23A] opacity-30">&ldquo;</div>
          <blockquote className="-mt-4 max-w-4xl font-serif text-2xl italic leading-relaxed text-[#F7F7F5] md:text-4xl">
            {heroQuote}
          </blockquote>
          <p className="mt-8 font-mono text-[10px] uppercase tracking-[0.18em] text-[#D4A23A]">
            {hero.name}
            {hero.nationality ? ` · ${hero.nationality.toUpperCase()}` : ''}
          </p>
        </div>

        {/* 3-col grid */}
        {gridItems.length > 0 ? (
          <div className="mt-16 grid gap-6 md:grid-cols-3">
            {gridItems.map((t) => {
              const quote = resolveLocaleField(t.quote, locale);
              return (
                <div key={t._id} className="border border-[#1E2128] p-8">
                  <div className="font-serif text-4xl leading-none text-[#D4A23A] opacity-40">
                    &ldquo;
                  </div>
                  <blockquote className="-mt-2 font-serif text-lg italic leading-relaxed text-[#E8E7E2]">
                    {quote}
                  </blockquote>
                  <p className="mt-6 font-mono text-[9px] uppercase tracking-[0.18em] text-[#D4A23A]">
                    {t.name}
                    {t.nationality ? ` · ${t.nationality.toUpperCase()}` : ''}
                  </p>
                </div>
              );
            })}
          </div>
        ) : null}
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
cd /Users/temuulen/Development/Amuun && npx tsc --noEmit 2>&1 | head -20
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/about/about-testimonials.tsx
git commit -m "feat(about): add AboutTestimonials component with hero quote and 3-col grid"
```

---

## Task 8: About Page

**Files:**
- Modify: `src/app/[locale]/about/page.tsx`

- [ ] **Step 1: Replace stub with full implementation**

```typescript
import { setRequestLocale, getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import type { PortableTextBlock } from '@portabletext/react';
import { sanityFetch } from '@/sanity/lib/fetcher';
import { siteSettingsQuery, teamMembersQuery, testimonialsQuery } from '@/sanity/lib/queries';
import { urlFor } from '@/sanity/lib/image';
import { resolveLocaleField, type Locale } from '@/lib/locale/resolve-locale-field';
import { Footer } from '@/components/layout/footer';
import { AboutHero } from '@/components/about/about-hero';
import { AboutStory } from '@/components/about/about-story';
import { AboutTeam } from '@/components/about/about-team';
import { AboutTestimonials } from '@/components/about/about-testimonials';
import type { SiteSettings, TeamMember, Testimonial } from '@/types/sanity';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'about' });
  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
  };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: 'about' });

  const [settings, allMembers, testimonials] = await Promise.all([
    sanityFetch<SiteSettings>(siteSettingsQuery, {}, { tags: ['siteSettings'] }),
    sanityFetch<TeamMember[]>(teamMembersQuery, {}, { tags: ['teamMember'] }),
    sanityFetch<Testimonial[]>(testimonialsQuery, {}, { tags: ['testimonial'] }),
  ]);

  // Exclude team-temuulen (developer, not a guide)
  const members = (allMembers ?? []).filter((m) => m._id !== 'team-temuulen').slice(0, 4);

  const heroImageUrl = settings?.aboutHeroImage?.asset
    ? urlFor(settings.aboutHeroImage).width(2000).quality(85).url()
    : null;

  const heroImageAlt = settings?.aboutHeroImage?.alt
    ? resolveLocaleField(settings.aboutHeroImage.alt, locale)
    : 'Amuun — Mongolia';

  const storyBlocks = settings?.aboutStory
    ? (resolveLocaleField(settings.aboutStory, locale) as PortableTextBlock[] | null)
    : null;

  const storyImageUrl = settings?.aboutImage?.asset
    ? urlFor(settings.aboutImage).width(800).quality(85).url()
    : null;

  const storyImageAlt = settings?.aboutImage?.alt
    ? resolveLocaleField(settings.aboutImage.alt, locale)
    : 'Amuun story';

  const tagline = settings?.tagline ? resolveLocaleField(settings.tagline, locale) : '';

  return (
    <>
      <AboutHero
        imageUrl={heroImageUrl}
        imageAlt={heroImageAlt}
        eyebrow={t('eyebrow')}
        title={t('title')}
        tagline={tagline}
      />
      <AboutStory
        eyebrow={t('storyEyebrow')}
        heading={t('storyHeading')}
        storyBlocks={storyBlocks}
        imageUrl={storyImageUrl}
        imageAlt={storyImageAlt}
      />
      <AboutTeam
        eyebrow={t('teamEyebrow')}
        heading={t('teamHeading')}
        members={members}
        locale={locale}
      />
      <AboutTestimonials
        eyebrow={t('testimonialsEyebrow')}
        heading={t('testimonialsHeading')}
        testimonials={testimonials ?? []}
        locale={locale}
      />
      <Footer />
    </>
  );
}
```

- [ ] **Step 2: Verify TypeScript compiles with no errors**

```bash
cd /Users/temuulen/Development/Amuun && npx tsc --noEmit 2>&1 | head -30
```

Expected: no errors.

- [ ] **Step 3: Run build to verify all pages generate**

```bash
cd /Users/temuulen/Development/Amuun && npm run build 2>&1 | tail -20
```

Expected: build succeeds, `/[locale]/about` pages included in output.

- [ ] **Step 4: Commit**

```bash
git add src/app/\[locale\]/about/page.tsx
git commit -m "feat(about): implement About page with hero, story, team, and testimonials sections"
```

---

## Task 9: Reseed + Push

**Files:** None (runtime only)

- [ ] **Step 1: Run seed to push aboutStory to Sanity**

```bash
cd /Users/temuulen/Development/Amuun && npx tsx scripts/seed.ts 2>&1 | tail -10
```

Expected: `✓ Done` with siteSettings included in the count.

- [ ] **Step 2: Push to origin**

```bash
git push origin main
```

Expected: push accepted, Vercel deployment triggered.

- [ ] **Step 3: Verify live page**

Navigate to `https://amuun.voidex.studio/en/about` after Vercel deployment completes.

Expected: Hero renders with navy background (image fallback until uploaded in Studio), brand story text visible in English, 4 guide cards in asymmetric grid, testimonials hero + grid visible.
