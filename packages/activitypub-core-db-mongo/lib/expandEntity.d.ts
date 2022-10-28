import { MongoDatabaseAdapterDb } from '.';
import { AP } from 'activitypub-core-types';
export declare function expandEntity(this: MongoDatabaseAdapterDb, originalEntity: AP.Entity): Promise<AP.Entity>;
