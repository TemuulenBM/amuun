# Forms & Email Pipeline Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship three lead-capture forms (Contact, Custom Trip, Booking inquiry) through a single shared server-side pipeline with Zod validation, honeypot + Turnstile + email dedupe spam protection, parallel Sanity persistence + Resend dispatch, and full EN/KO/MN i18n.

**Architecture:** Next.js 16 App Router, React Server Components for pages; client components (`"use client"`) for form UX. Shared `processSubmission()` helper runs parse → Zod validate → honeypot → Turnstile verify → dedupe → `Promise.allSettled([sanity.create, resend admin, resend user])`. Forms share a single Sanity `submission` document type with `formType` discriminator and typed `payload`.

**Tech Stack:** Next.js 16.2, React 19, next-intl v4, React Hook Form + Zod, Cloudflare Turnstile (`@marsidev/react-turnstile`), Resend + React Email, Sanity (`next-sanity` + `@sanity/client`), Sonner (toasts), TypeScript.

**Design spec:** [docs/superpowers/specs/2026-04-20-forms-email-pipeline-design.md](../specs/2026-04-20-forms-email-pipeline-design.md)

**Testing posture:** Manual-first per PRD §13. Automated gates per task: `pnpm typecheck && pnpm lint && pnpm build`. No unit/E2E test framework is in scope for this plan; each task ends with a manual verification checklist.

---

## File Structure

### Created

```
src/lib/forms/
  pipeline.ts                # processSubmission() shared helper
  turnstile.ts               # verifyTurnstileToken(token, ip)
  dedupe.ts                  # hasRecentConfirmation(email)
  types.ts                   # ApiResult, FormErrorCode, shared types
src/lib/schemas/
  base.schema.ts             # baseSubmissionSchema (client-side fields)
  contact.schema.ts          # contact-specific
  custom-trip.schema.ts      # custom-trip-specific
  booking.schema.ts          # booking-specific
src/components/forms/
  form-shell.tsx             # <form> wrapper, orchestrates submit
  form-field.tsx             # labeled input/select/textarea primitive
  consent-checkbox.tsx       # required consent w/ privacy+terms links
  turnstile-widget.tsx       # Cloudflare Turnstile client wrapper
  success-card.tsx           # inline success state (stamp + focus)
  contact-form.tsx           # Contact form body
  custom-trip-form.tsx       # Custom Trip form body
  booking-form.tsx           # Booking form body (modal)
  booking-dialog.tsx         # Dialog shell for Booking
src/emails/
  email-shell.tsx            # React Email shared wrapper
  admin-notification.tsx     # admin inbox notification
  user-confirmation.tsx      # submitter-facing confirmation
src/app/api/contact/route.ts
src/app/api/custom-trip/route.ts
src/app/api/booking/route.ts
```

### Modified

```
src/lib/env.ts                                         # add Turnstile env vars
src/sanity/schemas/documents/submission.ts             # full rewrite to spec shape
src/sanity/structure.ts                                # Submissions filtered desk
src/sanity/lib/queries.ts                              # recentSubmissionsByEmailQuery
src/app/[locale]/contact/page.tsx                      # stub → full page
src/app/[locale]/custom-trip/page.tsx                  # stub → full page
src/app/[locale]/tours/[slug]/page.tsx                 # integrate BookingDialog
messages/en.json                                       # add forms.* namespace
messages/ko.json                                       # add forms.* namespace
messages/mn.json                                       # add forms.* namespace
package.json                                           # +react-email deps, +turnstile
```

---

## Task 1: Prerequisites — Install dependencies & env scaffolding

**Files:**
- Modify: `package.json`
- Modify: `src/lib/env.ts`
- Create: `.env.local.example`

- [ ] **Step 1: Install runtime deps**

Run:

```bash
pnpm add react-email @react-email/render @marsidev/react-turnstile
```

Expected: `package.json` gains all three entries under `dependencies`. Lockfile updates.

- [ ] **Step 2: Install dev dep for email preview**

Run:

```bash
pnpm add -D react-email
```

Expected: `react-email` appears under `devDependencies`. Provides `pnpm email dev` preview server.

- [ ] **Step 3: Add email preview script to package.json**

Modify `package.json` `scripts` block — add:

```json
"email": "email dev --dir src/emails --port 3200"
```

- [ ] **Step 4: Extend env validator**

Replace the contents of `src/lib/env.ts`:

```ts
import { z } from 'zod';

const envSchema = z.object({
  NEXT_PUBLIC_SANITY_PROJECT_ID: z.string().min(1).optional(),
  NEXT_PUBLIC_SANITY_DATASET: z.string().default('production'),
  NEXT_PUBLIC_SANITY_API_VERSION: z.string().default('2026-04-17'),
  SANITY_API_WRITE_TOKEN: z.string().optional(),
  SANITY_REVALIDATE_SECRET: z.string().min(16).optional(),
  RESEND_API_KEY: z.string().optional(),
  CONTACT_EMAIL_FROM: z.string().email().optional(),
  CONTACT_EMAIL_TO: z.string().email().optional(),
  NEXT_PUBLIC_TURNSTILE_SITE_KEY: z.string().optional(),
  TURNSTILE_SECRET_KEY: z.string().optional(),
  NEXT_PUBLIC_SITE_URL: z.string().url().default('http://localhost:3000'),
  NEXT_PUBLIC_SITE_NAME: z.string().default('Amuun'),
});

export type Env = z.infer<typeof envSchema>;

let cached: Env | undefined;

export function getEnv(): Env {
  if (!cached) cached = envSchema.parse(process.env);
  return cached;
}
```

- [ ] **Step 5: Create `.env.local.example`**

Create `.env.local.example`:

```
NEXT_PUBLIC_SANITY_PROJECT_ID=
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2026-04-17
SANITY_API_WRITE_TOKEN=
SANITY_REVALIDATE_SECRET=

RESEND_API_KEY=
CONTACT_EMAIL_FROM=hello@amuun.voidex.studio
CONTACT_EMAIL_TO=inquiries@voidex.studio

NEXT_PUBLIC_TURNSTILE_SITE_KEY=
TURNSTILE_SECRET_KEY=

NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SITE_NAME=Amuun
```

- [ ] **Step 6: Verify typecheck + build still green**

Run: `pnpm typecheck && pnpm build`
Expected: PASS on both. No type errors introduced.

- [ ] **Step 7: Commit**

```bash
git add package.json pnpm-lock.yaml src/lib/env.ts .env.local.example
git commit -m "chore(forms): install form/email deps and extend env validator"
```

---

## Task 2: Sanity submission schema — rewrite to spec shape

**Files:**
- Modify: `src/sanity/schemas/documents/submission.ts`
- Modify: `src/sanity/lib/queries.ts`

The existing schema has a flat shape (`interest`, `tourSlug`, `metadata` as JSON text). Replace with `payload` + `meta` objects, add `consent*` + `locale` fields, apply `readOnly: true` to submitter fields only (keep `status` editable).

- [ ] **Step 1: Replace submission schema**

Replace all contents of `src/sanity/schemas/documents/submission.ts`:

```ts
import { defineField, defineType } from 'sanity';

export const submission = defineType({
  name: 'submission',
  title: 'Form submission',
  type: 'document',
  fields: [
    defineField({
      name: 'formType',
      title: 'Form type',
      type: 'string',
      readOnly: true,
      options: {
        list: [
          { title: 'Contact', value: 'contact' },
          { title: 'Custom trip', value: 'customTrip' },
          { title: 'Booking inquiry', value: 'booking' },
        ],
      },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { title: 'New', value: 'new' },
          { title: 'Responded', value: 'responded' },
          { title: 'Archived', value: 'archived' },
        ],
      },
      initialValue: 'new',
    }),
    // Submitter fields — read-only audit record
    defineField({ name: 'name', title: 'Name', type: 'string', readOnly: true }),
    defineField({ name: 'email', title: 'Email', type: 'string', readOnly: true }),
    defineField({ name: 'phone', title: 'Phone', type: 'string', readOnly: true }),
    defineField({ name: 'message', title: 'Message', type: 'text', rows: 6, readOnly: true }),
    defineField({
      name: 'locale',
      title: 'Locale',
      type: 'string',
      readOnly: true,
      options: { list: ['en', 'ko', 'mn'] },
    }),
    defineField({
      name: 'consentAccepted',
      title: 'Consent accepted',
      type: 'boolean',
      readOnly: true,
    }),
    defineField({
      name: 'consentedAt',
      title: 'Consented at',
      type: 'datetime',
      readOnly: true,
    }),
    defineField({
      name: 'payload',
      title: 'Form payload',
      type: 'object',
      readOnly: true,
      fields: [
        // contact
        defineField({ name: 'subject', type: 'string' }),
        // custom trip
        defineField({ name: 'partySize', type: 'number' }),
        defineField({ name: 'travelStartDate', type: 'date' }),
        defineField({ name: 'travelEndDate', type: 'date' }),
        defineField({ name: 'interests', type: 'array', of: [{ type: 'string' }] }),
        defineField({ name: 'budgetRange', type: 'string' }),
        // booking
        defineField({ name: 'tourSlug', type: 'string' }),
        defineField({ name: 'tourTitle', type: 'string' }),
        defineField({ name: 'preferredStartDate', type: 'date' }),
        defineField({ name: 'adults', type: 'number' }),
        defineField({ name: 'children', type: 'number' }),
        defineField({ name: 'tier', type: 'string' }),
        defineField({ name: 'specialRequests', type: 'text', rows: 3 }),
      ],
    }),
    defineField({
      name: 'meta',
      title: 'Request metadata',
      type: 'object',
      readOnly: true,
      fields: [
        defineField({ name: 'ip', type: 'string' }),
        defineField({ name: 'userAgent', type: 'string' }),
        defineField({ name: 'referrer', type: 'string' }),
        defineField({ name: 'submittedAt', type: 'datetime' }),
      ],
    }),
  ],
  orderings: [
    {
      title: 'Newest',
      name: 'newest',
      by: [{ field: '_createdAt', direction: 'desc' }],
    },
  ],
  preview: {
    select: {
      name: 'name',
      email: 'email',
      formType: 'formType',
      status: 'status',
      submittedAt: 'meta.submittedAt',
    },
    prepare: ({ name, email, formType, status, submittedAt }) => ({
      title: `${name ?? email ?? '(anonymous)'} · ${formType ?? 'unknown'}`,
      subtitle: email ?? '',
      description: `${status ?? 'new'} · ${submittedAt ? submittedAt.slice(0, 16).replace('T', ' ') : ''}`,
    }),
  },
});
```

- [ ] **Step 2: Add dedupe query**

Modify `src/sanity/lib/queries.ts` — append to the end of the file:

```ts
export const recentSubmissionsByEmailQuery = /* groq */ `
  count(*[_type == "submission" && email == $email && _createdAt > $tenMinAgo])
`;
```

- [ ] **Step 3: Typecheck**

Run: `pnpm typecheck`
Expected: PASS.

- [ ] **Step 4: Commit**

```bash
git add src/sanity/schemas/documents/submission.ts src/sanity/lib/queries.ts
git commit -m "feat(sanity): rewrite submission schema with payload/meta and readOnly submitter fields"
```

---

## Task 3: Sanity Studio desk structure — filtered Submissions views

**Files:**
- Modify: `src/sanity/structure.ts`

- [ ] **Step 1: Replace structure resolver**

Replace all contents of `src/sanity/structure.ts`:

```ts
import type { StructureResolver } from 'sanity/structure';

import { singletonTypes } from './schemas';

const listableContentTypes = [
  'tour',
  'destination',
  'blogPost',
  'testimonial',
  'teamMember',
  'faq',
  'legalPage',
] as const;

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      S.listItem()
        .title('Site settings')
        .id('siteSettings')
        .child(S.document().schemaType('siteSettings').documentId('siteSettings')),
      S.divider(),
      ...listableContentTypes.map((typeName) =>
        S.listItem()
          .title(labelFor(typeName))
          .schemaType(typeName)
          .child(S.documentTypeList(typeName).title(labelFor(typeName))),
      ),
      S.divider(),
      S.listItem()
        .title('Submissions')
        .child(
          S.list()
            .title('Submissions')
            .items([
              S.listItem()
                .title('All')
                .child(S.documentTypeList('submission').title('All submissions')),
              S.listItem()
                .title('Contact')
                .child(
                  S.documentTypeList('submission')
                    .title('Contact')
                    .filter('_type == "submission" && formType == "contact"'),
                ),
              S.listItem()
                .title('Custom Trip')
                .child(
                  S.documentTypeList('submission')
                    .title('Custom Trip')
                    .filter('_type == "submission" && formType == "customTrip"'),
                ),
              S.listItem()
                .title('Booking')
                .child(
                  S.documentTypeList('submission')
                    .title('Booking')
                    .filter('_type == "submission" && formType == "booking"'),
                ),
              S.divider(),
              S.listItem()
                .title('Archived')
                .child(
                  S.documentTypeList('submission')
                    .title('Archived')
                    .filter('_type == "submission" && status == "archived"'),
                ),
            ]),
        ),
    ]);

function labelFor(typeName: string): string {
  switch (typeName) {
    case 'tour':
      return 'Tours';
    case 'destination':
      return 'Destinations';
    case 'blogPost':
      return 'Journal articles';
    case 'testimonial':
      return 'Testimonials';
    case 'teamMember':
      return 'Team members';
    case 'faq':
      return 'FAQs';
    case 'legalPage':
      return 'Legal pages';
    default:
      return typeName;
  }
}

export { singletonTypes };
```

