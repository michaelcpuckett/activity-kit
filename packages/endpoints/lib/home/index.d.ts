/// <reference types="node" />
import type { IncomingMessage, ServerResponse } from 'http';
import { CoreLibrary, Plugin } from '@activity-kit/types';
export declare class HomeGetEndpoint {
    req: IncomingMessage;
    res: ServerResponse;
    core: CoreLibrary;
    plugins?: Plugin[];
    constructor(req: IncomingMessage, res: ServerResponse, core: CoreLibrary, plugins?: Plugin[]);
    respond: (this: HomeGetEndpoint, render: (...args: unknown[]) => Promise<string>) => Promise<void>;
}
