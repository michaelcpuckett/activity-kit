import { MongoDbAdapter } from '.';
import * as AP from '@activity-kit/types';
export declare function saveEntity(this: MongoDbAdapter, entity: AP.Entity): Promise<void>;
