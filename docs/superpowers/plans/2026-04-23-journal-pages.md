# Journal Listing + Article Detail Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement `/journal` listing and `/journal/[slug]` article detail pages with editorial luxury design, replacing the current StubPage placeholders.

**Architecture:** Server-component pages following the tours/destinations pattern, with GSAP-animated client-component heroes. Six new components in `src/components/journal/`. All data fetched via existing GROQ queries. No new API routes needed.

**Tech Stack:** Next.js 15 App Router, React 19, Tailwind v4, next-intl, Sanity v5, GSAP, `@portabletext/react`

> **Note:** No test framework is configured in this project. Verification steps use TypeScript build checks (`pnpm build`) instead of unit tests.

---

## File Map

**Seed data (modify):**
- `scripts/seed/data/team.ts` — add `team-temuulen` entry
- `scripts/seed/data/blogs.ts` — update all 3 blog post `author` refs to `team-temuulen`

**i18n messages (modify):**
- `messages/en.json` — add `journalListing` + `journalArticle` namespaces
- `messages/ko.json` — add `journalListing` + `journalArticle` namespaces
- `messages/mn.json` — add `journalListing` + `journalArticle` namespaces

**New components:**
- `src/components/journal/journal-hero.tsx` — listing page hero with GSAP entrance + scroll pin
- `src/components/journal/journal-featured-card.tsx` — full-width first article card with image overlay
- `src/components/journal/journal-card.tsx` — 2-col grid card for remaining articles
- `src/components/journal/journal-article-hero.tsx` — full-viewport hero with overlaid metadata
- `src/components/journal/journal-article-body.tsx` — centered article body using PortableTextRenderer
- `src/components/journal/journal-related-tours.tsx` — related expeditions strip

**Pages (replace StubPage):**
- `src/app/[locale]/journal/page.tsx` — listing page
- `src/app/[locale]/journal/[slug]/page.tsx` — article detail page

---

## Task 1: Add Temuulen team member to seed data

**Files:**
- Modify: `scripts/seed/data/team.ts`
- Modify: `scripts/seed/data/blogs.ts`

- [ ] **Step 1: Add team-temuulen to team.ts**

In `scripts/seed/data/team.ts`, the `buildTeam` function returns an array. Add this entry as the last element of the returned array (after `tuvshin-altangerel`):

```typescript
{
  _id: 'team-temuulen',
  _type: 'teamMember',
  name: 'Temuulen',
  role: {
    _type: 'localeString',
    en: 'Voidex Studio',
    ko: 'Voidex Studio',
    mn: 'Voidex Studio',
  },
  bio: {
    _type: 'localeText',
    en: 'Temuulen is the founder of Voidex Studio, a one-person development studio building premium web experiences for travel and hospitality brands.',
    ko: 'Temuulen은 여행 및 호스피탈리티 브랜드를 위한 프리미엄 웹 경험을 구축하는 1인 개발 스튜디오 Voidex Studio의 창립자입니다.',
    mn: 'Temuulen бол аялал, зочид буудлын брэндүүдэд зориулсан шилдэг вэб туршлага бүтээдэг нэг хүний Voidex Studio студийн үүсгэн байгуулагч юм.',
  },
  photo: null,
  isFounder: false,
  order: 5,
},
```

> Note: `photo: null` is intentional — the teamMember schema makes photo optional. The journal article hero uses the blog's `heroImage`, not the author photo.

- [ ] **Step 2: Update all 3 blog post author refs in blogs.ts**

In `scripts/seed/data/blogs.ts`, change every occurrence of:
- `{ _type: 'reference', _ref: 'team-saraa-dashdorj' }` → `{ _type: 'reference', _ref: 'team-temuulen' }`
- `{ _type: 'reference', _ref: 'team-erdene-munkhbat' }` → `{ _type: 'reference', _ref: 'team-temuulen' }`
- `{ _type: 'reference', _ref: 'team-nomin-batbayar' }` → `{ _type: 'reference', _ref: 'team-temuulen' }`

