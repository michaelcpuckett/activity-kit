import { MongoDatabase } from '.';
import { AP } from 'activitypub-core-types';
export declare function expandCollection(this: MongoDatabase, collection: AP.EitherCollectionReference): Promise<null | AP.EitherCollection>;
