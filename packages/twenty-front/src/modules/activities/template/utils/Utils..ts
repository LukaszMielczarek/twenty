import { Template } from '@/activities/types/Template';

export const convertToDate = (template: Template) => ({
  ...template,
  validFrom: template.validFrom ? new Date(template.validFrom) : undefined,
  validTo: template.validTo ? new Date(template.validTo) : undefined,
});

export const convertFromDateToEpoh = (template: Template | null) => ({
  ...template,
  validFrom: template?.validFrom ? template.validFrom.getTime() : null, // Convert to epoch milliseconds
  validTo: template?.validTo ? template.validTo.getTime() : null,
});

export const convertFromDateToString = (template: Template | null) => ({
  ...template,
  validFrom: template?.validFrom ? template.validFrom.toISOString() : null, // Convert to ISO-8601
  validTo: template?.validTo ? template.validTo.toISOString() : null,
});