All three blog posts (`blog-tsaatan-reindeer`, the Gobi packing article, `blog-winter-stories`) must have:

```typescript
author: { _type: 'reference', _ref: 'team-temuulen' },
```

- [ ] **Step 3: Commit**

```bash
git add scripts/seed/data/team.ts scripts/seed/data/blogs.ts
git commit -m "chore(seed): add team-temuulen and update blog post authors"
```

> **After deploying:** Update existing Sanity documents via Studio or by re-running `pnpm seed`. The seed script overwrites by `_id` so it is safe to re-run.

---

## Task 2: Add i18n message namespaces

**Files:**
- Modify: `messages/en.json`
- Modify: `messages/ko.json`
- Modify: `messages/mn.json`

- [ ] **Step 1: Add namespaces to messages/en.json**

Append these two keys to the root JSON object (before the closing `}`):

```json
"journalListing": {
  "eyebrow": "Field Notes",
  "title": "Stories from the Steppe",
  "subtitle": "Dispatches from the ground — guides, photographers, and the people who call Mongolia home.",
  "readArticle": "Read article",
  "metaTitle": "Journal · Amuun",
  "metaDescription": "Field notes from Mongolia — stories of the Gobi, the taiga, the Altai, and the people who call it home."
},
"journalArticle": {
  "readTime": "{minutes} min read",
  "relatedToursEyebrow": "Plan your journey",
  "relatedToursHeading": "Expeditions You Might Consider"
}
```

- [ ] **Step 2: Add namespaces to messages/ko.json**

```json
"journalListing": {
  "eyebrow": "현장 노트",
  "title": "스텝에서 온 이야기",
  "subtitle": "가이드, 사진작가, 그리고 몽골을 고향이라 부르는 사람들이 보내온 기록.",
  "readArticle": "기사 읽기",
  "metaTitle": "저널 · Amuun",
  "metaDescription": "몽골의 현장 노트 — 고비, 타이가, 알타이, 그리고 그곳을 고향으로 부르는 사람들의 이야기."
},
"journalArticle": {
  "readTime": "{minutes}분 읽기",
  "relatedToursEyebrow": "여정을 계획하세요",
  "relatedToursHeading": "고려해볼 만한 원정"
}
```

- [ ] **Step 3: Add namespaces to messages/mn.json**

```json
"journalListing": {
  "eyebrow": "Талбайн тэмдэглэл",
  "title": "Талаас ирсэн өгүүллэгүүд",
  "subtitle": "Хөтөч, гэрэл зурагчид болон Монголыг нутаг гэж нэрлэдэг хүмүүсийн бичсэн тэмдэглэл.",
  "readArticle": "Нийтлэл унших",
  "metaTitle": "Сэтгүүл · Amuun",
  "metaDescription": "Монголоос ирсэн талбайн тэмдэглэл — Говь, тайга, Алтай болон тэнд нутагшсан хүмүүсийн тухай өгүүллэг."
},
"journalArticle": {
  "readTime": "{minutes} мин унших",
  "relatedToursEyebrow": "Аяллаа төлөвлөх",
  "relatedToursHeading": "Авч үзэж болох аяллууд"
}
```

- [ ] **Step 4: Commit**

```bash
git add messages/en.json messages/ko.json messages/mn.json
git commit -m "feat(i18n): add journalListing and journalArticle message namespaces"
```

---

## Task 3: Journal listing hero component

**Files:**
- Create: `src/components/journal/journal-hero.tsx`

- [ ] **Step 1: Create the component**

