/// <reference types="node" />
import type { IncomingMessage, ServerResponse } from 'http';
import { Library, Plugin } from 'activitypub-core-types';
export declare class HomeGetEndpoint {
    req: IncomingMessage;
    res: ServerResponse;
    lib: Library;
    plugins?: Plugin[];
    constructor(req: IncomingMessage, res: ServerResponse, lib: Library, plugins?: Plugin[]);
    respond: (this: HomeGetEndpoint, render: (...args: unknown[]) => Promise<string>) => Promise<void>;
}
