import { defineField, defineType } from 'sanity';

export const itineraryDay = defineType({
  name: 'itineraryDay',
  title: 'Itinerary day',
  type: 'object',
  fields: [
    defineField({
      name: 'day',
      title: 'Day number',
      type: 'number',
      validation: (r) => r.required().integer().min(1).max(60),
    }),
    defineField({ name: 'title', title: 'Day title', type: 'localeString', validation: (r) => r.required() }),
    defineField({ name: 'description', title: 'Description', type: 'localeText', validation: (r) => r.required() }),
    defineField({ name: 'accommodation', title: 'Accommodation', type: 'localeString' }),
    defineField({
      name: 'meals',
      title: 'Meals included',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: 'Breakfast', value: 'breakfast' },
          { title: 'Lunch', value: 'lunch' },
          { title: 'Dinner', value: 'dinner' },
        ],
      },
    }),
    defineField({ name: 'image', title: 'Day image', type: 'imageWithAlt' }),
  ],
  preview: {
    select: { day: 'day', title: 'title.en' },
    prepare: ({ day, title }) => ({ title: `Day ${day ?? '?'}`, subtitle: title ?? '(untitled)' }),
  },
});
