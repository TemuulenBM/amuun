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
