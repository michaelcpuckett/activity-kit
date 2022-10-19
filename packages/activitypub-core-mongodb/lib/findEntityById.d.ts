/// <reference types="node" />
import { MongoDatabase } from '.';
import { AP } from 'activitypub-core-types';
export declare function findEntityById(
  this: MongoDatabase,
  id: URL,
): Promise<AP.Entity | null>;
