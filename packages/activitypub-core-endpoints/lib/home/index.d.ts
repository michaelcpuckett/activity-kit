/// <reference types="node" />
import type { IncomingMessage, ServerResponse } from 'http';
import type { Plugin } from 'activitypub-core-types';
import type { DbAdapter, AuthAdapter } from 'activitypub-core-types';
export declare class HomeGetEndpoint {
    req: IncomingMessage;
    res: ServerResponse;
    adapters: {
        auth: AuthAdapter;
        db: DbAdapter;
    };
    plugins?: Plugin[];
    constructor(req: IncomingMessage, res: ServerResponse, adapters: {
        auth: AuthAdapter;
        db: DbAdapter;
    }, plugins?: Plugin[]);
    respond: (this: HomeGetEndpoint, render: Function) => Promise<void>;
}
