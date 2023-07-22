import { createServerActor } from './createServerActor';
import { createUserActor } from './createUserActor';
import { CoreLibrary, Plugin, Routes } from '@activity-kit/core';
export declare class User {
    readonly type: string;
    readonly email: string;
    readonly name: string;
    readonly preferredUsername: string;
    readonly password: string;
    constructor(rawBody: Record<string, unknown>);
}
export declare class UserPostEndpoint {
    readonly core: CoreLibrary;
    body: Record<string, unknown>;
    routes: Routes;
    plugins?: Plugin[];
    constructor(core: CoreLibrary, options: {
        body: Record<string, unknown>;
        routes: Routes;
        plugins?: Plugin[];
    });
    protected createServerActor: typeof createServerActor;
    protected createUserActor: typeof createUserActor;
    respond(): Promise<{
        statusCode: number;
        body: string;
    }>;
}
