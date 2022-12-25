import { AP } from 'activitypub-core-types';
import {
  CONTENT_TYPE_HEADER,
  ACTIVITYSTREAMS_CONTENT_TYPE,
  ACCEPT_HEADER,
  convertUrlsToStrings,
  getHttpSignature,
} from 'activitypub-core-utilities';
import { DeliveryAdapter } from '.';

export async function signAndSendToForeignActorInbox(
  this: DeliveryAdapter,
  foreignActorInbox: URL,
  actor: AP.Actor,
  activity: AP.Activity,
) {
  console.log('SENDING TO...', foreignActorInbox.toString());

  const convertedActivity = convertUrlsToStrings(activity);
  const { dateHeader, digestHeader, signatureHeader } = await getHttpSignature(
    foreignActorInbox,
    actor.id,
    await this.adapters.db.getPrivateKey(actor),
    convertedActivity,
  );

  // send
  return await this.adapters
    .fetch(foreignActorInbox.toString(), {
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
    })
    .then(async (res) => {
      console.log(await res.text(), res.statusCode);
      return res;
    })
    .catch(error => {
      console.log(error);
    });
}
