/// <reference types="node" />
/// <reference types="node" />
import { AP, Plugin } from 'activitypub-core-types';
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
    protected handleBadRequest(): {
        props: {};
    };
    protected handleFoundEntity(render: Function, entity: AP.Entity, authorizedActor?: AP.Actor): Promise<void>;
    protected handleNotFound(): {
        props: {};
    };
    respond(render: Function): Promise<{
        props: {};
    }>;
}
