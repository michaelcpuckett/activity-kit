import * as AP from '@activity-kit/types';
import { CoreLibrary } from '.';
/**
 * Given a Collection or OrderedCollection, convert its item/orderedItem
 * references to be full entities.
 *
 * @returns A Promise that resolves to the expanded Collection.
 */
export declare function expandCollection(this: CoreLibrary, collection: AP.EitherCollection): Promise<AP.EitherCollection>;
