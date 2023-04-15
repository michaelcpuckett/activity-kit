import { DataLayer } from '.';
import { AP } from 'activitypub-core-types';
export declare function expandCollection(this: DataLayer, collection: AP.EitherCollectionReference): Promise<null | AP.EitherCollection>;
