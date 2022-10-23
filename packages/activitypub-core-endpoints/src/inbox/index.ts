import { AP } from 'activitypub-core-types';
import type { IncomingMessage, ServerResponse } from 'http';
import type { Database, Auth } from 'activitypub-core-types';
import { entityGetHandler } from '../entity';
import { getActor } from './getActor';
import { saveActivity } from './saveActivity';
import { parseBody } from './parseBody';
import { runSideEffects } from './runSideEffects';
import { handleAccept } from './sideEffects/accept';
import { handleAnnounce } from './sideEffects/announce';
import { handleFollow } from './sideEffects/follow';
import { handleLike } from './sideEffects/like';
import { handleCreate } from './sideEffects/create';
import { shouldForwardActivity } from './shouldForwardActivity';
import { stringify } from 'activitypub-core-utilities';
import { DeliveryService } from 'activitypub-core-delivery';

export async function inboxHandler(
  req: IncomingMessage,
  res: ServerResponse,
  authenticationService: Auth,
  databaseService: Database,
  deliveryService: DeliveryService,
) {
  if (req.method === 'POST') {
    return await new InboxEndpoint(
      req,
      res,
      databaseService,
      deliveryService,
    ).handlePost();
  }

  return await entityGetHandler(
    req,
    res,
    authenticationService,
    databaseService,
  );
}

export class InboxEndpoint {
  req: IncomingMessage;
  res: ServerResponse;
  databaseService: Database;
  deliveryService: DeliveryService;

  activity: AP.Activity | null = null;
  actor: AP.Actor | null = null;

  protected getActor = getActor;
  protected runSideEffects = runSideEffects;
  protected parseBody = parseBody;
  protected saveActivity = saveActivity;
  protected shouldForwardActivity = shouldForwardActivity;

  protected handleCreate = handleCreate;
  protected handleAccept = handleAccept;
  protected handleAnnounce = handleAnnounce;
  protected handleFollow = handleFollow;
  protected handleLike = handleLike;

  constructor(
    req: IncomingMessage,
    res: ServerResponse,
    databaseService: Database,
    deliveryService: DeliveryService
  ) {
    this.req = req;
    this.res = res;
    this.databaseService = databaseService;
    this.deliveryService = deliveryService;
  }

  async handlePost() {
    try {
      await this.getActor();
      await this.parseBody();
      await this.runSideEffects();

      if (!('actor' in this.activity)) {
        throw new Error('Bad activity: no actor.');
      }

      if (await this.shouldForwardActivity()) {
        await this.deliveryService.broadcast(this.activity, this.actor);
      }

      await this.saveActivity();

      this.res.statusCode = 200;
      this.res.write(stringify(this.activity));
      this.res.end();

      return {
        props: {},
      };
    } catch (error: unknown) {
      console.log(error);

      this.res.statusCode = 500;
      this.res.write(String(error));
      this.res.end();

      return {
        props: {},
      };
    }
  }
}
