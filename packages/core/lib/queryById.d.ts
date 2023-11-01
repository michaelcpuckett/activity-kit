/// <reference types="node" />
import * as AP from '@activity-kit/types';
import { CoreLibrary } from '.';
/**
 * Finds an Entity by its ID, which is a URL.
 *
 * If the Entity is not found locally it will be fetched from the URL.
 *
 * If the Entity is a Tombstone, it will be returned.
 *
 * If the Entity is not a Tombstone, it will be saved to the database.
 *
 * If the Entity is not found at the URL, it will be saved as a Tombstone.
 *
 * @returns The Entity, which may be a Tombstone, or null if not found.
 */
export declare function queryById(this: CoreLibrary, id: URL): Promise<AP.Entity | null>;
