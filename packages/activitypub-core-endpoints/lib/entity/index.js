"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.entityGetHandler = void 0;
const activitypub_core_utilities_1 = require("activitypub-core-utilities");
const activitypub_core_utilities_2 = require("activitypub-core-utilities");
const activitypub_core_utilities_3 = require("activitypub-core-utilities");
const activitypub_core_utilities_4 = require("activitypub-core-utilities");
const cookie_1 = __importDefault(require("cookie"));
async function entityGetHandler(request, response, authenticationService, databaseService, providedUrl) {
    if (!response) {
        throw new Error('Bad request.');
    }
    const handleBadRequest = () => {
        response.statusCode = 500;
        response.write('Bad request');
        response.end();
        return {
            props: {},
        };
    };
    const handleNotFound = () => {
        response.statusCode = 400;
        response.write('Not found');
        response.end();
        return {
            props: {},
        };
    };
    if (!request) {
        return handleBadRequest();
    }
    const cookies = cookie_1.default.parse(request.headers.cookie ?? '');
    const authorizedActor = await databaseService.getActorByUserId(await authenticationService.getUserIdByToken(cookies.__session ?? ''));
    const url = providedUrl ?? new URL(`${activitypub_core_utilities_1.LOCAL_DOMAIN}${request.url}`);
    const foundEntity = await databaseService.queryById(url);
    if (!foundEntity) {
        return handleNotFound();
    }
    const entity = (0, activitypub_core_utilities_2.getTypedEntity)(foundEntity);
    if (!entity) {
        return handleNotFound();
    }
    if ('publicKey' in entity && entity.publicKey) {
        entity.publicKey = entity.publicKey;
    }
    if (request.headers.accept?.includes(activitypub_core_utilities_1.ACTIVITYSTREAMS_CONTENT_TYPE) ||
        request.headers.accept?.includes(activitypub_core_utilities_1.LINKED_DATA_CONTENT_TYPE) ||
        request.headers.accept?.includes(activitypub_core_utilities_1.JSON_CONTENT_TYPE)) {
        response.setHeader(activitypub_core_utilities_1.CONTENT_TYPE_HEADER, activitypub_core_utilities_1.ACTIVITYSTREAMS_CONTENT_TYPE);
        response.statusCode = 200;
        response.write((0, activitypub_core_utilities_4.stringify)(entity));
        response.end();
        return {
            props: {},
        };
    }
    return {
        props: {
            entity: (0, activitypub_core_utilities_3.convertUrlsToStrings)(entity),
            actor: (0, activitypub_core_utilities_3.convertUrlsToStrings)(authorizedActor),
        },
    };
}
exports.entityGetHandler = entityGetHandler;
//# sourceMappingURL=index.js.map