import { AP } from '../../types';
import type { NextPageContext } from 'next';
import { DatabaseService } from '../../DatabaseService';
import { LOCAL_DOMAIN } from '../../globals';
import { getServerSideProps as getEntityPageServerSideProps } from '../entity';
import { handleDelete } from './delete';
import { handleCreate } from './create';
import { handleUpdate } from './update';
import { handleLike } from './like';
import { handleAnnounce } from './announce';
import { handleAdd } from './add';
import { handleRemove } from './remove';
import { getGuid } from '../../utilities/getGuid';
import { streamToString } from '../../utilities/streamToString';
import { getId } from '../../utilities/getId';
import { combineAddresses } from '../../utilities/combineAddresses';
import { handleUndo } from './undo';
import { addContext } from '../../utilities/addContext';
import { cleanProps } from '../../utilities/cleanProps';
import { DeliveryService } from '../../DeliveryService';
import { parseStream } from '../../utilities/parseStream';
import { convertUrlsToStrings } from '../../utilities/convertUrlsToStrings';
import { stringifyWithContext } from '../../utilities/stringifyWithContext';

export async function getServerSideProps(
  context: NextPageContext,
  providedDatabaseService?: DatabaseService,
  providedDeliveryService?: DeliveryService,
) {
  const { req } = context;

  if (!req) {
    throw new Error('No request object.');
  }

  const databaseService =
    providedDatabaseService ?? (await DatabaseService.connect());
  const deliveryService =
    providedDeliveryService ?? new DeliveryService(databaseService);

  if (req.method === 'POST') {
    return await handleOutboxPost(context, databaseService, deliveryService);
  }

  return await getEntityPageServerSideProps(context, databaseService);
}

async function handleOutboxPost(
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
    const initiator = await databaseService.findOne('actor', {
      outbox: url,
    });

    if (!initiator || !initiator.id || !('outbox' in initiator)) {
      throw new Error('No actor with this outbox.');
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
    switch (activity.type) {
      case AP.ActivityTypes.CREATE:
        activity.object = await handleCreate(activity, databaseService);
        break;
      case AP.ActivityTypes.DELETE:
        await handleDelete(activity, databaseService);
        break;
      case AP.ActivityTypes.UPDATE:
        await handleUpdate(activity, databaseService);
        break;
      case AP.ActivityTypes.LIKE:
        await handleLike(activity, databaseService);
        break;
      case AP.ActivityTypes.ANNOUNCE:
        await handleAnnounce(activity, databaseService);
        break;
      case AP.ActivityTypes.ADD:
        await handleAdd(activity, databaseService);
        break;
      case AP.ActivityTypes.REMOVE:
        await handleRemove(activity, databaseService);
        break;
      case AP.ActivityTypes.UNDO:
        await handleUndo(activity, databaseService, initiator);
        break;
    }

    const saveActivity = async (activityToSave: AP.Activity) => {
      const activityToSaveId = activityToSave.id;

      if (!activityToSaveId) {
        throw new Error('No Activity ID');
      }

      activityToSave.url = activityToSaveId;
      activityToSave.published = new Date();

      await databaseService.saveEntity(activityToSave);
      await databaseService.insertOrderedItem(
        initiatorOutboxId,
        activityToSaveId,
      );
      await deliveryService.broadcast(activityToSave, initiator);

      res.statusCode = 201;
      if (activityToSave.id) {
        res.setHeader('Location', activityToSave.id.toString());
      }
      res.write(stringifyWithContext(activityToSave));
      res.end();

      return {
        props: {},
      };
    };

    for (const type of Object.values(AP.ActivityTypes)) {
      if (type === activity.type) {
        return await saveActivity(activity);
      }
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
