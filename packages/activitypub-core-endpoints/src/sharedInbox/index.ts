import type { IncomingMessage, ServerResponse } from 'http';
import { AP } from 'activitypub-core-types';
import { handleAccept } from '../inbox/accept';
import { handleAnnounce } from '../inbox/announce';
import { handleFollow } from '../inbox/follow';
import { handleLike } from '../inbox/like';
import { getId } from 'activitypub-core-utilities';
import { parseStream } from 'activitypub-core-utilities';
import { stringify } from 'activitypub-core-utilities';
import type { Database } from 'activitypub-core-types';
import { DeliveryService } from 'activitypub-core-delivery';

export async function sharedInboxHandler(
  req: IncomingMessage,
  res: ServerResponse,
  databaseService: Database,
  deliveryService: DeliveryService,
) {
  if (!req || !res) {
    throw new Error('No response object.');
  }

  try {
    const activity = await parseStream(req);

    console.log(activity);
    console.log('^activity: sharedInbox');

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

    if ('object' in activity) {
      if (
        activity.type === AP.ActivityTypes.LIKE ||
        (Array.isArray(activity.type) &&
          activity.type.includes(AP.ActivityTypes.LIKE))
      ) {
        await handleLike(activity as AP.Like, databaseService);
      }

      if (
        activity.type === AP.ActivityTypes.ANNOUNCE ||
        (Array.isArray(activity.type) &&
          activity.type.includes(AP.ActivityTypes.ANNOUNCE))
      ) {
        await handleAnnounce(activity as AP.Announce, databaseService);
      }

      if (
        activity.type === AP.ActivityTypes.ACCEPT ||
        (Array.isArray(activity.type) &&
          activity.type.includes(AP.ActivityTypes.ACCEPT))
      ) {
        await handleAccept(activity as AP.Accept, databaseService);
      }

      if (
        activity.type === AP.ActivityTypes.FOLLOW ||
        (Array.isArray(activity.type) &&
          activity.type.includes(AP.ActivityTypes.FOLLOW))
      ) {
        await handleFollow(
          activity as AP.Follow,
          databaseService,
          deliveryService,
        );
      }
    }

    const recipientInboxIds = await getRecipientInboxIds(
      activity,
      actor as AP.Actor,
      databaseService,
      deliveryService,
    );

    console.log({ recipientInboxIds });

    for (const recipientInboxId of recipientInboxIds) {
      console.log(recipientInboxId);

      console.log('WILL INSERT...');

      if (!recipientInboxId) {
        continue;
      }

      console.log('INSERTING?');

      await databaseService.insertOrderedItem(recipientInboxId, activityId);
    }

    // if (await shouldForwardActivity(activity, databaseService)) {
    //   await databaseService.broadcast(activity);
    // }

    await databaseService.saveEntity(activity);

    res.statusCode = 200;
    res.write(stringify(activity));
    res.end();
  } catch (error) {
    console.log(error);

    res.statusCode = 500;
    res.write('Bad request');
    res.end();
    return;
  }
}

export async function getRecipientInboxIds(
  activity: AP.Activity,
  actor: AP.Actor,
  databaseService: Database,
  providedDeliveryService: DeliveryService,
): Promise<URL[]> {
  console.log('TEST HERE', activity.cc);
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
        return foundThing.inbox;
      }
    }),
  );

  const recipientInboxIds: URL[] = [];

  for (const recipientInbox of recipientInboxes) {
    if (recipientInbox instanceof URL) {
      recipientInboxIds.push(recipientInbox);
    }
  }

  return [...new Set(recipientInboxIds)];
}
