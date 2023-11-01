"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.broadcast = void 0;
const type_utilities_1 = require("@activity-kit/type-utilities");
const utilities_1 = require("@activity-kit/utilities");
const getPrivateKey_1 = require("./util/getPrivateKey");
/**
 * Send an Activity to all of its recipients on behalf of an Actor.
 *
 * @returns A record of each URL and the HTTP status code of the response.
 */
async function broadcast(activity, actor) {
    const activityWithContext = (0, utilities_1.applyContext)(activity);
    const cleanedActivity = (0, utilities_1.cleanProps)(activityWithContext);
    const plainEntity = (0, utilities_1.convertEntityToJson)(cleanedActivity);
    const recipientInboxUrls = await getRecipientInboxUrls.bind(this)(activity, actor);
    const sendToRecipient = (recipientInboxUrl) => signAndSendToInboxUrl.call(this, recipientInboxUrl, actor, plainEntity);
    const promises = recipientInboxUrls.map(sendToRecipient);
    const resultEntries = await Promise.all(promises);
    return Object.fromEntries(resultEntries);
}
exports.broadcast = broadcast;
/**
 * Send to a single recipient on behalf of an Actor.
 *
 * @returns A tuple of the recipient's inbox URL and the HTTP status code of the
 * response.
 */
async function signAndSendToInboxUrl(foreignActorInbox, actor, plainEntity) {
    const headers = await getHeaders.bind(this)(actor, foreignActorInbox, plainEntity);
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
/**
 * Get the headers for an Activity.
 * @returns A record of headers.
 */
async function getHeaders(actor, foreignActorInbox, plainEntity) {
    const actorId = (0, utilities_1.getId)(actor);
    type_utilities_1.assert.exists(actorId);
    const privateKey = await getPrivateKey_1.getPrivateKey.bind(this)(actor);
    const { dateHeader, digestHeader, signatureHeader } = await this.getHttpSignature(foreignActorInbox, actorId, privateKey, plainEntity);
    if (!digestHeader || !dateHeader || !signatureHeader) {
        throw new Error('Failed to sign Activity');
    }
    return {
        [utilities_1.CONTENT_TYPE_HEADER]: utilities_1.ACTIVITYSTREAMS_CONTENT_TYPE,
        [utilities_1.ACCEPT_HEADER]: utilities_1.ACTIVITYSTREAMS_CONTENT_TYPE,
        Host: foreignActorInbox.hostname,
        Date: dateHeader,
        Digest: digestHeader,
        Signature: signatureHeader,
    };
}
/**
 * Get the inbox URLs of all recipients of an Activity.
 *
 * @returns An array of inbox URLs.
 */
async function getRecipientInboxUrls(activity, actor) {
    const recipientUrls = await this.getRecipientUrls(activity);
    const extractUrl = async (recipientUrl) => {
        var _a;
        if (recipientUrl.href === ((_a = (0, utilities_1.getId)(actor)) === null || _a === void 0 ? void 0 : _a.href)) {
            return null;
        }
        const foundEntity = await this.queryById(recipientUrl);
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