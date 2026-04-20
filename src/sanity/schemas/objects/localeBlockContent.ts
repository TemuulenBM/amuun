import { defineArrayMember, defineField, defineType } from 'sanity';

const blockContent = [
  defineArrayMember({
    type: 'block',
    styles: [
      { title: 'Normal', value: 'normal' },
      { title: 'H2', value: 'h2' },
      { title: 'H3', value: 'h3' },
      { title: 'Quote', value: 'blockquote' },
    ],
    lists: [
      { title: 'Bulleted', value: 'bullet' },
      { title: 'Numbered', value: 'number' },
    ],
    marks: {
      decorators: [
        { title: 'Strong', value: 'strong' },
        { title: 'Emphasis', value: 'em' },
      ],
      annotations: [
        {
          name: 'link',
          type: 'object',
          title: 'Link',
          fields: [{ name: 'href', type: 'url', title: 'URL' }],
        },
      ],
    },
  }),
  defineArrayMember({ type: 'image', options: { hotspot: true } }),
];

export const localeBlockContent = defineType({
  name: 'localeBlockContent',
  title: 'Locale rich text',
  type: 'object',
  fields: [
    defineField({ name: 'en', title: 'English', type: 'array', of: blockContent }),
    defineField({ name: 'ko', title: 'Korean', type: 'array', of: blockContent }),
    defineField({ name: 'mn', title: 'Mongolian', type: 'array', of: blockContent }),
  ],
});
