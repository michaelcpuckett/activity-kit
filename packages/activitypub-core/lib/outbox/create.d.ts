/// <reference types="node" />
import { AP } from 'activitypub-core-types';
import type { Database } from 'activitypub-core-types';
export declare function handleCreate(activity: AP.Create | AP.Delete, databaseService: Database): Promise<URL>;
