import { defineField, defineType } from 'sanity';

export const legalPage = defineType({
  name: 'legalPage',
  title: 'Legal page',
  type: 'document',
  fields: [
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'string',
      options: {
        list: [
          { title: 'Privacy policy', value: 'privacy' },
          { title: 'Terms of service', value: 'terms' },
        ],
        layout: 'radio',
      },
      validation: (r) => r.required(),
    }),
    defineField({ name: 'title', title: 'Title', type: 'localeString', validation: (r) => r.required() }),
    defineField({ name: 'content', title: 'Content', type: 'localeBlockContent', validation: (r) => r.required() }),
    defineField({
      name: 'updatedAt',
      title: 'Last updated',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
      validation: (r) => r.required(),
    }),
    defineField({ name: 'seo', title: 'SEO', type: 'seo' }),
  ],
  preview: {
    select: { title: 'title.en', slug: 'slug', updatedAt: 'updatedAt' },
    prepare: ({ title, slug, updatedAt }) => ({
      title: title ?? slug ?? '(untitled)',
      subtitle: updatedAt ? `Updated ${updatedAt.slice(0, 10)}` : undefined,
    }),
  },
});
