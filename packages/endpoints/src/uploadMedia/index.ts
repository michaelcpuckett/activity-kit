import * as AP from '@activity-kit/types';
import { CoreLibrary, Plugin, Routes } from '@activity-kit/core';
import type { IncomingMessage, ServerResponse } from 'http';
import type { File } from 'formidable';
import { getActor } from './getActor';
import { authenticateActor } from './authenticateActor';
import { parseBody } from './parseBody';
import { cleanup } from './cleanup';
import { saveActivity } from './saveActivity';
import { assertIsApExtendedObject } from '@activity-kit/type-utilities';

export class UploadMediaPostEndpoint {
  routes: Routes;
  req: IncomingMessage;
  res: ServerResponse;
  core: CoreLibrary;
  plugins?: Plugin[];

  actor: AP.Actor | null = null;
  activity: AP.TransitiveActivity<AP.AnyTransitiveActivityType> | null = null;
  file: File | null = null;

  protected getActor = getActor;
  protected authenticateActor = authenticateActor;
  protected parseBody = parseBody;
  protected cleanup = cleanup;
  protected saveActivity = saveActivity;

  constructor(
    routes: Routes,
    req: IncomingMessage,
    res: ServerResponse,
    core: CoreLibrary,
    plugins?: Plugin[],
  ) {
    this.routes = routes;
    this.req = req;
    this.res = res;
    this.core = core;
    this.plugins = plugins;
  }

  public async respond() {
    try {
      await this.getActor();
      await this.authenticateActor();
      await this.parseBody();
      assertIsApExtendedObject(this.activity.object);
      const url = await this.core.upload(this.file);
      this.activity.object.url = url;
      await this.cleanup();
      await this.saveActivity();

      this.res.statusCode = 201;
      this.res.setHeader('Location', this.activity.id.toString());
      this.res.end();
    } catch (error: unknown) {
      console.log(error);
      this.res.statusCode = 500;
      this.res.write(String(error));
      this.res.end();
    }
  }
}
