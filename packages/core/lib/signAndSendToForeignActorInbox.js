"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.signAndSendToForeignActorInbox = void 0;
const utilities_1 = require("@activity-kit/utilities");
async function signAndSendToForeignActorInbox(foreignActorInbox, actor, activity) {
    console.log('SENDING TO...', foreignActorInbox.toString());
    const convertedActivity = (0, utilities_1.convertUrlsToStrings)(activity);
    const { dateHeader, digestHeader, signatureHeader } = await this.getHttpSignature(foreignActorInbox, actor.id, await this.getPrivateKey(actor), convertedActivity);
    return await this.fetch(foreignActorInbox.toString(), {
        method: 'post',
        body: JSON.stringify(convertedActivity),
        headers: {
            [utilities_1.CONTENT_TYPE_HEADER]: utilities_1.ACTIVITYSTREAMS_CONTENT_TYPE,
            [utilities_1.ACCEPT_HEADER]: utilities_1.ACTIVITYSTREAMS_CONTENT_TYPE,
            Host: foreignActorInbox.hostname,
            Date: dateHeader,
            Digest: digestHeader,
            Signature: signatureHeader,
        },
    }).catch((error) => {
        console.log(error);
    });
}
exports.signAndSendToForeignActorInbox = signAndSendToForeignActorInbox;
//# sourceMappingURL=signAndSendToForeignActorInbox.js.map