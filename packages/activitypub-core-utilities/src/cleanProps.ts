import { AP } from 'activitypub-core-types';
import { convertStringsToUrls } from './convertStringsToUrls';

export function cleanProps(entity: AP.Entity) {
  const result = convertStringsToUrls({ ...entity }); // TODO passed in wrong.

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
