import { AP } from 'activitypub-core-types';
import {
  ACTIVITYSTREAMS_CONTENT_TYPE,
  CONTENT_TYPE_HEADER,
  getHttpSignature,
  JSON_CONTENT_TYPE,
  LINKED_DATA_CONTENT_TYPE,
  LOCAL_DOMAIN,
} from 'activitypub-core-utilities';
import { getTypedEntity } from 'activitypub-core-utilities';
import { convertUrlsToStrings } from 'activitypub-core-utilities';
import { stringify } from 'activitypub-core-utilities';
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

  const authorizedActor = await databaseService.getActorByUserId(
    await authenticationService.getUserIdByToken(cookies.__session ?? ''),
  );

  // TODO authorize foundEntity posts by actor.

  const url = providedUrl ?? new URL(`${LOCAL_DOMAIN}${request.url}`);
  const foundEntity = await databaseService.findEntityById(url);

  if (!foundEntity) {
    return handleNotFound();
  }

  const entity = getTypedEntity(foundEntity);

  if (!entity) {
    return handleNotFound();
  }

  if ('publicKey' in entity && entity.publicKey) {
    entity.publicKey = entity.publicKey;
  }

  if (
    request.headers.accept?.includes(ACTIVITYSTREAMS_CONTENT_TYPE) ||
    request.headers.accept?.includes(LINKED_DATA_CONTENT_TYPE) ||
    request.headers.accept?.includes(JSON_CONTENT_TYPE)
  ) {
    // TODO sign HTTP signature

    response.setHeader(CONTENT_TYPE_HEADER, ACTIVITYSTREAMS_CONTENT_TYPE);
    response.statusCode = 200;
    response.write(stringify(entity));
    response.end();

    return {
      props: {},
    };
  }

  return {
    props: {
      entity: convertUrlsToStrings(entity),
      actor: convertUrlsToStrings(authorizedActor) as AP.Actor,
    },
  };
}
