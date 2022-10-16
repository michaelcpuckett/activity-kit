import { ACTIVITYSTREAMS_CONTEXT, W3ID_SECURITY_CONTEXT } from './globals';
import { AP } from 'activitypub-core-types';
import { removeContext } from './removeContext';

export function addContext(entity: AP.Entity): AP.Entity & {
  '@context': unknown;
} {
  const result = removeContext(entity);

  for (const type of Object.values(AP.ActorTypes)) {
    if (type === result.type) {
      return {
        '@context': [
          new URL(ACTIVITYSTREAMS_CONTEXT),
          new URL(W3ID_SECURITY_CONTEXT),
        ],
        ...result,
      };
    }
  }

  return {
    '@context': new URL(ACTIVITYSTREAMS_CONTEXT),
    ...result,
  };
}
