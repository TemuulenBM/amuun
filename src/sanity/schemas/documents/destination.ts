import { defineField, defineType } from 'sanity';

export const destination = defineType({
  name: 'destination',
  title: 'Destination',
  type: 'document',
  groups: [
    { name: 'content', title: 'Content', default: true },
    { name: 'media', title: 'Media' },
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
    defineField({ name: 'subtitle', title: 'Subtitle', type: 'localeString', group: 'content' }),
    defineField({ name: 'story', title: 'Story', type: 'localeBlockContent', group: 'content' }),
    defineField({
      name: 'region',
      title: 'Region',
      type: 'string',
      group: 'content',
      options: {
        list: [
          { title: 'Central', value: 'central' },
          { title: 'Gobi', value: 'gobi' },
          { title: 'Western', value: 'western' },
          { title: 'Northern', value: 'northern' },
          { title: 'Terelj', value: 'terelj' },
        ],
        layout: 'radio',
      },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'bestTime',
      title: 'Best time to visit',
      type: 'localeString',
      group: 'content',
    }),
    defineField({
      name: 'highlights',
      title: 'Highlights',
      type: 'array',
      of: [{ type: 'localeString' }],
      group: 'content',
    }),
    defineField({ name: 'heroImage', title: 'Hero image', type: 'imageWithAlt', group: 'media', validation: (r) => r.required() }),
    defineField({
      name: 'gallery',
      title: 'Gallery',
      type: 'array',
      of: [{ type: 'imageWithAlt' }],
      group: 'media',
    }),
    defineField({ name: 'seo', title: 'SEO', type: 'seo', group: 'seo' }),
  ],
  preview: {
    select: { title: 'title.en', region: 'region', media: 'heroImage' },
    prepare: ({ title, region, media }) => ({
      title: title ?? '(untitled)',
      subtitle: region ? `Region: ${region}` : undefined,
      media,
    }),
  },
});
