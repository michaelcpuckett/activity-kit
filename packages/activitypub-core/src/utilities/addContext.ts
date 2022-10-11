import { ACTIVITYSTREAMS_CONTEXT, W3ID_SECURITY_CONTEXT } from '../globals';
import { AP } from 'activitypub-core-types/src';

export function addContext(entity: AP.Entity): AP.Entity & {
  '@context': unknown;
} {
  for (const type of Object.values(AP.ActorTypes)) {
    if (type === entity.type) {
      return {
        '@context': [
          new URL(ACTIVITYSTREAMS_CONTEXT),
          new URL(W3ID_SECURITY_CONTEXT),
        ],
        ...entity,
      };
    }
  }

  return {
    '@context': new URL(ACTIVITYSTREAMS_CONTEXT),
    ...entity,
  };
}
