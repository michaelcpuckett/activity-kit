/// <reference types="node" />
import { IncomingMessage } from 'http';
import { Plugin } from 'activitypub-core-types';
import type { ServerResponse } from 'http';
import type { Database, Auth } from 'activitypub-core-types';
export declare class HomeGetEndpoint {
    req: IncomingMessage;
    res: ServerResponse;
    adapters: {
        authentication: Auth;
        database: Database;
    };
    plugins?: Plugin[];
    constructor(req: IncomingMessage, res: ServerResponse, adapters: {
        authentication: Auth;
        database: Database;
    }, plugins?: Plugin[]);
    respond(render: Function): Promise<{
        redirect: {
            permanent: boolean;
            destination: string;
        };
    }>;
}
