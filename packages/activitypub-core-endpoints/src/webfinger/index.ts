import { respond } from './respond';
import type { IncomingMessage, ServerResponse } from 'http';
import { Plugin, Library } from 'activitypub-core-types';

export class WebfingerGetEndpoint {
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
