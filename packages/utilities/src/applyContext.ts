import * as AP from '@activity-kit/types';
import { guard, assert } from '@activity-kit/type-utilities';
import { ACTIVITYSTREAMS_CONTEXT, W3ID_SECURITY_CONTEXT } from './globals';

export function applyContext<T>(entity: AP.Entity): T {
  assert.isApEntity(entity);

  if (guard.isTypeOf<T & AP.Actor>(entity, AP.ActorTypes)) {
    if (!entity['@context']) {
      entity['@context'] = [
        new URL(ACTIVITYSTREAMS_CONTEXT),
        new URL(W3ID_SECURITY_CONTEXT),
        {
          'schema:PropertyValue': new URL('https://schema.org/PropertyValue'),
          'schema:value': new URL('https://schema.org/value'),
          'schema:name': new URL('https://schema.org/name'),
        },
      ];
    }

    return entity;
  }

  if (guard.isTypeOf<T & AP.Entity>(entity, AP.AllTypes)) {
    if (!entity['@context']) {
      entity['@context'] = new URL(ACTIVITYSTREAMS_CONTEXT);
    }

    return entity;
  }
}
