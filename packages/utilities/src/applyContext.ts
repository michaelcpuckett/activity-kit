import * as AP from '@activity-kit/types';
import { DEFAULT_CONTEXT_AS_URLS } from './globals';

/**
 * Applies the ActivityStreams context to an Entity. If the Entity already has a
 * JSON-LD context, it will not be overwritten.
 *
 * This is useful when creating an Entity from scratch, as it ensures that the
 * Entity has the proper context.
 *
 * @returns The Entity with the context applied.
 *
 * @see https://www.w3.org/TR/json-ld11/#the-context
 */
export function applyContext(entity: AP.Entity): AP.Entity {
  if (!entity['@context']) {
    entity['@context'] = DEFAULT_CONTEXT_AS_URLS;
  }

  return entity;
}
