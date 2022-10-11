import type { NextPageContext } from 'next';
import { AP } from 'activitypub-core-types';
import { LOCAL_DOMAIN } from '../../globals';
import { DatabaseService } from '../../DatabaseService';
import { getServerSideProps as getEntityPageServerSideProps } from '../entity';
import { handleAccept } from './accept';
import { streamToString } from '../../utilities/streamToString';
import { handleAnnounce } from './announce';
import { handleFollow } from './follow';
import { handleLike } from './like';
import { shouldForwardActivity } from './shouldForwardActivity';
import { convertFromJsonLd } from '../../utilities/convertFromJsonLd';
import { addContext } from '../../utilities/addContext';
import { cleanProps } from '../../utilities/cleanProps';
import { DeliveryService } from '../../DeliveryService';
import { convertStringsToUrls } from '../../utilities/convertStringsToUrls';
import { stringifyWithContext } from '../../utilities/stringifyWithContext';
import { parseStream } from '../../utilities/parseStream';
import { convertUrlsToStrings } from '../../utilities/convertUrlsToStrings';

export async function getServerSideProps(
  context: NextPageContext,
  providedDatabaseService?: DatabaseService,
  providedDeliveryService?: DeliveryService,
) {
  const { req } = context;

  if (!req) {
    throw new Error('Bad request.');
  }

  const databaseService =
    providedDatabaseService ?? (await DatabaseService.connect());
  const deliveryService =
    providedDeliveryService ?? new DeliveryService(databaseService);

  if (req.method === 'POST') {
    return await handlePost(context, databaseService, deliveryService);
  }

  return await getEntityPageServerSideProps(context);
}

async function handlePost(
  context: NextPageContext,
  databaseService: DatabaseService,
  deliveryService: DeliveryService,
) {
  const { req, res } = context;

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
