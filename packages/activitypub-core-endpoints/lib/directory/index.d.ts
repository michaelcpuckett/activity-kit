/// <reference types="node" />
/// <reference types="node" />
import { Plugin } from 'activitypub-core-types';
import type { DbAdapter, AuthAdapter } from 'activitypub-core-types';
import type { IncomingMessage, ServerResponse } from 'http';
export declare class DirectoryGetEndpoint {
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
    respond(render: Function): Promise<void>;
}
