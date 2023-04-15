/// <reference types="node" />
import type { IncomingMessage, ServerResponse } from 'http';
import type { Plugin } from 'activitypub-core-types';
import { DataLayer } from 'activitypub-core-data-layer';
import { StorageLayer } from 'activitypub-core-storage-layer';
import { AuthLayer } from 'activitypub-core-auth-layer';
export declare class HomeGetEndpoint {
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
    }, plugins?: Plugin[]);
    respond: (this: HomeGetEndpoint, render: (...args: unknown[]) => Promise<string>) => Promise<void>;
}
