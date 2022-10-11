/// <reference types="node" />
import { DatabaseService } from '.';
import { AP } from 'activitypub-core-types';
export declare function queryById(this: DatabaseService, id: URL): Promise<AP.Entity | null>;
