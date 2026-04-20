# Tour Detail UI Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the stub at `src/app/[locale]/tours/[slug]/page.tsx` with a production tour detail page that reads a `tour` document from Sanity and renders it in Amuun's dark+gold editorial-luxury aesthetic.

**Architecture:** Server Component page fetches `tourBySlugQuery` via `sanityFetch`, then composes 9 section components. One client GSAP section (hero), the rest normal vertical flow with lightweight client-side interactivity (accordion/lightbox/sticky nav). Localized strings resolve via a small `resolveLocaleField` helper; Portable Text renders via `@portabletext/react`.

**Tech Stack:** Next.js 16, React 19, TypeScript, Sanity, next-intl, GSAP, Tailwind v4, lucide-react, `@portabletext/react` (new dep).

**Spec:** [docs/superpowers/specs/2026-04-20-tour-detail-ui-design.md](../specs/2026-04-20-tour-detail-ui-design.md)

**Project testing note:** This repo has no test runner configured and the spec explicitly defers test infra. Each task's verification step is `pnpm typecheck` + `pnpm lint` + manual inspection, not unit tests. Final task is `pnpm build` + manual browser QA.

---

## File Map

**New files:**
- `src/types/tour.ts` — `TourDetail`, `TourItineraryDay`, `TourPricing`, etc.
- `src/lib/locale/resolve-locale-field.ts` — extract localized scalar from `LocaleString`/`LocaleText`
- `src/lib/format/price.ts` — `formatPrice(amount, currency, locale)`
- `src/lib/sanity/portable-text.ts` — `<PortableTextRenderer>` with component registry
- `src/components/tour/tour-stat-strip.tsx` — italic+bold floating strip
- `src/components/tour/tour-hero.tsx` — client, GSAP pinned hero
- `src/components/tour/tour-overview.tsx` — server, summary + description + region chips
- `src/components/tour/tour-itinerary.tsx` — client, sticky day-nav + scroll sync
- `src/components/tour/tour-pricing.tsx` — server, 3 tier cards
- `src/components/tour/tour-included-excluded.tsx` — server, two-column checklist
- `src/components/tour/tour-gallery.tsx` — client, masonry + lightbox trigger
- `src/components/tour/tour-gallery-lightbox.tsx` — client, modal with keyboard handlers
- `src/components/tour/tour-faqs.tsx` — client, single-open accordion
- `src/components/tour/tour-related.tsx` — server, 3 cards
- `src/components/tour/tour-cta-band.tsx` — server, closing CTA

**Modified files:**
- `package.json` — add `@portabletext/react`
- `messages/en.json`, `messages/ko.json`, `messages/mn.json` — add `tour` namespace
- `src/app/[locale]/tours/[slug]/page.tsx` — full replacement

---

## Task 1: Install @portabletext/react

**Files:** `package.json`, `pnpm-lock.yaml`

- [ ] **Step 1: Install the package**

```bash
cd /Users/temuulen/Development/Amuun
pnpm add @portabletext/react
```

- [ ] **Step 2: Verify install**

```bash
pnpm list @portabletext/react
```
Expected: prints a resolved version line for `@portabletext/react` (e.g. `@portabletext/react 3.x.x`).

- [ ] **Step 3: Commit**

```bash
git add package.json pnpm-lock.yaml
git commit -m "chore: add @portabletext/react for tour detail rendering"
```

---

## Task 2: Add `tour` i18n namespace (en/ko/mn)

**Files:**
- Modify: `messages/en.json`
- Modify: `messages/ko.json`
- Modify: `messages/mn.json`

- [ ] **Step 1: Add `tour` block to `messages/en.json` (insert at top level, sibling of `brand`)**

```json
  "tour": {
    "overview": "Overview",
    "overviewEyebrow": "The expedition",
    "itinerary": "Itinerary",
    "itineraryEyebrow": "The journey, day by day",
    "dayLabel": "Day",
    "accommodation": "Accommodation",
    "meals": "Meals",
    "breakfast": "Breakfast",
    "lunch": "Lunch",
    "dinner": "Dinner",
    "pricing": "Pricing",
    "pricingEyebrow": "Investment",
    "pricingStandard": "Standard",
    "pricingDeluxe": "Deluxe",
    "pricingPrivate": "Private",
    "pricingPerPerson": "per person",
    "pricingPerGroup": "per group",
    "pricingFrom": "From",
    "pricingInquire": "Inquire",
    "gallery": "In the field",
    "galleryEyebrow": "Gallery",
    "galleryClose": "Close",
    "galleryPrev": "Previous image",
    "galleryNext": "Next image",
    "included": "Included",
    "excluded": "Not included",
    "faqs": "Before you go",
    "faqsEyebrow": "Questions",
    "related": "You may also like",
    "relatedEyebrow": "Further journeys",
    "ctaHeadline": "Ready to ride?",
    "ctaBody": "Private expeditions are limited to six guests per departure.",
    "ctaPrimary": "Inquire about this expedition",
    "ctaSecondary": "Download itinerary PDF",
    "scroll": "Scroll",
    "viewExpedition": "View expedition",
    "statDays": "DAYS",
    "statExpedition": "EXPEDITION"
  },
```

- [ ] **Step 2: Add the Korean translation to `messages/ko.json`**

```json
  "tour": {
    "overview": "개요",
    "overviewEyebrow": "여정 소개",
    "itinerary": "일정",
    "itineraryEyebrow": "하루하루의 여정",
    "dayLabel": "일차",
    "accommodation": "숙박",
    "meals": "식사",
    "breakfast": "조식",
    "lunch": "중식",
    "dinner": "석식",
    "pricing": "요금",
    "pricingEyebrow": "투자",
    "pricingStandard": "스탠다드",
    "pricingDeluxe": "디럭스",
    "pricingPrivate": "프라이빗",
    "pricingPerPerson": "1인 기준",
    "pricingPerGroup": "그룹 기준",
    "pricingFrom": "부터",
    "pricingInquire": "문의하기",
    "gallery": "현장에서",
    "galleryEyebrow": "갤러리",
    "galleryClose": "닫기",
    "galleryPrev": "이전 이미지",
    "galleryNext": "다음 이미지",
    "included": "포함 사항",
    "excluded": "불포함 사항",
    "faqs": "출발 전 확인",
    "faqsEyebrow": "자주 묻는 질문",
    "related": "함께 보면 좋은 여정",
    "relatedEyebrow": "다른 여정",
    "ctaHeadline": "떠날 준비가 되셨나요?",
    "ctaBody": "프라이빗 원정은 출발당 최대 6명으로 제한됩니다.",
    "ctaPrimary": "이 원정 문의하기",
    "ctaSecondary": "일정표 PDF 다운로드",
    "scroll": "스크롤",
    "viewExpedition": "원정 보기",
    "statDays": "일",
    "statExpedition": "원정"
  },
```

- [ ] **Step 3: Add the Mongolian translation to `messages/mn.json`**