- [ ] **Step 2: Typecheck + build**

Run: `pnpm typecheck && pnpm build`
Expected: PASS. Studio builds without errors.

- [ ] **Step 3: Commit**

```bash
git add src/sanity/structure.ts
git commit -m "feat(sanity): filtered Submissions desk with All/Contact/CustomTrip/Booking/Archived"
```

---

## Task 4: Zod schemas — base + per-form

**Files:**
- Create: `src/lib/schemas/base.schema.ts`
- Create: `src/lib/schemas/contact.schema.ts`
- Create: `src/lib/schemas/custom-trip.schema.ts`
- Create: `src/lib/schemas/booking.schema.ts`

- [ ] **Step 1: Create base schema**

Create `src/lib/schemas/base.schema.ts`:

```ts
import { z } from 'zod';

export const localeEnum = z.enum(['en', 'ko', 'mn']);

export const baseSubmissionSchema = z.object({
  name: z.string().trim().min(2, 'minLength').max(100, 'maxLength'),
  email: z.string().trim().email('email').max(254, 'maxLength'),
  phone: z
    .string()
    .trim()
    .min(7, 'minLength')
    .max(30, 'maxLength')
    .optional()
    .or(z.literal('')),
  message: z.string().trim().min(10, 'minLength').max(2000, 'maxLength'),
  locale: localeEnum,
  consentAccepted: z.literal(true, { message: 'consent' }),
  honeypot: z.literal('', { message: 'honeypot' }),
  turnstileToken: z.string().min(1, 'turnstile'),
});

export type BaseSubmissionInput = z.infer<typeof baseSubmissionSchema>;
```

- [ ] **Step 2: Create contact schema**

Create `src/lib/schemas/contact.schema.ts`:

```ts
import { z } from 'zod';
import { baseSubmissionSchema } from './base.schema';

export const contactSubjectEnum = z.enum([
  'general',
  'press',
  'partnership',
  'other',
]);

export const contactSchema = baseSubmissionSchema.extend({
  formType: z.literal('contact'),
  subject: contactSubjectEnum.optional(),
});

export type ContactInput = z.infer<typeof contactSchema>;
```

- [ ] **Step 3: Create custom-trip schema**

Create `src/lib/schemas/custom-trip.schema.ts`:

```ts
import { z } from 'zod';
import { baseSubmissionSchema } from './base.schema';

export const interestEnum = z.enum(['culture', 'nature', 'adventure', 'food']);
export const budgetEnum = z.enum([
  'under-3k',
  '3k-5k',
  '5k-10k',
  '10k-plus',
]);

const MS_PER_DAY = 1000 * 60 * 60 * 24;
const MIN_ADVANCE_DAYS = 7;
const MAX_DURATION_DAYS = 60;

function diffDays(later: Date, earlier: Date): number {
  return Math.floor((later.getTime() - earlier.getTime()) / MS_PER_DAY);
}

export const customTripSchema = baseSubmissionSchema
  .extend({
    formType: z.literal('customTrip'),
    partySize: z.coerce.number().int().min(1, 'partySize').max(20, 'partySize'),
    travelStartDate: z.coerce.date(),
    travelEndDate: z.coerce.date(),
    interests: z
      .array(interestEnum)
      .min(1, 'minLength')
      .max(4, 'maxLength'),
    budgetRange: budgetEnum,
  })
  .refine(
    (data) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return diffDays(data.travelStartDate, today) >= MIN_ADVANCE_DAYS;
    },
    { message: 'dateTooSoon', path: ['travelStartDate'] },
  )
  .refine((data) => data.travelEndDate > data.travelStartDate, {
    message: 'dateRange',
    path: ['travelEndDate'],
  })
  .refine(
    (data) => diffDays(data.travelEndDate, data.travelStartDate) <= MAX_DURATION_DAYS,
    { message: 'dateRange', path: ['travelEndDate'] },
  );

export type CustomTripInput = z.infer<typeof customTripSchema>;
```

- [ ] **Step 4: Create booking schema**

Create `src/lib/schemas/booking.schema.ts`:

```ts
import { z } from 'zod';
import { baseSubmissionSchema } from './base.schema';

export const bookingTierEnum = z.enum(['standard', 'deluxe', 'private']);

export const bookingSchema = baseSubmissionSchema
  .extend({
    formType: z.literal('booking'),
    tourSlug: z.string().trim().min(1, 'required'),
    tourTitle: z.string().trim().min(1, 'required'),
    preferredStartDate: z.coerce.date(),
    adults: z.coerce.number().int().min(1, 'partySize').max(20, 'partySize'),
    children: z.coerce.number().int().min(0, 'partySize').max(20, 'partySize'),
    tier: bookingTierEnum,
    specialRequests: z
      .string()
      .trim()
      .max(1000, 'maxLength')
      .optional()
      .or(z.literal('')),
  })
  .refine(
    (data) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return data.preferredStartDate.getTime() >= today.getTime();
    },
    { message: 'dateTooSoon', path: ['preferredStartDate'] },
  );

export type BookingInput = z.infer<typeof bookingSchema>;
```

- [ ] **Step 5: Typecheck**

Run: `pnpm typecheck`
Expected: PASS. No type errors.

- [ ] **Step 6: Commit**

```bash
git add src/lib/schemas/
git commit -m "feat(forms): add Zod schemas for base + contact + custom-trip + booking"
```

---

## Task 5: Shared types & utilities — Turnstile verifier + dedupe

**Files:**
- Create: `src/lib/forms/types.ts`
- Create: `src/lib/forms/turnstile.ts`
- Create: `src/lib/forms/dedupe.ts`

- [ ] **Step 1: Create shared types**

Create `src/lib/forms/types.ts`:

```ts
export type FormType = 'contact' | 'customTrip' | 'booking';

export type FormErrorCode =
  | 'INVALID_JSON'
  | 'VALIDATION'
  | 'TURNSTILE_FAILED'
  | 'HONEYPOT_TRIPPED'
  | 'SERVICE_UNAVAILABLE';

export interface ApiSuccess {
  ok: true;
  submissionId: string;
  emailWarning?: boolean;
}

export interface ApiValidationError {
  ok: false;
  error: 'VALIDATION';
  fields: Record<string, string>;
}

export interface ApiError {
  ok: false;
  error: Exclude<FormErrorCode, 'VALIDATION'>;
}

export type ApiResult = ApiSuccess | ApiValidationError | ApiError;

export interface RequestMeta {
  ip: string;
  userAgent: string;
  referrer?: string;
  submittedAt: string; // ISO 8601
}
```

- [ ] **Step 2: Create Turnstile verifier**

Create `src/lib/forms/turnstile.ts`:

```ts
import { getEnv } from '@/lib/env';

const TURNSTILE_VERIFY_URL =
  'https://challenges.cloudflare.com/turnstile/v0/siteverify';

interface TurnstileResponse {
  success: boolean;
  'error-codes'?: string[];
}

export async function verifyTurnstileToken(
  token: string,
  remoteIp: string | undefined,
): Promise<boolean> {
  const { TURNSTILE_SECRET_KEY } = getEnv();
  if (!TURNSTILE_SECRET_KEY) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('[forms/turnstile] TURNSTILE_SECRET_KEY not set; skipping verification in development');
      return true;
    }
    return false;
  }

  const body = new URLSearchParams({
    secret: TURNSTILE_SECRET_KEY,
    response: token,
  });
  if (remoteIp) body.set('remoteip', remoteIp);

  try {
    const res = await fetch(TURNSTILE_VERIFY_URL, { method: 'POST', body });
    if (!res.ok) return false;
    const data = (await res.json()) as TurnstileResponse;
    return data.success === true;
  } catch (error: unknown) {
    console.error('[forms/turnstile] verify failed', {
      message: error instanceof Error ? error.message : 'unknown',
    });
    return false;
  }
}
```

- [ ] **Step 3: Create dedupe helper**

Create `src/lib/forms/dedupe.ts`:

```ts
import { sanityClient } from '@/sanity/client';
import { recentSubmissionsByEmailQuery } from '@/sanity/lib/queries';

const DEDUPE_WINDOW_MS = 10 * 60 * 1000;

export async function hasRecentConfirmation(email: string): Promise<boolean> {
  try {
    const tenMinAgo = new Date(Date.now() - DEDUPE_WINDOW_MS).toISOString();
    const count = await sanityClient.fetch<number>(
      recentSubmissionsByEmailQuery,
      { email, tenMinAgo },
    );
    return typeof count === 'number' && count > 0;
  } catch (error: unknown) {
    console.warn('[forms/dedupe] lookup failed, defaulting to allow', {
      message: error instanceof Error ? error.message : 'unknown',
    });
    return false;
  }
}
```

- [ ] **Step 4: Typecheck**

Run: `pnpm typecheck`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib/forms/
git commit -m "feat(forms): add types, Turnstile verifier, dedupe helper"
```

---

## Task 6: Shared API pipeline — `processSubmission()`

**Files:**
- Create: `src/lib/forms/pipeline.ts`
- Modify: `src/sanity/client.ts` (add write client)

- [ ] **Step 1: Add write-capable Sanity client**

Replace contents of `src/sanity/client.ts`:

```ts
import { createClient } from 'next-sanity';
import { apiVersion, dataset, projectId, useCdn } from './env';

export const sanityClient = createClient({ projectId, dataset, apiVersion, useCdn });

export const sanityWriteClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN,
});
```

- [ ] **Step 2: Create pipeline**

Create `src/lib/forms/pipeline.ts`:

```ts
import { NextResponse, type NextRequest } from 'next/server';
import { type ReactElement } from 'react';
import { render } from '@react-email/render';
import { Resend } from 'resend';
import type { ZodError, ZodType } from 'zod';

import { getEnv } from '@/lib/env';
import { sanityWriteClient } from '@/sanity/client';

import { hasRecentConfirmation } from './dedupe';
import { verifyTurnstileToken } from './turnstile';
import type { ApiResult, FormType, RequestMeta } from './types';

interface BaseFields {
  email: string;
  honeypot: string;
  turnstileToken: string;
  locale: 'en' | 'ko' | 'mn';
}

interface ProcessOptions<T extends BaseFields> {
  request: NextRequest;
  formType: FormType;
  schema: ZodType<T>;
  buildSanityPayload: (data: T) => Record<string, unknown>;
  buildAdminEmail: (args: {
    data: T;
    submissionId: string;
  }) => ReactElement;
  buildUserEmail: (args: {
    data: T;
    submissionId: string;
  }) => ReactElement;
  adminSubject: (data: T) => string;
  userSubject: (data: T) => string;
}

function zodErrorToFieldMap(error: ZodError): Record<string, string> {
  const fields: Record<string, string> = {};
  for (const issue of error.issues) {
    const path = issue.path.join('.');
    if (path && !fields[path]) fields[path] = issue.message;
  }
  return fields;
}

function clientIp(request: NextRequest): string {
  const fwd = request.headers.get('x-forwarded-for');
  if (fwd) return fwd.split(',')[0]!.trim();
  return request.headers.get('x-real-ip') ?? '';
}

function buildMeta(request: NextRequest): RequestMeta {
  return {
    ip: clientIp(request),
    userAgent: request.headers.get('user-agent') ?? '',
    referrer: request.headers.get('referer') ?? undefined,
    submittedAt: new Date().toISOString(),
  };
}

