"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchEntityById = void 0;
const type_utilities_1 = require("@activity-kit/type-utilities");
const utilities_1 = require("@activity-kit/utilities");
async function fetchEntityById(id) {
    const getContentType = async (url) => {
        const response = await this.fetch(url.toString(), { method: 'HEAD' });
        return response.headers.get('Content-Type');
    };
    const isJsonLdContentType = async (url) => {
        const contentType = await getContentType(url);
        if (!contentType) {
            return false;
        }
        return (contentType.includes(utilities_1.ACTIVITYSTREAMS_CONTENT_TYPE) ||
            contentType.includes(utilities_1.LINKED_DATA_CONTENT_TYPE) ||
            contentType.includes(utilities_1.JSON_CONTENT_TYPE));
    };
    if (!(await isJsonLdContentType(id))) {
        return null;
    }
    const actor = await this.findOne('entity', {
        preferredUsername: 'bot',
    });
    type_utilities_1.assert.isApActor(actor);
    const actorId = (0, utilities_1.getId)(actor);
    type_utilities_1.assert.exists(actorId);
    const { dateHeader, signatureHeader } = await this.getHttpSignature(id, actorId, await this.getPrivateKey(actor));
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 1250);
    const fetchedEntity = await this.fetch(id.toString(), {
        signal: controller.signal,
        headers: {
            [utilities_1.ACCEPT_HEADER]: utilities_1.ACTIVITYSTREAMS_CONTENT_TYPE,
            date: dateHeader,
            signature: signatureHeader,
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
            console.log('Found but not 200 or 404.', response.status, id.toString());
            throw new Error(`Unexpected status code ${response.status}`);
        }
    })
        .catch((error) => {
        clearTimeout(timeout);
        console.log(String(error));
        return null;
    });
    if (fetchedEntity) {
        const convertedEntity = (0, utilities_1.convertJsonToEntity)(fetchedEntity);
        if (convertedEntity) {
            const entity = (0, utilities_1.compressEntity)(convertedEntity);
            if (entity) {
                await this.saveEntity(entity);
                return entity;
            }
        }
    }
    return null;
}
exports.fetchEntityById = fetchEntityById;
//# sourceMappingURL=fetchEntityById.js.map