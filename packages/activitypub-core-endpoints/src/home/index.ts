import type { IncomingMessage, ServerResponse } from 'http';
import type { Plugin } from 'activitypub-core-types';
import type { DbAdapter, AuthAdapter } from 'activitypub-core-types';
import { respond } from './respond';
import { DataLayer } from 'activitypub-core-data-layer';
import { StorageLayer } from 'activitypub-core-storage-layer';
import { AuthLayer } from 'activitypub-core-auth-layer';

export class HomeGetEndpoint {
  req: IncomingMessage;
  res: ServerResponse;
  layers: {
    auth: AuthLayer;
    data: DataLayer;
    storage: StorageLayer;
  };
  plugins?: Plugin[];

  constructor(
    req: IncomingMessage,
    res: ServerResponse,
    layers: {
      auth: AuthLayer;
      data: DataLayer;
      storage: StorageLayer;
    },
    plugins?: Plugin[],
  ) {
    this.req = req;
    this.res = res;
    this.layers = layers;
    this.plugins = plugins;
  }

  public respond = respond;
}
