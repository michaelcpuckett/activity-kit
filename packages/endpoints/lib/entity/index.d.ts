/// <reference types="node" />
import { CoreLibrary } from '@activity-kit/types';
import { handleFoundEntity } from './handleFoundEntity';
import { respond } from './respond';
export declare class EntityGetEndpoint {
    protected readonly core: CoreLibrary;
    protected url: URL;
    protected returnHtml: boolean;
    constructor(core: CoreLibrary, options: {
        url: URL;
        returnHtml?: boolean;
    });
    protected handleFoundEntity: typeof handleFoundEntity;
    protected handleBadRequest(): {
        statusCode: number;
        body: string;
    };
    protected handleNotFound(): {
        statusCode: number;
        body: string;
    };
    respond: typeof respond;
}
