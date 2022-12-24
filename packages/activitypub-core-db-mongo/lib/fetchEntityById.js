"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchEntityById = void 0;
const activitypub_core_utilities_1 = require("activitypub-core-utilities");
async function fetchEntityById(id) {
    if (typeof this.fetch !== 'function') {
        return null;
    }
    const foundEntity = await this.findOne('foreign-entity', {
        _id: id.toString(),
    });
    if (foundEntity) {
        return (0, activitypub_core_utilities_1.compressEntity)((0, activitypub_core_utilities_1.convertStringsToUrls)(foundEntity));
    }
    const actor = await this.findOne('entity', { preferredUsername: 'bot' });
    const { dateHeader, signatureHeader } = await (0, activitypub_core_utilities_1.getHttpSignature)(id, actor.id, await this.getPrivateKey(actor));
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 1250);
    const fetchedEntity = await this.fetch(id.toString(), {
        signal: controller.signal,
        headers: {
            [activitypub_core_utilities_1.ACCEPT_HEADER]: activitypub_core_utilities_1.ACTIVITYSTREAMS_CONTENT_TYPE,
            date: dateHeader,
            signature: signatureHeader
        },
    })
        .then(async (response) => {
        clearTimeout(timeout);
        if (response.status === 200) {
            return await response.json();
        }
        else if (response.status === 410) {
            const data = await response.json();
            if ('@context' in data) {
                console.log('Likely a Tombstone?');
                return data;
            }
            else {
                throw new Error('Not found, but not a tombstone.');
            }
        }
        else {
            console.log('Found but not 200 or 404.', response.status);
            throw new Error(`Unexpected status code ${response.status}`);
        }
    })
        .catch((error) => {
        clearTimeout(timeout);
        console.log(String(error));
        return null;
    });
    await this.saveEntity(fetchedEntity);
    return (0, activitypub_core_utilities_1.compressEntity)((0, activitypub_core_utilities_1.convertStringsToUrls)(fetchedEntity));
}
exports.fetchEntityById = fetchEntityById;
//# sourceMappingURL=fetchEntityById.js.map