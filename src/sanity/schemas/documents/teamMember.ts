import { defineField, defineType } from 'sanity';

export const teamMember = defineType({
  name: 'teamMember',
  title: 'Team member',
  type: 'document',
  fields: [
    defineField({ name: 'name', title: 'Name', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'role', title: 'Role', type: 'localeString', validation: (r) => r.required() }),
    defineField({ name: 'bio', title: 'Bio', type: 'localeText' }),
    defineField({
      name: 'photo',
      title: 'Photo',
      type: 'image',
      options: { hotspot: true },
      validation: (r) => r.required(),
    }),
    defineField({ name: 'isFounder', title: 'Founder', type: 'boolean', initialValue: false }),
    defineField({ name: 'order', title: 'Display order', type: 'number', initialValue: 0 }),
  ],
  preview: {
    select: { title: 'name', subtitle: 'role.en', media: 'photo' },
  },
});
