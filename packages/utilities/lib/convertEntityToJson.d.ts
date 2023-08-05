import * as AP from '@activity-kit/types';
/**
 * Converts an Entity to a plain JSON object.
 *
 * This is needed to store the Entity in a database or send it over the network,
 * as the Entity may contain URLs, Dates, and other non-JSON values.
 *
 * @returns The plain object.
 *
 * @todo The fallthrough case for objects relies on the `toString()` method.
 * This is not ideal, as it may not always produce the desired result.
 */
export declare function convertEntityToJson(object: AP.Entity): Record<string, unknown>;
