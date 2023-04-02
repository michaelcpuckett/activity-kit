"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHttpSignature = void 0;
const crypto = __importStar(require("crypto"));
async function getHttpSignature(foreignTarget, actorId, privateKey, entity) {
    const foreignDomain = foreignTarget.hostname;
    const foreignPathName = foreignTarget.pathname;
    const dateString = new Date().toUTCString();
    const signer = crypto.createSign('sha256');
    if (entity) {
        const digestHash = crypto
            .createHash('sha256')
            .update(JSON.stringify(entity))
            .digest('base64');
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
    }
    else {
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
exports.getHttpSignature = getHttpSignature;
//# sourceMappingURL=getHttpSignature.js.map