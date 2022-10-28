/// <reference types="node" />
import { MongoDbAdapter } from '.';
import { AP } from 'activitypub-core-types';
export declare function queryById(this: MongoDbAdapter, id: URL): Promise<AP.Entity | null>;
