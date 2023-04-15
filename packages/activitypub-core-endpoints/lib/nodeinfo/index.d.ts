/// <reference types="node" />
import type { IncomingMessage, ServerResponse } from 'http';
import { respond } from './respond';
import type { Plugin } from 'activitypub-core-types';
import { AuthLayer } from 'activitypub-core-auth-layer';
import { DataLayer } from 'activitypub-core-data-layer';
import { StorageLayer } from 'activitypub-core-storage-layer';
export declare class NodeinfoGetEndpoint {
    req: IncomingMessage;
    res: ServerResponse;
    layers: {
        auth: AuthLayer;
        data: DataLayer;
        storage: StorageLayer;
    };
    plugins?: Plugin[];
    constructor(req: IncomingMessage, res: ServerResponse, layers: {
        auth: AuthLayer;
        data: DataLayer;
        storage: StorageLayer;
    }, plugins: Plugin[]);
    respond: typeof respond;
}
