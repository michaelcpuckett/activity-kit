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
exports.fetchEntityById = void 0;
const AP = __importStar(require("@activity-kit/types"));
const type_utilities_1 = require("@activity-kit/type-utilities");
const utilities_1 = require("@activity-kit/utilities");
const fetchEntityById = async function fetchEntityById(id) {
    const isJsonLdContentType = await getIsJsonLdContentType.bind(this)(id);
    if (!isJsonLdContentType) {
        return null;
    }
    const botActor = await getBotActor.bind(this)();
    type_utilities_1.assert.exists(botActor);
    const botActorId = (0, utilities_1.getId)(botActor);
    type_utilities_1.assert.exists(botActorId);
    const { dateHeader, signatureHeader } = await this.getHttpSignature(id, botActorId, await this.getPrivateKey(botActor));
    const headers = {
        date: dateHeader,
        signature: signatureHeader,
    };
    const fetchedJson = await fetchJsonByUrl.bind(this)(id, headers);
    if (fetchedJson) {
        const convertedEntity = (0, utilities_1.convertJsonToEntity)(fetchedJson);
        if (convertedEntity) {
            const entity = (0, utilities_1.compressEntity)(convertedEntity);
            if (entity) {
                await this.saveEntity(entity);
                return entity;
            }
        }
    }
    return null;
};
exports.fetchEntityById = fetchEntityById;
async function fetchJsonByUrl(url, headers) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 1250);
    const config = {
        signal: controller.signal,
        headers: {
            ...headers,
            [utilities_1.ACCEPT_HEADER]: utilities_1.ACTIVITYSTREAMS_CONTENT_TYPE,
        },
    };
    async function handleResponse(response) {
        clearTimeout(timeout);
        const data = await response.json();
        if (response.status === 200) {
            return data;
        }
        if (response.status === 400 || response.status === 410) {
            if ('@context' in data) {
                return data;
            }
            else {
                return {
                    '@context': utilities_1.ACTIVITYSTREAMS_CONTEXT,
                    type: AP.ExtendedObjectTypes.TOMBSTONE,
                    id: url.href,
                    url: url.href,
                };
            }
        }
        if (response.status >= 500) {
            console.log('Server error.', response.status, url.href);
            return null;
        }
        console.log('Unexpected status code.', response.status, url.href);
        return data;
    }
    async function handleError(error) {
        clearTimeout(timeout);
        console.log(`${error}`);
        return null;
    }
    return await this.fetch(url.href, config)
        .then(handleResponse)
        .catch(handleError);
}
async function getContentType(url) {
    const { headers } = await this.fetch(url.toString(), { method: 'HEAD' });
    return headers.get('Content-Type');
}
async function getIsJsonLdContentType(url) {
    const contentType = await getContentType.bind(this)(url);
    if (!contentType) {
        return false;
    }
    return (contentType.includes(utilities_1.ACTIVITYSTREAMS_CONTENT_TYPE) ||
        contentType.includes(utilities_1.LINKED_DATA_CONTENT_TYPE) ||
        contentType.includes(utilities_1.JSON_CONTENT_TYPE));
}
async function getBotActor() {
    var _a;
    const botActor = await this.findOne('entity', {
        preferredUsername: utilities_1.SERVER_ACTOR_USERNAME,
    });
    return (_a = type_utilities_1.cast.isApActor(botActor)) !== null && _a !== void 0 ? _a : null;
}
//# sourceMappingURL=fetchEntityById.js.map