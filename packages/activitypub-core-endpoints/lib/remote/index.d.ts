/// <reference types="node" />
import type { IncomingMessage, ServerResponse } from 'http';
import type { Database, Auth } from 'activitypub-core-types';
export declare function remoteHandler(req: IncomingMessage, res: ServerResponse, authenticationService: Auth, databaseService: Database): Promise<{
    props?: {
        entity?: import("activitypub-core-types/lib/activitypub").Entity;
        actor?: import("activitypub-core-types/lib/activitypub").Actor;
    };
}>;
