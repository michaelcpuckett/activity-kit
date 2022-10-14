import { AP } from 'activitypub-core-types';

export function cleanProps(entity: AP.Entity): AP.Entity {
  const result = { ...entity };

  if ('bto' in result) {
    delete result.bto;
  }

  if ('bcc' in result) {
    delete result.bcc;
  }

  return result;
}
