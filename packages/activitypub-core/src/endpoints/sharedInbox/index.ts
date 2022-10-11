import { NextApiRequest, NextApiResponse } from 'next';
import { DatabaseService } from '../../DatabaseService';
import { AP } from 'activitypub-core-types';
import { convertFromJsonLd } from '../../utilities/convertFromJsonLd';
import { getId } from '../../utilities/getId';
import { streamToString } from '../../utilities/streamToString';
import { handleAccept } from '../inbox/accept';
import { handleAnnounce } from '../inbox/announce';
import { handleFollow } from '../inbox/follow';
import { handleLike } from '../inbox/like';
import { addContext } from '../../utilities/addContext';
import { cleanProps } from '../../utilities/cleanProps';
import { DeliveryService } from '../../DeliveryService';
import { parseStream } from '../../utilities/parseStream';
import { convertUrlsToStrings } from '../../utilities/convertUrlsToStrings';
import { stringifyWithContext } from '../../utilities/stringifyWithContext';

export async function handleSharedInboxPost(
  req: NextApiRequest,
  res: NextApiResponse,
  providedDatabaseService: DatabaseService,
  providedDeliveryService: DeliveryService,
) {
  if (!req || !res) {
    throw new Error('No response object.');
  }

  const databaseService: DatabaseService =
    providedDatabaseService ?? (await DatabaseService.connect());
  const deliveryService: DeliveryService =
    providedDeliveryService ?? new DeliveryService(databaseService);

  try {
    const activity = await parseStream(req);

    if (!activity) {
      throw new Error('Bad jsonld?');
    }

    const activityId = activity.id;

    if (!activityId) {
      throw new Error('Activity does not have an ID?');
    }

    if (!('actor' in activity)) {
      throw new Error('Bad activity, no actor.');
    }

    const actorId = getId(activity.actor);

    if (!actorId) {
      throw new Error('Bad activity, no actor ID');
    }

    const actor = await databaseService.queryById(actorId);

    if (!actor) {
      throw new Error('Bad activity, no actor');
    }

    switch (activity.type) {
      case AP.ActivityTypes.LIKE:
        await handleLike(activity as AP.Like, databaseService);
        break;
      case AP.ActivityTypes.ANNOUNCE:
        await handleAnnounce(activity as AP.Announce, databaseService);
        break;
      case AP.ActivityTypes.ACCEPT:
        await handleAccept(activity as AP.Accept, databaseService);
        break;
      case AP.ActivityTypes.FOLLOW:
        await handleFollow(
          activity as AP.Follow,
          databaseService,
          deliveryService,
        );
        break;
    }

    const recipientIds = await getRecipientInboxUrls(
      activity,
      actor as AP.Actor,
      databaseService,
      deliveryService,
    );

    for (const recipientId of recipientIds) {
      const recipient = (await databaseService.findEntityById(
        recipientId,
      )) as AP.Actor;

      if (!recipient) {
        continue;
      }

      const recipientInboxId = getId(recipient.inbox);

      if (!recipientInboxId) {
        continue;
      }

      await databaseService.insertOrderedItem(recipientInboxId, activityId);
    }

    // if (await shouldForwardActivity(activity, databaseService)) {
    //   await databaseService.broadcast(activity);
    // }

    await databaseService.saveEntity(activity);

    res.statusCode = 200;
    res.write(stringifyWithContext(activity));
    res.end();
  } catch (error) {
    console.log(error);

    res.statusCode = 500;
    res.write('Bad request');
    res.end();
    return;
  }
}

export async function getRecipientInboxUrls(
  activity: AP.Activity,
  actor: AP.Actor,
  databaseService: DatabaseService,
  providedDeliveryService: DeliveryService,
): Promise<URL[]> {
  const deliveryService =
    providedDeliveryService ?? new DeliveryService(databaseService);

  const recipients: URL[] = [
    ...(activity.to
      ? await deliveryService.getRecipientsList(activity.to)
      : []),
    ...(activity.cc
      ? await deliveryService.getRecipientsList(activity.cc)
      : []),
    ...(activity.bto
      ? await deliveryService.getRecipientsList(activity.bto)
      : []),
    ...(activity.bcc
      ? await deliveryService.getRecipientsList(activity.bcc)
      : []),
    ...(activity.audience
      ? await deliveryService.getRecipientsList(activity.audience)
      : []),
  ];

  const recipientInboxes = await Promise.all(
    recipients.map(async (recipient) => {
      if (recipient.toString() === actor.id?.toString()) {
        return null;
      }

      const foundThing = await databaseService.findEntityById(recipient);

      if (!foundThing) {
        return null;
      }

      if (
        typeof foundThing === 'object' &&
        'inbox' in foundThing &&
        foundThing.inbox
      ) {
        return foundThing.id;
      }
    }),
  );

  const recipientIds: URL[] = [];

  for (const recipientInbox of recipientInboxes) {
    if (recipientInbox instanceof URL) {
      recipientIds.push(recipientInbox);
    }
  }

  return [...new Set(recipientIds)];
}
