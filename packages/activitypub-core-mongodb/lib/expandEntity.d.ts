import { MongoDatabase } from '.';
import { AP } from 'activitypub-core-types';
export declare function expandEntity(this: MongoDatabase, originalEntity: AP.Entity): Promise<AP.Entity>;
