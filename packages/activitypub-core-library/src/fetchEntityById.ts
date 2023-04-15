import { CoreLibrary } from '.';
import { AP, assertIsApActor } from 'activitypub-core-types';
import {
  ACCEPT_HEADER,
  ACTIVITYSTREAMS_CONTENT_TYPE,
  convertStringsToUrls,
  compressEntity,
} from 'activitypub-core-utilities';

export async function fetchEntityById(
  this: CoreLibrary,
  id: URL,
): Promise<AP.Entity | null> {
  // Send HTTP Signature for Mastodon in secure mode.
  const actor = await this.findOne('entity', {
    preferredUsername: 'bot',
  });

  assertIsApActor(actor);

  const { dateHeader, signatureHeader } = await this.getHttpSignature(
    id,
    actor.id,
    await this.getPrivateKey(actor),
  );

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 1250);

  // GET requests (eg. to the inbox) MUST be made with an Accept header of
  // `application/ld+json; profile="https://www.w3.org/ns/activitystreams"`
  const fetchedEntity = await this.fetch(id.toString(), {
    signal: controller.signal,
    headers: {
      [ACCEPT_HEADER]: ACTIVITYSTREAMS_CONTENT_TYPE,
      date: dateHeader,
      signature: signatureHeader,
    },
  })
    .then(async (response: { status: number; json: () => Promise<JSON> }) => {
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
        console.log('Found but not 200 or 404.', response.status);
        throw new Error(`Unexpected status code ${response.status}`);
      }
    })
    .catch((error: unknown) => {
      clearTimeout(timeout);
      console.log(String(error));
      return null;
    });

  if (fetchedEntity && 'id' in fetchedEntity) {
    const entity = compressEntity(convertStringsToUrls(fetchedEntity));
    await this.saveEntity(entity);
    return entity;
  }

  return null;
}
