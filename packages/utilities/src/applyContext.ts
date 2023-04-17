import { AP, isTypeOf } from '@activity-kit/types';
import { ACTIVITYSTREAMS_CONTEXT, W3ID_SECURITY_CONTEXT } from './globals';

export function applyContext(entity: AP.Entity): AP.Entity {
  if (!entity['@context']) {
    if (isTypeOf<AP.Actor>(entity, AP.ActorTypes)) {
      entity['@context'] = [
        new URL(ACTIVITYSTREAMS_CONTEXT),
        new URL(W3ID_SECURITY_CONTEXT),
        {
          'schema:PropertyValue': 'https://schema.org/PropertyValue',
          'schema:value': 'https://schema.org/value',
          'schema:name': 'https://schema.org/name',
        },
      ];
    } else {
      entity['@context'] = new URL(ACTIVITYSTREAMS_CONTEXT);
    }
  }

  return entity;
}
