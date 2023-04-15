/// <reference types="node" />
import type { IncomingMessage, ServerResponse } from 'http';
import { Library, Plugin } from 'activitypub-core-types';
export declare class ProxyGetEndpoint {
    req: IncomingMessage;
    res: ServerResponse;
    lib: Library;
    plugins?: Plugin[];
    constructor(req: IncomingMessage, res: ServerResponse, lib: Library, plugins?: Plugin[]);
    respond(): Promise<void>;
}
