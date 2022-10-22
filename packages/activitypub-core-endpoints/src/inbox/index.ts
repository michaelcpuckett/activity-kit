import { AP } from 'activitypub-core-types';
import { LOCAL_DOMAIN } from 'activitypub-core-utilities';
import type { IncomingMessage, ServerResponse } from 'http';
import { entityGetHandler } from '../entity';
import { handleAccept } from './accept';
import { handleAnnounce } from './announce';
import { handleFollow } from './follow';
import { handleLike } from './like';
import { handleCreate } from './create';
import { shouldForwardActivity } from './shouldForwardActivity';
import { stringify } from 'activitypub-core-utilities';
import { parseStream } from 'activitypub-core-utilities';
import type { Database, Auth } from 'activitypub-core-types';
import { DeliveryService } from 'activitypub-core-delivery';
import { isType } from 'activitypub-core-utilities';

export async function inboxHandler(
  req: IncomingMessage,
  res: ServerResponse,
  authenticationService: Auth,
  databaseService: Database,
  deliveryService: DeliveryService,
) {
  if (!req) {
    throw new Error('Bad request.');
  }

  if (req.method === 'POST') {
    return await handlePost(req, res, databaseService, deliveryService);
  }

  return await entityGetHandler(
    req,
    res,
    authenticationService,
    databaseService,
  );
}

async function handlePost(
  req: IncomingMessage,
  res: ServerResponse,
  databaseService: Database,
  deliveryService: DeliveryService,
) {
  if (!req || !res) {
    throw new Error('No response object.');
  }

  const url = `${LOCAL_DOMAIN}${req.url}`;

  try {
    const recipient = await databaseService.findOne('actor', {
      inbox: url,
    });

    if (!recipient || !recipient.id || !('inbox' in recipient)) {
      throw new Error('No actor with this inbox.');
    }

    const recipientInboxId = new URL(url);
    const activity = await parseStream(req);

    if (!activity) {
      throw new Error('bad JSONLD?');
    }

    const activityId = activity.id;

    if (!activityId) {
      throw new Error('Activity does not have an ID?');
    }

    if (!('actor' in activity)) {
      throw new Error('Bad activity, no actor.');
    }

    if ('object' in activity) {
      if (isType(activity, AP.ActivityTypes.CREATE)) {
        await handleCreate(activity as AP.Create, databaseService);
      }

      if (isType(activity, AP.ActivityTypes.FOLLOW)) {
        await handleFollow(
          activity as AP.Follow,
          databaseService,
          deliveryService,
        );
      }

      if (isType(activity, AP.ActivityTypes.ACCEPT)) {
        await handleAccept(activity as AP.Accept, databaseService);
      }

      if (isType(activity, AP.ActivityTypes.LIKE)) {
        await handleLike(activity as AP.Like, databaseService);
      }

      if (isType(activity, AP.ActivityTypes.ANNOUNCE)) {
        await handleAnnounce(activity as AP.Announce, databaseService);
      }
    }

    if (await shouldForwardActivity(activity, recipient, databaseService)) {
      await deliveryService.broadcast(activity, recipient);
    }

    await databaseService.saveEntity(activity);
    await databaseService.insertOrderedItem(recipientInboxId, activityId);

    res.statusCode = 200;
    res.write(stringify(activity));
    res.end();

    return {
      props: {},
    };
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
