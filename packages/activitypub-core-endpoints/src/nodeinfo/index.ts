import type { IncomingMessage, ServerResponse } from 'http';
import { respond } from './respond';
import { Library, Plugin } from 'activitypub-core-types';

export class NodeinfoGetEndpoint {
  req: IncomingMessage;
  res: ServerResponse;
  lib: Library;
  plugins?: Plugin[];

  constructor(
    req: IncomingMessage,
    res: ServerResponse,
    lib: Library,
    plugins: Plugin[],
  ) {
    this.req = req;
    this.res = res;
    this.lib = lib;
    this.plugins = plugins;
  }

  public respond = respond;
}
