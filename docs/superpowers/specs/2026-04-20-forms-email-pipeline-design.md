# Forms & Email Pipeline — Design Specification

**Date:** 2026-04-20
**Scope:** PRD features F18 Contact, F19 Contact API + Resend, F20 Custom Trip, F21 Booking inquiry
**Status:** Approved design, pending implementation plan

---

## 1. Purpose & Context

Deliver the three lead-capture forms for the Amuun portfolio demo: Contact, Custom Trip, and Booking inquiry. Every form shares a single server-side pipeline that validates input, verifies the submitter is human, persists the submission to Sanity, and dispatches transactional email to both the admin inbox and the submitter.

**Explicitly out of scope:** Newsletter signup (F22), file attachments, Slack/Discord webhooks, CSV export, submission analytics dashboard, automated GDPR deletion.

**Non-negotiable constraints (from PRD §4):**

- Client + server Zod validation (shared schema)
- Honeypot spam trap
- Bot protection (substituting Cloudflare Turnstile for IP rate limiting — see §3)
- Parallel persistence to Sanity + dispatch via Resend
- Toast/inline feedback with retry path
- Multi-language: EN, KO, MN

---

## 2. Architecture Overview

```
[Client: React Hook Form + Zod]
      │  POST /api/{contact|custom-trip|booking}
      ▼
[Next.js API Route — shared pipeline]
      │
      ├── 1. JSON parse
      ├── 2. Zod parse (shared schema)
      ├── 3. Honeypot check (silent 200 if tripped)
      ├── 4. Cloudflare Turnstile server-side verify
      ├── 5. Email dedupe check (same email in last 10 min?)
      ├── 6. Promise.allSettled:
      │     ├─ Sanity write (submission doc)
      │     ├─ Resend admin email
      │     └─ Resend user confirmation (skipped if dedupe tripped)
      └── 7. Response { ok, submissionId } | { ok:false, error }
           ▼
[Client] Inline SuccessCard (a11y focus) | Sonner error toast + retry
```

### Shared modules

- `src/lib/forms/pipeline.ts` — parse → validate → honeypot → Turnstile → dedupe → parallel persist.
- `src/lib/forms/turnstile.ts` — `verifyTurnstileToken(token, ip): Promise<boolean>`.
- `src/lib/forms/dedupe.ts` — `hasRecentConfirmation(email): Promise<boolean>` via Sanity GROQ.
- `src/lib/schemas/*.schema.ts` — Zod schemas shared between client and server.
- `src/components/forms/` — React components (detail in §5).
- `src/emails/` — React Email templates (detail in §6).
- `src/sanity/schemas/submission.ts` — single document type (detail in §4).

### Rendering boundaries

- Route pages (`/contact`, `/custom-trip`) are server components. Form is a child client component (`"use client"`).
- Tour detail page (`/tours/[slug]`) stays server-rendered; booking CTA + dialog are isolated client components.
- React Email templates render server-side inside the API route only.

---

## 3. Spam & Abuse Strategy

**No IP-based rate limiter.** Replaced with:

1. **Honeypot field** — hidden input; non-empty means bot; return silent `200` to mask the trap.
2. **Cloudflare Turnstile** — invisible widget; server-side `siteverify` before processing. Free, unlimited, better UX than CAPTCHA. Handles automated abuse at entry rather than after N submissions.
3. **Required consent checkbox** — Zod `literal(true)` gate; bots filling forms without checking will fail validation.
4. **Email dedupe on user confirmation** — before sending the user-facing confirmation email, check Sanity for a submission with the same `email` in the last 10 minutes. If found, skip the user email but still persist the submission. Prevents attackers from using the form as an email bomb relay against arbitrary victims.

---

## 4. Data Model

### Sanity `submission` schema

Single document type with `formType` discriminator and typed `payload` object.

