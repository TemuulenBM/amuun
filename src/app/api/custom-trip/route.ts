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
