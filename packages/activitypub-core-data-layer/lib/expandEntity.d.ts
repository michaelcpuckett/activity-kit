import { DataLayer } from '.';
import { AP } from 'activitypub-core-types';
export declare function expandEntity(this: DataLayer, originalEntity: AP.Entity): Promise<AP.Entity>;