```ts
{
  _type: 'submission',
  formType: 'contact' | 'customTrip' | 'booking',
  status: 'new' | 'responded' | 'archived',       // editable
  // Common fields — readOnly for all users
  name: string,
  email: string,
  phone?: string,
  message: string,
  locale: 'en' | 'ko' | 'mn',
  consentAccepted: true,
  consentedAt: datetime,
  // Form-specific — readOnly
  payload: {
    // contact
    subject?: 'general' | 'press' | 'partnership' | 'other',
    // customTrip
    partySize?: number,
    travelStartDate?: date,
    travelEndDate?: date,
    interests?: ('culture' | 'nature' | 'adventure' | 'food')[],
    budgetRange?: 'under-3k' | '3k-5k' | '5k-10k' | '10k-plus',
    // booking
    tour?: reference<tour>,
    preferredStartDate?: date,
    adults?: number,
    children?: number,
    tier?: 'standard' | 'deluxe' | 'private',
    specialRequests?: string,
  },
  meta: {                                          // readOnly
    ip: string,
    userAgent: string,
    referrer?: string,
    submittedAt: datetime,
  },
}
```

**Permissions (resolving readOnly vs status workflow conflict):**

- Submitter-supplied fields (`name`, `email`, `phone`, `message`, `locale`, `consent*`, `payload`, `meta`) are `readOnly: true` in Studio — prevents tampering with the audit record.
- `status` is editable by any Studio user with admin role. Implemented as field-level `readOnly: false` on `status` only.
- `preview.prepare` returns `{ title: ${name} · ${formType}, subtitle: email, description: status }`.
- Ordering: `[{ title: 'Newest', by: [{ field: '_createdAt', direction: 'desc' }], default: true }]`.

**Studio desk structure:**

- Top-level `Submissions` node.
- Sub-items: `All`, `Contact`, `Custom Trip`, `Booking`, `Archived` (each filtered via GROQ).
- Status badge in list view (gold=new, gray=responded, muted=archived).

### Zod schemas (client + server shared)

`src/lib/schemas/base.schema.ts`:

```ts
baseSubmissionSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email().max(254),
  phone: z.string().min(7).max(30).optional().or(z.literal('')),
  message: z.string().min(10).max(2000),
  locale: z.enum(['en', 'ko', 'mn']),
  consentAccepted: z.literal(true),
  honeypot: z.literal(''),           // must be empty
  turnstileToken: z.string().min(1),
});
```

Per-form schemas extend the base with discriminator + payload fields:

- `contact.schema.ts` — `subject: z.enum([...]).optional()`.
- `custom-trip.schema.ts` — `partySize: z.number().int().min(1).max(20)`, `travelStartDate: z.coerce.date().refine(d => d >= addDays(today, 7))`, `travelEndDate: z.coerce.date()`, cross-field `.refine(data => data.travelEndDate > data.travelStartDate && differenceInDays(data.travelEndDate, data.travelStartDate) <= 60)`, `interests: z.array(z.enum([...])).min(1).max(4)`, `budgetRange: z.enum([...])`.
- `booking.schema.ts` — `tourSlug: z.string().min(1)`, `preferredStartDate: z.coerce.date().refine(d => d >= today)`, `adults: z.number().int().min(1).max(20)`, `children: z.number().int().min(0).max(20)`, `tier: z.enum(['standard', 'deluxe', 'private'])`, `specialRequests: z.string().max(1000).optional()`.

Server-side validation uses the same schema. Zod error messages stay in English at schema level; UI layer maps codes to `t('forms.common.errors.*')` translations.

---

## 5. Components & UI

### Component tree (`src/components/forms/`)

- `form-shell.tsx` — wraps `<form>`, handles submit orchestration, renders honeypot, Turnstile widget, consent, submit button, loading state.
- `form-field.tsx` — labeled input/textarea/select with error message (`aria-describedby`, `aria-invalid`).
- `consent-checkbox.tsx` — required checkbox linking to `/privacy` and `/terms` via next-intl rich text interpolation.
- `turnstile-widget.tsx` — Cloudflare Turnstile client widget (`@marsidev/react-turnstile` or official script loader), invisible mode, emits token to RHF.
- `success-card.tsx` — inline success state; on mount `ref.focus()` + `role="status" aria-live="polite"`; features stamp seal + serif heading; includes dismiss button that resets form.
- `contact-form.tsx` — single fieldset; name/email/phone/subject/message.
- `custom-trip-form.tsx` — two fieldsets (`About you`, `Your journey`); number stepper, date range, chip multi-select, radio group.
- `booking-form.tsx` — modal body; inherits `defaultTier` prop; renders tour title + hero thumbnail; two number steppers (adults/children); tier segmented control; date + special requests.
- `booking-dialog.tsx` — shadcn Dialog wrapper; mounted on tour detail page; accepts `{ tour, defaultTier? }` props.

