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
} from '@activity-kit/utilities';

import { CoreLibrary } from './adapters';

export async function fetchEntityById(
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

  const { dateHeader, signatureHeader } = await this.getHttpSignature(
    id,
    botActorId,
    await this.getPrivateKey(botActor),
  );

  const headers = {
    date: dateHeader,
    signature: signatureHeader,
  };

  const fetchedJson = await fetchJsonByUrl.bind(this)(id, headers);

  if (fetchedJson) {
    const convertedEntity = convertJsonToEntity(fetchedJson);

    if (convertedEntity) {
      const entity = compressEntity(convertedEntity);

      if (entity) {
        await this.saveEntity(entity);
        return entity;
      }
    }
  }

  return null;
}

async function fetchJsonByUrl(
  this: CoreLibrary,
  url: URL,
  headers: Record<string, string>,
): Promise<Record<string, unknown> | null> {
  type Response = Awaited<ReturnType<(typeof this)['fetch']>>;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 1250);
  const config = {
    signal: controller.signal,
    headers: {
      ...headers,
      // GET requests (eg. to the inbox) MUST be made with an Accept header of
      // `application/ld+json; profile="https://www.w3.org/ns/activitystreams"`
      [ACCEPT_HEADER]: ACTIVITYSTREAMS_CONTENT_TYPE,
    },
  };

  async function handleResponse(response: Response) {
    clearTimeout(timeout);

    const data = await response.json();

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
          id: url.href,
          url: url.href,
        };
      }
    }

    if (response.status >= 500) {
      console.log('Server error.', response.status, url.href);
      return null;
    }

    console.log('Unexpected status code.', response.status, url.href);

    return data;
  }

  async function handleError(error: Error) {
    clearTimeout(timeout);
    console.log(`${error}`);
    return null;
  }

  return await this.fetch(url.href, config)
    .then(handleResponse)
    .catch(handleError);
}

async function getContentType(
  this: CoreLibrary,
  url: URL,
): Promise<string | null> {
  const { headers } = await this.fetch(url.toString(), { method: 'HEAD' });
  return headers.get('Content-Type');
}

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

async function getBotActor(this: CoreLibrary) {
  const botActor = await this.findOne('entity', {
    preferredUsername: SERVER_ACTOR_USERNAME,
  });

  return cast.isApActor(botActor) ?? null;
}
