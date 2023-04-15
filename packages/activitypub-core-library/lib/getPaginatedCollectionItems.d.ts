import { CoreLibrary } from '.';
import { AP } from 'activitypub-core-types';
export declare function getPaginatedCollectionItems(this: CoreLibrary, collection: AP.Collection | AP.OrderedCollection): Promise<AP.EntityReference[]>;