```typescript
'use client';

import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap/register';

interface JournalHeroProps {
  eyebrow: string;
  heading: string;
  intro: string;
}

export function JournalHero({ eyebrow, heading, intro }: JournalHeroProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const eyebrowRef = useRef<HTMLSpanElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const introRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const eyebrowEl = eyebrowRef.current;
    const headline = headlineRef.current;
    const introEl = introRef.current;
    if (!section || !eyebrowEl || !headline || !introEl) return;

    const ctx = gsap.context(() => {
      gsap.set([eyebrowEl, headline, introEl], { y: 30, opacity: 0 });
      const tl = gsap.timeline({ delay: 0.1 });
      tl.to(eyebrowEl, { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' })
        .to(headline, { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }, '-=0.3')
        .to(introEl, { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out' }, '-=0.4');

      ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: '+=80%',
        pin: true,
        pinSpacing: true,
      });
    }, section);

    return () => ctx.revert();
  }, []);

  const commaIdx = heading.indexOf(',');
  const splitIdx = commaIdx > 0 ? commaIdx + 1 : heading.indexOf(' ');
  const firstPart = splitIdx > 0 ? heading.slice(0, splitIdx) : heading;
  const secondPart = splitIdx > 0 ? heading.slice(splitIdx) : '';

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-[80vh] items-end bg-[#0B0D10] px-[7vw] pb-[10vh] pt-[28vh]"
    >
      <div className="mx-auto max-w-6xl">
        <span ref={eyebrowRef} className="eyebrow block text-[#D4A23A]">
          {eyebrow}
        </span>
        <h1
          ref={headlineRef}
          aria-label={heading}
          className="headline-hero mt-6 max-w-4xl font-serif font-semibold text-[#F7F7F5]"
        >
          <em className="font-normal not-italic italic">{firstPart}</em>
          {secondPart ? <strong className="font-semibold">{secondPart}</strong> : null}
        </h1>
        <p ref={introRef} className="body-luxury mt-10 max-w-2xl text-[#C8C7C2]">
          {intro}
        </p>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/journal/journal-hero.tsx
git commit -m "feat(journal): add JournalHero component"
```

---

## Task 4: Journal featured card component

**Files:**
- Create: `src/components/journal/journal-featured-card.tsx`

- [ ] **Step 1: Create the component**

```typescript
import Image from 'next/image';
import { LocaleLink } from '@/components/shared/locale-link';

interface JournalFeaturedCardProps {
  slug: string;
  imageUrl: string;
  imageAlt: string;
  category: string;
  publishedAt: string;
  title: string;
  excerpt: string;
  readArticleLabel: string;
}

export function JournalFeaturedCard({
  slug,
  imageUrl,
  imageAlt,
  category,
  publishedAt,
  title,
  excerpt,
  readArticleLabel,
}: JournalFeaturedCardProps) {
  const formattedDate = new Date(publishedAt)
    .toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })
    .toUpperCase();

  return (
    <LocaleLink
      href={`/journal/${slug}`}
      className="group relative block aspect-[16/7] overflow-hidden"
    >
      <Image
        src={imageUrl}
        alt={imageAlt}
        fill
        className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 px-10 pb-10 md:px-16 md:pb-14">
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#D4A23A]">
          {category} · {formattedDate}
        </span>
        <h2 className="mt-4 max-w-3xl font-serif text-3xl font-semibold text-[#F7F7F5] md:text-5xl">
          {title}
        </h2>
        <p className="mt-4 line-clamp-2 max-w-xl text-[#C8C7C2]">{excerpt}</p>
        <span className="mt-6 inline-block font-mono text-xs uppercase tracking-[0.12em] text-[#D4A23A]">
          {readArticleLabel} →
        </span>
      </div>
    </LocaleLink>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/journal/journal-featured-card.tsx
git commit -m "feat(journal): add JournalFeaturedCard component"
```

---

## Task 5: Journal grid card component

**Files:**
- Create: `src/components/journal/journal-card.tsx`

- [ ] **Step 1: Create the component**

