import { MongoDbAdapter } from '.';
import { AP } from 'activitypub-core-types';
export declare function getPaginatedCollectionItems(this: MongoDbAdapter, collection: AP.Collection | AP.OrderedCollection): Promise<AP.EntityReference[]>;