### Page integrations

| Route | Change |
|---|---|
| `src/app/[locale]/contact/page.tsx` | Stub → full page: editorial hero + two-column layout (office info + map on right, `<ContactForm />` on left) |
| `src/app/[locale]/custom-trip/page.tsx` | Stub → full page: editorial hero + intro copy + `<CustomTripForm />` |
| `src/app/[locale]/tours/[slug]/page.tsx` | Insert `"Inquire about this tour"` CTA in hero section and three `"Inquire ({tier})"` buttons in pricing section. All mount `<BookingDialog tour={tour} defaultTier={tier?} />` |

### Booking tier pre-selection wiring

Pricing section renders three `<Button>` elements with `onClick={() => setDialog({ open: true, defaultTier: 'standard' })}` etc. Dialog consumes a small local state (`useState`) on tour detail to control `open` + `defaultTier`. On close, state resets.

### Accessibility

- Every input has an explicit `<label htmlFor>`.
- Errors linked via `aria-describedby={errorId}` + `aria-invalid={true}`.
- Honeypot: `className="sr-only" tabIndex={-1} aria-hidden="true" autoComplete="off"`.
- Consent checkbox marked required; `aria-required="true"`.
- Dialog: Radix handles focus trap, `aria-modal`, Escape to close.
- SuccessCard mounts with `ref.focus()` and `role="status" aria-live="polite"`; screen readers announce the confirmation automatically.
- Turnstile: invisible in "managed" mode; falls back to visible challenge for suspicious users. Marked `aria-hidden="true"` wrapper; challenge UI is already accessible from Cloudflare.
- All interactive elements have visible focus rings (gold, 2px, offset 2px).

### Visual treatment

- Labels: Inter, uppercase, tracking-wider, small size.
- Headings (page titles, success card): SangBleu/Cormorant serif.
- Inputs: cream background, navy border 1px, gold focus ring, 12px padding.
- Submit: navy fill, cream text, gold hover tint, arrow icon.
- Error state: red-600 border, message in red-700 text.
- Success state: stamp seal component + "Message received" serif heading + cream card with navy border.

---

## 6. i18n & Email Templates

### Translation structure (`src/messages/{en,ko,mn}.json`)

```json
{
  "forms": {
    "common": {
      "name": "...",
      "email": "...",
      "phone": "...",
      "message": "...",
      "submit": "...",
      "submitting": "...",
      "consent": "I agree to the <privacy>Privacy Policy</privacy> and <terms>Terms of Service</terms>.",
      "success": { "title": "...", "body": "...", "dismiss": "..." },
      "errors": {
        "required": "...",
        "email": "...",
        "minLength": "...",
        "maxLength": "...",
        "consent": "...",
        "turnstile": "...",
        "serviceUnavailable": "...",
        "dateTooSoon": "...",
        "dateRange": "...",
        "partySize": "..."
      }
    },
    "contact": {
      "title": "...", "intro": "...",
      "subject": { "label": "...", "options": { "general", "press", "partnership", "other" } }
    },
    "customTrip": {
      "title": "...", "intro": "...",
      "fieldsets": { "aboutYou": "...", "yourJourney": "..." },
      "partySize": "...", "travelWindow": { "start": "...", "end": "..." },
      "interests": { "culture", "nature", "adventure", "food" },
      "budget": { "label", "options": { "under3k", "3k5k", "5k10k", "10kPlus" } }
    },
    "booking": {
      "trigger": "Inquire about this tour",
      "triggerTier": "Inquire ({tier})",
      "title": "...", "tierLabel": { "standard", "deluxe", "private" },
      "adults": "...", "children": "...", "preferredDate": "...", "specialRequests": "..."
    }
  }
}
```

