import { respond } from './respond';
import type { IncomingMessage, ServerResponse } from 'http';
import { Plugin, CoreLibrary } from '@activity-kit/types';

export class WebfingerGetEndpoint {
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
