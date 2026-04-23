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
