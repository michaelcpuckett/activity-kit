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
    .then(async response => {
      if (response.status === 200) {
        return await response.json();
      } else if (response.status === 404) {
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
      console.log(String(error));
      
      // Check cache
      return this.findOne('remote-entity', {
        _id: id.toString(),
      });
    });

  // TODO Turn on smarter caching.
  // await this.saveThing(compressedEntity);

  return compressEntity(convertStringsToUrls(fetchedEntity));
}
