import { DatabaseService } from '.';
import { AP } from 'activitypub-core-types';
export declare function expandEntity(this: DatabaseService, originalEntity: AP.Entity): Promise<AP.Entity>;
