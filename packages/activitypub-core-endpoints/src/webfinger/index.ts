import { respond } from './respond';
import type { IncomingMessage, ServerResponse } from 'http';
import type { DbAdapter, Plugin } from 'activitypub-core-types';

export class WebfingerGetEndpoint {
  req: IncomingMessage;
  res: ServerResponse;
  adapters: {
    db: DbAdapter;
  };
  plugins: Plugin[];

  constructor(
    req: IncomingMessage,
    res: ServerResponse,
    adapters: {
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
