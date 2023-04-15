import { AP } from 'activitypub-core-types';
import {
  CONTENT_TYPE_HEADER,
  ACTIVITYSTREAMS_CONTENT_TYPE,
  ACCEPT_HEADER,
  convertUrlsToStrings,
} from 'activitypub-core-utilities';
import { CoreLibrary } from '.';

export async function signAndSendToForeignActorInbox(
  this: CoreLibrary,
  foreignActorInbox: URL,
  actor: AP.Actor,
  activity: AP.Activity,
): Promise<unknown> {
  console.log('SENDING TO...', foreignActorInbox.toString());

  const convertedActivity = convertUrlsToStrings(activity);
  const { dateHeader, digestHeader, signatureHeader } =
    await this.getHttpSignature(
      foreignActorInbox,
      actor.id,
      await this.getPrivateKey(actor),
      convertedActivity,
    );

  // send
  return await this.fetch(foreignActorInbox.toString(), {
    method: 'post',
    body: JSON.stringify(convertedActivity),
    headers: {
      [CONTENT_TYPE_HEADER]: ACTIVITYSTREAMS_CONTENT_TYPE,
      [ACCEPT_HEADER]: ACTIVITYSTREAMS_CONTENT_TYPE,
      Host: foreignActorInbox.hostname,
      Date: dateHeader,
      Digest: digestHeader,
      Signature: signatureHeader,
    },
  }).catch((error) => {
    console.log(error);
  });
}
