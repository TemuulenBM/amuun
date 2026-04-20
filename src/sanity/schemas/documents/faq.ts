import { defineField, defineType } from 'sanity';

export const faq = defineType({
  name: 'faq',
  title: 'FAQ',
  type: 'document',
  fields: [
    defineField({ name: 'question', title: 'Question', type: 'localeString', validation: (r) => r.required() }),
    defineField({ name: 'answer', title: 'Answer', type: 'localeText', validation: (r) => r.required() }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'General', value: 'general' },
          { title: 'Booking', value: 'booking' },
          { title: 'During trip', value: 'during' },
          { title: 'Visa & arrival', value: 'visa' },
        ],
        layout: 'radio',
      },
      validation: (r) => r.required(),
    }),
    defineField({ name: 'order', title: 'Display order', type: 'number', initialValue: 0 }),
  ],
  orderings: [
    {
      title: 'Category, then order',
      name: 'categoryOrder',
      by: [
        { field: 'category', direction: 'asc' },
        { field: 'order', direction: 'asc' },
      ],
    },
  ],
  preview: {
    select: { title: 'question.en', category: 'category' },
    prepare: ({ title, category }) => ({
      title: title ?? '(no question)',
      subtitle: category ? `[${category}]` : undefined,
    }),
  },
});
