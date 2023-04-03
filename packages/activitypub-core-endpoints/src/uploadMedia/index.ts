import { Adapters, AP, Plugin, Routes } from 'activitypub-core-types';
import type { IncomingMessage, ServerResponse } from 'http';
import formidable from 'formidable';
import { getActor } from './getActor';
import { authenticateActor } from './authenticateActor';
import { parseBody } from './parseBody';
import { cleanup } from './cleanup';
import { saveActivity } from './saveActivity';

export class UploadMediaPostEndpoint {
  routes: Routes;
  req: IncomingMessage;
  res: ServerResponse;
  adapters: Adapters;
  plugins?: Plugin[];

  actor: AP.Actor | null = null;
  activity:
    | (AP.Create & {
        object: AP.Image | AP.Document | AP.Video | AP.Audio;
      })
    | null = null;
  file: formidable.File | null = null;

  protected getActor = getActor;
  protected authenticateActor = authenticateActor;
  protected parseBody = parseBody;
  protected cleanup = cleanup;
  protected saveActivity = saveActivity;

  constructor(
    routes: Routes,
    req: IncomingMessage,
    res: ServerResponse,
    adapters: Adapters,
    plugins?: Plugin[],
  ) {
    this.routes = routes;
    this.req = req;
    this.res = res;
    this.adapters = adapters;
    this.plugins = plugins;
  }

  public async respond() {
    try {
      await this.getActor();
      await this.authenticateActor();
      await this.parseBody();
      const url = await this.adapters.storage.upload(this.file);
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
