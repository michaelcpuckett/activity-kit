/// <reference types="node" />
import { createServerActor } from './createServerActor';
import { createUserActor } from './createUserActor';
import type { IncomingMessage, ServerResponse } from 'http';
import { Plugin, Routes } from 'activitypub-core-types';
import { AuthLayer } from 'activitypub-core-auth-layer';
import { DataLayer } from 'activitypub-core-data-layer';
import { StorageLayer } from 'activitypub-core-storage-layer';
export declare class UserPostEndpoint {
    routes: Routes;
    req: IncomingMessage;
    res: ServerResponse;
    layers: {
        auth: AuthLayer;
        data: DataLayer;
        storage: StorageLayer;
    };
    plugins?: Plugin[];
    constructor(routes: Routes, req: IncomingMessage, res: ServerResponse, layers: {
        auth: AuthLayer;
        data: DataLayer;
        storage: StorageLayer;
    }, plugins?: Plugin[]);
    protected createServerActor: typeof createServerActor;
    protected createUserActor: typeof createUserActor;
    respond(): Promise<void>;
}
