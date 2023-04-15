/// <reference types="node" />
import type { IncomingMessage, ServerResponse } from 'http';
import { respond } from './respond';
import { Library, Plugin } from 'activitypub-core-types';
export declare class NodeinfoGetEndpoint {
    req: IncomingMessage;
    res: ServerResponse;
    lib: Library;
    plugins?: Plugin[];
    constructor(req: IncomingMessage, res: ServerResponse, lib: Library, plugins: Plugin[]);
    respond: typeof respond;
}
