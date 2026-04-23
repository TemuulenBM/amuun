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