export async function processSubmission<T extends BaseFields>(
  opts: ProcessOptions<T>,
): Promise<NextResponse<ApiResult>> {
  const { request, formType, schema } = opts;
  const env = getEnv();

  // Same-origin guard
  const origin = request.headers.get('origin');
  const host = request.headers.get('host');
  if (origin && host && !origin.endsWith(host)) {
    return NextResponse.json(
      { ok: false, error: 'SERVICE_UNAVAILABLE' },
      { status: 403 },
    );
  }

  // 1. JSON parse
  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: 'INVALID_JSON' },
      { status: 400 },
    );
  }

  // 2. Zod validate
  const parsed = schema.safeParse(raw);
  if (!parsed.success) {
    const fields = zodErrorToFieldMap(parsed.error);
    // Honeypot is a field error but we prefer silent 200
    if (fields.honeypot) {
      console.warn(`[api/${formType}] honeypot tripped`);
      return NextResponse.json(
        { ok: true, submissionId: 'skipped' },
        { status: 200 },
      );
    }
    return NextResponse.json(
      { ok: false, error: 'VALIDATION', fields },
      { status: 400 },
    );
  }

  const data = parsed.data;

  // 3. Honeypot explicit (defence in depth)
  if (data.honeypot !== '') {
    console.warn(`[api/${formType}] honeypot tripped`);
    return NextResponse.json(
      { ok: true, submissionId: 'skipped' },
      { status: 200 },
    );
  }

  // 4. Turnstile verify
  const ip = clientIp(request);
  const turnstileOk = await verifyTurnstileToken(data.turnstileToken, ip);
  if (!turnstileOk) {
    console.warn(`[api/${formType}] turnstile failed`, { ip });
    return NextResponse.json(
      { ok: false, error: 'TURNSTILE_FAILED' },
      { status: 403 },
    );
  }

  // 5. Dedupe
  const skipUserEmail = await hasRecentConfirmation(data.email);

  // 6. Parallel persist
  const meta = buildMeta(request);
  const sanityDoc = {
    _type: 'submission',
    formType,
    status: 'new',
    name: (data as unknown as { name: string }).name,
    email: data.email,
    phone: (data as unknown as { phone?: string }).phone || undefined,
    message: (data as unknown as { message: string }).message,
    locale: data.locale,
    consentAccepted: true,
    consentedAt: meta.submittedAt,
    payload: opts.buildSanityPayload(data),
    meta,
  };

  const resend = env.RESEND_API_KEY ? new Resend(env.RESEND_API_KEY) : null;
  const fromAddr = env.CONTACT_EMAIL_FROM ?? 'onboarding@resend.dev';
  const adminTo = env.CONTACT_EMAIL_TO;

  const sanityP = sanityWriteClient.create(sanityDoc);

  const adminP =
    resend && adminTo
      ? (async () => {
          const html = await render(opts.buildAdminEmail({ data, submissionId: 'pending' }));
          return resend.emails.send({
            from: fromAddr,
            to: adminTo,
            replyTo: data.email,
            subject: opts.adminSubject(data),
            html,
          });
        })()
      : Promise.resolve({ skipped: true as const });

  const userP =
    resend && !skipUserEmail
      ? (async () => {
          const html = await render(opts.buildUserEmail({ data, submissionId: 'pending' }));
          return resend.emails.send({
            from: fromAddr,
            to: data.email,
            subject: opts.userSubject(data),
            html,
          });
        })()
      : Promise.resolve({ skipped: true as const });

  const [sanityRes, adminRes, userRes] = await Promise.allSettled([
    sanityP,
    adminP,
    userP,
  ]);

  // 7. Response
  if (sanityRes.status === 'rejected') {
    console.error(`[api/${formType}] sanity write failed`, {
      ip,
      message:
        sanityRes.reason instanceof Error
          ? sanityRes.reason.message
          : 'unknown',
    });
    return NextResponse.json(
      { ok: false, error: 'SERVICE_UNAVAILABLE' },
      { status: 500 },
    );
  }

  const submissionId = (sanityRes.value as { _id: string })._id;
  const adminFailed = adminRes.status === 'rejected';
  const userFailed = userRes.status === 'rejected';
  const emailWarning = adminFailed || userFailed;

  if (emailWarning) {
    console.warn(`[api/${formType}] email partial failure`, {
      submissionId,
      adminFailed,
      userFailed,
    });
  }

  return NextResponse.json(
    {
      ok: true,
      submissionId,
      ...(emailWarning ? { emailWarning: true } : {}),
    },
    { status: 200 },
  );
}
```

- [ ] **Step 3: Typecheck + build**

Run: `pnpm typecheck && pnpm build`
Expected: PASS. The pipeline compiles even without keys set — route handlers are created but the functions guard on missing env.

- [ ] **Step 4: Commit**

```bash
git add src/lib/forms/pipeline.ts src/sanity/client.ts
git commit -m "feat(forms): shared processSubmission pipeline with parallel Sanity+Resend"
```

---

## Task 7: React Email shell + templates

**Files:**
- Create: `src/emails/email-shell.tsx`
- Create: `src/emails/admin-notification.tsx`
- Create: `src/emails/user-confirmation.tsx`

- [ ] **Step 1: Create email shell**

Create `src/emails/email-shell.tsx`:

```tsx
import {
  Body,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Preview,
  Section,
  Text,
} from 'react-email';
import type { ReactNode } from 'react';

interface EmailShellProps {
  preview: string;
  children: ReactNode;
}

const bodyStyle = {
  backgroundColor: '#F4F1EA',
  fontFamily:
    "'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif",
  margin: 0,
  padding: 0,
};

const containerStyle = {
  backgroundColor: '#F4F1EA',
  maxWidth: '600px',
  margin: '0 auto',
  padding: '32px 24px',
};

const brandStyle = {
  color: '#0B0D10',
  fontFamily: "'Cormorant Garamond', Georgia, serif",
  fontSize: '28px',
  letterSpacing: '0.08em',
  textAlign: 'center' as const,
  margin: '0 0 24px 0',
};

const footerStyle = {
  color: '#6B6E73',
  fontSize: '12px',
  lineHeight: '1.6',
  textAlign: 'center' as const,
  margin: '32px 0 0 0',
};

const dividerStyle = {
  borderColor: '#D4A23A',
  borderWidth: '1px',
  margin: '32px 0',
};

