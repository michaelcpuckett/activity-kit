import { MongoDbAdapter } from '.';
import { AP } from 'activitypub-core-types';
export declare function getActorByUserId(this: MongoDbAdapter, userId: string): Promise<AP.Actor | null>;
