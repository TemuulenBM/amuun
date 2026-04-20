import { defineField, defineType } from 'sanity';

export const tour = defineType({
  name: 'tour',
  title: 'Tour',
  type: 'document',
  groups: [
    { name: 'content', title: 'Content', default: true },
    { name: 'details', title: 'Details' },
    { name: 'itinerary', title: 'Itinerary' },
    { name: 'pricing', title: 'Pricing' },
    { name: 'relations', title: 'Relations' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'localeString', group: 'content', validation: (r) => r.required() }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: 'content',
      options: { source: 'title.en', maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({ name: 'summary', title: 'Summary', type: 'localeText', group: 'content', validation: (r) => r.required() }),
    defineField({ name: 'description', title: 'Long description', type: 'localeBlockContent', group: 'content' }),
    defineField({ name: 'heroImage', title: 'Hero image', type: 'imageWithAlt', group: 'content', validation: (r) => r.required() }),
    defineField({
      name: 'gallery',
      title: 'Gallery',
      type: 'array',
      group: 'content',
      of: [{ type: 'imageWithAlt' }],
      validation: (r) => r.min(3),
    }),
    defineField({
      name: 'duration',
      title: 'Duration (days)',
      type: 'number',
      group: 'details',
      validation: (r) => r.required().integer().min(1).max(60),
    }),
    defineField({
      name: 'difficulty',
      title: 'Difficulty',
      type: 'string',
      group: 'details',
      options: {
        list: [
          { title: 'Easy', value: 'easy' },
          { title: 'Moderate', value: 'moderate' },
          { title: 'Challenging', value: 'challenging' },
          { title: 'Expert', value: 'expert' },
        ],
        layout: 'radio',
      },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'seasons',
      title: 'Seasons',
      type: 'array',
      group: 'details',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: 'Spring', value: 'spring' },
          { title: 'Summer', value: 'summer' },
          { title: 'Autumn', value: 'autumn' },
          { title: 'Winter', value: 'winter' },
        ],
      },
      validation: (r) => r.required().min(1),
    }),
    defineField({
      name: 'included',
      title: 'What is included',
      type: 'array',
      group: 'details',
      of: [{ type: 'localeString' }],
    }),
    defineField({
      name: 'excluded',
      title: 'What is excluded',
      type: 'array',
      group: 'details',
      of: [{ type: 'localeString' }],
    }),
    defineField({
      name: 'itinerary',
      title: 'Itinerary days',
      type: 'array',
      group: 'itinerary',
      of: [{ type: 'itineraryDay' }],
      validation: (r) =>
        r.custom((days) => {
          if (!Array.isArray(days)) return true;
          const nums = days
            .map((d) => (d as { day?: number }).day)
            .filter((v): v is number => typeof v === 'number');
          const unique = new Set(nums);
          return unique.size === nums.length || 'Day numbers must be unique';
        }),
    }),
    defineField({
      name: 'mapRoute',
      title: 'Map route (geopoints)',
      type: 'array',
      group: 'itinerary',
      of: [{ type: 'geopoint' }],
    }),
    defineField({ name: 'pricing', title: 'Pricing', type: 'pricing', group: 'pricing', validation: (r) => r.required() }),
    defineField({
      name: 'destinations',
      title: 'Destinations',
      type: 'array',
      group: 'relations',
      of: [{ type: 'reference', to: [{ type: 'destination' }] }],
      validation: (r) => r.unique(),
    }),
    defineField({
      name: 'faqs',
      title: 'FAQs',
      type: 'array',
      group: 'relations',
      of: [{ type: 'reference', to: [{ type: 'faq' }] }],
      validation: (r) => r.unique(),
    }),
    defineField({
      name: 'relatedTours',
      title: 'Related tours',
      type: 'array',
      group: 'relations',
      of: [{ type: 'reference', to: [{ type: 'tour' }] }],
      validation: (r) => r.unique().max(3),
    }),
    defineField({ name: 'featured', title: 'Featured on homepage', type: 'boolean', group: 'details', initialValue: false }),
    defineField({ name: 'order', title: 'Display order', type: 'number', group: 'details', initialValue: 0 }),
    defineField({
      name: 'publishedAt',
      title: 'Published at',
      type: 'datetime',
      group: 'details',
      initialValue: () => new Date().toISOString(),
      validation: (r) => r.required(),
    }),
    defineField({ name: 'seo', title: 'SEO', type: 'seo', group: 'seo' }),
  ],
  orderings: [
    { title: 'Featured then order', name: 'featuredOrder', by: [{ field: 'featured', direction: 'desc' }, { field: 'order', direction: 'asc' }] },
    { title: 'Newest first', name: 'publishedDesc', by: [{ field: 'publishedAt', direction: 'desc' }] },
  ],
  preview: {
    select: { title: 'title.en', duration: 'duration', difficulty: 'difficulty', media: 'heroImage' },
    prepare: ({ title, duration, difficulty, media }) => ({
      title: title ?? '(untitled)',
      subtitle: [duration ? `${duration} days` : undefined, difficulty].filter(Boolean).join(' · '),
      media,
    }),
  },
});
