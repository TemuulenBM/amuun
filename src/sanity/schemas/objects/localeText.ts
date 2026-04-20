import { defineField, defineType } from 'sanity';

export const localeText = defineType({
  name: 'localeText',
  title: 'Locale text',
  type: 'object',
  fields: [
    defineField({ name: 'en', title: 'English', type: 'text', rows: 4, validation: (r) => r.required() }),
    defineField({ name: 'ko', title: 'Korean', type: 'text', rows: 4, validation: (r) => r.required() }),
    defineField({ name: 'mn', title: 'Mongolian', type: 'text', rows: 4, validation: (r) => r.required() }),
  ],
});
