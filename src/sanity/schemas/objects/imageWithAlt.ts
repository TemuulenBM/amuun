import { defineField, defineType } from 'sanity';

export const imageWithAlt = defineType({
  name: 'imageWithAlt',
  title: 'Image with alt text',
  type: 'image',
  options: { hotspot: true },
  fields: [
    defineField({
      name: 'alt',
      title: 'Alt text',
      type: 'localeString',
      validation: (r) => r.required(),
    }),
    defineField({ name: 'caption', title: 'Caption', type: 'localeString' }),
  ],
});
