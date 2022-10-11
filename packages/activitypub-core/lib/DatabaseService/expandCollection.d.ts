import { DatabaseService } from '.';
import { AP } from 'activitypub-core-types/src';
export declare function expandCollection(this: DatabaseService, collection: AP.EitherCollectionReference): Promise<null | AP.EitherCollection>;
