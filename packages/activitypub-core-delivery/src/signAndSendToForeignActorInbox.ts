import { AP } from 'activitypub-core-types';
import * as crypto from 'crypto';
import {
  CONTENT_TYPE_HEADER,
  ACTIVITYSTREAMS_CONTENT_TYPE,
  ACCEPT_HEADER,
  convertUrlsToStrings,
} from 'activitypub-core-utilities';
import { DeliveryService } from '.';

export async function signAndSendToForeignActorInbox(
  this: DeliveryService,
  foreignActorInbox: URL,
  actor: AP.Actor,
  activity: AP.Activity,
) {
  const privateKey = await this.getPrivateKey(actor);
  const foreignDomain = foreignActorInbox.hostname;
  const foreignPathName = foreignActorInbox.pathname;
  const stringifiedActivity = JSON.stringify(convertUrlsToStrings(activity));

  // sign
  const digestHash = crypto
    .createHash('sha256')
    .update(stringifiedActivity)
    .digest('base64');
  const signer = crypto.createSign('sha256');
  const dateString = new Date().toUTCString();
  const stringToSign = `(request-target): post ${foreignPathName}\nhost: ${foreignDomain}\ndate: ${dateString}\ndigest: SHA-256=${digestHash}`;
  signer.update(stringToSign);
  signer.end();
  const signature = signer.sign(privateKey);
  const signature_b64 = signature.toString('base64');
  const signatureHeader = `keyId="${actor.id.toString()}#main-key",algorithm="rsa-sha256",headers="(request-target) host date digest",signature="${signature_b64}"`;

  if (typeof this.fetch !== 'function') {
    return null;
  }

  console.log(signatureHeader);

  // send
  return await this.fetch(foreignActorInbox.toString(), {
    method: 'post',
    body: stringifiedActivity,
    headers: {
      [CONTENT_TYPE_HEADER]: ACTIVITYSTREAMS_CONTENT_TYPE,
      [ACCEPT_HEADER]: ACTIVITYSTREAMS_CONTENT_TYPE,
      Host: foreignDomain,
      Date: dateString,
      Digest: `SHA-256=${digestHash}`,
      Signature: signatureHeader,
    },
  }).then(async res => {
    console.log(await res.text())
    return res;
  });
}
