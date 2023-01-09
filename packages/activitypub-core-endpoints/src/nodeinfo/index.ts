import type { IncomingMessage, ServerResponse } from 'http';
import { respond } from './respond';
import type { DbAdapter, Plugin } from 'activitypub-core-types';

export class NodeinfoGetEndpoint {
  req: IncomingMessage;
  res: ServerResponse;
  adapters: {
    db: DbAdapter;
  };
  plugins?: Plugin[];

  constructor(
    req: IncomingMessage,
    res: ServerResponse,
    adapters: {
      db: DbAdapter;
    },
    plugins: Plugin[]
  ) {
    this.req = req;
    this.res = res;
    this.adapters = adapters;
    this.plugins = plugins;
  }

  public respond = respond;
}

