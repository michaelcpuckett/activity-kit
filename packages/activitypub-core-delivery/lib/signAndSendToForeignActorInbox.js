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
exports.signAndSendToForeignActorInbox = void 0;
const crypto = __importStar(require("crypto"));
const activitypub_core_utilities_1 = require("activitypub-core-utilities");
async function signAndSendToForeignActorInbox(foreignActorInbox, actor, activity) {
    const privateKey = await this.getPrivateKey(actor);
    const foreignDomain = foreignActorInbox.hostname;
    const foreignPathName = foreignActorInbox.pathname;
    const stringifiedActivity = JSON.stringify((0, activitypub_core_utilities_1.convertUrlsToStrings)(activity));
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
    console.log(JSON.parse(stringifiedActivity));
    return await this.fetch(foreignActorInbox.toString(), {
        method: 'post',
        body: stringifiedActivity,
        headers: {
            [activitypub_core_utilities_1.CONTENT_TYPE_HEADER]: activitypub_core_utilities_1.ACTIVITYSTREAMS_CONTENT_TYPE,
            [activitypub_core_utilities_1.ACCEPT_HEADER]: activitypub_core_utilities_1.ACTIVITYSTREAMS_CONTENT_TYPE,
            Host: foreignDomain,
            Date: dateString,
            Digest: `SHA-256=${digestHash}`,
            Signature: signatureHeader,
        },
    }).then(res => {
        console.log(res.text());
        return res;
    });
}
exports.signAndSendToForeignActorInbox = signAndSendToForeignActorInbox;
//# sourceMappingURL=signAndSendToForeignActorInbox.js.map