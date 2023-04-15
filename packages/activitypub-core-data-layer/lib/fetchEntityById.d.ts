import { DataLayer } from '.';
import { AP } from 'activitypub-core-types';
export declare function fetchEntityById(this: DataLayer, id: URL): Promise<AP.Entity | null>;
