import * as AP from '@activity-kit/types';
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
export declare function applyContext(entity: AP.Entity): AP.Entity;
