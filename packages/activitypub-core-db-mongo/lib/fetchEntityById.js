"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchEntityById = void 0;
const activitypub_core_utilities_1 = require("activitypub-core-utilities");
async function fetchEntityById(id) {
    if (typeof this.fetch !== 'function') {
        return null;
    }
    const actor = await this.findOne('entity', { preferredUsername: 'bot' });
    const { dateHeader, signatureHeader } = await (0, activitypub_core_utilities_1.getHttpSignature)(id, actor.id, await this.getPrivateKey(actor));
    const fetchedEntity = await this.fetch(id.toString(), {
        headers: {
            [activitypub_core_utilities_1.ACCEPT_HEADER]: activitypub_core_utilities_1.ACTIVITYSTREAMS_CONTENT_TYPE,
            date: dateHeader,
            signature: signatureHeader
        },
    })
        .then(async (response) => {
        return await response.json();
    })
        .catch((error) => {
        console.log(String(error));
        return null;
    });
    return (0, activitypub_core_utilities_1.compressEntity)((0, activitypub_core_utilities_1.convertStringsToUrls)(fetchedEntity));
}
exports.fetchEntityById = fetchEntityById;
//# sourceMappingURL=fetchEntityById.js.map