import * as AP from '@activity-kit/types';
import { guard } from '@activity-kit/type-utilities';
import { ACTIVITYSTREAMS_CONTEXT, W3ID_SECURITY_CONTEXT } from './globals';

export function applyContext(entity: AP.Entity): AP.Entity {
  if (!entity['@context']) {
    if (guard.isApActor(entity)) {
      entity['@context'] = [
        new URL(ACTIVITYSTREAMS_CONTEXT),
        new URL(W3ID_SECURITY_CONTEXT),
        {
          'schema:PropertyValue': new URL('https://schema.org/PropertyValue'),
          'schema:value': new URL('https://schema.org/value'),
          'schema:name': new URL('https://schema.org/name'),
        },
      ];
    } else {
      entity['@context'] = new URL(ACTIVITYSTREAMS_CONTEXT);
    }
  }

  return entity;
}
