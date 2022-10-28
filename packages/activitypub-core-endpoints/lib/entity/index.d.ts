/// <reference types="node" />
/// <reference types="node" />
import { Plugin } from 'activitypub-core-types';
import type { Database, Auth } from 'activitypub-core-types';
import type { IncomingMessage, ServerResponse } from 'http';
export declare class EntityGetEndpoint {
    req: IncomingMessage;
    res: ServerResponse;
    adapters: {
        authentication: Auth;
        database: Database;
    };
    plugins?: Plugin[];
    url: URL;
    constructor(req: IncomingMessage, res: ServerResponse, adapters: {
        authentication: Auth;
        database: Database;
    }, plugins?: Plugin[], url?: URL);
    protected handleBadRequest(): {
        props: {};
    };
    protected handleNotFound(): {
        props: {};
    };
    respond(render: Function): Promise<{
        props: {};
    }>;
}