**Language voice:**

- **EN** canonical, editorial register.
- **KO** sophisticated, formal register (존댓말, 품격 있는 어휘).
- **MN** natural, native voice — not translated-feeling.

### React Email templates (`src/emails/`)

- `email-shell.tsx` — shared wrapper: cream background, 600px width, navy text, Inter font, stamp seal header, footer with company info. Mobile responsive.
- `admin-notification.tsx` — sent to `CONTACT_EMAIL_TO`; subject `[{formType}] New inquiry from {name}`; body lists all submitted fields + link back to Sanity Studio; `reply-to` set to submitter's email so admin's "Reply" goes to user.
- `user-confirmation.tsx` — sent to `data.email`; locale-aware subject `We received your inquiry · Amuun`; editorial thank-you note; summary of what they submitted; "respond within 24 hours" promise; for Booking includes tour title + thumbnail.

### Env vars

```
CONTACT_EMAIL_FROM=hello@amuun.voidex.studio          # Resend-verified domain
CONTACT_EMAIL_TO=inquiries@voidex.studio              # admin inbox
RESEND_API_KEY=re_...
NEXT_PUBLIC_TURNSTILE_SITE_KEY=...
TURNSTILE_SECRET_KEY=...
SANITY_API_WRITE_TOKEN=...                             # already exists; needs write scope
```

All env vars validated at startup via `src/lib/env.ts` (existing Zod validator).

### Resend domain deliverability prerequisite

Before live email dispatch works:

1. Add `amuun.voidex.studio` (or chosen subdomain) in Resend dashboard.
2. Add three DNS records (MX, TXT for SPF, TXT for DKIM) to the domain's DNS.
3. Add DMARC TXT record (`v=DMARC1; p=quarantine; rua=mailto:postmaster@voidex.studio`).
4. Wait for Resend verification (typically <1 hour; can take up to 24).
5. Fallback during setup: use `onboarding@resend.dev` as `from` (PRD Emergency Scenarios, §11).

---

## 7. API Pipeline Detail

### Endpoint structure

```
src/app/api/contact/route.ts        (POST)
src/app/api/custom-trip/route.ts    (POST)
src/app/api/booking/route.ts        (POST)
```

Each ~20 lines — calls `processSubmission()` with form-specific schema, Sanity payload builder, admin email builder, user email builder.

### `processSubmission()` signature

```ts
async function processSubmission<T extends BaseSubmission>(opts: {
  schema: ZodSchema<T>;
  formType: 'contact' | 'customTrip' | 'booking';
  request: NextRequest;
  buildSanityPayload: (data: T) => Record<string, unknown>;
  buildAdminEmail: (data: T, submissionId: string) => ReactElement;
  buildUserEmail: (data: T, submissionId: string) => ReactElement;
}): Promise<NextResponse>
```

### Pipeline steps

1. **JSON parse** — try/catch; malformed body → `400 { ok:false, error:'INVALID_JSON' }`.
2. **Zod validate** — failure → `400 { ok:false, error:'VALIDATION', fields:{ email:'...', ... } }`.
3. **Honeypot check** — `data.honeypot !== ''` → return `200 { ok:true, submissionId:'skipped' }` without persisting; log `[forms] honeypot tripped` (no email/IP).
4. **Turnstile verify** — POST to `https://challenges.cloudflare.com/turnstile/v0/siteverify` with `secret`, `response`, `remoteip`. Non-success → `403 { ok:false, error:'TURNSTILE_FAILED' }`.
5. **Email dedupe check** — GROQ `count(*[_type == "submission" && email == $email && _createdAt > $tenMinAgo])`; if `> 0`, set `skipUserEmail = true` (still persist + admin email).
6. **Parallel persist** (`Promise.allSettled`):
   - `sanity.create({ _type: 'submission', formType, ..., payload, meta })` → returns `submissionId`.
   - `resend.emails.send({ from, to: CONTACT_EMAIL_TO, replyTo: data.email, subject, react: buildAdminEmail(...) })`.
   - If `!skipUserEmail`: `resend.emails.send({ from, to: data.email, subject, react: buildUserEmail(...) })`.
