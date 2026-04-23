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
