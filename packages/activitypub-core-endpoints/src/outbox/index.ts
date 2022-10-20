import { AP } from 'activitypub-core-types';
import type { Auth, Database } from 'activitypub-core-types';
import type { IncomingMessage, ServerResponse } from 'http';
import {
  ACTIVITYSTREAMS_CONTEXT,
  isTypeOf,
  LOCAL_DOMAIN,
} from 'activitypub-core-utilities';
import { entityGetHandler } from '../entity';
import { handleDelete } from './delete';
import { handleCreate } from './create';
import { handleUpdate } from './update';
import { handleLike } from './like';
import { handleAnnounce } from './announce';
import { handleAdd } from './add';
import { handleUndo } from './undo';
import { handleRemove } from './remove';
import { getGuid } from 'activitypub-core-utilities';
import { getId } from 'activitypub-core-utilities';
import { combineAddresses } from 'activitypub-core-utilities';
import { DeliveryService } from 'activitypub-core-delivery';
import { parseStream } from 'activitypub-core-utilities';
import { stringify, isType } from 'activitypub-core-utilities';
import cookie from 'cookie';

export async function outboxHandler(
  req: IncomingMessage,
  res: ServerResponse,
  authenticationService: Auth,
  databaseService: Database,
  deliveryService: DeliveryService,
) {
  if (!req) {
    throw new Error('No request object.');
  }

  if (req.method === 'POST') {
    return await handleOutboxPost(req, res, authenticationService, databaseService, deliveryService);
  }

  return await entityGetHandler(
    req,
    res,
    authenticationService,
    databaseService,
  );
}

async function handleOutboxPost(
  req: IncomingMessage,
  res: ServerResponse,
  authenticationService: Auth,
  databaseService: Database,
  deliveryService: DeliveryService,
) {
  if (!req || !res) {
    throw new Error('No response object.');
  }

  const url = `${LOCAL_DOMAIN}${req.url}`;

  try {
    const initiator = await databaseService.findOne('actor', {
      outbox: url,
    });

    if (!initiator || !initiator.id || !('outbox' in initiator)) {
      throw new Error('No actor with this outbox.');
    }

    // Auth

    const cookies = cookie.parse(req.headers.cookie ?? '');

    const actor = await databaseService.getActorByUserId(
      await authenticationService.getUserIdByToken(cookies.__session ?? ''),
    );

    if (!actor || actor.id.toString() !== initiator.id.toString()) {
      throw new Error('Not authorized.');
    }

    const initiatorOutboxId = new URL(url);
    const entity = await parseStream(req);

    if (!entity) {
      throw new Error('bad JSONLD?');
    }

    const activity: AP.Activity = combineAddresses(entity as AP.Activity);
    const activityId = new URL(`${LOCAL_DOMAIN}/activity/${getGuid()}`);
    activity.id = activityId; // Overwrite ID

    if ('object' in activity) {
      const objectId = getId(activity.object);

      if (objectId) {
        const remoteObject = await databaseService.queryById(objectId);

        if (!remoteObject) {
          throw new Error('Remote object does not exist!');
        }
      }
    }

    // Run side effects.
    if ('object' in activity) {
      if (isType(activity, AP.ActivityTypes.CREATE)) {
        activity.object = await handleCreate(activity as AP.Create, databaseService);
      }

      if (isType(activity, AP.ActivityTypes.DELETE)) {
        await handleDelete(activity as AP.Delete, databaseService);
      }

      if (isType(activity, AP.ActivityTypes.UPDATE)) {
        await handleUpdate(activity as AP.Update, databaseService);
      }

      if (isType(activity, AP.ActivityTypes.LIKE)) {
        await handleLike(activity as AP.Like, databaseService);
      }

      if (isType(activity, AP.ActivityTypes.ANNOUNCE)) {
        await handleAnnounce(activity as AP.Announce, databaseService);
      }

      if (isType(activity, AP.ActivityTypes.ADD)) {
        await handleAdd(activity as AP.Add, databaseService);
      }

      if (isType(activity, AP.ActivityTypes.REMOVE)) {
        await handleRemove(activity as AP.Remove, databaseService);
      }

      if (isType(activity, AP.ActivityTypes.UNDO)) {
        await handleUndo(activity as AP.Undo, databaseService, initiator);
      }
    }

    const saveActivity = async (activityToSave: AP.Activity) => {
      const activityToSaveId = activityToSave.id;

      if (!activityToSaveId) {
        throw new Error('No Activity ID');
      }

      activityToSave.url = activityToSaveId;

      const publishedDate = new Date();
      activityToSave.published = publishedDate;

      // Attach replies, likes, and shares.

      const activityReplies: AP.Collection = {
        '@context': new URL(ACTIVITYSTREAMS_CONTEXT),
        id: new URL(`${activityToSaveId.toString()}/replies`),
        url: new URL(`${activityToSaveId.toString()}/replies`),
        name: 'Replies',
        type: AP.CollectionTypes.COLLECTION,
        totalItems: 0,
        items: [],
        published: publishedDate,
      };

      const activityLikes: AP.OrderedCollection = {
        '@context': new URL(ACTIVITYSTREAMS_CONTEXT),
        id: new URL(`${activityToSaveId.toString()}/likes`),
        url: new URL(`${activityToSaveId.toString()}/likes`),
        name: 'Likes',
        type: AP.CollectionTypes.ORDERED_COLLECTION,
        totalItems: 0,
        orderedItems: [],
        published: publishedDate,
      };

      const activityShares: AP.OrderedCollection = {
        '@context': new URL(ACTIVITYSTREAMS_CONTEXT),
        id: new URL(`${activityToSaveId.toString()}/shares`),
        url: new URL(`${activityToSaveId.toString()}/shares`),
        name: 'Shares',
        type: AP.CollectionTypes.ORDERED_COLLECTION,
        totalItems: 0,
        orderedItems: [],
        published: publishedDate,
      };

      activityToSave.replies = activityReplies.id;
      activityToSave.likes = activityLikes.id;
      activityToSave.shares = activityShares.id;

      await Promise.all([
        databaseService.saveEntity(activityToSave),
        databaseService.saveEntity(activityReplies),
        databaseService.saveEntity(activityLikes),
        databaseService.saveEntity(activityShares),
        databaseService.insertOrderedItem(initiatorOutboxId, activityToSaveId),
      ]);

      await deliveryService.broadcast(activityToSave, initiator);

      res.statusCode = 201;
      if (activityToSave.id) {
        res.setHeader('Location', activityToSave.id.toString());
      }
      res.write(stringify(activityToSave));
      res.end();

      return {
        props: {},
      };
    };

    if (isTypeOf(activity, typeof AP.ActivityTypes)) {
      return await saveActivity(activity);
    }

    // Non-Activity object.
    const convertedActivity: AP.Create = {
      id: activityId,
      url: activityId,
      type: AP.ActivityTypes.CREATE,
      actor: initiator.id,
      object: activity,
    };

    convertedActivity.object = await handleCreate(
      convertedActivity,
      databaseService,
    );

    return await saveActivity(convertedActivity);
  } catch (error) {
    console.log(error);

    res.statusCode = 500;
    res.write('Bad request');
    res.end();

    return {
      props: {},
    };
  }
}
