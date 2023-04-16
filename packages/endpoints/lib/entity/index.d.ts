/// <reference types="node" />
/// <reference types="node" />
import { Plugin, Routes, CoreLibrary } from '@activity-kit/types';
import { handleFoundEntity } from './handleFoundEntity';
import { respond } from './respond';
import type { IncomingMessage, ServerResponse } from 'http';
export declare class EntityGetEndpoint {
    req: IncomingMessage & {
        params: {
            [key: string]: string;
        };
    };
    res: ServerResponse;
    core: CoreLibrary;
    plugins?: Plugin[];
    routes?: Routes;
    url: URL;
    constructor(req: IncomingMessage & {
        params: {
            [key: string]: string;
        };
    }, res: ServerResponse, core: CoreLibrary, plugins?: Plugin[], url?: URL);
    protected handleFoundEntity: typeof handleFoundEntity;
    protected handleBadRequest(): {
        props: {};
    };
    protected handleNotFound(): {
        props: {};
    };
    respond: typeof respond;
}
