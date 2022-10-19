"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.homeGetHandler = void 0;
const activitypub_core_types_1 = require("activitypub-core-types");
const activitypub_core_utilities_1 = require("activitypub-core-utilities");
const cookie_1 = __importDefault(require("cookie"));
const homeGetHandler = async (req, res, authenticationService, databaseService, setup) => {
    const cookies = cookie_1.default.parse(req.headers.cookie ?? '');
    const actor = await databaseService.getActorByUserId(await authenticationService.getUserIdByToken(cookies.__session ?? ''));
    if (!actor) {
        return {
            redirect: {
                permanent: false,
                destination: '/',
            },
        };
    }
    if (!actor.inbox || !actor.outbox) {
        throw new Error('Bad actor.');
    }
    const [inbox, outbox, followers, following] = await Promise.all([
        databaseService.expandCollection(actor.inbox),
        databaseService.expandCollection(actor.outbox),
        ...(actor.followers
            ? [databaseService.expandCollection(actor.followers)]
            : []),
        ...(actor.following
            ? [databaseService.expandCollection(actor.following)]
            : []),
    ]);
    if (!inbox || !outbox) {
        throw new Error('Bad actor.');
    }
    actor.inbox = inbox;
    actor.outbox = outbox;
    if (followers) {
        actor.followers = followers;
    }
    if (following) {
        actor.following = following;
    }
    const streams = [];
    for (const stream of actor.streams || []) {
        if (stream instanceof URL) {
            const foundStream = await databaseService.findEntityById(stream);
            if (foundStream &&
                (foundStream.type === activitypub_core_types_1.AP.CollectionTypes.COLLECTION ||
                    foundStream.type === activitypub_core_types_1.AP.CollectionTypes.ORDERED_COLLECTION ||
                    (Array.isArray(foundStream.type) && (foundStream.type.includes(activitypub_core_types_1.AP.CollectionTypes.COLLECTION) ||
                        foundStream.type.includes(activitypub_core_types_1.AP.CollectionTypes.ORDERED_COLLECTION))))) {
                const expandedStream = await databaseService.expandCollection(foundStream);
                if (expandedStream) {
                    streams.push(expandedStream);
                }
            }
        }
        else {
            const expandedStream = await databaseService.expandCollection(stream);
            if (expandedStream) {
                streams.push(expandedStream);
            }
        }
    }
    if (actor.streams) {
        actor.streams = streams;
    }
    let data = {
        props: {
            actor,
        },
    };
    if (setup) {
        data = await setup(data, databaseService);
    }
    return {
        props: {
            actor: (0, activitypub_core_utilities_1.convertUrlsToStrings)(data.props.actor),
        },
    };
};
exports.homeGetHandler = homeGetHandler;
//# sourceMappingURL=index.js.map