import { z } from 'zod';
import { baseSubmissionSchema } from './base.schema';

export const interestEnum = z.enum(['culture', 'nature', 'adventure', 'food']);
export const budgetEnum = z.enum([
  'under-3k',
  '3k-5k',
  '5k-10k',
  '10k-plus',
]);

const MIN_ADVANCE_DAYS = 7;
const MAX_DURATION_DAYS = 60;

function toUtcDateOnly(d: Date): number {
  return Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
}

function diffDaysUtc(later: Date, earlier: Date): number {
  const MS = 1000 * 60 * 60 * 24;
  return Math.round((toUtcDateOnly(later) - toUtcDateOnly(earlier)) / MS);
}

function todayUtc(): Date {
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
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
      .max(4, 'maxLength')
      .refine((arr) => new Set(arr).size === arr.length, {
        message: 'duplicate',
      }),
    budgetRange: budgetEnum,
  })
  .refine(
    (data) => diffDaysUtc(data.travelStartDate, todayUtc()) >= MIN_ADVANCE_DAYS,
    { message: 'dateTooSoon', path: ['travelStartDate'] },
  )
  .refine(
    (data) =>
      toUtcDateOnly(data.travelEndDate) > toUtcDateOnly(data.travelStartDate),
    { message: 'dateRangeOrder', path: ['travelEndDate'] },
  )
  .refine(
    (data) =>
      diffDaysUtc(data.travelEndDate, data.travelStartDate) <= MAX_DURATION_DAYS,
    { message: 'dateRangeTooLong', path: ['travelEndDate'] },
  );

export type CustomTripInput = z.infer<typeof customTripSchema>;
