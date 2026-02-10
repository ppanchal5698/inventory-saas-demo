import { randomUUID } from 'crypto';

export const generateId = (prefix: string): string => {
  return `${prefix}-${randomUUID().split('-')[0].toUpperCase()}`;
};
