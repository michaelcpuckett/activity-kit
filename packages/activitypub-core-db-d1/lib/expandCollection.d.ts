import { D1DbAdapter } from '.';
import { AP } from 'activitypub-core-types';
export declare function expandCollection(this: D1DbAdapter, collection: AP.EitherCollectionReference): Promise<null | AP.EitherCollection>;
