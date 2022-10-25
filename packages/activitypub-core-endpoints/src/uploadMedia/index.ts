import { AP } from 'activitypub-core-types';
import type { Auth, Database, Storage } from 'activitypub-core-types';
import type { IncomingMessage, ServerResponse } from 'http';
import formidable from 'formidable';
import { getActor } from './getActor';
import { authenticateActor } from './authenticateActor';
import { parseBody } from './parseBody';

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
    await this.getActor();
    await this.authenticateActor();
    await this.parseBody();
  }
}