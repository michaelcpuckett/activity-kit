/// <reference types="node" />
import type { IncomingMessage, ServerResponse } from 'http';
import { respond } from './respond';
import { CoreLibrary, Plugin } from '@activity-kit/core';
export declare class NodeinfoGetEndpoint {
    req: IncomingMessage;
    res: ServerResponse;
    core: CoreLibrary;
    plugins?: Plugin[];
    constructor(req: IncomingMessage, res: ServerResponse, core: CoreLibrary, plugins: Plugin[]);
    respond: typeof respond;
}