```json
  "tour": {
    "overview": "Тоймлолт",
    "overviewEyebrow": "Аяллын танилцуулга",
    "itinerary": "Хөтөлбөр",
    "itineraryEyebrow": "Өдөр тутмын замнал",
    "dayLabel": "Өдөр",
    "accommodation": "Байрлал",
    "meals": "Хоол",
    "breakfast": "Өглөө",
    "lunch": "Өдөр",
    "dinner": "Орой",
    "pricing": "Үнэ",
    "pricingEyebrow": "Хөрөнгө оруулалт",
    "pricingStandard": "Стандарт",
    "pricingDeluxe": "Дэлюкс",
    "pricingPrivate": "Хувийн",
    "pricingPerPerson": "нэг хүнд",
    "pricingPerGroup": "групп дээр",
    "pricingFrom": "Эхлэх",
    "pricingInquire": "Лавлах",
    "gallery": "Хээрийн тэмдэглэл",
    "galleryEyebrow": "Цомог",
    "galleryClose": "Хаах",
    "galleryPrev": "Өмнөх зураг",
    "galleryNext": "Дараагийн зураг",
    "included": "Багтсан зүйлс",
    "excluded": "Багтаагүй зүйлс",
    "faqs": "Хөдлөхийн өмнө",
    "faqsEyebrow": "Түгээмэл асуултууд",
    "related": "Бас сонирхож магадгүй",
    "relatedEyebrow": "Бусад аяллууд",
    "ctaHeadline": "Хөдлөхөд бэлэн үү?",
    "ctaBody": "Хувийн аялал нь нэг удаагийн хөдөлгөөнд зургаан хүний хязгаартай.",
    "ctaPrimary": "Энэ аяллын талаар лавлах",
    "ctaSecondary": "Хөтөлбөрийг PDF-ээр татах",
    "scroll": "Гүйлгэ",
    "viewExpedition": "Аяллыг үзэх",
    "statDays": "ӨДӨР",
    "statExpedition": "АЯЛАЛ"
  },
```

- [ ] **Step 4: Verify JSON is valid**

```bash
pnpm exec node -e "['en','ko','mn'].forEach(l => JSON.parse(require('fs').readFileSync('messages/'+l+'.json','utf8')))"
```
Expected: no output (silent success). If it throws, a comma or brace is missing.

- [ ] **Step 5: Commit**

```bash
git add messages/en.json messages/ko.json messages/mn.json
git commit -m "i18n: add tour namespace copy (en/ko/mn)"
```

---

## Task 3: Create shared tour types

**Files:** Create: `src/types/tour.ts`

- [ ] **Step 1: Create `src/types/tour.ts`**

```typescript
import type { PortableTextBlock } from '@portabletext/react';

export type LocaleString = Partial<Record<'en' | 'ko' | 'mn', string>>;
export type LocaleText = Partial<Record<'en' | 'ko' | 'mn', string>>;
export type LocaleBlockContent = Partial<Record<'en' | 'ko' | 'mn', PortableTextBlock[]>>;

export interface SanityImageRef {
  _type: 'image';
  asset: { _ref: string; _type: 'reference' };
  hotspot?: { x: number; y: number; height: number; width: number };
  crop?: { top: number; bottom: number; left: number; right: number };
}

export interface ImageWithAlt {
  _type: 'imageWithAlt';
  asset: { _ref: string; _type: 'reference' };
  alt?: LocaleString;
  caption?: LocaleString;
}

export interface TourPricingData {
  currency: 'USD' | 'EUR' | 'KRW';
  perPerson: boolean;
  standard: number;
  deluxe: number;
  private: number;
  notes?: LocaleText;
}

export interface TourItineraryDay {
  _key: string;
  day: number;
  title: LocaleString;
  description: LocaleText;
  accommodation?: LocaleString;
  meals?: Array<'breakfast' | 'lunch' | 'dinner'>;
  image?: ImageWithAlt;
}

export interface TourDestinationRef {
  _id: string;
  title: LocaleString;
  slug: { current: string };
  region?: string;
  heroImage?: ImageWithAlt;
}

export interface TourFaqRef {
  _id: string;
  question: LocaleString;
  answer: LocaleBlockContent;
  category?: string;
  order?: number;
}

export interface TourRelatedRef {
  _id: string;
  title: LocaleString;
  slug: { current: string };
  summary?: LocaleText;
  heroImage: ImageWithAlt;
  duration: number;
  difficulty: 'easy' | 'moderate' | 'challenging' | 'expert';
  pricing?: Pick<TourPricingData, 'currency' | 'standard'>;
}

export interface TourSeo {
  metaTitle?: LocaleString;
  metaDescription?: LocaleText;
  ogImage?: ImageWithAlt;
}

export interface TourDetail {
  _id: string;
  _type: 'tour';
  title: LocaleString;
  slug: { current: string };
  summary: LocaleText;
  description?: LocaleBlockContent;
  heroImage: ImageWithAlt;
  gallery?: ImageWithAlt[];
  duration: number;
  difficulty: 'easy' | 'moderate' | 'challenging' | 'expert';
  seasons: Array<'spring' | 'summer' | 'autumn' | 'winter'>;
  included?: LocaleString[];
  excluded?: LocaleString[];
  itinerary?: TourItineraryDay[];
  mapRoute?: Array<{ _type: 'geopoint'; lat: number; lng: number; alt?: number }>;
  pricing: TourPricingData;
  destinations?: TourDestinationRef[];
  faqs?: TourFaqRef[];
  relatedTours?: TourRelatedRef[];
  featured?: boolean;
  order?: number;
  publishedAt: string;
  seo?: TourSeo;
}
```

- [ ] **Step 2: Typecheck**

```bash
pnpm typecheck
```
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/types/tour.ts
git commit -m "types: add TourDetail and related Sanity types"
```

---

## Task 4: Locale field resolver

**Files:** Create: `src/lib/locale/resolve-locale-field.ts`

- [ ] **Step 1: Create the helper**

```typescript
export type Locale = 'en' | 'ko' | 'mn';

export function resolveLocaleField<T>(
  field: Partial<Record<Locale, T>> | undefined | null,
  locale: Locale,
  fallbackLocale: Locale = 'en',
): T | undefined {
  if (!field) return undefined;
  const direct = field[locale];
  if (direct !== undefined && direct !== null && direct !== '') return direct;
  const fallback = field[fallbackLocale];
  if (fallback !== undefined && fallback !== null && fallback !== '') return fallback;
  const first = Object.values(field).find(
    (v): v is T => v !== undefined && v !== null && v !== '',
  );
  return first;
}
```

- [ ] **Step 2: Typecheck**

```bash
pnpm typecheck
```
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/lib/locale/resolve-locale-field.ts
git commit -m "lib: add resolveLocaleField with fallback chain"
```

---

## Task 5: Price formatter

**Files:** Create: `src/lib/format/price.ts`

- [ ] **Step 1: Create the formatter**

```typescript
import type { Locale } from '@/lib/locale/resolve-locale-field';

const INTL_LOCALES: Record<Locale, string> = {
  en: 'en-US',
  ko: 'ko-KR',
  mn: 'mn-MN',
};

export function formatPrice(
  amount: number,
  currency: 'USD' | 'EUR' | 'KRW',
  locale: Locale,
): string {
  return new Intl.NumberFormat(INTL_LOCALES[locale], {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  }).format(amount);
}
```

- [ ] **Step 2: Typecheck**

```bash
pnpm typecheck
```
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/lib/format/price.ts
git commit -m "lib: add formatPrice with per-locale currency formatting"
```

---

## Task 6: Portable Text renderer

**Files:** Create: `src/lib/sanity/portable-text.ts`

- [ ] **Step 1: Create the renderer**

```typescript
import { PortableText, type PortableTextComponents, type PortableTextBlock } from '@portabletext/react';
import Image from 'next/image';
import { urlFor } from '@/sanity/lib/image';

