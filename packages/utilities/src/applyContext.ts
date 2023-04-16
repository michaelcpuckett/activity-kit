import { AP } from '@activity-kit/types';
import { isTypeOf } from './isType';
import { ACTIVITYSTREAMS_CONTEXT, W3ID_SECURITY_CONTEXT } from './globals';

export function applyContext(entity: AP.Entity): AP.Entity {
  if (!entity['@context']) {
    if (isTypeOf(entity, AP.ActorTypes)) {
      entity['@context'] = [
        new URL(ACTIVITYSTREAMS_CONTEXT),
        new URL(W3ID_SECURITY_CONTEXT),
        {
          PropertyValue: 'https://schema.org/PropertyValue',
          value: 'https://schema.org/value',
        },
      ];
    } else {
      entity['@context'] = new URL(ACTIVITYSTREAMS_CONTEXT);
    }
  }

  return entity;
}
