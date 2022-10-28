/// <reference types="node" />
import type { IncomingMessage, ServerResponse } from 'http';
import { Database, Plugin } from 'activitypub-core-types';
export declare class WebfingerGetEndpoint {
    req: IncomingMessage;
    res: ServerResponse;
    adapters: {
        database: Database;
    };
    plugins: Plugin[];
    constructor(req: IncomingMessage, res: ServerResponse, adapters: {
        database: Database;
    }, plugins?: Plugin[]);
    respond(): Promise<void>;
}
