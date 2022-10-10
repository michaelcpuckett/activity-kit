import { DatabaseService } from '.';
import { AP } from '../types';
export declare function expandCollection(this: DatabaseService, collection: AP.EitherCollectionReference): Promise<null | AP.EitherCollection>;
