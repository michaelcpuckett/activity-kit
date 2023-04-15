import { DataLayer } from '.';
import { AP } from 'activitypub-core-types';
export declare function getPaginatedCollectionItems(this: DataLayer, collection: AP.Collection | AP.OrderedCollection): Promise<AP.EntityReference[]>;
