import * as AP from '@activity-kit/types';
import { guard, assert } from '@activity-kit/type-utilities';
import {
  deduplicateUrls,
  applyContext,
  cleanProps,
  CONTENT_TYPE_HEADER,
  ACTIVITYSTREAMS_CONTENT_TYPE,
  ACCEPT_HEADER,
  convertEntityToJson,
  getId,
} from '@activity-kit/utilities';

import { CoreLibrary } from '.';
import { getPrivateKey } from './util/getPrivateKey';

/**
 * Send an Activity to all of its recipients on behalf of an Actor.
 *
 * @returns A record of each URL and the HTTP status code of the response.
 */
export async function broadcast(
  this: CoreLibrary,
  activity: AP.Activity,
  actor: AP.Actor,
): Promise<Record<string, number>> {
  const activityWithContext = applyContext(activity);
  const cleanedActivity = cleanProps(activityWithContext);
  const plainEntity = convertEntityToJson(cleanedActivity);

  const recipientInboxUrls = await getRecipientInboxUrls.bind(this)(
    activity,
    actor,
  );

  const sendToRecipient = (recipientInboxUrl: URL) =>
    signAndSendToInboxUrl.call(this, recipientInboxUrl, actor, plainEntity);
  const promises = recipientInboxUrls.map(sendToRecipient);
  const resultEntries = await Promise.all(promises);

  return Object.fromEntries(resultEntries);
}

/**
 * Send to a single recipient on behalf of an Actor.
 *
 * @returns A tuple of the recipient's inbox URL and the HTTP status code of the
 * response.
 */
async function signAndSendToInboxUrl(
  this: CoreLibrary,
  foreignActorInbox: URL,
  actor: AP.Actor,
  plainEntity: Record<string, unknown>,
): Promise<[string, number]> {
  const headers = await getHeaders.bind(this)(
    actor,
    foreignActorInbox,
    plainEntity,
  );

  const statusCode = await this.fetch(foreignActorInbox.href, {
    method: 'post',
    body: JSON.stringify(plainEntity),
    headers,
  })
    .then(async (res) => {
      return res.status;
    })
    .catch(() => {
      return 0;
    });

  return [foreignActorInbox.href, statusCode];
}

/**
 * Get the headers for an Activity.
 * @returns A record of headers.
 */
async function getHeaders(
  this: CoreLibrary,
  actor: AP.Actor,
  foreignActorInbox: URL,
  plainEntity: Record<string, unknown>,
): Promise<Record<string, string>> {
  const actorId = getId(actor);

  assert.exists(actorId);

  const privateKey = await getPrivateKey.bind(this)(actor);

  const { dateHeader, digestHeader, signatureHeader } =
    await this.getHttpSignature(
      foreignActorInbox,
      actorId,
      privateKey,
      plainEntity,
    );

  if (!digestHeader || !dateHeader || !signatureHeader) {
    throw new Error('Failed to sign Activity');
  }

  return {
    [CONTENT_TYPE_HEADER]: ACTIVITYSTREAMS_CONTENT_TYPE,
    [ACCEPT_HEADER]: ACTIVITYSTREAMS_CONTENT_TYPE,
    Host: foreignActorInbox.hostname,
    Date: dateHeader,
    Digest: digestHeader,
    Signature: signatureHeader,
  };
}

/**
 * Get the inbox URLs of all recipients of an Activity.
 *
 * @returns An array of inbox URLs.
 */
async function getRecipientInboxUrls(
  this: CoreLibrary,
  activity: AP.Activity,
  actor: AP.Actor,
): Promise<URL[]> {
  const recipientUrls = await this.getRecipientUrls(activity);

  const extractUrl = async (recipientUrl: URL): Promise<URL | null> => {
    if (recipientUrl.href === getId(actor)?.href) {
      return null;
    }

    const foundEntity = await this.queryById(recipientUrl);

    if (!guard.isApActor(foundEntity)) {
      return null;
    }

    if (foundEntity.endpoints) {
      if (guard.isUrl(foundEntity.endpoints.sharedInbox)) {
        return foundEntity.endpoints.sharedInbox;
      }
    }

    return getId(foundEntity.inbox);
  };

  const recipientInboxUrls = await Promise.all(recipientUrls.map(extractUrl));

  const filteredUrls = recipientInboxUrls.filter(guard.isUrl);

  return deduplicateUrls(filteredUrls);
}
