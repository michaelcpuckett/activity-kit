import { MongoDbAdapter } from '.';
import { AP } from 'activitypub-core-types';
export declare function getCollectionItems(this: MongoDbAdapter, entity: AP.Collection | AP.OrderedCollection): Promise<AP.EntityReference[]>;
