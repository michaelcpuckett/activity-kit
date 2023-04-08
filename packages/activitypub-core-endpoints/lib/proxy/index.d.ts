/// <reference types="node" />
import type { IncomingMessage, ServerResponse } from 'http';
import type { DbAdapter } from 'activitypub-core-types';
export declare class ProxyGetEndpoint {
    req: IncomingMessage;
    res: ServerResponse;
    adapters: {
        db: DbAdapter;
    };
    constructor(req: IncomingMessage, res: ServerResponse, adapters: {
        db: DbAdapter;
    });
    respond(): Promise<void>;
}