```typescript
import Image from 'next/image';
import { LocaleLink } from '@/components/shared/locale-link';

interface JournalCardProps {
  slug: string;
  imageUrl: string;
  imageAlt: string;
  category: string;
  publishedAt: string;
  title: string;
  excerpt: string;
  readArticleLabel: string;
}

export function JournalCard({
  slug,
  imageUrl,
  imageAlt,
  category,
  publishedAt,
  title,
  excerpt,
  readArticleLabel,
}: JournalCardProps) {
  const formattedDate = new Date(publishedAt)
    .toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })
    .toUpperCase();

  return (
    <LocaleLink href={`/journal/${slug}`} className="group flex flex-col gap-5">
      <div className="image-card aspect-[4/5] overflow-hidden">
        <Image
          src={imageUrl}
          alt={imageAlt}
          width={900}
          height={1125}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
        />
      </div>
      <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#D4A23A]">
        {category} · {formattedDate}
      </span>
      <h2 className="font-serif text-2xl font-semibold text-[#F7F7F5]">{title}</h2>
      <p className="line-clamp-3 text-sm text-[#A7ACB4]">{excerpt}</p>
      <span className="font-mono text-xs uppercase tracking-[0.12em] text-[#D4A23A]">
        {readArticleLabel} →
      </span>
    </LocaleLink>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/journal/journal-card.tsx
git commit -m "feat(journal): add JournalCard grid component"
```

---

## Task 6: Journal listing page

**Files:**
- Modify: `src/app/[locale]/journal/page.tsx` (currently 2 lines — full replacement)

- [ ] **Step 1: Replace the stub with the full listing page**

```typescript
import { setRequestLocale, getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { sanityFetch } from '@/sanity/lib/fetcher';
import { allBlogPostsQuery } from '@/sanity/lib/queries';
import { urlFor } from '@/sanity/lib/image';
import { resolveLocaleField, type Locale } from '@/lib/locale/resolve-locale-field';
import { Footer } from '@/components/layout/footer';
import { JournalHero } from '@/components/journal/journal-hero';
import { JournalFeaturedCard } from '@/components/journal/journal-featured-card';
import { JournalCard } from '@/components/journal/journal-card';
import type { LocaleString, LocaleText, ImageWithAlt } from '@/types/sanity';

interface BlogPostCardItem {
  _id: string;
  title: LocaleString;
  slug: { current: string };
  excerpt?: LocaleText;
  category: string;
  heroImage: ImageWithAlt;
  publishedAt: string;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'journalListing' });
  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
  };
}

export default async function JournalListingPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('journalListing');

  const posts =
    (await sanityFetch<BlogPostCardItem[]>(allBlogPostsQuery, {}, { tags: ['blogPost'] })) ?? [];

  const [featured, ...rest] = posts;

  return (
    <main className="relative min-h-screen bg-[#0B0D10]">
      <JournalHero eyebrow={t('eyebrow')} heading={t('title')} intro={t('subtitle')} />

      {featured ? (
        <section className="px-[7vw] pb-[8vh] pt-[6vh]">
          <div className="mx-auto max-w-6xl">
            <JournalFeaturedCard
              slug={featured.slug.current}
              imageUrl={urlFor(featured.heroImage).width(2000).quality(85).url()}
              imageAlt={resolveLocaleField(featured.heroImage.alt, locale) ?? ''}
              category={featured.category}
              publishedAt={featured.publishedAt}
              title={resolveLocaleField(featured.title, locale) ?? ''}
              excerpt={resolveLocaleField(featured.excerpt, locale) ?? ''}
              readArticleLabel={t('readArticle')}
            />
          </div>
        </section>
      ) : null}

      {rest.length > 0 ? (
        <section className="px-[7vw] pb-[18vh]">
          <div className="mx-auto max-w-6xl">
            <div className="grid gap-12 md:grid-cols-2">
              {rest.map((post) => (
                <JournalCard
                  key={post._id}
                  slug={post.slug.current}
                  imageUrl={urlFor(post.heroImage).width(900).quality(80).url()}
                  imageAlt={resolveLocaleField(post.heroImage.alt, locale) ?? ''}
                  category={post.category}
                  publishedAt={post.publishedAt}
                  title={resolveLocaleField(post.title, locale) ?? ''}
                  excerpt={resolveLocaleField(post.excerpt, locale) ?? ''}
                  readArticleLabel={t('readArticle')}
                />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <Footer />
    </main>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/\[locale\]/journal/page.tsx
git commit -m "feat(journal): implement journal listing page"
```

