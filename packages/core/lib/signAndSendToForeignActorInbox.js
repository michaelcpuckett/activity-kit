"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.signAndSendToForeignActorInbox = void 0;
const type_utilities_1 = require("@activity-kit/type-utilities");
const utilities_1 = require("@activity-kit/utilities");
async function signAndSendToForeignActorInbox(foreignActorInbox, actor, activity) {
    console.log('SENDING TO...', foreignActorInbox.href);
    const actorId = (0, utilities_1.getId)(actor);
    type_utilities_1.assert.exists(actorId);
    const plainActivity = (0, utilities_1.convertEntityToJson)(activity);
    const { dateHeader, digestHeader, signatureHeader } = await this.getHttpSignature(foreignActorInbox, actorId, await this.getPrivateKey(actor), plainActivity);
    return await this.fetch(foreignActorInbox.href, {
        method: 'post',
        body: JSON.stringify(plainActivity),
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