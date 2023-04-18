import { AP, assertIsApEntity, isTypeOf } from '@activity-kit/types';
import { ACTIVITYSTREAMS_CONTEXT, W3ID_SECURITY_CONTEXT } from './globals';

export function applyContext<T>(entity: AP.Entity): T {
  assertIsApEntity(entity);

  if (isTypeOf<T & AP.Actor>(entity, AP.ActorTypes)) {
    if (!entity['@context']) {
      entity['@context'] = [
        new URL(ACTIVITYSTREAMS_CONTEXT),
        new URL(W3ID_SECURITY_CONTEXT),
        {
          'schema:PropertyValue': 'https://schema.org/PropertyValue',
          'schema:value': 'https://schema.org/value',
          'schema:name': 'https://schema.org/name',
        },
      ];
    }

    return entity;
  }

  if (!entity['@context']) {
    entity['@context'] = new URL(ACTIVITYSTREAMS_CONTEXT);
  }
}