export function EmailShell({ preview, children }: EmailShellProps) {
  return (
    <Html>
      <Head />
      <Preview>{preview}</Preview>
      <Body style={bodyStyle}>
        <Container style={containerStyle}>
          <Text style={brandStyle}>AMUUN</Text>
          <Section>{children}</Section>
          <Hr style={dividerStyle} />
          <Text style={footerStyle}>
            Amuun · Private expeditions across Mongolia
            <br />
            hello@amuun.voidex.studio
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
```

- [ ] **Step 2: Create admin notification**

Create `src/emails/admin-notification.tsx`:

```tsx
import { Heading, Hr, Section, Text } from 'react-email';
import { EmailShell } from './email-shell';

type FormType = 'contact' | 'customTrip' | 'booking';

interface AdminNotificationProps {
  formType: FormType;
  name: string;
  email: string;
  phone?: string;
  message: string;
  locale: 'en' | 'ko' | 'mn';
  payload: Record<string, unknown>;
  submittedAt: string;
  sanityStudioUrl?: string;
}

const headingStyle = {
  color: '#0B0D10',
  fontFamily: "'Cormorant Garamond', Georgia, serif",
  fontSize: '22px',
  margin: '0 0 16px 0',
};

const labelStyle = {
  color: '#6B6E73',
  fontSize: '11px',
  letterSpacing: '0.08em',
  textTransform: 'uppercase' as const,
  margin: '16px 0 4px 0',
};

const valueStyle = {
  color: '#0B0D10',
  fontSize: '14px',
  lineHeight: '1.6',
  margin: 0,
  whiteSpace: 'pre-wrap' as const,
};

function formTypeLabel(formType: FormType): string {
  switch (formType) {
    case 'contact':
      return 'Contact inquiry';
    case 'customTrip':
      return 'Custom trip request';
    case 'booking':
      return 'Booking inquiry';
  }
}

export function AdminNotification(props: AdminNotificationProps) {
  const {
    formType,
    name,
    email,
    phone,
    message,
    locale,
    payload,
    submittedAt,
    sanityStudioUrl,
  } = props;
  return (
    <EmailShell preview={`[${formType}] New inquiry from ${name}`}>
      <Heading style={headingStyle}>{formTypeLabel(formType)}</Heading>
      <Text style={labelStyle}>Name</Text>
      <Text style={valueStyle}>{name}</Text>
      <Text style={labelStyle}>Email</Text>
      <Text style={valueStyle}>{email}</Text>
      {phone ? (
        <>
          <Text style={labelStyle}>Phone</Text>
          <Text style={valueStyle}>{phone}</Text>
        </>
      ) : null}
      <Text style={labelStyle}>Message</Text>
      <Text style={valueStyle}>{message}</Text>
      <Hr style={{ borderColor: '#E5E2DA', margin: '24px 0' }} />
      <Text style={labelStyle}>Locale</Text>
      <Text style={valueStyle}>{locale}</Text>
      <Text style={labelStyle}>Submitted</Text>
      <Text style={valueStyle}>{submittedAt}</Text>
      <Text style={labelStyle}>Payload</Text>
      <Text style={valueStyle}>
        {JSON.stringify(payload, null, 2)}
      </Text>
      {sanityStudioUrl ? (
        <Section style={{ marginTop: '24px' }}>
          <Text style={valueStyle}>
            Open in Studio:{' '}
            <a href={sanityStudioUrl} style={{ color: '#D4A23A' }}>
              {sanityStudioUrl}
            </a>
          </Text>
        </Section>
      ) : null}
    </EmailShell>
  );
}
```

- [ ] **Step 3: Create user confirmation**

Create `src/emails/user-confirmation.tsx`:

```tsx
import { Heading, Text } from 'react-email';
import { EmailShell } from './email-shell';

type Locale = 'en' | 'ko' | 'mn';
type FormType = 'contact' | 'customTrip' | 'booking';

interface UserConfirmationProps {
  formType: FormType;
  name: string;
  locale: Locale;
  tourTitle?: string;
}

const headingStyle = {
  color: '#0B0D10',
  fontFamily: "'Cormorant Garamond', Georgia, serif",
  fontSize: '26px',
  margin: '0 0 16px 0',
};

const paragraphStyle = {
  color: '#0B0D10',
  fontSize: '15px',
  lineHeight: '1.7',
  margin: '0 0 16px 0',
};

interface Copy {
  title: string;
  greeting: (name: string) => string;
  lede: string;
  followup: string;
  signoff: string;
  bookingNote?: (tourTitle: string) => string;
}

const copy: Record<Locale, Copy> = {
  en: {
    title: 'Your inquiry has reached us',
    greeting: (n) => `Dear ${n},`,
    lede: 'Thank you for reaching out to Amuun. We have received your message and a member of our expedition team will respond within 24 hours.',
    followup:
      'If your inquiry is time-sensitive, please reply directly to this email — it goes straight to our inbox.',
    signoff: 'Warmly,\nThe Amuun team',
    bookingNote: (t) =>
      `We have noted your interest in "${t}". Expect a detailed itinerary, pricing breakdown, and availability in our reply.`,
  },
  ko: {
    title: '문의가 도착했습니다',
    greeting: (n) => `${n} 님께,`,
    lede: 'Amuun에 연락주셔서 감사합니다. 귀하의 메시지를 잘 받았으며, 24시간 이내에 저희 원정 팀의 담당자가 답변드리겠습니다.',
    followup:
      '긴급하신 경우 이 이메일에 바로 회신하시면 저희 팀의 받은편지함으로 전달됩니다.',
    signoff: '감사합니다.\nAmuun 팀 드림',
    bookingNote: (t) =>
      `"${t}" 탐험에 관심 주셔서 감사합니다. 자세한 일정, 가격 안내, 가용 일정을 회신에 담아 전해드리겠습니다.`,
  },
  mn: {
    title: 'Таны хүсэлт хүрсэн байна',
    greeting: (n) => `Эрхэм ${n},`,
    lede: 'Amuun-д хандсан танд баярлалаа. Бид таны мессежийг хүлээн авсан бөгөөд манай экспедицийн багийн гишүүн 24 цагийн дотор хариу өгнө.',
    followup:
      'Хэрэв яаралтай асуудал байвал энэ имэйлд шууд хариу бичнэ үү — биднийх рүү шууд очно.',
    signoff: 'Хүндэтгэсэн,\nAmuun-ийн баг',
    bookingNote: (t) =>
      `"${t}" аялалд сонирхолтой байгаад баярлалаа. Нарийвчилсан хөтөлбөр, үнийн задаргаа, сул ордон бүхий хариу өгнө.`,
  },
};

export function UserConfirmation({
  formType,
  name,
  locale,
  tourTitle,
}: UserConfirmationProps) {
  const c = copy[locale];
  return (
    <EmailShell preview={c.title}>
      <Heading style={headingStyle}>{c.title}</Heading>
      <Text style={paragraphStyle}>{c.greeting(name)}</Text>
      <Text style={paragraphStyle}>{c.lede}</Text>
      {formType === 'booking' && tourTitle && c.bookingNote ? (
        <Text style={paragraphStyle}>{c.bookingNote(tourTitle)}</Text>
      ) : null}
      <Text style={paragraphStyle}>{c.followup}</Text>
      <Text style={paragraphStyle}>{c.signoff}</Text>
    </EmailShell>
  );
}
```

- [ ] **Step 4: Typecheck + build**

Run: `pnpm typecheck && pnpm build`
Expected: PASS. React Email templates compile.

- [ ] **Step 5: Manually preview emails (optional but recommended)**

Run: `pnpm email`

Expected: Opens a preview server at `http://localhost:3200`. Inspect `admin-notification` and `user-confirmation` with sample data. Confirm: cream background, navy text, serif heading, gold divider, Korean/Mongolian glyphs render correctly.

Stop server with Ctrl+C.

- [ ] **Step 6: Commit**

```bash
git add src/emails/
git commit -m "feat(emails): add shared shell, admin notification, user confirmation with i18n"
```

---

## Task 8: Form primitives — FormShell, FormField, ConsentCheckbox, TurnstileWidget, SuccessCard

**Files:**
- Create: `src/components/forms/form-field.tsx`
- Create: `src/components/forms/consent-checkbox.tsx`
- Create: `src/components/forms/turnstile-widget.tsx`
- Create: `src/components/forms/success-card.tsx`
- Create: `src/components/forms/form-shell.tsx`

- [ ] **Step 1: Create FormField**

Create `src/components/forms/form-field.tsx`:

```tsx
'use client';

import { type ReactNode, type InputHTMLAttributes, forwardRef } from 'react';

interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  hint?: string;
  as?: 'input' | 'textarea' | 'select';
  children?: ReactNode;
  rows?: number;
}

const labelCls =
  'mb-2 block font-mono text-[11px] uppercase tracking-[0.18em] text-[#0B0D10]/70';
const inputCls =
  'w-full rounded-none border border-[#0B0D10]/30 bg-[#F4F1EA] px-4 py-3 font-sans text-[15px] text-[#0B0D10] outline-none transition focus:border-[#D4A23A] focus:ring-2 focus:ring-[#D4A23A]/40';
const inputErrorCls =
  'border-red-600 focus:border-red-600 focus:ring-red-600/40';
const errorCls = 'mt-1 text-[12px] text-red-700';
const hintCls = 'mt-1 text-[12px] text-[#0B0D10]/60';

export const FormField = forwardRef<HTMLInputElement, FormFieldProps>(
  function FormField(
    { label, error, hint, as = 'input', id, name, children, rows, ...rest },
    ref,
  ) {
    const fieldId = id ?? name;
    const errorId = error ? `${fieldId}-error` : undefined;
    const hintId = hint ? `${fieldId}-hint` : undefined;
    const describedBy = [errorId, hintId].filter(Boolean).join(' ') || undefined;
    const commonProps = {
      id: fieldId,
      name,
      'aria-invalid': Boolean(error) || undefined,
      'aria-describedby': describedBy,
      className: `${inputCls} ${error ? inputErrorCls : ''}`,
    };

    return (
      <div>
        <label htmlFor={fieldId} className={labelCls}>
          {label}
        </label>
        {as === 'textarea' ? (
          <textarea
            {...(commonProps as unknown as InputHTMLAttributes<HTMLTextAreaElement>)}
            {...(rest as unknown as InputHTMLAttributes<HTMLTextAreaElement>)}
            rows={rows ?? 5}
          />
        ) : as === 'select' ? (
          <select
            {...(commonProps as unknown as InputHTMLAttributes<HTMLSelectElement>)}
            {...(rest as unknown as InputHTMLAttributes<HTMLSelectElement>)}
          >
            {children}
          </select>
        ) : (
          <input ref={ref} {...commonProps} {...rest} />
        )}
        {hint ? (
          <p id={hintId} className={hintCls}>
            {hint}
          </p>
        ) : null}
        {error ? (
          <p id={errorId} className={errorCls} role="alert">
            {error}
          </p>
        ) : null}
      </div>
    );
  },
);
```

- [ ] **Step 2: Create ConsentCheckbox**

Create `src/components/forms/consent-checkbox.tsx`:

```tsx
'use client';

import { forwardRef, type InputHTMLAttributes } from 'react';
import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';

interface ConsentCheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

export const ConsentCheckbox = forwardRef<HTMLInputElement, ConsentCheckboxProps>(
  function ConsentCheckbox({ error, id = 'consentAccepted', ...rest }, ref) {
    const t = useTranslations('forms.common');

    return (
      <div className="flex items-start gap-3">
        <input
          ref={ref}
          id={id}
          type="checkbox"
          aria-required="true"
          aria-invalid={Boolean(error) || undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          className="mt-1 h-4 w-4 cursor-pointer accent-[#D4A23A]"
          {...rest}
        />
        <div className="flex-1">
          <label htmlFor={id} className="text-[13px] leading-relaxed text-[#0B0D10]">
            {t.rich('consent', {
              privacy: (chunks) => (
                <Link
                  href="/privacy"
                  className="underline decoration-[#D4A23A] underline-offset-4"
                >
                  {chunks}
                </Link>
              ),
              terms: (chunks) => (
                <Link
                  href="/terms"
                  className="underline decoration-[#D4A23A] underline-offset-4"
                >
                  {chunks}
                </Link>
              ),
            })}
          </label>
          {error ? (
            <p id={`${id}-error`} className="mt-1 text-[12px] text-red-700" role="alert">
              {error}
            </p>
          ) : null}
        </div>
      </div>
    );
  },
);
```

- [ ] **Step 3: Create TurnstileWidget**

Create `src/components/forms/turnstile-widget.tsx`:

```tsx
'use client';

import { Turnstile } from '@marsidev/react-turnstile';
import { useRef, useImperativeHandle, forwardRef } from 'react';

interface TurnstileWidgetProps {
  siteKey: string | undefined;
  onToken: (token: string) => void;
  locale?: 'en' | 'ko' | 'mn';
}

export interface TurnstileHandle {
  reset: () => void;
}

export const TurnstileWidget = forwardRef<TurnstileHandle, TurnstileWidgetProps>(
  function TurnstileWidget({ siteKey, onToken, locale = 'en' }, ref) {
    const widgetRef = useRef<{ reset: () => void } | null>(null);

    useImperativeHandle(ref, () => ({
      reset: () => widgetRef.current?.reset(),
    }));

    if (!siteKey) {
      if (process.env.NODE_ENV !== 'production') {
        // Dev fallback: emit a non-empty token so the form can submit; server
        // verifier also skips in dev if the secret key is missing.
        if (typeof window !== 'undefined') {
          queueMicrotask(() => onToken('DEV_TURNSTILE_BYPASS'));
        }
      }
      return null;
    }

    return (
      <div aria-hidden="true">
        <Turnstile
          ref={widgetRef}
          siteKey={siteKey}
          onSuccess={onToken}
          options={{ size: 'invisible', language: locale }}
        />
      </div>
    );
  },
);
```

- [ ] **Step 4: Create SuccessCard**

Create `src/components/forms/success-card.tsx`:

```tsx
'use client';

import { useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';

interface SuccessCardProps {
  onDismiss: () => void;
}

export function SuccessCard({ onDismiss }: SuccessCardProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const t = useTranslations('forms.common.success');

  useEffect(() => {
    ref.current?.focus();
  }, []);

  return (
    <div
      ref={ref}
      tabIndex={-1}
      role="status"
      aria-live="polite"
      className="flex flex-col items-center gap-6 border border-[#0B0D10]/20 bg-[#F4F1EA] px-8 py-16 text-center outline-none"
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 140 140"
        width="120"
        height="120"
        className="text-[#D4A23A]"
      >
        <circle
          cx="70"
          cy="70"
          r="60"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        />
        <path
          d="M48 72 L64 88 L94 54"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <h2 className="font-serif text-3xl text-[#0B0D10]">{t('title')}</h2>
      <p className="max-w-md text-[15px] leading-relaxed text-[#0B0D10]/70">
        {t('body')}
      </p>
      <button
        type="button"
        onClick={onDismiss}
        className="mt-2 border border-[#0B0D10]/30 px-6 py-2 font-mono text-[11px] uppercase tracking-[0.18em] text-[#0B0D10] transition hover:bg-[#0B0D10] hover:text-[#F4F1EA]"
      >
        {t('dismiss')}
      </button>
    </div>
  );
}
```

- [ ] **Step 5: Create FormShell**

Create `src/components/forms/form-shell.tsx`:

```tsx
'use client';

import {
  type ReactNode,
  type FormEventHandler,
  useState,
  useRef,
  useCallback,
} from 'react';
import { toast } from 'sonner';
import { useTranslations } from 'next-intl';

import { ConsentCheckbox } from './consent-checkbox';
import { SuccessCard } from './success-card';
import { TurnstileWidget, type TurnstileHandle } from './turnstile-widget';
import type { ApiResult } from '@/lib/forms/types';

interface FormShellProps {
  endpoint: string;
  buildPayload: () => Record<string, unknown>;
  onValidationErrors: (fields: Record<string, string>) => void;
  resetForm: () => void;
  siteKey: string | undefined;
  locale: 'en' | 'ko' | 'mn';
  children: ReactNode;
  consentError?: string;
  consentValue: boolean;
  onConsentChange: (value: boolean) => void;
  honeypotName?: string;
  submitLabelKey?: string;
}

export function FormShell({
  endpoint,
  buildPayload,
  onValidationErrors,
  resetForm,
  siteKey,
  locale,
  children,
  consentError,
  consentValue,
  onConsentChange,
  honeypotName = 'honeypot',
  submitLabelKey = 'submit',
}: FormShellProps) {
  const t = useTranslations('forms.common');
  const tError = useTranslations('forms.common.errors');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [token, setToken] = useState<string>('');
  const turnstileRef = useRef<TurnstileHandle | null>(null);

  const handleToken = useCallback((t: string) => setToken(t), []);

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();
    if (!consentValue) return;
    if (!token) {
      toast.error(tError('turnstile'));
      return;
    }
    setSubmitting(true);
    try {
      const payload = { ...buildPayload(), turnstileToken: token };
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = (await res.json()) as ApiResult;
      if (data.ok) {
        setSuccess(true);
        resetForm();
        turnstileRef.current?.reset();
        return;
      }
      if (data.error === 'VALIDATION') {
        onValidationErrors(data.fields);
        toast.error(tError('serviceUnavailable'));
        return;
      }
      if (data.error === 'TURNSTILE_FAILED') {
        toast.error(tError('turnstile'));
        turnstileRef.current?.reset();
        setToken('');
        return;
      }
      toast.error(tError('serviceUnavailable'));
    } catch {
      toast.error(tError('serviceUnavailable'));
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <SuccessCard
        onDismiss={() => {
          setSuccess(false);
          setToken('');
          turnstileRef.current?.reset();
        }}
      />
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
      {/* Honeypot */}
      <input
        type="text"
        name={honeypotName}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="pointer-events-none absolute left-[-9999px] h-0 w-0 opacity-0"
      />
      {children}
      <ConsentCheckbox
        checked={consentValue}
        onChange={(e) => onConsentChange(e.currentTarget.checked)}
        error={consentError}
      />
      <TurnstileWidget
        ref={turnstileRef}
        siteKey={siteKey}
        onToken={handleToken}
        locale={locale}
      />
      <button
        type="submit"
        disabled={submitting || !consentValue}
        className="mt-2 inline-flex items-center justify-center gap-2 border border-[#0B0D10] bg-[#0B0D10] px-8 py-4 font-mono text-[11px] uppercase tracking-[0.22em] text-[#F4F1EA] transition hover:bg-[#D4A23A] hover:text-[#0B0D10] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitting ? t('submitting') : t(submitLabelKey)}
      </button>
    </form>
  );
}
```

- [ ] **Step 6: Typecheck + build**

Run: `pnpm typecheck && pnpm build`
Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add src/components/forms/
git commit -m "feat(forms): add form primitives (FormShell, FormField, Consent, Turnstile, SuccessCard)"
```

---

## Task 9: i18n — EN/KO/MN translations for forms namespace

**Files:**
- Modify: `messages/en.json`
- Modify: `messages/ko.json`
- Modify: `messages/mn.json`

- [ ] **Step 1: Add `forms` namespace to `messages/en.json`**

Insert the `forms` key as a top-level member of the root object in `messages/en.json`:

```json
"forms": {
  "common": {
    "name": "Name",
    "email": "Email",
    "phone": "Phone",
    "message": "Message",
    "submit": "Send inquiry",
    "submitting": "Sending…",
    "consent": "I agree to the <privacy>Privacy Policy</privacy> and <terms>Terms of Service</terms>.",
    "success": {
      "title": "Message received",
      "body": "Thank you for reaching out. A member of our expedition team will respond within 24 hours.",
      "dismiss": "Send another"
    },
    "errors": {
      "required": "This field is required.",
      "email": "Please enter a valid email address.",
      "minLength": "Too short.",
      "maxLength": "Too long.",
      "consent": "Please accept the privacy policy to continue.",
      "turnstile": "Verification required. Please disable ad-blockers and try again.",
      "serviceUnavailable": "Something went wrong. Please try again in a moment.",
      "dateTooSoon": "Please choose a date at least 7 days from today.",
      "dateRange": "End date must be after start date, and trip no longer than 60 days.",
      "partySize": "Party size must be between 1 and 20."
    }
  },
  "contact": {
    "metaTitle": "Contact · Amuun",
    "metaDescription": "Reach the Amuun expedition team for inquiries, press, and partnerships.",
    "eyebrow": "Reach the team",
    "title": "Write to us",
    "intro": "Tell us a little about what you are looking for — our expedition lead will read your note personally.",
    "subject": {
      "label": "Subject",
      "placeholder": "Select a subject",
      "options": {
        "general": "General inquiry",
        "press": "Press",
        "partnership": "Partnership",
        "other": "Other"
      }
    },
    "office": {
      "title": "Where to find us",
      "city": "Ulaanbaatar, Mongolia",
      "hours": "Mon–Fri · 09:00–18:00 UB time",
      "emailLabel": "Email",
      "emailValue": "hello@amuun.voidex.studio"
    }
  },
  "customTrip": {
    "metaTitle": "Design a custom trip · Amuun",
    "metaDescription": "Tell us about the journey you have in mind and we will craft it around you.",
    "eyebrow": "Craft your journey",
    "title": "Design a custom expedition",
    "intro": "Share a few details and a specialist will return a bespoke outline within 24 hours.",
    "fieldsets": {
      "aboutYou": "About you",
      "yourJourney": "Your journey"
    },
    "partySize": "Party size",
    "partySizeHint": "Adults and children combined.",
    "travelWindow": {
      "start": "Earliest start",
      "end": "Latest return"
    },
    "interests": {
      "label": "What draws you here",
      "culture": "Culture & nomads",
      "nature": "Nature & wildlife",
      "adventure": "Adventure",
      "food": "Food & wellbeing"
    },
    "budget": {
      "label": "Budget per traveller",
      "placeholder": "Select a range",
      "options": {
        "under-3k": "Under $3,000",
        "3k-5k": "$3,000 – $5,000",
        "5k-10k": "$5,000 – $10,000",
        "10k-plus": "$10,000+"
      }
    }
  },
  "booking": {
    "trigger": "Inquire about this expedition",
    "triggerTier": "Inquire · {tier}",
    "title": "Reserve your place",
    "intro": "Send a brief inquiry and we will confirm availability plus a detailed breakdown within 24 hours.",
    "tour": "Expedition",
    "tierLabel": {
      "label": "Experience",
      "standard": "Standard",
      "deluxe": "Deluxe",
      "private": "Private"
    },
    "adults": "Adults",
    "children": "Children",
    "preferredDate": "Preferred start",
    "specialRequests": "Special requests",
    "close": "Close"
  }
}
```

- [ ] **Step 2: Add `forms` namespace to `messages/ko.json`**

Insert the same `forms` key structure translated to Korean (존댓말, formal register):

```json
"forms": {
  "common": {
    "name": "성함",
    "email": "이메일",
    "phone": "연락처",
    "message": "메시지",
    "submit": "문의 보내기",
    "submitting": "전송 중…",
    "consent": "<privacy>개인정보 처리방침</privacy> 및 <terms>이용약관</terms>에 동의합니다.",
    "success": {
      "title": "문의가 도착했습니다",
      "body": "소중한 메시지 감사드립니다. 24시간 이내에 저희 원정 팀에서 회신드리겠습니다.",
      "dismiss": "다시 보내기"
    },
    "errors": {
      "required": "필수 항목입니다.",
      "email": "올바른 이메일 주소를 입력해 주세요.",
      "minLength": "내용이 너무 짧습니다.",
      "maxLength": "내용이 너무 깁니다.",
      "consent": "계속하시려면 개인정보 처리방침에 동의해 주세요.",
      "turnstile": "확인이 필요합니다. 광고 차단을 해제하고 다시 시도해 주세요.",
      "serviceUnavailable": "문제가 발생했습니다. 잠시 후 다시 시도해 주세요.",
      "dateTooSoon": "오늘로부터 최소 7일 이후의 날짜를 선택해 주세요.",
      "dateRange": "도착일은 출발일 이후여야 하며, 여행 기간은 60일을 초과할 수 없습니다.",
      "partySize": "인원은 1명에서 20명 사이로 입력해 주세요."
    }
  },
  "contact": {
    "metaTitle": "문의하기 · Amuun",
    "metaDescription": "Amuun 원정 팀에 문의, 취재, 파트너십 요청을 보내실 수 있습니다.",
    "eyebrow": "팀에 연락하기",
    "title": "메시지를 보내주세요",
    "intro": "어떤 여정을 찾고 계신지 간단히 알려주시면 원정 책임자가 직접 읽고 답변드립니다.",
    "subject": {
      "label": "문의 유형",
      "placeholder": "유형을 선택해 주세요",
      "options": {
        "general": "일반 문의",
        "press": "취재 요청",
        "partnership": "파트너십",
        "other": "기타"
      }
    },
    "office": {
      "title": "저희를 만나실 곳",
      "city": "몽골 울란바토르",
      "hours": "월–금 · 울란바토르 시간 09:00–18:00",
      "emailLabel": "이메일",
      "emailValue": "hello@amuun.voidex.studio"
    }
  },
  "customTrip": {
    "metaTitle": "맞춤 여정 설계 · Amuun",
    "metaDescription": "마음에 그리시는 여정을 들려주시면 맞춤으로 설계해 드립니다.",
    "eyebrow": "여정을 빚다",
    "title": "맞춤 원정을 설계하세요",
    "intro": "몇 가지 정보를 남겨주시면 담당자가 24시간 이내에 맞춤 개요를 보내드립니다.",
    "fieldsets": {
      "aboutYou": "고객님에 대하여",
      "yourJourney": "원하시는 여정"
    },
    "partySize": "일행 규모",
    "partySizeHint": "성인과 어린이를 합한 인원입니다.",
    "travelWindow": {
      "start": "가장 빠른 출발",
      "end": "가장 늦은 귀환"
    },
    "interests": {
      "label": "가장 끌리는 것",
      "culture": "문화와 유목민",
      "nature": "자연과 야생",
      "adventure": "어드벤처",
      "food": "음식과 웰빙"
    },
    "budget": {
      "label": "1인당 예산",
      "placeholder": "범위를 선택해 주세요",
      "options": {
        "under-3k": "$3,000 미만",
        "3k-5k": "$3,000 – $5,000",
        "5k-10k": "$5,000 – $10,000",
        "10k-plus": "$10,000 이상"
      }
    }
  },
  "booking": {
    "trigger": "이 원정 문의하기",
    "triggerTier": "문의 · {tier}",
    "title": "자리를 예약하세요",
    "intro": "간단히 문의를 보내주시면 24시간 이내에 가능 여부와 상세 내역을 확인해 드립니다.",
    "tour": "원정",
    "tierLabel": {
      "label": "경험 등급",
      "standard": "스탠다드",
      "deluxe": "디럭스",
      "private": "프라이빗"
    },
    "adults": "성인",
    "children": "어린이",
    "preferredDate": "희망 출발일",
    "specialRequests": "특별 요청",
    "close": "닫기"
  }
}
```

- [ ] **Step 3: Add `forms` namespace to `messages/mn.json`**

Insert the same `forms` key structure translated to natural Mongolian:

```json
"forms": {
  "common": {
    "name": "Нэр",
    "email": "Имэйл",
    "phone": "Утас",
    "message": "Мессеж",
    "submit": "Илгээх",
    "submitting": "Илгээж байна…",
    "consent": "Би <privacy>Нууцлалын бодлого</privacy> болон <terms>Үйлчилгээний нөхцөл</terms>-ийг хүлээн зөвшөөрч байна.",
    "success": {
      "title": "Мессеж хүрлээ",
      "body": "Хандсанд баярлалаа. Манай экспедицийн багийн гишүүн 24 цагийн дотор хариу өгнө.",
      "dismiss": "Дахин илгээх"
    },
    "errors": {
      "required": "Энэ талбарыг бөглөнө үү.",
      "email": "Зөв имэйл хаяг оруулна уу.",
      "minLength": "Хэт богино байна.",
      "maxLength": "Хэт урт байна.",
      "consent": "Үргэлжлүүлэхийн тулд нууцлалын бодлогыг хүлээн зөвшөөрнө үү.",
      "turnstile": "Баталгаажуулалт шаардлагатай. Reklam blocker-ыг унтраагаад дахин оролдоно уу.",
      "serviceUnavailable": "Алдаа гарлаа. Түр хүлээгээд дахин оролдоно уу.",
      "dateTooSoon": "Өнөөдрөөс хамгийн багадаа 7 хоногийн дараах огноог сонгоно уу.",
      "dateRange": "Дуусах огноо эхлэх огнооны дараа байх ёстой бөгөөд аялал 60 хоногоос хэтрэхгүй.",
      "partySize": "Хүний тоо 1-ээс 20-ийн хооронд байх ёстой."
    }
  },
  "contact": {
    "metaTitle": "Холбоо барих · Amuun",
    "metaDescription": "Amuun-ийн экспедицийн багтай холбогдоод асуулт, хэвлэлийн хүсэлт, хамтын ажиллагааны санал илгээнэ үү.",
    "eyebrow": "Багтай холбогдох",
    "title": "Бидэнд бичнэ үү",
    "intro": "Ямар аялал хүсч байгаагаа товч хуваалцвал манай экспедицийн ахлагч танд өөрөө хариу бичнэ.",
    "subject": {
      "label": "Сэдэв",
      "placeholder": "Сэдвээ сонгоно уу",
      "options": {
        "general": "Ерөнхий асуулт",
        "press": "Хэвлэлийн хүсэлт",
        "partnership": "Хамтын ажиллагаа",
        "other": "Бусад"
      }
    },
    "office": {
      "title": "Биднийг хаанаас олох вэ",
      "city": "Улаанбаатар, Монгол",
      "hours": "Даваа–Баасан · УБ-ын цагаар 09:00–18:00",
      "emailLabel": "Имэйл",
      "emailValue": "hello@amuun.voidex.studio"
    }
  },
  "customTrip": {
    "metaTitle": "Захиалгат аялал зохиох · Amuun",
    "metaDescription": "Төсөөлж буй аялалаа хуваалцвал бид таны эргэн тойронд бүтээнэ.",
    "eyebrow": "Аялалаа бүтээх",
    "title": "Захиалгат экспедиц зохиох",
    "intro": "Хэдэн чухал мэдээлэл өгвөл мэргэжилтэн 24 цагийн дотор танд зориулсан төслийг илгээнэ.",
    "fieldsets": {
      "aboutYou": "Танай тухай",
      "yourJourney": "Танай аялал"
    },
    "partySize": "Хүний тоо",
    "partySizeHint": "Том хүн болон хүүхдүүдийн нийт тоо.",
    "travelWindow": {
      "start": "Эхэн огноо",
      "end": "Төгсгөлийн огноо"
    },
    "interests": {
      "label": "Юу таныг татаж байна вэ",
      "culture": "Соёл, нүүдэлчид",
      "nature": "Байгаль, зэрлэг амьтан",
      "adventure": "Адал явдал",
      "food": "Хоол, чийрэгжүүлэлт"
    },
    "budget": {
      "label": "Нэг хүнд ноогдох төсөв",
      "placeholder": "Хязгаараа сонгоно уу",
      "options": {
        "under-3k": "$3,000-ээс доош",
        "3k-5k": "$3,000 – $5,000",
        "5k-10k": "$5,000 – $10,000",
        "10k-plus": "$10,000-ээс дээш"
      }
    }
  },
  "booking": {
    "trigger": "Энэ экспедицийн талаар асуух",
    "triggerTier": "Асуулт · {tier}",
    "title": "Суудлаа захиалах",
    "intro": "Богино асуулт илгээхэд бид 24 цагийн дотор сул ордон болон дэлгэрэнгүйг баталгаажуулна.",
    "tour": "Экспедиц",
    "tierLabel": {
      "label": "Түвшин",
      "standard": "Стандарт",
      "deluxe": "Делюкс",
      "private": "Хувийн"
    },
    "adults": "Том хүн",
    "children": "Хүүхэд",
    "preferredDate": "Хүссэн эхлэх огноо",
    "specialRequests": "Тусгай хүсэлт",
    "close": "Хаах"
  }
}
```

- [ ] **Step 4: Validate JSON syntax**

Run:

```bash
node -e "['en','ko','mn'].forEach(l => JSON.parse(require('fs').readFileSync(\`messages/\${l}.json\`, 'utf8')))" && echo OK
```

Expected: prints `OK`. Any SyntaxError means one of the three JSON files is malformed.

- [ ] **Step 5: Typecheck + build**

Run: `pnpm typecheck && pnpm build`
Expected: PASS. next-intl detects matching keys across all three locales.

- [ ] **Step 6: Commit**

```bash
git add messages/
git commit -m "feat(i18n): add forms namespace translations for EN, KO, MN"
```

---

## Task 10: Contact form — component + API route + page

**Files:**
- Create: `src/components/forms/contact-form.tsx`
- Create: `src/app/api/contact/route.ts`
- Modify: `src/app/[locale]/contact/page.tsx`

- [ ] **Step 1: Create ContactForm component**

Create `src/components/forms/contact-form.tsx`:

```tsx
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { contactSchema, type ContactInput } from '@/lib/schemas/contact.schema';
import { FormShell } from './form-shell';
import { FormField } from './form-field';

interface ContactFormProps {
  locale: 'en' | 'ko' | 'mn';
  siteKey: string | undefined;
}

export function ContactForm({ locale, siteKey }: ContactFormProps) {
  const t = useTranslations('forms.common');
  const tc = useTranslations('forms.contact');
  const tErr = useTranslations('forms.common.errors');

  const {
    register,
    formState: { errors },
    getValues,
    setError,
    reset,
    watch,
    setValue,
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    mode: 'onBlur',
    defaultValues: {
      formType: 'contact',
      name: '',
      email: '',
      phone: '',
      message: '',
      subject: undefined,
      locale,
      consentAccepted: false as unknown as true,
      honeypot: '' as const,
      turnstileToken: '',
    },
  });

  const consent = watch('consentAccepted') === true;

  function mapErrorCode(code: string | undefined, fallbackKey: string): string {
    if (!code) return tErr(fallbackKey);
    try {
      return tErr(code);
    } catch {
      return tErr(fallbackKey);
    }
  }

  return (
    <FormShell
      endpoint="/api/contact"
      locale={locale}
      siteKey={siteKey}
      buildPayload={() => getValues()}
      onValidationErrors={(fields) => {
        for (const [path, code] of Object.entries(fields)) {
          setError(path as keyof ContactInput, { type: 'server', message: code });
        }
      }}
      resetForm={() =>
        reset({
          formType: 'contact',
          name: '',
          email: '',
          phone: '',
          message: '',
          subject: undefined,
          locale,
          consentAccepted: false as unknown as true,
          honeypot: '' as const,
          turnstileToken: '',
        })
      }
      consentValue={consent}
      onConsentChange={(v) => setValue('consentAccepted', v as true, { shouldValidate: true })}
      consentError={errors.consentAccepted ? mapErrorCode(errors.consentAccepted.message, 'consent') : undefined}
    >
      <FormField
        label={t('name')}
        autoComplete="name"
        {...register('name')}
        error={errors.name ? mapErrorCode(errors.name.message, 'required') : undefined}
      />
      <FormField
        label={t('email')}
        type="email"
        autoComplete="email"
        {...register('email')}
        error={errors.email ? mapErrorCode(errors.email.message, 'email') : undefined}
      />
      <FormField
        label={t('phone')}
        type="tel"
        autoComplete="tel"
        {...register('phone')}
        error={errors.phone ? mapErrorCode(errors.phone.message, 'minLength') : undefined}
      />
      <FormField
        as="select"
        label={tc('subject.label')}
        {...register('subject')}
        error={errors.subject ? mapErrorCode(errors.subject.message, 'required') : undefined}
      >
        <option value="">{tc('subject.placeholder')}</option>
        <option value="general">{tc('subject.options.general')}</option>
        <option value="press">{tc('subject.options.press')}</option>
        <option value="partnership">{tc('subject.options.partnership')}</option>
        <option value="other">{tc('subject.options.other')}</option>
      </FormField>
      <FormField
        as="textarea"
        label={t('message')}
        {...register('message')}
        error={errors.message ? mapErrorCode(errors.message.message, 'minLength') : undefined}
      />
    </FormShell>
  );
}
```

- [ ] **Step 2: Create Contact API route**

Create `src/app/api/contact/route.ts`:

```ts
import type { NextRequest } from 'next/server';
import { processSubmission } from '@/lib/forms/pipeline';
import { contactSchema, type ContactInput } from '@/lib/schemas/contact.schema';
import { AdminNotification } from '@/emails/admin-notification';
import { UserConfirmation } from '@/emails/user-confirmation';

export const runtime = 'nodejs';
export const maxDuration = 10;

export async function POST(request: NextRequest) {
  return processSubmission<ContactInput>({
    request,
    formType: 'contact',
    schema: contactSchema,
    buildSanityPayload: (data) => ({
      subject: data.subject,
    }),
    buildAdminEmail: ({ data, submissionId }) =>
      AdminNotification({
        formType: 'contact',
        name: data.name,
        email: data.email,
        phone: data.phone || undefined,
        message: data.message,
        locale: data.locale,
        payload: { subject: data.subject },
        submittedAt: new Date().toISOString(),
      }),
    buildUserEmail: ({ data }) =>
      UserConfirmation({
        formType: 'contact',
        name: data.name,
        locale: data.locale,
      }),
    adminSubject: (data) => `[Contact] New inquiry from ${data.name}`,
    userSubject: () => 'We received your inquiry · Amuun',
  });
}
```

- [ ] **Step 3: Replace Contact page**

Replace all contents of `src/app/[locale]/contact/page.tsx`:

```tsx
import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { ContactForm } from '@/components/forms/contact-form';
import { Footer } from '@/components/layout/footer';

interface Params {
  locale: 'en' | 'ko' | 'mn';
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'forms.contact' });
  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
  };
}

