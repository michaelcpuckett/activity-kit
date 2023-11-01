import * as AP from '@activity-kit/types';
import { CoreLibrary } from '.';
/**
 * Finds an Actor by its User ID.
 *
 * The User ID is stored in the database and is not the same as the Actor's ID.
 *
 * @returns The Actor, or null if not found.
 */
export declare function getActorByUserId(this: CoreLibrary, userId: string): Promise<AP.Actor | null>;
