/// <reference types="node" />
/**
 * Gets the database collection name for a given URL.
 *
 * Currently, all entities are stored in one of two collections:
 *
 * - `entity` for local entities
 * - `foreignEntity` for foreign/remote entities
 *
 * @returns The collection name.
 */
export declare const getCollectionNameByUrl: (url: URL) => "entity" | "foreignEntity";
