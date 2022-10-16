import * as crypto from 'crypto';

export async function generateKeyPair(): Promise<{
  privateKey: string;
  publicKey: string;
}> {
  const {
    publicKey,
    privateKey,
  } = await crypto.subtle.generateKey({
    name: 'RSASSA-PKCS1-v1_5',
    modulusLength: 2048, // 4096
    hash: {name: 'SHA-256'},
    publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
  }, true, ['encrypt', 'decrypt', 'sign', 'verify']);

  return {
    publicKey: arrayBufferToString(await crypto.subtle.exportKey('pkcs8', publicKey)),
    privateKey: arrayBufferToString(await crypto.subtle.exportKey('pkcs8', privateKey)),
  };
}

function arrayBufferToString(buffer: ArrayBuffer): string {
  var bufView = new Uint16Array(buffer);
  var length = bufView.length;
  var result = '';
  var addition = Math.pow(2,16)-1;

  for(var i = 0;i<length;i+=addition){
      if(i + addition > length){
          addition = length - i;
      }
      result += String.fromCharCode.apply(null, bufView.subarray(i,i+addition));
  }

  return result;
}