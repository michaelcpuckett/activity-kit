/// <reference types="node" />
import { AP } from 'activitypub-core-types';
import type { Database } from 'activitypub-core-types';
import type { IncomingMessage, ServerResponse } from 'http';
export declare function entityGetHandler(request: IncomingMessage, response: ServerResponse, databaseService: Database): Promise<{
    props?: {
        entity?: AP.Entity;
    };
}>;
