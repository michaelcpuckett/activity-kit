import { AP } from 'activitypub-core-types';

export function cleanProps(entity: AP.Entity): AP.Entity {
  const result = { ...entity }; // TODO passed in wrong.

  if ('bto' in result) {
    delete result.bto;
  }

  if ('bcc' in result) {
    delete result.bcc;
  }

  if ('object' in result && result.object && !(result.object instanceof URL)) {
    if ('bto' in result.object) {
      delete result.object.bto;
    }

    if ('bcc' in result.object) {
      delete result.object.bcc;
    }
  }

  return result;
}