const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p className="mb-6 text-base leading-[1.8] text-[#A7ACB4] font-light last:mb-0">{children}</p>
    ),
    h2: ({ children }) => (
      <h2 className="mt-12 mb-6 font-serif text-3xl font-semibold text-[#F7F7F5]">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="mt-10 mb-4 font-serif text-2xl font-semibold text-[#F7F7F5]">{children}</h3>
    ),
    blockquote: ({ children }) => (
      <blockquote className="my-8 border-l border-[#D4A23A] pl-6 font-serif text-xl italic text-[#F7F7F5]">
        {children}
      </blockquote>
    ),
  },
  marks: {
    strong: ({ children }) => <strong className="text-[#F7F7F5]">{children}</strong>,
    em: ({ children }) => <em className="italic">{children}</em>,
    link: ({ value, children }) => (
      <a
        href={value?.href ?? '#'}
        className="text-[#D4A23A] underline-offset-4 hover:underline"
        target={value?.blank ? '_blank' : undefined}
        rel={value?.blank ? 'noopener noreferrer' : undefined}
      >
        {children}
      </a>
    ),
  },
  list: {
    bullet: ({ children }) => <ul className="mb-6 list-disc space-y-2 pl-6 text-[#A7ACB4]">{children}</ul>,
    number: ({ children }) => <ol className="mb-6 list-decimal space-y-2 pl-6 text-[#A7ACB4]">{children}</ol>,
  },
  types: {
    image: ({ value }) => {
      if (!value?.asset) return null;
      const url = urlFor(value).width(1200).quality(85).url();
      return (
        <figure className="my-8">
          <div className="image-card">
            <Image
              src={url}
              alt={value?.alt?.en ?? ''}
              width={1200}
              height={800}
              className="w-full h-auto object-cover"
            />
          </div>
          {value?.caption?.en ? (
            <figcaption className="mt-3 font-mono text-xs uppercase tracking-[0.12em] text-[#A7ACB4]">
              {value.caption.en}
            </figcaption>
          ) : null}
        </figure>
      );
    },
  },
};

interface PortableTextRendererProps {
  value: PortableTextBlock[];
}

export function PortableTextRenderer({ value }: PortableTextRendererProps) {
  return <PortableText value={value} components={components} />;
}
```

- [ ] **Step 2: Typecheck**

```bash
pnpm typecheck
```
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/lib/sanity/portable-text.ts
git commit -m "lib: add PortableTextRenderer with Amuun styling"
```

---

## Task 7: TourStatStrip component

**Files:** Create: `src/components/tour/tour-stat-strip.tsx`

- [ ] **Step 1: Create the component**

```typescript
import { getTranslations } from 'next-intl/server';
import type { Locale } from '@/lib/locale/resolve-locale-field';
import { formatPrice } from '@/lib/format/price';
import type { TourPricingData } from '@/types/tour';

interface TourStatStripProps {
  duration: number;
  difficulty: 'easy' | 'moderate' | 'challenging' | 'expert';
  pricing: TourPricingData;
  locale: Locale;
}

export async function TourStatStrip({ duration, difficulty, pricing, locale }: TourStatStripProps) {
  const t = await getTranslations('tour');
  const difficultyLabel = difficulty.charAt(0).toUpperCase() + difficulty.slice(1);
  const priceLabel = formatPrice(pricing.standard, pricing.currency, locale);

  return (
    <div className="inline-flex flex-wrap items-center gap-x-6 gap-y-2 border border-[#D4A23A]/40 bg-[#0B0D10]/70 px-6 py-4 backdrop-blur-sm">
      <Stat italic={`${duration}`} bold={t('statDays')} />
      <Divider />
      <Stat italic={difficultyLabel} bold={t('statExpedition')} />
      <Divider />
      <Stat italic={t('pricingFrom')} bold={priceLabel} />
    </div>
  );
}

function Stat({ italic, bold }: { italic: string; bold: string }) {
  return (
    <span className="flex items-baseline gap-2 font-mono text-xs uppercase tracking-[0.12em] text-[#F7F7F5]">
      <em className="font-serif text-base italic not-[font-mono] text-[#D4A23A] normal-case tracking-normal">
        {italic}
      </em>
      <strong className="font-semibold">{bold}</strong>
    </span>
  );
}

function Divider() {
  return <span className="hidden h-4 w-px bg-[#D4A23A]/30 sm:block" aria-hidden />;
}
```

- [ ] **Step 2: Typecheck**

```bash
pnpm typecheck
```
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/tour/tour-stat-strip.tsx
git commit -m "feat(tour): add TourStatStrip italic+bold pattern"
```

---

## Task 8: Page skeleton + data fetch + metadata

**Files:** Modify: `src/app/[locale]/tours/[slug]/page.tsx`

This task replaces the stub and gets a live fetch working before any section components exist. The sections render placeholders so we can see the data flowing end to end.

- [ ] **Step 1: Replace file contents**

```typescript
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import { sanityFetch } from '@/sanity/lib/fetcher';
import { tourBySlugQuery, tourSlugsQuery } from '@/sanity/lib/queries';
import { urlFor } from '@/sanity/lib/image';
import { resolveLocaleField, type Locale } from '@/lib/locale/resolve-locale-field';
import type { TourDetail } from '@/types/tour';
import { Footer } from '@/components/layout/footer';
import { routing } from '@/i18n/routing';

interface TourPageParams {
  locale: Locale;
  slug: string;
}

export async function generateStaticParams() {
  const slugs = (await sanityFetch<string[]>(tourSlugsQuery, {}, { tags: ['tour'] })) ?? [];
  return routing.locales.flatMap((locale) => slugs.map((slug) => ({ locale, slug })));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<TourPageParams>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const tour = await sanityFetch<TourDetail>(
    tourBySlugQuery,
    { slug },
    { tags: ['tour', slug] },
  );
  if (!tour) return { title: 'Amuun' };

  const title = resolveLocaleField(tour.seo?.metaTitle, locale) ?? resolveLocaleField(tour.title, locale) ?? 'Amuun';
  const description = resolveLocaleField(tour.seo?.metaDescription, locale) ?? resolveLocaleField(tour.summary, locale);
  const ogImageSrc = tour.seo?.ogImage ?? tour.heroImage;
  const ogImage = ogImageSrc ? urlFor(ogImageSrc).width(1200).height(630).url() : undefined;

  return {
    title: `${title} · Amuun`,
    description,
    openGraph: {
      title,
      description,
      images: ogImage ? [{ url: ogImage, width: 1200, height: 630 }] : undefined,
    },
  };
}