export default async function ContactPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('forms.contact');
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

  return (
    <main className="relative min-h-screen bg-[#0B0D10] text-[#F4F1EA]">
      <section className="px-[7vw] pt-[28vh] pb-[10vh]">
        <div className="mx-auto grid max-w-6xl gap-16 lg:grid-cols-[1.1fr_1fr]">
          <div>
            <span className="eyebrow">{t('eyebrow')}</span>
            <h1 className="mt-6 font-serif text-5xl lg:text-6xl">{t('title')}</h1>
            <p className="mt-8 max-w-xl text-[16px] leading-relaxed text-[#F4F1EA]/70">
              {t('intro')}
            </p>
            <div className="mt-16 space-y-4 border-l border-[#D4A23A] pl-6 text-[14px] text-[#F4F1EA]/70">
              <p className="eyebrow text-[#D4A23A]">{t('office.title')}</p>
              <p>{t('office.city')}</p>
              <p>{t('office.hours')}</p>
              <p>
                {t('office.emailLabel')}:{' '}
                <a
                  className="underline decoration-[#D4A23A] underline-offset-4"
                  href={`mailto:${t('office.emailValue')}`}
                >
                  {t('office.emailValue')}
                </a>
              </p>
            </div>
          </div>
          <div className="bg-[#F4F1EA] p-8 lg:p-12">
            <ContactForm locale={locale} siteKey={siteKey} />
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
```

- [ ] **Step 4: Typecheck + lint + build**

Run: `pnpm typecheck && pnpm lint && pnpm build`
Expected: PASS. New route `/api/contact` compiles; `/[locale]/contact` renders.

- [ ] **Step 5: Manual submit test**

Run: `pnpm dev`

In browser:
1. Visit `http://localhost:3000/en/contact`.
2. Fill name, email, subject, message. Tick consent.
3. Submit.
4. Expected: SuccessCard renders, focus moves to it, screen reader announces.

In terminal watching dev server:
- If `TURNSTILE_SECRET_KEY` is unset, you see `[forms/turnstile] TURNSTILE_SECRET_KEY not set; skipping verification in development`.
- If `SANITY_API_WRITE_TOKEN` is set and a valid Sanity project exists, a new `submission` document appears in Studio.
- If `RESEND_API_KEY` is set, admin + user emails are dispatched.

Repeat at `/ko/contact` and `/mn/contact` — confirm labels, error text, and success card translate correctly.

Stop dev server.

- [ ] **Step 6: Commit**

```bash
git add src/components/forms/contact-form.tsx src/app/api/contact/route.ts src/app/\[locale\]/contact/page.tsx
git commit -m "feat(contact): wire ContactForm, /api/contact route, and full /contact page"
```

---

## Task 11: Custom Trip form — component + API route + page

**Files:**
- Create: `src/components/forms/custom-trip-form.tsx`
- Create: `src/app/api/custom-trip/route.ts`
- Modify: `src/app/[locale]/custom-trip/page.tsx`

- [ ] **Step 1: Create CustomTripForm component**

Create `src/components/forms/custom-trip-form.tsx`:

```tsx
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import {
  customTripSchema,
  type CustomTripInput,
  interestEnum,
  budgetEnum,
} from '@/lib/schemas/custom-trip.schema';
import { FormShell } from './form-shell';
import { FormField } from './form-field';

interface CustomTripFormProps {
  locale: 'en' | 'ko' | 'mn';
  siteKey: string | undefined;
}

const fieldsetCls = 'border-t border-[#0B0D10]/20 pt-6';
const legendCls =
  'mb-4 block font-mono text-[11px] uppercase tracking-[0.18em] text-[#0B0D10]/70';

export function CustomTripForm({ locale, siteKey }: CustomTripFormProps) {
  const t = useTranslations('forms.common');
  const tc = useTranslations('forms.customTrip');
  const tErr = useTranslations('forms.common.errors');

  const {
    register,
    watch,
    setValue,
    getValues,
    reset,
    setError,
    formState: { errors },
  } = useForm<CustomTripInput>({
    resolver: zodResolver(customTripSchema),
    mode: 'onBlur',
    defaultValues: {
      formType: 'customTrip',
      name: '',
      email: '',
      phone: '',
      message: '',
      locale,
      consentAccepted: false as unknown as true,
      honeypot: '' as const,
      turnstileToken: '',
      partySize: 2,
      travelStartDate: undefined as unknown as Date,
      travelEndDate: undefined as unknown as Date,
      interests: [],
      budgetRange: undefined as unknown as (typeof budgetEnum)['_output'],
    },
  });

  const consent = watch('consentAccepted') === true;
  const selectedInterests = watch('interests') ?? [];

  function toggleInterest(value: (typeof interestEnum)['_output']) {
    const current = new Set(selectedInterests);
    if (current.has(value)) current.delete(value);
    else current.add(value);
    setValue('interests', Array.from(current), { shouldValidate: true });
  }

  function mapErrorCode(code: string | undefined, fallbackKey: string): string {
    if (!code) return tErr(fallbackKey);
    try {
      return tErr(code);
    } catch {
      return tErr(fallbackKey);
    }
  }

  return (
    <FormShell
      endpoint="/api/custom-trip"
      locale={locale}
      siteKey={siteKey}
      buildPayload={() => getValues()}
      onValidationErrors={(fields) => {
        for (const [path, code] of Object.entries(fields)) {
          setError(path as keyof CustomTripInput, { type: 'server', message: code });
        }
      }}
      resetForm={() =>
        reset({
          formType: 'customTrip',
          name: '',
          email: '',
          phone: '',
          message: '',
          locale,
          consentAccepted: false as unknown as true,
          honeypot: '' as const,
          turnstileToken: '',
          partySize: 2,
          travelStartDate: undefined as unknown as Date,
          travelEndDate: undefined as unknown as Date,
          interests: [],
          budgetRange: undefined as unknown as (typeof budgetEnum)['_output'],
        })
      }
      consentValue={consent}
      onConsentChange={(v) => setValue('consentAccepted', v as true, { shouldValidate: true })}
      consentError={errors.consentAccepted ? mapErrorCode(errors.consentAccepted.message, 'consent') : undefined}
    >
      <fieldset>
        <legend className={legendCls}>{tc('fieldsets.aboutYou')}</legend>
        <div className="flex flex-col gap-6">
          <FormField
            label={t('name')}
            autoComplete="name"
            {...register('name')}
            error={errors.name ? mapErrorCode(errors.name.message, 'required') : undefined}
          />
          <FormField
            label={t('email')}
            type="email"
            autoComplete="email"
            {...register('email')}
            error={errors.email ? mapErrorCode(errors.email.message, 'email') : undefined}
          />
          <FormField
            label={t('phone')}
            type="tel"
            autoComplete="tel"
            {...register('phone')}
            error={errors.phone ? mapErrorCode(errors.phone.message, 'minLength') : undefined}
          />
        </div>
      </fieldset>

      <fieldset className={fieldsetCls}>
        <legend className={legendCls}>{tc('fieldsets.yourJourney')}</legend>
        <div className="flex flex-col gap-6">
          <FormField
            label={tc('partySize')}
            type="number"
            min={1}
            max={20}
            hint={tc('partySizeHint')}
            {...register('partySize', { valueAsNumber: true })}
            error={errors.partySize ? mapErrorCode(errors.partySize.message, 'partySize') : undefined}
          />
          <div className="grid gap-6 sm:grid-cols-2">
            <FormField
              label={tc('travelWindow.start')}
              type="date"
              {...register('travelStartDate', { valueAsDate: true })}
              error={
                errors.travelStartDate
                  ? mapErrorCode(errors.travelStartDate.message, 'dateTooSoon')
                  : undefined
              }
            />
            <FormField
              label={tc('travelWindow.end')}
              type="date"
              {...register('travelEndDate', { valueAsDate: true })}
              error={
                errors.travelEndDate
                  ? mapErrorCode(errors.travelEndDate.message, 'dateRange')
                  : undefined
              }
            />
          </div>

          <div>
            <span className={legendCls}>{tc('interests.label')}</span>
            <div className="flex flex-wrap gap-2">
              {(['culture', 'nature', 'adventure', 'food'] as const).map((value) => {
                const active = selectedInterests.includes(value);
                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() => toggleInterest(value)}
                    aria-pressed={active}
                    className={`border px-4 py-2 font-mono text-[11px] uppercase tracking-[0.18em] transition ${
                      active
                        ? 'border-[#0B0D10] bg-[#0B0D10] text-[#F4F1EA]'
                        : 'border-[#0B0D10]/30 text-[#0B0D10] hover:border-[#D4A23A]'
                    }`}
                  >
                    {tc(`interests.${value}`)}
                  </button>
                );
              })}
            </div>
            {errors.interests ? (
              <p className="mt-1 text-[12px] text-red-700" role="alert">
                {mapErrorCode(errors.interests.message, 'minLength')}
              </p>
            ) : null}
          </div>

          <FormField
            as="select"
            label={tc('budget.label')}
            {...register('budgetRange')}
            error={errors.budgetRange ? mapErrorCode(errors.budgetRange.message, 'required') : undefined}
          >
            <option value="">{tc('budget.placeholder')}</option>
            <option value="under-3k">{tc('budget.options.under-3k')}</option>
            <option value="3k-5k">{tc('budget.options.3k-5k')}</option>
            <option value="5k-10k">{tc('budget.options.5k-10k')}</option>
            <option value="10k-plus">{tc('budget.options.10k-plus')}</option>
          </FormField>

          <FormField
            as="textarea"
            label={t('message')}
            {...register('message')}
            error={errors.message ? mapErrorCode(errors.message.message, 'minLength') : undefined}
          />
        </div>
      </fieldset>
    </FormShell>
  );
}
```

- [ ] **Step 2: Create Custom Trip API route**

Create `src/app/api/custom-trip/route.ts`:

```ts
import type { NextRequest } from 'next/server';
import { processSubmission } from '@/lib/forms/pipeline';
import { customTripSchema, type CustomTripInput } from '@/lib/schemas/custom-trip.schema';
import { AdminNotification } from '@/emails/admin-notification';
import { UserConfirmation } from '@/emails/user-confirmation';

export const runtime = 'nodejs';
export const maxDuration = 10;

function toIsoDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export async function POST(request: NextRequest) {
  return processSubmission<CustomTripInput>({
    request,
    formType: 'customTrip',
    schema: customTripSchema,
    buildSanityPayload: (data) => ({
      partySize: data.partySize,
      travelStartDate: toIsoDate(data.travelStartDate),
      travelEndDate: toIsoDate(data.travelEndDate),
      interests: data.interests,
      budgetRange: data.budgetRange,
    }),
    buildAdminEmail: ({ data }) =>
      AdminNotification({
        formType: 'customTrip',
        name: data.name,
        email: data.email,
        phone: data.phone || undefined,
        message: data.message,
        locale: data.locale,
        payload: {
          partySize: data.partySize,
          travelStartDate: toIsoDate(data.travelStartDate),
          travelEndDate: toIsoDate(data.travelEndDate),
          interests: data.interests,
          budgetRange: data.budgetRange,
        },
        submittedAt: new Date().toISOString(),
      }),
    buildUserEmail: ({ data }) =>
      UserConfirmation({
        formType: 'customTrip',
        name: data.name,
        locale: data.locale,
      }),
    adminSubject: (data) => `[Custom Trip] New request from ${data.name}`,
    userSubject: () => 'We received your custom trip request · Amuun',
  });
}
```

- [ ] **Step 3: Replace Custom Trip page**

Replace all contents of `src/app/[locale]/custom-trip/page.tsx`:

```tsx
import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { CustomTripForm } from '@/components/forms/custom-trip-form';
import { Footer } from '@/components/layout/footer';

interface Params {
  locale: 'en' | 'ko' | 'mn';
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'forms.customTrip' });
  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
  };
}

export default async function CustomTripPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('forms.customTrip');
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

  return (
    <main className="relative min-h-screen bg-[#0B0D10] text-[#F4F1EA]">
      <section className="px-[7vw] pt-[28vh] pb-[10vh]">
        <div className="mx-auto max-w-4xl">
          <span className="eyebrow">{t('eyebrow')}</span>
          <h1 className="mt-6 font-serif text-5xl lg:text-6xl">{t('title')}</h1>
          <p className="mt-8 max-w-2xl text-[16px] leading-relaxed text-[#F4F1EA]/70">
            {t('intro')}
          </p>
          <div className="mt-16 bg-[#F4F1EA] p-8 lg:p-12">
            <CustomTripForm locale={locale} siteKey={siteKey} />
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
```

- [ ] **Step 4: Typecheck + lint + build**

Run: `pnpm typecheck && pnpm lint && pnpm build`
Expected: PASS.

- [ ] **Step 5: Manual submit test**

Run: `pnpm dev`

In browser, visit `http://localhost:3000/en/custom-trip`:
1. Try submitting with start date tomorrow → should show `dateTooSoon` error.
2. Try start = today+10, end = today+9 → should show `dateRange` error.
3. Submit with valid values + all required + consent. Expect SuccessCard.
4. Repeat at `/ko/custom-trip` and `/mn/custom-trip` — verify translations.

Stop dev server.

- [ ] **Step 6: Commit**

```bash
git add src/components/forms/custom-trip-form.tsx src/app/api/custom-trip/route.ts src/app/\[locale\]/custom-trip/page.tsx
git commit -m "feat(custom-trip): wire CustomTripForm, /api/custom-trip route, and full page"
```

---

## Task 12: Booking form — dialog + tour detail integration + API

**Files:**
- Create: `src/components/forms/booking-form.tsx`
- Create: `src/components/forms/booking-dialog.tsx`
- Create: `src/app/api/booking/route.ts`
- Modify: `src/app/[locale]/tours/[slug]/page.tsx`

- [ ] **Step 1: Create BookingForm component**

Create `src/components/forms/booking-form.tsx`:

```tsx
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import {
  bookingSchema,
  bookingTierEnum,
  type BookingInput,
} from '@/lib/schemas/booking.schema';
import { FormShell } from './form-shell';
import { FormField } from './form-field';

interface BookingFormProps {
  locale: 'en' | 'ko' | 'mn';
  siteKey: string | undefined;
  tourSlug: string;
  tourTitle: string;
  defaultTier?: 'standard' | 'deluxe' | 'private';
}

const labelCls =
  'mb-2 block font-mono text-[11px] uppercase tracking-[0.18em] text-[#0B0D10]/70';

export function BookingForm({
  locale,
  siteKey,
  tourSlug,
  tourTitle,
  defaultTier,
}: BookingFormProps) {
  const t = useTranslations('forms.common');
  const tb = useTranslations('forms.booking');
  const tErr = useTranslations('forms.common.errors');

  const {
    register,
    watch,
    setValue,
    getValues,
    reset,
    setError,
    formState: { errors },
  } = useForm<BookingInput>({
    resolver: zodResolver(bookingSchema),
    mode: 'onBlur',
    defaultValues: {
      formType: 'booking',
      name: '',
      email: '',
      phone: '',
      message: '',
      locale,
      consentAccepted: false as unknown as true,
      honeypot: '' as const,
      turnstileToken: '',
      tourSlug,
      tourTitle,
      preferredStartDate: undefined as unknown as Date,
      adults: 2,
      children: 0,
      tier: defaultTier ?? 'standard',
      specialRequests: '',
    },
  });

  const consent = watch('consentAccepted') === true;
  const currentTier = watch('tier');

  function mapErrorCode(code: string | undefined, fallbackKey: string): string {
    if (!code) return tErr(fallbackKey);
    try {
      return tErr(code);
    } catch {
      return tErr(fallbackKey);
    }
  }

  return (
    <FormShell
      endpoint="/api/booking"
      locale={locale}
      siteKey={siteKey}
      buildPayload={() => getValues()}
      onValidationErrors={(fields) => {
        for (const [path, code] of Object.entries(fields)) {
          setError(path as keyof BookingInput, { type: 'server', message: code });
        }
      }}
      resetForm={() =>
        reset({
          formType: 'booking',
          name: '',
          email: '',
          phone: '',
          message: '',
          locale,
          consentAccepted: false as unknown as true,
          honeypot: '' as const,
          turnstileToken: '',
          tourSlug,
          tourTitle,
          preferredStartDate: undefined as unknown as Date,
          adults: 2,
          children: 0,
          tier: defaultTier ?? 'standard',
          specialRequests: '',
        })
      }
      consentValue={consent}
      onConsentChange={(v) => setValue('consentAccepted', v as true, { shouldValidate: true })}
      consentError={errors.consentAccepted ? mapErrorCode(errors.consentAccepted.message, 'consent') : undefined}
    >
      <p className={labelCls}>{tb('tour')}</p>
      <p className="-mt-4 font-serif text-xl text-[#0B0D10]">{tourTitle}</p>

      <FormField
        label={t('name')}
        autoComplete="name"
        {...register('name')}
        error={errors.name ? mapErrorCode(errors.name.message, 'required') : undefined}
      />
      <FormField
        label={t('email')}
        type="email"
        autoComplete="email"
        {...register('email')}
        error={errors.email ? mapErrorCode(errors.email.message, 'email') : undefined}
      />
      <FormField
        label={t('phone')}
        type="tel"
        autoComplete="tel"
        {...register('phone')}
        error={errors.phone ? mapErrorCode(errors.phone.message, 'minLength') : undefined}
      />

      <div>
        <p className={labelCls}>{tb('tierLabel.label')}</p>
        <div className="flex gap-2">
          {(['standard', 'deluxe', 'private'] as const).map((tier) => (
            <button
              key={tier}
              type="button"
              onClick={() => setValue('tier', tier, { shouldValidate: true })}
              aria-pressed={currentTier === tier}
              className={`flex-1 border px-4 py-3 font-mono text-[11px] uppercase tracking-[0.18em] transition ${
                currentTier === tier
                  ? 'border-[#0B0D10] bg-[#0B0D10] text-[#F4F1EA]'
                  : 'border-[#0B0D10]/30 text-[#0B0D10] hover:border-[#D4A23A]'
              }`}
            >
              {tb(`tierLabel.${tier}`)}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <FormField
          label={tb('adults')}
          type="number"
          min={1}
          max={20}
          {...register('adults', { valueAsNumber: true })}
          error={errors.adults ? mapErrorCode(errors.adults.message, 'partySize') : undefined}
        />
        <FormField
          label={tb('children')}
          type="number"
          min={0}
          max={20}
          {...register('children', { valueAsNumber: true })}
          error={errors.children ? mapErrorCode(errors.children.message, 'partySize') : undefined}
        />
      </div>

      <FormField
        label={tb('preferredDate')}
        type="date"
        {...register('preferredStartDate', { valueAsDate: true })}
        error={
          errors.preferredStartDate
            ? mapErrorCode(errors.preferredStartDate.message, 'dateTooSoon')
            : undefined
        }
      />

      <FormField
        as="textarea"
        label={tb('specialRequests')}
        rows={3}
        {...register('specialRequests')}
        error={errors.specialRequests ? mapErrorCode(errors.specialRequests.message, 'maxLength') : undefined}
      />

      <FormField
        as="textarea"
        label={t('message')}
        rows={5}
        {...register('message')}
        error={errors.message ? mapErrorCode(errors.message.message, 'minLength') : undefined}
      />
    </FormShell>
  );
}
```

- [ ] **Step 2: Create BookingDialog**

Create `src/components/forms/booking-dialog.tsx`:

```tsx
'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import { useTranslations } from 'next-intl';
import { BookingForm } from './booking-form';

interface BookingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tourSlug: string;
  tourTitle: string;
  defaultTier?: 'standard' | 'deluxe' | 'private';
  locale: 'en' | 'ko' | 'mn';
  siteKey: string | undefined;
  trigger?: ReactNode;
}

export function BookingDialog({
  open,
  onOpenChange,
  tourSlug,
  tourTitle,
  defaultTier,
  locale,
  siteKey,
}: BookingDialogProps) {
  const tb = useTranslations('forms.booking');
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;
    previouslyFocused.current = document.activeElement as HTMLElement | null;
    // Focus close button on open — focus trap delegated to Escape + outside click.
    closeBtnRef.current?.focus();

    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onOpenChange(false);
    }
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
      previouslyFocused.current?.focus();
    };
  }, [open, onOpenChange]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="booking-dialog-title"
      className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-black/70 px-4 py-16 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onOpenChange(false);
      }}
    >
      <div
        ref={dialogRef}
        className="relative w-full max-w-2xl bg-[#F4F1EA] p-8 lg:p-12"
      >
        <button
          ref={closeBtnRef}
          type="button"
          onClick={() => onOpenChange(false)}
          className="absolute right-4 top-4 border border-[#0B0D10]/30 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.18em] text-[#0B0D10] transition hover:bg-[#0B0D10] hover:text-[#F4F1EA]"
          aria-label={tb('close')}
        >
          ✕
        </button>
        <h2
          id="booking-dialog-title"
          className="mb-2 font-serif text-3xl text-[#0B0D10]"
        >
          {tb('title')}
        </h2>
        <p className="mb-8 text-[14px] leading-relaxed text-[#0B0D10]/70">
          {tb('intro')}
        </p>
        <BookingForm
          locale={locale}
          siteKey={siteKey}
          tourSlug={tourSlug}
          tourTitle={tourTitle}
          defaultTier={defaultTier}
        />
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Create Booking API route**

Create `src/app/api/booking/route.ts`:

```ts
import type { NextRequest } from 'next/server';
import { processSubmission } from '@/lib/forms/pipeline';
import { bookingSchema, type BookingInput } from '@/lib/schemas/booking.schema';
import { AdminNotification } from '@/emails/admin-notification';
import { UserConfirmation } from '@/emails/user-confirmation';

export const runtime = 'nodejs';
export const maxDuration = 10;

function toIsoDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export async function POST(request: NextRequest) {
  return processSubmission<BookingInput>({
    request,
    formType: 'booking',
    schema: bookingSchema,
    buildSanityPayload: (data) => ({
      tourSlug: data.tourSlug,
      tourTitle: data.tourTitle,
      preferredStartDate: toIsoDate(data.preferredStartDate),
      adults: data.adults,
      children: data.children,
      tier: data.tier,
      specialRequests: data.specialRequests || undefined,
    }),
    buildAdminEmail: ({ data }) =>
      AdminNotification({
        formType: 'booking',
        name: data.name,
        email: data.email,
        phone: data.phone || undefined,
        message: data.message,
        locale: data.locale,
        payload: {
          tourSlug: data.tourSlug,
          tourTitle: data.tourTitle,
          preferredStartDate: toIsoDate(data.preferredStartDate),
          adults: data.adults,
          children: data.children,
          tier: data.tier,
          specialRequests: data.specialRequests || undefined,
        },
        submittedAt: new Date().toISOString(),
      }),
    buildUserEmail: ({ data }) =>
      UserConfirmation({
        formType: 'booking',
        name: data.name,
        locale: data.locale,
        tourTitle: data.tourTitle,
      }),
    adminSubject: (data) =>
      `[Booking] ${data.name} · ${data.tourTitle} (${data.tier})`,
    userSubject: () => 'We received your booking inquiry · Amuun',
  });
}
```

- [ ] **Step 4: Integrate BookingDialog into tour detail page**

Find the tour detail page. Read it first:

```bash
wc -l src/app/\[locale\]/tours/\[slug\]/page.tsx
```

The existing detail page is a server component. Add a client wrapper that holds the dialog state. Create `src/components/tour/book-this-tour.tsx`:

```tsx
'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { BookingDialog } from '@/components/forms/booking-dialog';

type Tier = 'standard' | 'deluxe' | 'private';

interface BookThisTourProps {
  locale: 'en' | 'ko' | 'mn';
  siteKey: string | undefined;
  tourSlug: string;
  tourTitle: string;
  variant: 'primary' | 'tier';
  tier?: Tier;
}

export function BookThisTour({
  locale,
  siteKey,
  tourSlug,
  tourTitle,
  variant,
  tier,
}: BookThisTourProps) {
  const tb = useTranslations('forms.booking');
  const [open, setOpen] = useState(false);

  const tierLabel = tier ? tb(`tierLabel.${tier}`) : undefined;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={
          variant === 'primary'
            ? 'inline-flex items-center gap-2 border border-[#D4A23A] bg-[#D4A23A] px-8 py-4 font-mono text-[11px] uppercase tracking-[0.22em] text-[#0B0D10] transition hover:bg-transparent hover:text-[#D4A23A]'
            : 'inline-flex items-center justify-center gap-2 border border-[#F4F1EA]/30 px-6 py-3 font-mono text-[11px] uppercase tracking-[0.18em] text-[#F4F1EA] transition hover:border-[#D4A23A] hover:text-[#D4A23A]'
        }
      >
        {variant === 'primary'
          ? tb('trigger')
          : tb('triggerTier', { tier: tierLabel ?? '' })}
      </button>
      <BookingDialog
        open={open}
        onOpenChange={setOpen}
        tourSlug={tourSlug}
        tourTitle={tourTitle}
        defaultTier={tier}
        locale={locale}
        siteKey={siteKey}
      />
    </>
  );
}
```

- [ ] **Step 5: Wire `BookThisTour` into tour detail page**

Read the existing `src/app/[locale]/tours/[slug]/page.tsx` to find where the hero CTA and pricing tier buttons currently render (look for `pricingInquire` / `ctaPrimary` keys). Replace the existing placeholder CTA buttons with `<BookThisTour />`:

- Hero CTA (primary): `<BookThisTour variant="primary" locale={locale} siteKey={siteKey} tourSlug={tour.slug.current} tourTitle={resolveLocaleField(tour.title, locale)} />`
- Pricing tier buttons (three, one per tier): `<BookThisTour variant="tier" tier="standard|deluxe|private" locale={...} siteKey={...} tourSlug={...} tourTitle={...} />`

Import `BookThisTour` at the top:

```ts
import { BookThisTour } from '@/components/tour/book-this-tour';
```

Add at the top of the default export function (after locale/slug resolution):

```ts
const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
```

- [ ] **Step 6: Typecheck + lint + build**

Run: `pnpm typecheck && pnpm lint && pnpm build`
Expected: PASS.

- [ ] **Step 7: Manual submit test**

Run: `pnpm dev`

1. Visit a tour detail page, e.g. `http://localhost:3000/en/tours/<slug>`.
2. Click the primary hero CTA → dialog opens with no preselected tier.
3. Close via ✕; click a "Inquire · Deluxe" tier button → dialog opens with Deluxe tier preselected (verify the segmented control shows Deluxe active).
4. Fill required fields with valid data, submit → SuccessCard.
5. Try preferred date = yesterday → should fail with `dateTooSoon`.
6. Press Escape in an open dialog → dialog closes, focus returns to the trigger.
7. Repeat at `/ko/tours/<slug>` and `/mn/tours/<slug>`.

