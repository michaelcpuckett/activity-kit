"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHttpSignature = void 0;
async function getHttpSignature(foreignTarget, actorId, privateKey, entity) {
    if (!(this.params.subtle instanceof SubtleCrypto)) {
        throw new Error('Bad crypto.');
    }
    const foreignDomain = foreignTarget.hostname;
    const foreignPathName = foreignTarget.pathname;
    const dateString = new Date().toUTCString();
    const encoder = new TextEncoder();
    const privateKeyBuffer = new TextEncoder().encode(privateKey);
    const importedKey = await this.params.subtle.importKey('pkcs8', privateKeyBuffer, { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' }, false, ['sign']);
    const signer = await this.params.subtle.sign({ name: 'RSASSA-PKCS1-v1_5' }, importedKey, encoder.encode(dateString + foreignDomain + foreignPathName));
    if (entity) {
        const digestHash = await this.params.subtle.digest({ name: 'SHA-256' }, encoder.encode(JSON.stringify(entity)));
        const digestHashString = btoa(String.fromCharCode(...new Uint8Array(digestHash)));
        const digestHeader = `SHA-256=${digestHashString}`;
        const signature_b64 = btoa(String.fromCharCode(...new Uint8Array(signer)));
        const signatureHeader = `keyId="${actorId.toString()}#main-key",algorithm="rsa-sha256",headers="(request-target) host date digest",signature="${signature_b64}"`;
        return {
            dateHeader: dateString,
            digestHeader,
            signatureHeader,
        };
    }
    else {
        const signature_b64 = btoa(String.fromCharCode(...new Uint8Array(signer)));
        const signatureHeader = `keyId="${actorId.toString()}#main-key",algorithm="rsa-sha256",headers="(request-target) host date",signature="${signature_b64}"`;
        return {
            dateHeader: dateString,
            signatureHeader,
        };
    }
}
exports.getHttpSignature = getHttpSignature;
//# sourceMappingURL=getHttpSignature.js.map