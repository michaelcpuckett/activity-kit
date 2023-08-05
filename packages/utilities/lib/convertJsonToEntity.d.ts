import * as AP from '@activity-kit/types';
/**
 * Converts a JSON object to an Entity with deserialized values.
 *
 * @returns The Entity, or null if not an Entity.
 */
export declare function convertJsonToEntity(object: Record<string, unknown>): AP.Entity | null;
