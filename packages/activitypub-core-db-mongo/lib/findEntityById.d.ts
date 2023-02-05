import { MongoDbAdapter } from '.';
import { AP } from 'activitypub-core-types';
export declare function findEntityById(this: MongoDbAdapter, id: URL): Promise<AP.Entity | null>;
