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
exports.queryById = void 0;
const AP = __importStar(require("@activity-kit/types"));
const type_utilities_1 = require("@activity-kit/type-utilities");
const utilities_1 = require("@activity-kit/utilities");
const getPrivateKey_1 = require("./util/getPrivateKey");
/**
 * Finds an Entity by its ID, which is a URL.
 *
 * If the Entity is not found locally it will be fetched from the URL.
 *
 * If the Entity is a Tombstone, it will be returned.
 *
 * If the Entity is not a Tombstone, it will be saved to the database.
 *
 * If the Entity is not found at the URL, it will be saved as a Tombstone.
 *
 * @returns The Entity, which may be a Tombstone, or null if not found.
 */
async function queryById(id) {
    if ((0, utilities_1.isLocal)(id)) {
        return await this.findEntityById(id);
    }
    const fetchedEntity = await fetchEntityByUrl.bind(this)(id);
    if (!fetchedEntity ||
        type_utilities_1.guard.isApType(fetchedEntity, AP.ExtendedObjectTypes.TOMBSTONE)) {
        const foundEntity = await this.findEntityById(id);
        if (foundEntity) {
            return foundEntity;
        }
    }
    return fetchedEntity;
}
exports.queryById = queryById;
/**
 * Fetch an Entity by its URL.
 *
 * @returns The fetched Entity or null if the URL does not represent an Entity.
 */
async function fetchEntityByUrl(id) {
    const isJsonLdContentType = await getIsJsonLdContentType.bind(this)(id);
    if (!isJsonLdContentType) {
        return null;
    }
    const botActor = await getBotActor.bind(this)();
    type_utilities_1.assert.exists(botActor);
    const botActorId = (0, utilities_1.getId)(botActor);
    type_utilities_1.assert.exists(botActorId);
    const privateKey = await getPrivateKey_1.getPrivateKey.bind(this)(botActor);
    type_utilities_1.assert.exists(privateKey);
    const { dateHeader, signatureHeader } = await this.getHttpSignature(id, botActorId, privateKey);
    const headers = {
        date: dateHeader,
        signature: signatureHeader,
    };
    const fetchedJson = await fetchJsonByUrl.bind(this)(id, headers);
    if (!fetchedJson) {
        return null;
    }
    const convertedEntity = (0, utilities_1.convertJsonToEntity)(fetchedJson);
    if (!convertedEntity) {
        return null;
    }
    const entity = (0, utilities_1.compressEntity)(convertedEntity);
    if (!entity) {
        return null;
    }
    await this.saveEntity(entity);
    return entity;
}
/**
 * Fetch a JSON object from a URL using the provided headers.
 *
 * @returns The JSON object, or null if not found.
 */
async function fetchJsonByUrl(url, headers) {
    const config = {
        headers: {
            ...headers,
            [utilities_1.ACCEPT_HEADER]: utilities_1.ACTIVITYSTREAMS_CONTENT_TYPE,
        },
    };
    return await this.fetch(url.href, config)
        .then(handleResponse)
        .catch(handleError);
}
/**
 * Handle a response from a fetch request.
 *
 * @returns The JSON object, or null if not found.
 */
async function handleResponse(response) {
    var _a;
    const data = (_a = type_utilities_1.cast.isPlainObject(await response.json())) !== null && _a !== void 0 ? _a : null;
    if (!data) {
        return null;
    }
    if (response.status === 200) {
        return data;
    }
    if (response.status === 400 || response.status === 410) {
        if ('@context' in data) {
            // Likely a tombstone
            return data;
        }
        else {
            // Return a tombstone
            return {
                '@context': utilities_1.ACTIVITYSTREAMS_CONTEXT,
                type: AP.ExtendedObjectTypes.TOMBSTONE,
                id: response.url,
                url: response.url,
            };
        }
    }
    if (response.status >= 500) {
        return null;
    }
    return data;
}
/**
 * Handle an error from a fetch request.
 *
 * Allows the application to continue if a fetch request fails.
 *
 * @returns null
 */
async function handleError(error) {
    console.log(`${error}`);
    return null;
}
/**
 * Get the content type of a URL.
 *
 * A HEAD request is used to determine if a URL is a JSON-LD object.
 *
 * @returns The content type, or null if not found.
 */
async function getContentType(url) {
    var _a;
    const response = await this.fetch(url.toString(), {
        method: 'HEAD',
        headers: {
            [utilities_1.ACCEPT_HEADER]: utilities_1.ACTIVITYSTREAMS_CONTENT_TYPE,
        },
    });
    return (_a = response.headers.get(utilities_1.CONTENT_TYPE_HEADER)) !== null && _a !== void 0 ? _a : null;
}
/**
 * Check if a URL returns a content type that represent a JSON-LD object.
 *
 * @returns True if the URL returns a JSON-LD content type.
 */
async function getIsJsonLdContentType(url) {
    const contentType = await getContentType.bind(this)(url);
    if (!contentType) {
        return false;
    }
    return (contentType.includes(utilities_1.ACTIVITYSTREAMS_CONTENT_TYPE) ||
        contentType.includes(utilities_1.LINKED_DATA_CONTENT_TYPE) ||
        contentType.includes(utilities_1.JSON_CONTENT_TYPE));
}
/**
 * Get the server Actor.
 *
 * Mastodon in secure mode requires that all requests include a signature of the
 * Actor that is making the request. We use the server Actor.
 *
 * @returns The server Actor, or null if not found.
 */
async function getBotActor() {
    var _a;
    const botActor = await this.findOne('entity', {
        preferredUsername: utilities_1.SERVER_ACTOR_USERNAME,
    });
    return (_a = type_utilities_1.cast.isApActor(botActor)) !== null && _a !== void 0 ? _a : null;
}
//# sourceMappingURL=queryById.js.map