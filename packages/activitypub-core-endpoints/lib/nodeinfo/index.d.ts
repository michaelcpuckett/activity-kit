/// <reference types="node" />
import type { IncomingMessage, ServerResponse } from 'http';
import { respond } from './respond';
import type { DbAdapter, Plugin } from 'activitypub-core-types';
export declare class NodeinfoGetEndpoint {
    req: IncomingMessage;
    res: ServerResponse;
    adapters: {
        db: DbAdapter;
    };
    plugins?: Plugin[];
    constructor(req: IncomingMessage, res: ServerResponse, adapters: {
        db: DbAdapter;
    }, plugins: Plugin[]);
    respond: typeof respond;
}
