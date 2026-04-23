import { z } from 'zod';
import { baseSubmissionSchema } from './base.schema';

export const bookingTierEnum = z.enum(['standard', 'deluxe', 'private']);

function toUtcDateOnly(d: Date): number {
  return Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
}

function todayUtc(): number {
  const now = new Date();
  return Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
}

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
    (data) => toUtcDateOnly(data.preferredStartDate) >= todayUtc(),
    { message: 'dateTooSoon', path: ['preferredStartDate'] },
  );

export type BookingInput = z.infer<typeof bookingSchema>;
