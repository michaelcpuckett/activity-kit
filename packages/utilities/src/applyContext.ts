import * as AP from '@activity-kit/types';
import { guard } from '@activity-kit/type-utilities';
import {
  ACTIVITYSTREAMS_CONTEXT,
  DEFAULT_ACTOR_CONTEXT_AS_URLS,
} from './globals';

/**
 * Applies the default JSON-LD context to an {@link AP.Entity}.
 *
 * If the Entity already has a context, it will not be overwritten. This
 * function does not use JSON-LD compaction.
 *
 * @returns The {@link AP.Entity} with the default context applied.
 *
 * @see https://www.w3.org/TR/json-ld11/#the-context
 */
export function applyContext(entity: AP.Entity): AP.Entity {
  if (!entity['@context']) {
    if (guard.isApActor(entity)) {
      entity['@context'] = DEFAULT_ACTOR_CONTEXT_AS_URLS;
    } else {
      entity['@context'] = new URL(ACTIVITYSTREAMS_CONTEXT);
    }
  }

  return entity;
}
