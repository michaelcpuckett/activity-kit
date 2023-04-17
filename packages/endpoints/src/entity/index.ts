import { Plugin, Routes, CoreLibrary } from '@activity-kit/types';
import { LOCAL_DOMAIN } from '@activity-kit/utilities';
import { handleFoundEntity } from './handleFoundEntity';
import { respond } from './respond';
import type { IncomingMessage, ServerResponse } from 'http';

export class EntityGetEndpoint {
  req: IncomingMessage & {
    params: { [key: string]: string };
  };
  res: ServerResponse;
  core: CoreLibrary;
  plugins?: Plugin[];
  routes?: Routes;
  url: URL;

  constructor(
    req: IncomingMessage & {
      params: { [key: string]: string };
    },
    res: ServerResponse,
    core: CoreLibrary,
    plugins?: Plugin[],
    url?: URL,
  ) {
    this.req = req;
    this.res = res;
    this.core = core;
    this.plugins = plugins;
    this.url = url ?? new URL(req.url, LOCAL_DOMAIN);
  }

  protected handleFoundEntity = handleFoundEntity;

  protected handleBadRequest() {
    this.res.statusCode = 500;
    this.res.write('Bad request');
    this.res.end();

    return {
      props: {},
    };
  }

  protected handleNotFound() {
    this.res.statusCode = 404;
    this.res.write('Not found');
    this.res.end();

    return {
      props: {},
    };
  }

  public respond = respond;
}