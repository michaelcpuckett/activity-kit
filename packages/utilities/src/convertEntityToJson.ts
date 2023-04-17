import { AP } from '@activity-kit/types';
import { stringify } from 'superjson';

export const convertEntityToJson = (
  entity: AP.Entity,
): Record<string, unknown> => {
  return JSON.parse(stringify(entity)).json;
};
