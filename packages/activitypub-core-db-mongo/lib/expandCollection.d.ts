import { MongoDbAdapter } from '.';
import { AP } from 'activitypub-core-types';
export declare function expandCollection(this: MongoDbAdapter, collection: AP.EitherCollectionReference): Promise<null | AP.EitherCollection>;
