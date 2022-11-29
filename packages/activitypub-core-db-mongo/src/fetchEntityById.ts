import { MongoDbAdapter } from '.';
import { AP } from 'activitypub-core-types';
import {
  ACCEPT_HEADER,
  ACTIVITYSTREAMS_CONTENT_TYPE,
  convertStringsToUrls,
  compressEntity,
  getHttpSignature
} from 'activitypub-core-utilities';

export async function fetchEntityById(
  this: MongoDbAdapter,
  id: URL,
): Promise<AP.Entity | null> {
  if (typeof this.fetch !== 'function') {
    return null;
  }

  // Send HTTP Signature for Mastodon in secure mode.
  const actor = await this.findOne('entity', { preferredUsername: 'bot' }) as AP.Actor;
  const {
    dateHeader,
    signatureHeader
  } = await getHttpSignature(
    id,
    actor.id,
    await this.getPrivateKey(actor),
  );

  // GET requests (eg. to the inbox) MUST be made with an Accept header of
  // `application/ld+json; profile="https://www.w3.org/ns/activitystreams"`
  const fetchedEntity = await this.fetch(id.toString(), {
    headers: {
      [ACCEPT_HEADER]: ACTIVITYSTREAMS_CONTENT_TYPE,
      date: dateHeader,
      signature: signatureHeader
    },
  })
    .then(
      async (response: { json: () => Promise<{ [key: string]: unknown }> }) => {
        return await response.json();
      },
    )
    .catch((error: unknown) => {
      console.log(String(error));
      return null;
    });

  // TODO Turn on smarter caching.
  // await this.saveThing(compressedEntity);

  return compressEntity(convertStringsToUrls(fetchedEntity));
}
