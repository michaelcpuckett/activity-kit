import { Core } from '.';
import * as AP from '@activity-kit/types';
import { assert } from '@activity-kit/type-utilities';
import {
  ACCEPT_HEADER,
  ACTIVITYSTREAMS_CONTENT_TYPE,
  convertJsonToEntity,
  compressEntity,
  LINKED_DATA_CONTENT_TYPE,
  JSON_CONTENT_TYPE,
  getId,
} from '@activity-kit/utilities';

export async function fetchEntityById(
  this: Core,
  id: URL,
): Promise<AP.Entity | null> {
  const getContentType = async (url: URL): Promise<string | null> => {
    const response = await this.fetch(url.toString(), { method: 'HEAD' });
    return response.headers.get('Content-Type');
  };

  const isJsonLdContentType = async (url: URL): Promise<boolean> => {
    const contentType = await getContentType(url);
    if (!contentType) {
      return false;
    }

    return (
      contentType.includes(ACTIVITYSTREAMS_CONTENT_TYPE) ||
      contentType.includes(LINKED_DATA_CONTENT_TYPE) ||
      contentType.includes(JSON_CONTENT_TYPE)
    );
  };

  if (!(await isJsonLdContentType(id))) {
    return null;
  }

  // Send HTTP Signature for Mastodon in secure mode.
  const actor = await this.findOne('entity', {
    preferredUsername: 'bot',
  });

  assert.isApActor(actor);

  const actorId = getId(actor);

  assert.exists(actorId);

  const { dateHeader, signatureHeader } = await this.getHttpSignature(
    id,
    actorId,
    await this.getPrivateKey(actor),
  );

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 1250);

  // GET requests (eg. to th e inbox) MUST be made with an Accept header of
  // `application/ld+json; profile="https://www.w3.org/ns/activitystreams"`
  const fetchedEntity: Record<string, unknown> | null = await this.fetch(
    id.toString(),
    {
      signal: controller.signal,
      headers: {
        [ACCEPT_HEADER]: ACTIVITYSTREAMS_CONTENT_TYPE,
        date: dateHeader,
        signature: signatureHeader,
      },
    },
  )
    .then(async (response) => {
      clearTimeout(timeout);
      if (response.status === 200) {
        return await response.json();
      } else if (response.status === 410) {
        const data = await response.json();

        if ('@context' in data) {
          console.log('Likely a Tombstone?');
          return data;
        } else {
          throw new Error('Not found, but not a tombstone.');
        }
      } else {
        console.log(
          'Found but not 200 or 404.',
          response.status,
          id.toString(),
        );
        throw new Error(`Unexpected status code ${response.status}`);
      }
    })
    .catch((error: unknown) => {
      clearTimeout(timeout);
      console.log(String(error));
      return null;
    });

  if (fetchedEntity) {
    const convertedEntity = convertJsonToEntity(fetchedEntity);

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
