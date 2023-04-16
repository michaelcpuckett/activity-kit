import { AP } from '@activity-kit/types';
import {
  CONTENT_TYPE_HEADER,
  ACTIVITYSTREAMS_CONTENT_TYPE,
  ACCEPT_HEADER,
  convertUrlsToStrings,
} from '@activity-kit/utilities';
import { Core } from '.';

export async function signAndSendToForeignActorInbox(
  this: Core,
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
