/// <reference types="node" />
import type { IncomingMessage, ServerResponse } from 'http';
import { Plugin, CoreLibrary } from '@activity-kit/types';
export declare class WebfingerGetEndpoint {
    req: IncomingMessage;
    res: ServerResponse;
    core: CoreLibrary;
    plugins?: Plugin[];
    constructor(req: IncomingMessage, res: ServerResponse, core: CoreLibrary, plugins?: Plugin[]);
    respond: (this: WebfingerGetEndpoint) => Promise<void>;
}
