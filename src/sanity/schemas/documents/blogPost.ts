import { defineField, defineType } from 'sanity';

export const blogPost = defineType({
  name: 'blogPost',
  title: 'Journal article',
  type: 'document',
  groups: [
    { name: 'content', title: 'Content', default: true },
    { name: 'meta', title: 'Meta' },
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
    defineField({ name: 'excerpt', title: 'Excerpt', type: 'localeText', group: 'content' }),
    defineField({ name: 'content', title: 'Article body', type: 'localeBlockContent', group: 'content' }),
    defineField({ name: 'heroImage', title: 'Hero image', type: 'imageWithAlt', group: 'content', validation: (r) => r.required() }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      group: 'meta',
      options: {
        list: [
          { title: 'Culture', value: 'culture' },
          { title: 'Travel tips', value: 'tips' },
          { title: 'Guide stories', value: 'stories' },
          { title: 'Photography', value: 'photography' },
        ],
        layout: 'radio',
      },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'author',
      title: 'Author',
      type: 'reference',
      to: [{ type: 'teamMember' }],
      group: 'meta',
    }),
    defineField({
      name: 'relatedTours',
      title: 'Related tours',
      type: 'array',
      group: 'meta',
      of: [{ type: 'reference', to: [{ type: 'tour' }] }],
      validation: (r) => r.unique().max(3),
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published at',
      type: 'datetime',
      group: 'meta',
      initialValue: () => new Date().toISOString(),
      validation: (r) => r.required(),
    }),
    defineField({ name: 'seo', title: 'SEO', type: 'seo', group: 'seo' }),
  ],
  orderings: [
    { title: 'Newest first', name: 'publishedDesc', by: [{ field: 'publishedAt', direction: 'desc' }] },
  ],
  preview: {
    select: { title: 'title.en', category: 'category', publishedAt: 'publishedAt', media: 'heroImage' },
    prepare: ({ title, category, publishedAt, media }) => ({
      title: title ?? '(untitled)',
      subtitle: [category, publishedAt?.slice(0, 10)].filter(Boolean).join(' · '),
      media,
    }),
  },
});
