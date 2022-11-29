import { MongoDbAdapter } from '.';
import { AP } from 'activitypub-core-types';
export declare function getPrivateKey(this: MongoDbAdapter, actor: AP.Actor): Promise<string>;
