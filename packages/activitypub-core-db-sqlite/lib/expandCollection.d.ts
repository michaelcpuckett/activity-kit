import { SqliteDbAdapter } from '.';
import { AP } from 'activitypub-core-types';
export declare function expandCollection(this: SqliteDbAdapter, collection: AP.EitherCollectionReference): Promise<null | AP.EitherCollection>;
