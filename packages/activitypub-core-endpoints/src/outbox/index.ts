import { AP } from 'activitypub-core-types';
import type { Auth, Database } from 'activitypub-core-types';
import type { IncomingMessage, ServerResponse } from 'http';
import {
  isTypeOf,
  getGuid,
  combineAddresses,
  LOCAL_DOMAIN,
  getId,
} from 'activitypub-core-utilities';
import { entityGetHandler } from '../entity';
import { DeliveryService } from 'activitypub-core-delivery';
import { runSideEffects } from './runSideEffects';
import { authenticateActor } from './authenticateActor';
import { wrapInActivity } from './wrapInActivity';
import { saveActivity } from './saveActivity';
import { parseBody } from './parseBody';
import { getActor } from './getActor';
import { handleDelete } from './sideEffects/delete';
import { handleCreate } from './sideEffects/create';
import { handleUpdate } from './sideEffects/update';
import { handleLike } from './sideEffects/like';
import { handleAnnounce } from './sideEffects/announce';
import { handleAdd } from './sideEffects/add';
import { handleUndo } from './sideEffects/undo';
import { handleRemove } from './sideEffects/remove';
import { handleUndoLike } from './sideEffects/undo/undoLike';
import { handleUndoAnnounce } from './sideEffects/undo/undoAnnounce';

export async function outboxHandler(
  req: IncomingMessage,
  res: ServerResponse,
  authenticationService: Auth,
  databaseService: Database,
  deliveryService: DeliveryService,
) {
  if (!req) {
    throw new Error('Bad request: not found.');
  }

  if (req.method === 'POST') {
    const handler = new OutboxPostHandler(req, res, authenticationService, databaseService, deliveryService);
    await handler.init();

    return {
      props: {},
    };
  }

  return await entityGetHandler(
    req,
    res,
    authenticationService,
    databaseService,
  );
}

export class OutboxPostHandler {
  req: IncomingMessage;
  res: ServerResponse;
  authenticationService: Auth;
  databaseService: Database;
  deliveryService: DeliveryService;
  
  actor: AP.Actor|null = null;
  activity: AP.Entity|null = null;

  constructor(
    req: IncomingMessage,
    res: ServerResponse,
    authenticationService: Auth,
    databaseService: Database,
    deliveryService: DeliveryService
  ) {
    this.req = req;
    this.res = res;
    this.authenticationService = authenticationService;
    this.databaseService = databaseService;
    this.deliveryService = deliveryService;
  }

  async init() {
    try {
      await this.parseBody();
      await this.getActor();
      await this.authenticateActor();

      const activityId = new URL(`${LOCAL_DOMAIN}/activity/${getGuid()}`);
      this.activity.id = activityId; // Overwrite ID

      // If this is an activity...
      if (isTypeOf(this.activity, AP.ActivityTypes)) {
        (this.activity as AP.Activity).url = activityId;

        // If the activity has an object...
        if ('object' in this.activity) {

          // First check that any attached `object` with ID really exists.
          const objectId = getId(this.activity.object);

          if (objectId) {
            const remoteObject = await this.databaseService.queryById(objectId);

            if (!remoteObject) {
              throw new Error('Bad object: Object with ID does not exist!');
            }
          }

          // Then run side effects.
          await this.runSideEffects();
        }
      } else {
        // If not activity type, wrap object in a Create activity.
        await this.wrapInActivity();
      }

      // Address activity and object the same way.
      this.activity = combineAddresses(this.activity as AP.Activity);

      // Commit to database.
      await this.saveActivity();
      
      if (!this.activity.id) {
        throw new Error('Bad activity: No ID.');
      }

      // Broadcast to Fediverse.
      await this.deliveryService.broadcast(this.activity, this.actor);

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

  protected authenticateActor = authenticateActor;
  protected getActor = getActor;
  protected runSideEffects = runSideEffects;
  protected saveActivity = saveActivity;
  protected wrapInActivity = wrapInActivity;
  protected parseBody = parseBody;

  // Side effects.

  protected handleAdd = handleAdd;
  protected handleAnnounce = handleAnnounce;
  protected handleCreate = handleCreate;
  protected handleDelete = handleDelete;
  protected handleLike = handleLike;
  protected handleRemove = handleRemove;
  protected handleUpdate = handleUpdate;

  protected handleUndo = handleUndo;
  protected handleUndoLike = handleUndoLike;
  protected handleUndoAnnounce = handleUndoAnnounce;
}

