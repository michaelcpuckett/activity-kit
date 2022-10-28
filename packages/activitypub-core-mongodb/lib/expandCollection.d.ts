import { MongoDatabaseAdapterDb } from '.';
import { AP } from 'activitypub-core-types';
export declare function expandCollection(this: MongoDatabaseAdapterDb, collection: AP.EitherCollectionReference): Promise<null | AP.EitherCollection>;
