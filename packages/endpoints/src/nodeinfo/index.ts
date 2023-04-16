import type { IncomingMessage, ServerResponse } from 'http';
import { respond } from './respond';
import { CoreLibrary, Plugin } from '@activity-kit/types';

export class NodeinfoGetEndpoint {
  req: IncomingMessage;
  res: ServerResponse;
  core: CoreLibrary;
  plugins?: Plugin[];

  constructor(
    req: IncomingMessage,
    res: ServerResponse,
    core: CoreLibrary,
    plugins: Plugin[],
  ) {
    this.req = req;
    this.res = res;
    this.core = core;
    this.plugins = plugins;
  }

  public respond = respond;
}
