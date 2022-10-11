/// <reference types="node" />
import { MongoDatabase } from '.';
import { AP } from 'activitypub-core-types';
export declare function queryById(this: MongoDatabase, id: URL): Promise<AP.Entity | null>;