7. **Partial failure handling:**
   - Sanity fails, Resend succeeds → `500 { ok:false, error:'SERVICE_UNAVAILABLE' }`; log with full context (data loss risk).
   - Sanity succeeds, Resend fails → `200 { ok:true, submissionId, emailWarning:true }`; log warning; client still shows success (lead captured).
   - Both fail → `500 { ok:false, error:'SERVICE_UNAVAILABLE' }`.
8. **Success** — `200 { ok:true, submissionId }`.

### Error codes → client UX

| Code | HTTP | Client response |
|---|---|---|
| `INVALID_JSON` | 400 | Toast: `t('errors.serviceUnavailable')` + retry |
| `VALIDATION` | 400 | Inline field errors (maps `fields.*` to form state) |
| `TURNSTILE_FAILED` | 403 | Toast: `t('errors.turnstile')`; reset Turnstile widget |
| `SERVICE_UNAVAILABLE` | 500 | Toast + retry button |
| `ok:true` | 200 | Inline `SuccessCard` (focus moved, announced) |

### Observability

- `console.error('[api/{formType}] <reason>', { submissionId, ip, error: err.message })` — Vercel Logs.
- Vercel Analytics custom event: `track('form_submit', { formType, locale })`.
- **PII discipline:** never log full `email`, `phone`, `message`, or `name`. Log only `submissionId`, `ip`, `formType`, `error message`.

---

## 8. Security Considerations

1. **CSRF** — API routes accept same-origin POSTs only; rely on Next.js default same-origin policy + no cookies used for auth (public endpoints). Explicit `Origin` header check in pipeline rejects cross-origin requests.
2. **PII in logs** — strict whitelist of loggable fields (see §7 Observability).
3. **Email spoofing via user confirmation** — mitigated by dedupe check (§3.4).
4. **Injection** — Zod sanitizes input types; Sanity client handles escaping; React Email escapes by default. No `dangerouslySetInnerHTML` anywhere in email templates.
5. **Token exposure** — `TURNSTILE_SECRET_KEY`, `RESEND_API_KEY`, `SANITY_API_WRITE_TOKEN` are server-only env vars; never referenced in client code.
6. **Consent audit trail** — `consentAccepted`, `consentedAt` persisted for GDPR compliance.
7. **DoS hardening** — Turnstile at edge, honeypot pre-pipeline, `maxDuration: 10` on API routes.

---

## 9. Testing Strategy

Manual-first (PRD §13 mandates no unit/E2E tests in scope). Automated checks support.

### Per-form functional matrix

- Valid submit → inline SuccessCard renders, focus moves, Sanity doc created, both emails dispatched.
- Invalid email → inline field error.
- Empty required field → inline field error.
- Consent unchecked → submit button disabled.
- Honeypot filled (DevTools) → silent 200, no Sanity doc, no email.
- Turnstile failed (block `challenges.cloudflare.com` in DevTools) → 403, toast error, widget resets.
- Dedupe hit (submit twice within 10 min from same email) → second submission persisted, admin email sent, user email skipped.
- Resend key missing → Sanity doc created, client sees success + `emailWarning` (warning logged).
- Date validation edge cases — start < today+7 rejected, end ≤ start rejected, range > 60 days rejected.

### Journey tests (PRD §13)

- **Journey 1:** tour detail → "Inquire (Deluxe)" → dialog opens with `defaultTier='deluxe'` preselected → submit → success card.
- **Journey 2:** `/en/contact` → submit → switch to `/ko/contact` → labels + errors + success render Korean.
- **Journey 4 (keyboard only):** Tab through form → Space toggles consent → Enter submits → focus moves to SuccessCard → screen reader announces success.

### Device matrix (PRD §13)

- iPhone 375×667 — stacked, native date picker, keyboard doesn't cover submit button.
- iPad 768 — Contact two-column resolves correctly.
- Desktop 1280 — full layout.
- Dark mode — WCAG AA contrast on all field states.
- Safari iOS — date picker native, autofill populates name/email.

