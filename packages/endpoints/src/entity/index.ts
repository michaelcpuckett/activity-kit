import { CoreLibrary } from '@activity-kit/core';
import { handleNotFound } from './handleNotFound';
import { handleFoundEntity } from './handleFoundEntity';
import { handleFoundCollection } from './handleFoundCollection';
import { handleFoundCollectionPage } from './handleFoundCollectionPage';
import { respond } from './respond';

export class EntityGetEndpoint {
  protected url: URL;
  protected returnHtml: boolean;

  constructor(
    protected readonly core: CoreLibrary,
    options: {
      url: URL;
      returnHtml?: boolean;
    },
  ) {
    this.url = options.url;
    this.returnHtml = options.returnHtml ?? false;
  }

  protected handleNotFound = handleNotFound;
  protected handleFoundEntity = handleFoundEntity;
  protected handleFoundCollection = handleFoundCollection;
  protected handleFoundCollectionPage = handleFoundCollectionPage;

  public respond = respond;
}