export default async function TourDetailPage({
  params,
}: {
  params: Promise<TourPageParams>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const tour = await sanityFetch<TourDetail>(
    tourBySlugQuery,
    { slug },
    { tags: ['tour', slug] },
  );
  if (!tour) notFound();

  return (
    <main className="relative bg-[#0B0D10]">
      <section className="min-h-screen px-[7vw] pt-[20vh] pb-[10vh]">
        <span className="eyebrow block">Tour detail skeleton</span>
        <h1 className="mt-6 font-serif text-5xl font-semibold text-[#F7F7F5]">
          {resolveLocaleField(tour.title, locale)}
        </h1>
        <p className="mt-6 max-w-xl text-[#A7ACB4]">
          {resolveLocaleField(tour.summary, locale)}
        </p>
        <pre className="mt-10 overflow-auto text-xs text-[#A7ACB4]/60">
          {JSON.stringify(
            {
              duration: tour.duration,
              difficulty: tour.difficulty,
              seasons: tour.seasons,
              pricing: tour.pricing,
              itineraryDays: tour.itinerary?.length ?? 0,
              galleryCount: tour.gallery?.length ?? 0,
              faqs: tour.faqs?.length ?? 0,
              related: tour.relatedTours?.length ?? 0,
            },
            null,
            2,
          )}
        </pre>
      </section>
      <Footer />
    </main>
  );
}
```

- [ ] **Step 2: Typecheck + lint**

```bash
pnpm typecheck && pnpm lint
```
Expected: no errors.

- [ ] **Step 3: Smoke test**

Run `pnpm dev`, open `http://localhost:3000/en/tours/<any-seeded-slug>` (check `pnpm exec tsx seed/seed.ts` log for slugs, or inspect Sanity Studio). Confirm the JSON dump renders non-empty fields. Kill the dev server when done.

- [ ] **Step 4: Commit**

```bash
git add src/app/\[locale\]/tours/\[slug\]/page.tsx
git commit -m "feat(tour): fetch tour by slug with static params and metadata"
```

---

## Task 9: TourHero

**Files:** Create: `src/components/tour/tour-hero.tsx`

- [ ] **Step 1: Create the hero component**

```typescript
'use client';

import { useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { gsap } from '@/lib/gsap/register';
import { Stamp } from '@/components/shared/stamp';

interface TourHeroProps {
  heroImageUrl: string;
  heroImageAlt: string;
  title: string;
  summary: string;
  eyebrow: string;
  statStrip: React.ReactNode;
}

export function TourHero({
  heroImageUrl,
  heroImageAlt,
  title,
  summary,
  eyebrow,
  statStrip,
}: TourHeroProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const bgRef = useRef<HTMLImageElement>(null);
  const stampRef = useRef<HTMLDivElement>(null);
  const t = useTranslations('tour');

  useEffect(() => {
    const section = sectionRef.current;
    const headline = headlineRef.current;
    const bg = bgRef.current;
    const stamp = stampRef.current;
    if (!section || !headline || !bg || !stamp) return;

    const ctx = gsap.context(() => {
      gsap.set(bg, { scale: 1.06, opacity: 0 });
      gsap.set(headline, { y: 40, opacity: 0 });
      gsap.set(stamp, { scale: 0.6, opacity: 0, rotate: -90 });

      const tl = gsap.timeline({ delay: 0.2 });
      tl.to(bg, { opacity: 1, scale: 1, duration: 1.2, ease: 'power2.out' })
        .to(headline, { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }, '-=0.8')
        .to(stamp, { scale: 1, opacity: 1, rotate: 0, duration: 1, ease: 'back.out(1.6)' }, '-=0.5');
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative h-[100svh] w-full overflow-hidden">
      <img
        ref={bgRef}
        src={heroImageUrl}
        alt={heroImageAlt}
        className="absolute inset-0 h-full w-full object-cover will-change-transform"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#0B0D10]/70 via-[#0B0D10]/30 to-[#0B0D10]/80" />

      <div className="relative z-10 flex h-full flex-col items-start justify-end px-[7vw] pb-[14vh]">
        <span className="eyebrow block">{eyebrow}</span>
        <h1
          ref={headlineRef}
          className="headline-section mt-6 max-w-[70vw] font-serif font-semibold text-[#F7F7F5]"
        >
          {title}
        </h1>
        <p className="body-luxury mt-6 max-w-xl">{summary}</p>
        <div className="mt-10">{statStrip}</div>
      </div>

      <div ref={stampRef} className="absolute bottom-[4vh] right-[4vw] will-change-transform">
        <Stamp />
      </div>

      <div className="absolute bottom-[4vh] left-[7vw] flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.12em] text-[#A7ACB4]">
        <span>{t('scroll')}</span>
        <span className="h-px w-10 bg-[#D4A23A]" aria-hidden />
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Wire the hero into the page**

Replace the placeholder `<section>` in `src/app/[locale]/tours/[slug]/page.tsx` (keep imports + `generateStaticParams` + `generateMetadata` intact, just replace the JSX returned by `TourDetailPage`):

```typescript
  const title = resolveLocaleField(tour.title, locale) ?? '';
  const summary = resolveLocaleField(tour.summary, locale) ?? '';
  const heroAlt = resolveLocaleField(tour.heroImage.alt, locale) ?? title;
  const heroUrl = urlFor(tour.heroImage).width(2000).quality(85).url();
  const eyebrowParts = [
    `${tour.duration} ${tour.seasons.join(' / ')}`,
    tour.difficulty,
  ];
  const eyebrow = eyebrowParts.filter(Boolean).join(' · ').toUpperCase();

  return (
    <main className="relative bg-[#0B0D10]">
      <TourHero
        heroImageUrl={heroUrl}
        heroImageAlt={heroAlt}
        title={title}
        summary={summary}
        eyebrow={eyebrow}
        statStrip={
          <TourStatStrip
            duration={tour.duration}
            difficulty={tour.difficulty}
            pricing={tour.pricing}
            locale={locale}
          />
        }
      />
      <Footer />
    </main>
  );
```

And add imports at the top of the file:

```typescript
import { TourHero } from '@/components/tour/tour-hero';
import { TourStatStrip } from '@/components/tour/tour-stat-strip';
```

Also remove the now-unused JSON `<pre>` block and its dependencies.

- [ ] **Step 3: Typecheck + lint**

```bash
pnpm typecheck && pnpm lint
```
Expected: no errors.

- [ ] **Step 4: Manual smoke**

`pnpm dev`, open `/en/tours/<slug>`. Hero image, title, summary, and gold-bordered stat strip should render. Stamp in bottom-right. No console errors.

- [ ] **Step 5: Commit**

```bash
git add src/components/tour/tour-hero.tsx src/app/\[locale\]/tours/\[slug\]/page.tsx
git commit -m "feat(tour): add cinematic hero with GSAP reveal"
```

---

## Task 10: TourOverview

**Files:** Create: `src/components/tour/tour-overview.tsx`

- [ ] **Step 1: Create the overview component**

```typescript
import { getTranslations } from 'next-intl/server';
import type { PortableTextBlock } from '@portabletext/react';
import { PortableTextRenderer } from '@/lib/sanity/portable-text';
import { LocaleLink } from '@/components/shared/locale-link';
import { resolveLocaleField, type Locale } from '@/lib/locale/resolve-locale-field';
import type { TourDestinationRef } from '@/types/tour';

interface TourOverviewProps {
  summary: string;
  description?: PortableTextBlock[];
  destinations?: TourDestinationRef[];
  locale: Locale;
}

export async function TourOverview({ summary, description, destinations, locale }: TourOverviewProps) {
  const t = await getTranslations('tour');
  const regions = Array.from(
    new Set((destinations ?? []).map((d) => d.region).filter((v): v is string => !!v)),
  );

  return (
    <section className="relative bg-[#0B0D10] px-[7vw] py-[14vh]">
      <div className="mx-auto grid max-w-6xl gap-16 md:grid-cols-[1fr_0.6fr]">
        <div>
          <span className="eyebrow block">{t('overviewEyebrow')}</span>
          <h2 className="headline-subsection mt-6 font-serif text-[#F7F7F5]">{t('overview')}</h2>
          <p className="mt-10 max-w-xl font-serif text-2xl leading-[1.4] text-[#F7F7F5]">
            {summary}
          </p>
          {description ? (
            <div className="mt-10 max-w-2xl">
              <PortableTextRenderer value={description} />
            </div>
          ) : null}

          {destinations && destinations.length > 0 ? (
            <div className="mt-12 flex flex-wrap gap-3">
              {destinations.map((dest) => {
                const destTitle = resolveLocaleField(dest.title, locale) ?? '';
                return (
                  <LocaleLink
                    key={dest._id}
                    href={`/destinations/${dest.slug.current}`}
                    className="inline-flex items-center gap-2 border border-[#D4A23A]/40 px-4 py-2 font-mono text-xs uppercase tracking-[0.12em] text-[#D4A23A] transition-colors hover:bg-[#D4A23A] hover:text-[#0B0D10]"
                  >
                    {destTitle}
                  </LocaleLink>
                );
              })}
            </div>
          ) : null}
        </div>

        {regions.length > 0 ? (
          <aside className="space-y-6 border-l border-[#D4A23A]/20 pl-10">
            <span className="eyebrow block">Regions</span>
            <ul className="space-y-3 font-serif text-xl text-[#F7F7F5]">
              {regions.map((region) => (
                <li key={region} className="border-b border-[#F7F7F5]/10 pb-3 last:border-none">
                  {region}
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

- [ ] **Step 2: Wire into page**

In `src/app/[locale]/tours/[slug]/page.tsx`, import the component and add it right after `<TourHero />`:

```typescript
import { TourOverview } from '@/components/tour/tour-overview';

// inside returned JSX, after <TourHero ... />
<TourOverview
  summary={summary}
  description={resolveLocaleField(tour.description, locale)}
  destinations={tour.destinations}
  locale={locale}
/>
```

- [ ] **Step 3: Typecheck + lint**

```bash
pnpm typecheck && pnpm lint
```
Expected: no errors.

- [ ] **Step 4: Manual smoke**

Reload the tour page — Overview section appears under hero with summary, portable text description, destination chips, region list.

- [ ] **Step 5: Commit**

```bash
git add src/components/tour/tour-overview.tsx src/app/\[locale\]/tours/\[slug\]/page.tsx
git commit -m "feat(tour): add overview section with portable text and destinations"
```

---

## Task 11: TourItinerary

**Files:** Create: `src/components/tour/tour-itinerary.tsx`

- [ ] **Step 1: Create the itinerary component**

```typescript
'use client';

import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import type { TourItineraryDay, ImageWithAlt } from '@/types/tour';
import { resolveLocaleField, type Locale } from '@/lib/locale/resolve-locale-field';
import { urlFor } from '@/sanity/lib/image';

interface TourItineraryProps {
  days: TourItineraryDay[];
  locale: Locale;
}

function imageUrl(image: ImageWithAlt | undefined) {
  if (!image) return undefined;
  return urlFor(image).width(1400).quality(85).url();
}

export function TourItinerary({ days, locale }: TourItineraryProps) {
  const t = useTranslations('tour');
  const [activeKey, setActiveKey] = useState(days[0]?._key ?? '');
  const panelsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = panelsRef.current;
    if (!root) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActiveKey(visible.target.getAttribute('data-key') ?? '');
      },
      { root: null, threshold: [0.4, 0.6], rootMargin: '-30% 0px -30% 0px' },
    );
    const panels = root.querySelectorAll('[data-key]');
    panels.forEach((p) => observer.observe(p));
    return () => observer.disconnect();
  }, [days]);

  if (days.length === 0) return null;

  return (
    <section className="relative bg-[#0B0D10] px-[7vw] py-[14vh]">
      <div className="mx-auto max-w-6xl">
        <span className="eyebrow block">{t('itineraryEyebrow')}</span>
        <h2 className="headline-subsection mt-6 font-serif text-[#F7F7F5]">{t('itinerary')}</h2>

        <div className="mt-16 grid gap-10 md:grid-cols-[220px_1fr]">
          <nav className="hidden md:block">
            <ol className="sticky top-[20vh] space-y-3">
              {days.map((day) => {
                const isActive = day._key === activeKey;
                const title = resolveLocaleField(day.title, locale) ?? '';
                return (
                  <li key={day._key}>
                    <a
                      href={`#day-${day.day}`}
                      className={`flex flex-col gap-1 border-l-2 pl-4 py-1 transition-colors ${
                        isActive
                          ? 'border-[#D4A23A] text-[#D4A23A]'
                          : 'border-[#F7F7F5]/10 text-[#A7ACB4] hover:text-[#F7F7F5]'
                      }`}
                    >
                      <span className="font-mono text-[10px] uppercase tracking-[0.12em]">
                        {t('dayLabel')} {String(day.day).padStart(2, '0')}
                      </span>
                      <span className="font-serif text-sm">{title}</span>
                    </a>
                  </li>
                );
              })}
            </ol>
          </nav>

          <div ref={panelsRef} className="space-y-20">
            {days.map((day) => {
              const title = resolveLocaleField(day.title, locale) ?? '';
              const description = resolveLocaleField(day.description, locale) ?? '';
              const accommodation = resolveLocaleField(day.accommodation, locale);
              const imgSrc = imageUrl(day.image);
              const imgAlt = resolveLocaleField(day.image?.alt, locale) ?? title;
              return (
                <article
                  key={day._key}
                  id={`day-${day.day}`}
                  data-key={day._key}
                  className="scroll-mt-[20vh]"
                >
                  {imgSrc ? (
                    <div className="image-card mb-8 aspect-[3/2] w-full overflow-hidden">
                      <Image
                        src={imgSrc}
                        alt={imgAlt}
                        width={1400}
                        height={933}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ) : null}
                  <span className="font-mono text-xs uppercase tracking-[0.18em] text-[#D4A23A]">
                    {t('dayLabel')} {String(day.day).padStart(2, '0')}
                  </span>
                  <h3 className="mt-3 font-serif text-3xl font-semibold text-[#F7F7F5]">{title}</h3>
                  <p className="mt-6 max-w-2xl text-base leading-[1.8] text-[#A7ACB4] font-light">
                    {description}
                  </p>
                  <dl className="mt-8 grid gap-4 border-t border-[#F7F7F5]/10 pt-6 text-sm sm:grid-cols-2">
                    {accommodation ? (
                      <div>
                        <dt className="font-mono text-[10px] uppercase tracking-[0.12em] text-[#A7ACB4]">
                          {t('accommodation')}
                        </dt>
                        <dd className="mt-1 text-[#F7F7F5]">{accommodation}</dd>
                      </div>
                    ) : null}
                    {day.meals && day.meals.length > 0 ? (
                      <div>
                        <dt className="font-mono text-[10px] uppercase tracking-[0.12em] text-[#A7ACB4]">
                          {t('meals')}
                        </dt>
                        <dd className="mt-1 flex flex-wrap gap-2 text-[#F7F7F5]">
                          {day.meals.map((m) => (
                            <span
                              key={m}
                              className="border border-[#D4A23A]/40 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.12em] text-[#D4A23A]"
                            >
                              {t(m)}
                            </span>
                          ))}
                        </dd>
                      </div>
                    ) : null}
                  </dl>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Wire into page**

```typescript
import { TourItinerary } from '@/components/tour/tour-itinerary';

// in JSX after <TourOverview ... />
{tour.itinerary && tour.itinerary.length > 0 ? (
  <TourItinerary days={tour.itinerary} locale={locale} />
) : null}
```

- [ ] **Step 3: Typecheck + lint + manual smoke**

```bash
pnpm typecheck && pnpm lint
```
Open tour page, scroll through itinerary, confirm sticky day-nav highlights current day.

- [ ] **Step 4: Commit**

```bash
git add src/components/tour/tour-itinerary.tsx src/app/\[locale\]/tours/\[slug\]/page.tsx
git commit -m "feat(tour): add itinerary with sticky day navigation"
```

---

## Task 12: TourPricing

**Files:** Create: `src/components/tour/tour-pricing.tsx`

- [ ] **Step 1: Create the pricing component**

```typescript
import { getTranslations } from 'next-intl/server';
import { LocaleLink } from '@/components/shared/locale-link';
import { formatPrice } from '@/lib/format/price';
import { resolveLocaleField, type Locale } from '@/lib/locale/resolve-locale-field';
import type { TourPricingData } from '@/types/tour';

interface TourPricingProps {
  pricing: TourPricingData;
  tourSlug: string;
  locale: Locale;
}

export async function TourPricing({ pricing, tourSlug, locale }: TourPricingProps) {
  const t = await getTranslations('tour');
  const tiers = [
    { key: 'standard' as const, label: t('pricingStandard'), amount: pricing.standard },
    { key: 'deluxe' as const, label: t('pricingDeluxe'), amount: pricing.deluxe },
    { key: 'private' as const, label: t('pricingPrivate'), amount: pricing.private },
  ];
  const perLabel = pricing.perPerson ? t('pricingPerPerson') : t('pricingPerGroup');
  const notes = resolveLocaleField(pricing.notes, locale);

  return (
    <section className="relative bg-[#0B0D10] px-[7vw] py-[14vh]">
      <div className="mx-auto max-w-6xl">
        <span className="eyebrow block">{t('pricingEyebrow')}</span>
        <h2 className="headline-subsection mt-6 font-serif text-[#F7F7F5]">{t('pricing')}</h2>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {tiers.map((tier) => (
            <article key={tier.key} className="image-card flex flex-col gap-6 p-10">
              <span className="font-mono text-xs uppercase tracking-[0.18em] text-[#D4A23A]">
                {tier.label}
              </span>
              <div>
                <div className="font-serif text-5xl font-semibold text-[#F7F7F5]">
                  {formatPrice(tier.amount, pricing.currency, locale)}
                </div>
                <div className="mt-2 font-mono text-[10px] uppercase tracking-[0.12em] text-[#A7ACB4]">
                  {perLabel}
                </div>
              </div>
              <LocaleLink
                href={`/contact?tour=${tourSlug}&tier=${tier.key}`}
                className="mt-auto inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.12em] text-[#D4A23A] transition-colors hover:text-[#F7F7F5]"
              >
                {t('pricingInquire')}
                <span aria-hidden>→</span>
              </LocaleLink>
            </article>
          ))}
        </div>

        {notes ? (
          <p className="mt-10 max-w-2xl font-mono text-xs uppercase tracking-[0.12em] text-[#A7ACB4]">
            {notes}
          </p>
        ) : null}
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Wire into page**

```typescript
import { TourPricing } from '@/components/tour/tour-pricing';

// after <TourItinerary .../>
<TourPricing pricing={tour.pricing} tourSlug={tour.slug.current} locale={locale} />
```

- [ ] **Step 3: Typecheck + lint + smoke**

```bash
pnpm typecheck && pnpm lint
```
Reload page, confirm 3 pricing cards, prices formatted per locale, inquire links target `/contact?tour=<slug>&tier=<tier>`.

- [ ] **Step 4: Commit**

```bash
git add src/components/tour/tour-pricing.tsx src/app/\[locale\]/tours/\[slug\]/page.tsx
git commit -m "feat(tour): add three-tier pricing cards"
```

---

## Task 13: TourIncludedExcluded

**Files:** Create: `src/components/tour/tour-included-excluded.tsx`

- [ ] **Step 1: Create the component**

```typescript
import { getTranslations } from 'next-intl/server';
import { Check, X } from 'lucide-react';
import { resolveLocaleField, type Locale } from '@/lib/locale/resolve-locale-field';
import type { LocaleString } from '@/types/tour';

interface TourIncludedExcludedProps {
  included?: LocaleString[];
  excluded?: LocaleString[];
  locale: Locale;
}

export async function TourIncludedExcluded({
  included,
  excluded,
  locale,
}: TourIncludedExcludedProps) {
  const t = await getTranslations('tour');
  if ((!included || included.length === 0) && (!excluded || excluded.length === 0)) return null;

  return (
    <section className="relative bg-[#0B0D10] px-[7vw] py-[14vh]">
      <div className="mx-auto grid max-w-6xl gap-16 md:grid-cols-2">
        {included && included.length > 0 ? (
          <div>
            <h3 className="font-serif text-3xl font-semibold text-[#F7F7F5]">{t('included')}</h3>
            <ul className="mt-8 space-y-4">
              {included.map((item, i) => {
                const text = resolveLocaleField(item, locale) ?? '';
                return (
                  <li key={`inc-${i}`} className="flex items-start gap-3 text-[#F7F7F5]">
                    <Check size={18} className="mt-1 shrink-0 text-[#D4A23A]" aria-hidden />
                    <span className="text-base leading-relaxed">{text}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        ) : null}

        {excluded && excluded.length > 0 ? (
          <div>
            <h3 className="font-serif text-3xl font-semibold text-[#F7F7F5]">{t('excluded')}</h3>
            <ul className="mt-8 space-y-4">
              {excluded.map((item, i) => {
                const text = resolveLocaleField(item, locale) ?? '';
                return (
                  <li key={`exc-${i}`} className="flex items-start gap-3 text-[#A7ACB4]">
                    <X size={18} className="mt-1 shrink-0 text-[#A7ACB4]/60" aria-hidden />
                    <span className="text-base leading-relaxed">{text}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        ) : null}
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Wire into page**

```typescript
import { TourIncludedExcluded } from '@/components/tour/tour-included-excluded';

// after pricing
<TourIncludedExcluded included={tour.included} excluded={tour.excluded} locale={locale} />
```

- [ ] **Step 3: Typecheck + lint + smoke**

```bash
pnpm typecheck && pnpm lint
```
Confirm two-column checklist renders, with gold checks and muted exes.

- [ ] **Step 4: Commit**

```bash
git add src/components/tour/tour-included-excluded.tsx src/app/\[locale\]/tours/\[slug\]/page.tsx
git commit -m "feat(tour): add included and excluded checklists"
```

---

## Task 14: TourGallery + lightbox

**Files:**
- Create: `src/components/tour/tour-gallery-lightbox.tsx`
- Create: `src/components/tour/tour-gallery.tsx`

- [ ] **Step 1: Create the lightbox**

```typescript
'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface LightboxImage {
  url: string;
  alt: string;
  caption?: string;
}

interface TourGalleryLightboxProps {
  images: LightboxImage[];
  activeIndex: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  labels: { close: string; prev: string; next: string };
}

export function TourGalleryLightbox({
  images,
  activeIndex,
  onClose,
  onPrev,
  onNext,
  labels,
}: TourGalleryLightboxProps) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onPrev();
      if (e.key === 'ArrowRight') onNext();
    };
    window.addEventListener('keydown', handler);
    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handler);
      document.body.style.overflow = overflow;
    };
  }, [onClose, onPrev, onNext]);

  const image = images[activeIndex];
  if (!image) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[200] flex items-center justify-center bg-[#0B0D10]/95 backdrop-blur-sm"
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute right-6 top-6 text-[#F7F7F5] hover:text-[#D4A23A]"
        aria-label={labels.close}
      >
        <X size={28} />
      </button>
      <button
        type="button"
        onClick={onPrev}
        className="absolute left-6 text-[#F7F7F5] hover:text-[#D4A23A]"
        aria-label={labels.prev}
      >
        <ChevronLeft size={32} />
      </button>
      <button
        type="button"
        onClick={onNext}
        className="absolute right-6 bottom-1/2 translate-y-1/2 text-[#F7F7F5] hover:text-[#D4A23A] md:right-20"
        aria-label={labels.next}
      >
        <ChevronRight size={32} />
      </button>

      <figure className="relative max-h-[80vh] max-w-[80vw]">
        <Image
          src={image.url}
          alt={image.alt}
          width={1800}
          height={1200}
          className="max-h-[80vh] w-auto object-contain"
          priority
        />
        {image.caption ? (
          <figcaption className="mt-4 text-center font-mono text-xs uppercase tracking-[0.12em] text-[#A7ACB4]">
            {image.caption}
          </figcaption>
        ) : null}
      </figure>
    </div>
  );
}
```

- [ ] **Step 2: Create the gallery**

```typescript
'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import type { ImageWithAlt } from '@/types/tour';
import { resolveLocaleField, type Locale } from '@/lib/locale/resolve-locale-field';
import { urlFor } from '@/sanity/lib/image';
import { TourGalleryLightbox } from './tour-gallery-lightbox';

interface TourGalleryProps {
  images: ImageWithAlt[];
  locale: Locale;
}

export function TourGallery({ images, locale }: TourGalleryProps) {
  const t = useTranslations('tour');
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  if (images.length === 0) return null;

  const lightboxImages = images.map((img) => ({
    url: urlFor(img).width(2000).quality(90).url(),
    alt: resolveLocaleField(img.alt, locale) ?? '',
    caption: resolveLocaleField(img.caption, locale),
  }));

  return (
    <section className="relative bg-[#0B0D10] px-[7vw] py-[14vh]">
      <div className="mx-auto max-w-6xl">
        <span className="eyebrow block">{t('galleryEyebrow')}</span>
        <h2 className="headline-subsection mt-6 font-serif text-[#F7F7F5]">{t('gallery')}</h2>

        <div className="mt-16 columns-1 gap-4 md:columns-2 lg:columns-3">
          {images.map((img, i) => {
            const thumb = urlFor(img).width(900).quality(80).url();
            const alt = resolveLocaleField(img.alt, locale) ?? '';
            return (
              <button
                key={i}
                type="button"
                onClick={() => setActiveIndex(i)}
                className="image-card mb-4 block w-full break-inside-avoid overflow-hidden transition-transform hover:scale-[1.01]"
              >
                <Image
                  src={thumb}
                  alt={alt}
                  width={900}
                  height={600}
                  className="h-auto w-full object-cover"
                />
              </button>
            );
          })}
        </div>
      </div>

      {activeIndex !== null ? (
        <TourGalleryLightbox
          images={lightboxImages}
          activeIndex={activeIndex}
          onClose={() => setActiveIndex(null)}
          onPrev={() => setActiveIndex((i) => (i === null ? 0 : (i - 1 + images.length) % images.length))}
          onNext={() => setActiveIndex((i) => (i === null ? 0 : (i + 1) % images.length))}
          labels={{ close: t('galleryClose'), prev: t('galleryPrev'), next: t('galleryNext') }}
        />
      ) : null}
    </section>
  );
}
```

- [ ] **Step 3: Wire into page**

```typescript
import { TourGallery } from '@/components/tour/tour-gallery';

// after <TourIncludedExcluded .../>
{tour.gallery && tour.gallery.length > 0 ? (
  <TourGallery images={tour.gallery} locale={locale} />
) : null}
```

- [ ] **Step 4: Typecheck + lint + smoke**

```bash
pnpm typecheck && pnpm lint
```
Click an image — lightbox should open. Arrow keys navigate. Esc closes.

- [ ] **Step 5: Commit**

```bash
git add src/components/tour/tour-gallery.tsx src/components/tour/tour-gallery-lightbox.tsx src/app/\[locale\]/tours/\[slug\]/page.tsx
git commit -m "feat(tour): add masonry gallery with keyboard-accessible lightbox"
```

---

## Task 15: TourFaqs

**Files:** Create: `src/components/tour/tour-faqs.tsx`

- [ ] **Step 1: Create the component**

```typescript
'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { ChevronDown } from 'lucide-react';
import { PortableTextRenderer } from '@/lib/sanity/portable-text';
import { resolveLocaleField, type Locale } from '@/lib/locale/resolve-locale-field';
import type { TourFaqRef } from '@/types/tour';

interface TourFaqsProps {
  faqs: TourFaqRef[];
  locale: Locale;
}

export function TourFaqs({ faqs, locale }: TourFaqsProps) {
  const t = useTranslations('tour');
  const [openId, setOpenId] = useState<string | null>(null);

  if (faqs.length === 0) return null;

  return (
    <section className="relative bg-[#0B0D10] px-[7vw] py-[14vh]">
      <div className="mx-auto max-w-3xl">
        <span className="eyebrow block">{t('faqsEyebrow')}</span>
        <h2 className="headline-subsection mt-6 font-serif text-[#F7F7F5]">{t('faqs')}</h2>

        <div className="mt-12 divide-y divide-[#F7F7F5]/10">
          {faqs.map((faq) => {
            const isOpen = openId === faq._id;
            const question = resolveLocaleField(faq.question, locale) ?? '';
            const answer = resolveLocaleField(faq.answer, locale);
            return (
              <div key={faq._id} className="py-6">
                <button
                  type="button"
                  onClick={() => setOpenId(isOpen ? null : faq._id)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-${faq._id}`}
                  className="flex w-full items-center justify-between gap-6 text-left"
                >
                  <span className="font-serif text-xl font-semibold text-[#F7F7F5]">{question}</span>
                  <ChevronDown
                    size={20}
                    className={`shrink-0 text-[#D4A23A] transition-transform ${isOpen ? 'rotate-180' : ''}`}
                  />
                </button>
                <div
                  id={`faq-${faq._id}`}
                  hidden={!isOpen}
                  className="mt-4 max-w-2xl"
                >
                  {answer ? <PortableTextRenderer value={answer} /> : null}
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

- [ ] **Step 2: Wire into page**

```typescript
import { TourFaqs } from '@/components/tour/tour-faqs';

// after <TourGallery .../>
{tour.faqs && tour.faqs.length > 0 ? (
  <TourFaqs faqs={tour.faqs} locale={locale} />
) : null}
```

- [ ] **Step 3: Typecheck + lint + smoke**

```bash
pnpm typecheck && pnpm lint
```
Click FAQs — only one opens at a time, chevron rotates, answer renders.

- [ ] **Step 4: Commit**

```bash
git add src/components/tour/tour-faqs.tsx src/app/\[locale\]/tours/\[slug\]/page.tsx
git commit -m "feat(tour): add FAQs accordion"
```

---

## Task 16: TourRelated

**Files:** Create: `src/components/tour/tour-related.tsx`

- [ ] **Step 1: Create the component**

```typescript
import { getTranslations } from 'next-intl/server';
import Image from 'next/image';
import { LocaleLink } from '@/components/shared/locale-link';
import { resolveLocaleField, type Locale } from '@/lib/locale/resolve-locale-field';
import { urlFor } from '@/sanity/lib/image';
import type { TourRelatedRef } from '@/types/tour';

interface TourRelatedProps {
  tours: TourRelatedRef[];
  locale: Locale;
}

export async function TourRelated({ tours, locale }: TourRelatedProps) {
  const t = await getTranslations('tour');
  if (tours.length === 0) return null;

  return (
    <section className="relative bg-[#0B0D10] px-[7vw] py-[14vh]">
      <div className="mx-auto max-w-6xl">
        <span className="eyebrow block">{t('relatedEyebrow')}</span>
        <h2 className="headline-subsection mt-6 font-serif text-[#F7F7F5]">{t('related')}</h2>

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
                  {tour.duration} · {tour.difficulty}
                </span>
                <h3 className="font-serif text-2xl font-semibold text-[#F7F7F5]">{title}</h3>
                <p className="line-clamp-2 text-sm text-[#A7ACB4]">{summary}</p>
                <span className="mt-2 font-mono text-xs uppercase tracking-[0.12em] text-[#D4A23A]">
                  {t('viewExpedition')} →
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

- [ ] **Step 2: Wire into page**

```typescript
import { TourRelated } from '@/components/tour/tour-related';

// after <TourFaqs .../>
{tour.relatedTours && tour.relatedTours.length > 0 ? (
  <TourRelated tours={tour.relatedTours} locale={locale} />
) : null}
```

- [ ] **Step 3: Typecheck + lint + smoke**

```bash
pnpm typecheck && pnpm lint
```
Related cards render if the tour has `relatedTours`; hover zooms image; clicking links to that tour.

- [ ] **Step 4: Commit**

```bash
git add src/components/tour/tour-related.tsx src/app/\[locale\]/tours/\[slug\]/page.tsx
git commit -m "feat(tour): add related expeditions strip"
```

---

## Task 17: TourCtaBand

**Files:** Create: `src/components/tour/tour-cta-band.tsx`

- [ ] **Step 1: Create the component**

```typescript
import { getTranslations } from 'next-intl/server';
import { LocaleLink } from '@/components/shared/locale-link';

interface TourCtaBandProps {
  tourSlug: string;
}

export async function TourCtaBand({ tourSlug }: TourCtaBandProps) {
  const t = await getTranslations('tour');
  return (
    <section className="relative bg-[#0B0D10] px-[7vw] py-[18vh]">
      <div className="mx-auto max-w-3xl border-t border-b border-[#D4A23A]/30 py-16 text-center">
        <h2 className="headline-subsection font-serif text-[#F7F7F5]">{t('ctaHeadline')}</h2>
        <p className="mt-6 text-base leading-relaxed text-[#A7ACB4]">{t('ctaBody')}</p>

        <LocaleLink
          href={`/contact?tour=${tourSlug}`}
          className="mt-10 inline-flex items-center gap-3 bg-[#D4A23A] px-10 py-4 font-mono text-xs uppercase tracking-[0.18em] text-[#0B0D10] transition-colors hover:bg-[#F7F7F5]"
        >
          {t('ctaPrimary')}
          <span aria-hidden>→</span>
        </LocaleLink>

        <div className="mt-6">
          <a
            href="#"
            className="font-mono text-xs uppercase tracking-[0.12em] text-[#A7ACB4] transition-colors hover:text-[#D4A23A]"
          >
            {t('ctaSecondary')}
          </a>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Wire into page as the last section before Footer**

```typescript
import { TourCtaBand } from '@/components/tour/tour-cta-band';

// last block before <Footer />
<TourCtaBand tourSlug={tour.slug.current} />
```

- [ ] **Step 3: Typecheck + lint + smoke**

```bash
pnpm typecheck && pnpm lint
```
CTA band appears before footer; Inquire button links to `/contact?tour=<slug>`.

- [ ] **Step 4: Commit**

```bash
git add src/components/tour/tour-cta-band.tsx src/app/\[locale\]/tours/\[slug\]/page.tsx
git commit -m "feat(tour): add closing CTA band"
```

---

## Task 18: Full-page verification

**Files:** None new. Verify end-to-end, fix any regressions discovered.

- [ ] **Step 1: Full static check**

```bash
pnpm typecheck && pnpm lint && pnpm build
```
All three must succeed. Fix any errors surfaced by the production build (these often catch server/client boundary misuse).

- [ ] **Step 2: Manual QA matrix**

Open `pnpm dev` and visit each of the following. For each page, confirm:
1. Hero image loads, title + summary + stat strip + stamp visible
2. Overview portable text renders; destination chips present
3. Itinerary: day nav sticky on desktop, chevrons and accommodation/meals render
4. Pricing: three cards, localized currency, inquire links contain `?tour=&tier=`
5. Included / Excluded lists render with correct icons
6. Gallery opens lightbox, arrow keys navigate, Esc closes
7. FAQs accordion opens/closes, only one at a time
8. Related cards render if the tour has any
9. CTA band button links to `/contact?tour=<slug>`
10. No console errors; no layout break on 375 px wide viewport

Pages to check (one per seeded tour, rotate locales):
- `http://localhost:3000/en/tours/<slug-1>`
- `http://localhost:3000/ko/tours/<slug-2>`
- `http://localhost:3000/mn/tours/<slug-3>`

To list slugs: open Sanity Studio at `/studio` and grab them, or run:
```bash
pnpm exec tsx -e "import('./src/sanity/client').then(async ({ sanityClient }) => { const r = await sanityClient.fetch('*[_type==\"tour\" && defined(slug.current)][].slug.current'); console.log(r); })"
```

- [ ] **Step 3: If any section renders empty on real data**

Check which Sanity field is missing on that document. Either:
- Add the field in Studio and re-test
- Confirm the empty-state fallback (`return null`) is firing as designed

Record any data gaps in `tasks/todo.md` under "Seed data follow-ups" — do NOT patch schemas or seed scripts as part of this plan.

- [ ] **Step 4: Final commit if any fixes were needed**

```bash
git add -A
git commit -m "fix(tour): resolve issues found in full-page verification"
```

(Skip this commit if the QA pass revealed nothing to fix.)

---

## Post-implementation follow-ups (NOT part of this plan)

These are tracked as separate future specs and must not expand this plan:

- Reading `?tour=` and `?tier=` query params on the `/contact` page (spec gap #2 from brainstorm)
- Decorative dashed SVG "route line" derived from `mapRoute` geopoints in the Overview aside (spec mentioned it; Task 10 renders a region list instead as a pragmatic substitute — bring it back when a projection helper is ready)
- Real map rendering from `mapRoute` geopoints (currently no map is shown)
- Actual PDF generation for "Download itinerary"
- Test infrastructure (vitest + Playwright) across the project
- Tours listing page at `/tours/` (still a stub)
- "Best time to visit" calendar built from `seasons`
- `tour.notFound` i18n key — not needed since `notFound()` triggers the existing `not-found.tsx` (spec gap #3 from brainstorm, already removed)
