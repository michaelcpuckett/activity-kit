import * as jsonld from 'jsonld';
import { ACTIVITYSTREAMS_CONTEXT } from '../globals';
import { convertStringsToUrls } from './convertStringsToUrls';

export const convertFromJsonLd = async (entity: {
  [key: string]: unknown;
}): Promise<null | { [key: string]: unknown }> => {
  const result = await jsonld.compact(entity, {
    '@context': ACTIVITYSTREAMS_CONTEXT,
  });

  if (!result) {
    return null;
  }

  const converted = convertStringsToUrls(result);

  if (!converted) {
    return null;
  }

  return converted as { [key: string]: unknown };
};
