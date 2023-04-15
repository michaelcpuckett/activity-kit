/// <reference types="node" />
import { Plugin } from 'activitypub-core-types';
import { handleFoundEntity } from './handleFoundEntity';
import { respond } from './respond';
import type { Routes } from 'activitypub-core-types';
import type { IncomingMessage, ServerResponse } from 'http';
import { DataLayer } from 'activitypub-core-data-layer';
import { StorageLayer } from 'activitypub-core-storage-layer';
import { AuthLayer } from 'activitypub-core-auth-layer';
export declare class EntityGetEndpoint {
    req: IncomingMessage & {
        params: {
            [key: string]: string;
        };
    };
    res: ServerResponse;
    layers: {
        auth: AuthLayer;
        data: DataLayer;
        storage: StorageLayer;
    };
    plugins?: Plugin[];
    routes?: Routes;
    url: URL;
    constructor(req: IncomingMessage & {
        params: {
            [key: string]: string;
        };
    }, res: ServerResponse, layers: {
        auth: AuthLayer;
        data: DataLayer;
        storage: StorageLayer;
    }, plugins?: Plugin[], url?: URL);
    protected handleFoundEntity: typeof handleFoundEntity;
    protected handleBadRequest(): {
        props: {};
    };
    protected handleNotFound(): {
        props: {};
    };
    respond: typeof respond;
}
