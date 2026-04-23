import { z } from 'zod';

export const localeEnum = z.enum(['en', 'ko', 'mn']);

export const baseSubmissionSchema = z.object({
  name: z.string().trim().min(2, 'minLength').max(100, 'maxLength'),
  email: z.string().trim().email('email').max(254, 'maxLength'),
  phone: z
    .string()
    .trim()
    .min(7, 'minLength')
    .max(30, 'maxLength')
    .optional()
    .or(z.literal('')),
  message: z.string().trim().min(10, 'minLength').max(2000, 'maxLength'),
  locale: localeEnum,
  consentAccepted: z.literal(true, { message: 'consent' }),
  honeypot: z.literal('', { message: 'honeypot' }),
  turnstileToken: z.string().min(1, 'turnstile'),
});

export type BaseSubmissionInput = z.infer<typeof baseSubmissionSchema>;
