import { MongoDatabase } from '.';
import { AP } from 'activitypub-core-types';
export declare function getActorByUserId(this: MongoDatabase, userId: string): Promise<AP.Actor | null>;
