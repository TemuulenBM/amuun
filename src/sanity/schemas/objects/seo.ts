import { defineField, defineType } from 'sanity';

export const seo = defineType({
  name: 'seo',
  title: 'SEO',
  type: 'object',
  fields: [
    defineField({ name: 'title', title: 'Meta title', type: 'localeString' }),
    defineField({ name: 'description', title: 'Meta description', type: 'localeText' }),
    defineField({
      name: 'ogImage',
      title: 'Open Graph image',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({ name: 'noIndex', title: 'Hide from search engines', type: 'boolean', initialValue: false }),
  ],
});