### Automated checks

- `pnpm typecheck` — clean.
- `pnpm lint` — clean.
- `pnpm build` — successful.
- axe DevTools a11y scan on `/contact`, `/custom-trip`, and tour detail with modal open.

### Pre-merge verification

- Preview deployment: submit all three forms, verify Sanity receives docs, emails arrive in test inbox.
- Turnstile widget loads without ad-block errors.
- SPF/DKIM pass in email headers (Gmail "Show original").

---

## 10. Risks & Mitigations

| Risk | Severity | Mitigation |
|---|---|---|
| Resend domain verification delayed | Medium | Use `onboarding@resend.dev` fallback; case-study note about production domain |
| Turnstile widget blocked by aggressive ad-block | Medium | Submit disabled with message `"Verification required — please disable ad-block"`; Turnstile offers `managed` mode with fallback UI |
| Sanity write quota approached | Low | Free tier = 500 docs/day; portfolio traffic stays well below |
| Bot bypasses Turnstile + honeypot | Low | Consent checkbox + dedupe caps email bomb potential |
| PII leaked in Vercel Logs | Low | Strict log whitelist + quarterly log scrubbing |
| GDPR data subject request | Low | Manual deletion via Sanity Studio (automation deferred) |
| Email bounces (invalid submitter email) | Low | Resend retries automatically; bounce rate visible in Resend dashboard |

---

## 11. Definition of Done

- [ ] Sanity `submission` schema deployed; `readOnly` applied to submitter fields, `status` editable
- [ ] Sanity Studio desk structure shows `Submissions` with filtered sub-nodes
- [ ] Env vars validated on build (`src/lib/env.ts` extended)
- [ ] Resend domain verified (or fallback with documented note)
- [ ] Turnstile keys in Vercel env
- [ ] Shared pipeline (`processSubmission`) covers all three forms
- [ ] `/contact`, `/custom-trip` pages rendered with form; stubs replaced
- [ ] Tour detail pages integrate `BookingDialog` with tier pre-selection
- [ ] 3 forms submit successfully end-to-end in production preview
- [ ] Admin + user emails arrive; headers pass SPF/DKIM (or documented fallback)
- [ ] Translations complete in EN, KO, MN (no hardcoded strings)
- [ ] Consent checkbox required; links to `/privacy`, `/terms`
- [ ] Honeypot + Turnstile + dedupe verified via manual test
- [ ] SuccessCard a11y verified (focus + aria-live)
- [ ] Mobile 375px verified on all three forms
- [ ] Dark mode contrast passes WCAG AA
- [ ] `pnpm typecheck && pnpm lint && pnpm build` all clean
- [ ] axe DevTools: zero serious/critical issues on form pages
- [ ] Vercel Analytics emits `form_submit` event with `formType` + `locale`

---

## 12. Rollout Sequence (high-level — detailed steps in implementation plan)

0. **Prerequisite:** Resend domain setup (DNS records, ~1h propagation); Turnstile site created at dash.cloudflare.com; Vercel env vars added.
1. **Foundation:** Sanity `submission` schema + Zod base + Zod per-form + env validator extension.
2. **Pipeline core:** `processSubmission()` + Turnstile verifier + dedupe helper + React Email shell.
3. **Email templates:** admin-notification + user-confirmation with i18n.
4. **Contact form:** full `/contact` page + `/api/contact` route. End-to-end smoke test.
5. **Custom Trip form:** full `/custom-trip` page + `/api/custom-trip` route.
6. **Booking modal:** BookingDialog + tour detail CTA integration + `/api/booking` route.
7. **i18n completion:** EN/KO/MN translations for every visible string.
8. **Sanity Studio UX:** desk structure + status badge + ordering.
9. **Manual QA pass:** device matrix + journey tests + a11y scan.
10. **Deploy:** merge to main, verify production submissions + email delivery.

---

## 13. Open Questions

_None as of approval._ All major architectural decisions resolved during brainstorming. Minor implementation details (exact copy, visual spacing, animation timing) will be handled during build.
