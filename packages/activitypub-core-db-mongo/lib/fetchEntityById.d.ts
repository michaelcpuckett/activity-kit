import { MongoDbAdapter } from '.';
import { AP } from 'activitypub-core-types';
export declare function fetchEntityById(this: MongoDbAdapter, id: URL): Promise<AP.Entity | null>;
