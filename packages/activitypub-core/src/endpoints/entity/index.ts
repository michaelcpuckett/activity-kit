import { IncomingMessage, ServerResponse } from 'http';
import { DatabaseService } from '../../DatabaseService';
import { AP } from 'activitypub-core-types';
import {
  ACTIVITYSTREAMS_CONTENT_TYPE,
  CONTENT_TYPE_HEADER,
  JSON_CONTENT_TYPE,
  LINKED_DATA_CONTENT_TYPE,
  LOCAL_DOMAIN,
} from '../../globals';
import { getTypedEntity } from '../../utilities/getTypedEntity';
import { convertUrlsToStrings } from '../../utilities/convertUrlsToStrings';
import { stringifyWithContext } from '../../utilities/stringifyWithContext';

export async function entityGetHandler(
  request: IncomingMessage,
  response: ServerResponse,
  providedDatabaseService?: DatabaseService,
) {
  if (!response) {
    throw new Error('Bad request.');
  }

  const handleBadRequest = () => {
    response.statusCode = 500;
    response.write('Bad request');
    response.end();
    return {
      props: {},
    };
  };

  const handleNotFound = () => {
    response.statusCode = 400;
    response.write('Not found');
    response.end();
    return {
      props: {},
    };
  };

  if (!request) {
    return handleBadRequest();
  }

  const url = new URL(`${LOCAL_DOMAIN}${request.url}`);
  const databaseService =
    providedDatabaseService || (await DatabaseService.connect());
  const foundEntity = await databaseService.findEntityById(url);

  if (!foundEntity) {
    return handleNotFound();
  }

  const typedEntity = getTypedEntity(foundEntity);

  if (!typedEntity) {
    return handleNotFound();
  }

  let entity = await databaseService.expandEntity(typedEntity);

  if (!entity) {
    return handleNotFound();
  }

  if (
    entity.type === AP.CollectionTypes.COLLECTION ||
    entity.type === AP.CollectionTypes.ORDERED_COLLECTION
  ) {
    const collection = await databaseService.expandCollection(entity);

    if (collection) {
      entity = collection;
    }
  }

  if ('likes' in entity && entity.likes instanceof URL) {
    const foundLikesCollection = await databaseService.findEntityById(
      entity.likes,
    );

    if (
      foundLikesCollection &&
      foundLikesCollection.type === AP.CollectionTypes.ORDERED_COLLECTION
    ) {
      const expandedLikes = await databaseService.expandCollection(
        foundLikesCollection,
      );

      if (
        expandedLikes &&
        expandedLikes.type === AP.CollectionTypes.ORDERED_COLLECTION
      ) {
        entity.likes = expandedLikes;
      }
    }
  }

  if ('shares' in entity && entity.shares instanceof URL) {
    const foundSharesCollection = await databaseService.findEntityById(
      entity.shares,
    );

    if (
      foundSharesCollection &&
      foundSharesCollection.type === AP.CollectionTypes.ORDERED_COLLECTION
    ) {
      const expandedShares = await databaseService.expandCollection(
        foundSharesCollection,
      );

      if (
        expandedShares &&
        expandedShares.type === AP.CollectionTypes.ORDERED_COLLECTION
      ) {
        entity.shares = expandedShares;
      }
    }
  }

  if (
    request.headers.accept?.includes(ACTIVITYSTREAMS_CONTENT_TYPE) ||
    request.headers.accept?.includes(LINKED_DATA_CONTENT_TYPE) ||
    request.headers.accept?.includes(JSON_CONTENT_TYPE)
  ) {
    if (!entity) {
      return handleNotFound();
    }

    response.setHeader(CONTENT_TYPE_HEADER, ACTIVITYSTREAMS_CONTENT_TYPE);
    response.statusCode = 200;
    response.write(stringifyWithContext(entity));
    response.end();

    return {
      props: {},
    };
  }

  return {
    props: {
      entity: convertUrlsToStrings(entity),
    },
  };
}
