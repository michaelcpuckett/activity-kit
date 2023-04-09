import { Plugin } from 'activitypub-core-types';
import { LOCAL_DOMAIN } from 'activitypub-core-utilities';
import { handleFoundEntity } from './handleFoundEntity';
import { respond } from './respond';
import type { DbAdapter, AuthAdapter, Routes } from 'activitypub-core-types';
import type { IncomingMessage, ServerResponse } from 'http';

export class EntityGetEndpoint {
  req: IncomingMessage & {
    params: { [key: string]: string };
  };
  res: ServerResponse;
  adapters: {
    auth: AuthAdapter;
    db: DbAdapter;
  };
  plugins?: Plugin[];
  routes?: Routes;
  url: URL;

  constructor(
    req: IncomingMessage & {
      params: { [key: string]: string };
    },
    res: ServerResponse,
    adapters: {
      auth: AuthAdapter;
      db: DbAdapter;
    },
    plugins?: Plugin[],
    url?: URL,
  ) {
    this.req = req;
    this.res = res;
    this.adapters = adapters;
    this.plugins = plugins;
    this.url = url ?? new URL(`${LOCAL_DOMAIN}${req.url}`);
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
