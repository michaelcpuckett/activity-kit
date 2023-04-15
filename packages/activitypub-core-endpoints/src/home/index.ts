import type { IncomingMessage, ServerResponse } from 'http';
import { Library, Plugin } from 'activitypub-core-types';
import { respond } from './respond';

export class HomeGetEndpoint {
  req: IncomingMessage;
  res: ServerResponse;
  lib: Library;
  plugins?: Plugin[];

  constructor(
    req: IncomingMessage,
    res: ServerResponse,
    lib: Library,
    plugins?: Plugin[],
  ) {
    this.req = req;
    this.res = res;
    this.lib = lib;
    this.plugins = plugins;
  }

  public respond = respond;
}