---

## Task 7: Journal article hero component

**Files:**
- Create: `src/components/journal/journal-article-hero.tsx`

- [ ] **Step 1: Create the component**

```typescript
'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { gsap } from '@/lib/gsap/register';

interface JournalArticleHeroProps {
  imageUrl: string;
  imageAlt: string;
  category: string;
  title: string;
  byline: string;
}

export function JournalArticleHero({
  imageUrl,
  imageAlt,
  category,
  title,
  byline,
}: JournalArticleHeroProps) {
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
        <Image src={imageUrl} alt={imageAlt} fill className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />
      </div>
      <div ref={contentRef} className="relative z-10 w-full px-[7vw] pb-[10vh]">
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#D4A23A]">
          {category}
        </span>
        <h1 className="mt-4 max-w-4xl font-serif text-4xl font-semibold text-[#F7F7F5] md:text-6xl">
          {title}
        </h1>
        <p className="mt-6 font-mono text-xs uppercase tracking-[0.12em] text-[#C8C7C2]">
          {byline}
        </p>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/journal/journal-article-hero.tsx
git commit -m "feat(journal): add JournalArticleHero component"
```

---

## Task 8: Journal article body component

**Files:**
- Create: `src/components/journal/journal-article-body.tsx`

- [ ] **Step 1: Create the component**

```typescript
import type { PortableTextBlock } from '@portabletext/react';
import { PortableTextRenderer } from '@/lib/sanity/portable-text';

interface JournalArticleBodyProps {
  blocks: PortableTextBlock[];
}

export function JournalArticleBody({ blocks }: JournalArticleBodyProps) {
  return (
    <section className="bg-[#0B0D10] px-[7vw] py-[12vh]">
      <div className="mx-auto max-w-2xl">
        <PortableTextRenderer value={blocks} />
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/journal/journal-article-body.tsx
git commit -m "feat(journal): add JournalArticleBody component"
```

---

## Task 9: Journal related tours component

**Files:**
- Create: `src/components/journal/journal-related-tours.tsx`

- [ ] **Step 1: Create the component**

Reuses strings from the existing `tour` i18n namespace (`viewExpedition`) to stay DRY.

```typescript
import { getTranslations } from 'next-intl/server';
import Image from 'next/image';
import { LocaleLink } from '@/components/shared/locale-link';
import { resolveLocaleField, type Locale } from '@/lib/locale/resolve-locale-field';
import { urlFor } from '@/sanity/lib/image';
import type { LocaleString, LocaleText, ImageWithAlt } from '@/types/sanity';

interface RelatedTourRef {
  _id: string;
  title: LocaleString;
  slug: { current: string };
  summary: LocaleText;
  heroImage: ImageWithAlt;
  duration: number;
  difficulty: string;
}

interface JournalRelatedToursProps {
  tours: RelatedTourRef[];
  locale: Locale;
}

export async function JournalRelatedTours({ tours, locale }: JournalRelatedToursProps) {
  if (tours.length === 0) return null;

  const [tArticle, tTour] = await Promise.all([
    getTranslations('journalArticle'),
    getTranslations('tour'),
  ]);

  return (
    <section className="border-t border-[#1E2128] bg-[#0B0D10] px-[7vw] py-[14vh]">
      <div className="mx-auto max-w-6xl">
        <span className="eyebrow block text-[#D4A23A]">{tArticle('relatedToursEyebrow')}</span>
        <h2 className="headline-subsection mt-6 font-serif text-[#F7F7F5]">
          {tArticle('relatedToursHeading')}
        </h2>
        <div className="mt-16 grid gap-10 md:grid-cols-3">
          {tours.map((tour) => {
            const title = resolveLocaleField(tour.title, locale) ?? '';
            const summary = resolveLocaleField(tour.summary, locale) ?? '';
            const imgSrc = urlFor(tour.heroImage).width(900).quality(80).url();
            const alt = resolveLocaleField(tour.heroImage.alt, locale) ?? title;
            return (
              <LocaleLink
                key={tour._id}
                href={`/tours/${tour.slug.current}`}
                className="group flex flex-col gap-4"
              >
                <div className="image-card aspect-[4/5] overflow-hidden">
                  <Image
                    src={imgSrc}
                    alt={alt}
                    width={900}
                    height={1125}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                  />
                </div>
                <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#D4A23A]">
                  {tour.duration} day · {tour.difficulty}
                </span>
                <h3 className="font-serif text-2xl font-semibold text-[#F7F7F5]">{title}</h3>
                <p className="line-clamp-2 text-sm text-[#A7ACB4]">{summary}</p>
                <span className="mt-2 font-mono text-xs uppercase tracking-[0.12em] text-[#D4A23A]">
                  {tTour('viewExpedition')} →
                </span>
              </LocaleLink>
            );
          })}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/journal/journal-related-tours.tsx
git commit -m "feat(journal): add JournalRelatedTours component"
```

