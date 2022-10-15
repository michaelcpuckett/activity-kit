/// <reference types="node" />
import type { IncomingMessage, ServerResponse } from 'http';
import { Database } from 'activitypub-core-types';
export declare function webfingerHandler(req: IncomingMessage, res: ServerResponse, databaseService: Database): Promise<void>;