Stop dev server.

- [ ] **Step 8: Commit**

```bash
git add src/components/forms/booking-form.tsx src/components/forms/booking-dialog.tsx src/components/tour/book-this-tour.tsx src/app/api/booking/route.ts src/app/\[locale\]/tours/\[slug\]/page.tsx
git commit -m "feat(booking): wire BookingDialog, tour detail CTAs, and /api/booking route"
```

---

## Task 13: Sonner toaster registration + final QA sweep

**Files:**
- Modify: `src/app/[locale]/layout.tsx` (if `<Toaster />` not already mounted)

- [ ] **Step 1: Verify Sonner Toaster is mounted in layout**

Check `src/app/[locale]/layout.tsx` for `import { Toaster } from 'sonner'`. If absent, add it.

Example addition — at the top of the file:

```ts
import { Toaster } from 'sonner';
```

Inside the `<body>` JSX, near the end of the tree (inside `NextIntlClientProvider` or similar):

```tsx
<Toaster position="bottom-right" theme="dark" richColors />
```

If already mounted, skip this step.

- [ ] **Step 2: Run full automated gate**

Run:

```bash
pnpm typecheck && pnpm lint && pnpm build
```

Expected: PASS on all three. No new warnings.

- [ ] **Step 3: Manual QA — full journey matrix**

