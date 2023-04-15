import { Plugin } from 'activitypub-core-types';
import { LOCAL_DOMAIN } from 'activitypub-core-utilities';
import { handleFoundEntity } from './handleFoundEntity';
import { respond } from './respond';
import type { Routes } from 'activitypub-core-types';
import type { IncomingMessage, ServerResponse } from 'http';
import { DataLayer } from 'activitypub-core-data-layer';
import { StorageLayer } from 'activitypub-core-storage-layer';
import { AuthLayer } from 'activitypub-core-auth-layer';

export class EntityGetEndpoint {
  req: IncomingMessage & {
    params: { [key: string]: string };
  };
  res: ServerResponse;
  layers: {
    auth: AuthLayer;
    data: DataLayer;
    storage: StorageLayer;
  };
  plugins?: Plugin[];
  routes?: Routes;
  url: URL;

  constructor(
    req: IncomingMessage & {
      params: { [key: string]: string };
    },
    res: ServerResponse,
    layers: {
      auth: AuthLayer;
      data: DataLayer;
      storage: StorageLayer;
    },
    plugins?: Plugin[],
    url?: URL,
  ) {
    this.req = req;
    this.res = res;
    this.layers = layers;
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
