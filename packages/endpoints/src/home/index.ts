import type { IncomingMessage, ServerResponse } from 'http';
import { CoreLibrary, Plugin } from '@activity-kit/core';
import { respond } from './respond';

export class HomeGetEndpoint {
  req: IncomingMessage;
  res: ServerResponse;
  core: CoreLibrary;
  plugins?: Plugin[];

  constructor(
    req: IncomingMessage,
    res: ServerResponse,
    core: CoreLibrary,
    plugins?: Plugin[],
  ) {
    this.req = req;
    this.res = res;
    this.core = core;
    this.plugins = plugins;
  }

  public respond = respond;
}
