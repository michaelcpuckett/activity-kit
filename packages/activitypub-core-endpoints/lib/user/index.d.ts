/// <reference types="node" />
import { createServerActor } from './createServerActor';
import { createUserActor } from './createUserActor';
import type { IncomingMessage, ServerResponse } from 'http';
import { Library, Plugin, Routes } from 'activitypub-core-types';
export declare class UserPostEndpoint {
    routes: Routes;
    req: IncomingMessage;
    res: ServerResponse;
    lib: Library;
    plugins?: Plugin[];
    constructor(routes: Routes, req: IncomingMessage, res: ServerResponse, lib: Library, plugins?: Plugin[]);
    protected createServerActor: typeof createServerActor;
    protected createUserActor: typeof createUserActor;
    respond(): Promise<void>;
}
