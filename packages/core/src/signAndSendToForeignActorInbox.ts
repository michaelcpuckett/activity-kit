import * as AP from '@activity-kit/types';
import { assert } from '@activity-kit/type-utilities';
import {
  CONTENT_TYPE_HEADER,
  ACTIVITYSTREAMS_CONTENT_TYPE,
  ACCEPT_HEADER,
  convertEntityToJson,
  getId,
} from '@activity-kit/utilities';

import { CoreLibrary } from '.';

export async function signAndSendToForeignActorInbox(
  this: CoreLibrary,
  foreignActorInbox: URL,
  actor: AP.Actor,
  activity: AP.Activity,
): Promise<unknown> {
  console.log('SENDING TO...', foreignActorInbox.href);

  const actorId = getId(actor);

  assert.exists(actorId);

  const plainActivity = convertEntityToJson(activity);

  const { dateHeader, digestHeader, signatureHeader } =
    await this.getHttpSignature(
      foreignActorInbox,
      actorId,
      await this.getPrivateKey(actor),
      plainActivity,
    );

  // send
  return await this.fetch(foreignActorInbox.href, {
    method: 'post',
    body: JSON.stringify(plainActivity),
    headers: {
      [CONTENT_TYPE_HEADER]: ACTIVITYSTREAMS_CONTENT_TYPE,
      [ACCEPT_HEADER]: ACTIVITYSTREAMS_CONTENT_TYPE,
      Host: foreignActorInbox.hostname,
      Date: dateHeader,
      Digest: digestHeader,
      Signature: signatureHeader,
    } as Record<string, string>,
  }).catch((error) => {
    console.log(error);
  });
}
