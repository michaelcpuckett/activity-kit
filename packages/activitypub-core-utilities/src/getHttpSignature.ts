import { AP } from 'activitypub-core-types';
import * as crypto from 'crypto';

export async function getHttpSignature(
  foreignTarget: URL,
  actorId: URL,
  privateKey: string,
  entity?: AP.Entity,
) {
  const foreignDomain = foreignTarget.hostname;
  const foreignPathName = foreignTarget.pathname;
  const dateString = new Date().toUTCString();
  const signer = crypto.createSign('sha256');

  if (entity) {
    const digestHash = crypto.createHash('sha256').update(JSON.stringify(entity)).digest('base64');
    const digestHeader = `SHA-256=${digestHash}`;
    const stringToSign = `(request-target): post ${foreignPathName}\nhost: ${foreignDomain}\ndate: ${dateString}\ndigest: SHA-256=${digestHash}`;
    signer.update(stringToSign);
    signer.end();
    const signature = signer.sign(privateKey);
    const signature_b64 = signature.toString('base64');
    const signatureHeader = `keyId="${actorId.toString()}#main-key",algorithm="rsa-sha256",headers="(request-target) host date digest",signature="${signature_b64}"`;

    return {
      dateHeader: dateString,
      digestHeader,
      signatureHeader,
    };
  } else {
    const stringToSign = `(request-target): get ${foreignPathName}\nhost: ${foreignDomain}\ndate: ${dateString}`;
    signer.update(stringToSign);
    signer.end();
    const signature = signer.sign(privateKey);
    const signature_b64 = signature.toString('base64');
    const signatureHeader = `keyId="${actorId.toString()}#main-key",algorithm="rsa-sha256",headers="(request-target) host date",signature="${signature_b64}"`;
    
    return {
      dateHeader: dateString,
      signatureHeader,
    };
  }
}
