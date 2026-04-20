import { defineField, defineType } from 'sanity';

export const testimonial = defineType({
  name: 'testimonial',
  title: 'Testimonial',
  type: 'document',
  fields: [
    defineField({ name: 'name', title: 'Name', type: 'string', validation: (r) => r.required() }),
    defineField({
      name: 'nationality',
      title: 'Nationality',
      type: 'string',
      validation: (r) => r.required(),
      description: 'ISO country name. Shown beneath the name.',
    }),
    defineField({ name: 'quote', title: 'Quote', type: 'localeText', validation: (r) => r.required() }),
    defineField({
      name: 'avatar',
      title: 'Avatar',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'tour',
      title: 'Tour',
      type: 'reference',
      to: [{ type: 'tour' }],
      description: 'Optional: the tour this testimonial references.',
    }),
    defineField({ name: 'featured', title: 'Featured', type: 'boolean', initialValue: false }),
    defineField({ name: 'submittedAt', title: 'Submitted at', type: 'datetime', initialValue: () => new Date().toISOString() }),
  ],
  orderings: [
    { title: 'Newest first', name: 'submittedDesc', by: [{ field: 'submittedAt', direction: 'desc' }] },
    { title: 'Featured first', name: 'featuredFirst', by: [{ field: 'featured', direction: 'desc' }] },
  ],
  preview: {
    select: { title: 'name', nationality: 'nationality', quote: 'quote.en', media: 'avatar' },
    prepare: ({ title, nationality, quote, media }) => ({
      title: title ?? '(anonymous)',
      subtitle: [nationality, quote?.slice(0, 60)].filter(Boolean).join(' · '),
      media,
    }),
  },
});
