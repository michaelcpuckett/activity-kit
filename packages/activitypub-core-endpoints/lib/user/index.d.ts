/// <reference types="node" />
import { createServerActor } from './createServerActor';
import { createUserActor } from './createUserActor';
import type { IncomingMessage, ServerResponse } from 'http';
import { DbAdapter, AuthAdapter, Plugin, Routes } from 'activitypub-core-types';
import { DeliveryAdapter } from 'activitypub-core-delivery';
export declare class UserPostEndpoint {
    routes: Routes;
    req: IncomingMessage;
    res: ServerResponse;
    adapters: {
        auth: AuthAdapter;
        db: DbAdapter;
        delivery: DeliveryAdapter;
    };
    plugins?: Plugin[];
    constructor(routes: Routes, req: IncomingMessage, res: ServerResponse, adapters: {
        auth: AuthAdapter;
        db: DbAdapter;
        delivery: DeliveryAdapter;
    }, plugins?: Plugin[]);
    protected createServerActor: typeof createServerActor;
    protected createUserActor: typeof createUserActor;
    respond(): Promise<void>;
}
