import { MongoDbAdapter } from '.';
import { AP } from 'activitypub-core-types';
export declare function getCollectionItemsByPagination(this: MongoDbAdapter, collection: AP.Collection | AP.OrderedCollection): Promise<AP.EntityReference[]>;
