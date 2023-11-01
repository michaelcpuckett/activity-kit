import * as AP from '@activity-kit/types';
import { CoreLibrary } from '.';
/**
 * Given a Collection or OrderedCollection, traverse its pages and return all
 * items.
 *
 * This is useful for getting all items in a foreign Collection, which may be
 * paginated.
 *
 * @returns A Promise that resolves to an array of all items in the Collection.
 */
export declare function getPaginatedCollectionItems(this: CoreLibrary, collection: AP.EitherCollection): Promise<AP.EntityReference[]>;
