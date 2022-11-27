/// <reference types="node" />
import type { IncomingMessage, ServerResponse } from 'http';
import type { DbAdapter, Plugin } from 'activitypub-core-types';
export declare class HostMetaGetEndpoint {
    req: IncomingMessage;
    res: ServerResponse;
    adapters: {
        db: DbAdapter;
    };
    constructor(req: IncomingMessage, res: ServerResponse, adapters: {
        db: DbAdapter;
    }, plugins: Plugin[]);
    respond(): Promise<void>;
}