---

## Task 10: Journal article detail page

**Files:**
- Modify: `src/app/[locale]/journal/[slug]/page.tsx` (currently 2 lines — full replacement)

- [ ] **Step 1: Replace the stub with the full detail page**

```typescript
import { notFound } from 'next/navigation';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import type { PortableTextBlock } from '@portabletext/react';
import { sanityFetch } from '@/sanity/lib/fetcher';
import { blogPostBySlugQuery, blogPostSlugsQuery } from '@/sanity/lib/queries';
import { urlFor } from '@/sanity/lib/image';
import { resolveLocaleField, type Locale } from '@/lib/locale/resolve-locale-field';
import { Footer } from '@/components/layout/footer';
import { JournalArticleHero } from '@/components/journal/journal-article-hero';
import { JournalArticleBody } from '@/components/journal/journal-article-body';
import { JournalRelatedTours } from '@/components/journal/journal-related-tours';
import { routing } from '@/i18n/routing';
import type { LocaleString, LocaleText, LocaleBlockContent, ImageWithAlt } from '@/types/sanity';

interface AuthorRef {
  _id: string;
  name: string;
  role: LocaleString;
}

interface RelatedTourRef {
  _id: string;
  title: LocaleString;
  slug: { current: string };
  summary: LocaleText;
  heroImage: ImageWithAlt;
  duration: number;
  difficulty: string;
}

interface BlogPostDetail {
  _id: string;
  title: LocaleString;
  slug: { current: string };
  excerpt?: LocaleText;
  content?: LocaleBlockContent;
  heroImage: ImageWithAlt;
  category: string;
  author?: AuthorRef;
  relatedTours?: RelatedTourRef[];
  publishedAt: string;
  seo?: {
    metaTitle?: LocaleString;
    metaDescription?: LocaleString;
    ogImage?: ImageWithAlt;
  };
}

function estimateReadTime(blocks: PortableTextBlock[] | undefined): number {
  if (!blocks?.length) return 1;
  const text = blocks
    .map((b) => {
      const block = b as { children?: Array<{ text: string }> };
      return block.children?.map((c) => c.text).join(' ') ?? '';
    })
    .join(' ');
  return Math.max(1, Math.ceil(text.split(/\s+/).filter(Boolean).length / 200));
}

export async function generateStaticParams() {
  const slugs =
    (await sanityFetch<string[]>(blogPostSlugsQuery, {}, { tags: ['blogPost'] })) ?? [];
  return routing.locales.flatMap((locale) => slugs.map((slug) => ({ locale, slug })));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = await sanityFetch<BlogPostDetail>(
    blogPostBySlugQuery,
    { slug },
    { tags: ['blogPost', slug] },
  );
  if (!post) return { title: 'Amuun' };

  const title =
    resolveLocaleField(post.seo?.metaTitle, locale) ??
    resolveLocaleField(post.title, locale) ??
    'Amuun';
  const description =
    resolveLocaleField(post.seo?.metaDescription, locale) ??
    resolveLocaleField(post.excerpt, locale);
  const ogImageSrc = post.seo?.ogImage ?? post.heroImage;
  const ogImage = ogImageSrc ? urlFor(ogImageSrc).width(1200).height(630).url() : undefined;

  return {
    title: `${title} · Journal · Amuun`,
    description,
    openGraph: {
      title,
      description,
      images: ogImage ? [{ url: ogImage, width: 1200, height: 630 }] : undefined,
    },
  };
}

export default async function JournalArticlePage({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const [post, t] = await Promise.all([
    sanityFetch<BlogPostDetail>(blogPostBySlugQuery, { slug }, { tags: ['blogPost', slug] }),
    getTranslations('journalArticle'),
  ]);

  if (!post) notFound();

  const title = resolveLocaleField(post.title, locale) ?? '';
  const imageUrl = urlFor(post.heroImage).width(2000).quality(85).url();
  const imageAlt = resolveLocaleField(post.heroImage.alt, locale) ?? title;
  const contentBlocks = post.content?.[locale] as PortableTextBlock[] | undefined;
  const readTime = estimateReadTime(contentBlocks);
  const authorName = post.author?.name ?? 'Temuulen';
  const authorRole = resolveLocaleField(post.author?.role, locale) ?? 'Voidex Studio';
  const formattedDate = new Date(post.publishedAt).toLocaleDateString('en-GB', {
    month: 'short',
    year: 'numeric',
  });
  const byline = `by ${authorName} · ${authorRole} · ${formattedDate} · ${t('readTime', { minutes: readTime })}`;

  return (
    <main className="relative min-h-screen bg-[#0B0D10]">
      <JournalArticleHero
        imageUrl={imageUrl}
        imageAlt={imageAlt}
        category={post.category}
        title={title}
        byline={byline}
      />

      {contentBlocks?.length ? <JournalArticleBody blocks={contentBlocks} /> : null}

      {post.relatedTours?.length ? (
        <JournalRelatedTours tours={post.relatedTours} locale={locale} />
      ) : null}

      <Footer />
    </main>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/\[locale\]/journal/\[slug\]/page.tsx
git commit -m "feat(journal): implement journal article detail page"
```

