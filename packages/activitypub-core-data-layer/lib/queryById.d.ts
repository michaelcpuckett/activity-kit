import { DataLayer } from '.';
import { AP } from 'activitypub-core-types';
export declare function queryById(this: DataLayer, id: URL): Promise<AP.Entity | null>;
