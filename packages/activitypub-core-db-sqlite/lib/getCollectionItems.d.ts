import { SqliteDbAdapter } from '.';
import { AP } from 'activitypub-core-types';
export declare function getCollectionItems(this: SqliteDbAdapter, entity: URL | AP.Collection | AP.OrderedCollection): Promise<AP.EntityReference[]>;
