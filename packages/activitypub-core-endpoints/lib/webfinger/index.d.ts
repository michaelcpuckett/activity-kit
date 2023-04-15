/// <reference types="node" />
import type { IncomingMessage, ServerResponse } from 'http';
import { Plugin, Library } from 'activitypub-core-types';
export declare class WebfingerGetEndpoint {
    req: IncomingMessage;
    res: ServerResponse;
    lib: Library;
    plugins?: Plugin[];
    constructor(req: IncomingMessage, res: ServerResponse, lib: Library, plugins?: Plugin[]);
    respond: (this: WebfingerGetEndpoint) => Promise<void>;
}
