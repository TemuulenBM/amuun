import { defineField, defineType } from 'sanity';

export const submission = defineType({
  name: 'submission',
  title: 'Form submission',
  type: 'document',
  fields: [
    defineField({
      name: 'formType',
      title: 'Form type',
      type: 'string',
      readOnly: true,
      options: {
        list: [
          { title: 'Contact', value: 'contact' },
          { title: 'Custom trip', value: 'customTrip' },
          { title: 'Booking inquiry', value: 'booking' },
        ],
      },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { title: 'New', value: 'new' },
          { title: 'Responded', value: 'responded' },
          { title: 'Archived', value: 'archived' },
        ],
      },
      initialValue: 'new',
      validation: (r) => r.required(),
    }),
    // Submitter fields — read-only audit record
    defineField({ name: 'name', title: 'Name', type: 'string', readOnly: true }),
    defineField({ name: 'email', title: 'Email', type: 'string', readOnly: true }),
    defineField({ name: 'phone', title: 'Phone', type: 'string', readOnly: true }),
    defineField({ name: 'message', title: 'Message', type: 'text', rows: 6, readOnly: true }),
    defineField({
      name: 'locale',
      title: 'Locale',
      type: 'string',
      readOnly: true,
      options: { list: ['en', 'ko', 'mn'] },
    }),
    defineField({
      name: 'consentAccepted',
      title: 'Consent accepted',
      type: 'boolean',
      readOnly: true,
    }),
    defineField({
      name: 'consentedAt',
      title: 'Consented at',
      type: 'datetime',
      readOnly: true,
    }),
    defineField({
      name: 'payload',
      title: 'Form payload',
      type: 'object',
      readOnly: true,
      fields: [
        // contact
        defineField({ name: 'subject', type: 'string', readOnly: true }),
        // custom trip
        defineField({ name: 'partySize', type: 'number', readOnly: true }),
        defineField({ name: 'travelStartDate', type: 'date', readOnly: true }),
        defineField({ name: 'travelEndDate', type: 'date', readOnly: true }),
        defineField({ name: 'interests', type: 'array', of: [{ type: 'string' }], readOnly: true }),
        defineField({ name: 'budgetRange', type: 'string', readOnly: true }),
        // booking
        defineField({ name: 'tourSlug', type: 'string', readOnly: true }),
        defineField({ name: 'tourTitle', type: 'string', readOnly: true }),
        defineField({ name: 'preferredStartDate', type: 'date', readOnly: true }),
        defineField({ name: 'adults', type: 'number', readOnly: true }),
        defineField({ name: 'children', type: 'number', readOnly: true }),
        defineField({ name: 'tier', type: 'string', readOnly: true }),
        defineField({ name: 'specialRequests', type: 'text', rows: 3, readOnly: true }),
      ],
    }),
    defineField({
      name: 'meta',
      title: 'Request metadata',
      type: 'object',
      readOnly: true,
      fields: [
        defineField({ name: 'ip', type: 'string', readOnly: true }),
        defineField({ name: 'userAgent', type: 'string', readOnly: true }),
        defineField({ name: 'referrer', type: 'string', readOnly: true }),
        defineField({ name: 'submittedAt', type: 'datetime', readOnly: true }),
      ],
    }),
  ],
  orderings: [
    {
      title: 'Newest',
      name: 'newest',
      by: [{ field: '_createdAt', direction: 'desc' }],
    },
  ],
  preview: {
    select: {
      name: 'name',
      email: 'email',
      formType: 'formType',
      status: 'status',
      submittedAt: 'meta.submittedAt',
    },
    prepare: ({ name, email, formType, status, submittedAt }) => ({
      title: `${name ?? email ?? '(anonymous)'} · ${formType ?? 'unknown'}`,
      subtitle: email ?? '',
      description: `${status ?? 'new'} · ${submittedAt ? submittedAt.slice(0, 16).replace('T', ' ') : ''}`,
    }),
  },
});
