"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.broadcast = void 0;
const type_utilities_1 = require("@activity-kit/type-utilities");
const utilities_1 = require("@activity-kit/utilities");
const broadcast = async function broadcast(activity, actor) {
    const publicActivity = (0, utilities_1.convertEntityToJson)((0, utilities_1.cleanProps)((0, utilities_1.applyContext)(activity)));
    const recipients = await getRecipientInboxUrls.bind(this)(activity, actor);
    const send = async (recipient) => {
        return await signAndSendToForeignActorInbox.bind(this)(recipient, actor, publicActivity);
    };
    return Object.fromEntries(await Promise.all(recipients.map(send.bind(this))));
};
exports.broadcast = broadcast;
async function signAndSendToForeignActorInbox(foreignActorInbox, actor, plainEntity) {
    const actorId = (0, utilities_1.getId)(actor);
    type_utilities_1.assert.exists(actorId);
    const privateKey = await this.getPrivateKey(actor);
    const { dateHeader, digestHeader, signatureHeader } = await this.getHttpSignature(foreignActorInbox, actorId, privateKey, plainEntity);
    if (!digestHeader || !dateHeader || !signatureHeader) {
        throw new Error('Failed to sign Activity');
    }
    const headers = {
        [utilities_1.CONTENT_TYPE_HEADER]: utilities_1.ACTIVITYSTREAMS_CONTENT_TYPE,
        [utilities_1.ACCEPT_HEADER]: utilities_1.ACTIVITYSTREAMS_CONTENT_TYPE,
        Host: foreignActorInbox.hostname,
        Date: dateHeader,
        Digest: digestHeader,
        Signature: signatureHeader,
    };
    const statusCode = await this.fetch(foreignActorInbox.href, {
        method: 'post',
        body: JSON.stringify(plainEntity),
        headers,
    })
        .then(async (res) => {
        return res.status;
    })
        .catch(() => {
        return 0;
    });
    return [foreignActorInbox.href, statusCode];
}
async function getRecipientInboxUrls(activity, actor) {
    const recipientUrls = await this.getRecipientUrls(activity);
    const extractUrl = async (recipientUrl) => {
        var _a;
        if (recipientUrl.href === ((_a = (0, utilities_1.getId)(actor)) === null || _a === void 0 ? void 0 : _a.href)) {
            return null;
        }
        const foundEntity = await this.fetchEntityById(recipientUrl);
        if (!type_utilities_1.guard.isApActor(foundEntity)) {
            return null;
        }
        if (foundEntity.endpoints) {
            if (type_utilities_1.guard.isUrl(foundEntity.endpoints.sharedInbox)) {
                return foundEntity.endpoints.sharedInbox;
            }
        }
        return (0, utilities_1.getId)(foundEntity.inbox);
    };
    const recipientInboxUrls = await Promise.all(recipientUrls.map(extractUrl));
    const filteredUrls = recipientInboxUrls.filter(type_utilities_1.guard.isUrl);
    return (0, utilities_1.deduplicateUrls)(filteredUrls);
}
//# sourceMappingURL=broadcast.js.map