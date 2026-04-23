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