Run: `pnpm dev`

Go through the PRD §13 journeys:

**Journey 1 — tour booking:**
- [ ] `/en/tours/<slug>` → "Inquire · Deluxe" → dialog opens with Deluxe preselected → submit → SuccessCard → focus moves → dismiss → form resets.

**Journey 2 — locale switch mid-flow:**
- [ ] Fill half of `/en/contact` → switch to `/ko/contact` (via LanguageSwitcher) → verify form labels render in Korean. Submit with valid data → success card is Korean.

**Journey 4 — keyboard only:**
- [ ] Tab through Contact form. Space toggles consent. Enter submits. On success, focus lands on SuccessCard and (with VoiceOver/NVDA on) announces the title.

**Spam protection audit:**
- [ ] Open DevTools → Elements → find hidden `honeypot` input → type a value → submit. Expect: silent 200 response (Network panel) and no Sanity doc. Dev-server log shows `[api/<formType>] honeypot tripped`.
- [ ] Enable a request blocker on `challenges.cloudflare.com` → attempt submit. Expect: `TURNSTILE_FAILED` toast, widget resets. (Note: in dev without `TURNSTILE_SECRET_KEY`, server bypasses — repeat this check on a preview deploy with keys configured.)
- [ ] Submit Contact twice within 10 minutes from the same email → both submissions persist to Sanity, admin email fires twice, user email only fires once (check inbox; scan server logs for `dedupe`).

