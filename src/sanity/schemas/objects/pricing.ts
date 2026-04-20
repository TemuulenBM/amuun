import { defineField, defineType } from 'sanity';

export const pricing = defineType({
  name: 'pricing',
  title: 'Pricing tiers',
  type: 'object',
  fields: [
    defineField({
      name: 'currency',
      title: 'Currency',
      type: 'string',
      options: {
        list: [
          { title: 'USD', value: 'USD' },
          { title: 'EUR', value: 'EUR' },
          { title: 'KRW', value: 'KRW' },
        ],
        layout: 'radio',
      },
      initialValue: 'USD',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'perPerson',
      title: 'Per person',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'standard',
      title: 'Standard tier',
      type: 'number',
      validation: (r) => r.required().positive(),
    }),
    defineField({
      name: 'deluxe',
      title: 'Deluxe tier',
      type: 'number',
      validation: (r) => r.required().positive(),
    }),
    defineField({
      name: 'private',
      title: 'Private tier',
      type: 'number',
      validation: (r) => r.required().positive(),
    }),
    defineField({
      name: 'notes',
      title: 'Pricing notes',
      type: 'localeText',
    }),
  ],
  preview: {
    select: { currency: 'currency', standard: 'standard' },
    prepare: ({ currency, standard }) => ({
      title: `${currency ?? 'USD'} ${standard ?? 0}+`,
    }),
  },
});
