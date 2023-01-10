/// <reference types="node" />
/// <reference types="node" />
import { Plugin } from 'activitypub-core-types';
import { handleFoundEntity } from './handleFoundEntity';
import { respond } from './respond';
import type { DbAdapter, AuthAdapter } from 'activitypub-core-types';
import type { IncomingMessage, ServerResponse } from 'http';
export declare class EntityGetEndpoint {
    req: IncomingMessage;
    res: ServerResponse;
    adapters: {
        auth: AuthAdapter;
        db: DbAdapter;
    };
    plugins?: Plugin[];
    url: URL;
    constructor(req: IncomingMessage, res: ServerResponse, adapters: {
        auth: AuthAdapter;
        db: DbAdapter;
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
