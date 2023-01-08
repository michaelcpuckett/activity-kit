import type { IncomingMessage, ServerResponse } from 'http';
import type { Plugin } from 'activitypub-core-types';
import type { DbAdapter, AuthAdapter } from 'activitypub-core-types';
import { respond } from './respond';

export class HomeGetEndpoint {
  req: IncomingMessage;
  res: ServerResponse;
  adapters: {
    auth: AuthAdapter;
    db: DbAdapter;
  };
  plugins?: Plugin[];

  constructor(
    req: IncomingMessage,
    res: ServerResponse,
    adapters: {
      auth: AuthAdapter;
      db: DbAdapter;
    },
    plugins?: Plugin[],
  ) {
    this.req = req;
    this.res = res;
    this.adapters = adapters;
    this.plugins = plugins;
  }

  protected respond = respond;
}
