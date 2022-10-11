import { DatabaseService } from '.';
import { AP } from 'activitypub-core-types/src';
export declare function expandEntity(this: DatabaseService, originalEntity: AP.Entity): Promise<AP.Entity>;
