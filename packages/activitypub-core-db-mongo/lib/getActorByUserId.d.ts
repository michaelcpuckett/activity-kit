import { MongoDatabaseAdapterDb } from '.';
import { AP } from 'activitypub-core-types';
export declare function getActorByUserId(this: MongoDatabaseAdapterDb, userId: string): Promise<AP.Actor | null>;
