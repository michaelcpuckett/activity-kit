/// <reference types="node" />
import { createServerActor } from './createServerActor';
import { createUserActor } from './createUserActor';
import type { IncomingMessage, ServerResponse } from 'http';
import { CoreLibrary, Plugin, Routes } from '@activity-kit/types';
export declare class User {
    readonly uid: string;
    readonly type: string;
    readonly email: string;
    readonly name: string;
    readonly preferredUsername: string;
    readonly password: string;
    constructor(rawBody: Record<string, unknown>);
}
export declare class UserPostEndpoint {
    routes: Routes;
    req: IncomingMessage;
    res: ServerResponse;
    core: CoreLibrary;
    plugins?: Plugin[];
    constructor(routes: Routes, req: IncomingMessage, res: ServerResponse, core: CoreLibrary, plugins?: Plugin[]);
    protected createServerActor: typeof createServerActor;
    protected createUserActor: typeof createUserActor;
    respond(): Promise<void>;
}
