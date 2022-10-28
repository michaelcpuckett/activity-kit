/// <reference types="node" />
import { createServerActor } from './createServerActor';
import { createUserActor } from './createUserActor';
import type { IncomingMessage, ServerResponse } from 'http';
import type { Database, Auth, Plugin } from 'activitypub-core-types';
export declare class UserPostEndpoint {
    req: IncomingMessage;
    res: ServerResponse;
    adapters: {
        authentication: Auth;
        database: Database;
    };
    plugins?: Plugin[];
    constructor(req: IncomingMessage, res: ServerResponse, adapters: {
        authentication: Auth;
        database: Database;
    }, plugins?: Plugin[]);
    protected createServerActor: typeof createServerActor;
    protected createUserActor: typeof createUserActor;
    respond(): Promise<void>;
}
