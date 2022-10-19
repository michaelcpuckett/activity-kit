import { AP } from 'activitypub-core-types';
import { cleanProps } from './cleanProps';
import { convertUrlsToStrings } from './convertUrlsToStrings';

export function stringify(entity: AP.Entity) {
  return JSON.stringify(convertUrlsToStrings(cleanProps(entity)));
}
