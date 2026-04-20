import { defineField, defineType } from 'sanity';

export const submission = defineType({
  name: 'submission',
  title: 'Form submission',
  type: 'document',
  readOnly: true,
  fields: [
    defineField({
      name: 'formType',
      title: 'Form type',
      type: 'string',
      options: {
        list: [
          { title: 'Contact', value: 'contact' },
          { title: 'Custom trip', value: 'customTrip' },
          { title: 'Booking inquiry', value: 'booking' },
          { title: 'Newsletter', value: 'newsletter' },
        ],
      },
      validation: (r) => r.required(),
    }),
    defineField({ name: 'name', title: 'Name', type: 'string' }),
    defineField({ name: 'email', title: 'Email', type: 'string' }),
    defineField({ name: 'phone', title: 'Phone', type: 'string' }),
    defineField({ name: 'message', title: 'Message', type: 'text' }),
    defineField({ name: 'interest', title: 'Interest', type: 'string' }),
    defineField({ name: 'tourSlug', title: 'Tour slug', type: 'string' }),
    defineField({ name: 'metadata', title: 'Metadata (JSON)', type: 'text', rows: 4 }),
    defineField({
      name: 'submittedAt',
      title: 'Submitted at',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { title: 'New', value: 'new' },
          { title: 'In progress', value: 'inProgress' },
          { title: 'Resolved', value: 'resolved' },
          { title: 'Spam', value: 'spam' },
        ],
      },
      initialValue: 'new',
      readOnly: false,
    }),
  ],
  orderings: [
    { title: 'Newest first', name: 'submittedDesc', by: [{ field: 'submittedAt', direction: 'desc' }] },
  ],
  preview: {
    select: { formType: 'formType', name: 'name', email: 'email', submittedAt: 'submittedAt' },
    prepare: ({ formType, name, email, submittedAt }) => ({
      title: `[${formType}] ${name ?? email ?? '(anonymous)'}`,
      subtitle: submittedAt?.slice(0, 16).replace('T', ' '),
    }),
  },
});
