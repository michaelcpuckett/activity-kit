/// <reference types="node" />
import type { IncomingMessage, ServerResponse } from 'http';
import { Plugin } from 'activitypub-core-types';
import { AuthLayer } from 'activitypub-core-auth-layer';
import { DataLayer } from 'activitypub-core-data-layer';
import { StorageLayer } from 'activitypub-core-storage-layer';
export declare class WebfingerGetEndpoint {
    req: IncomingMessage;
    res: ServerResponse;
    layers: {
        auth: AuthLayer;
        data: DataLayer;
        storage: StorageLayer;
    };
    plugins: Plugin[];
    constructor(req: IncomingMessage, res: ServerResponse, layers: {
        auth: AuthLayer;
        data: DataLayer;
        storage: StorageLayer;
    }, plugins?: Plugin[]);
    respond: (this: WebfingerGetEndpoint) => Promise<void>;
}
