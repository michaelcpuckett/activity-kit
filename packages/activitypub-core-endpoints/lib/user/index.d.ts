/// <reference types="node" />
import { createServerActor } from './createServerActor';
import { createUserActor } from './createUserActor';
import type { IncomingMessage, ServerResponse } from 'http';
import { Plugin, Routes, Adapters } from 'activitypub-core-types';
export declare class UserPostEndpoint {
    routes: Routes;
    req: IncomingMessage;
    res: ServerResponse;
    adapters: Adapters;
    plugins?: Plugin[];
    constructor(routes: Routes, req: IncomingMessage, res: ServerResponse, adapters: Adapters, plugins?: Plugin[]);
    protected createServerActor: typeof createServerActor;
    protected createUserActor: typeof createUserActor;
    respond(): Promise<void>;
}