**Device matrix quick pass:**
- [ ] In DevTools device emulator, check each form at iPhone 375×667 (keyboard doesn't cover submit), iPad 768, desktop 1280.

**a11y scan:**
- [ ] Run axe DevTools on `/en/contact`, `/en/custom-trip`, and a tour detail with dialog open. Expect zero Serious/Critical.

Stop dev server.

- [ ] **Step 4: Commit (if any fixes were made)**

If QA uncovered issues and fixes were applied, commit them:

```bash
git add -p
git commit -m "fix(forms): resolve QA findings from manual sweep"
```

If no fixes needed, skip this commit.

- [ ] **Step 5: Run Task 18-style verification (parity with prior patterns)**

Run:

```bash
pnpm typecheck && pnpm lint && pnpm build
```

Expected: FULL PASS. Build output lists all three new API routes (`/api/contact`, `/api/custom-trip`, `/api/booking`) and all three locale-prefixed page routes.

- [ ] **Step 6: Final tag commit (optional)**

If all clean, tag the milestone:

```bash
git tag -a forms-email-pipeline-v1 -m "Forms & email pipeline initial implementation"
```

(Skip if you prefer not to tag.)

---

## Task 14: Deployment prerequisites (informational — NOT code)

These are runtime prerequisites the operator must arrange for production. No code changes here; document them in the PR description.

- [ ] **Step 1: Resend domain verification**

At [resend.com/domains](https://resend.com/domains):
1. Add domain `amuun.voidex.studio` (or chosen subdomain).
2. Add the printed MX, SPF (TXT), DKIM (TXT) records at the DNS provider for `voidex.studio`.
3. Add DMARC TXT record: `v=DMARC1; p=quarantine; rua=mailto:postmaster@voidex.studio`.
4. Wait for verification (Resend dashboard shows green).

Fallback: set `CONTACT_EMAIL_FROM=onboarding@resend.dev` in Vercel env until the domain is verified.

- [ ] **Step 2: Cloudflare Turnstile**

At [dash.cloudflare.com/turnstile](https://dash.cloudflare.com/?to=/:account/turnstile):
1. Create a site with widget mode = **Invisible / Managed**.
2. Allowed hostnames: `amuun.voidex.studio`, `localhost`.
3. Copy the **site key** (public) → set as `NEXT_PUBLIC_TURNSTILE_SITE_KEY`.
4. Copy the **secret** → set as `TURNSTILE_SECRET_KEY`.

- [ ] **Step 3: Vercel env variables**

In the Vercel project dashboard → Settings → Environment Variables, set (for Production + Preview):

```
RESEND_API_KEY
CONTACT_EMAIL_FROM
CONTACT_EMAIL_TO
NEXT_PUBLIC_TURNSTILE_SITE_KEY
TURNSTILE_SECRET_KEY
SANITY_API_WRITE_TOKEN           (confirm it has `create` scope on the submission type)
```

- [ ] **Step 4: Merge to main & preview smoke**

Open a PR. Once merged, run a manual smoke on the preview URL:
- Submit one of each form type with valid data.
- Verify a `submission` document appears in Sanity Studio under the correct formType filter.
- Verify admin + user emails arrive in their respective inboxes.
- Gmail → "Show original" → confirm SPF `pass` and DKIM `pass`.

---

## Self-Review

### Spec coverage

Checked against `docs/superpowers/specs/2026-04-20-forms-email-pipeline-design.md`:

| Spec section | Task |
|---|---|
| §2 Architecture (shared modules) | Tasks 4–8 |
| §3 Spam — honeypot | Task 8 (FormShell) |
| §3 Spam — Turnstile | Tasks 5, 8 |
| §3 Spam — consent | Task 8 (ConsentCheckbox) |
| §3 Spam — email dedupe | Task 5 (dedupe.ts), Task 6 (pipeline) |
| §4 Sanity schema | Task 2 |
| §4 Studio desk + permissions | Tasks 2, 3 |
| §4 Zod schemas | Task 4 |
| §5 Components & UI | Tasks 8, 10, 11, 12 |
| §5 Page integrations | Tasks 10, 11, 12 |
| §5 A11y | Tasks 8, 12 (SuccessCard focus, dialog Escape) |
| §6 i18n | Task 9 |
| §6 Email templates | Task 7 |
| §6 Env vars | Task 1 |
| §6 Resend DNS prereq | Task 14 |
| §7 Pipeline | Task 6 |
| §7 Error codes → UX | Task 8 (FormShell) |
| §7 Observability / PII discipline | Task 6 (pipeline logs) |
| §8 Security — CSRF (origin check) | Task 6 |
| §9 Testing (manual-first + gates) | Task 13 |
| §10 Risks | Surfaced in Task 14 (Resend fallback) |
| §11 Definition of Done | Task 13 sweep |
| §12 Rollout sequence | Plan task ordering mirrors rollout |

All spec sections covered.

### Placeholder scan

- No "TBD", "TODO", "implement later" strings in task bodies.
- Every code step contains runnable code; no `// ... handle this ...` gaps.
- Translation JSON has complete keys (no `"..."` placeholders).

### Type consistency

- `FormType` union (`'contact' | 'customTrip' | 'booking'`) used consistently in pipeline, emails, and API routes.
- `ApiResult` discriminant shape (`ok`, `error`, `fields`) matches FormShell's response parser.
- `BaseFields` in pipeline matches the base schema keys (`email`, `honeypot`, `turnstileToken`, `locale`).
- Schema output types (`ContactInput`, `CustomTripInput`, `BookingInput`) are used by both forms and API routes.

No inconsistencies found.

---
