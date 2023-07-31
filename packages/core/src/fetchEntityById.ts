import * as AP from '@activity-kit/types';
import { cast, assert } from '@activity-kit/type-utilities';
import {
  ACCEPT_HEADER,
  ACTIVITYSTREAMS_CONTENT_TYPE,
  convertJsonToEntity,
  compressEntity,
  LINKED_DATA_CONTENT_TYPE,
  JSON_CONTENT_TYPE,
  getId,
  SERVER_ACTOR_USERNAME,
  ACTIVITYSTREAMS_CONTEXT,
  CONTENT_TYPE_HEADER,
} from '@activity-kit/utilities';

import { CoreLibrary } from './adapters';
import { Body } from './adapters/FetchPolyfill';

/**
 * Fetch an Entity by its URL.
 *
 * @returns The fetched Entity or null if the URL does not represent an Entity.
 */
export const fetchEntityById: CoreLibrary['fetchEntityById'] =
  async function fetchEntityById(
    this: CoreLibrary,
    id: URL,
  ): Promise<AP.Entity | null> {
    const isJsonLdContentType = await getIsJsonLdContentType.bind(this)(id);

    if (!isJsonLdContentType) {
      return null;
    }

    const botActor = await getBotActor.bind(this)();

    assert.exists(botActor);

    const botActorId = getId(botActor);

    assert.exists(botActorId);

    const privateKey = await getPrivateKey.bind(this)(botActor);

    assert.exists(privateKey);

    const { dateHeader, signatureHeader } = await this.getHttpSignature(
      id,
      botActorId,
      privateKey,
    );

    const headers = {
      date: dateHeader,
      signature: signatureHeader,
    };

    const fetchedJson = await fetchJsonByUrl.bind(this)(id, headers);

    if (!fetchedJson) {
      return null;
    }

    const convertedEntity = convertJsonToEntity(fetchedJson);

    if (!convertedEntity) {
      return null;
    }

    const entity = compressEntity(convertedEntity);

    if (!entity) {
      return null;
    }

    await this.saveEntity(entity);

    return entity;
  };

/**
 * Fetch a JSON object from a URL using the provided headers.
 */
async function fetchJsonByUrl(
  this: CoreLibrary,
  url: URL,
  headers: Record<string, string>,
): Promise<Record<string, unknown> | null> {
  const config = {
    headers: {
      ...headers,
      [ACCEPT_HEADER]: ACTIVITYSTREAMS_CONTENT_TYPE,
    },
  };

  return await this.fetch(url.href, config)
    .then(handleResponse)
    .catch(handleError);
}

/**
 * Handle a response from a fetch request.
 */
async function handleResponse(
  response: Body,
): Promise<Record<string, unknown> | null> {
  const data = cast.isPlainObject(await response.json()) ?? null;

  if (!data) {
    return null;
  }

  if (response.status === 200) {
    return data;
  }

  if (response.status === 400 || response.status === 410) {
    if ('@context' in data) {
      // Likely a tombstone
      return data;
    } else {
      // Return a tombstone
      return {
        '@context': ACTIVITYSTREAMS_CONTEXT,
        type: AP.ExtendedObjectTypes.TOMBSTONE,
        id: response.url,
        url: response.url,
      };
    }
  }

  if (response.status >= 500) {
    return null;
  }

  return data;
}

/**
 * Handle an error from a fetch request.
 */
async function handleError(error: Error) {
  console.log(`${error}`);
  return null;
}

/**
 * Get the content type of a URL.
 *
 * A HEAD request is used to determine if a URL is a JSON-LD object.
 */
async function getContentType(
  this: CoreLibrary,
  url: URL,
): Promise<string | null> {
  const response = await this.fetch(url.toString(), {
    method: 'HEAD',
    headers: {
      [ACCEPT_HEADER]: ACTIVITYSTREAMS_CONTENT_TYPE,
    },
  });

  return response.headers.get(CONTENT_TYPE_HEADER) ?? null;
}

/**
 * Check if a URL returns a content type that represent a JSON-LD object.
 */
async function getIsJsonLdContentType(
  this: CoreLibrary,
  url: URL,
): Promise<boolean> {
  const contentType = await getContentType.bind(this)(url);

  if (!contentType) {
    return false;
  }

  return (
    contentType.includes(ACTIVITYSTREAMS_CONTENT_TYPE) ||
    contentType.includes(LINKED_DATA_CONTENT_TYPE) ||
    contentType.includes(JSON_CONTENT_TYPE)
  );
}

/**
 * Get the server Actor.
 *
 * Mastodon in secure mode requires that all requests include a signature of the
 * Actor that is making the request. We use the server Actor.
 */
async function getBotActor(this: CoreLibrary) {
  const botActor = await this.findOne('entity', {
    preferredUsername: SERVER_ACTOR_USERNAME,
  });

  return cast.isApActor(botActor) ?? null;
}

/**
 * Get the private key of an Actor.
 */
async function getPrivateKey(
  this: CoreLibrary,
  actor: AP.Actor,
): Promise<string> {
  if (!actor.preferredUsername) {
    return '';
  }

  const userId = await this.findStringIdByValue(
    'username',
    actor.preferredUsername,
  );

  if (!userId) {
    return '';
  }

  return await this.findStringValueById('privateKey', userId);
}
