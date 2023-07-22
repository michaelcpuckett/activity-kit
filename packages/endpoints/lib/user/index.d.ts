import { createServerActor } from './createServerActor';
import { createUserActor } from './createUserActor';
import { CoreLibrary, Plugin, Routes } from '@activity-kit/types';
export declare class User {
    readonly type: string;
    readonly email: string;
    readonly name: string;
    readonly preferredUsername: string;
    readonly password: string;
    constructor(rawBody: Record<string, unknown>);
}
export declare class UserPostEndpoint {
    routes: Routes;
    headers: JSON;
    body: Record<string, unknown>;
    core: CoreLibrary;
    plugins?: Plugin[];
    constructor(routes: Routes, headers: JSON, body: Record<string, unknown>, core: CoreLibrary, plugins?: Plugin[]);
    protected createServerActor: typeof createServerActor;
    protected createUserActor: typeof createUserActor;
    respond(): Promise<{
        statusCode: number;
        body: string;
    }>;
}
