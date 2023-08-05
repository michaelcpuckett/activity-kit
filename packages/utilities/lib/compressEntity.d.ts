import * as AP from '@activity-kit/types';
/**
 * Compresses an Entity by replacing all nested Entities with their URLs.
 *
 * This is useful for storing Entities in a database, as it removes the need to
 * store the entire Entity, or for sending Entities over the network, as it
 * reduces the size of the payload.
 *
 * @note This follows rules similar to JSON-LD compaction, but it does not
 * follow the JSON-LD spec exactly. For example, it does not use the `@context`
 * property to determine the full URL of a property.
 *
 * @returns The compressed Entity, or null if not an Entity.
 */
export declare function compressEntity(entity: AP.Entity): AP.Entity | null;
