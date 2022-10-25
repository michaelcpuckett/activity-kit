import { AP } from 'activitypub-core-types';
import type { Auth, Database, Storage } from 'activitypub-core-types';
import type { IncomingMessage, ServerResponse } from 'http';
import formidable from 'formidable';
import { getActor } from './getActor';
import { authenticateActor } from './authenticateActor';
import { parseBody } from './parseBody';
import { cleanup } from './cleanup';

export async function uploadMediaHandler(
  req: IncomingMessage,
  res: ServerResponse,
  authenticationService: Auth,
  databaseService: Database,
  storageService: Storage,
) {
  return await new UploadMediaEndpoint(req, res, authenticationService, databaseService, storageService).handlePost();
}

export class UploadMediaEndpoint {
  req: IncomingMessage;
  res: ServerResponse;
  authenticationService: Auth;
  databaseService: Database;
  storageService: Storage;

  actor: AP.Actor | null = null;
  object: AP.Entity | null = null;
  file: formidable.File | null = null;

  protected getActor = getActor;
  protected authenticateActor = authenticateActor;
  protected parseBody = parseBody;
  protected cleanup = cleanup;

  constructor(
    req: IncomingMessage,
    res: ServerResponse,
    authenticationService: Auth,
    databaseService: Database,
    storageService: Storage,
  ) {
    this.req = req;
    this.res = res;
    this.authenticationService = authenticationService;
    this.databaseService = databaseService;
    this.storageService = storageService;
  }

  public async handlePost() {
    try {
      await this.getActor();
      await this.authenticateActor();
      await this.parseBody();
      await this.storageService.upload();
      await this.cleanup();
      await this.databaseService.saveEntity(this.object);

      this.res.statusCode = 201;
      this.res.setHeader('Location', this.object.id.toString());
      this.res.end();
    } catch (error: unknown) {
      console.log(error);
      this.res.statusCode = 500;
      this.res.write(String(error));
      this.res.end();
    }
  }
}