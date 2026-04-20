import { defineField, defineType } from 'sanity';

export const localeString = defineType({
  name: 'localeString',
  title: 'Locale string',
  type: 'object',
  fields: [
    defineField({ name: 'en', title: 'English', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'ko', title: 'Korean', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'mn', title: 'Mongolian', type: 'string', validation: (r) => r.required() }),
  ],
  preview: {
    select: { en: 'en', ko: 'ko', mn: 'mn' },
    prepare: ({ en, ko, mn }) => ({ title: en ?? ko ?? mn ?? '(untitled)' }),
  },
});
