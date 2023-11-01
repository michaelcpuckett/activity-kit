/// <reference types="node" />
import { CoreLibrary } from '@activity-kit/core';
import { handleNotFound } from './handleNotFound';
import { handleFoundEntity } from './handleFoundEntity';
import { handleFoundCollectionPage } from './handleFoundCollectionPage';
import { respond } from './respond';
export declare class EntityGetEndpoint {
    protected readonly core: CoreLibrary;
    protected url: URL;
    protected returnHtml: boolean;
    constructor(core: CoreLibrary, options: {
        url: URL;
        returnHtml?: boolean;
    });
    protected handleNotFound: typeof handleNotFound;
    protected handleFoundEntity: typeof handleFoundEntity;
    protected handleFoundCollection: any;
    protected handleFoundCollectionPage: typeof handleFoundCollectionPage;
    respond: typeof respond;
}
