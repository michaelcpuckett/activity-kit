/// <reference types="node" />
import { AP } from 'activitypub-core-types';
import type { Database, Auth } from 'activitypub-core-types';
import type { IncomingMessage, ServerResponse } from 'http';
export declare function entityGetHandler(request: IncomingMessage, response: ServerResponse, authenticationService: Auth, databaseService: Database): Promise<{
    props?: {
        entity?: AP.Entity;
        actor?: AP.Actor;
    };
}>;
