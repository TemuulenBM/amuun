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
