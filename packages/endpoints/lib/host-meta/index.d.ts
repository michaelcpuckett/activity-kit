/// <reference types="node" />
import type { IncomingMessage, ServerResponse } from 'http';
import { CoreLibrary, Plugin } from '@activity-kit/types';
export declare class HostMetaGetEndpoint {
  req: IncomingMessage;
  res: ServerResponse;
  core: CoreLibrary;
  plugins?: Plugin[];
  constructor(
    req: IncomingMessage,
    res: ServerResponse,
    core: CoreLibrary,
    plugins?: Plugin[],
  );
  respond(): Promise<void>;
}
