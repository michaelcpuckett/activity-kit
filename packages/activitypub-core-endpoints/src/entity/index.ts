import { AP } from 'activitypub-core-types';
import {
  ACTIVITYSTREAMS_CONTENT_TYPE,
  compressEntity,
  CONTENT_TYPE_HEADER,
  JSON_CONTENT_TYPE,
  LINKED_DATA_CONTENT_TYPE,
  LOCAL_DOMAIN,
} from 'activitypub-core-utilities';
import { getTypedEntity } from 'activitypub-core-utilities';
import { convertUrlsToStrings } from 'activitypub-core-utilities';
import { stringify, applyContext } from 'activitypub-core-utilities';
import cookie from 'cookie';
import type { Database, Auth } from 'activitypub-core-types';
import type { IncomingMessage, ServerResponse } from 'http';

export async function entityGetHandler(
  request: IncomingMessage,
  response: ServerResponse,
  authenticationService: Auth,
  databaseService: Database,
  providedUrl?: URL,
): Promise<{ props?: { entity?: AP.Entity; actor?: AP.Actor } }> {
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

  const cookies = cookie.parse(request.headers.cookie ?? '');

  const actor = await databaseService.getActorByUserId(
    await authenticationService.getUserIdByToken(cookies.__session ?? ''),
  );

  // TODO authorize foundEntity posts by actor.

  const url = providedUrl ?? new URL(`${LOCAL_DOMAIN}${request.url}`);
  const foundEntity = await databaseService.queryById(url);

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
    entity.type === AP.CollectionTypes.ORDERED_COLLECTION ||
    (Array.isArray(entity.type) &&
      (entity.type.includes(AP.CollectionTypes.COLLECTION) ||
        entity.type.includes(AP.CollectionTypes.ORDERED_COLLECTION)))
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
      (foundLikesCollection &&
        foundLikesCollection.type === AP.CollectionTypes.ORDERED_COLLECTION) ||
      (Array.isArray(foundLikesCollection.type) &&
        foundLikesCollection.type.includes(
          AP.CollectionTypes.ORDERED_COLLECTION,
        ))
    ) {
      const expandedLikes = await databaseService.expandCollection(
        foundLikesCollection,
      );

      if (
        (expandedLikes &&
          expandedLikes.type === AP.CollectionTypes.ORDERED_COLLECTION) ||
        (Array.isArray(expandedLikes.type) &&
          expandedLikes.type.includes(AP.CollectionTypes.ORDERED_COLLECTION))
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
      (foundSharesCollection &&
        foundSharesCollection.type === AP.CollectionTypes.ORDERED_COLLECTION) ||
      (Array.isArray(foundSharesCollection.type) &&
        foundSharesCollection.type.includes(
          AP.CollectionTypes.ORDERED_COLLECTION,
        ))
    ) {
      const expandedShares = await databaseService.expandCollection(
        foundSharesCollection,
      );

      if (
        (expandedShares &&
          expandedShares.type === AP.CollectionTypes.ORDERED_COLLECTION) ||
        (Array.isArray(expandedShares.type) &&
          expandedShares.type.includes(AP.CollectionTypes.ORDERED_COLLECTION))
      ) {
        entity.shares = expandedShares;
      }
    }
  }

  const compressedEntity = compressEntity(applyContext(entity));

  if (entity.publicKey && 'publicKey' in compressedEntity) {
    compressedEntity.publicKey = entity.publicKey;
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
    response.write(stringify(compressedEntity));
    response.end();

    return {
      props: {},
    };
  }

  return {
    props: {
      entity: convertUrlsToStrings(entity),
      actor: convertUrlsToStrings(actor) as AP.Actor,
    },
  };
}
