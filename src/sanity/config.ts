import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';

import { apiVersion, dataset, projectId } from './env';
import { schemaTypes, singletonTypes } from './schemas';
import { structure } from './structure';

const singletonActions = new Set(['publish', 'discardChanges', 'restore']);

export default defineConfig({
  name: 'amuun',
  title: 'Amuun Studio',
  basePath: '/studio',
  projectId,
  dataset,
  plugins: [structureTool({ structure }), visionTool({ defaultApiVersion: apiVersion })],
  schema: {
    types: schemaTypes,
    templates: (templates) =>
      templates.filter(({ schemaType }) => !singletonTypes.includes(schemaType)),
  },
  document: {
    actions: (input, context) =>
      singletonTypes.includes(context.schemaType)
        ? input.filter(({ action }) => action && singletonActions.has(action))
        : input,
    newDocumentOptions: (prev, { creationContext }) =>
      creationContext.type === 'global'
        ? prev.filter(({ templateId }) => !singletonTypes.includes(templateId ?? ''))
        : prev,
  },
});
