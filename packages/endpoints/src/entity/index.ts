import { CoreLibrary } from '@activity-kit/types';
import { handleFoundEntity } from './handleFoundEntity';
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
    this.returnHtml = options.returnHtml;
  }

  protected handleFoundEntity = handleFoundEntity;

  protected handleBadRequest() {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Bad request',
      }),
    };
  }

  protected handleNotFound() {
    return {
      statusCode: 404,
      body: JSON.stringify({
        error: 'Not found',
      }),
    };
  }

  public respond = respond;
}