---

## Task 11: Build verification

**Files:** None — verification only

- [ ] **Step 1: Run TypeScript build**

```bash
cd /Users/temuulen/Development/Amuun && pnpm build
```

Expected: All 14+ pages compile. No TypeScript errors. Output includes:
- `○ /[locale]/journal`
- `● /[locale]/journal/[slug]`

- [ ] **Step 2: Start dev server and verify listing page**

```bash
pnpm dev
```

Open `http://localhost:3000/en/journal` and verify:
- Hero animates in (GSAP entrance)
- Featured card shows first article with full-width image + overlay text
- Grid shows remaining 2 articles
- All category/date labels visible in gold mono

- [ ] **Step 3: Verify article detail**

Open `http://localhost:3000/en/journal/reindeer-herders` (or whichever slug is first) and verify:
- Full-viewport hero image with GSAP entrance animation
- Category, title, byline overlay visible at bottom
- Byline reads: `by Temuulen · Voidex Studio · Mar 2026 · X min read`
- Article body renders rich text paragraphs
- Related tours strip appears if `relatedTours` is populated in Sanity

- [ ] **Step 4: Verify Korean and Mongolian locales**

- `http://localhost:3000/ko/journal` — Korean strings render correctly
- `http://localhost:3000/mn/journal` — Mongolian strings render correctly

- [ ] **Step 5: Final commit**

```bash
git add -A
git commit -m "feat(journal): complete journal listing and article detail pages"
```
