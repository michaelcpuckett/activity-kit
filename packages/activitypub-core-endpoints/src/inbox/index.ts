import { AP } from 'activitypub-core-types';
import { LOCAL_DOMAIN } from 'activitypub-core-utilities';
import type { IncomingMessage, ServerResponse } from 'http';
import { entityGetHandler } from '../entity';
import { handleAccept } from './accept';
import { handleAnnounce } from './announce';
import { handleFollow } from './follow';
import { handleLike } from './like';
import { shouldForwardActivity } from './shouldForwardActivity';
import { stringifyWithContext } from 'activitypub-core-utilities';
import { parseStream } from 'activitypub-core-utilities';
import type { Database, Auth } from 'activitypub-core-types';
import { DeliveryService } from 'activitypub-core-delivery';

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

    console.log(activity);
    console.log('^ activity from user inbox')

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

    switch (activity.type) {
      case AP.ActivityTypes.FOLLOW:
        await handleFollow(
          activity as AP.Follow,
          databaseService,
          deliveryService,
        );
        break;
      case AP.ActivityTypes.ACCEPT:
        await handleAccept(activity as AP.Accept, databaseService);
        break;
      case AP.ActivityTypes.LIKE:
        await handleLike(activity as AP.Like, databaseService);
        break;
      case AP.ActivityTypes.ANNOUNCE:
        await handleAnnounce(activity as AP.Announce, databaseService);
        break;
    }

    if (await shouldForwardActivity(activity, recipient, databaseService)) {
      await deliveryService.broadcast(activity, recipient);
    }

    await databaseService.saveEntity(activity);
    await databaseService.insertOrderedItem(recipientInboxId, activityId);

    res.statusCode = 200;
    res.write(stringifyWithContext(activity));
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
